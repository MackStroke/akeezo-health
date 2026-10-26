import React, { useState, useMemo } from "react";
import { Clock, AlertTriangle, UserCheck, Hospital, ArrowRight, Search, X, RefreshCw } from "lucide-react";
import { CASE_STAGES, CaseStage } from "@akeezo/contracts";
import {
  ViewToggle,
  ViewMode,
  TablePagination,
  SortHeader,
  sortItems,
  getNextSortDirection,
  SortDirection,
} from "@akeezo/ui";

export const STAGE_CONFIG: Record<
  CaseStage,
  { label: string; bg: string; border: string; badge: string }
> = {
  new_referral: {
    label: "New Referral",
    bg: "bg-slate-50",
    border: "border-slate-300",
    badge: "bg-slate-200 text-slate-800",
  },
  under_review: {
    label: "Under Review",
    bg: "bg-amber-50/50",
    border: "border-amber-200",
    badge: "bg-amber-100 text-amber-800",
  },
  quotes_requested: {
    label: "Quotes Requested",
    bg: "bg-sky-50/50",
    border: "border-sky-200",
    badge: "bg-sky-100 text-sky-800",
  },
  quotes_shared: {
    label: "Quotes Shared",
    bg: "bg-[#E6F8F6]/70",
    border: "border-[#00C7BE]/40",
    badge: "bg-[#E6F8F6] text-[#007A6C] font-semibold",
  },
  partner_decision: {
    label: "Partner Decision",
    bg: "bg-[#FFF4EC]/70",
    border: "border-[#FF6B00]/40",
    badge: "bg-[#FFF4EC] text-[#FF6B00] font-semibold",
  },
  visa_travel: {
    label: "Visa & Travel",
    bg: "bg-[#E6F8F6]/50",
    border: "border-teal-200",
    badge: "bg-teal-50 text-teal-800",
  },
  arrival: {
    label: "Arrival in India",
    bg: "bg-[#E6F8F6]/80",
    border: "border-[#00C7BE]/50",
    badge: "bg-[#E6F8F6] text-[#007A6C] font-bold",
  },
  consultation: {
    label: "Consultation",
    bg: "bg-emerald-50/50",
    border: "border-emerald-200",
    badge: "bg-emerald-100 text-emerald-800",
  },
  final_quotation: {
    label: "Final Quotation",
    bg: "bg-amber-50/50",
    border: "border-amber-200",
    badge: "bg-amber-100 text-amber-800",
  },
  mapped: {
    label: "Mapped to Hospital",
    bg: "bg-lime-50/50",
    border: "border-lime-200",
    badge: "bg-lime-100 text-lime-800",
  },
  in_treatment: {
    label: "In Treatment",
    bg: "bg-emerald-100/50",
    border: "border-emerald-300",
    badge: "bg-emerald-200 text-emerald-900 font-bold",
  },
  treatment_completed: {
    label: "Treatment Done",
    bg: "bg-teal-100/50",
    border: "border-teal-300",
    badge: "bg-teal-200 text-teal-900",
  },
  settlement: {
    label: "Settlement",
    bg: "bg-[#FFF4EC]/80",
    border: "border-[#FF6B00]/40",
    badge: "bg-[#FF6B00] text-white font-bold",
  },
  closed: {
    label: "Closed",
    bg: "bg-slate-100",
    border: "border-slate-300",
    badge: "bg-slate-300 text-slate-700",
  },
};

interface PipelineBoardProps {
  cases: any[];
  onSelectCase: (caseId: string) => void;
}

export const PipelineBoard: React.FC<PipelineBoardProps> = ({
  cases,
  onSelectCase,
}) => {
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [search, setSearch] = useState("");
  const [stageFilter, setStageFilter] = useState("all");
  const [urgencyFilter, setUrgencyFilter] = useState("all");

  // Sorting for Table View
  const [sortField, setSortField] = useState<string | null>("createdAt");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");

  const handleSort = (field: string) => {
    const next = getNextSortDirection(sortField, field, sortDirection);
    setSortField(next.field);
    setSortDirection(next.direction);
  };

  // Pagination for Table View
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const filteredCases = useMemo(() => {
    let result = cases;

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (c) =>
          c.caseCode?.toLowerCase().includes(q) ||
          c.patientId?.fullName?.toLowerCase().includes(q) ||
          c.partnerId?.name?.toLowerCase().includes(q) ||
          c.diagnosisSummary?.toLowerCase().includes(q)
      );
    }

    if (stageFilter !== "all") {
      result = result.filter((c) => c.stage === stageFilter);
    }

    if (urgencyFilter !== "all") {
      result = result.filter((c) => c.urgency === urgencyFilter);
    }

    return sortItems(result, sortField, sortDirection);
  }, [cases, search, stageFilter, urgencyFilter, sortField, sortDirection]);

  // Group cases by stage for Kanban board view
  const groupedCases = useMemo(() => {
    const groups: Record<CaseStage, any[]> = {} as any;
    for (const stage of CASE_STAGES) {
      groups[stage] = [];
    }
    for (const c of filteredCases) {
      if (groups[c.stage as CaseStage]) {
        groups[c.stage as CaseStage].push(c);
      }
    }
    return groups;
  }, [filteredCases]);

  const totalPages = Math.max(1, Math.ceil(filteredCases.length / pageSize));
  const safePage = Math.min(Math.max(1, currentPage), totalPages);

  const paginatedCases = useMemo(() => {
    const start = (safePage - 1) * pageSize;
    return filteredCases.slice(start, start + pageSize);
  }, [filteredCases, safePage, pageSize]);

  const activeFiltersCount =
    (search ? 1 : 0) +
    (stageFilter !== "all" ? 1 : 0) +
    (urgencyFilter !== "all" ? 1 : 0) +
    (sortField !== "createdAt" || sortDirection !== "desc" ? 1 : 0);

  const clearFilters = () => {
    setSearch("");
    setStageFilter("all");
    setUrgencyFilter("all");
    setSortField("createdAt");
    setSortDirection("desc");
  };

  return (
    <div data-tour="pipeline-board" className="h-full flex flex-col p-6 overflow-hidden">
      {/* Header and Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 mb-2 border-b border-slate-200">
        <div>
          <h1 className="text-xl font-black text-slate-800 tracking-tight">
            Case Lifecycle Pipeline
          </h1>
          <p className="text-xs text-slate-500">
            12-step end-to-end journey from Partner referral to final Commission settlement.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Search Input */}
          <div className="relative w-full sm:w-60">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search code, patient, diagnosis..."
              className="w-full h-9 text-xs pl-8 pr-7 bg-white border border-slate-200 rounded-lg shadow-2xs focus:outline-none focus:border-[#007A6C] focus:ring-1 focus:ring-[#007A6C]"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                title="Clear search"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Filter Dropdowns Cluster */}
          <div className="flex items-center gap-2">
            <select
              value={stageFilter}
              onChange={(e) => setStageFilter(e.target.value)}
              className="h-9 text-xs px-3 bg-white border border-slate-200 rounded-lg shadow-2xs focus:outline-none focus:border-[#007A6C] font-medium capitalize text-slate-700"
            >
              <option value="all">All Stages</option>
              {CASE_STAGES.map((st) => (
                <option key={st} value={st}>
                  {STAGE_CONFIG[st]?.label || st}
                </option>
              ))}
            </select>

            <select
              value={urgencyFilter}
              onChange={(e) => setUrgencyFilter(e.target.value)}
              className="h-9 text-xs px-3 bg-white border border-slate-200 rounded-lg shadow-2xs focus:outline-none focus:border-[#007A6C] font-medium capitalize text-slate-700"
            >
              <option value="all">All Urgencies</option>
              <option value="routine">Routine</option>
              <option value="priority">Priority</option>
              <option value="critical">Critical</option>
            </select>

            {activeFiltersCount > 0 && (
              <button
                onClick={clearFilters}
                className="h-9 inline-flex items-center gap-1.5 px-3 rounded-lg text-xs font-semibold text-[#007A6C] bg-[#E6F8F6] hover:bg-[#d0f2ee] transition border border-[#00C7BE]/30 shadow-2xs"
                title="Reset all filters"
              >
                <RefreshCw className="w-3 h-3" />
                <span>Reset ({activeFiltersCount})</span>
              </button>
            )}
          </div>

          {/* View Toggle Cluster with Visual Separator */}
          <div className="shrink-0 flex items-center pl-1 border-l border-slate-200">
            <ViewToggle
              mode={viewMode}
              onChange={setViewMode}
              gridLabel="Board"
              tableLabel="Table"
            />
          </div>
        </div>
      </div>

      {/* Main View Area */}
      {viewMode === "grid" ? (
        /* Kanban Board Columns View */
        <div className="flex-1 overflow-x-auto pb-4 pt-1">
          <div className="flex gap-4 min-w-max h-full">
            {CASE_STAGES.filter((s) => s !== "closed").map((stage) => {
              const config = STAGE_CONFIG[stage];
              const stageCases = groupedCases[stage] || [];

              return (
                <div
                  key={stage}
                  className={`w-72 shrink-0 flex flex-col rounded-xl border ${config.border} ${config.bg} shadow-sm overflow-hidden`}
                >
                  {/* Column Header */}
                  <div className="p-3 border-b border-slate-200/80 bg-white/70 flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-800">
                      {config.label}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${config.badge}`}
                    >
                      {stageCases.length}
                    </span>
                  </div>

                  {/* Cards Container */}
                  <div className="flex-1 p-2 space-y-2.5 overflow-y-auto max-h-[calc(100vh-14rem)]">
                    {stageCases.length === 0 ? (
                      <div className="text-center py-8 text-[11px] text-slate-400">
                        No cases in stage
                      </div>
                    ) : (
                      stageCases.map((c) => {
                        const daysInStage = Math.floor(
                          (Date.now() - new Date(c.stageChangedAt || c.createdAt).getTime()) /
                            (1000 * 60 * 60 * 24)
                        );
                        const isStale = daysInStage >= 7;

                        return (
                          <div
                            key={c._id}
                            onClick={() => onSelectCase(c._id)}
                            className="bg-white p-3 rounded-lg border border-slate-200 shadow-xs hover:shadow-md hover:border-[#00C7BE] transition-all cursor-pointer group"
                          >
                            <div className="flex items-center justify-between pb-1.5">
                              <span className="text-[11px] font-mono font-bold text-[#007A6C]">
                                {c.caseCode}
                              </span>
                              <span
                                className={`text-[10px] font-semibold px-1.5 py-0.5 rounded uppercase tracking-wider ${
                                  c.urgency === "critical"
                                    ? "bg-red-100 text-red-700 font-bold"
                                    : c.urgency === "priority"
                                    ? "bg-orange-100 text-orange-700"
                                    : "bg-slate-100 text-slate-600"
                                }`}
                              >
                                {c.urgency}
                              </span>
                            </div>

                            <div className="text-xs font-bold text-slate-800 pb-1 flex items-center gap-1.5">
                              <span>{c.patientId?.fullName || "Patient"}</span>
                              {c.patientId?.nationality && (
                                <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.2 rounded font-normal">
                                  {c.patientId.nationality}
                                </span>
                              )}
                            </div>

                            <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed pb-2">
                              {c.diagnosisSummary}
                            </p>

                            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400">
                              <span className="truncate max-w-[120px] text-slate-600 font-medium">
                                {c.partnerId?.name || "Direct Family"}
                              </span>

                              <div className="flex items-center gap-1">
                                {isStale && (
                                  <span
                                    title="Stale Case (>=7 days without stage move)"
                                    className="flex items-center gap-0.5 text-amber-600 font-bold"
                                  >
                                    <AlertTriangle className="w-3 h-3" />
                                  </span>
                                )}
                                <span className="flex items-center gap-0.5">
                                  <Clock className="w-3 h-3 text-slate-400" />
                                  {daysInStage}d
                                </span>
                              </div>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* Table View */
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs flex-1 flex flex-col">
          <div className="overflow-x-auto flex-1">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
                <tr>
                  <SortHeader
                    label="Case Code"
                    field="caseCode"
                    currentField={sortField}
                    currentDirection={sortDirection}
                    onSort={handleSort}
                    className="p-3"
                  />
                  <SortHeader
                    label="Patient"
                    field="patientId.fullName"
                    currentField={sortField}
                    currentDirection={sortDirection}
                    onSort={handleSort}
                    className="p-3"
                  />
                  <SortHeader
                    label="Partner Facilitator"
                    field="partnerId.name"
                    currentField={sortField}
                    currentDirection={sortDirection}
                    onSort={handleSort}
                    className="p-3"
                  />
                  <SortHeader
                    label="Stage"
                    field="stage"
                    currentField={sortField}
                    currentDirection={sortDirection}
                    onSort={handleSort}
                    className="p-3"
                  />
                  <SortHeader
                    label="Urgency"
                    field="urgency"
                    currentField={sortField}
                    currentDirection={sortDirection}
                    onSort={handleSort}
                    className="p-3"
                  />
                  <SortHeader
                    label="Days in Stage"
                    field="stageChangedAt"
                    currentField={sortField}
                    currentDirection={sortDirection}
                    onSort={handleSort}
                    className="p-3"
                  />
                  <th className="p-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {paginatedCases.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="p-8 text-center text-slate-400">
                      No cases found matching the criteria.
                    </td>
                  </tr>
                ) : (
                  paginatedCases.map((c) => {
                    const daysInStage = Math.floor(
                      (Date.now() - new Date(c.stageChangedAt || c.createdAt).getTime()) /
                        (1000 * 60 * 60 * 24)
                    );
                    const isStale = daysInStage >= 7;

                    return (
                      <tr
                        key={c._id}
                        onClick={() => onSelectCase(c._id)}
                        className="hover:bg-slate-50 cursor-pointer transition"
                      >
                        <td className="p-3 font-mono font-bold text-[#007A6C]">
                          {c.caseCode}
                        </td>
                        <td className="p-3">
                          <div className="font-semibold text-slate-900">
                            {c.patientId?.fullName || "Patient"}
                          </div>
                          {c.patientId?.nationality && (
                            <div className="text-[10px] text-slate-400">
                              {c.patientId.nationality}
                            </div>
                          )}
                        </td>
                        <td className="p-3 text-slate-600">
                          {c.partnerId?.name || "Direct Family"}
                        </td>
                        <td className="p-3">
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                              STAGE_CONFIG[c.stage as CaseStage]?.badge || "bg-slate-100"
                            }`}
                          >
                            {STAGE_CONFIG[c.stage as CaseStage]?.label || c.stage}
                          </span>
                        </td>
                        <td className="p-3">
                          <span
                            className={`text-[10px] font-semibold px-1.5 py-0.5 rounded uppercase tracking-wider ${
                              c.urgency === "critical"
                                ? "bg-red-100 text-red-700 font-bold"
                                : c.urgency === "priority"
                                ? "bg-orange-100 text-orange-700"
                                : "bg-slate-100 text-slate-600"
                            }`}
                          >
                            {c.urgency}
                          </span>
                        </td>
                        <td className="p-3">
                          <div className="flex items-center gap-1 text-[11px] text-slate-600">
                            <Clock className="w-3 h-3 text-slate-400" />
                            <span>{daysInStage} days</span>
                            {isStale && (
                              <span
                                title="Stale Case (>=7 days without stage move)"
                                className="text-amber-600 font-bold ml-1"
                              >
                                ⚠️
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="p-3 text-right">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onSelectCase(c._id);
                            }}
                            className="text-[#007A6C] hover:text-[#005F54] font-bold inline-flex items-center gap-1 text-[11px]"
                          >
                            <span>Open</span>
                            <ArrowRight className="w-3 h-3" />
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Table Pagination */}
          <TablePagination
            currentPage={safePage}
            totalItems={filteredCases.length}
            pageSize={pageSize}
            onPageChange={setCurrentPage}
            onPageSizeChange={setPageSize}
            pageSizeOptions={[10, 25, 50, 100]}
            itemLabel="pipeline cases"
          />
        </div>
      )}
    </div>
  );
};
