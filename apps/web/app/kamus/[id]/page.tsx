import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { createPB, type Entry } from "@/lib/pocketbase";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { DetailHeader } from "@/components/kamus/DetailHeader";
import { DetailBody } from "@/components/kamus/DetailBody";
import { KataTerkait } from "@/components/kamus/KataTerkait";

type Params = Promise<{ id: string }>;

async function fetchEntry(id: string): Promise<Entry | null> {
  try {
    const pb = createPB();
    return (await pb.collection("entries").getOne(id)) as unknown as Entry;
  } catch {
    return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { id } = await params;
  const entry = await fetchEntry(id);
  if (!entry) return { title: "Kata Tidak Ditemukan · Si Lestari" };
  return {
    title: `${entry.kata}, arti Bahasa ${entry.daerah} · Si Lestari`,
    description: entry.arti,
  };
}

export default async function KamusDetailPage({ params }: { params: Params }) {
  const { id } = await params;
  const entry = await fetchEntry(id);
  if (!entry) notFound();

  // Kata lain dari daerah yang sama, paling didukung dulu
  let terkait: Entry[] = [];
  try {
    const pb = createPB();
    const result = await pb.collection("entries").getList(1, 4, {
      filter: `daerah = "${entry.daerah}" && id != "${entry.id}"`,
      sort: "-upvotes",
    });
    terkait = (result.items as unknown as Entry[]).slice(0, 3);
  } catch {
    terkait = [];
  }

  return (
    <div className="min-h-screen bg-sl-cream-100">
      <Navbar />
      <main>
        <DetailHeader entry={entry} />
        <DetailBody entry={entry} />
        <KataTerkait items={terkait} daerah={entry.daerah} />

        {/* CTA closing */}
        <section className="py-16 md:py-20">
          <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
            <p className="text-xs font-semibold tracking-[0.18em] text-sl-kilau-600">
              Punya versi lain?
            </p>
            <h2 className="mt-4 text-2xl font-bold leading-tight tracking-tight text-sl-ink-900 md:text-3xl">
              Ada varian di daerahmu yang belum tercatat?
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-sl-ink-500">
              Setiap kampung punya cara sendiri. Bagikan varianmu supaya
              kamus ini makin kaya.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link
                href="/tambah"
                className="btn-pill btn-pill-lg btn-pill-primary"
              >
                Sumbang Kata Baru
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/jelajahi"
                className="btn-pill btn-pill-lg btn-pill-outline"
              >
                Kembali ke Jelajahi
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
