export const BLOCKING_RULES: BlockingRule[] = [
  {
    id: "high_moisture_block",
    description: "High moisture risk blocks insulation measures",
    evaluate: (ctx) => ctx.moisture_risk === "HIGH",
    blocked_measures: [
      "internal wall insulation",
      "external wall insulation",
      "floor insulation"
    ]
  },
  {
    id: "inadequate_ventilation_block",
    description: "Inadequate ventilation blocks airtightness improvements",
    evaluate: (ctx) => ctx.ventilation_status === "INADEQUATE",
    blocked_measures: [
      "airtightness improvement"
    ]
  }
];

export interface BlockingRule {
  id: string;
  description: string;
  evaluate: (context: BlockingContext) => boolean;
  blocked_measures: string[];
}

export interface BlockingContext {
  moisture_risk: "LOW" | "MEDIUM" | "HIGH";
  ventilation_status: "ADEQUATE" | "INADEQUATE";
}
