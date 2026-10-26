import React from "react";
import { Search, Plus, LogOut, Compass } from "lucide-react";
import { useAuth } from "../context/AuthContext.js";
import type { NavTab } from "./Sidebar.js";

interface HeaderProps {
  activeTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  onOpenNewCase: () => void;
  onStartTour?: () => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenNewCase,
  onStartTour,
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
        <div data-tour="search-bar" className="relative w-80">
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
        {/* Platform Tour Guide Button */}
        {onStartTour && (
          <button
            data-tour="tour-btn"
            onClick={onStartTour}
            title="Start Interactive Platform Tour"
            className="flex items-center gap-1.5 bg-[#E6F8F6] hover:bg-[#d0f4f0] active:bg-[#b2ebe4] text-[#007A6C] border border-[#00C7BE]/30 text-xs font-bold px-3 py-1.5 rounded-lg shadow-2xs transition-all"
          >
            <Compass className="w-4 h-4 text-[#007A6C]" />
            <span className="hidden sm:inline">Platform Tour</span>
          </button>
        )}

        {/* New Case Intake Button */}
        <button
          data-tour="new-case-btn"
          onClick={onOpenNewCase}
          className="flex items-center gap-1.5 bg-[#FF6B00] hover:bg-[#FF6D1B] active:bg-[#E05E00] text-white text-xs font-bold px-3.5 py-1.5 rounded-lg shadow-xs transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>New Case Intake</span>
        </button>

        <div className="h-6 w-px bg-slate-200" />

        <div data-tour="user-profile" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-[#007A6C] text-white font-bold flex items-center justify-center text-xs shadow-xs">
            {initials}
          </div>
          <div className="text-left text-xs hidden sm:block">
            <div className="font-semibold text-slate-800">{user?.name || "Staff User"}</div>
            <div className="text-[10px] text-[#007A6C] font-bold uppercase tracking-wider">
              {user?.role || "User"}
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
