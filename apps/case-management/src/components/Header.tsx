import React from "react";
import { Search, Plus, Bell, LogOut, Globe, ExternalLink, Briefcase } from "lucide-react";
import { useAuth } from "../context/AuthContext.js";
import type { NavTab } from "./Sidebar.js";

interface HeaderProps {
  activeTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  onOpenNewCase: () => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  onSelectTab,
  onOpenNewCase,
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
    : "AK";

  const isCmsMode = activeTab === "site-admin";

  return (
    <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between sticky top-0 z-30 shadow-xs">
      <div className="flex items-center gap-6">
        {/* Brand Logo & Name */}
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-teal-800 flex items-center justify-center text-white font-black tracking-tight text-lg shadow-xs">
            A
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-black text-lg tracking-tight text-teal-900 leading-none">
                AKEEZO
              </span>
              <span className="text-[9px] font-bold bg-teal-50 text-teal-800 border border-teal-200 px-1.5 py-0.2 rounded uppercase">
                Admin
              </span>
            </div>
            <span className="text-[10px] font-semibold text-slate-400 block">
              Healthcare Platform Suite
            </span>
          </div>
        </div>

        {/* Workspace Switcher Pills */}
        <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs">
          <button
            type="button"
            onClick={() => onSelectTab("board")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold transition ${
              !isCmsMode
                ? "bg-white text-teal-900 shadow-xs border border-slate-200/60"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            <Briefcase className="w-3.5 h-3.5" />
            <span>Case Operations (ERP)</span>
          </button>

          <button
            type="button"
            onClick={() => onSelectTab("site-admin")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold transition ${
              isCmsMode
                ? "bg-teal-800 text-white shadow-xs"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            <Globe className="w-3.5 h-3.5" />
            <span>Website CMS & Content</span>
          </button>
        </div>

        {/* Global Search (Active during ERP mode) */}
        {!isCmsMode && (
          <div className="relative w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search cases, patients, passport, partner..."
              className="w-full bg-slate-100 hover:bg-slate-200/70 focus:bg-white text-xs pl-9 pr-3 py-1.5 rounded-lg border border-transparent focus:border-teal-600 focus:outline-none transition-all placeholder:text-slate-400"
            />
          </div>
        )}
      </div>

      <div className="flex items-center gap-3">
        {/* Open Public Site in New Tab */}
        <a
          href="http://localhost:4000/"
          target="_blank"
          rel="noreferrer"
          className="hidden md:flex items-center gap-1.5 text-xs text-teal-700 hover:text-teal-900 font-bold border border-teal-600 hover:bg-teal-50 px-3 py-1.5 rounded-lg transition"
        >
          <Globe className="w-3.5 h-3.5" />
          <span>View Public Site</span>
          <ExternalLink className="w-3 h-3 opacity-60" />
        </a>

        {!isCmsMode && (
          <button
            onClick={onOpenNewCase}
            className="flex items-center gap-1.5 bg-teal-800 hover:bg-teal-900 active:bg-teal-950 text-white text-xs font-semibold px-3 py-1.5 rounded-lg shadow-xs transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>New Case</span>
          </button>
        )}

        <div className="h-6 w-px bg-slate-200" />

        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-teal-800 text-white font-bold flex items-center justify-center text-xs shadow-xs">
            {initials}
          </div>
          <div className="text-left text-xs hidden sm:block">
            <div className="font-semibold text-slate-800">{user?.name || "Staff User"}</div>
            <div className="text-[10px] text-teal-700 font-bold uppercase tracking-wider">
              {user?.role || "Admin"}
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
