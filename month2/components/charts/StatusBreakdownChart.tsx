"use client";

import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
import { LeadStatus } from "../../types/crm.types";

interface Props {
  data: { status: LeadStatus; count: number }[];
}

const STATUS_CONFIG: Record<LeadStatus, { label: string; color: string }> = {
  new: { label: "Новая", color: "#3b82f6" },
  in_progress: { label: "В работе", color: "#f59e0b" },
  waiting: { label: "Ожидание", color: "#a855f7" },
  won: { label: "Успешно", color: "#10b981" },
  lost: { label: "Отказ", color: "#ef4444" },
};

export default function StatusBreakdownChart({ data }: Props) {
  const chartData = (data || [])
    .filter((d) => d.count > 0)
    .map((d) => ({
      name: STATUS_CONFIG[d.status]?.label || d.status,
      value: d.count,
      color: STATUS_CONFIG[d.status]?.color || "#64748b",
    }));

  if (chartData.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-slate-500 text-sm">
        Нет данных по статусам
      </div>
    );
  }

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            innerRadius={50}
            outerRadius={80}
            paddingAngle={5}
            dataKey="value"
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              backgroundColor: "#0f172a",
              borderColor: "#334155",
              borderRadius: "0.75rem",
              color: "#f8fafc",
            }}
          />
          <Legend
            verticalAlign="bottom"
            height={36}
            formatter={(value) => <span className="text-xs text-slate-300">{value}</span>}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
