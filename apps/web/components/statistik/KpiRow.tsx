import { BookOpen, Users, ShieldCheck } from "lucide-react";
import { KpiCard } from "./KpiCard";

export function KpiRow() {
  return (
    <div className="grid gap-6 md:grid-cols-3">
      <KpiCard
        icon={BookOpen}
        colorBg="bg-sl-kilau-50"
        colorText="text-sl-kilau-700"
        angka={1240}
        label="Kata Terdaftar"
        keterangan="dari 24 daerah berbeda"
        index={0}
      />
      <KpiCard
        icon={Users}
        colorBg="bg-sl-batik-50"
        colorText="text-sl-batik-700"
        angka={340}
        label="Kontributor Aktif"
        keterangan="penutur asli dan pembelajar"
        index={1}
      />
      <KpiCard
        icon={ShieldCheck}
        colorBg="bg-sl-daun-50"
        colorText="text-sl-daun-700"
        angka={87}
        suffix="%"
        label="Terverifikasi"
        keterangan="diperiksa AI dan komunitas"
        index={2}
      />
    </div>
  );
}
