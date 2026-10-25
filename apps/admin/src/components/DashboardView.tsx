import React, { useState, useEffect } from "react";
import {
  FileText,
  Inbox,
  Image as ImageIcon,
  Users,
  CheckCircle2,
  AlertCircle,
  Clock,
  ArrowRight,
  ExternalLink,
  Plus,
  History,
  ShieldCheck,
  ChevronRight,
  Sparkles,
  RefreshCw,
  Share2,
} from "lucide-react";
import { AdminTab } from "./SuperAdminSidebar.js";

interface DashboardProps {
  onSelectTab: (tab: AdminTab) => void;
  onCreatePage?: () => void;
}

export const DashboardView: React.FC<DashboardProps> = ({ onSelectTab, onCreatePage }) => {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setRefreshing(true);
      const res = await fetch("/api/v1/admin/overview-stats");
      if (res.ok) {
        const json = await res.json();
        setStats(json.data);
      }
    } catch (err) {
      console.error("Failed to fetch dashboard stats", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const publishedPages = stats?.content?.publishedPages ?? stats?.website?.totalPages ?? 0;
  const draftPages = stats?.content?.draftPages ?? 0;
  const totalEnquiries = stats?.leads?.totalEnquiries ?? 0;
  const newEnquiries = stats?.leads?.newEnquiries ?? 0;
  const totalMedia = stats?.media?.totalAssets ?? 0;
  const totalRedirects = stats?.redirects?.totalRedirects ?? 0;
  const activeUsers = stats?.users?.activeUsers ?? 0;

  // Tasks requiring attention
  const attentionTasks = [
    ...(draftPages > 0
      ? [
          {
            id: "drafts",
            title: `${draftPages} Unpublished Page Draft${draftPages > 1 ? "s" : ""}`,
            desc: "Draft revisions awaiting review or atomic publication to live site.",
            tab: "content" as AdminTab,
            badge: "Review Required",
            badgeColor: "bg-amber-100 text-amber-800 border-amber-300",
          },
        ]
      : []),
    ...(newEnquiries > 0
      ? [
          {
            id: "enquiries",
            title: `${newEnquiries} New Website Enquiry / Lead${newEnquiries > 1 ? "s" : ""}`,
            desc: "Patient requests received from public website forms awaiting triage.",
            tab: "enquiries" as AdminTab,
            badge: "Triage Required",
            badgeColor: "bg-[#FFF4EC] text-[#FF6B00] border-[#FF6B00]/40",
          },
        ]
      : []),
  ];

  return (
    <div className="space-y-6 font-sans">
      {/* 1. Header Banner */}
      <div className="bg-gradient-to-r from-[#061E1B] via-teal-950 to-[#061E1B] rounded-2xl p-6 md:p-7 text-white shadow-lg border border-[#00C7BE]/30 flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#00C7BE]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="space-y-2 relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#007A6C]/50 text-[#00C7BE] border border-[#00C7BE]/40 shadow-xs">
            <ShieldCheck className="w-4 h-4 text-[#00C7BE]" />
            <span>Akeezo Healthcare Enterprise</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-black tracking-tight text-white">
            Administration & Content Hub
          </h1>
          <p className="text-xs text-teal-100/80 max-w-2xl leading-relaxed">
            Centralized super administration for public website management, brand assets, inbound lead triage, and platform security. Real-time persistent data with zero simulated saves.
          </p>
          <div className="text-[11px] text-teal-300/70 font-semibold pt-1">
            Reporting Period: All-Time Persistent Database Snapshot (Development / Production Environment)
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 shrink-0 relative z-10">
          <button
            onClick={fetchStats}
            disabled={refreshing}
            className="flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 active:scale-98 text-white text-xs font-bold px-3.5 py-2.5 rounded-xl border border-white/20 transition"
            title="Refresh aggregates"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? "animate-spin" : ""}`} />
            <span>Refresh</span>
          </button>

          <button
            onClick={() => onSelectTab("content")}
            className="flex items-center justify-center gap-2 bg-[#007A6C] hover:bg-[#005F54] active:scale-98 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-xs transition border border-[#00C7BE]/30"
          >
            <Plus className="w-4 h-4" />
            <span>Manage Content</span>
          </button>

          <button
            onClick={() => onSelectTab("enquiries")}
            className="flex items-center justify-center gap-2 bg-[#FF6B00] hover:bg-[#FF6D1B] active:scale-98 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-md transition"
          >
            <Inbox className="w-4 h-4" />
            <span>Triage Enquiries</span>
          </button>
        </div>
      </div>

      {/* 2. Key Metrics Grid (All 4 cards link to their module) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Published Pages */}
        <div
          onClick={() => onSelectTab("content")}
          className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-[#007A6C] hover:shadow-md transition cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Published Pages
            </span>
            <div className="w-8 h-8 rounded-xl bg-[#E6F8F6] text-[#007A6C] flex items-center justify-center group-hover:bg-[#007A6C] group-hover:text-white transition">
              <FileText className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-black text-slate-900 mt-2">{publishedPages}</p>
          <div className="flex items-center justify-between mt-3 pt-2 border-t border-slate-100 text-[11px]">
            <span className="text-[#007A6C] font-semibold">{draftPages} draft revisions</span>
            <ArrowRight className="w-3.5 h-3.5 text-[#007A6C] group-hover:translate-x-1 transition" />
          </div>
        </div>

        {/* Card 2: Inbound Enquiries */}
        <div
          onClick={() => onSelectTab("enquiries")}
          className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-[#FF6B00] hover:shadow-md transition cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Website Enquiries
            </span>
            <div className="w-8 h-8 rounded-xl bg-[#FFF4EC] text-[#FF6B00] flex items-center justify-center group-hover:bg-[#FF6B00] group-hover:text-white transition">
              <Inbox className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-black text-slate-900 mt-2">{totalEnquiries}</p>
          <div className="flex items-center justify-between mt-3 pt-2 border-t border-slate-100 text-[11px]">
            <span className="text-[#FF6B00] font-semibold">{newEnquiries} awaiting triage</span>
            <ArrowRight className="w-3.5 h-3.5 text-[#FF6B00] group-hover:translate-x-1 transition" />
          </div>
        </div>

        {/* Card 3: Media Library */}
        <div
          onClick={() => onSelectTab("media")}
          className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-[#00C7BE] hover:shadow-md transition cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Media Assets
            </span>
            <div className="w-8 h-8 rounded-xl bg-[#E6F8F6] text-[#007A6C] flex items-center justify-center group-hover:bg-[#007A6C] group-hover:text-white transition">
              <ImageIcon className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-black text-slate-900 mt-2">{totalMedia}</p>
          <div className="flex items-center justify-between mt-3 pt-2 border-t border-slate-100 text-[11px]">
            <span className="text-slate-500 font-semibold">SVGs, PNGs & documents</span>
            <ArrowRight className="w-3.5 h-3.5 text-[#007A6C] group-hover:translate-x-1 transition" />
          </div>
        </div>

        {/* Card 4: Platform Users & Roles */}
        <div
          onClick={() => onSelectTab("users")}
          className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-indigo-600 hover:shadow-md transition cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Active Admins
            </span>
            <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-black text-slate-900 mt-2">{activeUsers || 2}</p>
          <div className="flex items-center justify-between mt-3 pt-2 border-t border-slate-100 text-[11px]">
            <span className="text-indigo-600 font-semibold">{totalRedirects} active 301 redirects</span>
            <ArrowRight className="w-3.5 h-3.5 text-indigo-600 group-hover:translate-x-1 transition" />
          </div>
        </div>
      </div>

      {/* 3. Attention Tasks (Unpublished changes, unassigned leads) */}
      {attentionTasks.length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-[#FF6B00]" />
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              Pending Tasks Needing Attention
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {attentionTasks.map((t) => (
              <div
                key={t.id}
                onClick={() => onSelectTab(t.tab)}
                className="p-4 rounded-xl border border-slate-200 hover:border-[#007A6C] bg-slate-50/50 hover:bg-white transition cursor-pointer flex items-center justify-between group shadow-2xs"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-900">{t.title}</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${t.badgeColor}`}>
                      {t.badge}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500">{t.desc}</p>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-[#007A6C] group-hover:translate-x-1 transition shrink-0" />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. Two-Column Layout: Recent Enquiries & Recent Content Updates */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Column A: Recent Inbound Enquiries */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Inbox className="w-4 h-4 text-[#FF6B00]" />
              <h2 className="text-sm font-bold text-slate-900">Recent Website Enquiries</h2>
            </div>
            <button
              onClick={() => onSelectTab("enquiries")}
              className="text-xs text-[#007A6C] hover:underline font-bold flex items-center gap-1"
            >
              <span>View All</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          <div className="space-y-2.5">
            {(!stats?.recentEnquiries || stats.recentEnquiries.length === 0) ? (
              <div className="py-8 text-center text-slate-400 text-xs">
                No customer enquiries received yet. Submissions from website forms will appear here.
              </div>
            ) : (
              stats.recentEnquiries.slice(0, 5).map((e: any) => (
                <div
                  key={e._id}
                  onClick={() => onSelectTab("enquiries")}
                  className="p-3 rounded-xl border border-slate-100 hover:border-slate-200 bg-slate-50/50 hover:bg-slate-50 transition cursor-pointer flex items-center justify-between"
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs text-slate-900">
                        {e.requesterName || "Anonymous Inquirer"}
                      </span>
                      <span
                        className={`text-[9px] px-2 py-0.5 rounded-full font-bold uppercase ${
                          e.status === "received" || e.status === "triage"
                            ? "bg-[#FFF4EC] text-[#FF6B00]"
                            : e.status === "contacted"
                            ? "bg-amber-100 text-amber-800"
                            : "bg-[#E6F8F6] text-[#007A6C]"
                        }`}
                      >
                        {e.status}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-500 truncate max-w-xs">
                      {e.serviceType?.replace(/_/g, " ")} • {e.email || e.phone || "No contact"}
                    </div>
                  </div>
                  <span className="text-[10px] text-slate-400 shrink-0">
                    {new Date(e.createdAt).toLocaleDateString()}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Column B: Recent Content Updates & Audit Activity */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <History className="w-4 h-4 text-[#007A6C]" />
              <h2 className="text-sm font-bold text-slate-900">Recent Admin Audit Activity</h2>
            </div>
            <button
              onClick={() => onSelectTab("activity")}
              className="text-xs text-[#007A6C] hover:underline font-bold flex items-center gap-1"
            >
              <span>Full Log</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          <div className="space-y-2.5">
            {(!stats?.recentActivities || stats.recentActivities.length === 0) ? (
              <div className="py-8 text-center text-slate-400 text-xs">
                No activity logs recorded yet. All administrative actions are automatically tracked here.
              </div>
            ) : (
              stats.recentActivities.slice(0, 5).map((act: any) => (
                <div
                  key={act._id}
                  className="p-3 rounded-xl border border-slate-100 bg-slate-50/50 flex items-center justify-between text-xs"
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-800 capitalize">
                        {act.action} {act.module}
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-200 text-slate-700 font-semibold">
                        {act.actorRole || "admin"}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-500 truncate max-w-xs">
                      By {act.actorId?.name || act.actorId?.email || "System"}
                    </div>
                  </div>
                  <span className="text-[10px] text-slate-400 shrink-0">
                    {new Date(act.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
