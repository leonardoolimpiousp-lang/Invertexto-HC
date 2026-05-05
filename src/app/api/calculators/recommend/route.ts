import { recommendCalculators } from "@/lib/calculators/recommendation";
import type { RecommendationInput } from "@/lib/calculators/types";
import { NextResponse } from "next/server";

function isValidBody(body: unknown): body is RecommendationInput {
  if (typeof body !== "object" || body === null) {
    return false;
  }

  const candidate = body as Partial<RecommendationInput>;
  const validContext =
    typeof candidate.context === "string" ||
    (Array.isArray(candidate.context) && candidate.context.every((item) => typeof item === "string"));
  const validHypotheses = Array.isArray(candidate.hypotheses) && candidate.hypotheses.every((item) => typeof item === "string");
  const validLimit = candidate.limit === undefined || typeof candidate.limit === "number";

  return validContext && validHypotheses && validLimit;
}

export async function POST(request: Request) {
  try {
    const body: unknown = await request.json();

    if (!isValidBody(body)) {
      return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
    }

    const results = await recommendCalculators(body);

    return NextResponse.json({ results });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
