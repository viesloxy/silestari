import { NextResponse } from "next/server";
import { createAdminPB } from "@/lib/pocketbase";

type Params = { params: Promise<{ id: string }> };

/**
 * Naikkan upvote entri. Lewat admin token agar field upvotes tidak bisa
 * di-update sembarangan dari publik (docs/DATABASE.md §2.3).
 * Rate limiting per IP menyusul di Fase 5.
 */
export async function POST(_req: Request, { params }: Params) {
  const { id } = await params;
  const pb = await createAdminPB();
  try {
    const record = await pb.collection("entries").getOne(id);
    const updated = await pb.collection("entries").update(id, {
      upvotes: (record.upvotes ?? 0) + 1,
    });
    return NextResponse.json({ upvotes: updated.upvotes });
  } catch {
    return NextResponse.json(
      { error: "Gagal memberi dukungan" },
      { status: 502 },
    );
  }
}
