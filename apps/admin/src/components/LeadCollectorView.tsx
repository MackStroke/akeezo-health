import React, { useState, useEffect, useMemo } from "react";
import {
  Inbox,
  Search,
  Check,
  ArrowRight,
  ExternalLink,
  Briefcase,
  User,
  Mail,
  Phone,
  Globe,
  CheckCircle2,
  Calendar,
  X,
} from "lucide-react";
import { useToast } from "@akeezo/ui";
import {
  TablePagination,
  SortHeader,
  sortItems,
  getNextSortDirection,
  SortDirection,
  ViewToggle,
  ViewMode,
} from "./TablePagination";

interface EnquiryItem {
  _id: string;
  receiptId: string;
  requesterName?: string;
  name?: string;
  email?: string;
  phone?: string;
  country?: string;
  serviceType: string;
  preferredHospital?: string;
  message?: string;
  sourcePath?: string;
  status: "received" | "triage" | "contacted" | "converted" | "closed";
  notes?: string;
  createdAt: string;
}

export const LeadCollectorView: React.FC = () => {
  const toast = useToast();
  const [enquiries, setEnquiries] = useState<EnquiryItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [search, setSearch] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedEnquiry, setSelectedEnquiry] = useState<EnquiryItem | null>(null);
  const [convertingId, setConvertingId] = useState<string | null>(null);
  const [conversionSuccess, setConversionSuccess] = useState<{ caseCode: string; receiptId: string } | null>(null);
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
    fetchEnquiries();
  }, []);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [search, statusFilter, sortField, sortDirection]);

  const fetchEnquiries = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/v1/admin/enquiries");
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

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/v1/admin/enquiries/${id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (res.ok) {
        toast.success(`Enquiry status changed to "${newStatus}"`, { title: "Status Updated" });
        setEnquiries((prev) =>
          prev.map((e) => (e._id === id ? { ...e, status: newStatus as any } : e))
        );
        if (selectedEnquiry?._id === id) {
          setSelectedEnquiry((prev) => (prev ? { ...prev, status: newStatus as any } : null));
        }
      } else {
        const errJson = await res.json().catch(() => ({}));
        toast.error(errJson.error?.message || "Failed to update enquiry", { title: "Update Failed" });
      }
    } catch (err: any) {
      toast.error(err.message, { title: "Network Error" });
    }
  };

  const handleConvertToCase = async (enquiry: EnquiryItem) => {
    try {
      setConvertingId(enquiry._id);
      const res = await fetch(`/api/v1/admin/enquiries/${enquiry._id}/convert-to-case`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      const json = await res.json();
      if (!res.ok) {
        toast.error(json.error?.message || "Failed to convert lead to case", { title: "Conversion Blocked" });
        return;
      }

      const caseCode = json.data?.caseCode;
      toast.instruction(`Enquiry converted into Case CMS (#${caseCode}).`, {
        title: "Lead Converted",
        steps: ["Case record registered", "Transferred to Intake Pipeline"],
      });

      setConversionSuccess({ caseCode, receiptId: enquiry.receiptId });
      setEnquiries((prev) =>
        prev.map((e) =>
          e._id === enquiry._id
            ? { ...e, status: "converted", notes: `${e.notes || ""} Converted to Case ${caseCode}` }
            : e
        )
      );

      if (selectedEnquiry?._id === enquiry._id) {
        setSelectedEnquiry((prev) =>
          prev
            ? { ...prev, status: "converted", notes: `${prev.notes || ""} Converted to Case ${caseCode}` }
            : null
        );
      }
    } catch (err: any) {
      toast.error(err.message, { title: "Conversion Error" });
    } finally {
      setConvertingId(null);
    }
  };

  const filtered = useMemo(() => {
    let result = enquiries.filter((e) => {
      const name = e.requesterName || e.name || "";
      const matchesSearch =
        !search ||
        name.toLowerCase().includes(search.toLowerCase()) ||
        e.receiptId.toLowerCase().includes(search.toLowerCase()) ||
        (e.email && e.email.toLowerCase().includes(search.toLowerCase())) ||
        (e.phone && e.phone.toLowerCase().includes(search.toLowerCase())) ||
        (e.country && e.country.toLowerCase().includes(search.toLowerCase())) ||
        (e.serviceType && e.serviceType.toLowerCase().includes(search.toLowerCase()));

      const matchesStatus = statusFilter === "all" || e.status === statusFilter;

      return matchesSearch && matchesStatus;
    });

    return sortItems(result, sortField, sortDirection);
  }, [enquiries, search, statusFilter, sortField, sortDirection]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const safeCurrentPage = Math.min(Math.max(1, currentPage), totalPages);

  const paginatedLeads = useMemo(() => {
    const start = (safeCurrentPage - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, safeCurrentPage, pageSize]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "received":
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#FFF4EC] text-[#B54700] border border-[#FFD8BF]">
            Received (New)
          </span>
        );
      case "triage":
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#E6F8F6] text-[#007A6C] border border-[#B2EBE4]">
            In Triage
          </span>
        );
      case "contacted":
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-teal-50 text-teal-800 border border-teal-200">
            Contacted
          </span>
        );
      case "converted":
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#E6F8F6] text-[#007A6C] border border-[#B2EBE4] flex items-center gap-1">
            <Check className="w-3 h-3 text-[#007A6C]" /> Converted to Case
          </span>
        );
      case "closed":
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-slate-100 text-slate-600 border border-slate-200">
            Closed
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-slate-100 text-slate-700">
            {status}
          </span>
        );
    }
  };

  const totalCount = enquiries.length;
  const newCount = enquiries.filter((e) => e.status === "received").length;
  const triageCount = enquiries.filter((e) => e.status === "triage").length;
  const convertedCount = enquiries.filter((e) => e.status === "converted").length;

  return (
    <div className="space-y-6 font-sans">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#061E1B] via-teal-950 to-[#061E1B] rounded-2xl p-6 text-white shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4 border border-[#00C7BE]/30 relative overflow-hidden">
        <div className="space-y-1 relative z-10">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#007A6C]/50 text-[#00C7BE] border border-[#00C7BE]/30">
            <Inbox className="w-3.5 h-3.5 text-[#00C7BE]" />
            <span>Central Lead Collector & Intake Engine</span>
          </div>
          <h1 className="text-xl font-black tracking-tight">Public Website Lead Collector</h1>
          <p className="text-xs text-teal-100/80 max-w-2xl leading-relaxed">
            Capturing, triaging, and processing all incoming leads from public web forms, cost calculators, and emergency hotlines, with 1-click routing into the Case Management System.
          </p>
        </div>

        <div className="flex items-center gap-3 relative z-10">
          <a
            href="/case-management/"
            className="inline-flex items-center gap-2 bg-[#007A6C] hover:bg-[#005F54] active:scale-98 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-xs transition border border-[#00C7BE]/30"
          >
            <Briefcase className="w-4 h-4 text-[#00C7BE]" />
            <span>Open Case Operations CMS</span>
            <ExternalLink className="w-3.5 h-3.5 opacity-80" />
          </a>
        </div>
      </div>

      {/* Conversion Success Notification */}
      {conversionSuccess && (
        <div className="p-4 bg-[#E6F8F6] border border-[#B2EBE4] rounded-2xl flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-[#007A6C] text-white flex items-center justify-center font-bold">
              ✓
            </div>
            <div>
              <h4 className="text-xs font-bold text-[#061E1B]">
                Lead {conversionSuccess.receiptId} successfully converted into Case {conversionSuccess.caseCode}!
              </h4>
              <p className="text-[11px] text-[#007A6C]">
                Patient record created and clinical case initialized in stage "new_referral".
              </p>
            </div>
          </div>
          <a
            href="/case-management/"
            className="text-xs font-bold text-white bg-[#FF6B00] hover:bg-[#FF6D1B] active:scale-98 px-3.5 py-1.5 rounded-xl transition flex items-center gap-1.5 shadow-xs"
          >
            <span>Open in Case Management System</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </a>
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Leads Collected</p>
          <p className="text-2xl font-black text-slate-900 mt-1">{totalCount}</p>
        </div>
        <div className="bg-[#FFF4EC] p-4 rounded-xl border border-[#FFD8BF] shadow-xs">
          <p className="text-[11px] font-bold text-[#B54700] uppercase tracking-wider">Pending Triage (New)</p>
          <p className="text-2xl font-black text-[#B54700] mt-1">{newCount}</p>
        </div>
        <div className="bg-[#E6F8F6] p-4 rounded-xl border border-[#B2EBE4] shadow-xs">
          <p className="text-[11px] font-bold text-[#007A6C] uppercase tracking-wider">In Active Triage</p>
          <p className="text-2xl font-black text-[#007A6C] mt-1">{triageCount}</p>
        </div>
        <div className="bg-[#E6F8F6] p-4 rounded-xl border border-[#B2EBE4] shadow-xs">
          <p className="text-[11px] font-bold text-[#007A6C] uppercase tracking-wider">Converted to Cases</p>
          <p className="text-2xl font-black text-[#007A6C] mt-1">{convertedCount}</p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-slate-200 shadow-xs">
        <div className="relative w-full lg:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by receipt ID, name, email, or phone..."
            className="w-full pl-9 pr-8 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-[#007A6C] focus:outline-none transition"
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

        <div className="flex flex-wrap items-center gap-2.5">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider shrink-0">
              Status:
            </span>
            {(["all", "received", "triage", "contacted", "converted", "closed"] as const).map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-2.5 py-1 rounded-xl text-xs font-bold capitalize transition shrink-0 ${
                  statusFilter === st
                    ? "bg-[#007A6C] text-white shadow-xs"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {st}
              </button>
            ))}
          </div>

          <ViewToggle mode={viewMode} onChange={setViewMode} />
        </div>
      </div>

      {/* Main Content Area (Table or Grid) */}
      {loading ? (
        <div className="p-12 text-center text-xs text-slate-400 bg-white rounded-2xl border border-slate-200">
          Loading incoming leads...
        </div>
      ) : filtered.length === 0 ? (
        <div className="p-12 text-center text-xs text-slate-500 bg-white rounded-2xl border border-slate-200 space-y-2">
          <Inbox className="w-8 h-8 text-slate-300 mx-auto" />
          <p className="font-semibold text-slate-700">No leads match the current filters.</p>
        </div>
      ) : viewMode === "table" ? (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F4F6F9] border-b border-slate-200 text-slate-700 font-bold uppercase tracking-wider text-[10px]">
              <tr>
                <SortHeader
                  field="receiptId"
                  label="Receipt ID"
                  currentSortField={sortField}
                  currentSortDirection={sortDirection}
                  onSort={handleSort}
                />
                <SortHeader
                  field="requesterName"
                  label="Lead / Requester"
                  currentSortField={sortField}
                  currentSortDirection={sortDirection}
                  onSort={handleSort}
                />
                <SortHeader
                  field="serviceType"
                  label="Service"
                  currentSortField={sortField}
                  currentSortDirection={sortDirection}
                  onSort={handleSort}
                />
                <SortHeader
                  field="country"
                  label="Origin / Country"
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
                  label="Date"
                  currentSortField={sortField}
                  currentSortDirection={sortDirection}
                  onSort={handleSort}
                />
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {paginatedLeads.map((item) => (
                <tr key={item._id} className="hover:bg-[#E6F8F6]/40 transition">
                  <td className="py-3 px-4 font-mono font-bold text-[#007A6C]">
                    {item.receiptId}
                  </td>
                  <td className="py-3 px-4">
                    <div className="font-semibold text-slate-900">
                      {item.requesterName || item.name || "Website Lead"}
                    </div>
                    <div className="text-[11px] text-slate-500">
                      {item.email || item.phone || "No direct contact"}
                    </div>
                  </td>
                  <td className="py-3 px-4 capitalize font-medium text-slate-700">
                    {item.serviceType.replace(/_/g, " ")}
                  </td>
                  <td className="py-3 px-4 text-slate-600">
                    <div>{item.country || "International"}</div>
                    <div className="text-[10px] text-slate-400">{item.sourcePath || "/"}</div>
                  </td>
                  <td className="py-3 px-4">
                    <select
                      value={item.status}
                      onChange={(e) => handleStatusChange(item._id, e.target.value)}
                      className="bg-slate-100 border border-slate-200 text-[11px] font-bold rounded-lg px-2 py-1 text-slate-700 focus:outline-none focus:border-[#007A6C] cursor-pointer"
                    >
                      <option value="received">Received (New)</option>
                      <option value="triage">In Triage</option>
                      <option value="contacted">Contacted</option>
                      <option value="converted">Converted to Case</option>
                      <option value="closed">Closed</option>
                    </select>
                  </td>
                  <td className="py-3 px-4 text-slate-500 text-[11px]">
                    {new Date(item.createdAt).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </td>
                  <td className="py-3 px-4 text-right space-x-2">
                    <button
                      onClick={() => setSelectedEnquiry(item)}
                      className="text-xs font-bold text-slate-700 hover:text-slate-900 border border-slate-200 hover:bg-slate-100 px-2.5 py-1 rounded-lg transition"
                    >
                      View
                    </button>
                    {item.status !== "converted" ? (
                      <button
                        onClick={() => handleConvertToCase(item)}
                        disabled={convertingId === item._id}
                        className="text-xs font-bold text-white bg-[#FF6B00] hover:bg-[#FF6D1B] active:scale-98 px-3 py-1 rounded-lg shadow-xs transition"
                      >
                        {convertingId === item._id ? "Converting..." : "Convert to Case"}
                      </button>
                    ) : (
                      <a
                        href="/case-management/"
                        className="inline-flex items-center gap-1 text-[11px] font-bold text-[#007A6C] hover:text-[#005F54] bg-[#E6F8F6] border border-[#B2EBE4] px-2 py-0.5 rounded-md"
                      >
                        <span>Case CMS</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Table Pagination */}
          <TablePagination
            currentPage={safeCurrentPage}
            totalItems={filtered.length}
            pageSize={pageSize}
            onPageChange={setCurrentPage}
            onPageSizeChange={setPageSize}
            pageSizeOptions={[10, 25, 50, 100]}
            itemLabel="leads"
          />
        </div>
      ) : (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {paginatedLeads.map((item) => {
              const name = item.requesterName || item.name || "Website Lead";
              const initials = name
                .split(" ")
                .map((n) => n[0])
                .join("")
                .substring(0, 2)
                .toUpperCase();

              return (
                <div
                  key={item._id}
                  className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:border-[#007A6C] hover:shadow-sm transition flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-3">
                    {/* Card Header */}
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-mono text-xs font-bold text-[#007A6C] bg-[#E6F8F6] border border-[#00C7BE]/30 px-2.5 py-0.5 rounded-lg">
                        {item.receiptId}
                      </span>
                      <select
                        value={item.status}
                        onChange={(e) => handleStatusChange(item._id, e.target.value)}
                        className="bg-slate-100 border border-slate-200 text-[11px] font-bold rounded-lg px-2 py-1 text-slate-700 focus:outline-none focus:border-[#007A6C] cursor-pointer"
                      >
                        <option value="received">Received (New)</option>
                        <option value="triage">In Triage</option>
                        <option value="contacted">Contacted</option>
                        <option value="converted">Converted to Case</option>
                        <option value="closed">Closed</option>
                      </select>
                    </div>

                    {/* Requester Identity */}
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#061E1B] to-[#007A6C] text-[#00C7BE] flex items-center justify-center font-bold text-xs shrink-0 shadow-xs">
                        {initials}
                      </div>
                      <div className="min-w-0">
                        <h4 className="font-bold text-xs text-slate-900 truncate">{name}</h4>
                        <p className="text-[11px] text-slate-500 truncate">
                          {item.email || item.phone || "No contact info"}
                        </p>
                      </div>
                    </div>

                    {/* Details Box */}
                    <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 space-y-1.5 text-[11px]">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400">Service:</span>
                        <span className="font-semibold text-slate-800 capitalize">
                          {item.serviceType.replace(/_/g, " ")}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400">Country:</span>
                        <span className="font-medium text-slate-700">{item.country || "International"}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400">Source:</span>
                        <span className="font-mono text-[10px] text-slate-500 truncate max-w-[140px]">
                          {item.sourcePath || "/"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Card Footer */}
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                    <span className="text-[10px] text-slate-400">
                      {new Date(item.createdAt).toLocaleDateString([], { month: "short", day: "numeric" })}
                    </span>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => setSelectedEnquiry(item)}
                        className="text-xs font-bold text-slate-700 hover:text-slate-900 border border-slate-200 hover:bg-slate-100 px-2.5 py-1 rounded-lg transition"
                      >
                        View
                      </button>
                      {item.status !== "converted" ? (
                        <button
                          onClick={() => handleConvertToCase(item)}
                          disabled={convertingId === item._id}
                          className="text-xs font-bold text-white bg-[#FF6B00] hover:bg-[#FF6D1B] active:scale-98 px-2.5 py-1 rounded-lg shadow-xs transition"
                        >
                          {convertingId === item._id ? "..." : "Convert"}
                        </button>
                      ) : (
                        <a
                          href="/case-management/"
                          className="inline-flex items-center gap-1 text-[11px] font-bold text-[#007A6C] hover:text-[#005F54] bg-[#E6F8F6] border border-[#B2EBE4] px-2 py-0.5 rounded-md"
                        >
                          <span>Case CMS</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Grid Pagination */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <TablePagination
              currentPage={safeCurrentPage}
              totalItems={filtered.length}
              pageSize={pageSize}
              onPageChange={setCurrentPage}
              onPageSizeChange={setPageSize}
              pageSizeOptions={[9, 18, 36, 72]}
              itemLabel="leads"
            />
          </div>
        </div>
      )}

      {/* Lead Detail & Dispatch Modal */}
      {selectedEnquiry && (
        <div className="fixed inset-0 z-50 bg-[#061E1B]/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <span className="text-[10px] font-mono font-bold text-[#007A6C] bg-[#E6F8F6] px-2 py-0.5 rounded border border-[#B2EBE4]">
                  {selectedEnquiry.receiptId}
                </span>
                <h3 className="text-base font-bold text-slate-800 mt-1">
                  {selectedEnquiry.requesterName || selectedEnquiry.name || "Inbound Website Lead"}
                </h3>
              </div>
              <button
                onClick={() => setSelectedEnquiry(null)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg text-sm"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3 bg-slate-50 p-3 rounded-xl border border-slate-100">
                <div>
                  <span className="text-slate-400 font-semibold block text-[10px] uppercase">
                    Email Address
                  </span>
                  <a href={`mailto:${selectedEnquiry.email}`} className="font-semibold text-[#007A6C] hover:underline">
                    {selectedEnquiry.email || "Not provided"}
                  </a>
                </div>
                <div>
                  <span className="text-slate-400 font-semibold block text-[10px] uppercase">
                    Phone / WhatsApp
                  </span>
                  <a
                    href={`https://wa.me/${(selectedEnquiry.phone || "").replace(/[^0-9]/g, "")}`}
                    target="_blank"
                    rel="noreferrer"
                    className="font-semibold text-[#007A6C] hover:underline"
                  >
                    {selectedEnquiry.phone || "Not provided"}
                  </a>
                </div>
                <div>
                  <span className="text-slate-400 font-semibold block text-[10px] uppercase">
                    Country of Residence
                  </span>
                  <span className="font-semibold text-slate-700">
                    {selectedEnquiry.country || "Not specified"}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 font-semibold block text-[10px] uppercase">
                    Service Requested
                  </span>
                  <span className="font-semibold text-slate-700 capitalize">
                    {selectedEnquiry.serviceType.replace(/_/g, " ")}
                  </span>
                </div>
              </div>

              {selectedEnquiry.preferredHospital && (
                <div>
                  <span className="text-slate-400 font-semibold block text-[10px] uppercase">
                    Preferred Hospital
                  </span>
                  <p className="font-semibold text-slate-700">{selectedEnquiry.preferredHospital}</p>
                </div>
              )}

              <div>
                <span className="text-slate-400 font-semibold block text-[10px] uppercase">
                  Inquiry Message & Clinical Summary
                </span>
                <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-slate-700 whitespace-pre-wrap leading-relaxed mt-1">
                  {selectedEnquiry.message || "No message provided."}
                </div>
              </div>

              {selectedEnquiry.notes && (
                <div>
                  <span className="text-slate-400 font-semibold block text-[10px] uppercase">
                    Operational Notes & Case History
                  </span>
                  <div className="bg-[#FFF4EC] p-2.5 rounded-lg border border-[#FFD8BF] text-[#B54700] text-[11px] mt-1">
                    {selectedEnquiry.notes}
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between pt-2">
                <span className="text-[11px] text-slate-400">
                  Origin URL: {selectedEnquiry.sourcePath || "/"}
                </span>
                <div>{getStatusBadge(selectedEnquiry.status)}</div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setSelectedEnquiry(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition"
              >
                Close
              </button>
              <div className="flex items-center gap-2">
                {selectedEnquiry.status !== "converted" ? (
                  <button
                    type="button"
                    onClick={() => handleConvertToCase(selectedEnquiry)}
                    disabled={convertingId === selectedEnquiry._id}
                    className="px-4 py-2 text-xs font-bold text-white bg-[#FF6B00] hover:bg-[#FF6D1B] active:scale-98 rounded-xl shadow-xs transition flex items-center gap-1.5"
                  >
                    <Briefcase className="w-3.5 h-3.5" />
                    <span>
                      {convertingId === selectedEnquiry._id
                        ? "Converting to Case..."
                        : "Convert into Patient Case"}
                    </span>
                  </button>
                ) : (
                  <a
                    href="/case-management/"
                    className="px-4 py-2 text-xs font-bold text-white bg-[#007A6C] hover:bg-[#005F54] rounded-xl shadow-sm transition flex items-center gap-1.5"
                  >
                    <span>Open Case Operations CMS</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
