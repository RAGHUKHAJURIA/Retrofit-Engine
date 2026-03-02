import { RetrofitFeasibilityEngine } from "@/src/index";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const decision = RetrofitFeasibilityEngine.evaluateProperty(body);

    return Response.json(decision);
  } catch (error) {
    console.error("Error evaluating feasibility:", error);
    return Response.json({ error: "Failed to evaluate property" }, { status: 500 });
  }
}
