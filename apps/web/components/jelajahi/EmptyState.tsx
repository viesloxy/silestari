import Link from "next/link";
import { SearchX } from "lucide-react";

export function EmptyState() {
  return (
    <div
      role="status"
      className="mt-8 rounded-2xl border border-dashed border-sl-ink-200 bg-white p-10 text-center md:p-14"
    >
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-sl-cream-50">
        <SearchX className="h-7 w-7 text-sl-ink-300" strokeWidth={1.75} />
      </div>
      <h3 className="mt-5 text-lg font-semibold text-sl-ink-900">
        Belum ada kata yang cocok
      </h3>
      <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-sl-ink-500">
        Coba longgarkan filter atau kata kunci yang berbeda. Kalau kamu tahu
        katanya, kirim ke sini biar tersimpan.
      </p>
      <Link
        href="/tambah"
        className="btn-pill btn-pill-md btn-pill-primary mt-6"
      >
        Sumbang Kata
      </Link>
    </div>
  );
}
