import { SequencingEngine } from "@/src/core/engines/sequencing.engine";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { eligibleMeasureIds, safety, input } = body;
    const result = SequencingEngine.generatePathway(
      eligibleMeasureIds || [], 
      safety || { blocked_measures: [], required_actions: [] }, 
      input || {}
    );
    return Response.json(result);
  } catch (error) {
    console.error("Error generating sequencing pathway:", error);
    return Response.json({ error: "Failed to sequence measures" }, { status: 500 });
  }
}
