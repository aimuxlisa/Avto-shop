"use client";

import { useEffect, useState } from "react";
import AppLayout from "../../components/layout/AppLayout";
import KanbanBoard from "../../components/kanban/KanbanBoard";
import LeadForm from "../../components/forms/LeadForm";
import { Lead } from "../../types/crm.types";
import { Plus, RefreshCw } from "lucide-react";

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [leadsRes, meRes] = await Promise.all([
        fetch("/api/leads"),
        fetch("/api/auth/me"),
      ]);

      if (leadsRes.ok) {
        const json = await leadsRes.json();
        setLeads(json.leads || []);
      }

      if (meRes.ok) {
        const meJson = await meRes.json();
        setIsAdmin(meJson.user?.role === "admin");
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <AppLayout
      title="Воронка сделок (Kanban)"
      subtitle="Перетаскивайте карточки между этапами для смены статуса"
      actions={
        <div className="flex items-center gap-3">
          <button
            onClick={fetchData}
            title="Обновить"
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin text-indigo-400" : ""}`} />
          </button>
          <button
            onClick={() => setModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl shadow-lg shadow-indigo-500/20 transition-all"
          >
            <Plus className="w-4 h-4" />
            Новая заявка
          </button>
        </div>
      }
    >
      {loading ? (
        <div className="py-20 text-center text-slate-500 text-sm">Загрузка доски...</div>
      ) : (
        <KanbanBoard initialLeads={leads} isAdmin={isAdmin} />
      )}

      {modalOpen && (
        <LeadForm
          onClose={() => setModalOpen(false)}
          onSuccess={() => fetchData()}
        />
      )}
    </AppLayout>
  );
}
