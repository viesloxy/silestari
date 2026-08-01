import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/landing/Hero";
import { UntukSiapa } from "@/components/landing/UntukSiapa";
import { KategoriDaerah } from "@/components/landing/KategoriDaerah";
import { KataPilihan } from "@/components/landing/KataPilihan";
import { CeritaKampung } from "@/components/landing/CeritaKampung";
import { AngkaKomunitas } from "@/components/landing/AngkaKomunitas";
import { CaraKerja } from "@/components/landing/CaraKerja";
import { Testimoni } from "@/components/landing/Testimoni";
import { FAQ } from "@/components/landing/FAQ";
import { CariKamus } from "@/components/landing/CariKamus";
import { AjakanTutup } from "@/components/landing/AjakanTutup";

export default function Home() {
  return (
    <div className="min-h-screen bg-sl-cream-100">
      <Navbar />
      <main>
        <Hero />
        <UntukSiapa />
        <KategoriDaerah />
        <KataPilihan />
        <CeritaKampung />
        <AngkaKomunitas />
        <CaraKerja />
        <Testimoni />
        <FAQ />
        <CariKamus />
        <AjakanTutup />
      </main>
      <Footer />
    </div>
  );
}
