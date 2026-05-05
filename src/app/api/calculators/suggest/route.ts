import { suggestCalculatorsFromNote } from "@/lib/calculators/autosuggest";
import type { AutoSuggestInput } from "@/lib/calculators/types";
import { NextResponse } from "next/server";

function isValidBody(body: unknown): body is AutoSuggestInput {
  if (typeof body !== "object" || body === null) {
    return false;
  }

  const candidate = body as Partial<AutoSuggestInput>;
  const validContext =
    typeof candidate.context === "string" ||
    (Array.isArray(candidate.context) && candidate.context.every((item) => typeof item === "string"));
  const validNote = typeof candidate.note === "string";
  const validLimit = candidate.limit === undefined || typeof candidate.limit === "number";

  return validContext && validNote && validLimit;
}

export async function POST(request: Request) {
  try {
    const body: unknown = await request.json();

    if (!isValidBody(body)) {
      return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
    }

    const result = await suggestCalculatorsFromNote(body);

    return NextResponse.json(result);
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
