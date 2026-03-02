import { CLIMATE_RULES } from "../config/climate-rules";

export interface ClimateContext {
  region: string;
  climate_exposure: "LOW" | "MEDIUM" | "HIGH";
  ventilation_threshold_modifier: "STANDARD" | "STRICT";
}

export class ClimateEngine {
  
  /**
   * Deterministically assigns a UK climate region and attributes based on Postcode.
   * If mapping falls outside explicit higher risk blocks, assumes STANDARD/MEDIUM.
   * 
   * @param postcode The UK property postcode
   */
  public static evaluate(postcode: string): ClimateContext {
    if (!postcode) {
      return {
        region: "Unknown",
        climate_exposure: "MEDIUM",
        ventilation_threshold_modifier: "STANDARD"
      };
    }

    const normalizedPostcode = postcode.trim().toUpperCase();
    
    // Extract prefix characters (usually 1 or 2 letters before any numbers)
    const match = normalizedPostcode.match(/^[A-Z]+/);
    const prefix = match ? match[0] : "";

    for (const rule of CLIMATE_RULES) {
      if (rule.postcode_prefixes.includes(prefix)) {
        return {
          region: rule.region,
          climate_exposure: rule.climate_exposure,
          ventilation_threshold_modifier: rule.ventilation_threshold_modifier
        };
      }
    }

    // Default for rest of UK (e.g., London, South East, Midlands)
    return {
      region: "Rest of UK (Default)",
      climate_exposure: "MEDIUM",
      ventilation_threshold_modifier: "STANDARD"
    };
  }
}
