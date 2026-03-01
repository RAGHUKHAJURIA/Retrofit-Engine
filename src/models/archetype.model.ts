import { MoistureRisk } from "../enums/moisture-risk.enum";

export interface Archetype {
  id: string;

  baseline_insulation_level: string;
  baseline_airtightness: string;
  default_ventilation: string;

  baseline_moisture_sensitivity: MoistureRisk;
  typical_heating_type: string;

  retrofit_constraints: string[];
  eligible_measures: string[];
}