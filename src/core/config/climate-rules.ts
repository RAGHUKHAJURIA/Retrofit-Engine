export const CLIMATE_RULES: ClimateRule[] = [
  {
    region: "Scotland",
    postcode_prefixes: ["AB", "DD", "EH", "FK", "G", "HS", "IV", "KA", "KW", "KY", "ML", "PA", "PH", "ZE"],
    climate_exposure: "HIGH",
    ventilation_threshold_modifier: "STRICT"
  },
  {
    region: "Wales",
    postcode_prefixes: ["CF", "CH", "LD", "LL", "NP", "SA", "SY"],
    climate_exposure: "HIGH",
    ventilation_threshold_modifier: "STRICT"
  },
  {
    region: "South West England",
    postcode_prefixes: ["BA", "BH", "BS", "DT", "EX", "GL", "PL", "SN", "SP", "TA", "TQ", "TR"],
    climate_exposure: "HIGH",
    ventilation_threshold_modifier: "STRICT"
  },
  {
    region: "Northern England",
    postcode_prefixes: ["BB", "BD", "BL", "CA", "CB", "CH", "CW", "DH", "DL", "DN", "FY", "HD", "HG", "HU", "HX", "L", "LA", "LS", "M", "NE", "OL", "PR", "SK", "SR", "TS", "WA", "WF", "WN", "YO"],
    climate_exposure: "MEDIUM",
    ventilation_threshold_modifier: "STANDARD"
  }
];

export interface ClimateRule {
  region: string;
  postcode_prefixes: string[];
  climate_exposure: "LOW" | "MEDIUM" | "HIGH";
  ventilation_threshold_modifier: "STANDARD" | "STRICT";
}
