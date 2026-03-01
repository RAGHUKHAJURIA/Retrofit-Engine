import { ArchetypeEngine } from "@/src/core/engines/archetype.engine";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const archetype = ArchetypeEngine.classify(body);

    return Response.json({
      archetype
    });
  } catch (error) {
    console.error("Error classifying archetype:", error);
    return Response.json({ error: "Failed to classify archetype" }, { status: 500 });
  }
}
