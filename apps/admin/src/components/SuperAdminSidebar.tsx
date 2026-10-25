import React from "react";
import {
  LayoutDashboard,
  Globe,
  Inbox,
  Briefcase,
  ShieldCheck,
  ExternalLink,
  FileCheck2,
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
      badgeColor: "bg-[#00C7BE]/20 text-[#00C7BE] border-[#00C7BE]/40",
    },
    {
      id: "leads" as AdminTab,
      label: "Website Lead Collector",
      icon: Inbox,
      badge: leadsCount > 0 ? `${leadsCount} Leads` : undefined,
      badgeColor: "bg-[#FF6B00] text-white border-transparent",
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
    <aside className="w-64 bg-[#061E1B] text-slate-300 flex flex-col justify-between shrink-0 h-[calc(100vh-4rem)] sticky top-16 select-none border-r border-teal-950/80 font-sans">
      <div className="py-4 px-3 space-y-4 overflow-y-auto">
        {/* Navigation Section */}
        <div className="space-y-1">
          <div className="px-3 pb-1 text-[10px] font-bold text-teal-400 uppercase tracking-wider">
            Super Admin Controls
          </div>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
                  isActive
                    ? "bg-[#007A6C] text-white shadow-sm font-semibold"
                    : "text-slate-300 hover:bg-teal-950/60 hover:text-white"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className={`w-4 h-4 ${isActive ? "text-[#00C7BE]" : "text-slate-400"}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span
                    className={`text-[9px] px-2 py-0.5 rounded-full font-bold uppercase border ${
                      item.badgeColor || "bg-teal-950 text-slate-300 border-teal-800"
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
        <div className="pt-3 border-t border-teal-900/40 space-y-2">
          <div className="px-3 pb-1 text-[10px] font-bold text-teal-400/80 uppercase tracking-wider">
            Operational ERP
          </div>
          <a
            href="/case-management/"
            className="flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold text-teal-200 hover:text-white bg-teal-950/40 hover:bg-[#007A6C]/40 border border-teal-800/40 transition group"
          >
            <div className="flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-[#00C7BE]" />
              <span>Case Operations CMS</span>
            </div>
            <ExternalLink className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100 transition text-[#00C7BE]" />
          </a>
        </div>
      </div>

      <div className="p-3 border-t border-teal-950/80 text-[11px] text-teal-200/60 space-y-1.5">
        <div className="flex items-center gap-2 px-2 text-teal-300">
          <FileCheck2 className="w-4 h-4 text-[#00C7BE]" />
          <span>DPDP 2023 Compliant</span>
        </div>
        <div className="px-2 text-[10px] text-teal-400/50">
          Akeezo Healthcare Enterprise Suite
        </div>
      </div>
    </aside>
  );
};
