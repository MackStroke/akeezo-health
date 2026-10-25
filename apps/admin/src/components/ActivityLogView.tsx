import React, { useState, useEffect } from "react";
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

export const ActivityLogView: React.FC = () => {
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [moduleFilter, setModuleFilter] = useState("all");
  const [actionFilter, setActionFilter] = useState("all");
  const [selectedActivity, setSelectedActivity] = useState<ActivityItem | null>(null);

  useEffect(() => {
    fetchActivity();
  }, [moduleFilter, actionFilter]);

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

      {/* 2. Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 font-semibold">Module:</span>
            <select
              value={moduleFilter}
              onChange={(e) => setModuleFilter(e.target.value)}
              className="text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none font-medium text-slate-700"
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

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 font-semibold">Action:</span>
            <select
              value={actionFilter}
              onChange={(e) => setActionFilter(e.target.value)}
              className="text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none font-medium text-slate-700"
            >
              <option value="all">All Actions</option>
              <option value="create">Create</option>
              <option value="update">Update</option>
              <option value="publish">Publish</option>
              <option value="delete">Delete</option>
            </select>
          </div>
        </div>

        <div className="text-xs text-slate-400 font-medium">
          Showing {activities.length} immutable events
        </div>
      </div>

      {/* 3. Main Stream Table & Diff Drawer */}
      <div className="flex flex-col lg:flex-row gap-6">
        <div className={`flex-1 ${selectedActivity ? "lg:w-2/3" : "w-full"}`}>
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4">Timestamp</th>
                  <th className="py-3 px-4">Actor</th>
                  <th className="py-3 px-4">Module</th>
                  <th className="py-3 px-4">Action</th>
                  <th className="py-3 px-4">IP Address</th>
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
                  activities.map((act) => {
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
    </div>
  );
};
