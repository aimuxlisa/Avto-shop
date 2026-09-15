"use client";

import { useState } from "react";
import { DndContext, DragEndEvent, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { Lead, LeadStatus } from "../../types/crm.types";
import KanbanColumn from "./KanbanColumn";
import { AlertCircle } from "lucide-react";

interface Props {
  initialLeads: Lead[];
  isAdmin?: boolean;
}

const COLUMNS: { status: LeadStatus; title: string; color: string }[] = [
  { status: "new", title: "Новая", color: "bg-blue-400" },
  { status: "in_progress", title: "В работе", color: "bg-amber-400" },
  { status: "waiting", title: "Ожидание", color: "bg-purple-400" },
  { status: "won", title: "Успешно", color: "bg-emerald-400" },
  { status: "lost", title: "Отказ", color: "bg-rose-400" },
];

export default function KanbanBoard({ initialLeads, isAdmin }: Props) {
  const [leads, setLeads] = useState<Lead[]>(initialLeads);
  const [errorToast, setErrorToast] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    })
  );

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;

    const leadId = active.id as string;
    const newStatus = over.id as LeadStatus;

    // Check if status actually changed
    const currentLead = leads.find((l) => l.id === leadId);
    if (!currentLead || currentLead.status === newStatus) return;

    const previousLeads = [...leads];

    // Optimistic UI update
    setLeads((prev) =>
      prev.map((l) => (l.id === leadId ? { ...l, status: newStatus } : l))
    );

    try {
      const res = await fetch(`/api/leads/${leadId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!res.ok) {
        throw new Error("Не удалось обновить статус сделки");
      }
    } catch {
      // Rollback optimistic update
      setLeads(previousLeads);
      setErrorToast("Ошибка сохранения статуса. Изменение отменено.");
      setTimeout(() => setErrorToast(null), 4000);
    }
  };

  return (
    <div className="relative">
      {errorToast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-3 bg-rose-500/90 text-white rounded-xl shadow-2xl backdrop-blur-md text-xs font-semibold animate-in fade-in slide-in-from-bottom-2">
          <AlertCircle className="w-4 h-4" />
          {errorToast}
        </div>
      )}

      <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
        <div className="flex gap-4 overflow-x-auto pb-4 pt-1">
          {COLUMNS.map((col) => (
            <KanbanColumn
              key={col.status}
              status={col.status}
              title={col.title}
              colorClass={col.color}
              leads={leads.filter((l) => l.status === col.status)}
              isAdmin={isAdmin}
            />
          ))}
        </div>
      </DndContext>
    </div>
  );
}
