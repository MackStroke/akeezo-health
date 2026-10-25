import React, { useState, useEffect } from "react";
import {
  Inbox,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  ArrowRight,
  PhoneCall,
  Mail,
  User,
  ExternalLink,
  MessageSquare,
  AlertCircle,
  Briefcase,
  Sparkles,
  Check,
} from "lucide-react";

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
  const [enquiries, setEnquiries] = useState<EnquiryItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [search, setSearch] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedEnquiry, setSelectedEnquiry] = useState<EnquiryItem | null>(null);
  const [convertingId, setConvertingId] = useState<string | null>(null);
  const [conversionSuccess, setConversionSuccess] = useState<{ caseCode: string; receiptId: string } | null>(null);

  useEffect(() => {
    fetchEnquiries();
  }, []);

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
        setEnquiries((prev) =>
          prev.map((e) => (e._id === id ? { ...e, status: newStatus as any } : e))
        );
        if (selectedEnquiry?._id === id) {
          setSelectedEnquiry((prev) => (prev ? { ...prev, status: newStatus as any } : null));
        }
      }
    } catch (err: any) {
      alert(`Error updating enquiry: ${err.message}`);
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
        alert(json.error?.message || "Failed to convert lead to case");
        return;
      }

      const caseCode = json.data?.caseCode;
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
      alert(`Conversion error: ${err.message}`);
    } finally {
      setConvertingId(null);
    }
  };

  const filtered = enquiries.filter((e) => {
    const name = e.requesterName || e.name || "";
    const matchesSearch =
      !search ||
      name.toLowerCase().includes(search.toLowerCase()) ||
      e.receiptId.toLowerCase().includes(search.toLowerCase()) ||
      (e.email && e.email.toLowerCase().includes(search.toLowerCase())) ||
      (e.phone && e.phone.toLowerCase().includes(search.toLowerCase()));

    const matchesStatus = statusFilter === "all" || e.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "received":
        return <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800">Received (New)</span>;
      case "triage":
        return <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-blue-100 text-blue-800">In Triage</span>;
      case "contacted":
        return <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-purple-100 text-purple-800">Contacted</span>;
      case "converted":
        return <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 flex items-center gap-1"><Check className="w-3 h-3" /> Converted to Case</span>;
      case "closed":
        return <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-slate-100 text-slate-600">Closed</span>;
      default:
        return <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-slate-100 text-slate-700">{status}</span>;
    }
  };

  const totalCount = enquiries.length;
  const newCount = enquiries.filter((e) => e.status === "received").length;
  const triageCount = enquiries.filter((e) => e.status === "triage").length;
  const convertedCount = enquiries.filter((e) => e.status === "converted").length;

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-teal-900 via-teal-800 to-slate-900 rounded-2xl p-6 text-white shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-teal-700/60 text-teal-200 border border-teal-500/30">
            <Inbox className="w-3.5 h-3.5 text-teal-300" />
            <span>Central Lead Collector & Intake Engine</span>
          </div>
          <h1 className="text-xl font-black tracking-tight">Public Website Lead Collector</h1>
          <p className="text-xs text-teal-100/80 max-w-2xl leading-relaxed">
            Overall responsible for capturing, triaging, and processing all incoming leads from public web forms, cost calculators, emergency hotlines, and routing them directly into the Case Management System.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <a
            href="/case-management/"
            className="inline-flex items-center gap-2 bg-teal-700 hover:bg-teal-600 active:bg-teal-800 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-xs transition"
          >
            <Briefcase className="w-4 h-4" />
            <span>Open Case Operations CMS</span>
            <ExternalLink className="w-3.5 h-3.5 opacity-70" />
          </a>
        </div>
      </div>

      {/* Conversion Success Notification */}
      {conversionSuccess && (
        <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-2xl flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold">
              ✓
            </div>
            <div>
              <h4 className="text-xs font-bold text-emerald-950">
                Lead {conversionSuccess.receiptId} successfully converted into Case {conversionSuccess.caseCode}!
              </h4>
              <p className="text-[11px] text-emerald-800">
                Patient record created and case initialized in stage "intake".
              </p>
            </div>
          </div>
          <a
            href="/case-management/"
            className="text-xs font-bold text-emerald-800 hover:text-emerald-950 border border-emerald-400 hover:bg-emerald-100 px-3 py-1.5 rounded-xl transition flex items-center gap-1.5"
          >
            <span>Open in Case Management System</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </a>
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <p className="text-[11px] font-semibold text-slate-500">Total Leads Collected</p>
          <p className="text-2xl font-black text-slate-900 mt-1">{totalCount}</p>
        </div>
        <div className="bg-amber-50/60 p-4 rounded-xl border border-amber-200 shadow-xs">
          <p className="text-[11px] font-semibold text-amber-800">Pending Triage (New)</p>
          <p className="text-2xl font-black text-amber-900 mt-1">{newCount}</p>
        </div>
        <div className="bg-blue-50/60 p-4 rounded-xl border border-blue-200 shadow-xs">
          <p className="text-[11px] font-semibold text-blue-800">In Active Triage</p>
          <p className="text-2xl font-black text-blue-900 mt-1">{triageCount}</p>
        </div>
        <div className="bg-emerald-50/60 p-4 rounded-xl border border-emerald-200 shadow-xs">
          <p className="text-[11px] font-semibold text-emerald-800">Converted to Cases</p>
          <p className="text-2xl font-black text-emerald-900 mt-1">{convertedCount}</p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-3 bg-white p-3 rounded-xl border border-slate-200 shadow-xs">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by receipt ID, name, email, or phone..."
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-slate-200 focus:border-teal-700 focus:outline-none transition"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider shrink-0">
            Filter Status:
          </span>
          {(["all", "received", "triage", "contacted", "converted", "closed"] as const).map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold capitalize transition shrink-0 ${
                statusFilter === st
                  ? "bg-teal-800 text-white shadow-2xs"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Leads Table */}
      {loading ? (
        <div className="p-12 text-center text-xs text-slate-400 bg-white rounded-xl border border-slate-200">
          Loading incoming leads...
        </div>
      ) : filtered.length === 0 ? (
        <div className="p-12 text-center text-xs text-slate-500 bg-white rounded-xl border border-slate-200 space-y-2">
          <Inbox className="w-8 h-8 text-slate-300 mx-auto" />
          <p className="font-semibold text-slate-700">No leads match the current filters.</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3 px-4">Receipt ID</th>
                <th className="py-3 px-4">Lead / Requester</th>
                <th className="py-3 px-4">Service</th>
                <th className="py-3 px-4">Origin / Country</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((item) => (
                <tr key={item._id} className="hover:bg-slate-50/80 transition">
                  <td className="py-3 px-4 font-mono font-bold text-teal-800">
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
                      className="bg-slate-100 border border-slate-200 text-[11px] font-bold rounded-md px-2 py-1 text-slate-700 focus:outline-none focus:border-teal-700 cursor-pointer"
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
                  <td className="py-3 px-4 text-right space-x-1.5">
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
                        className="text-xs font-bold text-white bg-teal-800 hover:bg-teal-900 active:bg-teal-950 px-2.5 py-1 rounded-lg shadow-2xs transition"
                      >
                        {convertingId === item._id ? "Converting..." : "Convert to Case"}
                      </button>
                    ) : (
                      <a
                        href="/case-management/"
                        className="inline-flex items-center gap-1 text-[11px] font-bold text-teal-800 hover:text-teal-950 bg-teal-50 border border-teal-200 px-2 py-0.5 rounded-md"
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
        </div>
      )}

      {/* Lead Detail & Dispatch Modal */}
      {selectedEnquiry && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <span className="text-[10px] font-mono font-bold text-teal-800 bg-teal-50 px-2 py-0.5 rounded">
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
                  <a href={`mailto:${selectedEnquiry.email}`} className="font-semibold text-teal-800 hover:underline">
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
                    className="font-semibold text-teal-800 hover:underline"
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
                  <div className="bg-amber-50/60 p-2.5 rounded-lg border border-amber-200 text-amber-900 text-[11px] mt-1">
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
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition"
              >
                Close
              </button>
              <div className="flex items-center gap-2">
                {selectedEnquiry.status !== "converted" ? (
                  <button
                    type="button"
                    onClick={() => handleConvertToCase(selectedEnquiry)}
                    disabled={convertingId === selectedEnquiry._id}
                    className="px-4 py-2 text-xs font-bold text-white bg-teal-800 hover:bg-teal-900 rounded-lg shadow-sm transition flex items-center gap-1.5"
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
                    className="px-4 py-2 text-xs font-bold text-white bg-teal-800 hover:bg-teal-900 rounded-lg shadow-sm transition flex items-center gap-1.5"
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
