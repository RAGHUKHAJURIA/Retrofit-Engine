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
  damp_history?: boolean;

  listed_building?: boolean;
}