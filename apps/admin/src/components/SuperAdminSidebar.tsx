import React, { useEffect } from "react";
import {
  LayoutDashboard,
  FileText,
  Image as ImageIcon,
  Inbox,
  Share2,
  Users,
  History,
  Settings,
  Briefcase,
  ExternalLink,
  FileCheck2,
  X,
} from "lucide-react";

export type AdminTab =
  | "overview"
  | "content"
  | "media"
  | "enquiries"
  | "seo"
  | "users"
  | "activity"
  | "settings"
  | "cases-admin";

interface SidebarProps {
  activeTab: AdminTab;
  onSelectTab: (tab: AdminTab) => void;
  leadsCount?: number;
  isMobileOpen: boolean;
  onCloseMobile: () => void;
}

export const SuperAdminSidebar: React.FC<SidebarProps> = ({
  activeTab,
  onSelectTab,
  leadsCount = 0,
  isMobileOpen,
  onCloseMobile,
}) => {
  // Close drawer on Escape key for accessibility on mobile
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isMobileOpen) {
        onCloseMobile();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isMobileOpen, onCloseMobile]);

  // Exact 8 items in requested order:
  // 1. Dashboard, 2. Content, 3. Media Library, 4. Enquiries, 5. SEO & Redirects, 6. Users & Roles, 7. Activity Log, 8. Settings
  const navItems = [
    {
      id: "overview" as AdminTab,
      label: "Dashboard",
      icon: LayoutDashboard,
      path: "/admin",
    },
    {
      id: "content" as AdminTab,
      label: "Content",
      icon: FileText,
      badge: "Pages & Nav",
      badgeColor: "bg-[#00C7BE]/20 text-[#00C7BE] border-[#00C7BE]/40",
      path: "/admin/content",
    },
    {
      id: "media" as AdminTab,
      label: "Media Library",
      icon: ImageIcon,
      path: "/admin/media",
    },
    {
      id: "enquiries" as AdminTab,
      label: "Enquiries",
      icon: Inbox,
      badge: leadsCount > 0 ? `${leadsCount}` : undefined,
      badgeColor: "bg-[#FF6B00] text-white border-transparent",
      path: "/admin/enquiries",
    },
    {
      id: "seo" as AdminTab,
      label: "SEO & Redirects",
      icon: Share2,
      path: "/admin/seo",
    },
    {
      id: "users" as AdminTab,
      label: "Users & Roles",
      icon: Users,
      path: "/admin/users",
    },
    {
      id: "activity" as AdminTab,
      label: "Activity Log",
      icon: History,
      path: "/admin/activity",
    },
    {
      id: "settings" as AdminTab,
      label: "Settings",
      icon: Settings,
      path: "/admin/settings",
    },
  ];

  const sidebarContent = (
    <div
      className="flex flex-col justify-between h-full font-sans select-none"
      style={{
        backgroundColor: "var(--admin-sidebar-bg, #061E1B)",
        color: "var(--admin-sidebar-text, #F4F6F9)",
      }}
    >
      {/* Top Navigation Scrollable Region */}
      <div className="py-4 px-3 space-y-4 overflow-y-auto flex-1">
        {/* Mobile Header in Drawer */}
        <div className="md:hidden flex items-center justify-between pb-3 border-b border-teal-900/60">
          <div className="flex items-center gap-2">
            <img src="/logo/favicon.svg" alt="Akeezo" className="w-7 h-7" />
            <span className="font-bold text-white text-sm">AKEEZO Admin</span>
          </div>
          <button
            onClick={onCloseMobile}
            className="p-1 text-slate-400 hover:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00C7BE]"
            aria-label="Close menu drawer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Section 1: Administration Modules */}
        <div className="space-y-1">
          <div className="px-3 pb-1 text-[10px] font-bold text-teal-400 uppercase tracking-wider">
            Administration Modules
          </div>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  onSelectTab(item.id);
                  if (isMobileOpen) onCloseMobile();
                }}
                style={{
                  backgroundColor: isActive
                    ? "var(--admin-sidebar-active, var(--admin-primary, #007A6C))"
                    : undefined,
                }}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all group focus:outline-none focus:ring-2 focus:ring-[#00C7BE] ${
                  isActive
                    ? "text-white shadow-sm font-semibold"
                    : "text-slate-300 hover:bg-teal-950/60 hover:text-white"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={`w-4 h-4 shrink-0 transition-colors ${
                      isActive ? "text-[#00C7BE]" : "text-slate-400 group-hover:text-[#00C7BE]"
                    }`}
                  />
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

        {/* Section 2: Case Operations ERP Shortcut */}
        <div className="pt-3 border-t border-teal-900/40 space-y-1.5">
          <div className="px-3 pb-1 text-[10px] font-bold text-teal-400/80 uppercase tracking-wider">
            Operational ERP
          </div>
          <a
            href="/case-management/"
            target="_blank"
            rel="noreferrer"
            className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold text-teal-200 hover:text-white bg-teal-950/40 hover:bg-[#007A6C]/30 border border-teal-800/40 transition group focus:outline-none focus:ring-2 focus:ring-[#00C7BE]"
            title="Open Case Operations & Pipeline CMS"
          >
            <div className="flex items-center gap-2.5">
              <Briefcase className="w-4 h-4 shrink-0 text-[#00C7BE]" />
              <span>Case Operations CMS</span>
            </div>
            <ExternalLink className="w-3.5 h-3.5 text-[#00C7BE]/80 opacity-70 group-hover:opacity-100 transition" />
          </a>
        </div>
      </div>

      {/* Bottom Pinned Footer: Compliance & System Status (Locked) */}
      <div
        className="p-3.5 border-t border-teal-950/80 text-[11px] text-teal-200/70 space-y-2 shrink-0"
        style={{ backgroundColor: "var(--admin-sidebar-bg, #061E1B)" }}
      >
        <div className="flex items-center justify-between px-2">
          <div className="flex items-center gap-2 text-teal-300/90 font-semibold">
            <FileCheck2 className="w-4 h-4 text-[#00C7BE] shrink-0" />
            <span>DPDP 2023 Compliant</span>
          </div>
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" title="System Online" />
        </div>
        <div className="px-2 text-[10px] text-teal-400/50">
          Akeezo Healthcare Enterprise Suite
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* 1. Desktop Locked Persistent Sidebar */}
      <aside
        className="hidden md:flex flex-col text-slate-300 w-64 shrink-0 h-full border-r border-teal-950/80 z-20"
        style={{ backgroundColor: "var(--admin-sidebar-bg, #061E1B)" }}
      >
        {sidebarContent}
      </aside>

      {/* 2. Mobile Menu Drawer Backdrop */}
      {isMobileOpen && (
        <div
          onClick={onCloseMobile}
          className="md:hidden fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-40 transition-opacity"
          aria-hidden="true"
        />
      )}

      {/* 3. Mobile Menu Drawer */}
      <div
        className={`md:hidden fixed inset-y-0 left-0 w-72 text-slate-300 shadow-2xl z-50 transform transition-transform duration-200 ease-in-out ${
          isMobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        style={{ backgroundColor: "var(--admin-sidebar-bg, #061E1B)" }}
        role="dialog"
        aria-modal="true"
        aria-label="Navigation drawer"
      >
        {sidebarContent}
      </div>
    </>
  );
};
