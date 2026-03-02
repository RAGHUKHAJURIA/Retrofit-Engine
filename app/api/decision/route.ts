import { DecisionEngine } from "@/src/core/engines/decision.engine";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { input, blockedMeasures, epcUplift, pathway, preconditions } = body;
    const result = DecisionEngine.evaluate(
      input || {},
      blockedMeasures || [],
      epcUplift,
      pathway || [],
      preconditions || []
    );
    return Response.json(result);
  } catch (error) {
    console.error("Error computing final decision:", error);
    return Response.json({ error: "Failed to compute decision" }, { status: 500 });
  }
}
