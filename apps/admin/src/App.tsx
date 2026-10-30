import React, { useState, useEffect, useCallback } from "react";
import { ShieldAlert, ArrowRight, LogOut } from "lucide-react";
import { AuthProvider, useAuth } from "./context/AuthContext.js";
import { ThemeProvider } from "./context/ThemeContext.js";
import { FeedbackProvider, TourProvider, useTour, TourStep } from "@akeezo/ui";
import { AdminLoginView } from "./components/AdminLoginView.js";
import { SuperAdminHeader } from "./components/SuperAdminHeader.js";
import { SuperAdminSidebar, AdminTab } from "./components/SuperAdminSidebar.js";
import { DashboardView } from "./components/DashboardView.js";
import { ContentView } from "./components/ContentView.js";
import { MediaLibraryView } from "./components/MediaLibraryView.js";
import { EnquiriesView } from "./components/EnquiriesView.js";
import { SeoRedirectsView } from "./components/SeoRedirectsView.js";
import { UsersRolesView } from "./components/UsersRolesView.js";
import { ActivityLogView } from "./components/ActivityLogView.js";
import { SettingsView } from "./components/SettingsView.js";
import { CaseManagementSuperAdminView } from "./components/CaseManagementSuperAdminView.js";
import { ProfileSecurityModal } from "./components/ProfileSecurityModal.js";

const ADMIN_TOUR_STEPS: TourStep[] = [
  {
    id: "tour-admin-overview",
    targetSelector: '[data-tour="admin-kpis"]',
    title: "Executive Super Admin Overview",
    description: "Real-time KPI telemetry tracking website traffic, published pages, incoming patient enquiries, and case conversion rates across all services.",
    badge: "Operations Dashboard",
    placement: "bottom",
    tip: "Counters and attention items reflect live production MongoDB data.",
  },
  {
    id: "tour-admin-search",
    targetSelector: '[data-tour="admin-search"]',
    title: "Global Command Search",
    description: "Quickly locate content pages, media assets, patient leads, or RBAC user roles across the platform.",
    badge: "Quick Search",
    placement: "bottom",
    tip: "Click or search to navigate directly to any administrative record.",
  },
  {
    id: "tour-admin-actions",
    targetSelector: '[data-tour="quick-actions"]',
    title: "Quick Creation Actions",
    description: "Launch new CMS pages, record manual website inquiries, or invite team members with granular RBAC permissions in a single click.",
    badge: "Quick Actions",
    placement: "bottom",
  },
  {
    id: "tour-admin-sidebar",
    targetSelector: '[data-tour="admin-sidebar"]',
    title: "Enterprise Management Modules",
    description: "Switch seamlessly between Content Management, Media Library, Website Enquiries, SEO & 301 Redirects, Users & RBAC, Activity Audit, and System Theme Studio.",
    badge: "Sidebar Navigation",
    placement: "right",
    tip: "Public drafts and revisions are staged securely and require explicit publishing before going live.",
  },
  {
    id: "tour-admin-tour-btn",
    targetSelector: '[data-tour="tour-btn"]',
    title: "Platform Tour & Interactive Guidance",
    description: "Revisit this interactive onboarding guide whenever needed. Blocked or protected buttons throughout the admin suite feature contextual guide popups with prerequisite checklists.",
    badge: "Help & Guidance",
    placement: "bottom",
    tip: "Hover or click on any disabled button to inspect why the action is blocked.",
  },
];

const tabPathMap: Record<AdminTab, string> = {
  overview: "/admin",
  content: "/admin/content",
  media: "/admin/media",
  enquiries: "/admin/enquiries",
  seo: "/admin/seo",
  users: "/admin/users",
  activity: "/admin/activity",
  settings: "/admin/settings",
  "cases-admin": "/admin/case-management",
};

function getTabFromPath(pathname: string): AdminTab {
  const clean = pathname.replace(/\/$/, "");
  if (clean === "/admin" || clean === "/admin/overview") return "overview";
  if (clean.startsWith("/admin/content")) return "content";
  if (clean.startsWith("/admin/media")) return "media";
  if (clean.startsWith("/admin/enquiries") || clean.startsWith("/admin/leads")) return "enquiries";
  if (clean.startsWith("/admin/seo")) return "seo";
  if (clean.startsWith("/admin/users") || clean.startsWith("/admin/rbac")) return "users";
  if (clean.startsWith("/admin/activity")) return "activity";
  if (clean.startsWith("/admin/settings") || clean.startsWith("/admin/integrations")) return "settings";
  if (clean.startsWith("/admin/case-management")) return "cases-admin";
  return "overview";
}

const SuperAdminDashboard: React.FC = () => {
  const { user, isLoading, token, logout } = useAuth();
  const { startTour } = useTour();
  const [activeTab, setActiveTabState] = useState<AdminTab>(() =>
    getTabFromPath(window.location.pathname)
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [leadsCount, setLeadsCount] = useState<number>(0);

  // Auto-launch walkthrough for first-time admin users
  useEffect(() => {
    if (user) {
      const timer = setTimeout(() => {
        startTour("akeezo_admin_tour", ADMIN_TOUR_STEPS, false);
      }, 700);
      return () => clearTimeout(timer);
    }
  }, [user, startTour]);

  // Layout State (Sidebar is locked on desktop; drawer for mobile)
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Profile & Security Modal State
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [profileModalInitialTab, setProfileModalInitialTab] = useState<"profile" | "security">("profile");

  // Sync tab with URL
  const selectTab = useCallback((tab: AdminTab) => {
    setActiveTabState(tab);
    const targetPath = tabPathMap[tab];
    if (window.location.pathname !== targetPath) {
      window.history.pushState(null, "", targetPath);
    }
  }, []);

  // Listen to browser back/forward buttons
  useEffect(() => {
    const handlePopState = () => {
      setActiveTabState(getTabFromPath(window.location.pathname));
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  useEffect(() => {
    if (user) {
      loadStats();
    }
  }, [user]);

  const loadStats = async () => {
    try {
      const res = await fetch("/api/v1/admin/overview-stats");
      if (res.ok) {
        const json = await res.json();
        setLeadsCount(json.data?.leads?.totalEnquiries || 0);
      }
    } catch (err) {
      console.error("Failed to load header stats", err);
    }
  };

  if (isLoading && token && !user) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white text-xs font-semibold">
        Verifying Super Admin security session...
      </div>
    );
  }

  if (!user) {
    return <AdminLoginView />;
  }

  // Strict Super Admin Access Guard: Non-admin users (e.g. coordinators, finance) cannot access Website Admin
  const userRole = (user as any).role;
  const isSuperAdmin = userRole === "admin";
  if (!isSuperAdmin) {
    return (
      <div className="min-h-screen bg-[#061E1B] flex items-center justify-center p-4 selection:bg-[#007A6C] selection:text-white font-sans">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8 border border-teal-900/40 text-center space-y-5">
          <div className="w-14 h-14 mx-auto rounded-full bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-600 shadow-sm">
            <ShieldAlert className="w-7 h-7" />
          </div>

          <div className="space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-widest text-rose-600 bg-rose-50 px-2.5 py-1 rounded-full border border-rose-200">
              HTTP 403 · Access Restricted
            </span>
            <h2 className="text-lg font-black text-slate-900 tracking-tight">
              Super Admin Authorization Required
            </h2>
            <p className="text-xs text-slate-500 leading-relaxed">
              You are signed in as <strong className="text-slate-800">{user.name}</strong> (<code className="text-[#007A6C] font-mono">{user.email}</code>) with role <span className="font-semibold uppercase text-slate-700">[{userRole || "User"}]</span>.
            </p>
            <p className="text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-200 leading-normal">
              Website Content, Theme Studio, Media Assets, and System Settings require <strong>Super Admin (`admin`)</strong> credentials. Your account is authorized for Case Management operations.
            </p>
          </div>

          <div className="space-y-2 pt-2">
            <a
              href="/case-management"
              className="w-full py-2.5 bg-[#007A6C] hover:bg-[#005F54] text-white font-bold text-xs rounded-xl shadow-sm transition flex items-center justify-center gap-1.5"
            >
              <span>Go to Case Management Workspace</span>
              <ArrowRight className="w-4 h-4" />
            </a>

            <button
              type="button"
              onClick={logout}
              className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl transition flex items-center justify-center gap-1.5"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out / Switch Account</span>
            </button>
          </div>

          <div className="pt-2 text-[10px] text-slate-400 border-t border-slate-100">
            Protected by DPDP Act 2023 & Enterprise RBAC Multi-Portal Isolation
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="h-screen w-screen overflow-hidden flex flex-col font-sans"
      style={{
        backgroundColor: "var(--admin-content-bg, #F8FAFC)",
        color: "var(--admin-text, #1E293B)",
        fontFamily: "var(--admin-font, Lato)",
      }}
    >
      {/* 1. Shared Top Bar Header (Pinned top) */}
      <SuperAdminHeader
        activeTab={activeTab}
        onSelectTab={selectTab}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onOpenMobileSidebar={() => setIsMobileSidebarOpen(true)}
        onOpenProfile={() => {
          setProfileModalInitialTab("profile");
          setProfileModalOpen(true);
        }}
        onOpenSecurity={() => {
          setProfileModalInitialTab("security");
          setProfileModalOpen(true);
        }}
        onStartTour={() => startTour("akeezo_admin_tour", ADMIN_TOUR_STEPS, true)}
        onCreatePage={() => selectTab("content")}
        onCreateEnquiry={() => selectTab("enquiries")}
        onInviteUser={() => selectTab("users")}
      />

      {/* 2. Main Workspace Shell: Locked Sidebar + Scrollable Viewport */}
      <div className="flex-1 flex overflow-hidden min-h-0 min-w-0">
        {/* Left Navigation Sidebar (Locked on Desktop, Drawer on Mobile) */}
        <SuperAdminSidebar
          activeTab={activeTab}
          onSelectTab={selectTab}
          leadsCount={leadsCount}
          isMobileOpen={isMobileSidebarOpen}
          onCloseMobile={() => setIsMobileSidebarOpen(false)}
        />

        {/* Main Content Workspace (Scrolls independently while sidebar remains locked) */}
        <main
          className="flex-1 min-w-0 h-full overflow-y-auto p-4 md:p-6"
          style={{
            backgroundColor: "var(--admin-content-bg, #F8FAFC)",
            color: "var(--admin-text, #1E293B)",
          }}
        >
          {/* Module 1: Dashboard Overview */}
          {activeTab === "overview" && (
            <DashboardView
              onSelectTab={selectTab}
              onCreatePage={() => selectTab("content")}
            />
          )}

          {/* Module 2: Content (Pages & Navigation) */}
          {activeTab === "content" && <ContentView />}

          {/* Module 3: Media Library */}
          {activeTab === "media" && <MediaLibraryView />}

          {/* Module 4: Enquiries / Leads */}
          {activeTab === "enquiries" && <EnquiriesView />}

          {/* Module 5: SEO & Redirects */}
          {activeTab === "seo" && <SeoRedirectsView />}

          {/* Module 6: Users & Roles */}
          {activeTab === "users" && <UsersRolesView />}

          {/* Module 7: Activity Log */}
          {activeTab === "activity" && <ActivityLogView />}

          {/* Module 8: System Settings & Integrations */}
          {activeTab === "settings" && (
            <SettingsView
              initialTab={
                typeof window !== "undefined" && window.location.pathname.startsWith("/admin/integrations")
                  ? "integrations"
                  : undefined
              }
            />
          )}

          {/* Integrated Case Management CMS Super Admin View */}
          {activeTab === "cases-admin" && <CaseManagementSuperAdminView />}
        </main>
      </div>

      {/* Account & Security Modal */}
      <ProfileSecurityModal
        isOpen={profileModalOpen}
        initialTab={profileModalInitialTab}
        onClose={() => setProfileModalOpen(false)}
      />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <ThemeProvider>
        <FeedbackProvider>
          <TourProvider>
            <SuperAdminDashboard />
          </TourProvider>
        </FeedbackProvider>
      </ThemeProvider>
    </AuthProvider>
  );
};
