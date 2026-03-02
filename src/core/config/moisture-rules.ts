import { MoistureRisk } from "../../enums/moisture-risk.enum";

export const MOISTURE_RULES: MoistureRule[] = [
  {
    id: "damp_history_rule",
    description: "If damp history exists → moisture risk HIGH",
    evaluate: (ctx) => ctx.damp_history === true,
    result: MoistureRisk.HIGH,
    required_actions: ["Damp investigation required"]
  },
  {
    id: "solid_high_climate_rule",
    description: "Solid wall + high climate exposure → MEDIUM",
    evaluate: (ctx) =>
      ctx.wall_type === "SOLID" &&
      ctx.climate_exposure === "HIGH",
    result: MoistureRisk.MEDIUM
  },
  {
    id: "internal_insulation_sensitivity_rule",
    description:
      "Solid wall + internal insulation + poor ventilation → HIGH",
    evaluate: (ctx) =>
      ctx.wall_type === "SOLID" &&
      ctx.internal_insulation_selected === true &&
      ctx.ventilation_quality === "POOR",
    result: MoistureRisk.HIGH,
    required_actions: [
      "Ventilation upgrade required before internal insulation"
    ]
  }
];

export interface MoistureRule {
  id: string;
  description: string;
  evaluate: (context: MoistureContext) => boolean;
  result: MoistureRisk;
  required_actions?: string[];
}

export interface MoistureContext {
  wall_type: string;
  climate_exposure: string;
  damp_history?: boolean;
  internal_insulation_selected?: boolean;
  ventilation_quality?: string;
}