import React from "react";
import { Search, Plus, LogOut, Globe, ExternalLink, ShieldAlert } from "lucide-react";
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

  return (
    <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between sticky top-0 z-30 shadow-xs font-sans">
      <div className="flex items-center gap-6">
        {/* Brand Logo & Name */}
        <div className="flex items-center gap-3">
          <img
            src="/logo/favicon.svg"
            alt="Akeezo Healthcare"
            className="w-9 h-9 object-contain shrink-0 drop-shadow-xs"
          />
          <div>
            <div className="flex items-center gap-2">
              <span className="font-black text-lg tracking-tight text-slate-900 leading-none">
                AKEEZO
              </span>
              <span className="text-[10px] font-bold bg-[#E6F8F6] text-[#007A6C] border border-[#00C7BE]/40 px-2 py-0.5 rounded uppercase tracking-wider">
                Case CMS
              </span>
            </div>
            <span className="text-[10px] font-semibold text-slate-500 block">
              Case Operations & Lead Processing
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
            placeholder="Search cases, patients, passport, partner..."
            className="w-full bg-slate-100 hover:bg-slate-200/70 focus:bg-white text-xs pl-9 pr-3 py-1.5 rounded-lg border border-transparent focus:border-[#007A6C] focus:ring-1 focus:ring-[#007A6C] focus:outline-none transition-all placeholder:text-slate-400"
          />
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Switch to Website Super Admin */}
        <a
          href="/admin/"
          className="flex items-center gap-1.5 text-xs text-[#00C7BE] hover:text-white font-bold bg-[#061E1B] hover:bg-[#0a2e29] border border-teal-800/50 px-3 py-1.5 rounded-lg transition shadow-2xs group"
          title="Open Website Management Super Admin Portal"
        >
          <ShieldAlert className="w-3.5 h-3.5 text-[#00C7BE]" />
          <span>Website Super Admin</span>
          <ExternalLink className="w-3 h-3 opacity-60 group-hover:opacity-100" />
        </a>

        {/* Open Public Site in New Tab */}
        <a
          href="/"
          target="_blank"
          rel="noreferrer"
          className="hidden md:flex items-center gap-1.5 text-xs text-slate-600 hover:text-slate-900 font-semibold border border-slate-200 hover:bg-slate-50 px-3 py-1.5 rounded-lg transition"
        >
          <Globe className="w-3.5 h-3.5" />
          <span>Public Site</span>
        </a>

        {/* New Case Intake Button */}
        <button
          onClick={onOpenNewCase}
          className="flex items-center gap-1.5 bg-[#FF6B00] hover:bg-[#FF6D1B] active:bg-[#E05E00] text-white text-xs font-bold px-3.5 py-1.5 rounded-lg shadow-xs transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>New Case Intake</span>
        </button>

        <div className="h-6 w-px bg-slate-200" />

        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-[#007A6C] text-white font-bold flex items-center justify-center text-xs shadow-xs">
            {initials}
          </div>
          <div className="text-left text-xs hidden sm:block">
            <div className="font-semibold text-slate-800">{user?.name || "Staff User"}</div>
            <div className="text-[10px] text-[#007A6C] font-bold uppercase tracking-wider">
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
