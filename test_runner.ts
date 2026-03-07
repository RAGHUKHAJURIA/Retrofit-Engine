import fs from "fs";
import { RetrofitFeasibilityEngine } from './src/index';
import { PropertyInputDTO } from './src/models/property.model';
import { EPCBand } from './src/enums/epc-band.enum';

const testCases: any[] = [
  {
    id: "TC1",
    input: {
      postcode: "SW16 5RT", address: "10 Example Road", property_type: "semi-detached", storeys: 2,
      extension_present: "no", structural_alterations: "no",
      damp_history: "no", mould_present: "no", condensation_history: "no", roof_leaks: "no",
      ventilation_type: "extract_fans", retrofit_target: "target_epc_c",
      windows: "double_modern", loft_insulation_depth: "100-200mm", wall_insulation_status: "cavity_unfilled",
      current_heating_system: "gas_boiler",
      // Inferring properties for the engine
      construction_age_band: "1930-1949",
      wall_description: "cavity",
      epc_band_current: EPCBand.E,
    }
  },
  {
    id: "TC2",
    input: {
      postcode: "E5 8AB", address: "22 Test Terrace", property_type: "terraced", storeys: 2,
      extension_present: "no", structural_alterations: "no",
      damp_history: "yes", mould_present: "yes", condensation_history: "yes", roof_leaks: "unknown",
      ventilation_type: "natural", retrofit_target: "target_epc_b",
      windows: "single", loft_insulation_depth: "<100mm", wall_insulation_status: "solid_uninsulated",
      current_heating_system: "gas_boiler",
      construction_age_band: "before 1900",
      wall_description: "solid",
      epc_band_current: EPCBand.E,
    }
  },
  {
    id: "TC3",
    input: {
      postcode: "BR1 4TT", address: "12 Retrofit Avenue", property_type: "detached", storeys: 2,
      extension_present: "no", structural_alterations: "no",
      damp_history: "no", mould_present: "no", condensation_history: "no", roof_leaks: "no",
      ventilation_type: "extract_fans", retrofit_target: "electrification",
      windows: "double_pre2002", loft_insulation_depth: "<100mm", wall_insulation_status: "cavity_unfilled",
      current_heating_system: "gas_boiler",
      construction_age_band: "1960-1980",
      wall_description: "cavity",
      epc_band_current: EPCBand.E,
    }
  },
  {
    id: "TC4",
    input: {
      postcode: "RM3 0QL", address: "5 Sample Close", property_type: "semi-detached", storeys: 2,
      extension_present: "yes", structural_alterations: "yes",
      damp_history: "unknown", mould_present: "unknown", condensation_history: "unknown", roof_leaks: "unknown",
      ventilation_type: "unknown", retrofit_target: "target_epc_c",
      windows: "unknown", loft_insulation_depth: "unknown", wall_insulation_status: "unknown",
      current_heating_system: "unknown",
      construction_age_band: "unknown",
      wall_description: "unknown",
      epc_band_current: EPCBand.E,
    }
  },
  {
    id: "TC5",
    input: {
      postcode: "EC2A 4NE", address: "Flat 12, Example Tower", property_type: "flat", storeys: 12,
      extension_present: "no", structural_alterations: "no",
      damp_history: "no", mould_present: "no", condensation_history: "no", roof_leaks: "no",
      ventilation_type: "cme", retrofit_target: "target_epc_b",
      windows: "double_modern", loft_insulation_depth: "unknown", wall_insulation_status: "cavity_filled",
      current_heating_system: "electric_heating",
      construction_age_band: "2000+",
      wall_description: "cavity",
      epc_band_current: EPCBand.C,
    }
  },
  {
    id: "TC6",
    input: {
      postcode: "N17 9LT", address: "8 Energy Road", property_type: "terraced", storeys: 2,
      extension_present: "no", structural_alterations: "no",
      damp_history: "no", mould_present: "no", condensation_history: "yes", roof_leaks: "no",
      ventilation_type: "natural", retrofit_target: "target_epc_c",
      windows: "double_modern", loft_insulation_depth: "200mm+", wall_insulation_status: "cavity_unfilled",
      current_heating_system: "gas_boiler",
      construction_age_band: "1930-1949",
      wall_description: "cavity",
      epc_band_current: EPCBand.E,
    }
  }
];

const results = testCases.map(tc => {
  const result = RetrofitFeasibilityEngine.evaluateProperty(tc.input);
  return {
    id: tc.id,
    status: result.final_status,
    archetype: result.property_baseline?.archetype,
    moistureRisk: result.risk_assessment?.moisture_risk,
    preconditions: result.required_preconditions,
    blocked: result.structured_preconditions?.map((b: any) => b.blocked_measure),
    sequencing: result.sequencing_order,
    constraints: result.constraints,
    uncertainty: result.uncertainty_score
  };
});

fs.writeFileSync("test_results.json", JSON.stringify(results, null, 2));
