import React, { useState, useEffect, useMemo } from "react";
import {
  MessageSquare,
  Search,
  Filter,
  CheckCircle2,
  AlertTriangle,
  Eye,
  Trash2,
  Stethoscope,
  Sparkles,
  ExternalLink,
  RefreshCw,
  Pin,
  Check,
  X,
  Send,
  HelpCircle,
  ThumbsUp,
} from "lucide-react";
import { useAuth } from "../context/AuthContext.js";

interface CommunityStats {
  total: number;
  published: number;
  pending: number;
  hidden: number;
  doctorAnswered: number;
  stories: number;
}

export const CommunityManager: React.FC = () => {
  const { token } = useAuth();
  const [threads, setThreads] = useState<any[]>([]);
  const [stats, setStats] = useState<CommunityStats>({
    total: 0,
    published: 0,
    pending: 0,
    hidden: 0,
    doctorAnswered: 0,
    stories: 0,
  });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");

  // Doctor response modal state
  const [selectedThreadForReply, setSelectedThreadForReply] = useState<any | null>(null);
  const [doctorName, setDoctorName] = useState("Dr. Chokchai Amornpiwat");
  const [doctorSpecialty, setDoctorSpecialty] = useState("Senior Consultant Plastic Surgeon");
  const [hospitalName, setHospitalName] = useState("Yanhee International Hospital, Bangkok");
  const [doctorId, setDoctorId] = useState("dr-chokchai-amornpiwat");
  const [doctorReplyContent, setDoctorReplyContent] = useState("");
  const [replySubmitting, setReplySubmitting] = useState(false);
  const [actionMessage, setActionMessage] = useState<string | null>(null);

  const fetchThreads = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (statusFilter !== "all") params.append("status", statusFilter);
      if (categoryFilter !== "all") params.append("category", categoryFilter);
      if (search.trim()) params.append("search", search.trim());

      const res = await fetch(`/api/v1/admin/community?${params.toString()}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (res.ok) {
        const json = await res.json();
        setThreads(json.data.threads || []);
        if (json.data.stats) {
          setStats(json.data.stats);
        }
      }
    } catch (err) {
      console.error("Failed to fetch community threads:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchThreads();
  }, [statusFilter, categoryFilter, token]);

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/v1/admin/community/${id}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        setThreads((prev) =>
          prev.map((t) => (t.id === id || t._id === id ? { ...t, status: newStatus } : t))
        );
        setActionMessage(`Thread status updated to ${newStatus}`);
        setTimeout(() => setActionMessage(null), 3000);
      }
    } catch (err) {
      console.error("Failed to update status:", err);
    }
  };

  const handleTogglePin = async (id: string, currentPin: boolean) => {
    try {
      const res = await fetch(`/api/v1/admin/community/${id}/pin`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ isPinned: !currentPin }),
      });
      if (res.ok) {
        setThreads((prev) =>
          prev.map((t) => (t.id === id || t._id === id ? { ...t, isPinned: !currentPin } : t))
        );
        setActionMessage(!currentPin ? "Thread pinned to top" : "Thread unpinned");
        setTimeout(() => setActionMessage(null), 3000);
      }
    } catch (err) {
      console.error("Failed to toggle pin:", err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this community discussion?")) return;
    try {
      const res = await fetch(`/api/v1/admin/community/${id}`, {
        method: "DELETE",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (res.ok) {
        setThreads((prev) => prev.filter((t) => t.id !== id && t._id !== id));
        setActionMessage("Thread deleted successfully");
        setTimeout(() => setActionMessage(null), 3000);
      }
    } catch (err) {
      console.error("Failed to delete thread:", err);
    }
  };

  const handlePostDoctorReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedThreadForReply || !doctorReplyContent.trim()) return;

    setReplySubmitting(true);
    try {
      const id = selectedThreadForReply.id || selectedThreadForReply._id;
      const res = await fetch(`/api/v1/admin/community/${id}/doctor-reply`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          doctorName,
          doctorSpecialty,
          hospitalName,
          doctorId,
          content: doctorReplyContent.trim(),
        }),
      });

      if (res.ok) {
        setActionMessage("Doctor answer published successfully!");
        setSelectedThreadForReply(null);
        setDoctorReplyContent("");
        fetchThreads();
        setTimeout(() => setActionMessage(null), 3000);
      }
    } catch (err) {
      console.error("Failed to post doctor answer:", err);
    } finally {
      setReplySubmitting(false);
    }
  };

  const filtered = useMemo(() => {
    if (!search.trim()) return threads;
    const q = search.toLowerCase();
    return threads.filter(
      (t) =>
        t.title?.toLowerCase().includes(q) ||
        t.content?.toLowerCase().includes(q) ||
        t.author?.name?.toLowerCase().includes(q) ||
        t.category?.toLowerCase().includes(q)
    );
  }, [threads, search]);

  return (
    <div className="space-y-6">
      {/* Page Title & Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-800 flex items-center gap-2">
            <MessageSquare className="size-6 text-[#00C7BE]" />
            <span>Community Q&amp;A &amp; Patient Stories Moderation</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Review community questions, verify patient reviews, publish answers, and post accredited specialist doctor responses.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={fetchThreads}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-2xs transition cursor-pointer"
          >
            <RefreshCw className={`size-3.5 ${loading ? "animate-spin" : ""}`} />
            <span>Refresh</span>
          </button>
          <a
            href="/community"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#007A6C] hover:bg-[#005a4f] text-white text-xs font-bold shadow-2xs transition"
          >
            <span>Public Community</span>
            <ExternalLink className="size-3.5" />
          </a>
        </div>
      </div>

      {actionMessage && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-semibold flex items-center justify-between animate-in fade-in">
          <span>{actionMessage}</span>
          <button type="button" onClick={() => setActionMessage(null)} className="text-emerald-600 hover:text-emerald-900">
            <X className="size-3.5" />
          </button>
        </div>
      )}

      {/* KPI Stats Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Threads</div>
          <div className="text-xl font-bold text-slate-800 mt-1">{stats.total}</div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <div className="text-[11px] font-bold text-emerald-600 uppercase tracking-wider">Published</div>
          <div className="text-xl font-bold text-emerald-600 mt-1">{stats.published}</div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <div className="text-[11px] font-bold text-amber-600 uppercase tracking-wider">Pending Review</div>
          <div className="text-xl font-bold text-amber-600 mt-1">{stats.pending}</div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Hidden / Flagged</div>
          <div className="text-xl font-bold text-slate-500 mt-1">{stats.hidden}</div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <div className="text-[11px] font-bold text-teal-600 uppercase tracking-wider">Doctor Answered</div>
          <div className="text-xl font-bold text-teal-600 mt-1">{stats.doctorAnswered}</div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <div className="text-[11px] font-bold text-purple-600 uppercase tracking-wider">Patient Stories</div>
          <div className="text-xl font-bold text-purple-600 mt-1">{stats.stories}</div>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex flex-wrap items-center gap-3 flex-1 min-w-[260px]">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="size-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search discussions, content, or author..."
              className="w-full pl-9 pr-3 py-1.5 rounded-lg border border-slate-200 outline-none focus:border-[#00C7BE] bg-slate-50/50"
            />
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-slate-500 font-semibold">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-2.5 py-1.5 rounded-lg border border-slate-200 outline-none bg-slate-50/50 font-medium cursor-pointer"
            >
              <option value="all">All Statuses</option>
              <option value="published">Published</option>
              <option value="pending_review">Pending Review</option>
              <option value="hidden">Hidden</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-slate-500 font-semibold">Category:</span>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-2.5 py-1.5 rounded-lg border border-slate-200 outline-none bg-slate-50/50 font-medium cursor-pointer max-w-[180px] truncate"
            >
              <option value="all">All Categories</option>
              <option value="Cosmetic & Plastic Surgery">Cosmetic & Plastic Surgery</option>
              <option value="IVF & Fertility Treatment">IVF & Fertility Treatment</option>
              <option value="Hair Transplant">Hair Transplant</option>
              <option value="Dental Care">Dental Care</option>
              <option value="Orthopedics & Spine">Orthopedics & Spine</option>
              <option value="Bariatric & Weight Loss">Bariatric & Weight Loss</option>
              <option value="Cardiac & Oncology">Cardiac & Oncology</option>
              <option value="Travel, Visa & Logistics">Travel, Visa & Logistics</option>
            </select>
          </div>
        </div>

        <span className="text-slate-400 font-medium">
          Showing <strong>{filtered.length}</strong> items
        </span>
      </div>

      {/* Moderation Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-bold">
                <th className="py-3 px-4">Discussion Title</th>
                <th className="py-3 px-3">Type &amp; Category</th>
                <th className="py-3 px-3">Author</th>
                <th className="py-3 px-3">Engagement</th>
                <th className="py-3 px-3">Doctor Status</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-4 text-right">Moderation Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400">
                    No community discussions found.
                  </td>
                </tr>
              ) : (
                filtered.map((thread) => {
                  const id = thread.id || thread._id;
                  return (
                    <tr key={id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-4 max-w-xs">
                        <div className="flex items-start gap-1.5">
                          {thread.isPinned && (
                            <Pin className="size-3.5 text-purple-600 fill-purple-600 shrink-0 mt-0.5" />
                          )}
                          <div>
                            <a
                              href={`/community/${thread.slug}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="font-bold text-slate-900 hover:text-[#007A6C] line-clamp-1 flex items-center gap-1"
                            >
                              <span>{thread.title}</span>
                              <ExternalLink className="size-2.5 opacity-50" />
                            </a>
                            <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">{thread.content}</p>
                          </div>
                        </div>
                      </td>

                      <td className="py-3 px-3 whitespace-nowrap">
                        <div className="space-y-1">
                          <span className="block text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 w-max">
                            {thread.category}
                          </span>
                          {thread.isStory ? (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-700">
                              <Sparkles className="size-2.5" /> Story
                            </span>
                          ) : (
                            <span className="text-[10px] text-slate-400">Question</span>
                          )}
                        </div>
                      </td>

                      <td className="py-3 px-3 whitespace-nowrap">
                        <div className="font-semibold text-slate-800">
                          {thread.author?.isAnonymous ? "Anonymous Patient" : thread.author?.name || "Patient"}
                        </div>
                        <div className="text-[11px] text-slate-400">{thread.author?.country || "International"}</div>
                      </td>

                      <td className="py-3 px-3 whitespace-nowrap text-slate-500">
                        <div className="flex items-center gap-2">
                          <span className="flex items-center gap-0.5 font-bold text-slate-700">
                            <ThumbsUp className="size-3 text-slate-400" />
                            {thread.upvotes || 0}
                          </span>
                          <span>·</span>
                          <span>{thread.repliesCount || (thread.replies ? thread.replies.length : 0)} replies</span>
                        </div>
                      </td>

                      <td className="py-3 px-3 whitespace-nowrap">
                        {thread.isDoctorAnswered ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold">
                            <CheckCircle2 className="size-3 text-emerald-600" />
                            Answered
                          </span>
                        ) : (
                          <span className="text-[10px] text-slate-400 font-medium">Awaiting Answer</span>
                        )}
                      </td>

                      <td className="py-3 px-3 whitespace-nowrap">
                        <select
                          value={thread.status || "published"}
                          onChange={(e) => handleStatusChange(id, e.target.value)}
                          className={`text-[11px] font-bold px-2.5 py-1 rounded-full border outline-none cursor-pointer ${
                            thread.status === "published"
                              ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                              : thread.status === "pending_review"
                              ? "bg-amber-50 text-amber-700 border-amber-200"
                              : "bg-slate-100 text-slate-600 border-slate-300"
                          }`}
                        >
                          <option value="published">Published</option>
                          <option value="pending_review">Pending</option>
                          <option value="hidden">Hidden</option>
                        </select>
                      </td>

                      <td className="py-3 px-4 text-right whitespace-nowrap">
                        <div className="inline-flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleTogglePin(id, Boolean(thread.isPinned))}
                            className={`p-1.5 rounded-lg border text-xs font-semibold cursor-pointer transition ${
                              thread.isPinned
                                ? "bg-purple-50 text-purple-700 border-purple-200"
                                : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                            }`}
                            title={thread.isPinned ? "Unpin thread" : "Pin thread to top"}
                          >
                            <Pin className="size-3.5" />
                          </button>

                          <button
                            type="button"
                            onClick={() => setSelectedThreadForReply(thread)}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-teal-50 hover:bg-teal-100 text-[#007A6C] border border-teal-200 text-xs font-bold transition cursor-pointer"
                            title="Attach verified doctor response"
                          >
                            <Stethoscope className="size-3.5" />
                            <span>Doctor Reply</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => handleDelete(id)}
                            className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 border border-transparent hover:border-rose-200 transition cursor-pointer"
                            title="Delete thread"
                          >
                            <Trash2 className="size-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Attach Doctor Reply Modal */}
      {selectedThreadForReply && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-4 bg-gradient-to-r from-teal-900 to-[#005a4f] text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Stethoscope className="size-5 text-[#00C7BE]" />
                <h3 className="font-bold text-sm">Post Verified Doctor Answer</h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedThreadForReply(null)}
                className="text-white/80 hover:text-white"
              >
                <X className="size-4" />
              </button>
            </div>

            <form onSubmit={handlePostDoctorReply} className="p-5 space-y-3.5 text-xs overflow-y-auto">
              <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                <span className="block text-[10px] font-bold uppercase text-slate-400">Replying to Thread</span>
                <span className="font-bold text-slate-800 line-clamp-1">{selectedThreadForReply.title}</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Doctor Name</label>
                  <input
                    type="text"
                    value={doctorName}
                    onChange={(e) => setDoctorName(e.target.value)}
                    className="w-full text-xs p-2 rounded-lg border border-slate-200 outline-none focus:border-[#00C7BE]"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Doctor ID / Slug</label>
                  <input
                    type="text"
                    value={doctorId}
                    onChange={(e) => setDoctorId(e.target.value)}
                    className="w-full text-xs p-2 rounded-lg border border-slate-200 outline-none focus:border-[#00C7BE]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Clinical Specialty</label>
                  <input
                    type="text"
                    value={doctorSpecialty}
                    onChange={(e) => setDoctorSpecialty(e.target.value)}
                    className="w-full text-xs p-2 rounded-lg border border-slate-200 outline-none focus:border-[#00C7BE]"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Hospital / Medical Centre</label>
                  <input
                    type="text"
                    value={hospitalName}
                    onChange={(e) => setHospitalName(e.target.value)}
                    className="w-full text-xs p-2 rounded-lg border border-slate-200 outline-none focus:border-[#00C7BE]"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Clinical Opinion / Guidance Text
                </label>
                <textarea
                  rows={4}
                  value={doctorReplyContent}
                  onChange={(e) => setDoctorReplyContent(e.target.value)}
                  placeholder="Enter detailed physician advice, protocol recommendations, recovery timelines..."
                  className="w-full text-xs p-3 rounded-lg border border-slate-200 outline-none focus:border-[#00C7BE] resize-none"
                  required
                />
              </div>

              <div className="pt-2 flex items-center justify-between border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setSelectedThreadForReply(null)}
                  className="px-4 py-2 rounded-lg border border-slate-200 text-slate-600 font-bold text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={replySubmitting}
                  className="inline-flex items-center gap-1.5 px-5 py-2 rounded-lg bg-[#007A6C] hover:bg-[#005a4f] text-white font-bold text-xs shadow-xs disabled:opacity-50"
                >
                  <Send className="size-3.5" />
                  <span>{replySubmitting ? "Publishing..." : "Attach Doctor Answer"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
