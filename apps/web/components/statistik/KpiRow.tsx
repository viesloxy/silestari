import { BookOpen, Users, ShieldCheck } from "lucide-react";
import { KpiCard } from "./KpiCard";
import type { SafeStats } from "@/lib/stats";

type Props = { stats: SafeStats };

export function KpiRow({ stats }: Props) {
  return (
    <div className="grid gap-6 md:grid-cols-3">
      <KpiCard
        icon={BookOpen}
        colorBg="bg-sl-kilau-50"
        colorText="text-sl-kilau-700"
        angka={stats.totalKata}
        label="Kata Terdaftar"
        keterangan={`dari ${stats.jumlahDaerahAktif} daerah berbeda`}
        index={0}
      />
      <KpiCard
        icon={Users}
        colorBg="bg-sl-batik-50"
        colorText="text-sl-batik-700"
        angka={stats.totalKontributor}
        label="Kontributor Aktif"
        keterangan="penutur asli dan pembelajar"
        index={1}
      />
      <KpiCard
        icon={ShieldCheck}
        colorBg="bg-sl-daun-50"
        colorText="text-sl-daun-700"
        angka={stats.persenVerified}
        suffix="%"
        label="Terverifikasi"
        keterangan="diperiksa AI dan komunitas"
        index={2}
      />
    </div>
  );
}
