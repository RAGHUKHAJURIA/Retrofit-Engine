import { EPCBand } from "../enums/epc-band.enum";
import { FinalStatus } from "../enums/final-status.enum";

export interface FeasibilityDecision {
  final_status: FinalStatus;

  achievable_epc_band: EPCBand;

  constraints: string[];
  required_preconditions: string[];
  sequencing_order: string[];

  escalation_flags: string[];
  assumptions_log: string[];

  uncertainty_score: number;
}