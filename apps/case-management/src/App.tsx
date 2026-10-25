import React, { useState, useEffect } from "react";
import { AuthProvider, useAuth } from "./context/AuthContext.js";
import { AdminLoginView } from "./components/AdminLoginView.js";
import { Header } from "./components/Header.js";
import { Sidebar, NavTab } from "./components/Sidebar.js";
import { PipelineBoard } from "./components/PipelineBoard.js";
import { CaseDetailModal } from "./components/CaseDetailModal.js";
import { NewCaseModal } from "./components/NewCaseModal.js";
import { FinanceWorkspace } from "./components/FinanceWorkspace.js";
import { SiteAdminView } from "./components/cms/SiteAdminView.js";
import { ArrowRight } from "lucide-react";

const CaseManagementDashboard: React.FC = () => {
  const { user, isLoading } = useAuth();
  const [activeTab, setActiveTab] = useState<NavTab>("board");
  const [cases, setCases] = useState<any[]>([]);
  const [partners, setPartners] = useState<any[]>([]);
  const [hospitals, setHospitals] = useState<any[]>([]);

  const [selectedCaseId, setSelectedCaseId] = useState<string | null>(null);
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

      setCases(casesJson.data || []);
      setPartners(partnersJson.data || []);
      setHospitals(hospitalsJson.data || []);
    } catch (err) {
      console.error("Failed to load platform data", err);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white text-xs font-semibold">
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
        onSelectTab={setActiveTab}
        onOpenNewCase={() => setShowNewCaseModal(true)}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar */}
        <Sidebar
          activeTab={activeTab}
          onSelectTab={setActiveTab}
          caseCount={cases.length}
        />

        {/* Main Content Pane */}
        <main className="flex-1 overflow-y-auto">
          {activeTab === "board" && (
            <PipelineBoard
              cases={filteredCases}
              onSelectCase={(id) => setSelectedCaseId(id)}
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
                        onClick={() => setSelectedCaseId(c._id)}
                        className="hover:bg-slate-50 cursor-pointer"
                      >
                        <td className="p-3 font-mono font-bold text-teal-800">{c.caseCode}</td>
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
                          <button className="text-teal-700 font-bold flex items-center gap-1 text-[11px]">
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
                      <span className="font-mono text-xs font-bold text-teal-800">{p.partnerCode}</span>
                      <span className="text-[10px] bg-slate-100 px-2 py-0.5 rounded uppercase font-bold text-slate-600">
                        {p.type}
                      </span>
                    </div>
                    <h3 className="font-bold text-sm text-slate-900">{p.name}</h3>
                    <div className="text-xs text-slate-500">
                      Location: {p.city || ""}, {p.country}
                    </div>
                    <div className="text-[11px] text-teal-700 font-semibold border-t pt-2">
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
                      <span className="font-mono text-xs font-bold text-teal-800">{h.hospitalCode}</span>
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

          {activeTab === "site-admin" && (
            <div className="p-6">
              <SiteAdminView />
            </div>
          )}
        </main>
      </div>

      {/* Case Detail Modal */}
      {selectedCaseId && (
        <CaseDetailModal
          caseId={selectedCaseId}
          onClose={() => setSelectedCaseId(null)}
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
