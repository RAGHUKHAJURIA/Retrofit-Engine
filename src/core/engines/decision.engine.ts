import { PropertyInputDTO } from "../../models/property.model";
import { FeasibilityDecision } from "../../models/decision.model";
import { FinalStatus } from "../../enums/final-status.enum";

export class DecisionEngine {
  
  public static evaluate(
    input: PropertyInputDTO,
    blockedMeasures: { measure: string, reason: string }[],
    epcUplift: any,
    pathway: string[],
    preconditions: string[]
  ): FeasibilityDecision {
    
    const constraints = blockedMeasures.map(b => `${b.measure}: ${b.reason}`);
    const escalation_flags: string[] = [];
    const assumptions_log: string[] = [];
    let uncertainty_score = 0;

    // Evaluate Uncertainty based on spec rules
    if (!input.wall_description || input.wall_description.toLowerCase() === "unknown") {
      uncertainty_score += 30;
      escalation_flags.push("Unknown wall construction");
      assumptions_log.push("Assuming solid wall default for unknown wall type");
    }

    if (!input.ventilation_type || input.ventilation_type.toLowerCase() === "unknown") {
      uncertainty_score += 20;
      escalation_flags.push("Unknown ventilation");
      assumptions_log.push("Assuming natural/poor ventilation default");
    }

    if (input.epc_date) {
      const epcDateObj = new Date(input.epc_date);
      const epcAgeDays = (new Date().getTime() - epcDateObj.getTime()) / (1000 * 3600 * 24);
      if (epcAgeDays > 3650) { // 10 years
        uncertainty_score += 20;
        escalation_flags.push("EPC older than 10 years");
      }
    }

    if (input.wall_description && input.wall_description.toLowerCase().includes("mixed")) {
      uncertainty_score += 15;
      escalation_flags.push("Mixed construction type");
    }

    if (input.damp_history === undefined) {
      uncertainty_score += 15;
      escalation_flags.push("Missing damp history");
      assumptions_log.push("Assuming no existing damp history, further survey recommended");
    }

    let final_status = FinalStatus.GREEN;

    if (uncertainty_score >= 30 || constraints.length > 0 || preconditions.length > 0) {
      final_status = FinalStatus.AMBER;
    }

    // Spec MVP Rule:
    const outOfScope = input.storeys > 3 || (input.property_type && input.property_type.toLowerCase().includes("commercial"));
    if (outOfScope || input.listed_building) {
      final_status = FinalStatus.RED;
      constraints.push("Outside MVP Scope or requires heritage pathway");
    }

    return {
      final_status,
      achievable_epc_band: epcUplift,
      constraints,
      required_preconditions: preconditions,
      sequencing_order: pathway,
      escalation_flags,
      assumptions_log,
      uncertainty_score
    };
  }
}
