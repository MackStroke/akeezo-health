import React from "react";
import { Search, Globe, LogOut, ExternalLink, Briefcase, ShieldAlert, Sparkles } from "lucide-react";
import { useAuth } from "../context/AuthContext.js";

interface HeaderProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
}

export const SuperAdminHeader: React.FC<HeaderProps> = ({
  searchQuery,
  onSearchChange,
}) => {
  const { user, logout } = useAuth();

  const initials = user?.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "SA";

  return (
    <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between sticky top-0 z-30 shadow-xs">
      <div className="flex items-center gap-6">
        {/* Brand Logo & Name */}
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-teal-900 flex items-center justify-center text-white font-black tracking-tight text-lg shadow-xs">
            A
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-black text-lg tracking-tight text-teal-950 leading-none">
                AKEEZO
              </span>
              <span className="text-[9px] font-bold bg-teal-900 text-teal-100 border border-teal-800 px-1.5 py-0.2 rounded uppercase">
                Super Admin
              </span>
            </div>
            <span className="text-[10px] font-semibold text-slate-400 block">
              Website Management & System Administration
            </span>
          </div>
        </div>

        {/* Global Search */}
        <div className="relative w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search pages, leads, settings, or cases..."
            className="w-full bg-slate-100 hover:bg-slate-200/70 focus:bg-white text-xs pl-9 pr-3 py-1.5 rounded-lg border border-transparent focus:border-teal-700 focus:outline-none transition-all placeholder:text-slate-400"
          />
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Direct Link to Case Management System */}
        <a
          href="/case-management/"
          className="flex items-center gap-1.5 text-xs text-white font-bold bg-indigo-700 hover:bg-indigo-800 active:bg-indigo-900 px-3.5 py-1.5 rounded-lg shadow-xs transition"
          title="Open Case Operations & Pipeline CMS"
        >
          <Briefcase className="w-3.5 h-3.5" />
          <span>Case Management System</span>
          <ExternalLink className="w-3 h-3 opacity-70" />
        </a>

        {/* Open Live Public Website */}
        <a
          href="/"
          target="_blank"
          rel="noreferrer"
          className="hidden md:flex items-center gap-1.5 text-xs text-slate-600 hover:text-slate-900 font-semibold border border-slate-200 hover:bg-slate-50 px-3 py-1.5 rounded-lg transition"
        >
          <Globe className="w-3.5 h-3.5" />
          <span>Live Site</span>
        </a>

        <div className="h-6 w-px bg-slate-200" />

        {/* User Profile & Sign Out */}
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-teal-900 text-white font-bold flex items-center justify-center text-xs shadow-xs">
            {initials}
          </div>
          <div className="text-left text-xs hidden sm:block">
            <div className="font-semibold text-slate-800">{user?.name || "Super Admin"}</div>
            <div className="text-[10px] text-teal-800 font-bold uppercase tracking-wider">
              {user?.role?.replace(/_/g, " ") || "Administrator"}
            </div>
          </div>

          <button
            onClick={logout}
            title="Sign Out of Session"
            className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
