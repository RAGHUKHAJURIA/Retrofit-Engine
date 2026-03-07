import { SequencingStage } from "../../enums/sequencing-stage.enum";
import { RetrofitMeasure } from "../../models/retrofit-measure.model";
import { SafetyAssessment } from "../../models/safety.model";
import { PropertyInputDTO } from "../../models/property.model";
import { MEASURE_LIBRARY } from "../config/retrofit-measures";

export class SequencingEngine {
  
  /**
   * Applies strict sequencing and blocks measures based on safety assessment and sequencing rules.
   * 
   * @param eligibleMeasureIds The measures deemed eligible by the archetype
   * @param safety The safety assessment computed previously
   * @param input Property data
   * @returns Ordered list of measures and list of blocked messages
   */
  public static generatePathway(
    eligibleMeasureIds: string[],
    safety: SafetyAssessment,
    input: PropertyInputDTO
  ): { pathway: string[], blocked: { measure: string, reason: string }[], required_preconditions: string[] } {
    
    const blocked: { measure: string, reason: string }[] = [];
    const pathwayMeasures: RetrofitMeasure[] = [];
    const required_preconditions = [...safety.required_actions];

    // Filter measure objects from the library
    const measures = MEASURE_LIBRARY.filter(m => eligibleMeasureIds.includes(m.id));

    for (const measure of measures) {
      let isBlocked = false;

      // 1. Safety Blocks
      if (safety.blocked_measures.includes(measure.id)) {
        blocked.push({
          measure: measure.id,
          reason: `Blocked by safety constraint`
        });
        isBlocked = true;
      }

      // 2. Internal Wall Insulation specific sequencing rule
      if (!isBlocked && measure.id === "internal wall insulation") {
        if (input.wall_description.toLowerCase().includes("solid") && safety.moisture_risk !== "LOW") {
          blocked.push({
            measure: measure.id,
            reason: `Solid wall + Moisture risk ${safety.moisture_risk} -> Block IWI until damp resolved`
          });
          isBlocked = true;
          if (!required_preconditions.includes("Damp investigation required")) {
            required_preconditions.push("Damp investigation required");
          }
        }
      }

      // 3. Airtightness & Ventilation sequencing rule
      if (!isBlocked && measure.id === "airtightness improvement") {
        if (safety.ventilation_status === "INADEQUATE" || !eligibleMeasureIds.includes("extract ventilation upgrade")) {
          blocked.push({
            measure: measure.id,
            reason: `Ventilation upgrade required first`
          });
          isBlocked = true;
        }
      }

      // 4. Heat Pump Dependency rule
      if (!isBlocked && measure.id === "air source heat pump") {
        const wallInsulationPending = eligibleMeasureIds.some(m => m.includes("wall insulation"));
        const blockedWallInsulation = blocked.some(b => b.measure.includes("wall insulation"));
        
        if (wallInsulationPending || blockedWallInsulation) {
          blocked.push({
            measure: "Heat pump installation",
            reason: `Fabric performance below minimum threshold`
          });
          isBlocked = true;
          if (!required_preconditions.includes("Fabric upgrades required before electrification.")) {
            required_preconditions.push("Fabric upgrades required before electrification.");
          }
        }
      }

      if (!isBlocked) {
        pathwayMeasures.push(measure);
      }
    }

    // Sort to enforce deterministic strict hierarchy:
    // SAFETY (1) -> MOISTURE (2) -> VENTILATION (3) -> FABRIC (4) -> HEATING (5) -> RENEWABLES (6)
    pathwayMeasures.sort((a, b) => a.sequencing_stage - b.sequencing_stage);

    const pathway = [];

    // Safety and moisture actions go first as string steps
    if (required_preconditions.length > 0) {
      pathway.push(...required_preconditions);
    }

    pathway.push(...pathwayMeasures.map(m => m.id));

    return {
      pathway: [...new Set(pathway)],
      blocked,
      required_preconditions: [...new Set(required_preconditions)]
    };
  }
}
