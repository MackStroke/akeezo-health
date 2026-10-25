import React from "react";
import {
  LayoutDashboard,
  Globe,
  Inbox,
  Briefcase,
  ShieldCheck,
  ExternalLink,
  FileCheck2,
  Users,
  Settings,
} from "lucide-react";

export type AdminTab = "overview" | "website" | "leads" | "cases-admin" | "rbac";

interface SidebarProps {
  activeTab: AdminTab;
  onSelectTab: (tab: AdminTab) => void;
  leadsCount?: number;
}

export const SuperAdminSidebar: React.FC<SidebarProps> = ({
  activeTab,
  onSelectTab,
  leadsCount = 0,
}) => {
  const navItems = [
    {
      id: "overview" as AdminTab,
      label: "Super Admin Overview",
      icon: LayoutDashboard,
    },
    {
      id: "website" as AdminTab,
      label: "Website Management & CMS",
      icon: Globe,
      badge: "Public Site",
    },
    {
      id: "leads" as AdminTab,
      label: "Website Lead Collector",
      icon: Inbox,
      badge: leadsCount > 0 ? `${leadsCount} Leads` : undefined,
      badgeColor: "bg-amber-500/20 text-amber-300 border-amber-500/30",
    },
    {
      id: "cases-admin" as AdminTab,
      label: "Case Management Admin",
      icon: Briefcase,
    },
    {
      id: "rbac" as AdminTab,
      label: "Roles & Authorization",
      icon: ShieldCheck,
    },
  ];

  return (
    <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col justify-between shrink-0 h-[calc(100vh-4rem)] sticky top-16 select-none border-r border-slate-800">
      <div className="py-4 px-3 space-y-4 overflow-y-auto">
        {/* Navigation Section */}
        <div className="space-y-1">
          <div className="px-3 pb-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            Super Admin Controls
          </div>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium transition-all ${
                  isActive
                    ? "bg-teal-800 text-white shadow-sm font-semibold"
                    : "text-slate-400 hover:bg-slate-800 hover:text-slate-200"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className={`w-4 h-4 ${isActive ? "text-teal-300" : "text-slate-400"}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span
                    className={`text-[9px] px-1.5 py-0.5 rounded font-bold uppercase border ${
                      item.badgeColor || "bg-slate-800 text-slate-300 border-slate-700"
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Quick Launch Section */}
        <div className="pt-3 border-t border-slate-800/80 space-y-2">
          <div className="px-3 pb-1 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
            Managed Systems
          </div>
          <a
            href="/case-management/"
            className="flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-semibold text-indigo-300 hover:text-white bg-indigo-950/40 hover:bg-indigo-900/50 border border-indigo-800/40 transition group"
          >
            <div className="flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-indigo-400" />
              <span>Case Operations CMS</span>
            </div>
            <ExternalLink className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100 transition" />
          </a>
        </div>
      </div>

      <div className="p-3 border-t border-slate-800 text-[11px] text-slate-400 space-y-1.5">
        <div className="flex items-center gap-2 px-2 text-slate-400">
          <FileCheck2 className="w-4 h-4 text-emerald-400" />
          <span>DPDP 2023 Compliant</span>
        </div>
        <div className="px-2 text-[10px] text-slate-500">
          Akeezo Website Management (Super Admin)
        </div>
      </div>
    </aside>
  );
};
