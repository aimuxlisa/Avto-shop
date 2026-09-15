"use client";

import { useEffect, useState } from "react";
import AppLayout from "../../components/layout/AppLayout";
import { Task, Client, User } from "../../types/crm.types";
import {
  Plus,
  Calendar,
  CheckCircle2,
  Circle,
  AlertTriangle,
  User as UserIcon,
  X,
  Filter
} from "lucide-react";

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filter, setFilter] = useState<"my" | "all">("my");
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  // New task modal
  const [modalOpen, setModalOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [selectedClientId, setSelectedClientId] = useState("");
  const [assignedTo, setAssignedTo] = useState("");

  const [clients, setClients] = useState<Client[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [saving, setSaving] = useState(false);

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/tasks?filter=${filter}`);
      if (res.ok) {
        const json = await res.json();
        setTasks(json.tasks || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        const admin = data?.user?.role === "admin";
        setIsAdmin(admin);
        if (admin) {
          fetch("/api/users")
            .then((res) => res.json())
            .then((d) => setUsers(d.users || []));
        }
      });

    fetch("/api/clients")
      .then((res) => res.json())
      .then((d) => setClients(d.clients || []));
  }, []);

  useEffect(() => {
    fetchTasks();
  }, [filter]);

  const toggleTaskStatus = async (task: Task) => {
    const nextStatus = task.status === "pending" ? "done" : "pending";

    // Optimistic update
    setTasks((prev) =>
      prev.map((t) => (t.id === task.id ? { ...t, status: nextStatus } : t))
    );

    try {
      const res = await fetch(`/api/tasks/${task.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: nextStatus }),
      });
      if (!res.ok) {
        fetchTasks();
      }
    } catch {
      fetchTasks();
    }
  };

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          due_date: dueDate || null,
          client_id: selectedClientId || null,
          assigned_to: assignedTo || undefined,
        }),
      });
      if (res.ok) {
        setTitle("");
        setDueDate("");
        setSelectedClientId("");
        setAssignedTo("");
        setModalOpen(false);
        fetchTasks();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  const today = new Date().toISOString().split("T")[0];

  return (
    <AppLayout
      title="Задачи и напоминания"
      subtitle="Контроль дедлайнов и назначенных задач"
      actions={
        <button
          onClick={() => setModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl shadow-lg shadow-indigo-500/20 transition-all"
        >
          <Plus className="w-4 h-4" />
          Новая задача
        </button>
      }
    >
      {/* Filter Tabs (My / All) */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex bg-slate-900 border border-slate-800 rounded-xl p-1">
          <button
            onClick={() => setFilter("my")}
            className={`px-4 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
              filter === "my"
                ? "bg-indigo-600 text-white shadow"
                : "text-slate-400 hover:text-white"
            }`}
          >
            Мои задачи
          </button>
          {isAdmin && (
            <button
              onClick={() => setFilter("all")}
              className={`px-4 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                filter === "all"
                  ? "bg-indigo-600 text-white shadow"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Все задачи сотрудников
            </button>
          )}
        </div>
      </div>

      {/* Task List */}
      <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl overflow-hidden backdrop-blur-sm divide-y divide-slate-800/60">
        {loading ? (
          <div className="py-12 text-center text-slate-500 text-sm">Загрузка задач...</div>
        ) : tasks.length === 0 ? (
          <div className="py-12 text-center text-slate-500 text-sm">
            Задач пока нет. Отличная работа!
          </div>
        ) : (
          tasks.map((task) => {
            const isDone = task.status === "done";
            const isOverdue =
              !isDone && task.due_date && task.due_date < today;

            return (
              <div
                key={task.id}
                onClick={() => toggleTaskStatus(task)}
                className={`p-4 flex items-center justify-between hover:bg-slate-800/40 transition-colors cursor-pointer select-none ${
                  isDone ? "opacity-60 bg-slate-950/20" : ""
                }`}
              >
                <div className="flex items-center gap-3.5">
                  <button
                    type="button"
                    className={`shrink-0 transition-transform active:scale-95 ${
                      isDone ? "text-emerald-400" : "text-slate-500 hover:text-slate-300"
                    }`}
                  >
                    {isDone ? (
                      <CheckCircle2 className="w-5 h-5 fill-emerald-500/20" />
                    ) : (
                      <Circle className="w-5 h-5" />
                    )}
                  </button>

                  <div>
                    <div
                      className={`text-sm font-semibold transition-all ${
                        isDone ? "line-through text-slate-500" : "text-slate-200"
                      }`}
                    >
                      {task.title}
                    </div>

                    <div className="flex items-center gap-3 mt-1 text-xs text-slate-500">
                      {task.client_name && (
                        <span>Клиент: <strong className="text-slate-400">{task.client_name}</strong></span>
                      )}
                      {isAdmin && task.assigned_name && (
                        <span className="flex items-center gap-1">
                          <UserIcon className="w-3 h-3 text-indigo-400" />
                          {task.assigned_name}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {task.due_date && (
                    <div
                      className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold ${
                        isDone
                          ? "bg-slate-800/50 text-slate-500"
                          : isOverdue
                          ? "bg-rose-500/10 text-rose-400 border border-rose-500/30 animate-pulse"
                          : "bg-slate-800 text-slate-400"
                      }`}
                    >
                      {isOverdue && <AlertTriangle className="w-3.5 h-3.5" />}
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{task.due_date}</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Create Task Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-bold text-white">Создать задачу</h3>
              <button onClick={() => setModalOpen(false)} className="text-slate-400 hover:text-white p-1">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleCreateTask} className="space-y-4 text-sm">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">
                  Название задачи *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Отправить коммерческое предложение"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">
                  Крайний срок (Due date)
                </label>
                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">
                  Привязать к клиенту (опционально)
                </label>
                <select
                  value={selectedClientId}
                  onChange={(e) => setSelectedClientId(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-indigo-500"
                >
                  <option value="">Без привязки</option>
                  {clients.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.phone})
                    </option>
                  ))}
                </select>
              </div>

              {isAdmin && (
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">
                    Назначить сотрудника
                  </label>
                  <select
                    value={assignedTo}
                    onChange={(e) => setAssignedTo(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-indigo-500"
                  >
                    <option value="">Себе</option>
                    {users.map((u) => (
                      <option key={u.id} value={u.id}>
                        {u.name} ({u.role})
                      </option>
                    ))}
                  </select>
                </div>
              )}

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
                  {saving ? "Создание..." : "Создать"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AppLayout>
  );
}
