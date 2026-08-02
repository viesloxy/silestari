import type { LucideIcon } from "lucide-react";
import { CountUp } from "@/components/motion/CountUp";

type Props = {
  icon: LucideIcon;
  colorBg: string;
  colorText: string;
  angka: number;
  suffix?: string;
  label: string;
  keterangan: string;
  index?: number;
};

export function KpiCard({
  icon: Icon,
  colorBg,
  colorText,
  angka,
  suffix,
  label,
  keterangan,
  index = 0,
}: Props) {
  return (
    <div
      className="group relative overflow-hidden rounded-2xl border border-sl-ink-100 bg-white p-7 shadow-sm transition-all duration-500 hover:-translate-y-1 hover:shadow-xl"
      style={{
        animation: `fade-in-up 0.8s ease-out ${index * 120}ms forwards`,
        opacity: 0,
      }}
    >
      <div
        className={`mb-5 flex h-14 w-14 items-center justify-center rounded-xl ${colorBg} ${colorText} transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6`}
      >
        <Icon className="h-7 w-7" strokeWidth={1.75} />
      </div>

      <p className="text-5xl font-bold tracking-tight text-sl-ink-900 md:text-6xl">
        <CountUp to={angka} />
        {suffix && <span className="text-sl-kilau-500">{suffix}</span>}
      </p>

      <p className="mt-3 text-sm font-semibold uppercase tracking-wider text-sl-ink-700">
        {label}
      </p>
      <p className="mt-1 text-sm text-sl-ink-500">{keterangan}</p>
    </div>
  );
}
