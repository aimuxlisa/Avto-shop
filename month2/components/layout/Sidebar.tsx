"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  KanbanSquare,
  Users2,
  CheckSquare2,
  ShieldAlert,
  LogOut,
  Building2
} from "lucide-react";

interface SidebarProps {
  userRole?: string;
  userName?: string;
  userAvatar?: string | null;
  onProfileUpdate?: () => void;
}

export default function Sidebar({
  userRole = "manager",
  userName = "Пользователь",
  userAvatar,
  onProfileUpdate,
}: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  };

  const navItems = [
    { label: "Дашборд", href: "/dashboard", icon: LayoutDashboard },
    { label: "Канбан сделок", href: "/leads", icon: KanbanSquare },
    { label: "Клиенты", href: "/clients", icon: Users2 },
    { label: "Задачи", href: "/tasks", icon: CheckSquare2 },
  ];

  if (userRole === "admin") {
    navItems.push({ label: "Сотрудники", href: "/users", icon: ShieldAlert });
  }

  return (
    <aside className="w-64 bg-slate-950/80 backdrop-blur-xl border-r border-slate-800 flex flex-col justify-between p-4 min-h-screen text-slate-300">
      <div>
        {/* Brand */}
        <div className="flex items-center gap-3 px-3 py-4 mb-6">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center text-white shadow-lg shadow-indigo-500/25">
            <Building2 className="w-6 h-6" />
          </div>
          <div>
            <div className="text-base font-bold tracking-tight text-white">Mulisa CRM</div>
            <div className="text-xs text-indigo-400 font-medium capitalize">
              {userRole === "admin" ? "Панель Администратора" : "Панель Менеджера"}
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 ${
                  isActive
                    ? "bg-indigo-600/20 text-indigo-300 border border-indigo-500/30 shadow-inner"
                    : "hover:bg-slate-900 hover:text-white text-slate-400"
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? "text-indigo-400" : "text-slate-500"}`} />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* User profile & Logout */}
      <div className="border-t border-slate-800/80 pt-4 px-2">
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={onProfileUpdate}
            title="Нажмите, чтобы настроить профиль и аватарку"
            className="flex items-center gap-2.5 truncate pr-2 group text-left hover:opacity-90 transition-opacity"
          >
            <div className="w-9 h-9 rounded-xl overflow-hidden bg-gradient-to-tr from-indigo-600 to-violet-500 text-white flex items-center justify-center font-bold text-xs shrink-0 border border-slate-700/80 shadow">
              {userAvatar ? (
                <img src={userAvatar} alt={userName} className="w-full h-full object-cover" />
              ) : (
                <span>{(userName || "U").charAt(0).toUpperCase()}</span>
              )}
            </div>
            <div className="flex flex-col truncate">
              <span className="text-xs font-semibold text-slate-200 group-hover:text-indigo-300 transition-colors truncate">
                {userName}
              </span>
              <span className="text-[10px] text-slate-500 font-mono capitalize">{userRole}</span>
            </div>
          </button>
          <button
            onClick={handleLogout}
            title="Выйти"
            className="p-2 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors shrink-0"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}
