import React, { useState, useEffect, useCallback } from "react";
import { AuthProvider, useAuth } from "./context/AuthContext.js";
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
  if (clean.startsWith("/admin/settings")) return "settings";
  if (clean.startsWith("/admin/case-management")) return "cases-admin";
  return "overview";
}

const SuperAdminDashboard: React.FC = () => {
  const { user, isLoading } = useAuth();
  const [activeTab, setActiveTabState] = useState<AdminTab>(() =>
    getTabFromPath(window.location.pathname)
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [leadsCount, setLeadsCount] = useState<number>(0);

  // Layout States
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white text-xs font-semibold">
        Verifying Super Admin security session...
      </div>
    );
  }

  if (!user) {
    return <AdminLoginView />;
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-800">
      {/* 1. Shared Top Bar Header */}
      <SuperAdminHeader
        activeTab={activeTab}
        onSelectTab={selectTab}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onToggleSidebarCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        onOpenMobileSidebar={() => setIsMobileSidebarOpen(true)}
        onOpenProfile={() => {
          setProfileModalInitialTab("profile");
          setProfileModalOpen(true);
        }}
        onOpenSecurity={() => {
          setProfileModalInitialTab("security");
          setProfileModalOpen(true);
        }}
        onCreatePage={() => selectTab("content")}
        onCreateEnquiry={() => selectTab("enquiries")}
        onInviteUser={() => selectTab("users")}
      />

      <div className="flex-1 flex overflow-hidden">
        {/* 2. Shared Left Navigation Sidebar (Desktop + Mobile Drawer) */}
        <SuperAdminSidebar
          activeTab={activeTab}
          onSelectTab={selectTab}
          leadsCount={leadsCount}
          isCollapsed={isSidebarCollapsed}
          onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          isMobileOpen={isMobileSidebarOpen}
          onCloseMobile={() => setIsMobileSidebarOpen(false)}
        />

        {/* 3. Main Content Workspace */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
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

          {/* Module 8: System Settings */}
          {activeTab === "settings" && <SettingsView />}

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
      <SuperAdminDashboard />
    </AuthProvider>
  );
};
