"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
  Cell,
} from "recharts";
import { mockStats } from "@/lib/mock-data";

const data = [...mockStats]
  .map((s) => ({ nama: s.daerah, kata: s.jumlah_kata }))
  .sort((a, b) => b.kata - a.kata);

const colorForIndex = (i: number) => {
  if (i === 0) return "#F58220"; // kilau-500
  if (i === 1) return "#DB6A0F"; // kilau-600
  if (i === 2) return "#B4530A"; // kilau-700
  return "#FF9B4A"; // kilau-400
};

export function ChartSebaran() {
  return (
    <div
      className="rounded-2xl border border-sl-ink-100 bg-white p-6 shadow-sm md:p-8"
      style={{
        animation: "fade-in-up 0.8s ease-out 0.3s forwards",
        opacity: 0,
      }}
    >
      <div className="mb-6 flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-sl-ink-500">
            Sebaran
          </p>
          <h3 className="mt-1 text-xl font-bold text-sl-ink-900">
            Kata per Daerah
          </h3>
        </div>
        <span className="text-xs text-sl-ink-500">12 daerah aktif</span>
      </div>

      <div
        aria-label="Grafik batang sebaran jumlah kata per daerah"
        role="img"
      >
        <ResponsiveContainer width="100%" height={420}>
          <BarChart
            data={data}
            layout="vertical"
            margin={{ top: 8, right: 30, left: 30, bottom: 8 }}
          >
            <XAxis type="number" hide />
            <YAxis
              type="category"
              dataKey="nama"
              tick={{ fill: "#334155", fontSize: 12, fontWeight: 500 }}
              axisLine={false}
              tickLine={false}
              width={70}
            />
            <Tooltip
              cursor={{ fill: "rgba(245, 130, 32, 0.06)" }}
              contentStyle={{
                borderRadius: 12,
                border: "1px solid #EEEDED",
                boxShadow: "0 10px 15px rgba(15, 23, 42, 0.08)",
                fontSize: 12,
              }}
              formatter={(v: number) => [`${v} kata`, "Jumlah"]}
            />
            <Bar dataKey="kata" radius={[0, 8, 8, 0]}>
              {data.map((_, i) => (
                <Cell key={i} fill={colorForIndex(i)} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
