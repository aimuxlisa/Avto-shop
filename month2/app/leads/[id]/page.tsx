"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
import AppLayout from "../../../components/layout/AppLayout";
import { Lead, Task, User, LeadStatus } from "../../../types/crm.types";
import {
  ArrowLeft,
  User as UserIcon,
  Phone,
  Mail,
  Calendar,
  Save,
  CheckCircle2,
  Plus,
  X,
  AlertCircle
} from "lucide-react";

interface Props {
  params: Promise<{ id: string }>;
}

export default function LeadDetailsPage({ params }: Props) {
  const { id } = use(params);

  const [lead, setLead] = useState<Lead | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [currentUserRole, setCurrentUserRole] = useState("manager");
  const [loading, setLoading] = useState(true);

  // Editable fields
  const [status, setStatus] = useState<LeadStatus>("new");
  const [assignedTo, setAssignedTo] = useState<string>("");
  const [value, setValue] = useState<string>("");
  const [notes, setNotes] = useState<string>("");
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  // New task modal
  const [taskModalOpen, setTaskModalOpen] = useState(false);
  const [taskTitle, setTaskTitle] = useState("");
  const [taskDueDate, setTaskDueDate] = useState("");
  const [taskSaving, setTaskSaving] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [leadRes, meRes] = await Promise.all([
        fetch(`/api/leads/${id}`),
        fetch("/api/auth/me"),
      ]);

      if (leadRes.ok) {
        const json = await leadRes.json();
        setLead(json.lead);
        setTasks(json.tasks || []);
        setStatus(json.lead.status);
        setAssignedTo(json.lead.assigned_to || "");
        setValue(json.lead.value ? String(json.lead.value) : "");
        setNotes(json.lead.notes || "");
      }

      if (meRes.ok) {
        const meJson = await meRes.json();
        setCurrentUserRole(meJson.user?.role || "manager");
        if (meJson.user?.role === "admin") {
          const uRes = await fetch("/api/users");
          if (uRes.ok) {
            const uJson = await uRes.json();
            setUsers(uJson.users || []);
          }
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch(`/api/leads/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status,
          assigned_to: assignedTo || null,
          value: value ? parseFloat(value) : null,
          notes,
        }),
      });

      if (res.ok) {
        setToast("Изменения успешно сохранены");
        setTimeout(() => setToast(null), 3000);
        fetchData();
      } else {
        throw new Error("Ошибка при сохранении");
      }
    } catch {
      setToast("Не удалось сохранить изменения");
      setTimeout(() => setToast(null), 3000);
    } finally {
      setSaving(false);
    }
  };

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!lead) return;
    setTaskSaving(true);
    try {
      const res = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lead_id: lead.id,
          client_id: lead.client_id,
          title: taskTitle,
          due_date: taskDueDate || null,
          assigned_to: assignedTo || undefined,
        }),
      });
      if (res.ok) {
        setTaskTitle("");
        setTaskDueDate("");
        setTaskModalOpen(false);
        fetchData();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setTaskSaving(false);
    }
  };

  if (loading) {
    return (
      <AppLayout title="Загрузка..." subtitle="Получение данных сделки">
        <div className="py-20 text-center text-slate-500 text-sm">Загрузка информации...</div>
      </AppLayout>
    );
  }

  if (!lead) {
    return (
      <AppLayout title="Сделка не найдена" subtitle="">
        <div className="py-20 text-center">
          <p className="text-slate-400 mb-4">Данная сделка не существует или у вас нет к ней доступа.</p>
          <Link
            href="/leads"
            className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 rounded-xl text-white text-xs font-semibold"
          >
            <ArrowLeft className="w-4 h-4" /> Вернуться в воронку
          </Link>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout
      title={`Сделка #${lead.id.slice(0, 8)}`}
      subtitle={`Клиент: ${lead.client_name || "Не указан"}`}
      actions={
        <div className="flex items-center gap-3">
          <Link
            href="/leads"
            className="flex items-center gap-2 px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-slate-300 text-xs font-medium hover:bg-slate-800 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            В воронку
          </Link>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl shadow-lg shadow-indigo-500/20 transition-all"
          >
            <Save className="w-4 h-4" />
            {saving ? "Сохранение..." : "Сохранить"}
          </button>
        </div>
      }
    >
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-3 bg-indigo-600 text-white rounded-xl shadow-2xl backdrop-blur-md text-xs font-semibold animate-in fade-in">
          <CheckCircle2 className="w-4 h-4" />
          {toast}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Lead parameters */}
        <div className="lg:col-span-2 space-y-6">
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-sm space-y-5">
            <h2 className="text-base font-semibold text-white">Параметры сделки</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Статус воронки</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as LeadStatus)}
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm focus:outline-none focus:border-indigo-500"
                >
                  <option value="new">Новая</option>
                  <option value="in_progress">В работе</option>
                  <option value="waiting">Ожидание</option>
                  <option value="won">Успешно</option>
                  <option value="lost">Отказ</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Сумма потенциала (₽)</label>
                <input
                  type="number"
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  placeholder="Не указана"
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Источник</label>
                <div className="px-3.5 py-2.5 bg-slate-950/60 border border-slate-800/80 rounded-xl text-slate-300 text-sm">
                  {lead.source}
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Ответственный</label>
                {currentUserRole === "admin" ? (
                  <select
                    value={assignedTo}
                    onChange={(e) => setAssignedTo(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm focus:outline-none focus:border-indigo-500"
                  >
                    <option value="">Не назначен</option>
                    {users.map((u) => (
                      <option key={u.id} value={u.id}>
                        {u.name} ({u.role})
                      </option>
                    ))}
                  </select>
                ) : (
                  <div className="px-3.5 py-2.5 bg-slate-950/60 border border-slate-800/80 rounded-xl text-slate-300 text-sm flex items-center gap-2">
                    <UserIcon className="w-4 h-4 text-indigo-400" />
                    {lead.assigned_name || "Вы"}
                  </div>
                )}
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">
                Заметки / Ход сделки
              </label>
              <textarea
                rows={5}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Заметки по переговорам, договоренностям..."
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm focus:outline-none focus:border-indigo-500 leading-relaxed"
              />
            </div>
          </div>

          {/* Tasks linked to lead */}
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-semibold text-white flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-indigo-400" />
                Задачи по сделке ({tasks.length})
              </h2>
              <button
                onClick={() => setTaskModalOpen(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-lg transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                Добавить задачу
              </button>
            </div>

            {tasks.length === 0 ? (
              <div className="py-6 text-center text-slate-500 text-xs">
                К этой сделке пока не привязано задач
              </div>
            ) : (
              <div className="space-y-2.5">
                {tasks.map((t) => (
                  <div
                    key={t.id}
                    className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center gap-2.5">
                      <span
                        className={`w-2 h-2 rounded-full ${
                          t.status === "done" ? "bg-emerald-400" : "bg-amber-400"
                        }`}
                      />
                      <span className="font-medium text-slate-200">{t.title}</span>
                    </div>
                    <div className="flex items-center gap-4 text-slate-500">
                      {t.due_date && <span>Срок: {t.due_date}</span>}
                      <span className="text-indigo-400 font-medium">{t.assigned_name}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right: Client Summary */}
        <div className="lg:col-span-1 space-y-6">
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-sm">
            <h2 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Клиент по сделке
            </h2>
            <div className="space-y-3.5 text-sm">
              <div className="font-bold text-white text-base">{lead.client_name}</div>
              <div className="flex items-center gap-3 text-slate-300">
                <Phone className="w-4 h-4 text-indigo-400 shrink-0" />
                <a href={`tel:${lead.client_phone}`} className="hover:text-indigo-300">
                  {lead.client_phone}
                </a>
              </div>
              {lead.client_email && (
                <div className="flex items-center gap-3 text-slate-300">
                  <Mail className="w-4 h-4 text-indigo-400 shrink-0" />
                  <a href={`mailto:${lead.client_email}`} className="hover:text-indigo-300">
                    {lead.client_email}
                  </a>
                </div>
              )}
              <div className="pt-3 border-t border-slate-800">
                <Link
                  href={`/clients/${lead.client_id}`}
                  className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold inline-flex items-center gap-1"
                >
                  Перейти в карточку клиента →
                </Link>
              </div>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-sm text-xs text-slate-400 space-y-2">
            <div>Создано: {new Date(lead.created_at).toLocaleString("ru-RU")}</div>
            <div>Обновлено: {new Date(lead.updated_at).toLocaleString("ru-RU")}</div>
          </div>
        </div>
      </div>

      {/* Add task modal */}
      {taskModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-white">Добавить задачу к сделке</h3>
              <button onClick={() => setTaskModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleCreateTask} className="space-y-4 text-sm">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Название задачи *</label>
                <input
                  type="text"
                  required
                  placeholder="Позвонить и уточнить ТЗ"
                  value={taskTitle}
                  onChange={(e) => setTaskTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Крайний срок (Due Date)</label>
                <input
                  type="date"
                  value={taskDueDate}
                  onChange={(e) => setTaskDueDate(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-indigo-500"
                />
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setTaskModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
                >
                  Отмена
                </button>
                <button
                  type="submit"
                  disabled={taskSaving}
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-lg shadow-indigo-500/20"
                >
                  {taskSaving ? "Создание..." : "Создать"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AppLayout>
  );
}
