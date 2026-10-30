import React, { useState, useEffect, useMemo } from "react";
import {
  TablePagination,
  SortHeader,
  sortItems,
  getNextSortDirection,
  SortDirection,
  DateRangePreset,
  filterByDatePreset,
  ViewToggle,
  ViewMode,
} from "./TablePagination";
import { ChangelogView } from "./ChangelogView.js";
import {
  History,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  User,
  ShieldAlert,
  ArrowRight,
  Eye,
  X,
  FileText,
  RotateCcw,
  Sparkles,
  Tag,
} from "lucide-react";

interface ActivityItem {
  _id: string;
  actorId?: {
    _id: string;
    name: string;
    email: string;
  };
  actorRole: string;
  ipAddress?: string;
  module: "page" | "settings" | "media" | "enquiry" | "redirect" | "user";
  action: "create" | "update" | "publish" | "unpublish" | "delete" | "duplicate" | "restore";
  targetEntityId?: string;
  changes?: Record<string, [any, any]>;
  createdAt: string;
}

interface ActivityLogViewProps {
  initialTab?: "activity" | "changelog";
  initialCreateModal?: boolean;
}

export const ActivityLogView: React.FC<ActivityLogViewProps> = ({
  initialTab = "activity",
  initialCreateModal = false,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<"activity" | "changelog">(initialTab);

  useEffect(() => {
    if (initialTab) {
      setActiveSubTab(initialTab);
    }
  }, [initialTab]);

  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [moduleFilter, setModuleFilter] = useState("all");
  const [actionFilter, setActionFilter] = useState("all");
  const [datePreset, setDatePreset] = useState<DateRangePreset>("all");
  const [selectedActivity, setSelectedActivity] = useState<ActivityItem | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>("table");

  // Sorting State
  const [sortField, setSortField] = useState<string | null>("createdAt");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");

  const handleSort = (field: string) => {
    const next = getNextSortDirection(sortField, field, sortDirection);
    setSortField(next.field);
    setSortDirection(next.direction);
  };

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  useEffect(() => {
    fetchActivity();
  }, [moduleFilter, actionFilter]);

  // Reset to page 1 on filter or sort changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, moduleFilter, actionFilter, datePreset, sortField, sortDirection]);

  // Multi-dimensional filtering and sorting pipeline
  const filteredActivities = useMemo(() => {
    let result = activities;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (a) =>
          a.actorId?.name?.toLowerCase().includes(q) ||
          a.actorId?.email?.toLowerCase().includes(q) ||
          a.actorRole?.toLowerCase().includes(q) ||
          a.module?.toLowerCase().includes(q) ||
          a.action?.toLowerCase().includes(q) ||
          a.ipAddress?.toLowerCase().includes(q)
      );
    }

    if (datePreset !== "all") {
      result = filterByDatePreset(result, "createdAt", datePreset);
    }

    return sortItems(result, sortField, sortDirection);
  }, [activities, searchQuery, datePreset, sortField, sortDirection]);

  const totalPages = Math.max(1, Math.ceil(filteredActivities.length / pageSize));
  const safeCurrentPage = Math.min(Math.max(1, currentPage), totalPages);

  const paginatedActivities = useMemo(() => {
    const start = (safeCurrentPage - 1) * pageSize;
    return filteredActivities.slice(start, start + pageSize);
  }, [filteredActivities, safeCurrentPage, pageSize]);

  const activeFiltersCount =
    (searchQuery ? 1 : 0) +
    (moduleFilter !== "all" ? 1 : 0) +
    (actionFilter !== "all" ? 1 : 0) +
    (datePreset !== "all" ? 1 : 0) +
    (sortField !== "createdAt" || sortDirection !== "desc" ? 1 : 0);

  const clearAllFilters = () => {
    setSearchQuery("");
    setModuleFilter("all");
    setActionFilter("all");
    setDatePreset("all");
    setSortField("createdAt");
    setSortDirection("desc");
  };

  const fetchActivity = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (moduleFilter !== "all") params.set("module", moduleFilter);
      if (actionFilter !== "all") params.set("action", actionFilter);

      const res = await fetch(`/api/v1/admin/activity?${params.toString()}`);
      if (res.ok) {
        const json = await res.json();
        setActivities(json.data || []);
      }
    } catch (err) {
      console.error("Failed to fetch activity log", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Sub-Tab Navigation Switcher */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-3 gap-3">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              setActiveSubTab("activity");
              if (typeof window !== "undefined") {
                window.history.pushState(null, "", "/admin/activity");
              }
            }}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-2xs ${
              activeSubTab === "activity"
                ? "bg-[#007A6C] text-white shadow-sm"
                : "bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-50 border border-slate-200"
            }`}
          >
            <History className="w-4 h-4" />
            <span>System Audit Trail</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveSubTab("changelog");
              if (typeof window !== "undefined") {
                window.history.pushState(null, "", "/admin/changelog");
              }
            }}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-2xs ${
              activeSubTab === "changelog"
                ? "bg-[#007A6C] text-white shadow-sm"
                : "bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-50 border border-slate-200"
            }`}
          >
            <Tag className="w-4 h-4" />
            <span>Platform Changelog & Releases</span>
          </button>
        </div>

        {activeSubTab === "changelog" && (
          <a
            href="/changelog"
            target="_blank"
            rel="noreferrer"
            className="hidden sm:inline-flex items-center gap-1.5 text-xs text-[#007A6C] hover:text-[#005F54] font-semibold hover:underline"
          >
            <span>View Public /changelog</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </a>
        )}
      </div>

      {activeSubTab === "changelog" ? (
        <ChangelogView initialCreateModal={initialCreateModal} />
      ) : (
        <>
          {/* 1. Header Banner */}
          <div className="bg-gradient-to-r from-[#061E1B] via-teal-950 to-[#061E1B] rounded-2xl p-6 text-white shadow-md border border-[#00C7BE]/30 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#007A6C]/50 text-[#00C7BE] border border-[#00C7BE]/30">
            <History className="w-3.5 h-3.5 text-[#00C7BE]" />
            <span>DPDP & Governance Compliance</span>
          </div>
          <h1 className="text-xl font-black tracking-tight">System Audit & Activity Log</h1>
          <p className="text-xs text-teal-100/80 max-w-2xl leading-relaxed">
            Immutable administrative event stream. Tracks content publications, setting overrides, user invitations, and lead conversions with before/after state diffs.
          </p>
        </div>
      </div>

      {/* 2. Filter & Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-3">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
          {/* Search Box */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by actor, role, module, action, IP..."
              className="w-full text-xs pl-9 pr-8 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-[#007A6C] focus:outline-none"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                title="Clear search"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Filter Dropdowns */}
          <div className="flex flex-wrap items-center gap-2.5">
            <div className="flex items-center gap-1.5">
              <span className="text-xs text-slate-500 font-semibold whitespace-nowrap">Module:</span>
              <select
                value={moduleFilter}
                onChange={(e) => setModuleFilter(e.target.value)}
                className="text-xs px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none font-medium text-slate-700"
              >
                <option value="all">All Modules</option>
                <option value="page">Content & Pages</option>
                <option value="media">Media Library</option>
                <option value="enquiry">Enquiries & Leads</option>
                <option value="redirect">SEO & Redirects</option>
                <option value="settings">Site Settings</option>
                <option value="user">Users & RBAC</option>
              </select>
            </div>

            <div className="flex items-center gap-1.5">
              <span className="text-xs text-slate-500 font-semibold whitespace-nowrap">Action:</span>
              <select
                value={actionFilter}
                onChange={(e) => setActionFilter(e.target.value)}
                className="text-xs px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none font-medium text-slate-700"
              >
                <option value="all">All Actions</option>
                <option value="create">Create</option>
                <option value="update">Update</option>
                <option value="publish">Publish</option>
                <option value="delete">Delete</option>
              </select>
            </div>

            <div className="flex items-center gap-1.5">
              <span className="text-xs text-slate-500 font-semibold whitespace-nowrap">Date:</span>
              <select
                value={datePreset}
                onChange={(e) => setDatePreset(e.target.value as DateRangePreset)}
                className="text-xs px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none font-medium text-slate-700"
              >
                <option value="all">All Time</option>
                <option value="today">Today</option>
                <option value="last_7_days">Last 7 Days</option>
                <option value="last_30_days">Last 30 Days</option>
                <option value="this_year">This Year</option>
              </select>
            </div>

            {activeFiltersCount > 0 && (
              <button
                type="button"
                onClick={clearAllFilters}
                className="px-2.5 py-1.5 text-xs font-bold text-rose-600 hover:bg-rose-50 border border-rose-200 rounded-xl transition flex items-center gap-1"
                title="Reset all filters and sorting"
              >
                <X className="w-3.5 h-3.5" />
                <span>Reset ({activeFiltersCount})</span>
              </button>
            )}

            <ViewToggle mode={viewMode} onChange={setViewMode} />
          </div>
        </div>

        <div className="text-[11px] text-slate-400 font-medium flex items-center justify-between pt-1 border-t border-slate-100">
          <span>Showing {filteredActivities.length} of {activities.length} immutable events</span>
          {sortField && (
            <span className="text-slate-500">
              Sorted by: <strong className="text-slate-700">{sortField}</strong> ({sortDirection})
            </span>
          )}
        </div>
      </div>

      {/* 3. Main Stream Table / Grid & Diff Drawer */}
      <div className="flex flex-col lg:flex-row gap-6">
        <div className={`flex-1 ${selectedActivity ? "lg:w-2/3" : "w-full"}`}>
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            {viewMode === "table" ? (
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
                  <tr>
                    <SortHeader
                      field="createdAt"
                      label="Timestamp"
                      currentSortField={sortField}
                      currentSortDirection={sortDirection}
                      onSort={handleSort}
                    />
                    <SortHeader
                      field="actorId.name"
                      label="Actor"
                      currentSortField={sortField}
                      currentSortDirection={sortDirection}
                      onSort={handleSort}
                    />
                    <SortHeader
                      field="module"
                      label="Module"
                      currentSortField={sortField}
                      currentSortDirection={sortDirection}
                      onSort={handleSort}
                    />
                    <SortHeader
                      field="action"
                      label="Action"
                      currentSortField={sortField}
                      currentSortDirection={sortDirection}
                      onSort={handleSort}
                    />
                    <SortHeader
                      field="ipAddress"
                      label="IP Address"
                      currentSortField={sortField}
                      currentSortDirection={sortDirection}
                      onSort={handleSort}
                    />
                    <th className="py-3 px-4 text-right">Details</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {loading ? (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-slate-400 font-semibold">
                        Loading audit events...
                      </td>
                    </tr>
                  ) : activities.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-slate-400 font-semibold">
                        No audit events recorded for current filters.
                      </td>
                    </tr>
                  ) : (
                    paginatedActivities.map((act) => {
                      const isSelected = selectedActivity?._id === act._id;
                      return (
                        <tr
                          key={act._id}
                          onClick={() => setSelectedActivity(act)}
                          className={`hover:bg-slate-50 cursor-pointer transition ${
                            isSelected ? "bg-[#E6F8F6]/40" : ""
                          }`}
                        >
                          <td className="py-3.5 px-4 font-mono text-[11px] text-slate-500">
                            {new Date(act.createdAt).toLocaleString()}
                          </td>
                          <td className="py-3.5 px-4">
                            <div className="font-bold text-slate-900">
                              {act.actorId?.name || act.actorId?.email || "System Operator"}
                            </div>
                            <div className="text-[10px] text-slate-400">{act.actorRole || "admin"}</div>
                          </td>
                          <td className="py-3.5 px-4 font-semibold text-slate-700 uppercase text-[10px]">
                            {act.module}
                          </td>
                          <td className="py-3.5 px-4">
                            <span
                              className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                                act.action === "publish"
                                  ? "bg-emerald-100 text-emerald-800"
                                  : act.action === "create"
                                  ? "bg-blue-100 text-blue-800"
                                  : act.action === "delete"
                                  ? "bg-rose-100 text-rose-800"
                                  : "bg-slate-100 text-slate-700"
                              }`}
                            >
                              {act.action}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 font-mono text-[10px] text-slate-400">
                            {act.ipAddress || "127.0.0.1"}
                          </td>
                          <td className="py-3.5 px-4 text-right">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedActivity(act);
                              }}
                              className="px-2.5 py-1 text-xs font-bold text-[#007A6C] hover:bg-[#E6F8F6] border border-[#007A6C]/30 rounded-lg transition"
                            >
                              Inspect Diff
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            ) : (
              <div className="p-4 bg-slate-50/50">
                {loading ? (
                  <div className="py-12 text-center text-slate-400 font-semibold text-xs">
                    Loading audit events...
                  </div>
                ) : activities.length === 0 ? (
                  <div className="py-12 text-center text-slate-400 font-semibold text-xs">
                    No audit events recorded for current filters.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3.5">
                    {paginatedActivities.map((act) => {
                      const isSelected = selectedActivity?._id === act._id;
                      const changesCount = act.changes ? Object.keys(act.changes).length : 0;
                      return (
                        <div
                          key={act._id}
                          onClick={() => setSelectedActivity(act)}
                          className={`p-4 rounded-xl border bg-white shadow-2xs hover:shadow-xs hover:border-[#007A6C] transition cursor-pointer flex flex-col justify-between space-y-3 ${
                            isSelected ? "ring-2 ring-[#007A6C] border-[#007A6C] bg-[#E6F8F6]/20" : "border-slate-200"
                          }`}
                        >
                          <div className="space-y-2">
                            <div className="flex items-center justify-between gap-2">
                              <span
                                className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                                  act.action === "publish"
                                    ? "bg-emerald-100 text-emerald-800"
                                    : act.action === "create"
                                    ? "bg-blue-100 text-blue-800"
                                    : act.action === "delete"
                                    ? "bg-rose-100 text-rose-800"
                                    : "bg-slate-100 text-slate-700"
                                }`}
                              >
                                {act.action}
                              </span>
                              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider bg-slate-100 px-2 py-0.5 rounded-full">
                                {act.module}
                              </span>
                            </div>

                            <div>
                              <h4 className="font-bold text-xs text-slate-900 truncate">
                                {act.actorId?.name || act.actorId?.email || "System Operator"}
                              </h4>
                              <p className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">
                                {act.actorRole || "admin"}
                              </p>
                            </div>

                            <div className="text-[11px] text-slate-500 space-y-1 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                              <div className="flex items-center justify-between text-[10px]">
                                <span className="text-slate-400">IP Address:</span>
                                <span className="font-mono text-slate-700">{act.ipAddress || "127.0.0.1"}</span>
                              </div>
                              {changesCount > 0 && (
                                <div className="flex items-center justify-between text-[10px]">
                                  <span className="text-slate-400">Modifications:</span>
                                  <span className="font-bold text-[#007A6C]">{changesCount} field(s)</span>
                                </div>
                              )}
                            </div>
                          </div>

                          <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
                            <span className="font-mono text-[10px] text-slate-400">
                              {new Date(act.createdAt).toLocaleString([], {
                                month: "short",
                                day: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </span>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedActivity(act);
                              }}
                              className="px-2 py-1 text-[11px] font-bold text-[#007A6C] hover:bg-[#E6F8F6] border border-[#007A6C]/30 rounded-lg transition"
                            >
                              Inspect Diff
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* Pagination Controls */}
            <TablePagination
              currentPage={safeCurrentPage}
              totalItems={filteredActivities.length}
              pageSize={pageSize}
              onPageChange={setCurrentPage}
              onPageSizeChange={setPageSize}
              pageSizeOptions={[10, 25, 50, 100]}
              itemLabel="audit events"
            />
          </div>
        </div>

        {/* Diff Drawer */}
        {selectedActivity && (
          <div className="lg:w-96 bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4 shrink-0 font-sans">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <span className="font-bold text-xs text-slate-900 uppercase tracking-wider">
                Event Change Diff
              </span>
              <button
                onClick={() => setSelectedActivity(null)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 space-y-1.5 text-xs text-slate-600">
              <div className="flex justify-between">
                <span className="text-slate-400">Actor:</span>
                <span className="font-semibold text-slate-900">
                  {selectedActivity.actorId?.name || selectedActivity.actorId?.email || "System"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Role:</span>
                <span className="font-bold uppercase text-[10px] text-[#007A6C]">
                  {selectedActivity.actorRole}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Module:</span>
                <span className="font-semibold capitalize text-slate-900">
                  {selectedActivity.module}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Target Entity ID:</span>
                <span className="font-mono text-[10px] text-slate-700">
                  {selectedActivity.targetEntityId || "N/A"}
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-700">
                Modified State Payload
              </label>
              {selectedActivity.changes && Object.keys(selectedActivity.changes).length > 0 ? (
                <div className="space-y-2">
                  {Object.entries(selectedActivity.changes).map(([key, val]) => (
                    <div key={key} className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1">
                      <div className="font-bold text-slate-800 font-mono text-[11px]">{key}</div>
                      <div className="grid grid-cols-2 gap-2 text-[10px]">
                        <div className="p-1.5 bg-rose-50 text-rose-800 rounded border border-rose-200/60 truncate">
                          <span className="font-bold block">Previous:</span>
                          <span>{String(val[0] ?? "null")}</span>
                        </div>
                        <div className="p-1.5 bg-emerald-50 text-emerald-800 rounded border border-emerald-200/60 truncate">
                          <span className="font-bold block">Updated:</span>
                          <span>{String(val[1] ?? "null")}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-center text-xs text-slate-400">
                  No property-level field changes captured for this action.
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      </>
      )}
    </div>
  );
};
