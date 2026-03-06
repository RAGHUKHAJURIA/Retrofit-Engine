import { EPCBand } from "../enums/epc-band.enum";

export interface PropertyInputDTO {
  postcode: string;
  address: string;

  epc_band_current: EPCBand;
  epc_band_potential: EPCBand;
  epc_date: Date;

  construction_age_band: string;
  property_type: string;
  storeys: number;
  total_floor_area: number;

  wall_description: string;
  roof_description: string;
  heating_type: string;

  ventilation_type?: string;
  airtightness_condition?: string;
  
  // New user requirement fields
  address_id?: string;
  extension_present?: string;
  structural_alterations?: string;
  damp_history?: string;
  mould_present?: string;
  condensation_history?: string;
  roof_leaks?: string;
  retrofit_target?: string;

  listed_building?: boolean;

  // Section E: Fabric Details
  windows?: string;
  loft_insulation_depth?: string;
  wall_insulation_status?: string;
  floor_type?: string;

  // Section F: Heating & Systems
  current_heating_system?: string;
  hot_water_cylinder?: string;

  // Section G: Constraints Screening
  is_listed?: string;
  in_conservation_area?: string;
}
