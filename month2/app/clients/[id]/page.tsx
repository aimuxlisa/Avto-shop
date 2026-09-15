"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
import AppLayout from "../../../components/layout/AppLayout";
import { Client, Lead, Task } from "../../../types/crm.types";
import {
  ArrowLeft,
  Phone,
  Mail,
  Calendar,
  DollarSign,
  Plus,
  CheckCircle2,
  Clock,
  Briefcase,
  X,
} from "lucide-react";

interface Props {
  params: Promise<{ id: string }>;
}

export default function ClientDetailsPage({ params }: Props) {
  const { id } = use(params);

  const [client, setClient] = useState<Client | null>(null);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  // New Lead Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [value, setValue] = useState("");
  const [source, setSource] = useState("manual");
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);

  const fetchClientData = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/clients/${id}`);
      if (res.ok) {
        const json = await res.json();
        setClient(json.client);
        setLeads(json.leads || []);
        setTasks(json.tasks || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClientData();
  }, [id]);

  const handleCreateLead = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          client_id: id,
          source,
          value: value ? parseFloat(value) : null,
          notes,
        }),
      });
      if (res.ok) {
        setValue("");
        setNotes("");
        setModalOpen(false);
        fetchClientData();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <AppLayout title="Загрузка..." subtitle="Получение данных карточки клиента">
        <div className="py-20 text-center text-slate-500 text-sm">Загрузка информации...</div>
      </AppLayout>
    );
  }

  if (!client) {
    return (
      <AppLayout title="Клиент не найден" subtitle="">
        <div className="py-20 text-center">
          <p className="text-slate-400 mb-4">Данный клиент не существует или был удален.</p>
          <Link
            href="/clients"
            className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 rounded-xl text-white text-xs font-semibold"
          >
            <ArrowLeft className="w-4 h-4" /> Вернуться к списку
          </Link>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout
      title={client.name}
      subtitle="Профиль клиента и история взаимодействий"
      actions={
        <div className="flex items-center gap-3">
          <Link
            href="/clients"
            className="flex items-center gap-2 px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-slate-300 text-xs font-medium hover:bg-slate-800 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Назад к списку
          </Link>
          <button
            onClick={() => setModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl shadow-lg shadow-indigo-500/20 transition-all"
          >
            <Plus className="w-4 h-4" />
            Создать сделку
          </button>
        </div>
      }
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column: Contact Info */}
        <div className="lg:col-span-1 space-y-6">
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-sm">
            <h2 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Контакты
            </h2>
            <div className="space-y-3.5 text-sm">
              <div className="flex items-center gap-3 text-slate-300">
                <Phone className="w-4 h-4 text-indigo-400 shrink-0" />
                <a href={`tel:${client.phone}`} className="hover:text-indigo-300">
                  {client.phone}
                </a>
              </div>
              {client.email && (
                <div className="flex items-center gap-3 text-slate-300">
                  <Mail className="w-4 h-4 text-indigo-400 shrink-0" />
                  <a href={`mailto:${client.email}`} className="hover:text-indigo-300">
                    {client.email}
                  </a>
                </div>
              )}
              <div className="flex items-center gap-3 text-slate-400 text-xs">
                <Calendar className="w-4 h-4 text-slate-500 shrink-0" />
                Клиент с {new Date(client.created_at).toLocaleDateString("ru-RU")}
              </div>
            </div>

            {client.notes && (
              <div className="mt-6 pt-5 border-t border-slate-800">
                <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                  Заметки о клиенте
                </div>
                <p className="text-xs text-slate-300 whitespace-pre-wrap leading-relaxed">
                  {client.notes}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Right column: Leads & Tasks history */}
        <div className="lg:col-span-2 space-y-6">
          {/* Leads */}
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-semibold text-white flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-indigo-400" />
                Сделки клиента ({leads.length})
              </h2>
            </div>

            {leads.length === 0 ? (
              <div className="py-8 text-center text-slate-500 text-xs">
                У клиента пока нет открытых или завершенных сделок
              </div>
            ) : (
              <div className="space-y-3">
                {leads.map((lead) => (
                  <Link
                    key={lead.id}
                    href={`/leads/${lead.id}`}
                    className="block p-4 rounded-xl bg-slate-950/60 border border-slate-800 hover:border-indigo-500/50 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span
                          className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                            lead.status === "won"
                              ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                              : lead.status === "lost"
                              ? "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                              : "bg-indigo-500/10 text-indigo-400 border border-indigo-500/20"
                          }`}
                        >
                          {lead.status}
                        </span>
                        <span className="text-xs text-slate-400">
                          Источник: {lead.source}
                        </span>
                      </div>
                      <div className="text-sm font-bold text-white">
                        {lead.value ? `${lead.value.toLocaleString("ru-RU")} ₽` : "Без суммы"}
                      </div>
                    </div>
                    {lead.notes && (
                      <p className="mt-2 text-xs text-slate-400 truncate">{lead.notes}</p>
                    )}
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Tasks */}
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-sm">
            <h2 className="text-base font-semibold text-white flex items-center gap-2 mb-4">
              <CheckCircle2 className="w-4 h-4 text-indigo-400" />
              Задачи по клиенту ({tasks.length})
            </h2>
            {tasks.length === 0 ? (
              <div className="py-6 text-center text-slate-500 text-xs">
                Нет привязанных задач
              </div>
            ) : (
              <div className="space-y-2">
                {tasks.map((task) => (
                  <div
                    key={task.id}
                    className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center gap-2.5">
                      <div
                        className={`w-2 h-2 rounded-full ${
                          task.status === "done" ? "bg-emerald-400" : "bg-amber-400"
                        }`}
                      />
                      <span className="font-medium text-slate-200">{task.title}</span>
                    </div>
                    <div className="flex items-center gap-4 text-slate-500">
                      {task.due_date && <span>Срок: {task.due_date}</span>}
                      <span className="text-indigo-400 font-medium">
                        {task.assigned_name || "Не назначен"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal create Lead */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-bold text-white">Создать новую сделку</h3>
              <button onClick={() => setModalOpen(false)} className="text-slate-400 hover:text-white p-1">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleCreateLead} className="space-y-4 text-sm">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">
                  Сумма сделки (₽)
                </label>
                <input
                  type="number"
                  placeholder="50000"
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Источник</label>
                <select
                  value={source}
                  onChange={(e) => setSource(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-indigo-500"
                >
                  <option value="manual">Вручную</option>
                  <option value="phone">Телефон</option>
                  <option value="website_form">Форма с сайта</option>
                  <option value="telegram_bot">Telegram бот</option>
                  <option value="referral">Рекомендация</option>
                  <option value="other">Другое</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Заметки</label>
                <textarea
                  rows={3}
                  placeholder="Детали сделки..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-indigo-500"
                />
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
                >
                  Отмена
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-lg shadow-indigo-500/20"
                >
                  {saving ? "Создание..." : "Создать сделку"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AppLayout>
  );
}
