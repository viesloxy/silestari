import Link from "next/link";
import { PenLine } from "lucide-react";
import type { Entry } from "@/lib/pocketbase";
import { formatTanggalIndonesia } from "@/lib/format";
import { ActionBar } from "./ActionBar";
import { DetailSidebar } from "./DetailSidebar";

type Props = { entry: Entry };

export function DetailBody({ entry }: Props) {
  return (
    <section className="pb-16 md:pb-20">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-[1.6fr_1fr]">
          {/* Card utama */}
          <article
            className="rounded-2xl border border-sl-ink-100 bg-white p-6 shadow-sm md:p-10 opacity-0"
            style={{ animation: "fade-in-up 0.8s ease-out 0.15s forwards" }}
          >
            {/* Arti */}
            <section>
              <h2 className="text-xs font-semibold tracking-[0.14em] text-sl-ink-500">
                Arti
              </h2>
              <p className="mt-3 text-lg leading-relaxed text-sl-ink-700 md:text-xl">
                {entry.arti}
              </p>
            </section>

            {/* Contoh kalimat */}
            <section className="mt-10">
              <h2 className="text-xs font-semibold tracking-[0.14em] text-sl-ink-500">
                Contoh Kalimat
              </h2>
              {entry.contoh_kalimat ? (
                <blockquote className="mt-3 border-l-2 border-sl-kilau-300 pl-5 text-lg italic leading-relaxed text-sl-ink-700">
                  &ldquo;{entry.contoh_kalimat}&rdquo;
                </blockquote>
              ) : (
                <div className="mt-3 rounded-xl border border-dashed border-sl-ink-200 bg-sl-cream-50 p-5">
                  <p className="text-sm text-sl-ink-500">
                    Belum ada contoh kalimat. Jadilah yang pertama menambahkan.
                  </p>
                  <Link
                    href={`/tambah?kata=${encodeURIComponent(entry.kata)}`}
                    className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-sl-kilau-700 transition-colors hover:text-sl-kilau-600"
                  >
                    <PenLine className="h-3.5 w-3.5" />
                    Tambah contoh
                  </Link>
                </div>
              )}
            </section>

            {/* Meta baris */}
            <div className="mt-10 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-sl-ink-500">
              <span>
                Kontributor{" "}
                <span className="font-semibold text-sl-ink-900">
                  {entry.kontributor ?? "Anonim"}
                </span>
              </span>
              <span aria-hidden className="text-sl-ink-300">
                &middot;
              </span>
              <span>{formatTanggalIndonesia(entry.created)}</span>
            </div>

            {/* Action bar */}
            <ActionBar
              initialUpvotes={entry.upvotes ?? 0}
              entryKata={entry.kata}
              entryId={entry.id}
            />
          </article>

          {/* Sidebar analisis AI */}
          <DetailSidebar entry={entry} />
        </div>
      </div>
    </section>
  );
}
