"use client";

import { useEffect, useState } from "react";
import { Client } from "../../types/crm.types";
import { X, UserPlus, Users } from "lucide-react";

interface Props {
  onClose: () => void;
  onSuccess: () => void;
}

export default function LeadForm({ onClose, onSuccess }: Props) {
  const [clients, setClients] = useState<Client[]>([]);
  const [mode, setMode] = useState<"existing" | "new">("existing");
  const [loadingClients, setLoadingClients] = useState(true);

  // Lead fields
  const [clientId, setClientId] = useState("");
  const [source, setSource] = useState("manual");
  const [value, setValue] = useState("");
  const [notes, setNotes] = useState("");

  // New Client fields
  const [newClientName, setNewClientName] = useState("");
  const [newClientPhone, setNewClientPhone] = useState("");
  const [newClientEmail, setNewClientEmail] = useState("");

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/clients")
      .then((res) => res.json())
      .then((data) => {
        setClients(data.clients || []);
        if (data.clients && data.clients.length > 0) {
          setClientId(data.clients[0].id);
        } else {
          setMode("new");
        }
      })
      .catch(console.error)
      .finally(() => setLoadingClients(false));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSaving(true);

    try {
      let finalClientId = clientId;

      // If creating new client on the fly
      if (mode === "new") {
        if (!newClientName || !newClientPhone) {
          setError("Укажите имя и телефон нового клиента");
          setSaving(false);
          return;
        }

        const clientRes = await fetch("/api/clients", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: newClientName,
            phone: newClientPhone,
            email: newClientEmail,
          }),
        });

        if (!clientRes.ok) {
          const err = await clientRes.json();
          throw new Error(err.error || "Не удалось создать клиента");
        }

        const clientData = await clientRes.json();
        finalClientId = clientData.client.id;
      }

      if (!finalClientId) {
        setError("Выберите или создайте клиента");
        setSaving(false);
        return;
      }

      const leadRes = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          client_id: finalClientId,
          source,
          value: value ? parseFloat(value) : null,
          notes,
        }),
      });

      if (!leadRes.ok) {
        const err = await leadRes.json();
        throw new Error(err.error || "Не удалось создать сделку");
      }

      onSuccess();
      onClose();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Произошла ошибка");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-lg font-bold text-white">Новая сделка</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-xs">
            {error}
          </div>
        )}

        <div className="flex rounded-xl bg-slate-950 p-1 mb-5 border border-slate-800">
          <button
            type="button"
            onClick={() => setMode("existing")}
            className={`flex-1 py-1.5 text-xs font-semibold rounded-lg flex items-center justify-center gap-2 transition-colors ${
              mode === "existing" ? "bg-indigo-600 text-white shadow" : "text-slate-400 hover:text-white"
            }`}
          >
            <Users className="w-3.5 h-3.5" /> Выбрать существующего
          </button>
          <button
            type="button"
            onClick={() => setMode("new")}
            className={`flex-1 py-1.5 text-xs font-semibold rounded-lg flex items-center justify-center gap-2 transition-colors ${
              mode === "new" ? "bg-indigo-600 text-white shadow" : "text-slate-400 hover:text-white"
            }`}
          >
            <UserPlus className="w-3.5 h-3.5" /> Создать нового
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-sm">
          {mode === "existing" ? (
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Клиент *</label>
              {loadingClients ? (
                <div className="text-xs text-slate-500">Загрузка клиентов...</div>
              ) : (
                <select
                  value={clientId}
                  onChange={(e) => setClientId(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-indigo-500"
                >
                  {clients.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.phone})
                    </option>
                  ))}
                </select>
              )}
            </div>
          ) : (
            <div className="space-y-3 p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80">
              <div>
                <label className="block text-[11px] font-medium text-slate-400 mb-1">Имя клиента *</label>
                <input
                  type="text"
                  required
                  placeholder="Иван Петров"
                  value={newClientName}
                  onChange={(e) => setNewClientName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-white text-xs"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-medium text-slate-400 mb-1">Телефон *</label>
                  <input
                    type="text"
                    required
                    placeholder="+7 (999) 000-00-00"
                    value={newClientPhone}
                    onChange={(e) => setNewClientPhone(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-white text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-slate-400 mb-1">Email</label>
                  <input
                    type="email"
                    placeholder="client@mail.com"
                    value={newClientEmail}
                    onChange={(e) => setNewClientEmail(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-white text-xs"
                  />
                </div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Потенциал (₽)</label>
              <input
                type="number"
                placeholder="100000"
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
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">Заметки к сделке</label>
            <textarea
              rows={2}
              placeholder="Детали переговоров, интерес клиента..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={onClose}
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
  );
}
