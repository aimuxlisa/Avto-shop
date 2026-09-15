"use client";

import { useDroppable } from "@dnd-kit/core";
import { Lead, LeadStatus } from "../../types/crm.types";
import LeadCard from "./LeadCard";

interface Props {
  status: LeadStatus;
  title: string;
  colorClass: string;
  leads: Lead[];
  isAdmin?: boolean;
}

export default function KanbanColumn({ status, title, colorClass, leads, isAdmin }: Props) {
  const { setNodeRef, isOver } = useDroppable({
    id: status,
    data: { status },
  });

  const totalValue = leads.reduce((sum, l) => sum + (l.value || 0), 0);

  return (
    <div
      ref={setNodeRef}
      className={`flex-1 min-w-[280px] max-w-[320px] flex flex-col rounded-2xl bg-slate-950/40 border transition-colors ${
        isOver ? "border-indigo-500 bg-indigo-950/20" : "border-slate-800/80"
      }`}
    >
      {/* Column Header */}
      <div className="p-4 border-b border-slate-800/80 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className={`w-2.5 h-2.5 rounded-full ${colorClass}`} />
          <h3 className="text-sm font-bold text-white tracking-wide">{title}</h3>
          <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-800 text-slate-400">
            {leads.length}
          </span>
        </div>
        <div className="text-[11px] font-medium text-slate-500">
          {totalValue > 0 ? `${(totalValue / 1000).toFixed(0)}k ₽` : "0 ₽"}
        </div>
      </div>

      {/* Cards list */}
      <div className="flex-1 p-3 space-y-3 overflow-y-auto min-h-[500px] max-h-[calc(100vh-220px)]">
        {leads.length === 0 ? (
          <div className="h-32 flex items-center justify-center border border-dashed border-slate-800/60 rounded-xl text-xs text-slate-600">
            Перетащите сюда
          </div>
        ) : (
          leads.map((lead) => <LeadCard key={lead.id} lead={lead} isAdmin={isAdmin} />)
        )}
      </div>
    </div>
  );
}
