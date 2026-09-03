import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { CaraKerja } from "@/components/landing/CaraKerja";
import { TambahForm } from "@/components/tambah/TambahForm";

export default function TambahPage() {
  return (
    <div className="min-h-screen bg-sl-cream-100">
      <Navbar />
      <main>
        {/* Header section */}
        <section className="pt-24 pb-8 md:pt-28 md:pb-12">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <p className="animate-fade-in-up text-xs font-semibold tracking-[0.18em] text-sl-kilau-600">
              Sumbang Kata
            </p>
            <h1
              className="mt-4 text-3xl font-bold leading-tight tracking-tight text-sl-ink-900 opacity-0 md:text-4xl"
              style={{ animation: "fade-in-up 0.8s ease-out 0.1s forwards" }}
            >
              Simpan satu kata dari kampung.
            </h1>
            <p
              className="mt-3 max-w-2xl text-sm leading-relaxed text-sl-ink-500 opacity-0 md:text-base"
              style={{ animation: "fade-in-up 0.8s ease-out 0.2s forwards" }}
            >
              Formulir sederhana. AI akan bantu rapikan, komunitas akan
              ukuhkan. Tidak perlu jadi ahli linguistik.
            </p>
          </div>
        </section>

        {/* Form section */}
        <section className="pb-16 md:pb-24">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <div
              className="opacity-0"
              style={{ animation: "fade-in-up 0.8s ease-out 0.3s forwards" }}
            >
              <TambahForm />
            </div>
          </div>
        </section>

        {/* Reassurance section, reuse CaraKerja dari landing */}
        <CaraKerja />
      </main>
      <Footer />
    </div>
  );
}
