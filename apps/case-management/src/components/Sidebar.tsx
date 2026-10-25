import React from "react";
import {
  LayoutDashboard,
  FolderKanban,
  Users,
  Building2,
  DollarSign,
  FileCheck2,
  ExternalLink,
  ShieldAlert,
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
    <aside className="w-60 bg-slate-900 text-slate-300 flex flex-col justify-between shrink-0 h-[calc(100vh-4rem)] sticky top-16 select-none border-r border-slate-800">
      <div className="py-4 px-3 space-y-4 overflow-y-auto">
        {/* Section 1: Case ERP */}
        <div className="space-y-1">
          <div className="px-3 pb-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
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
                    ? "bg-teal-700/80 text-white shadow-sm font-semibold"
                    : "text-slate-400 hover:bg-slate-800 hover:text-slate-200"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className={`w-4 h-4 ${isActive ? "text-teal-300" : "text-slate-400"}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge !== undefined && (
                  <span className="text-[10px] bg-slate-800 px-1.5 py-0.5 rounded text-slate-400 font-bold">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Section 2: Quick Jump to Website Super Admin */}
        <div className="pt-3 border-t border-slate-800/80">
          <div className="px-3 pb-1.5 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
            Cross-System Management
          </div>
          <a
            href="/admin/"
            className="flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium text-teal-300 hover:text-white bg-teal-950/40 hover:bg-teal-900/50 border border-teal-800/40 transition group"
          >
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-teal-400" />
              <span>Website Super Admin</span>
            </div>
            <ExternalLink className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100 transition" />
          </a>
        </div>
      </div>

      <div className="p-3 border-t border-slate-800 text-[11px] text-slate-400 space-y-2">
        <div className="flex items-center gap-2 px-2 text-slate-400">
          <FileCheck2 className="w-4 h-4 text-emerald-400" />
          <span>DPDP 2023 Compliant</span>
        </div>
        <div className="px-2 text-[10px] text-slate-500">
          Akeezo Case Management System
        </div>
      </div>
    </aside>
  );
};
