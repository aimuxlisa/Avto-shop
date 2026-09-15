"use client";

import { useEffect, useState } from "react";
import AppLayout from "../../components/layout/AppLayout";
import LeadsOverTimeChart from "../../components/charts/LeadsOverTimeChart";
import StatusBreakdownChart from "../../components/charts/StatusBreakdownChart";
import SourceBreakdownChart from "../../components/charts/SourceBreakdownChart";
import TeamPerformanceChart from "../../components/charts/TeamPerformanceChart";
import { AnalyticsResponse } from "../../types/crm.types";
import { TrendingUp, Users, DollarSign, Target, RefreshCw } from "lucide-react";

export default function DashboardPage() {
  const [data, setData] = useState<AnalyticsResponse | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/analytics");
      if (res.ok) {
        const json = await res.json();
        setData(json);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  return (
    <AppLayout
      title="Аналитический дашборд"
      subtitle="Обзор ключевых показателей воронки продаж и конверсии"
      actions={
        <button
          onClick={fetchAnalytics}
          className="flex items-center gap-2 px-3 py-2 text-xs font-medium bg-slate-900 border border-slate-800 rounded-xl hover:bg-slate-800 transition-colors text-slate-300"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin text-indigo-400" : ""}`} />
          Обновить
        </button>
      }
    >
      {/* 4 Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        {/* Total Leads */}
        <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-sm relative overflow-hidden">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Всего заявок</span>
            <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-400">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-white tracking-tight">
            {loading ? "..." : data?.totalLeads ?? 0}
          </div>
          <div className="text-xs text-slate-500 mt-2">В текущей выборке воронки</div>
        </div>

        {/* Conversion Rate */}
        <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-sm relative overflow-hidden">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Конверсия</span>
            <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400">
              <Target className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-white tracking-tight">
            {loading ? "..." : `${data?.conversionRate ?? 0}%`}
          </div>
          <div className="text-xs text-emerald-400/80 mt-2 font-medium">Won / (Won + Lost)</div>
        </div>

        {/* Total Value */}
        <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-sm relative overflow-hidden">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Потенциал сделок</span>
            <div className="p-2.5 rounded-xl bg-violet-500/10 text-violet-400">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-white tracking-tight">
            {loading ? "..." : `${(data?.totalValue ?? 0).toLocaleString("ru-RU")} ₽`}
          </div>
          <div className="text-xs text-slate-500 mt-2">Суммарная стоимость лидов</div>
        </div>

        {/* Average Deal or Closed */}
        <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-sm relative overflow-hidden">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Успешных сделок</span>
            <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-white tracking-tight">
            {loading
              ? "..."
              : data?.statusBreakdown.find((s) => s.status === "won")?.count ?? 0}
          </div>
          <div className="text-xs text-slate-500 mt-2">Статус &quot;Успешно&quot;</div>
        </div>
      </div>

      {/* Grid of Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Leads Over Time */}
        <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-sm">
          <h2 className="text-base font-semibold text-white mb-1">Динамика новых заявок</h2>
          <p className="text-xs text-slate-400 mb-6">Поступление лидов по дням</p>
          <LeadsOverTimeChart data={data?.leadsOverTime || []} />
        </div>

        {/* Status Breakdown */}
        <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-sm">
          <h2 className="text-base font-semibold text-white mb-1">Распределение по статусам</h2>
          <p className="text-xs text-slate-400 mb-6">Текущее состояние лидов в воронке</p>
          <StatusBreakdownChart data={data?.statusBreakdown || []} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Source Breakdown */}
        <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-sm">
          <h2 className="text-base font-semibold text-white mb-1">Источники лидов</h2>
          <p className="text-xs text-slate-400 mb-6">Эффективность каналов привлечения</p>
          <SourceBreakdownChart data={data?.sourceBreakdown || []} />
        </div>

        {/* Team Performance (Admin only) */}
        {data?.teamPerformance && (
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-sm">
            <h2 className="text-base font-semibold text-white mb-1">Эффективность команды</h2>
            <p className="text-xs text-slate-400 mb-6">Сравнение показателей сотрудников</p>
            <TeamPerformanceChart data={data.teamPerformance} />
          </div>
        )}
      </div>
    </AppLayout>
  );
}
