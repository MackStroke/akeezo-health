import React, { useEffect, useState } from "react";
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
  PanelLeftClose,
  PanelLeftOpen,
  Stethoscope,
  Building2,
  Activity,
  MapPin,
  BookOpen,
  MessageSquare,
} from "lucide-react";

export type AdminTab =
  | "overview"
  | "doctors"
  | "hospitals"
  | "treatments"
  | "destinations"
  | "blog"
  | "community"
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
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

export const SuperAdminSidebar: React.FC<SidebarProps> = ({
  activeTab,
  onSelectTab,
  leadsCount = 0,
  isMobileOpen,
  onCloseMobile,
  isCollapsed: propIsCollapsed,
  onToggleCollapse: propOnToggleCollapse,
}) => {
  // Manage collapsed state with local storage persistence and prop fallback
  const [internalCollapsed, setInternalCollapsed] = useState<boolean>(() => {
    try {
      return localStorage.getItem("akeezo_admin_sidebar_collapsed") === "true";
    } catch {
      return false;
    }
  });

  const isCollapsed = propIsCollapsed !== undefined ? propIsCollapsed : internalCollapsed;

  const handleToggleCollapse = () => {
    if (propOnToggleCollapse) {
      propOnToggleCollapse();
    } else {
      setInternalCollapsed((prev) => {
        const next = !prev;
        try {
          localStorage.setItem("akeezo_admin_sidebar_collapsed", String(next));
        } catch {
          // ignore
        }
        return next;
      });
    }
  };

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

  const navItems = [
    {
      id: "overview" as AdminTab,
      label: "Dashboard",
      icon: LayoutDashboard,
      path: "/admin",
    },
    {
      id: "doctors" as AdminTab,
      label: "Doctors",
      icon: Stethoscope,
      badge: "Specialists",
      badgeColor: "bg-teal-500/20 text-[#00C7BE] border-teal-500/30",
      path: "/admin/doctors",
    },
    {
      id: "hospitals" as AdminTab,
      label: "Hospitals",
      icon: Building2,
      badge: "Centres",
      badgeColor: "bg-blue-500/20 text-blue-300 border-blue-500/30",
      path: "/admin/hospitals",
    },
    {
      id: "treatments" as AdminTab,
      label: "Treatments",
      icon: Activity,
      badge: "Procedures",
      badgeColor: "bg-amber-500/20 text-amber-300 border-amber-500/30",
      path: "/admin/treatments",
    },
    {
      id: "destinations" as AdminTab,
      label: "Destinations",
      icon: MapPin,
      badge: "Global",
      badgeColor: "bg-purple-500/20 text-purple-300 border-purple-500/30",
      path: "/admin/destinations",
    },
    {
      id: "blog" as AdminTab,
      label: "Blogs & Guides",
      icon: BookOpen,
      badge: "Articles",
      badgeColor: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
      path: "/admin/blog",
    },
    {
      id: "community" as AdminTab,
      label: "Community Q&A",
      icon: MessageSquare,
      badge: "Discussions",
      badgeColor: "bg-teal-500/20 text-[#00C7BE] border-teal-500/30",
      path: "/admin/community",
    },
    {
      id: "content" as AdminTab,
      label: "All Pages CMS",
      icon: FileText,
      badge: "Revisions",
      badgeColor: "bg-teal-950 text-slate-300 border-teal-800",
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
      badge: "Changelog",
      badgeColor: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
      path: "/admin/activity",
    },
    {
      id: "settings" as AdminTab,
      label: "Settings",
      icon: Settings,
      path: "/admin/settings",
    },
  ];

  const renderSidebarContent = (collapsed: boolean) => (
    <div
      className="flex flex-col justify-between h-full font-sans select-none overflow-x-hidden"
      style={{
        backgroundColor: "var(--admin-sidebar-bg, #061E1B)",
        color: "var(--admin-sidebar-text, #F4F6F9)",
      }}
    >
      {/* Top Navigation Scrollable Region */}
      <div className={`py-3.5 ${collapsed ? "px-2" : "px-3"} space-y-3 overflow-y-auto overflow-x-hidden flex-1`}>
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

        {/* Desktop Header Row: Title & Minimize / Maximize Toggle */}
        <div className="hidden md:flex items-center justify-between pb-2 border-b border-teal-900/50">
          {!collapsed ? (
            <>
              <div className="flex items-center gap-2">
                <img src="/logo/favicon.svg" alt="Akeezo" className="w-5 h-5" />
                <span className="text-[10px] font-bold text-teal-400 uppercase tracking-wider">
                  Administration
                </span>
              </div>
              <button
                type="button"
                onClick={handleToggleCollapse}
                className="p-1 text-teal-300/70 hover:text-white hover:bg-teal-900/60 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-[#00C7BE]"
                title="Minimize sidebar (Collapse)"
                aria-label="Minimize sidebar"
              >
                <PanelLeftClose className="w-4 h-4" />
              </button>
            </>
          ) : (
            <div className="w-full flex items-center justify-center">
              <button
                type="button"
                onClick={handleToggleCollapse}
                className="p-1.5 text-teal-300/80 hover:text-white hover:bg-teal-900/60 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-[#00C7BE]"
                title="Maximize sidebar (Expand)"
                aria-label="Maximize sidebar"
              >
                <PanelLeftOpen className="w-4 h-4 text-[#00C7BE]" />
              </button>
            </div>
          )}
        </div>

        {/* Section 1: Administration Modules */}
        <div className="space-y-1">
          {!collapsed && (
            <div className="px-3 pb-1 text-[10px] font-bold text-teal-400 uppercase tracking-wider">
              Modules
            </div>
          )}
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            const tooltipText = `${item.label}${item.badge ? ` (${item.badge})` : ""}`;

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
                title={collapsed ? tooltipText : undefined}
                className={`w-full flex items-center ${
                  collapsed ? "justify-center p-2.5 relative" : "justify-between px-3.5 py-2.5"
                } rounded-xl text-xs font-medium transition-all group focus:outline-none focus:ring-2 focus:ring-[#00C7BE] ${
                  isActive
                    ? "text-white shadow-sm font-semibold"
                    : "text-slate-300 hover:bg-teal-950/60 hover:text-white"
                }`}
              >
                <div className={`flex items-center ${collapsed ? "justify-center" : "gap-3"}`}>
                  <Icon
                    className={`w-4 h-4 shrink-0 transition-colors ${
                      isActive ? "text-[#00C7BE]" : "text-slate-400 group-hover:text-[#00C7BE]"
                    }`}
                  />
                  {!collapsed && <span className="truncate">{item.label}</span>}
                </div>

                {!collapsed && item.badge && (
                  <span
                    className={`text-[9px] px-2 py-0.5 rounded-full font-bold uppercase border shrink-0 ${
                      item.badgeColor || "bg-teal-950 text-slate-300 border-teal-800"
                    }`}
                  >
                    {item.badge}
                  </span>
                )}

                {collapsed && item.id === "enquiries" && leadsCount > 0 && (
                  <span
                    className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#FF6B00] ring-2 ring-[#061E1B]"
                    title={`${leadsCount} Enquiries`}
                  />
                )}
              </button>
            );
          })}
        </div>

        {/* Section 2: Case Operations ERP Shortcut */}
        <div className="pt-2.5 border-t border-teal-900/40 space-y-1">
          {!collapsed && (
            <div className="px-3 pb-1 text-[10px] font-bold text-teal-400/80 uppercase tracking-wider">
              Operational ERP
            </div>
          )}
          <a
            href="/case-management/"
            target="_blank"
            rel="noreferrer"
            className={`w-full flex items-center ${
              collapsed ? "justify-center p-2.5" : "justify-between px-3.5 py-2.5"
            } rounded-xl text-xs font-semibold text-teal-200 hover:text-white bg-teal-950/40 hover:bg-[#007A6C]/30 border border-teal-800/40 transition group focus:outline-none focus:ring-2 focus:ring-[#00C7BE]`}
            title="Open Case Operations & Pipeline CMS"
          >
            <div className={`flex items-center ${collapsed ? "justify-center" : "gap-2.5"}`}>
              <Briefcase className="w-4 h-4 shrink-0 text-[#00C7BE]" />
              {!collapsed && <span className="truncate">Case Operations CMS</span>}
            </div>
            {!collapsed && (
              <ExternalLink className="w-3.5 h-3.5 text-[#00C7BE]/80 opacity-70 group-hover:opacity-100 transition shrink-0" />
            )}
          </a>
        </div>
      </div>

      {/* Bottom Pinned Footer: Minimize Toggle & DPDP Compliance (Locked) */}
      <div
        className={`${collapsed ? "p-2 space-y-2" : "p-3 space-y-2.5"} border-t border-teal-950/80 text-[11px] text-teal-200/70 shrink-0`}
        style={{ backgroundColor: "var(--admin-sidebar-bg, #061E1B)" }}
      >
        {/* Ergonomic Bottom Collapse/Expand Button for Desktop */}
        <button
          type="button"
          onClick={handleToggleCollapse}
          className={`hidden md:flex w-full items-center ${
            collapsed ? "justify-center p-2" : "justify-between px-2.5 py-1.5"
          } rounded-lg text-xs font-medium text-teal-300/80 hover:text-white hover:bg-teal-950/80 border border-teal-900/40 transition focus:outline-none focus:ring-2 focus:ring-[#00C7BE]`}
          title={collapsed ? "Maximize sidebar (Expand)" : "Minimize sidebar (Collapse)"}
          aria-label={collapsed ? "Maximize sidebar" : "Minimize sidebar"}
        >
          {!collapsed ? (
            <>
              <div className="flex items-center gap-2">
                <PanelLeftClose className="w-3.5 h-3.5 text-[#00C7BE]" />
                <span className="text-[11px]">Minimize Sidebar</span>
              </div>
              <span className="text-[9px] uppercase tracking-wider text-teal-400/60 font-mono">
                Collapse
              </span>
            </>
          ) : (
            <PanelLeftOpen className="w-4 h-4 text-[#00C7BE]" />
          )}
        </button>

        {/* DPDP Compliance & Status */}
        {!collapsed ? (
          <>
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
          </>
        ) : (
          <div
            className="flex flex-col items-center justify-center gap-1 py-1"
            title="DPDP 2023 Compliant • System Online • Akeezo Healthcare"
          >
            <FileCheck2 className="w-4 h-4 text-[#00C7BE] shrink-0" />
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          </div>
        )}
      </div>
    </div>
  );

  return (
    <>
      {/* 1. Desktop Locked Persistent Sidebar */}
      <aside
        data-tour="admin-sidebar"
        className={`hidden md:flex flex-col text-slate-300 ${
          isCollapsed ? "w-16" : "w-64"
        } shrink-0 h-full border-r border-teal-950/80 z-20 transition-[width] duration-200 ease-in-out`}
        style={{ backgroundColor: "var(--admin-sidebar-bg, #061E1B)" }}
        aria-label="Admin Sidebar"
      >
        {renderSidebarContent(isCollapsed)}
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
        {renderSidebarContent(false)}
      </div>
    </>
  );
};
