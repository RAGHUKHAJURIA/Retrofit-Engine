import { EpcUpliftEngine } from "@/src/core/engines/epc-uplift.engine";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { currentBand, pathwayMeasureIds } = body;
    const result = EpcUpliftEngine.calculateUplift(currentBand, pathwayMeasureIds || []);
    return Response.json({ achievable_epc_band: result });
  } catch (error) {
    console.error("Error calculating EPC uplift:", error);
    return Response.json({ error: "Failed to calculate EPC uplift" }, { status: 500 });
  }
}
