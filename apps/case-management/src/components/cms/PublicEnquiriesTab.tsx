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
  AlertCircle
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
  createdAt: string;
}

export const PublicEnquiriesTab: React.FC = () => {
  const [enquiries, setEnquiries] = useState<EnquiryItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [search, setSearch] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedEnquiry, setSelectedEnquiry] = useState<EnquiryItem | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

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
      setUpdatingId(id);
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
      } else {
        alert("Failed to update enquiry status");
      }
    } catch (err: any) {
      alert(`Error updating enquiry: ${err.message}`);
    } finally {
      setUpdatingId(null);
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
        return <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800">Converted to Case</span>;
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
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h2 className="text-base font-bold text-slate-800 flex items-center gap-2">
            <Inbox className="w-5 h-5 text-teal-700" />
            <span>Public Website Inbound Enquiries</span>
          </h2>
          <p className="text-xs text-slate-500">
            Real-time inquiries submitted via public contact forms, estimate calculators, and emergency hotlines.
          </p>
        </div>

        <button
          onClick={fetchEnquiries}
          className="text-xs font-bold text-teal-800 hover:text-teal-950 border border-teal-600 hover:bg-teal-50 px-3 py-1.5 rounded-lg transition"
        >
          Refresh Feed
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <p className="text-[11px] font-semibold text-slate-500">Total Enquiries</p>
          <p className="text-xl font-extrabold text-slate-800">{totalCount}</p>
        </div>
        <div className="bg-amber-50/60 p-4 rounded-xl border border-amber-200 shadow-sm">
          <p className="text-[11px] font-semibold text-amber-700">Needs Triage (New)</p>
          <p className="text-xl font-extrabold text-amber-900">{newCount}</p>
        </div>
        <div className="bg-blue-50/60 p-4 rounded-xl border border-blue-200 shadow-sm">
          <p className="text-[11px] font-semibold text-blue-700">Active In Triage</p>
          <p className="text-xl font-extrabold text-blue-900">{triageCount}</p>
        </div>
        <div className="bg-emerald-50/60 p-4 rounded-xl border border-emerald-200 shadow-sm">
          <p className="text-[11px] font-semibold text-emerald-700">Converted to Cases</p>
          <p className="text-xl font-extrabold text-emerald-900">{convertedCount}</p>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by receipt ID, name, email or phone..."
            className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-teal-700"
          />
        </div>

        <div className="flex items-center gap-2 self-start md:self-auto">
          <Filter className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-xs font-semibold text-slate-500">Filter:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="text-xs px-2.5 py-1.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-teal-700 bg-white"
          >
            <option value="all">All Enquiries</option>
            <option value="received">Received (New)</option>
            <option value="triage">In Triage</option>
            <option value="contacted">Contacted</option>
            <option value="converted">Converted to Case</option>
            <option value="closed">Closed</option>
          </select>
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <div className="p-8 text-center text-xs text-slate-400">Loading website enquiries...</div>
      ) : filtered.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-xl border border-slate-200">
          <Inbox className="w-8 h-8 text-slate-300 mx-auto mb-2" />
          <p className="text-xs font-semibold text-slate-600">No public enquiries match current filter.</p>
          <p className="text-[11px] text-slate-400 mt-0.5">Inquiries sent from the public website will appear here in real time.</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold">
                <th className="py-3 px-4">Receipt ID</th>
                <th className="py-3 px-4">Patient / Lead Name</th>
                <th className="py-3 px-4">Contact Info</th>
                <th className="py-3 px-4">Country & Service</th>
                <th className="py-3 px-4">Status & Action</th>
                <th className="py-3 px-4">Received Date</th>
                <th className="py-3 px-4 text-right">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((item) => (
                <tr key={item._id} className="hover:bg-slate-50/60 transition">
                  <td className="py-3 px-4 font-mono font-bold text-teal-800">
                    {item.receiptId}
                  </td>
                  <td className="py-3 px-4 font-semibold text-slate-800">
                    {item.requesterName || item.name || "Anonymous Lead"}
                  </td>
                  <td className="py-3 px-4 text-slate-600 space-y-0.5">
                    <div className="flex items-center gap-1.5">
                      <Mail className="w-3 h-3 text-slate-400" />
                      <span>{item.email}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <PhoneCall className="w-3 h-3 text-slate-400" />
                      <span>{item.phone}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-slate-600">
                    <div className="font-semibold text-slate-700 capitalize">{item.serviceType}</div>
                    <div className="text-[11px] text-slate-400">{item.country || "Not specified"}</div>
                  </td>
                  <td className="py-3 px-4">
                    <select
                      value={item.status}
                      disabled={updatingId === item._id}
                      onChange={(e) => handleStatusChange(item._id, e.target.value)}
                      className="text-[11px] font-semibold border border-slate-300 rounded px-2 py-1 bg-white focus:outline-none focus:ring-1 focus:ring-teal-700"
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
                      minute: "2-digit"
                    })}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => setSelectedEnquiry(item)}
                      className="text-xs font-bold text-teal-700 hover:text-teal-900 px-2 py-1 rounded hover:bg-teal-50 transition"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Enquiry Detail Modal */}
      {selectedEnquiry && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <span className="text-[10px] font-mono font-bold text-teal-800 bg-teal-50 px-2 py-0.5 rounded">
                  {selectedEnquiry.receiptId}
                </span>
                <h3 className="text-base font-bold text-slate-800 mt-1">{selectedEnquiry.requesterName || selectedEnquiry.name || "Lead"}</h3>
              </div>
              <button
                onClick={() => setSelectedEnquiry(null)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3 bg-slate-50 p-3 rounded-xl border border-slate-100">
                <div>
                  <span className="text-slate-400 font-semibold block text-[10px]">EMAIL ADDRESS</span>
                  <a href={`mailto:${selectedEnquiry.email}`} className="font-semibold text-teal-800 hover:underline">
                    {selectedEnquiry.email}
                  </a>
                </div>
                <div>
                  <span className="text-slate-400 font-semibold block text-[10px]">PHONE / WHATSAPP</span>
                  <a href={`https://wa.me/${(selectedEnquiry.phone || "").replace(/[^0-9]/g, "")}`} target="_blank" rel="noreferrer" className="font-semibold text-teal-800 hover:underline">
                    {selectedEnquiry.phone || "Not provided"}
                  </a>
                </div>
                <div>
                  <span className="text-slate-400 font-semibold block text-[10px]">COUNTRY OF RESIDENCE</span>
                  <span className="font-semibold text-slate-700">{selectedEnquiry.country || "Not specified"}</span>
                </div>
                <div>
                  <span className="text-slate-400 font-semibold block text-[10px]">SERVICE REQUESTED</span>
                  <span className="font-semibold text-slate-700 capitalize">{selectedEnquiry.serviceType}</span>
                </div>
              </div>

              {selectedEnquiry.preferredHospital && (
                <div>
                  <span className="text-slate-400 font-semibold block text-[10px]">PREFERRED HOSPITAL</span>
                  <p className="font-semibold text-slate-700">{selectedEnquiry.preferredHospital}</p>
                </div>
              )}

              <div>
                <span className="text-slate-400 font-semibold block text-[10px]">INQUIRY MESSAGE & MEDICAL SUMMARY</span>
                <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-slate-700 whitespace-pre-wrap leading-relaxed mt-1">
                  {selectedEnquiry.message || "No message provided."}
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <span className="text-[11px] text-slate-400">
                  Origin Path: {selectedEnquiry.sourcePath || "/"}
                </span>
                <div>{getStatusBadge(selectedEnquiry.status)}</div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setSelectedEnquiry(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => {
                  handleStatusChange(selectedEnquiry._id, "converted");
                  alert(`Enquiry ${selectedEnquiry.receiptId} marked as 'converted' to case operations pipeline.`);
                  setSelectedEnquiry(null);
                }}
                className="px-4 py-2 text-xs font-bold text-white bg-teal-800 hover:bg-teal-900 rounded-lg shadow-sm transition"
              >
                Convert to Partner Case
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
