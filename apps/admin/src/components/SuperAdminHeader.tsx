import React from "react";
import { Search, Globe, LogOut, ExternalLink, Briefcase, ShieldCheck } from "lucide-react";
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
    <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between sticky top-0 z-30 shadow-xs font-sans">
      <div className="flex items-center gap-6">
        {/* Official Brand Logo & Title */}
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
              <span className="text-[10px] font-bold bg-[#FF6B00] text-white px-2 py-0.5 rounded-full uppercase tracking-wider shadow-2xs">
                Super Admin
              </span>
            </div>
            <span className="text-[10px] font-semibold text-slate-500 block">
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
            className="w-full bg-slate-100 hover:bg-slate-200/60 focus:bg-white text-xs pl-9 pr-3 py-1.5 rounded-lg border border-transparent focus:border-[#007A6C] focus:ring-1 focus:ring-[#00C7BE] focus:outline-none transition-all placeholder:text-slate-400"
          />
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Direct Link to Case Management System */}
        <a
          href="/case-management/"
          className="flex items-center gap-1.5 text-xs text-white font-bold bg-[#007A6C] hover:bg-[#005F54] active:scale-98 px-3.5 py-1.5 rounded-xl shadow-xs transition-all border border-[#007A6C]/30"
          title="Open Case Operations & Pipeline CMS"
        >
          <Briefcase className="w-3.5 h-3.5 text-[#00C7BE]" />
          <span>Case Operations CMS</span>
          <ExternalLink className="w-3 h-3 opacity-80" />
        </a>

        {/* Open Live Public Website */}
        <a
          href="/"
          target="_blank"
          rel="noreferrer"
          className="hidden md:flex items-center gap-1.5 text-xs text-slate-700 hover:text-[#007A6C] font-semibold border border-slate-200 hover:bg-slate-50 px-3 py-1.5 rounded-xl transition"
        >
          <Globe className="w-3.5 h-3.5 text-[#007A6C]" />
          <span>Live Site</span>
        </a>

        <div className="h-6 w-px bg-slate-200" />

        {/* User Profile & Sign Out */}
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-[#061E1B] text-[#00C7BE] border border-[#00C7BE]/30 font-bold flex items-center justify-center text-xs shadow-xs">
            {initials}
          </div>
          <div className="text-left text-xs hidden sm:block">
            <div className="font-semibold text-slate-800">{user?.name || "Super Admin"}</div>
            <div className="text-[10px] text-[#007A6C] font-bold uppercase tracking-wider">
              {user?.role?.replace(/_/g, " ") || "Administrator"}
            </div>
          </div>

          <button
            onClick={logout}
            title="Sign Out of Session"
            className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition ml-1"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
