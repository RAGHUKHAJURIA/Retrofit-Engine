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

    let calculatedBand = EPCBand.A;
    if (currentScore >= 92) calculatedBand = EPCBand.A;
    else if (currentScore >= 81) calculatedBand = EPCBand.B;
    else if (currentScore >= 69) calculatedBand = EPCBand.C;
    else if (currentScore >= 55) calculatedBand = EPCBand.D;
    else if (currentScore >= 39) calculatedBand = EPCBand.E;
    else if (currentScore >= 21) calculatedBand = EPCBand.F;
    else calculatedBand = EPCBand.G;

    // Output mapped score keys to prevent regression
    const bandRanking = { "A": 7, "B": 6, "C": 5, "D": 4, "E": 3, "F": 2, "G": 1 };
    if (bandRanking[calculatedBand] < bandRanking[currentBand]) {
      return currentBand;
    }
    return calculatedBand;
  }
}
