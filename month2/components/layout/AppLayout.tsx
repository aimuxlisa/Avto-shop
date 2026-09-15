"use client";

import { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import TopBar from "./TopBar";
import AvatarUpload from "../ui/AvatarUpload";
import { X, CheckCircle2 } from "lucide-react";

interface AppLayoutProps {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
  children: React.ReactNode;
}

export default function AppLayout({ title, subtitle, actions, children }: AppLayoutProps) {
  const [user, setUser] = useState<{
    role: string;
    name: string;
    email: string;
    avatar_url?: string | null;
  } | null>(null);

  // Profile modal
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [profileName, setProfileName] = useState("");
  const [profilePassword, setProfilePassword] = useState("");
  const [profileAvatar, setProfileAvatar] = useState<string | null>(null);
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileError, setProfileError] = useState("");
  const [profileToast, setProfileToast] = useState<string | null>(null);

  const fetchCurrentUser = () => {
    fetch("/api/auth/me")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.user) {
          setUser(data.user);
          setProfileName(data.user.name);
          setProfileAvatar(data.user.avatar_url || null);
        }
      })
      .catch(() => {});
  };

  useEffect(() => {
    fetchCurrentUser();
  }, []);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileError("");
    setSavingProfile(true);

    try {
      const body: Record<string, unknown> = {
        name: profileName,
        avatar_url: profileAvatar || null,
      };
      if (profilePassword.trim()) {
        body.password = profilePassword;
      }

      const res = await fetch("/api/auth/me", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (res.ok) {
        setProfileModalOpen(false);
        setProfilePassword("");
        fetchCurrentUser();
        setProfileToast("Профиль и аватарка успешно обновлены");
        setTimeout(() => setProfileToast(null), 3000);
      } else {
        const err = await res.json();
        setProfileError(err.error || "Ошибка сохранения");
      }
    } catch {
      setProfileError("Ошибка соединения с сервером");
    } finally {
      setSavingProfile(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-100">
      {profileToast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-3 bg-indigo-600 text-white rounded-xl shadow-2xl backdrop-blur-md text-xs font-semibold animate-in fade-in">
          <CheckCircle2 className="w-4 h-4" />
          {profileToast}
        </div>
      )}

      <Sidebar
        userRole={user?.role}
        userName={user?.name}
        userAvatar={user?.avatar_url}
        onProfileUpdate={() => setProfileModalOpen(true)}
      />

      <div className="flex-1 flex flex-col min-w-0">
        <TopBar
          title={title}
          subtitle={subtitle}
          actions={
            <div className="flex items-center gap-3">
              {actions}
              {user && (
                <button
                  type="button"
                  onClick={() => setProfileModalOpen(true)}
                  title="Мой профиль и фото"
                  className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-colors group"
                >
                  <div className="w-7 h-7 rounded-lg overflow-hidden bg-gradient-to-tr from-indigo-600 to-violet-500 text-white flex items-center justify-center font-bold text-xs shrink-0 border border-slate-700">
                    {user.avatar_url ? (
                      <img src={user.avatar_url} alt={user.name} className="w-full h-full object-cover" />
                    ) : (
                      <span>{(user.name || "U").charAt(0).toUpperCase()}</span>
                    )}
                  </div>
                  <span className="text-xs font-semibold text-slate-300 group-hover:text-white transition-colors">
                    {user.name}
                  </span>
                </button>
              )}
            </div>
          }
        />
        <main className="flex-1 p-8 overflow-y-auto max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>

      {/* Profile & Avatar Edit Modal for current user */}
      {profileModalOpen && user && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-bold text-white">Мой профиль</h3>
              <button
                onClick={() => setProfileModalOpen(false)}
                className="text-slate-400 hover:text-white p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {profileError && (
              <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-xs">
                {profileError}
              </div>
            )}

            <form onSubmit={handleSaveProfile} className="space-y-4 text-sm">
              <div className="flex flex-col items-center py-2">
                <label className="block text-xs font-medium text-slate-400 mb-2">
                  Аватарка профиля
                </label>
                <AvatarUpload
                  name={profileName}
                  currentAvatar={profileAvatar}
                  onAvatarChange={(url) => setProfileAvatar(url)}
                  size="lg"
                />
                <span className="text-[11px] text-slate-500 mt-1.5">
                  Нажмите на камеру, чтобы выбрать фото с компьютера
                </span>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Имя</label>
                <input
                  type="text"
                  required
                  value={profileName}
                  onChange={(e) => setProfileName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Email</label>
                <input
                  type="email"
                  disabled
                  value={user.email}
                  className="w-full px-3.5 py-2.5 bg-slate-950/60 border border-slate-800/80 rounded-xl text-slate-500 cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">
                  Новый пароль (оставьте пустым, если не меняете)
                </label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={profilePassword}
                  onChange={(e) => setProfilePassword(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setProfileModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
                >
                  Отмена
                </button>
                <button
                  type="submit"
                  disabled={savingProfile}
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-lg shadow-indigo-500/20"
                >
                  {savingProfile ? "Сохранение..." : "Сохранить профиль"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
