"use client";

import { useDraggable } from "@dnd-kit/core";
import Link from "next/link";
import { Lead } from "../../types/crm.types";
import { Phone, DollarSign, User } from "lucide-react";

interface Props {
  lead: Lead;
  isAdmin?: boolean;
}

export default function LeadCard({ lead, isAdmin }: Props) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: lead.id,
    data: { lead },
  });

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
        zIndex: 50,
      }
    : undefined;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={`p-4 rounded-xl bg-slate-900 border border-slate-800/90 shadow-md hover:border-indigo-500/60 transition-all cursor-grab active:cursor-grabbing select-none ${
        isDragging ? "opacity-50 ring-2 ring-indigo-500 shadow-2xl scale-105" : ""
      }`}
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <Link
          href={`/leads/${lead.id}`}
          onClick={(e) => e.stopPropagation()}
          className="text-sm font-semibold text-white hover:text-indigo-400 transition-colors line-clamp-1"
        >
          {lead.client_name || "Без имени"}
        </Link>
        <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-md bg-slate-800 text-slate-400">
          {lead.source}
        </span>
      </div>

      {lead.client_phone && (
        <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-2.5">
          <Phone className="w-3 h-3 text-slate-500" />
          <span>{lead.client_phone}</span>
        </div>
      )}

      <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 mt-2">
        <div className="text-xs font-bold text-emerald-400 flex items-center">
          {lead.value ? `${lead.value.toLocaleString("ru-RU")} ₽` : "Сумма не указана"}
        </div>
        {isAdmin && lead.assigned_name && (
          <div className="flex items-center gap-1.5 text-[11px] text-slate-400 font-medium">
            <div className="w-4 h-4 rounded-full overflow-hidden bg-indigo-500/20 text-indigo-400 flex items-center justify-center text-[9px] shrink-0">
              {lead.assigned_avatar ? (
                <img src={lead.assigned_avatar} alt={lead.assigned_name} className="w-full h-full object-cover" />
              ) : (
                <User className="w-3 h-3 text-indigo-400" />
              )}
            </div>
            <span className="truncate max-w-[80px]">{lead.assigned_name}</span>
          </div>
        )}
      </div>
    </div>
  );
}
