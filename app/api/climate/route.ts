import { ClimateEngine } from "@/src/core/engines/climate.engine";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const result = ClimateEngine.evaluate(body.postcode);
    return Response.json(result);
  } catch (error) {
    console.error("Error evaluating climate:", error);
    return Response.json({ error: "Failed to evaluate climate" }, { status: 500 });
  }
}
