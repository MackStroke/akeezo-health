import React, { useState, useEffect } from "react";
import { AuthProvider, useAuth } from "./context/AuthContext.js";
import { AdminLoginView } from "./components/AdminLoginView.js";
import { SuperAdminHeader } from "./components/SuperAdminHeader.js";
import { SuperAdminSidebar, AdminTab } from "./components/SuperAdminSidebar.js";
import { SuperAdminOverview } from "./components/SuperAdminOverview.js";
import { WebsiteManagementView } from "./components/WebsiteManagementView.js";
import { LeadCollectorView } from "./components/LeadCollectorView.js";
import { CaseManagementSuperAdminView } from "./components/CaseManagementSuperAdminView.js";
import { RbacView } from "./components/RbacView.js";

const SuperAdminDashboard: React.FC = () => {
  const { user, isLoading } = useAuth();
  const [activeTab, setActiveTab] = useState<AdminTab>("overview");
  const [searchQuery, setSearchQuery] = useState("");
  const [leadsCount, setLeadsCount] = useState<number>(0);

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
      {/* Top Header */}
      <SuperAdminHeader
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      <div className="flex-1 flex overflow-hidden">
        {/* Left Navigation Sidebar */}
        <SuperAdminSidebar
          activeTab={activeTab}
          onSelectTab={setActiveTab}
          leadsCount={leadsCount}
        />

        {/* Main Content Workspace */}
        <main className="flex-1 overflow-y-auto p-6">
          {activeTab === "overview" && (
            <SuperAdminOverview onSelectTab={setActiveTab} />
          )}

          {activeTab === "website" && (
            <WebsiteManagementView />
          )}

          {activeTab === "leads" && (
            <LeadCollectorView />
          )}

          {activeTab === "cases-admin" && (
            <CaseManagementSuperAdminView />
          )}

          {activeTab === "rbac" && (
            <RbacView />
          )}
        </main>
      </div>
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
