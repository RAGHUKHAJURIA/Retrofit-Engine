import { EPCBand } from "../../enums/epc-band.enum";
import { RetrofitMeasure } from "../../models/retrofit-measure.model";
import { MEASURE_LIBRARY } from "../config/retrofit-measures";

export class EpcUpliftEngine {
  private static readonly BAND_SCORES: Record<EPCBand, number> = {
    [EPCBand.A]: 92,
    [EPCBand.B]: 81,
    [EPCBand.C]: 69,
    [EPCBand.D]: 55,
    [EPCBand.E]: 39,
    [EPCBand.F]: 21,
    [EPCBand.G]: 1
  };

  /**
   * Estimates the achievable EPC band based on sequenced measures.
   */
  public static calculateUplift(currentBand: EPCBand, pathwayMeasureIds: string[]): EPCBand {
    let currentScore = this.BAND_SCORES[currentBand];

    const measures = MEASURE_LIBRARY.filter(m => pathwayMeasureIds.includes(m.id));
    for (const m of measures) {
      currentScore += m.uplift_value;
    }

    if (currentScore >= 92) return EPCBand.A;
    if (currentScore >= 81) return EPCBand.B;
    if (currentScore >= 69) return EPCBand.C;
    if (currentScore >= 55) return EPCBand.D;
    if (currentScore >= 39) return EPCBand.E;
    if (currentScore >= 21) return EPCBand.F;
    return EPCBand.G;
  }
}
