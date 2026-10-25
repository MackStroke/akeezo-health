import React from "react";
import {
  LayoutDashboard,
  FolderKanban,
  Users,
  Building2,
  DollarSign,
  FileCheck2,
  Globe,
  Palette,
  FileText,
  Inbox,
  ShieldCheck,
} from "lucide-react";

export type NavTab = "board" | "cases" | "partners" | "hospitals" | "finance" | "site-admin";

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

  const cmsNavItems = [
    { id: "site-admin" as NavTab, label: "Website CMS & Content", icon: Globe, badge: "Live" },
  ];

  return (
    <aside className="w-60 bg-slate-900 text-slate-300 flex flex-col justify-between shrink-0 h-[calc(100vh-4rem)] sticky top-16 select-none border-r border-slate-800">
      <div className="py-4 px-3 space-y-4 overflow-y-auto">
        {/* Section 1: Case ERP */}
        <div className="space-y-1">
          <div className="px-3 pb-1 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
            Case Operations (B2B)
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

        {/* Section 2: Website CMS Frontend Management */}
        <div className="space-y-1 pt-2 border-t border-slate-800">
          <div className="px-3 pb-1 text-[10px] font-bold text-teal-400 uppercase tracking-wider flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-teal-400" />
            <span>Public Site Frontend</span>
          </div>
          {cmsNavItems.map((item) => {
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
                  <span className="text-[9px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-1.5 py-0.5 rounded font-bold uppercase">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      <div className="p-3 border-t border-slate-800 text-[11px] text-slate-400 space-y-2">
        <div className="flex items-center gap-2 px-2 text-slate-400">
          <FileCheck2 className="w-4 h-4 text-emerald-400" />
          <span>DPDP 2023 Compliant</span>
        </div>
        <div className="px-2 text-[10px] text-slate-500">
          Version 0.1 · CMS & ERP Monorepo
        </div>
      </div>
    </aside>
  );
};
