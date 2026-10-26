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
import {
  Inbox,
  Search,
  Download,
  Filter,
  CheckCircle2,
  AlertCircle,
  Briefcase,
  User,
  Mail,
  Phone,
  Globe,
  Clock,
  ExternalLink,
  ChevronRight,
  X,
  FileSpreadsheet,
  Check,
  Send,
  ShieldCheck,
  Trash2,
  Archive,
} from "lucide-react";
import { useToast, DisabledGuideButton } from "@akeezo/ui";

interface EnquiryItem {
  _id: string;
  receiptId: string;
  requesterName: string;
  email?: string;
  phone?: string;
  country?: string;
  serviceType: string;
  message?: string;
  sourcePath?: string;
  status: "received" | "triage" | "contacted" | "options_prepared" | "converted" | "closed" | "spam" | "archived";
  notes?: string;
  assignedCoordinatorId?: any;
  createdAt: string;
}

export const EnquiriesView: React.FC = () => {
  const toast = useToast();
  const [enquiries, setEnquiries] = useState<EnquiryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<ViewMode>("table");
  // Filter States
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [serviceFilter, setServiceFilter] = useState("all");
  const [datePreset, setDatePreset] = useState<DateRangePreset>("all");

  // Sorting State
  const [sortField, setSortField] = useState<string | null>("createdAt");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");

  const handleSort = (field: string) => {
    const next = getNextSortDirection(sortField, field, sortDirection);
    setSortField(next.field);
    setSortDirection(next.direction);
  };

  const [selectedEnquiry, setSelectedEnquiry] = useState<EnquiryItem | null>(null);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Bulk Actions
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [bulkStatus, setBulkStatus] = useState("");

  // Edit Drawer State
  const [currentStatus, setCurrentStatus] = useState("");
  const [notes, setNotes] = useState("");
  const [savingDrawer, setSavingDrawer] = useState(false);
  const [convertingId, setConvertingId] = useState<string | null>(null);
  const [convertSuccess, setConvertSuccess] = useState<{ caseCode: string; receiptId: string } | null>(null);

  useEffect(() => {
    fetchEnquiries();
  }, [statusFilter]);

  // Reset to page 1 on filter, search, or sort change
  useEffect(() => {
    setCurrentPage(1);
  }, [search, statusFilter, serviceFilter, datePreset, sortField, sortDirection]);

  // Reset to page 1 on filter or search query change
  useEffect(() => {
    setCurrentPage(1);
  }, [search, statusFilter]);

  const fetchEnquiries = async () => {
    try {
      setLoading(true);
      const url =
        statusFilter === "all"
          ? "/api/v1/admin/enquiries"
          : `/api/v1/admin/enquiries?status=${statusFilter}`;
      const res = await fetch(url);
      if (res.ok) {
        const json = await res.json();
        setEnquiries(json.data || []);
      }
    } catch (err) {
      console.error("Failed to fetch enquiries", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectEnquiry = (enquiry: EnquiryItem) => {
    setSelectedEnquiry(enquiry);
    setCurrentStatus(enquiry.status);
    setNotes(enquiry.notes || "");
    setConvertSuccess(null);
  };

  const handleSaveDrawerDetails = async () => {
    if (!selectedEnquiry) return;
    setSavingDrawer(true);
    try {
      const res = await fetch(`/api/v1/admin/enquiries/${selectedEnquiry._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: currentStatus, notes }),
      });
      if (res.ok) {
        toast.success("Enquiry triage status and notes updated.", { title: "Enquiry Saved" });
        setEnquiries((prev) =>
          prev.map((e) =>
            e._id === selectedEnquiry._id ? { ...e, status: currentStatus as any, notes } : e
          )
        );
        setSelectedEnquiry({ ...selectedEnquiry, status: currentStatus as any, notes });
      } else {
        const errJson = await res.json().catch(() => ({}));
        toast.error(errJson.error?.message || "Failed to update enquiry", { title: "Save Failed" });
      }
    } catch (err: any) {
      toast.error(err.message, { title: "Network Error" });
    } finally {
      setSavingDrawer(false);
    }
  };

  const handleConvertToCase = async (enquiry: EnquiryItem) => {
    setConvertingId(enquiry._id);
    try {
      const res = await fetch(`/api/v1/admin/enquiries/${enquiry._id}/convert-to-case`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      const json = await res.json();
      if (!res.ok) {
        toast.error(json.error?.message || "Failed to convert lead to case", { title: "Conversion Blocked" });
        return;
      }

      toast.instruction(
        `Lead successfully converted into Case CMS (#${json.data?.caseCode}).`,
        {
          title: "Case Created in Operations",
          steps: [
            "Patient record registered in Case ERP",
            "Assigned to clinical intake pipeline",
            "RFQ and quote requests enabled",
          ],
        }
      );

      setConvertSuccess({ caseCode: json.data?.caseCode, receiptId: enquiry.receiptId });
      setEnquiries((prev) =>
        prev.map((e) => (e._id === enquiry._id ? { ...e, status: "converted" } : e))
      );
      if (selectedEnquiry?._id === enquiry._id) {
        setSelectedEnquiry({ ...selectedEnquiry, status: "converted" });
        setCurrentStatus("converted");
      }
    } catch (err: any) {
      toast.error(err.message, { title: "Conversion Error" });
    } finally {
      setConvertingId(null);
    }
  };

  const handleBulkUpdate = async () => {
    if (selectedIds.length === 0 || !bulkStatus) return;
    try {
      const res = await fetch("/api/v1/admin/enquiries/bulk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: selectedIds, status: bulkStatus }),
      });
      if (res.ok) {
        toast.success(`Updated status of ${selectedIds.length} enquiries to "${bulkStatus}"`, {
          title: "Bulk Action Completed",
        });
        setEnquiries((prev) =>
          prev.map((e) => (selectedIds.includes(e._id) ? { ...e, status: bulkStatus as any } : e))
        );
        setSelectedIds([]);
        setBulkStatus("");
      } else {
        const errJson = await res.json().catch(() => ({}));
        toast.error(errJson.error?.message || "Bulk update failed", { title: "Bulk Action Failed" });
      }
    } catch (err: any) {
      toast.error(err.message, { title: "Network Error" });
    }
  };

  const handleExportCsv = () => {
    const url =
      statusFilter === "all"
        ? "/api/v1/admin/enquiries/export/csv"
        : `/api/v1/admin/enquiries/export/csv?status=${statusFilter}`;
    window.open(url, "_blank");
  };

  // Multi-dimensional filtering and sorting pipeline
  const filteredEnquiries = useMemo(() => {
    let result = enquiries;

    // 1. Text search
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (e) =>
          e.requesterName?.toLowerCase().includes(q) ||
          e.email?.toLowerCase().includes(q) ||
          e.phone?.toLowerCase().includes(q) ||
          e.receiptId?.toLowerCase().includes(q) ||
          e.message?.toLowerCase().includes(q)
      );
    }

    // 2. Status filter
    if (statusFilter !== "all") {
      result = result.filter((e) => e.status === statusFilter);
    }

    // 3. Service type filter
    if (serviceFilter !== "all") {
      result = result.filter((e) => e.serviceType === serviceFilter);
    }

    // 4. Date range filter
    if (datePreset !== "all") {
      result = filterByDatePreset(result, "createdAt", datePreset);
    }

    // 5. Column sort
    return sortItems(result, sortField, sortDirection);
  }, [enquiries, search, statusFilter, serviceFilter, datePreset, sortField, sortDirection]);

  const activeFiltersCount =
    (search ? 1 : 0) +
    (statusFilter !== "all" ? 1 : 0) +
    (serviceFilter !== "all" ? 1 : 0) +
    (datePreset !== "all" ? 1 : 0) +
    (sortField !== "createdAt" || sortDirection !== "desc" ? 1 : 0);

  const clearAllFilters = () => {
    setSearch("");
    setStatusFilter("all");
    setServiceFilter("all");
    setDatePreset("all");
    setSortField("createdAt");
    setSortDirection("desc");
  };

  const totalPages = Math.max(1, Math.ceil(filteredEnquiries.length / pageSize));
  const safeCurrentPage = Math.min(Math.max(1, currentPage), totalPages);

  const paginatedEnquiries = useMemo(() => {
    const start = (safeCurrentPage - 1) * pageSize;
    return filteredEnquiries.slice(start, start + pageSize);
  }, [filteredEnquiries, safeCurrentPage, pageSize]);

  return (
    <div className="space-y-6 font-sans">
      {/* 1. Header Banner */}
      <div className="bg-gradient-to-r from-[#061E1B] via-teal-950 to-[#061E1B] rounded-2xl p-6 text-white shadow-md border border-[#00C7BE]/30 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#FF6B00]/30 text-[#FF6B00] border border-[#FF6B00]/40">
            <Inbox className="w-3.5 h-3.5 text-[#FF6B00]" />
            <span>Website Lead Collector & Inquiries</span>
          </div>
          <h1 className="text-xl font-black tracking-tight">Public Website Contact Form Enquiries</h1>
          <p className="text-xs text-teal-100/80 max-w-2xl leading-relaxed">
            Inbound patient treatment requests submitted from public website forms. Triage leads, assign coordinators, and convert directly into active ERP clinical journeys with 1 click.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={handleExportCsv}
            className="flex items-center gap-1.5 bg-white/10 hover:bg-white/20 active:scale-98 text-white font-bold text-xs px-3.5 py-2.5 rounded-xl border border-white/20 transition"
            title="Download formula-safe CSV export"
          >
            <FileSpreadsheet className="w-4 h-4 text-[#00C7BE]" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* 2. Filters, Search & Bulk Actions Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-3">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
          {/* Search Box */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, email, phone, receipt #..."
              className="w-full text-xs pl-9 pr-8 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-[#007A6C] focus:outline-none"
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                title="Clear search"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Filter Dropdowns */}
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Status Filter */}
            <div className="flex items-center gap-1.5">
              <label htmlFor="enqStatusFilter" className="text-xs text-slate-500 font-semibold whitespace-nowrap">
                Status:
              </label>
              <select
                id="enqStatusFilter"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="text-xs px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none font-medium text-slate-700"
              >
                <option value="all">All Statuses</option>
                <option value="received">New / Received</option>
                <option value="triage">In Triage</option>
                <option value="contacted">Contacted</option>
                <option value="converted">Converted to Case</option>
                <option value="spam">Spam</option>
                <option value="archived">Archived</option>
              </select>
            </div>

            {/* Service Type Filter */}
            <div className="flex items-center gap-1.5">
              <label htmlFor="enqServiceFilter" className="text-xs text-slate-500 font-semibold whitespace-nowrap">
                Service:
              </label>
              <select
                id="enqServiceFilter"
                value={serviceFilter}
                onChange={(e) => setServiceFilter(e.target.value)}
                className="text-xs px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none font-medium text-slate-700"
              >
                <option value="all">All Services</option>
                <option value="medical_treatment">Medical Treatment</option>
                <option value="cost_estimate">Cost Estimate</option>
                <option value="second_opinion">Second Opinion</option>
                <option value="teleconsultation">Teleconsultation</option>
              </select>
            </div>

            {/* Date Preset Filter */}
            <div className="flex items-center gap-1.5">
              <label htmlFor="enqDateFilter" className="text-xs text-slate-500 font-semibold whitespace-nowrap">
                Date:
              </label>
              <select
                id="enqDateFilter"
                value={datePreset}
                onChange={(e) => setDatePreset(e.target.value as DateRangePreset)}
                className="text-xs px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none font-medium text-slate-700"
              >
                <option value="all">All Time</option>
                <option value="today">Today</option>
                <option value="last_7_days">Last 7 Days</option>
                <option value="last_30_days">Last 30 Days</option>
                <option value="this_year">This Year</option>
              </select>
            </div>

            {/* Clear All Filters Button */}
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

            {/* Layout Toggle */}
            <ViewToggle
              mode={viewMode}
              onChange={setViewMode}
            />
          </div>
        </div>

        {/* Bulk Action Controls Bar (when items selected) */}
        {selectedIds.length > 0 && (
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 bg-[#E6F8F6] px-3 py-1.5 rounded-xl border border-[#00C7BE]/40">
              <span className="text-xs font-bold text-[#007A6C]">
                {selectedIds.length} enquiries selected across view
              </span>
              <button
                type="button"
                onClick={() => setSelectedIds([])}
                className="text-[11px] text-slate-500 hover:text-slate-800 underline ml-2"
              >
                Deselect all
              </button>
            </div>

            <div className="flex items-center gap-2">
              <select
                value={bulkStatus}
                onChange={(e) => setBulkStatus(e.target.value)}
                className="text-xs px-2.5 py-1.5 bg-white border border-slate-200 rounded-xl focus:outline-none font-semibold text-slate-700"
              >
                <option value="">Bulk Status Action...</option>
                <option value="triage">Mark Triage</option>
                <option value="contacted">Mark Contacted</option>
                <option value="spam">Mark Spam</option>
                <option value="archived">Archive</option>
              </select>
              <button
                onClick={handleBulkUpdate}
                disabled={!bulkStatus}
                className="px-3 py-1.5 text-xs font-bold text-white bg-[#007A6C] hover:bg-[#005F54] rounded-xl transition disabled:opacity-50"
              >
                Apply to {selectedIds.length}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Main Table & Details Drawer Split */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Enquiries Table */}
        <div className={`flex-1 ${selectedEnquiry ? "lg:w-2/3" : "w-full"}`}>
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            {viewMode === "table" ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
                    <tr>
                      <th className="py-3 px-4 w-8">
                        <input
                          type="checkbox"
                          checked={
                            paginatedEnquiries.length > 0 &&
                            paginatedEnquiries.every((enq) => selectedIds.includes(enq._id))
                          }
                          onChange={(e) => {
                            if (e.target.checked) {
                              const pageIds = paginatedEnquiries.map((enq) => enq._id);
                              setSelectedIds(Array.from(new Set([...selectedIds, ...pageIds])));
                            } else {
                              const pageIds = new Set(paginatedEnquiries.map((enq) => enq._id));
                              setSelectedIds(selectedIds.filter((id) => !pageIds.has(id)));
                            }
                          }}
                          className="rounded border-slate-300 text-[#007A6C] focus:ring-[#00C7BE]"
                        />
                      </th>
                      <SortHeader
                        field="requesterName"
                        label="Receipt & Requester"
                        currentSortField={sortField}
                        currentSortDirection={sortDirection}
                        onSort={handleSort}
                      />
                      <SortHeader
                        field="serviceType"
                        label="Service Required"
                        currentSortField={sortField}
                        currentSortDirection={sortDirection}
                        onSort={handleSort}
                      />
                      <SortHeader
                        field="status"
                        label="Status"
                        currentSortField={sortField}
                        currentSortDirection={sortDirection}
                        onSort={handleSort}
                      />
                      <SortHeader
                        field="createdAt"
                        label="Submitted"
                        currentSortField={sortField}
                        currentSortDirection={sortDirection}
                        onSort={handleSort}
                      />
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {loading ? (
                      <tr>
                        <td colSpan={6} className="py-8 text-center text-slate-400 font-semibold">
                          Loading website enquiries...
                        </td>
                      </tr>
                    ) : filteredEnquiries.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="py-8 text-center text-slate-400 font-semibold">
                          No customer enquiries found matching current filters.
                        </td>
                      </tr>
                    ) : (
                      paginatedEnquiries.map((enq) => {
                        const isSelected = selectedEnquiry?._id === enq._id;
                        const isChecked = selectedIds.includes(enq._id);
                        return (
                          <tr
                            key={enq._id}
                            onClick={() => handleSelectEnquiry(enq)}
                            className={`hover:bg-slate-50 cursor-pointer transition ${
                              isSelected ? "bg-[#E6F8F6]/40" : ""
                            }`}
                          >
                            <td className="py-3.5 px-4" onClick={(e) => e.stopPropagation()}>
                              <input
                                type="checkbox"
                                checked={isChecked}
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    setSelectedIds([...selectedIds, enq._id]);
                                  } else {
                                    setSelectedIds(selectedIds.filter((id) => id !== enq._id));
                                  }
                                }}
                                className="rounded border-slate-300 text-[#007A6C] focus:ring-[#00C7BE]"
                              />
                            </td>
                            <td className="py-3.5 px-4">
                              <div className="font-bold text-slate-900">{enq.requesterName}</div>
                              <div className="text-[11px] font-mono text-[#007A6C]">{enq.receiptId}</div>
                            </td>
                            <td className="py-3.5 px-4">
                              <span className="capitalize text-slate-700 font-medium">
                                {enq.serviceType?.replace(/_/g, " ")}
                              </span>
                            </td>
                            <td className="py-3.5 px-4">
                              <span
                                className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                                  enq.status === "received" || enq.status === "triage"
                                    ? "bg-[#FFF4EC] text-[#FF6B00]"
                                    : enq.status === "contacted"
                                    ? "bg-amber-100 text-amber-800"
                                    : enq.status === "converted"
                                    ? "bg-emerald-100 text-emerald-800"
                                    : "bg-slate-100 text-slate-600"
                                }`}
                              >
                                {enq.status}
                              </span>
                            </td>
                            <td className="py-3.5 px-4 text-slate-400 text-[11px]">
                              {new Date(enq.createdAt).toLocaleDateString()}
                            </td>
                            <td className="py-3.5 px-4 text-right">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleSelectEnquiry(enq);
                                }}
                                className="px-2.5 py-1 text-xs font-bold text-[#007A6C] hover:bg-[#E6F8F6] border border-[#007A6C]/30 rounded-lg transition"
                              >
                                Inspect
                              </button>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            ) : (
              /* Grid Card View */
              <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                {loading ? (
                  <div className="col-span-full py-8 text-center text-slate-400 font-semibold">
                    Loading website enquiries...
                  </div>
                ) : filteredEnquiries.length === 0 ? (
                  <div className="col-span-full py-8 text-center text-slate-400 font-semibold">
                    No customer enquiries found matching current filters.
                  </div>
                ) : (
                  paginatedEnquiries.map((enq) => {
                    const isSelected = selectedEnquiry?._id === enq._id;
                    const isChecked = selectedIds.includes(enq._id);
                    return (
                      <div
                        key={enq._id}
                        onClick={() => handleSelectEnquiry(enq)}
                        className={`p-4 bg-white rounded-xl border transition-all cursor-pointer flex flex-col justify-between space-y-3 ${
                          isSelected
                            ? "border-[#00C7BE] shadow-md bg-[#E6F8F6]/20"
                            : "border-slate-200 hover:border-[#00C7BE] hover:shadow-xs"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setSelectedIds([...selectedIds, enq._id]);
                                } else {
                                  setSelectedIds(selectedIds.filter((id) => id !== enq._id));
                                }
                              }}
                              className="rounded border-slate-300 text-[#007A6C] focus:ring-[#00C7BE]"
                            />
                            <span className="font-mono text-xs font-bold text-[#007A6C] bg-[#E6F8F6] px-2 py-0.5 rounded border border-[#00C7BE]/30">
                              {enq.receiptId}
                            </span>
                          </div>
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                              enq.status === "received" || enq.status === "triage"
                                ? "bg-[#FFF4EC] text-[#FF6B00]"
                                : enq.status === "contacted"
                                ? "bg-amber-100 text-amber-800"
                                : enq.status === "converted"
                                ? "bg-emerald-100 text-emerald-800"
                                : "bg-slate-100 text-slate-600"
                            }`}
                          >
                            {enq.status}
                          </span>
                        </div>

                        <div>
                          <h3 className="font-bold text-sm text-slate-900">{enq.requesterName}</h3>
                          <div className="text-xs text-slate-600 capitalize font-medium">
                            {enq.serviceType?.replace(/_/g, " ")}
                          </div>
                          {enq.message && (
                            <p className="text-[11px] text-slate-500 italic mt-1 line-clamp-2">
                              "{enq.message}"
                            </p>
                          )}
                        </div>

                        <div className="text-xs text-slate-500 border-t border-slate-100 pt-2 flex items-center justify-between">
                          <span className="text-[11px] text-slate-400">
                            {new Date(enq.createdAt).toLocaleDateString()}
                          </span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleSelectEnquiry(enq);
                            }}
                            className="px-2.5 py-1 text-xs font-bold text-[#007A6C] hover:bg-[#E6F8F6] border border-[#007A6C]/30 rounded-lg transition"
                          >
                            Inspect
                          </button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            )}

            {/* Pagination Controls */}
            <TablePagination
              currentPage={safeCurrentPage}
              totalItems={filteredEnquiries.length}
              pageSize={pageSize}
              onPageChange={setCurrentPage}
              onPageSizeChange={setPageSize}
              pageSizeOptions={[10, 25, 50, 100]}
              itemLabel="enquiries"
            />
          </div>
        </div>

        {/* Enquiry Detail Drawer */}
        {selectedEnquiry && (
          <div className="lg:w-96 bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4 shrink-0 font-sans">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <span className="font-bold text-xs text-slate-900 uppercase tracking-wider">
                Enquiry Details
              </span>
              <button
                onClick={() => setSelectedEnquiry(null)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Convert to Case Success Banner */}
            {convertSuccess && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs space-y-1">
                <div className="flex items-center gap-1.5 font-bold">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Converted to ERP Case #{convertSuccess.caseCode}</span>
                </div>
                <p className="text-[11px] text-emerald-700">
                  Lead transferred into Case Management System. Active stage: Intake & Quotation.
                </p>
                <a
                  href="/case-management/"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-[11px] font-bold text-[#007A6C] underline pt-1"
                >
                  <span>Open in Case Operations Portal</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            )}

            {/* Contact Details Card */}
            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100 space-y-2 text-xs">
              <div className="font-bold text-slate-900 text-sm">
                {selectedEnquiry.requesterName}
              </div>
              <div className="flex items-center gap-2 text-slate-600">
                <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <a href={`mailto:${selectedEnquiry.email}`} className="hover:underline truncate">
                  {selectedEnquiry.email || "No email provided"}
                </a>
              </div>
              <div className="flex items-center gap-2 text-slate-600">
                <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <a href={`tel:${selectedEnquiry.phone}`} className="hover:underline">
                  {selectedEnquiry.phone || "No phone provided"}
                </a>
              </div>
              <div className="flex items-center gap-2 text-slate-600">
                <Globe className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span>Source URL: {selectedEnquiry.sourcePath || "/"}</span>
              </div>
            </div>

            {/* Inquirer Message */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Submitted Message / Clinical Query
              </label>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-700 leading-relaxed max-h-36 overflow-y-auto">
                {selectedEnquiry.message || "No clinical query text included."}
              </div>
            </div>

            {/* Status Selector */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Triage Status</label>
              <select
                value={currentStatus}
                onChange={(e) => setCurrentStatus(e.target.value)}
                className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none font-semibold text-slate-800"
              >
                <option value="received">New / Received</option>
                <option value="triage">In Triage</option>
                <option value="contacted">Contacted Patient</option>
                <option value="options_prepared">Options Prepared</option>
                <option value="converted">Converted to Case</option>
                <option value="closed">Closed</option>
                <option value="spam">Spam / Junk</option>
                <option value="archived">Archived</option>
              </select>
            </div>

            {/* Private Internal Notes */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Private Internal Notes (Confidential)
              </label>
              <textarea
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Internal notes for medical coordination team..."
                className="w-full text-xs px-3 py-2 rounded-xl border border-slate-300 focus:border-[#007A6C] focus:outline-none"
              />
            </div>

            {/* Actions */}
            <div className="space-y-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={handleSaveDrawerDetails}
                disabled={savingDrawer}
                className="w-full py-2 text-xs font-bold text-white bg-[#007A6C] hover:bg-[#005F54] rounded-xl transition shadow-xs disabled:opacity-60"
              >
                {savingDrawer ? "Saving..." : "Save Status & Notes"}
              </button>

              <DisabledGuideButton
                type="button"
                disabled={selectedEnquiry.status === "converted" || convertingId === selectedEnquiry._id}
                reasonTitle="Lead Already Converted"
                reasonMessage="This patient inquiry has already been converted into an active case in Case Operations CMS. Duplicate creation is blocked to protect case integrity."
                requirements={[
                  {
                    label: "Enquiry in un-converted status",
                    fulfilled: selectedEnquiry.status !== "converted",
                    tip: "Lead has already been transitioned to Case CMS",
                  },
                  {
                    label: "Valid requester name",
                    fulfilled: Boolean(selectedEnquiry.requesterName?.trim()),
                    tip: "Patient identity required",
                  },
                ]}
                stepsToEnable={[
                  "Access the patient case in Case Operations CMS or click the case link above.",
                  "To make modifications, open the active case record in the pipeline.",
                ]}
                placement="top"
                onClick={() => handleConvertToCase(selectedEnquiry)}
                className={`w-full py-2 text-xs font-bold rounded-xl transition shadow-md flex items-center justify-center gap-1.5 ${
                  selectedEnquiry.status !== "converted" && convertingId !== selectedEnquiry._id
                    ? "text-white bg-[#FF6B00] hover:bg-[#FF6D1B]"
                    : "bg-slate-200 text-slate-500 cursor-not-allowed"
                }`}
              >
                <Briefcase className="w-3.5 h-3.5" />
                <span>
                  {convertingId === selectedEnquiry._id
                    ? "Converting to ERP Case..."
                    : selectedEnquiry.status === "converted"
                    ? "Already Converted to Case"
                    : "Convert to Active Case in CMS"}
                </span>
              </DisabledGuideButton>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
