import { RetrofitMeasure } from "../../models/retrofit-measure.model";
import { SequencingStage } from "../../enums/sequencing-stage.enum";

export const MEASURE_LIBRARY: RetrofitMeasure[] = [
  {
    id: "external wall insulation",
    category: "Fabric",
    sequencing_stage: SequencingStage.FABRIC,
    technical_conditions: ["solid wall"],
    moisture_sensitive: true,
    ventilation_dependency: true,
    prerequisites: [],
    uplift_value: 15
  },
  {
    id: "internal wall insulation",
    category: "Fabric",
    sequencing_stage: SequencingStage.FABRIC,
    technical_conditions: ["solid wall"],
    moisture_sensitive: true,
    ventilation_dependency: true,
    prerequisites: [],
    uplift_value: 12
  },
  {
    id: "cavity wall insulation",
    category: "Fabric",
    sequencing_stage: SequencingStage.FABRIC,
    technical_conditions: ["cavity wall"],
    moisture_sensitive: false,
    ventilation_dependency: true,
    prerequisites: [],
    uplift_value: 10
  },
  {
    id: "loft insulation",
    category: "Fabric",
    sequencing_stage: SequencingStage.FABRIC,
    technical_conditions: ["pitched roof"],
    moisture_sensitive: false,
    ventilation_dependency: false,
    prerequisites: [],
    uplift_value: 8
  },
  {
    id: "floor insulation",
    category: "Fabric",
    sequencing_stage: SequencingStage.FABRIC,
    technical_conditions: ["suspended floor"],
    moisture_sensitive: true,
    ventilation_dependency: false,
    prerequisites: [],
    uplift_value: 5
  },
  {
    id: "airtightness improvement",
    category: "Fabric",
    sequencing_stage: SequencingStage.FABRIC,
    technical_conditions: [],
    moisture_sensitive: false,
    ventilation_dependency: true,
    prerequisites: ["extract ventilation upgrade"],
    uplift_value: 3
  },
  {
    id: "boiler replacement",
    category: "Services",
    sequencing_stage: SequencingStage.HEATING,
    technical_conditions: [],
    moisture_sensitive: false,
    ventilation_dependency: false,
    prerequisites: [],
    uplift_value: 10
  },
  {
    id: "air source heat pump",
    category: "Services",
    sequencing_stage: SequencingStage.HEATING,
    technical_conditions: [],
    moisture_sensitive: false,
    ventilation_dependency: false,
    prerequisites: ["fabric_upgrade_threshold"],
    uplift_value: 15
  },
  {
    id: "mvhr",
    category: "Services",
    sequencing_stage: SequencingStage.VENTILATION,
    technical_conditions: [],
    moisture_sensitive: false,
    ventilation_dependency: false,
    prerequisites: ["airtightness improvement"],
    uplift_value: 5
  },
  {
    id: "extract ventilation upgrade",
    category: "Services",
    sequencing_stage: SequencingStage.VENTILATION,
    technical_conditions: [],
    moisture_sensitive: false,
    ventilation_dependency: false,
    prerequisites: [],
    uplift_value: 2
  },
  {
    id: "solar pv",
    category: "Renewables",
    sequencing_stage: SequencingStage.RENEWABLES,
    technical_conditions: [],
    moisture_sensitive: false,
    ventilation_dependency: false,
    prerequisites: [],
    uplift_value: 12
  },
  {
    id: "solar thermal",
    category: "Renewables",
    sequencing_stage: SequencingStage.RENEWABLES,
    technical_conditions: [],
    moisture_sensitive: false,
    ventilation_dependency: false,
    prerequisites: [],
    uplift_value: 8
  }
];
