import React from "react";
import {
  LayoutDashboard,
  FolderKanban,
  Users,
  Building2,
  DollarSign,
  FileCheck2,
} from "lucide-react";

export type NavTab = "board" | "cases" | "partners" | "hospitals" | "finance";

interface SidebarProps {
  activeTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  caseCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onSelectTab,
  caseCount,
}) => {
  const erpNavItems = [
    { id: "board" as NavTab, label: "Pipeline Board", icon: LayoutDashboard },
    { id: "cases" as NavTab, label: "All Cases", icon: FolderKanban, badge: caseCount },
    { id: "partners" as NavTab, label: "Partners", icon: Users },
    { id: "hospitals" as NavTab, label: "Hospital Network", icon: Building2 },
    { id: "finance" as NavTab, label: "Commission & Payouts", icon: DollarSign },
  ];

  return (
    <aside data-tour="nav-tabs" className="w-60 bg-[#061E1B] text-slate-300 flex flex-col justify-between shrink-0 h-[calc(100vh-4rem)] sticky top-16 select-none border-r border-teal-950/80 font-sans">
      <div className="py-4 px-3 space-y-4 overflow-y-auto">
        {/* Section 1: Case ERP */}
        <div className="space-y-1">
          <div className="px-3 pb-1 text-[10px] font-bold text-teal-400/80 uppercase tracking-wider">
            Case Operations (CMS)
          </div>
          {erpNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium transition-all ${
                  isActive
                    ? "bg-[#007A6C] text-white shadow-sm font-semibold"
                    : "text-slate-400 hover:bg-white/5 hover:text-white"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className={`w-4 h-4 ${isActive ? "text-[#00C7BE]" : "text-slate-400"}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge !== undefined && (
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                      isActive
                        ? "bg-[#FF6B00] text-white"
                        : "bg-teal-950/60 text-[#00C7BE] border border-teal-800/30"
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      <div className="p-3 border-t border-teal-950/80 text-[11px] text-slate-400 space-y-2">
        <div className="flex items-center gap-2 px-2 text-teal-300/80">
          <FileCheck2 className="w-4 h-4 text-[#00C7BE]" />
          <span>DPDP 2023 Compliant</span>
        </div>
        <div className="px-2 text-[10px] text-teal-500/70">
          Akeezo Case Management System
        </div>
      </div>
    </aside>
  );
};
