import { PropertyInputDTO } from "./models/property.model";
import { FeasibilityDecision } from "./models/decision.model";
import { FinalStatus } from "./enums/final-status.enum";
import { ArchetypeEngine } from "./core/engines/archetype.engine";
import { ClimateEngine } from "./core/engines/climate.engine";
import { MoistureVentilationEngine } from "./core/engines/moisture-ventilation.engine";
import { SequencingEngine } from "./core/engines/sequencing.engine";
import { EpcUpliftEngine } from "./core/engines/epc-uplift.engine";
import { DecisionEngine } from "./core/engines/decision.engine";
import { MEASURE_LIBRARY } from "./core/config/retrofit-measures";

export class RetrofitFeasibilityEngine {

  /**
   * Main entrypoint for evaluating a property for retrofit feasibility.
   * Produces a structured FeasibilityDecision.
   */
  public static evaluateProperty(input: PropertyInputDTO): FeasibilityDecision {
    
    // 1. Archetype Engine
    const archetype = ArchetypeEngine.classify(input);

    if (archetype.id === "UNKNOWN") {
      // In a strict production system we might exit early.
      // For this demo, we allow the UNKNOWN archetype to pass to the rules engines
      // with all eligible measures so the safety and sequencing logic can be demonstrated.
    }

    // 2. Climate Engine
    const climate = ClimateEngine.evaluate(input.postcode);

    // 3. Moisture & Ventilation Safety Engine
    const safetyContext = {
      wall_type: input.wall_description?.toUpperCase() || "UNKNOWN",
      climate_exposure: climate.climate_exposure,
      damp_history: input.damp_history,
      ventilation_type: input.ventilation_type?.toUpperCase() || "UNKNOWN",
      airtightness_improvement: true, 
      ventilation_upgrade_planned: false,
      ventilation_quality: "UNKNOWN"
    };

    const safetyAssessment = MoistureVentilationEngine.evaluate({ ...safetyContext, ...input });

    // 3. Sequencing Rules Engine
    const sequencing = SequencingEngine.generatePathway(
      archetype.eligible_measures,
      safetyAssessment,
      input
    );

    // Filter out actions (like Damp investigation) to get strictly measures for EPC uplift
    const measurePathwayIds = sequencing.pathway.filter(item => 
      !safetyAssessment.required_actions.includes(item) &&
      !sequencing.required_preconditions.includes(item)
    );

    // 4. EPC Uplift Pathway Engine
    const fabricMeasures = measurePathwayIds.filter(id => MEASURE_LIBRARY.find((m: any) => m.id === id)?.category === "Fabric");
    const heatingMeasures = measurePathwayIds.filter(id => {
      const cat = MEASURE_LIBRARY.find((m: any) => m.id === id)?.category;
      return cat === "Services" || cat === "Heating";
    });
    const renewableMeasures = measurePathwayIds.filter(id => MEASURE_LIBRARY.find((m: any) => m.id === id)?.category === "Renewables");

    const epcAfterFabric = EpcUpliftEngine.calculateUplift(input.epc_band_current, fabricMeasures);
    const epcAfterHeating = EpcUpliftEngine.calculateUplift(input.epc_band_current, [...fabricMeasures, ...heatingMeasures]);
    const achievableEpc = EpcUpliftEngine.calculateUplift(input.epc_band_current, measurePathwayIds);

    const epcProjection = {
      current: input.epc_band_current,
      after_fabric: epcAfterFabric,
      after_heating: epcAfterHeating,
      after_renewables: achievableEpc
    };

    // 5. Output via Decision Engine
    return DecisionEngine.evaluate(
      input,
      sequencing.blocked,
      achievableEpc,
      sequencing.pathway,
      sequencing.required_preconditions,
      {
        safetyAssessment,
        epcProjection,
        archetypeId: archetype.id,
        climateRegion: climate.climate_exposure
      }
    );
  }
}
