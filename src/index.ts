import { PropertyInputDTO } from "./models/property.model";
import { FeasibilityDecision } from "./models/decision.model";
import { FinalStatus } from "./enums/final-status.enum";
import { ArchetypeEngine } from "./core/engines/archetype.engine";
import { ClimateEngine } from "./core/engines/climate.engine";
import { MoistureVentilationEngine } from "./core/engines/moisture-ventilation.engine";
import { SequencingEngine } from "./core/engines/sequencing.engine";
import { EpcUpliftEngine } from "./core/engines/epc-uplift.engine";
import { DecisionEngine } from "./core/engines/decision.engine";

export class RetrofitFeasibilityEngine {

  /**
   * Main entrypoint for evaluating a property for retrofit feasibility.
   * Produces a structured FeasibilityDecision.
   */
  public static evaluateProperty(input: PropertyInputDTO): FeasibilityDecision {
    
    // 1. Archetype Engine
    const archetype = ArchetypeEngine.classify(input);

    if (archetype.id === "unknown") {
      return {
        final_status: FinalStatus.RED,
        achievable_epc_band: input.epc_band_current,
        constraints: ["Outside MVP Scope - Unknown Archetype"],
        required_preconditions: [],
        sequencing_order: [],
        escalation_flags: ["Property does not match any known standard archetype"],
        assumptions_log: [],
        uncertainty_score: 100
      };
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
    const achievableEpc = EpcUpliftEngine.calculateUplift(
      input.epc_band_current,
      measurePathwayIds
    );

    // 5. Output via Decision Engine
    return DecisionEngine.evaluate(
      input,
      sequencing.blocked,
      achievableEpc,
      sequencing.pathway,
      sequencing.required_preconditions
    );
  }
}
