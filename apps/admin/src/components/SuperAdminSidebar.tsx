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
  ChevronLeft,
  ChevronRight,
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
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  isMobileOpen: boolean;
  onCloseMobile: () => void;
}

export const SuperAdminSidebar: React.FC<SidebarProps> = ({
  activeTab,
  onSelectTab,
  leadsCount = 0,
  isCollapsed,
  onToggleCollapse,
  isMobileOpen,
  onCloseMobile,
}) => {
  // Close drawer on Escape key for accessibility
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
    <div className="flex flex-col justify-between h-full font-sans select-none">
      <div className="py-4 px-3 space-y-4 overflow-y-auto">
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

        {/* Navigation List */}
        <div className="space-y-1">
          {!isCollapsed && (
            <div className="px-3 pb-1 text-[10px] font-bold text-teal-400 uppercase tracking-wider">
              Administration Modules
            </div>
          )}
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
                title={isCollapsed ? item.label : undefined}
                className={`w-full flex items-center ${
                  isCollapsed ? "justify-center px-2 py-3" : "justify-between px-3 py-2.5"
                } rounded-xl text-xs font-medium transition-all focus:outline-none focus:ring-2 focus:ring-[#00C7BE] ${
                  isActive
                    ? "bg-[#007A6C] text-white shadow-sm font-semibold"
                    : "text-slate-300 hover:bg-teal-950/60 hover:text-white"
                }`}
              >
                <div className={`flex items-center ${isCollapsed ? "justify-center" : "gap-3"}`}>
                  <Icon
                    className={`w-4 h-4 shrink-0 ${
                      isActive ? "text-[#00C7BE]" : "text-slate-400 group-hover:text-white"
                    }`}
                  />
                  {!isCollapsed && <span>{item.label}</span>}
                </div>
                {!isCollapsed && item.badge && (
                  <span
                    className={`text-[9px] px-2 py-0.5 rounded-full font-bold uppercase border ${
                      item.badgeColor || "bg-teal-950 text-slate-300 border-teal-800"
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
                {isCollapsed && item.badge && (
                  <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[#FF6B00]" />
                )}
              </button>
            );
          })}
        </div>

        {/* Quick Launch Section */}
        <div className="pt-3 border-t border-teal-900/40 space-y-2">
          {!isCollapsed && (
            <div className="px-3 pb-1 text-[10px] font-bold text-teal-400/80 uppercase tracking-wider">
              Case Operations ERP
            </div>
          )}
          <a
            href="/case-management/"
            target="_blank"
            rel="noreferrer"
            title={isCollapsed ? "Akeezo Case Management System" : undefined}
            className={`w-full flex items-center ${
              isCollapsed ? "justify-center p-2.5" : "justify-between px-3 py-2.5"
            } rounded-xl text-xs font-semibold bg-[#FF6B00]/15 text-[#FF6B00] border border-[#FF6B00]/30 hover:bg-[#FF6B00]/25 transition focus:outline-none focus:ring-2 focus:ring-[#FF6B00]`}
          >
            <div className="flex items-center gap-2.5">
              <Briefcase className="w-4 h-4 shrink-0 text-[#FF6B00]" />
              {!isCollapsed && <span>Case Management</span>}
            </div>
            {!isCollapsed && <ExternalLink className="w-3.5 h-3.5 text-[#FF6B00]/80" />}
          </a>
        </div>
      </div>

      {/* Desktop Collapse / Expand Toggle Button */}
      <div className="hidden md:flex p-3 border-t border-teal-950/80 items-center justify-between">
        {!isCollapsed && (
          <div className="text-[10px] font-semibold text-slate-400 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Server Online</span>
          </div>
        )}
        <button
          onClick={onToggleCollapse}
          className={`p-2 text-slate-400 hover:text-white hover:bg-teal-950/60 rounded-lg transition focus:outline-none focus:ring-2 focus:ring-[#00C7BE] ${
            isCollapsed ? "mx-auto" : ""
          }`}
          aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          title={isCollapsed ? "Expand sidebar (Ctrl+[)" : "Collapse sidebar (Ctrl+[)"}
        >
          {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* 1. Desktop Persistent Sidebar */}
      <aside
        className={`hidden md:flex flex-col bg-[#061E1B] text-slate-300 shrink-0 h-[calc(100vh-4rem)] sticky top-16 border-r border-teal-950/80 transition-all duration-200 z-20 ${
          isCollapsed ? "w-16" : "w-64"
        }`}
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
        className={`md:hidden fixed inset-y-0 left-0 w-72 bg-[#061E1B] text-slate-300 shadow-2xl z-50 transform transition-transform duration-200 ease-in-out ${
          isMobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        role="dialog"
        aria-modal="true"
        aria-label="Navigation drawer"
      >
        {sidebarContent}
      </div>
    </>
  );
};
