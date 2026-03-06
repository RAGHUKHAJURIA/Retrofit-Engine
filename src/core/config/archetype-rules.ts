import { Archetype } from "../../models/archetype.model";
import { PropertyInputDTO } from "../../models/property.model";
import { MoistureRisk } from "../../enums/moisture-risk.enum";

export interface ArchetypeRuleCondition {
  construction_age_band?: string;
  wall_description?: string;
  property_type?: string;
  roof_description?: string;
}

export interface ArchetypeRule {
  id: string;
  conditions: ArchetypeRuleCondition;
  archetype: Archetype;
}

// Fallback archetype when no rules match
export const UNKNOWN_ARCHETYPE: Archetype = {
  id: "UNKNOWN",
  baseline_insulation_level: "unknown",
  baseline_airtightness: "unknown",
  default_ventilation: "unknown",
  baseline_moisture_sensitivity: MoistureRisk.MEDIUM,
  typical_heating_type: "unknown",
  retrofit_constraints: [],
  eligible_measures: []
};

// Rules are evaluated in order. First match wins.
export const ARCHETYPE_RULES: ArchetypeRule[] = [
  {
    id: "pre_1919_solid_wall_terrace",
    conditions: {
      construction_age_band: "before 1900",
      wall_description: "solid",
    },
    archetype: {
      id: "Pre-1919 Solid Wall Terrace",
      baseline_insulation_level: "none",
      baseline_airtightness: "leaky",
      default_ventilation: "natural extract",
      baseline_moisture_sensitivity: MoistureRisk.HIGH,
      typical_heating_type: "gas boiler",
      retrofit_constraints: ["solid wall insulation required"],
      eligible_measures: ["internal wall insulation", "external wall insulation", "loft insulation"]
    }
  },
  {
    id: "1930s_cavity_semi",
    conditions: {
      construction_age_band: "1930-1949",
      wall_description: "cavity",
      property_type: "semi-detached"
    },
    archetype: {
      id: "1930s cavity semi",
      baseline_insulation_level: "unfilled cavity",
      baseline_airtightness: "moderate",
      default_ventilation: "natural extract",
      baseline_moisture_sensitivity: MoistureRisk.MEDIUM,
      typical_heating_type: "gas boiler",
      retrofit_constraints: ["cavity fill check required"],
      eligible_measures: ["cavity wall insulation", "loft insulation"]
    }
  },
  {
    id: "1960s_concrete_system_build",
    conditions: {
      construction_age_band: "1967-1975",
      wall_description: "system build"
    },
    archetype: {
      id: "1960s Concrete System Build",
      baseline_insulation_level: "poor",
      baseline_airtightness: "leaky",
      default_ventilation: "natural extract",
      baseline_moisture_sensitivity: MoistureRisk.HIGH,
      typical_heating_type: "gas boiler",
      retrofit_constraints: ["hard to treat cavity", "structural check required"],
      eligible_measures: ["external wall insulation"]
    }
  },
  {
    id: "1930s_solid_wall",
    conditions: {
      construction_age_band: "1930-1949",
      wall_description: "solid"
    },
    archetype: {
      id: "1930s Solid Wall",
      baseline_insulation_level: "none",
      baseline_airtightness: "leaky",
      default_ventilation: "natural open flues",
      baseline_moisture_sensitivity: MoistureRisk.HIGH,
      typical_heating_type: "gas boiler",
      retrofit_constraints: ["solid wall insulation check", "damp risk assessment"],
      eligible_measures: ["internal wall insulation", "loft insulation", "extract ventilation upgrade", "boiler replacement", "solar pv"]
    }
  }
];
