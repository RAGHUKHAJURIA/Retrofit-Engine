export const VENTILATION_RULES: VentilationRule[] = [
  {
    id: "no_ventilation_rule",
    description: "No ventilation → INADEQUATE",
    evaluate: (ctx) =>
      !ctx.ventilation_type ||
      ctx.ventilation_type === "NONE",
    result: "INADEQUATE",
    required_actions: ["Install ventilation system"]
  },
  {
    id: "airtightness_without_ventilation_rule",
    description:
      "Airtightness improvement without ventilation upgrade → INADEQUATE",
    evaluate: (ctx) =>
      ctx.airtightness_improvement === true &&
      ctx.ventilation_upgrade_planned !== true,
    result: "INADEQUATE",
    required_actions: [
      "Ventilation upgrade must precede airtightness improvement"
    ]
  }
];

export interface VentilationRule {
  id: string;
  description: string;
  evaluate: (context: VentilationContext) => boolean;
  result: "ADEQUATE" | "INADEQUATE";
  required_actions?: string[];
}

export interface VentilationContext {
  ventilation_type?: string;
  airtightness_improvement?: boolean;
  ventilation_upgrade_planned?: boolean;
}
