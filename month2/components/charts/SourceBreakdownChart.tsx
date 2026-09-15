"use client";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
  CartesianGrid,
} from "recharts";
import { LeadSource } from "../../types/crm.types";

interface Props {
  data: { source: LeadSource; count: number }[];
}

const SOURCE_LABELS: Record<string, string> = {
  website_form: "Форма сайта",
  telegram_bot: "Telegram бот",
  phone: "Телефон",
  referral: "Рекомендация",
  manual: "Вручную",
  other: "Другое",
};

const COLORS = ["#38bdf8", "#818cf8", "#c084fc", "#f472b6", "#fb923c", "#a3e635"];

export default function SourceBreakdownChart({ data }: Props) {
  const chartData = (data || []).map((d) => ({
    name: SOURCE_LABELS[d.source] || d.source,
    count: d.count,
  }));

  if (chartData.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-slate-500 text-sm">
        Нет данных по источникам
      </div>
    );
  }

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 25 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} />
          <XAxis
            dataKey="name"
            stroke="#94a3b8"
            fontSize={10}
            angle={-15}
            textAnchor="end"
            interval={0}
          />
          <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} allowDecimals={false} />
          <Tooltip
            contentStyle={{
              backgroundColor: "#0f172a",
              borderColor: "#334155",
              borderRadius: "0.75rem",
              color: "#f8fafc",
            }}
          />
          <Bar dataKey="count" name="Количество" radius={[6, 6, 0, 0]}>
            {chartData.map((_, index) => (
              <Cell key={`bar-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
