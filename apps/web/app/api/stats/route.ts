import { NextResponse } from "next/server";
import { getStats } from "@/lib/stats";

export async function GET() {
  try {
    const stats = await getStats();
    return NextResponse.json(stats);
  } catch (err) {
    console.error("GET /api/stats:", err);
    return NextResponse.json(
      { error: "Gagal memuat statistik" },
      { status: 502 },
    );
  }
}
