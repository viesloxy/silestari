import { CountUp } from "@/components/motion/CountUp";
import { BookOpen, Users, ShieldCheck } from "lucide-react";

type Stat = {
  angka: number;
  suffix?: string;
  label: string;
  keterangan: string;
  icon: typeof BookOpen;
  colorBg: string;
  colorText: string;
};

const stats: Stat[] = [
  {
    angka: 1240,
    label: "Kata Terdaftar",
    keterangan: "dari 24 daerah berbeda",
    icon: BookOpen,
    colorBg: "bg-sl-kilau-50",
    colorText: "text-sl-kilau-700",
  },
  {
    angka: 340,
    label: "Kontributor Aktif",
    keterangan: "penutur asli dan pembelajar",
    icon: Users,
    colorBg: "bg-sl-batik-50",
    colorText: "text-sl-batik-700",
  },
  {
    angka: 87,
    suffix: "%",
    label: "Terverifikasi",
    keterangan: "diperiksa AI dan komunitas",
    icon: ShieldCheck,
    colorBg: "bg-sl-daun-50",
    colorText: "text-sl-daun-700",
  },
];

export function AngkaKomunitas() {
  return (
    <section className="relative bg-white py-20 md:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-14 max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-sl-kilau-600">
            Denyut Komunitas
          </p>
          <h2 className="mt-4 text-3xl font-bold leading-tight tracking-tight text-sl-ink-900 md:text-4xl">
            Data yang terus bertambah setiap hari.
          </h2>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {stats.map((s, i) => (
            <div
              key={s.label}
              className="group relative cursor-default overflow-hidden rounded-2xl border border-sl-ink-100 bg-white p-8 shadow-sm transition-all duration-500 hover:-translate-y-2 hover:shadow-xl"
              style={{
                animation: `fade-in-up 0.8s ease-out ${i * 120}ms forwards`,
                opacity: 0,
              }}
            >
              <div
                className={`mb-6 flex h-14 w-14 items-center justify-center rounded-xl ${s.colorBg} shadow-md transition-all duration-300 group-hover:scale-110 group-hover:rotate-6 group-hover:shadow-lg`}
              >
                <s.icon
                  className={`h-7 w-7 ${s.colorText}`}
                  strokeWidth={1.75}
                />
              </div>

              <p className="text-5xl font-bold tracking-tight text-sl-ink-900 md:text-6xl">
                <CountUp to={s.angka} />
                {s.suffix && (
                  <span className="text-sl-kilau-500">{s.suffix}</span>
                )}
              </p>

              <p className="mt-4 text-sm font-semibold uppercase tracking-wider text-sl-ink-700">
                {s.label}
              </p>
              <p className="mt-1 text-sm text-sl-ink-500">{s.keterangan}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
