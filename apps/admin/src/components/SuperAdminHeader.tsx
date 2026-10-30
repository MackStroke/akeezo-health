import React, { useState, useEffect, useRef } from "react";
import {
  Search,
  Globe,
  LogOut,
  ExternalLink,
  Briefcase,
  Menu,
  Plus,
  Bell,
  ChevronDown,
  User,
  Lock,
  FileText,
  Inbox,
  Users,
  Image as ImageIcon,
  CheckCircle2,
  Clock,
  Sparkles,
  Settings,
  Compass,
  Tag,
} from "lucide-react";
import { useAuth } from "../context/AuthContext.js";
import { AdminTab } from "./SuperAdminSidebar.js";

interface HeaderProps {
  activeTab: AdminTab;
  onSelectTab: (tab: AdminTab) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onOpenMobileSidebar: () => void;
  onOpenProfile: () => void;
  onOpenSecurity: () => void;
  onStartTour?: () => void;
  onCreatePage?: () => void;
  onCreateEnquiry?: () => void;
  onInviteUser?: () => void;
  onRecordChangelog?: () => void;
}

export const SuperAdminHeader: React.FC<HeaderProps> = ({
  activeTab,
  onSelectTab,
  searchQuery,
  onSearchChange,
  onOpenMobileSidebar,
  onOpenProfile,
  onOpenSecurity,
  onStartTour,
  onCreatePage,
  onCreateEnquiry,
  onInviteUser,
  onRecordChangelog,
}) => {
  const { user, logout } = useAuth();
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [createDropdownOpen, setCreateDropdownOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const [recentActivities, setRecentActivities] = useState<any[]>([]);

  const profileRef = useRef<HTMLDivElement>(null);
  const createRef = useRef<HTMLDivElement>(null);
  const notificationsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Fetch notifications (recent activity stream)
    fetchRecentActivities();
  }, []);

  const fetchRecentActivities = async () => {
    try {
      const res = await fetch("/api/v1/admin/activity?limit=5");
      if (res.ok) {
        const json = await res.json();
        setRecentActivities(json.data || []);
      }
    } catch {
      // Non-blocking fallback
    }
  };

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileDropdownOpen(false);
      }
      if (createRef.current && !createRef.current.contains(e.target as Node)) {
        setCreateDropdownOpen(false);
      }
      if (notificationsRef.current && !notificationsRef.current.contains(e.target as Node)) {
        setNotificationsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const tabTitles: Record<AdminTab, { title: string; subtitle: string }> = {
    overview: { title: "Executive Dashboard", subtitle: "System health, KPIs & attention items" },
    content: { title: "Content Management", subtitle: "Public pages, section schemas & navigation" },
    media: { title: "Media Library", subtitle: "Digital assets, storage & secure delivery" },
    enquiries: { title: "Website Enquiries", subtitle: "Form leads, triage & CRM case conversion" },
    seo: { title: "SEO & Redirects", subtitle: "Meta tags, schema markup & 301/302 redirects" },
    users: { title: "Users & Roles", subtitle: "Access control, invitations & permission matrices" },
    activity: { title: "Activity Audit Log", subtitle: "Immutable governance & compliance event stream" },
    settings: { title: "Platform Settings", subtitle: "Branding, integrations & operational configurations" },
    "cases-admin": { title: "Case Management ERP", subtitle: "Dedicated patient journey operations" },
  };

  const initials = user?.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "SA";

  return (
    <header
      className="h-16 border-b px-4 md:px-6 flex items-center justify-between sticky top-0 z-30 shadow-xs font-sans"
      style={{
        backgroundColor: "var(--admin-header-bg, #FFFFFF)",
        borderColor: "var(--admin-border, #E2E8F0)",
      }}
    >
      <div className="flex items-center gap-3 md:gap-5">
        {/* Mobile Hamburger Drawer Toggle */}
        <button
          onClick={onOpenMobileSidebar}
          className="md:hidden p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition focus:outline-none focus:ring-2 focus:ring-[#00C7BE]"
          aria-label="Open mobile navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Brand Logo & Platform Title */}
        <div className="flex items-center gap-3">
          <img
            src="/logo/favicon.svg"
            alt="Akeezo Healthcare"
            className="w-8 h-8 md:w-9 md:h-9 object-contain shrink-0 drop-shadow-xs"
          />
          <div className="hidden lg:block">
            <div className="flex items-center gap-2">
              <span
                className="font-black text-lg tracking-tight leading-none"
                style={{ color: "var(--admin-header-text, #1E293B)" }}
              >
                AKEEZO
              </span>
              <span className="text-[10px] font-bold bg-[#FF6B00] text-white px-2 py-0.5 rounded-full uppercase tracking-wider shadow-2xs">
                Admin Panel
              </span>
            </div>
            <span
              className="text-[10px] font-semibold block leading-tight opacity-75"
              style={{ color: "var(--admin-header-text, #1E293B)" }}
            >
              Website CMS & Enterprise Super Admin
            </span>
          </div>
        </div>

        {/* Breadcrumb / Current Page Indicator */}
        <div
          className="hidden sm:flex items-center gap-2 pl-2 border-l text-xs"
          style={{ borderColor: "var(--admin-border, #E2E8F0)" }}
        >
          <span className="opacity-60" style={{ color: "var(--admin-header-text, #1E293B)" }}>Admin</span>
          <span className="opacity-40" style={{ color: "var(--admin-header-text, #1E293B)" }}>/</span>
          <span className="font-bold" style={{ color: "var(--admin-header-text, #1E293B)" }}>
            {tabTitles[activeTab]?.title}
          </span>
        </div>

        {/* Global Search Bar */}
        <div data-tour="admin-search" className="relative w-44 sm:w-64 md:w-72 lg:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setTimeout(() => setSearchFocused(false), 250)}
            placeholder="Search pages, enquiries, users..."
            className="w-full bg-slate-100 hover:bg-slate-200/60 focus:bg-white text-xs pl-9 pr-3 py-1.5 rounded-xl border border-transparent focus:border-[#007A6C] focus:ring-1 focus:ring-[#00C7BE] focus:outline-none transition-all placeholder:text-slate-400"
          />

          {/* Quick Search Dropdown Preview when focused */}
          {searchFocused && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-slate-200 rounded-xl shadow-xl p-2 z-50 text-xs space-y-1">
              <div className="text-[10px] font-bold text-slate-400 px-2.5 py-1 uppercase tracking-wider">
                Quick Navigation
              </div>
              <button
                onMouseDown={() => onSelectTab("content")}
                className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-slate-50 flex items-center gap-2 text-slate-700"
              >
                <FileText className="w-3.5 h-3.5 text-[#007A6C]" />
                <span>Pages & Navigation</span>
              </button>
              <button
                onMouseDown={() => onSelectTab("enquiries")}
                className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-slate-50 flex items-center gap-2 text-slate-700"
              >
                <Inbox className="w-3.5 h-3.5 text-[#FF6B00]" />
                <span>Inbound Enquiries & Leads</span>
              </button>
              <button
                onMouseDown={() => onSelectTab("users")}
                className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-slate-50 flex items-center gap-2 text-slate-700"
              >
                <Users className="w-3.5 h-3.5 text-indigo-600" />
                <span>Users & Roles Management</span>
              </button>
              <button
                onMouseDown={() => onSelectTab("settings")}
                className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-slate-50 flex items-center gap-2 text-slate-700"
              >
                <Settings className="w-3.5 h-3.5 text-slate-600" />
                <span>Branding & Site Settings</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2 md:gap-3">
        {/* Platform Tour Guide Button */}
        {onStartTour && (
          <button
            data-tour="tour-btn"
            onClick={onStartTour}
            title="Start Interactive Super Admin Walkthrough"
            className="flex items-center gap-1.5 bg-[#E6F8F6] hover:bg-[#d0f4f0] active:bg-[#b2ebe4] text-[#007A6C] border border-[#00C7BE]/30 text-xs font-bold px-3 py-1.5 rounded-xl shadow-2xs transition-all"
          >
            <Compass className="w-4 h-4 text-[#007A6C]" />
            <span className="hidden md:inline">Platform Tour</span>
          </button>
        )}

        {/* Create New Action Menu */}
        <div data-tour="quick-actions" className="relative" ref={createRef}>
          <button
            onClick={() => setCreateDropdownOpen(!createDropdownOpen)}
            className="flex items-center gap-1.5 text-xs text-white font-bold bg-[#007A6C] hover:bg-[#005F54] active:scale-98 px-3 py-1.5 rounded-xl shadow-xs transition border border-[#007A6C]/30 focus:outline-none focus:ring-2 focus:ring-[#00C7BE]"
            aria-expanded={createDropdownOpen}
            aria-haspopup="true"
          >
            <Plus className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Create New</span>
            <ChevronDown className="w-3 h-3 opacity-80" />
          </button>

          {createDropdownOpen && (
            <div className="absolute right-0 mt-1.5 w-48 bg-white border border-slate-200 rounded-xl shadow-xl py-1.5 z-50 text-xs animate-in fade-in zoom-in-95 duration-100">
              <button
                onClick={() => {
                  setCreateDropdownOpen(false);
                  if (onCreatePage) onCreatePage();
                  else onSelectTab("content");
                }}
                className="w-full text-left px-3.5 py-2 hover:bg-slate-50 flex items-center gap-2.5 text-slate-700 hover:text-slate-900"
              >
                <FileText className="w-4 h-4 text-[#007A6C]" />
                <span className="font-semibold">New Page</span>
              </button>

              <button
                onClick={() => {
                  setCreateDropdownOpen(false);
                  onSelectTab("media");
                }}
                className="w-full text-left px-3.5 py-2 hover:bg-slate-50 flex items-center gap-2.5 text-slate-700 hover:text-slate-900"
              >
                <ImageIcon className="w-4 h-4 text-[#00C7BE]" />
                <span className="font-semibold">Upload Media</span>
              </button>

              <button
                onClick={() => {
                  setCreateDropdownOpen(false);
                  if (onCreateEnquiry) onCreateEnquiry();
                  else onSelectTab("enquiries");
                }}
                className="w-full text-left px-3.5 py-2 hover:bg-slate-50 flex items-center gap-2.5 text-slate-700 hover:text-slate-900"
              >
                <Inbox className="w-4 h-4 text-[#FF6B00]" />
                <span className="font-semibold">New Enquiry</span>
              </button>

              <button
                onClick={() => {
                  setCreateDropdownOpen(false);
                  if (onInviteUser) onInviteUser();
                  else onSelectTab("users");
                }}
                className="w-full text-left px-3.5 py-2 hover:bg-slate-50 flex items-center gap-2.5 text-slate-700 hover:text-slate-900"
              >
                <Users className="w-4 h-4 text-indigo-600" />
                <span className="font-semibold">Invite User</span>
              </button>

              <button
                onClick={() => {
                  setCreateDropdownOpen(false);
                  if (onRecordChangelog) onRecordChangelog();
                  else {
                    window.history.pushState(null, "", "/admin/changelog");
                    onSelectTab("activity");
                  }
                }}
                className="w-full text-left px-3.5 py-2 hover:bg-slate-50 flex items-center gap-2.5 text-slate-700 hover:text-slate-900 border-t border-slate-100"
              >
                <Tag className="w-4 h-4 text-emerald-600" />
                <span className="font-semibold">Record Changelog</span>
              </button>
            </div>
          )}
        </div>

        {/* View Public Website Link */}
        <a
          href="/"
          target="_blank"
          rel="noreferrer"
          className="hidden sm:flex items-center gap-1.5 text-xs text-slate-700 hover:text-[#007A6C] font-semibold border border-slate-200 hover:bg-slate-50 px-3 py-1.5 rounded-xl transition"
          title="Open live public website"
        >
          <Globe className="w-3.5 h-3.5 text-[#007A6C]" />
          <span>View Site</span>
          <ExternalLink className="w-3 h-3 opacity-60" />
        </a>

        {/* Case Operations CMS Shortcut */}
        <a
          href="/case-management/"
          target="_blank"
          rel="noreferrer"
          className="hidden xl:flex items-center gap-1.5 text-xs text-slate-700 hover:text-[#FF6B00] font-semibold border border-slate-200 hover:bg-slate-50 px-3 py-1.5 rounded-xl transition"
          title="Open Case Operations Portal"
        >
          <Briefcase className="w-3.5 h-3.5 text-[#FF6B00]" />
          <span>Case ERP</span>
        </a>

        {/* Notifications Popover */}
        <div className="relative" ref={notificationsRef}>
          <button
            onClick={() => setNotificationsOpen(!notificationsOpen)}
            className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition relative focus:outline-none focus:ring-2 focus:ring-[#00C7BE]"
            aria-label="View activity notifications"
            aria-expanded={notificationsOpen}
          >
            <Bell className="w-4 h-4" />
            {recentActivities.length > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#FF6B00]" />
            )}
          </button>

          {notificationsOpen && (
            <div className="absolute right-0 mt-1.5 w-80 bg-white border border-slate-200 rounded-2xl shadow-xl p-3 z-50 text-xs animate-in fade-in zoom-in-95 duration-100 font-sans">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <span className="font-bold text-slate-800">Recent Admin Activity</span>
                <button
                  onClick={() => {
                    setNotificationsOpen(false);
                    onSelectTab("activity");
                  }}
                  className="text-[11px] text-[#007A6C] font-bold hover:underline"
                >
                  View All Log
                </button>
              </div>

              <div className="mt-2 space-y-2 max-h-64 overflow-y-auto">
                {recentActivities.length === 0 ? (
                  <div className="py-4 text-center text-slate-400 text-xs">
                    No recent audit activity recorded yet.
                  </div>
                ) : (
                  recentActivities.map((act) => (
                    <div
                      key={act._id}
                      className="p-2 rounded-xl bg-slate-50 hover:bg-slate-100/80 transition text-[11px] space-y-0.5"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-slate-900 capitalize">
                          {act.action} {act.module}
                        </span>
                        <span className="text-[10px] text-slate-400">
                          {new Date(act.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        </span>
                      </div>
                      <div className="text-slate-500 text-[10px] truncate">
                        Actor: {act.actorId?.name || act.actorId?.email || "System Administrator"}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        <div className="h-6 w-px bg-slate-200 hidden sm:block" />

        {/* Profile Menu Dropdown */}
        <div className="relative" ref={profileRef}>
          <button
            onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
            className="flex items-center gap-2 p-1 rounded-xl hover:bg-slate-100 transition focus:outline-none focus:ring-2 focus:ring-[#00C7BE]"
            aria-expanded={profileDropdownOpen}
            aria-haspopup="true"
          >
            <div className="w-8 h-8 rounded-full bg-[#061E1B] text-[#00C7BE] border border-[#00C7BE]/30 font-bold flex items-center justify-center text-xs shadow-xs">
              {initials}
            </div>
            <div className="text-left text-xs hidden sm:block">
              <div className="font-semibold text-slate-800 leading-tight">
                {user?.name || "Super Admin"}
              </div>
              <div className="text-[9px] text-[#007A6C] font-bold uppercase tracking-wider leading-none">
                {user?.role?.replace(/_/g, " ") || "Administrator"}
              </div>
            </div>
            <ChevronDown className="w-3 h-3 text-slate-400 hidden sm:block" />
          </button>

          {profileDropdownOpen && (
            <div className="absolute right-0 mt-1.5 w-52 bg-white border border-slate-200 rounded-2xl shadow-xl py-2 z-50 text-xs animate-in fade-in zoom-in-95 duration-100">
              <div className="px-3.5 py-2 border-b border-slate-100">
                <div className="font-bold text-slate-900">{user?.name || "Super Admin"}</div>
                <div className="text-[11px] text-slate-400 truncate">{user?.email}</div>
              </div>

              <button
                onClick={() => {
                  setProfileDropdownOpen(false);
                  onOpenProfile();
                }}
                className="w-full text-left px-3.5 py-2 hover:bg-slate-50 flex items-center gap-2 text-slate-700"
              >
                <User className="w-3.5 h-3.5 text-[#007A6C]" />
                <span className="font-medium">My Profile</span>
              </button>

              <button
                onClick={() => {
                  setProfileDropdownOpen(false);
                  onOpenSecurity();
                }}
                className="w-full text-left px-3.5 py-2 hover:bg-slate-50 flex items-center gap-2 text-slate-700"
              >
                <Lock className="w-3.5 h-3.5 text-[#FF6B00]" />
                <span className="font-medium">Security & Password</span>
              </button>

              <div className="my-1 border-t border-slate-100" />

              <button
                onClick={() => {
                  setProfileDropdownOpen(false);
                  logout();
                }}
                className="w-full text-left px-3.5 py-2 hover:bg-rose-50 flex items-center gap-2 text-rose-600 font-semibold"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
