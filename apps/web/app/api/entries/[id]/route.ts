import { NextResponse } from "next/server";
import { createPB } from "@/lib/pocketbase";

type Params = { params: Promise<{ id: string }> };

export async function GET(_req: Request, { params }: Params) {
  const { id } = await params;
  const pb = createPB();
  try {
    const record = await pb.collection("entries").getOne(id);
    return NextResponse.json(record);
  } catch {
    return NextResponse.json({ error: "Kata tidak ditemukan" }, { status: 404 });
  }
}
