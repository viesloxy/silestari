"use client";

import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { statusVerifikasi } from "@/lib/mock-data";

const terverifikasi = statusVerifikasi.find((s) => s.name === "Terverifikasi");

export function ChartStatus() {
  return (
    <div
      className="rounded-2xl border border-sl-ink-100 bg-white p-6 shadow-sm md:p-8"
      style={{
        animation: "fade-in-up 0.8s ease-out 0.45s forwards",
        opacity: 0,
      }}
    >
      <div className="mb-6">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-sl-ink-500">
          Status
        </p>
        <h3 className="mt-1 text-xl font-bold text-sl-ink-900">
          Verifikasi Komunitas
        </h3>
      </div>

      <div
        className="relative"
        aria-label="Grafik donut status verifikasi kata"
        role="img"
      >
        <ResponsiveContainer width="100%" height={260}>
          <PieChart>
            <Pie
              data={statusVerifikasi}
              cx="50%"
              cy="50%"
              innerRadius={65}
              outerRadius={100}
              paddingAngle={2}
              dataKey="value"
              startAngle={90}
              endAngle={-270}
            >
              {statusVerifikasi.map((entry, i) => (
                <Cell key={i} fill={entry.color} strokeWidth={0} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                borderRadius: 12,
                border: "1px solid #EEEDED",
                boxShadow: "0 10px 15px rgba(15, 23, 42, 0.08)",
                fontSize: 12,
              }}
              formatter={(v: number, name: string) => [`${v}%`, name]}
            />
          </PieChart>
        </ResponsiveContainer>

        {terverifikasi && (
          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-4xl font-bold text-sl-ink-900">
              {terverifikasi.value}
              <span className="text-xl">%</span>
            </span>
            <span className="mt-0.5 text-[11px] font-medium uppercase tracking-wider text-sl-ink-500">
              Terverifikasi
            </span>
          </div>
        )}
      </div>

      <ul className="mt-6 space-y-3 border-t border-sl-ink-100 pt-5">
        {statusVerifikasi.map((item) => (
          <li key={item.name} className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2.5">
              <span
                aria-hidden
                className="h-2.5 w-2.5 rounded-full"
                style={{ background: item.color }}
              />
              <span className="text-sl-ink-700">{item.name}</span>
            </div>
            <span className="font-semibold text-sl-ink-900">{item.value}%</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
