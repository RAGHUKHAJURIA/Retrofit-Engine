import { EPCBand } from "../enums/epc-band.enum";
import { FinalStatus } from "../enums/final-status.enum";

export interface Precondition {
  blocked_measure: string;
  reason: string;
  required_action?: string;
}

export interface FeasibilityDecision {
  final_status: FinalStatus;

  achievable_epc_band: EPCBand;

  property_baseline?: {
    archetype: string;
    age_band: string;
    wall_type: string;
    floor_area: number;
    climate_region: string;
    heating_system: string;
  };

  risk_assessment?: {
    moisture_risk: string;
    moisture_reason: string;
    ventilation_adequacy: string;
    structural_uncertainty: string;
  };

  epc_projection?: {
    current: string;
    after_fabric: string;
    after_heating: string;
    after_renewables: string;
  };

  constraints: string[];
  required_preconditions: string[];
  structured_preconditions?: Precondition[];
  
  sequencing_order: string[];

  escalation_flags: string[];
  assumptions_log: string[];

  uncertainty_score: number;
}