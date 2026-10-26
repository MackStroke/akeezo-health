import React, { useState, useEffect, useCallback, useMemo } from "react";
import { AuthProvider, useAuth } from "./context/AuthContext.js";
import {
  FeedbackProvider,
  TourProvider,
  useTour,
  TourStep,
  TablePagination,
  SortHeader,
  sortItems,
  getNextSortDirection,
  SortDirection,
  ViewToggle,
  ViewMode,
} from "@akeezo/ui";
import { AdminLoginView } from "./components/AdminLoginView.js";
import { Header } from "./components/Header.js";
import { Sidebar, NavTab } from "./components/Sidebar.js";
import { PipelineBoard } from "./components/PipelineBoard.js";
import { CaseDetailModal } from "./components/CaseDetailModal.js";
import { NewCaseModal } from "./components/NewCaseModal.js";
import { FinanceWorkspace } from "./components/FinanceWorkspace.js";
import { ArrowRight, Search, X, RefreshCw, Building2, Users, MapPin, ExternalLink, ShieldCheck } from "lucide-react";
import { apiFetch } from "./utils/api.js";

const CASE_MANAGEMENT_TOUR_STEPS: TourStep[] = [
  {
    id: "tour-welcome",
    targetSelector: '[data-tour="pipeline-board"]',
    title: "Welcome to Case Operations CMS",
    description: "Track and coordinate international patient journeys across 10 structured clinical stages—from New Referral and Hospital RFQs to Visa, Arrival, and Discharge.",
    badge: "Interactive Kanban",
    placement: "bottom",
    tip: "Click any patient card to review clinical details, manage hospital RFQs, and monitor commission allocations.",
  },
  {
    id: "tour-intake",
    targetSelector: '[data-tour="new-case-btn"]',
    title: "New Patient Case Intake",
    description: "Register new patient cases with live duplicate passport detection, referral partner attribution, and DPDP 2023 compliance checks.",
    badge: "Intake Flow",
    placement: "bottom",
    tip: "Required fields include Patient Legal Name, DOB, Phone, and Hospital Consent.",
  },
  {
    id: "tour-search",
    targetSelector: '[data-tour="search-bar"]',
    title: "Instant Global Search",
    description: "Filter and locate cases instantly by Patient Name, Case Code, Facilitator Partner, or Medical Specialty.",
    badge: "Search & Filter",
    placement: "bottom",
    tip: "Type any partial name or code to filter the entire pipeline in real time.",
  },
  {
    id: "tour-navigation",
    targetSelector: '[data-tour="nav-tabs"]',
    title: "Operational Workspaces",
    description: "Easily navigate between the Pipeline Board, All Cases tabular directory, Partner Facilitators, Hospital Network, and Finance Workspace.",
    badge: "Unified Navigation",
    placement: "right",
    tip: "Deep links are preserved across tabs and browser history.",
  },
  {
    id: "tour-help",
    targetSelector: '[data-tour="tour-btn"]',
    title: "Platform Tour & Contextual Guidance",
    description: "You can relaunch this walkthrough at any time by clicking this Compass button. Throughout the CMS, blocked buttons feature interactive guide popups detailing missing steps.",
    badge: "Guidance Always Available",
    placement: "bottom",
    tip: "Hover or click on any disabled button to view its prerequisite checklist.",
  },
];

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
  const { startTour } = useTour();
  const initialRoute = parseCurrentRoute();
  const [activeTab, setActiveTabState] = useState<NavTab>(initialRoute.tab);
  const [cases, setCases] = useState<any[]>([]);
  const [partners, setPartners] = useState<any[]>([]);
  const [hospitals, setHospitals] = useState<any[]>([]);

  const [selectedCaseId, setSelectedCaseId] = useState<string | null>(initialRoute.caseIdentifier);
  const [showNewCaseModal, setShowNewCaseModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Automatically start onboarding tour on first landing
  useEffect(() => {
    if (user) {
      const timer = setTimeout(() => {
        startTour("akeezo_case_management_tour", CASE_MANAGEMENT_TOUR_STEPS, false);
      }, 700);
      return () => clearTimeout(timer);
    }
  }, [user, startTour]);

  useEffect(() => {
    if (user) {
      loadAllData();
    }
  }, [user]);

  const loadAllData = async () => {
    try {
      const [casesRes, partnersRes, hospitalsRes] = await Promise.all([
        apiFetch("/api/v1/cases"),
        apiFetch("/api/v1/partners"),
        apiFetch("/api/v1/hospitals"),
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

  // Dynamic filter options
  const availableSpecialties = useMemo(() => {
    const s = new Set<string>();
    cases.forEach((c) => {
      if (c.specialty) s.add(c.specialty);
    });
    return Array.from(s);
  }, [cases]);

  const availableStages = useMemo(() => {
    const s = new Set<string>();
    cases.forEach((c) => {
      if (c.stage) s.add(c.stage);
    });
    return Array.from(s);
  }, [cases]);

  // Case List Sorting, Filtering & View State
  const [caseViewMode, setCaseViewMode] = useState<ViewMode>("table");
  const [caseSortField, setCaseSortField] = useState<string | null>("caseCode");
  const [caseSortDirection, setCaseSortDirection] = useState<SortDirection>("asc");
  const [stageFilter, setStageFilter] = useState<string>("all");
  const [urgencyFilter, setUrgencyFilter] = useState<string>("all");
  const [specialtyFilter, setSpecialtyFilter] = useState<string>("all");

  const handleCaseSort = (field: string) => {
    const next = getNextSortDirection(caseSortField, field, caseSortDirection);
    setCaseSortField(next.field);
    setCaseSortDirection(next.direction);
  };

  // Case List Pagination
  const [caseCurrentPage, setCaseCurrentPage] = useState(1);
  const [casePageSize, setCasePageSize] = useState(10);

  useEffect(() => {
    setCaseCurrentPage(1);
  }, [searchQuery, stageFilter, urgencyFilter, specialtyFilter, caseSortField, caseSortDirection]);

  const filteredCases = useMemo(() => {
    let result = cases;

    // 1. Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (c) =>
          c.caseCode?.toLowerCase().includes(q) ||
          c.patientId?.fullName?.toLowerCase().includes(q) ||
          c.partnerId?.name?.toLowerCase().includes(q) ||
          c.specialty?.toLowerCase().includes(q)
      );
    }

    // 2. Stage filter
    if (stageFilter !== "all") {
      result = result.filter((c) => c.stage === stageFilter);
    }

    // 3. Urgency filter
    if (urgencyFilter !== "all") {
      result = result.filter((c) => c.urgency === urgencyFilter);
    }

    // 4. Specialty filter
    if (specialtyFilter !== "all") {
      result = result.filter((c) => c.specialty === specialtyFilter);
    }

    // 5. Sorting
    return sortItems(result, caseSortField, caseSortDirection);
  }, [cases, searchQuery, stageFilter, urgencyFilter, specialtyFilter, caseSortField, caseSortDirection]);

  const activeCaseFiltersCount =
    (searchQuery ? 1 : 0) +
    (stageFilter !== "all" ? 1 : 0) +
    (urgencyFilter !== "all" ? 1 : 0) +
    (specialtyFilter !== "all" ? 1 : 0) +
    (caseSortField !== "caseCode" || caseSortDirection !== "asc" ? 1 : 0);

  const clearAllCaseFilters = () => {
    setSearchQuery("");
    setStageFilter("all");
    setUrgencyFilter("all");
    setSpecialtyFilter("all");
    setCaseSortField("caseCode");
    setCaseSortDirection("asc");
  };

  const totalCasePages = Math.max(1, Math.ceil(filteredCases.length / casePageSize));
  const safeCasePage = Math.min(Math.max(1, caseCurrentPage), totalCasePages);

  const paginatedCases = useMemo(() => {
    const start = (safeCasePage - 1) * casePageSize;
    return filteredCases.slice(start, start + casePageSize);
  }, [filteredCases, safeCasePage, casePageSize]);

  // --- Partners State, Filtering, Sorting & Pagination ---
  const [partnerViewMode, setPartnerViewMode] = useState<ViewMode>("grid");
  const [partnerSearchQuery, setPartnerSearchQuery] = useState("");
  const [partnerTypeFilter, setPartnerTypeFilter] = useState("all");
  const [partnerSortField, setPartnerSortField] = useState<string | null>("name");
  const [partnerSortDirection, setPartnerSortDirection] = useState<SortDirection>("asc");
  const [partnerCurrentPage, setPartnerCurrentPage] = useState(1);
  const [partnerPageSize, setPartnerPageSize] = useState(9);

  const handlePartnerSort = (field: string) => {
    const next = getNextSortDirection(partnerSortField, field, partnerSortDirection);
    setPartnerSortField(next.field);
    setPartnerSortDirection(next.direction);
  };

  const filteredPartners = useMemo(() => {
    let result = partners;
    if (partnerSearchQuery.trim()) {
      const q = partnerSearchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.partnerCode?.toLowerCase().includes(q) ||
          p.name?.toLowerCase().includes(q) ||
          p.city?.toLowerCase().includes(q) ||
          p.country?.toLowerCase().includes(q)
      );
    }
    if (partnerTypeFilter !== "all") {
      result = result.filter((p) => p.type === partnerTypeFilter);
    }
    return sortItems(result, partnerSortField, partnerSortDirection);
  }, [partners, partnerSearchQuery, partnerTypeFilter, partnerSortField, partnerSortDirection]);

  const totalPartnerPages = Math.max(1, Math.ceil(filteredPartners.length / partnerPageSize));
  const safePartnerPage = Math.min(Math.max(1, partnerCurrentPage), totalPartnerPages);

  const paginatedPartners = useMemo(() => {
    const start = (safePartnerPage - 1) * partnerPageSize;
    return filteredPartners.slice(start, start + partnerPageSize);
  }, [filteredPartners, safePartnerPage, partnerPageSize]);

  const activePartnerFiltersCount =
    (partnerSearchQuery ? 1 : 0) +
    (partnerTypeFilter !== "all" ? 1 : 0) +
    (partnerSortField !== "name" || partnerSortDirection !== "asc" ? 1 : 0);

  const clearAllPartnerFilters = () => {
    setPartnerSearchQuery("");
    setPartnerTypeFilter("all");
    setPartnerSortField("name");
    setPartnerSortDirection("asc");
  };

  // --- Hospitals State, Filtering, Sorting & Pagination ---
  const [hospitalViewMode, setHospitalViewMode] = useState<ViewMode>("grid");
  const [hospitalSearchQuery, setHospitalSearchQuery] = useState("");
  const [hospitalAccreditationFilter, setHospitalAccreditationFilter] = useState("all");
  const [hospitalSortField, setHospitalSortField] = useState<string | null>("name");
  const [hospitalSortDirection, setHospitalSortDirection] = useState<SortDirection>("asc");
  const [hospitalCurrentPage, setHospitalCurrentPage] = useState(1);
  const [hospitalPageSize, setHospitalPageSize] = useState(9);

  const handleHospitalSort = (field: string) => {
    const next = getNextSortDirection(hospitalSortField, field, hospitalSortDirection);
    setHospitalSortField(next.field);
    setHospitalSortDirection(next.direction);
  };

  const filteredHospitals = useMemo(() => {
    let result = hospitals;
    if (hospitalSearchQuery.trim()) {
      const q = hospitalSearchQuery.toLowerCase();
      result = result.filter(
        (h) =>
          h.hospitalCode?.toLowerCase().includes(q) ||
          h.name?.toLowerCase().includes(q) ||
          h.city?.toLowerCase().includes(q) ||
          h.state?.toLowerCase().includes(q)
      );
    }
    if (hospitalAccreditationFilter !== "all") {
      result = result.filter(
        (h) => Array.isArray(h.accreditations) && h.accreditations.includes(hospitalAccreditationFilter)
      );
    }
    return sortItems(result, hospitalSortField, hospitalSortDirection);
  }, [hospitals, hospitalSearchQuery, hospitalAccreditationFilter, hospitalSortField, hospitalSortDirection]);

  const totalHospitalPages = Math.max(1, Math.ceil(filteredHospitals.length / hospitalPageSize));
  const safeHospitalPage = Math.min(Math.max(1, hospitalCurrentPage), totalHospitalPages);

  const paginatedHospitals = useMemo(() => {
    const start = (safeHospitalPage - 1) * hospitalPageSize;
    return filteredHospitals.slice(start, start + hospitalPageSize);
  }, [filteredHospitals, safeHospitalPage, hospitalPageSize]);

  const activeHospitalFiltersCount =
    (hospitalSearchQuery ? 1 : 0) +
    (hospitalAccreditationFilter !== "all" ? 1 : 0) +
    (hospitalSortField !== "name" || hospitalSortDirection !== "asc" ? 1 : 0);

  const clearAllHospitalFilters = () => {
    setHospitalSearchQuery("");
    setHospitalAccreditationFilter("all");
    setHospitalSortField("name");
    setHospitalSortDirection("asc");
  };

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

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-800">
      {/* Top Navigation */}
      <Header
        activeTab={activeTab}
        onSelectTab={selectTab}
        onOpenNewCase={() => setShowNewCaseModal(true)}
        onStartTour={() => startTour("akeezo_case_management_tour", CASE_MANAGEMENT_TOUR_STEPS, true)}
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
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4">
                <div>
                  <h1 className="text-xl font-black text-slate-800">All Patient Cases</h1>
                  <p className="text-xs text-slate-500">
                    Comprehensive patient directory with specialty, urgency, and clinical stage filters.
                  </p>
                </div>
              </div>

              {/* Filter and Search Controls */}
              <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs mb-4 flex flex-col lg:flex-row lg:items-center justify-between gap-3">
                <div className="relative w-full lg:w-72">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search code, patient, partner..."
                    className="w-full h-9 text-xs pl-8 pr-7 bg-slate-50 border border-slate-200 rounded-lg shadow-2xs focus:bg-white focus:border-[#007A6C] focus:ring-1 focus:ring-[#007A6C] focus:outline-none"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery("")}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                      title="Clear search"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-2.5 w-full lg:w-auto justify-between lg:justify-end">
                  <div className="flex items-center gap-2">
                    <select
                      value={stageFilter}
                      onChange={(e) => setStageFilter(e.target.value)}
                      className="h-9 text-xs px-3 bg-slate-50 border border-slate-200 rounded-lg shadow-2xs focus:bg-white focus:outline-none focus:border-[#007A6C] font-medium capitalize text-slate-700"
                    >
                      <option value="all">All Stages</option>
                      {availableStages.map((s) => (
                        <option key={s} value={s}>
                          {s.replace(/_/g, " ")}
                        </option>
                      ))}
                    </select>

                    <select
                      value={urgencyFilter}
                      onChange={(e) => setUrgencyFilter(e.target.value)}
                      className="h-9 text-xs px-3 bg-slate-50 border border-slate-200 rounded-lg shadow-2xs focus:bg-white focus:outline-none focus:border-[#007A6C] font-medium capitalize text-slate-700"
                    >
                      <option value="all">All Urgencies</option>
                      <option value="routine">Routine</option>
                      <option value="urgent">Urgent</option>
                      <option value="emergency">Emergency</option>
                    </select>

                    <select
                      value={specialtyFilter}
                      onChange={(e) => setSpecialtyFilter(e.target.value)}
                      className="h-9 text-xs px-3 bg-slate-50 border border-slate-200 rounded-lg shadow-2xs focus:bg-white focus:outline-none focus:border-[#007A6C] font-medium capitalize text-slate-700"
                    >
                      <option value="all">All Specialties</option>
                      {availableSpecialties.map((sp) => (
                        <option key={sp} value={sp}>
                          {sp.replace(/_/g, " ")}
                        </option>
                      ))}
                    </select>

                    {activeCaseFiltersCount > 0 && (
                      <button
                        onClick={clearAllCaseFilters}
                        className="h-9 inline-flex items-center gap-1.5 px-3 rounded-lg text-xs font-semibold text-[#007A6C] bg-[#E6F8F6] hover:bg-[#d0f2ee] transition border border-[#00C7BE]/30 shadow-2xs"
                        title="Reset all filters and sorting"
                      >
                        <RefreshCw className="w-3 h-3" />
                        <span>Reset ({activeCaseFiltersCount})</span>
                      </button>
                    )}
                  </div>

                  {/* Layout Toggle */}
                  <div className="shrink-0 pl-1 border-l border-slate-200">
                    <ViewToggle
                      mode={caseViewMode}
                      onChange={setCaseViewMode}
                    />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
                {caseViewMode === "table" ? (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
                        <tr>
                          <SortHeader
                            label="Case Code"
                            field="caseCode"
                            currentField={caseSortField}
                            currentDirection={caseSortDirection}
                            onSort={handleCaseSort}
                            className="p-3"
                          />
                          <SortHeader
                            label="Patient"
                            field="patientId.fullName"
                            currentField={caseSortField}
                            currentDirection={caseSortDirection}
                            onSort={handleCaseSort}
                            className="p-3"
                          />
                          <SortHeader
                            label="Partner"
                            field="partnerId.name"
                            currentField={caseSortField}
                            currentDirection={caseSortDirection}
                            onSort={handleCaseSort}
                            className="p-3"
                          />
                          <SortHeader
                            label="Specialty"
                            field="specialty"
                            currentField={caseSortField}
                            currentDirection={caseSortDirection}
                            onSort={handleCaseSort}
                            className="p-3"
                          />
                          <SortHeader
                            label="Urgency"
                            field="urgency"
                            currentField={caseSortField}
                            currentDirection={caseSortDirection}
                            onSort={handleCaseSort}
                            className="p-3"
                          />
                          <SortHeader
                            label="Stage"
                            field="stage"
                            currentField={caseSortField}
                            currentDirection={caseSortDirection}
                            onSort={handleCaseSort}
                            className="p-3"
                          />
                          <th className="p-3 text-right">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {paginatedCases.length === 0 ? (
                          <tr>
                            <td colSpan={7} className="p-8 text-center text-slate-400">
                              No cases matching the selected filters.
                            </td>
                          </tr>
                        ) : (
                          paginatedCases.map((c) => (
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
                              <td className="p-3 text-right">
                                <button className="text-[#007A6C] hover:text-[#005F54] font-bold inline-flex items-center gap-1 text-[11px]">
                                  <span>Open</span>
                                  <ArrowRight className="w-3 h-3" />
                                </button>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  /* Grid Card View */
                  <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {paginatedCases.length === 0 ? (
                      <div className="col-span-full p-8 text-center text-slate-400">
                        No cases matching the selected filters.
                      </div>
                    ) : (
                      paginatedCases.map((c) => (
                        <div
                          key={c._id}
                          onClick={() => openCase(c.caseCode || c._id)}
                          className="p-4 bg-white rounded-xl border border-slate-200 hover:border-[#00C7BE] hover:shadow-md transition-all cursor-pointer flex flex-col justify-between space-y-3 group"
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-mono text-xs font-bold text-[#007A6C] bg-[#E6F8F6] px-2 py-0.5 rounded border border-[#00C7BE]/30">
                              {c.caseCode}
                            </span>
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700 capitalize">
                              {c.stage?.replace(/_/g, " ")}
                            </span>
                          </div>

                          <div>
                            <h3 className="font-bold text-sm text-slate-900 group-hover:text-[#007A6C] transition-colors">
                              {c.patientId?.fullName || "Unnamed Patient"}
                            </h3>
                            <p className="text-xs text-slate-500 capitalize">
                              {c.specialty?.replace(/_/g, " ") || "General Medicine"}
                            </p>
                          </div>

                          <div className="text-xs text-slate-500 flex items-center justify-between border-t border-slate-100 pt-2.5">
                            <span className="truncate max-w-[140px] text-[11px] text-slate-600">
                              Partner: <strong>{c.partnerId?.name || "Direct Referral"}</strong>
                            </span>
                            <span
                              className={`text-[10px] font-bold uppercase px-1.5 py-0.5 rounded ${
                                c.urgency === "emergency"
                                  ? "bg-rose-100 text-rose-700"
                                  : c.urgency === "urgent"
                                  ? "bg-amber-100 text-amber-700"
                                  : "bg-emerald-100 text-emerald-700"
                              }`}
                            >
                              {c.urgency || "routine"}
                            </span>
                          </div>

                          <div className="flex items-center justify-end pt-1">
                            <span className="text-[#007A6C] group-hover:translate-x-0.5 transition-transform font-bold flex items-center gap-1 text-xs">
                              <span>Review Case</span>
                              <ArrowRight className="w-3.5 h-3.5" />
                            </span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                )}

                {/* Table Pagination */}
                <TablePagination
                  currentPage={safeCasePage}
                  totalItems={filteredCases.length}
                  pageSize={casePageSize}
                  onPageChange={setCaseCurrentPage}
                  onPageSizeChange={setCasePageSize}
                  pageSizeOptions={[10, 25, 50, 100]}
                  itemLabel="patient cases"
                />
              </div>
            </div>
          )}

          {activeTab === "partners" && (
            <div className="p-6 h-full flex flex-col">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4">
                <div>
                  <h1 className="text-xl font-black text-slate-800">Partner Facilitators & Agencies</h1>
                  <p className="text-xs text-slate-500">
                    Directory of registered medical travel facilitators, agencies, and regional patient coordinators.
                  </p>
                </div>
              </div>

              {/* Partners Filter and Search Toolbar */}
              <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs mb-4 flex flex-col lg:flex-row lg:items-center justify-between gap-3">
                <div className="relative w-full lg:w-72">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={partnerSearchQuery}
                    onChange={(e) => setPartnerSearchQuery(e.target.value)}
                    placeholder="Search partner name, code, country..."
                    className="w-full h-9 text-xs pl-8 pr-7 bg-slate-50 border border-slate-200 rounded-lg shadow-2xs focus:bg-white focus:border-[#007A6C] focus:ring-1 focus:ring-[#007A6C] focus:outline-none"
                  />
                  {partnerSearchQuery && (
                    <button
                      onClick={() => setPartnerSearchQuery("")}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                      title="Clear search"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-2.5 w-full lg:w-auto justify-between lg:justify-end">
                  <div className="flex items-center gap-2">
                    <select
                      value={partnerTypeFilter}
                      onChange={(e) => setPartnerTypeFilter(e.target.value)}
                      className="h-9 text-xs px-3 bg-slate-50 border border-slate-200 rounded-lg shadow-2xs focus:bg-white focus:outline-none focus:border-[#007A6C] font-medium capitalize text-slate-700"
                    >
                      <option value="all">All Types</option>
                      <option value="facilitator">Facilitator</option>
                      <option value="agency">Agency</option>
                      <option value="hospital_affiliate">Hospital Affiliate</option>
                      <option value="independent">Independent</option>
                    </select>

                    {activePartnerFiltersCount > 0 && (
                      <button
                        onClick={clearAllPartnerFilters}
                        className="h-9 inline-flex items-center gap-1.5 px-3 rounded-lg text-xs font-semibold text-[#007A6C] bg-[#E6F8F6] hover:bg-[#d0f2ee] transition border border-[#00C7BE]/30 shadow-2xs"
                        title="Reset all filters and sorting"
                      >
                        <RefreshCw className="w-3 h-3" />
                        <span>Reset ({activePartnerFiltersCount})</span>
                      </button>
                    )}
                  </div>

                  {/* Layout Toggle */}
                  <div className="shrink-0 pl-1 border-l border-slate-200">
                    <ViewToggle
                      mode={partnerViewMode}
                      onChange={setPartnerViewMode}
                    />
                  </div>
                </div>
              </div>

              {/* Partners Content */}
              <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
                {partnerViewMode === "table" ? (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
                        <tr>
                          <SortHeader
                            label="Partner Code"
                            field="partnerCode"
                            currentField={partnerSortField}
                            currentDirection={partnerSortDirection}
                            onSort={handlePartnerSort}
                            className="p-3"
                          />
                          <SortHeader
                            label="Partner Name"
                            field="name"
                            currentField={partnerSortField}
                            currentDirection={partnerSortDirection}
                            onSort={handlePartnerSort}
                            className="p-3"
                          />
                          <SortHeader
                            label="Type"
                            field="type"
                            currentField={partnerSortField}
                            currentDirection={partnerSortDirection}
                            onSort={handlePartnerSort}
                            className="p-3"
                          />
                          <SortHeader
                            label="Location"
                            field="city"
                            currentField={partnerSortField}
                            currentDirection={partnerSortDirection}
                            onSort={handlePartnerSort}
                            className="p-3"
                          />
                          <th className="p-3">Commercial Agreement</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {paginatedPartners.length === 0 ? (
                          <tr>
                            <td colSpan={5} className="p-8 text-center text-slate-400">
                              No partners matching the selected filters.
                            </td>
                          </tr>
                        ) : (
                          paginatedPartners.map((p) => (
                            <tr key={p._id} className="hover:bg-slate-50">
                              <td className="p-3 font-mono font-bold text-[#007A6C]">{p.partnerCode}</td>
                              <td className="p-3 font-semibold text-slate-900">{p.name}</td>
                              <td className="p-3">
                                <span className="text-[10px] bg-slate-100 px-2 py-0.5 rounded uppercase font-bold text-slate-600">
                                  {p.type}
                                </span>
                              </td>
                              <td className="p-3 text-slate-600">
                                {p.city ? `${p.city}, ` : ""}{p.country}
                              </td>
                              <td className="p-3 text-[11px] text-[#007A6C] font-semibold">
                                35-40% of Akeezo Commission (on hospital receipt)
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  /* Grid Card View */
                  <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {paginatedPartners.length === 0 ? (
                      <div className="col-span-full p-8 text-center text-slate-400">
                        No partners matching the selected filters.
                      </div>
                    ) : (
                      paginatedPartners.map((p) => (
                        <div key={p._id} className="p-4 bg-white rounded-xl border border-slate-200 hover:border-[#00C7BE] hover:shadow-md transition-all space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="font-mono text-xs font-bold text-[#007A6C]">{p.partnerCode}</span>
                            <span className="text-[10px] bg-slate-100 px-2 py-0.5 rounded uppercase font-bold text-slate-600">
                              {p.type}
                            </span>
                          </div>
                          <h3 className="font-bold text-sm text-slate-900">{p.name}</h3>
                          <div className="text-xs text-slate-500 flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-slate-400" />
                            <span>{p.city ? `${p.city}, ` : ""}{p.country}</span>
                          </div>
                          <div className="text-[11px] text-[#007A6C] font-semibold border-t pt-2">
                            Agreement: 35-40% of Akeezo Commission (on hospital receipt)
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                )}

                {/* Table Pagination */}
                <TablePagination
                  currentPage={safePartnerPage}
                  totalItems={filteredPartners.length}
                  pageSize={partnerPageSize}
                  onPageChange={setPartnerCurrentPage}
                  onPageSizeChange={setPartnerPageSize}
                  pageSizeOptions={[9, 18, 36, 72]}
                  itemLabel="partners"
                />
              </div>
            </div>
          )}

          {activeTab === "hospitals" && (
            <div className="p-6 h-full flex flex-col">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4">
                <div>
                  <h1 className="text-xl font-black text-slate-800">Hospital Network & Rate Cards</h1>
                  <p className="text-xs text-slate-500">
                    Accredited tertiary hospital partners, clinical specialties, and negotiated commission schedules.
                  </p>
                </div>
              </div>

              {/* Hospitals Filter and Search Toolbar */}
              <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs mb-4 flex flex-col lg:flex-row lg:items-center justify-between gap-3">
                <div className="relative w-full lg:w-72">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={hospitalSearchQuery}
                    onChange={(e) => setHospitalSearchQuery(e.target.value)}
                    placeholder="Search hospital name, code, city..."
                    className="w-full h-9 text-xs pl-8 pr-7 bg-slate-50 border border-slate-200 rounded-lg shadow-2xs focus:bg-white focus:border-[#007A6C] focus:ring-1 focus:ring-[#007A6C] focus:outline-none"
                  />
                  {hospitalSearchQuery && (
                    <button
                      onClick={() => setHospitalSearchQuery("")}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                      title="Clear search"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-2.5 w-full lg:w-auto justify-between lg:justify-end">
                  <div className="flex items-center gap-2">
                    <select
                      value={hospitalAccreditationFilter}
                      onChange={(e) => setHospitalAccreditationFilter(e.target.value)}
                      className="h-9 text-xs px-3 bg-slate-50 border border-slate-200 rounded-lg shadow-2xs focus:bg-white focus:outline-none focus:border-[#007A6C] font-medium capitalize text-slate-700"
                    >
                      <option value="all">All Accreditations</option>
                      <option value="JCI">JCI Accredited</option>
                      <option value="NABH">NABH Accredited</option>
                      <option value="NABL">NABL Accredited</option>
                    </select>

                    {activeHospitalFiltersCount > 0 && (
                      <button
                        onClick={clearAllHospitalFilters}
                        className="h-9 inline-flex items-center gap-1.5 px-3 rounded-lg text-xs font-semibold text-[#007A6C] bg-[#E6F8F6] hover:bg-[#d0f2ee] transition border border-[#00C7BE]/30 shadow-2xs"
                        title="Reset all filters and sorting"
                      >
                        <RefreshCw className="w-3 h-3" />
                        <span>Reset ({activeHospitalFiltersCount})</span>
                      </button>
                    )}
                  </div>

                  {/* Layout Toggle */}
                  <div className="shrink-0 pl-1 border-l border-slate-200">
                    <ViewToggle
                      mode={hospitalViewMode}
                      onChange={setHospitalViewMode}
                    />
                  </div>
                </div>
              </div>

              {/* Hospitals Content */}
              <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
                {hospitalViewMode === "table" ? (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
                        <tr>
                          <SortHeader
                            label="Hospital Code"
                            field="hospitalCode"
                            currentField={hospitalSortField}
                            currentDirection={hospitalSortDirection}
                            onSort={handleHospitalSort}
                            className="p-3"
                          />
                          <SortHeader
                            label="Hospital Name"
                            field="name"
                            currentField={hospitalSortField}
                            currentDirection={hospitalSortDirection}
                            onSort={handleHospitalSort}
                            className="p-3"
                          />
                          <th className="p-3">Accreditations</th>
                          <SortHeader
                            label="Location"
                            field="city"
                            currentField={hospitalSortField}
                            currentDirection={hospitalSortDirection}
                            onSort={handleHospitalSort}
                            className="p-3"
                          />
                          <th className="p-3">Commercial Terms</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {paginatedHospitals.length === 0 ? (
                          <tr>
                            <td colSpan={5} className="p-8 text-center text-slate-400">
                              No hospitals matching the selected filters.
                            </td>
                          </tr>
                        ) : (
                          paginatedHospitals.map((h) => (
                            <tr key={h._id} className="hover:bg-slate-50">
                              <td className="p-3 font-mono font-bold text-[#007A6C]">{h.hospitalCode}</td>
                              <td className="p-3 font-semibold text-slate-900">{h.name}</td>
                              <td className="p-3">
                                <div className="flex gap-1">
                                  {h.accreditations?.map((acc: string) => (
                                    <span key={acc} className="text-[9px] bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded font-bold">
                                      {acc}
                                    </span>
                                  ))}
                                </div>
                              </td>
                              <td className="p-3 text-slate-600">
                                {h.city ? `${h.city}, ` : ""}{h.state}
                              </td>
                              <td className="p-3 text-[11px] text-slate-600">
                                15% billed commission · Payment: 30 days
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  /* Grid Card View */
                  <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {paginatedHospitals.length === 0 ? (
                      <div className="col-span-full p-8 text-center text-slate-400">
                        No hospitals matching the selected filters.
                      </div>
                    ) : (
                      paginatedHospitals.map((h) => (
                        <div key={h._id} className="p-4 bg-white rounded-xl border border-slate-200 hover:border-[#00C7BE] hover:shadow-md transition-all space-y-2">
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
                          <div className="text-xs text-slate-500 flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-slate-400" />
                            <span>{h.city}, {h.state}</span>
                          </div>
                          <div className="text-[11px] text-slate-600 border-t pt-2">
                            Commercial Terms: 15% billed commission · Payment: 30 days
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                )}

                {/* Table Pagination */}
                <TablePagination
                  currentPage={safeHospitalPage}
                  totalItems={filteredHospitals.length}
                  pageSize={hospitalPageSize}
                  onPageChange={setHospitalCurrentPage}
                  onPageSizeChange={setHospitalPageSize}
                  pageSizeOptions={[9, 18, 36, 72]}
                  itemLabel="hospitals"
                />
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
      <FeedbackProvider>
        <TourProvider>
          <CaseManagementDashboard />
        </TourProvider>
      </FeedbackProvider>
    </AuthProvider>
  );
};
