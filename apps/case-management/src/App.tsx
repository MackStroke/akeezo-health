import React, { useState, useEffect, useCallback } from "react";
import { AuthProvider, useAuth } from "./context/AuthContext.js";
import { AdminLoginView } from "./components/AdminLoginView.js";
import { Header } from "./components/Header.js";
import { Sidebar, NavTab } from "./components/Sidebar.js";
import { PipelineBoard } from "./components/PipelineBoard.js";
import { CaseDetailModal } from "./components/CaseDetailModal.js";
import { NewCaseModal } from "./components/NewCaseModal.js";
import { FinanceWorkspace } from "./components/FinanceWorkspace.js";
import { ArrowRight } from "lucide-react";

const tabPathMap: Record<NavTab, string> = {
  board: "/case-management",
  cases: "/case-management/cases",
  partners: "/case-management/partners",
  hospitals: "/case-management/hospitals",
  finance: "/case-management/finance",
};

interface ParsedRoute {
  tab: NavTab;
  caseIdentifier: string | null;
}

function parseCurrentRoute(): ParsedRoute {
  if (typeof window === "undefined") {
    return { tab: "board", caseIdentifier: null };
  }
  const pathname = window.location.pathname.replace(/\/$/, "");

  // Deep-link to a specific case: /case-management/cases/:id or /case-management/board/cases/:id or /case-management/case/:id
  const caseMatch = pathname.match(/\/case-management\/(?:cases|board|case)\/([A-Za-z0-9_-]+)/);
  if (caseMatch && caseMatch[1]) {
    const parentTab: NavTab = pathname.includes("/board") ? "board" : "cases";
    return {
      tab: parentTab,
      caseIdentifier: caseMatch[1],
    };
  }

  if (pathname === "/case-management" || pathname === "/case-management/board") {
    return { tab: "board", caseIdentifier: null };
  }
  if (pathname.startsWith("/case-management/cases")) {
    return { tab: "cases", caseIdentifier: null };
  }
  if (pathname.startsWith("/case-management/partners")) {
    return { tab: "partners", caseIdentifier: null };
  }
  if (pathname.startsWith("/case-management/hospitals")) {
    return { tab: "hospitals", caseIdentifier: null };
  }
  if (pathname.startsWith("/case-management/finance")) {
    return { tab: "finance", caseIdentifier: null };
  }

  return { tab: "board", caseIdentifier: null };
}

const CaseManagementDashboard: React.FC = () => {
  const { user, isLoading } = useAuth();
  const initialRoute = parseCurrentRoute();
  const [activeTab, setActiveTabState] = useState<NavTab>(initialRoute.tab);
  const [cases, setCases] = useState<any[]>([]);
  const [partners, setPartners] = useState<any[]>([]);
  const [hospitals, setHospitals] = useState<any[]>([]);

  const [selectedCaseId, setSelectedCaseId] = useState<string | null>(initialRoute.caseIdentifier);
  const [showNewCaseModal, setShowNewCaseModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (user) {
      loadAllData();
    }
  }, [user]);

  const loadAllData = async () => {
    try {
      const [casesRes, partnersRes, hospitalsRes] = await Promise.all([
        fetch("/api/v1/cases"),
        fetch("/api/v1/partners"),
        fetch("/api/v1/hospitals"),
      ]);

      const casesJson = casesRes.ok ? await casesRes.json().catch(() => ({})) : {};
      const partnersJson = partnersRes.ok ? await partnersRes.json().catch(() => ({})) : {};
      const hospitalsJson = hospitalsRes.ok ? await hospitalsRes.json().catch(() => ({})) : {};

      const loadedCases = casesJson.data || [];
      setCases(loadedCases);
      setPartners(partnersJson.data || []);
      setHospitals(hospitalsJson.data || []);

      // If initial URL had a caseCode, resolve to internal MongoDB _id if present
      const currentRoute = parseCurrentRoute();
      if (currentRoute.caseIdentifier) {
        const found = loadedCases.find(
          (c: any) => c.caseCode === currentRoute.caseIdentifier || c._id === currentRoute.caseIdentifier
        );
        setSelectedCaseId(found ? found._id : currentRoute.caseIdentifier);
      }
    } catch (err) {
      console.error("Failed to load platform data", err);
    }
  };

  // Sync state when browser Back / Forward buttons are clicked
  useEffect(() => {
    const handlePopState = () => {
      const route = parseCurrentRoute();
      setActiveTabState(route.tab);
      if (route.caseIdentifier) {
        const found = cases.find(
          (c) => c.caseCode === route.caseIdentifier || c._id === route.caseIdentifier
        );
        setSelectedCaseId(found ? found._id : route.caseIdentifier);
      } else {
        setSelectedCaseId(null);
      }
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [cases]);

  // Update browser document title based on active view
  useEffect(() => {
    const titles: Record<NavTab, string> = {
      board: "Pipeline Board · Akeezo Case Management",
      cases: "All Patient Cases · Akeezo Case Management",
      partners: "Partners Directory · Akeezo Case Management",
      hospitals: "Hospital Network · Akeezo Case Management",
      finance: "Commission & Payouts · Akeezo Case Management",
    };
    if (selectedCaseId) {
      const found = cases.find((c) => c._id === selectedCaseId || c.caseCode === selectedCaseId);
      const code = found?.caseCode || selectedCaseId;
      document.title = `${code} · Case Detail · Akeezo`;
    } else {
      document.title = titles[activeTab] || "Akeezo Case Management";
    }
  }, [activeTab, selectedCaseId, cases]);

  // Select Tab & update URL via HTML5 pushState
  const selectTab = useCallback((tab: NavTab) => {
    setActiveTabState(tab);
    setSelectedCaseId(null);
    const targetPath = tabPathMap[tab];
    if (window.location.pathname !== targetPath) {
      window.history.pushState({ tab, caseIdentifier: null }, "", targetPath);
    }
  }, []);

  // Open Case & update URL to /case-management/cases/:caseCode
  const openCase = useCallback(
    (caseIdOrCode: string) => {
      const found = cases.find((c) => c._id === caseIdOrCode || c.caseCode === caseIdOrCode);
      const internalId = found ? found._id : caseIdOrCode;
      const displaySlug = found?.caseCode || caseIdOrCode;

      setSelectedCaseId(internalId);

      const targetPath = `/case-management/cases/${displaySlug}`;
      if (window.location.pathname !== targetPath) {
        window.history.pushState({ tab: activeTab, caseIdentifier: displaySlug }, "", targetPath);
      }
    },
    [cases, activeTab]
  );

  // Close Case & restore tab URL
  const closeCase = useCallback(() => {
    setSelectedCaseId(null);
    const targetPath = tabPathMap[activeTab] || "/case-management";
    if (window.location.pathname !== targetPath) {
      window.history.pushState({ tab: activeTab, caseIdentifier: null }, "", targetPath);
    }
  }, [activeTab]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#061E1B] flex items-center justify-center text-[#00C7BE] text-xs font-bold tracking-wider uppercase font-sans">
        Verifying security session...
      </div>
    );
  }

  if (!user) {
    return <AdminLoginView />;
  }

  const filteredCases = cases.filter((c) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      c.caseCode?.toLowerCase().includes(q) ||
      c.patientId?.fullName?.toLowerCase().includes(q) ||
      c.partnerId?.name?.toLowerCase().includes(q) ||
      c.specialty?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-800">
      {/* Top Navigation */}
      <Header
        activeTab={activeTab}
        onSelectTab={selectTab}
        onOpenNewCase={() => setShowNewCaseModal(true)}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar */}
        <Sidebar
          activeTab={activeTab}
          onSelectTab={selectTab}
          caseCount={cases.length}
        />

        {/* Main Content Pane */}
        <main className="flex-1 overflow-y-auto">
          {activeTab === "board" && (
            <PipelineBoard
              cases={filteredCases}
              onSelectCase={(id) => openCase(id)}
            />
          )}

          {activeTab === "cases" && (
            <div className="p-6 h-full flex flex-col">
              <h1 className="text-xl font-black text-slate-800 pb-4">All Patient Cases</h1>
              <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 border-b text-slate-500 font-bold">
                    <tr>
                      <th className="p-3">Case Code</th>
                      <th className="p-3">Patient</th>
                      <th className="p-3">Partner</th>
                      <th className="p-3">Specialty</th>
                      <th className="p-3">Urgency</th>
                      <th className="p-3">Stage</th>
                      <th className="p-3">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredCases.map((c) => (
                      <tr
                        key={c._id}
                        onClick={() => openCase(c.caseCode || c._id)}
                        className="hover:bg-slate-50 cursor-pointer"
                      >
                        <td className="p-3 font-mono font-bold text-[#007A6C]">{c.caseCode}</td>
                        <td className="p-3 font-semibold text-slate-900">{c.patientId?.fullName}</td>
                        <td className="p-3 text-slate-600">{c.partnerId?.name || "Direct"}</td>
                        <td className="p-3 capitalize">{c.specialty?.replace(/_/g, " ")}</td>
                        <td className="p-3 uppercase font-bold text-[10px]">{c.urgency}</td>
                        <td className="p-3">
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100">
                            {c.stage}
                          </span>
                        </td>
                        <td className="p-3">
                          <button className="text-[#007A6C] hover:text-[#005F54] font-bold flex items-center gap-1 text-[11px]">
                            <span>Open</span>
                            <ArrowRight className="w-3 h-3" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === "partners" && (
            <div className="p-6 h-full flex flex-col">
              <h1 className="text-xl font-black text-slate-800 pb-4">Partner Facilitators & Agencies</h1>
              <div className="grid grid-cols-3 gap-4">
                {partners.map((p) => (
                  <div key={p._id} className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-bold text-[#007A6C]">{p.partnerCode}</span>
                      <span className="text-[10px] bg-slate-100 px-2 py-0.5 rounded uppercase font-bold text-slate-600">
                        {p.type}
                      </span>
                    </div>
                    <h3 className="font-bold text-sm text-slate-900">{p.name}</h3>
                    <div className="text-xs text-slate-500">
                      Location: {p.city || ""}, {p.country}
                    </div>
                    <div className="text-[11px] text-[#007A6C] font-semibold border-t pt-2">
                      Agreement: 35-40% of Akeezo Commission (on hospital receipt)
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "hospitals" && (
            <div className="p-6 h-full flex flex-col">
              <h1 className="text-xl font-black text-slate-800 pb-4">Hospital Network & Rate Cards</h1>
              <div className="grid grid-cols-3 gap-4">
                {hospitals.map((h) => (
                  <div key={h._id} className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-bold text-[#007A6C]">{h.hospitalCode}</span>
                      <div className="flex gap-1">
                        {h.accreditations?.map((acc: string) => (
                          <span key={acc} className="text-[9px] bg-emerald-100 text-emerald-800 px-1.5 py-0.2 rounded font-bold">
                            {acc}
                          </span>
                        ))}
                      </div>
                    </div>
                    <h3 className="font-bold text-sm text-slate-900">{h.name}</h3>
                    <div className="text-xs text-slate-500">{h.city}, {h.state}</div>
                    <div className="text-[11px] text-slate-600 border-t pt-2">
                      Commercial Terms: 15% billed commission · Payment: 30 days
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "finance" && (
            <FinanceWorkspace onRefresh={loadAllData} />
          )}
        </main>
      </div>

      {/* Case Detail Modal */}
      {selectedCaseId && (
        <CaseDetailModal
          caseId={selectedCaseId}
          onClose={closeCase}
          onRefresh={loadAllData}
        />
      )}

      {/* New Case Intake Modal */}
      {showNewCaseModal && (
        <NewCaseModal
          partners={partners}
          onClose={() => setShowNewCaseModal(false)}
          onSuccess={() => {
            setShowNewCaseModal(false);
            loadAllData();
          }}
        />
      )}
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <CaseManagementDashboard />
    </AuthProvider>
  );
};
