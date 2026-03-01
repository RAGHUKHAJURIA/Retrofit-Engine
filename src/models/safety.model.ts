import { MoistureRisk } from "../enums/moisture-risk.enum";

export interface SafetyAssessment {
  moisture_risk: MoistureRisk;
  ventilation_status: "ADEQUATE" | "INADEQUATE";

  blocked_measures: string[];
  required_actions: string[];
}