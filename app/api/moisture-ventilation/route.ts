import { MoistureVentilationEngine } from "@/src/core/engines/moisture-ventilation.engine";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const result = MoistureVentilationEngine.evaluate(body);
    return Response.json(result);
  } catch (error) {
    console.error("Error evaluating moisture & ventilation:", error);
    return Response.json({ error: "Failed to evaluate moisture & ventilation" }, { status: 500 });
  }
}
