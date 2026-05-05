import { NextResponse } from "next/server";
import { promises as fs } from "node:fs";
import path from "node:path";

const REVIEW_FILE = path.join(process.cwd(), "data/disease-guides/review/drafts.pointofcare.json");

type ReviewStatus = "pending" | "approved";

type DraftItem = {
  id: string;
  disease: string;
  contexts: string[];
  hdTags: Array<{ name: string; weight: 6 | 10 }>;
  sections: Array<{ title: string; content: string[] }>;
  source?: { name?: string; url?: string; updatedAt?: string };
  review?: { status?: ReviewStatus; notes?: string };
};

type DraftPayload = {
  generatedAt?: string;
  total?: number;
  drafts: DraftItem[];
};

async function readPayload(): Promise<DraftPayload> {
  const raw = await fs.readFile(REVIEW_FILE, "utf8");
  const parsed = JSON.parse(raw) as DraftPayload;
  return parsed;
}

export async function GET() {
  try {
    const payload = await readPayload();
    return NextResponse.json(payload);
  } catch {
    return NextResponse.json({ error: "Não foi possível carregar os rascunhos." }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = (await request.json()) as DraftPayload;
    if (!body || !Array.isArray(body.drafts)) {
      return NextResponse.json({ error: "Payload inválido." }, { status: 400 });
    }

    const normalized: DraftPayload = {
      generatedAt: body.generatedAt ?? new Date().toISOString(),
      total: body.drafts.length,
      drafts: body.drafts.map((draft) => ({
        ...draft,
        contexts: Array.isArray(draft.contexts) ? draft.contexts : [],
        hdTags: Array.isArray(draft.hdTags) ? draft.hdTags : [],
        sections: Array.isArray(draft.sections) ? draft.sections : [],
        review: {
          status: draft.review?.status === "approved" ? "approved" : "pending",
          notes: draft.review?.notes ?? "",
        },
      })),
    };

    await fs.writeFile(REVIEW_FILE, `${JSON.stringify(normalized, null, 2)}\n`, "utf8");
    return NextResponse.json({ ok: true, total: normalized.total });
  } catch {
    return NextResponse.json({ error: "Não foi possível salvar os rascunhos." }, { status: 500 });
  }
}
