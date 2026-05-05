import { NextResponse } from "next/server";
import { recommendCid10 } from "@/lib/cid10/recommendation";
import type { Cid10RecommendationInput } from "@/lib/cid10/types";

function isValidBody(body: unknown): body is Cid10RecommendationInput {
  if (typeof body !== "object" || body === null) {
    return false;
  }

  const candidate = body as Partial<Cid10RecommendationInput>;
  const validHypotheses =
    Array.isArray(candidate.hypotheses) &&
    candidate.hypotheses.every((item) => typeof item === "string");
  const validLimit = candidate.limit === undefined || typeof candidate.limit === "number";

  return validHypotheses && validLimit;
}

export async function POST(request: Request) {
  try {
    const body: unknown = await request.json();

    if (!isValidBody(body)) {
      return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
    }

    const results = await recommendCid10(body);
    return NextResponse.json({ results });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
