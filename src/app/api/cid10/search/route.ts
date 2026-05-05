import { NextResponse } from "next/server";
import { searchCid10 } from "@/lib/cid10/search";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q") ?? "";
    const rawLimit = Number(searchParams.get("limit") ?? "10000");
    const limit = Number.isFinite(rawLimit) ? rawLimit : 10000;

    const results = await searchCid10({ query, limit });
    return NextResponse.json({ results });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
