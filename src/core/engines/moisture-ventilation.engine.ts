import { MOISTURE_RULES } from "../config/moisture-rules";
import { VENTILATION_RULES } from "../config/ventilation-rules";
import { BLOCKING_RULES } from "../config/safety-blocking-rules";
import { MoistureRisk } from "../../enums/moisture-risk.enum";

export class MoistureVentilationEngine {

  static evaluate(context: any) {
    let moistureRisk: MoistureRisk = MoistureRisk.LOW;
    let ventilationStatus: "ADEQUATE" | "INADEQUATE" = "ADEQUATE";

    const requiredActions: string[] = [];
    const blockedMeasures: string[] = [];

    // ------------------------
    // Evaluate Moisture Rules
    // ------------------------
    for (const rule of MOISTURE_RULES) {
      if (rule.evaluate(context)) {
        moistureRisk = rule.result;
        if (rule.required_actions) {
          requiredActions.push(...rule.required_actions);
        }
      }
    }

    // ------------------------
    // Evaluate Ventilation Rules
    // ------------------------
    for (const rule of VENTILATION_RULES) {
      if (rule.evaluate(context)) {
        ventilationStatus = rule.result;
        if (rule.required_actions) {
          requiredActions.push(...rule.required_actions);
        }
      }
    }

    // ------------------------
    // Apply Blocking Rules
    // ------------------------
    for (const rule of BLOCKING_RULES) {
      if (rule.evaluate({ moisture_risk: moistureRisk, ventilation_status: ventilationStatus })) {
        blockedMeasures.push(...rule.blocked_measures);
      }
    }

    return {
      moisture_risk: moistureRisk,
      ventilation_status: ventilationStatus,
      blocked_measures: [...new Set(blockedMeasures)],
      required_actions: [...new Set(requiredActions)]
    };
  }
}
