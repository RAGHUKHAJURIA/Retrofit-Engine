import { SequencingStage } from "../enums/sequencing-stage.enum";

export interface RetrofitMeasure {
  id: string;
  category: string;

  sequencing_stage: SequencingStage;

  technical_conditions: string[];
  moisture_sensitive: boolean;
  ventilation_dependency: boolean;

  prerequisites: string[];
  uplift_value: number;
}