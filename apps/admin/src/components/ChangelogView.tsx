import React, { useState, useEffect, useMemo } from "react";
import {
  Tag,
  Sparkles,
  Plus,
  Edit3,
  Trash2,
  Globe,
  Eye,
  Search,
  Filter,
  Calendar,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  X,
  Copy,
  Check,
  ChevronRight,
  Layers,
  ShieldCheck,
  Wrench,
  Bug,
  FileText,
  User,
  ExternalLink,
} from "lucide-react";
import {
  TablePagination,
  SortHeader,
  getNextSortDirection,
  SortDirection,
  ViewToggle,
  ViewMode,
} from "./TablePagination.js";
import { useAuth } from "../context/AuthContext.js";

export interface ChangelogItem {
  id?: string;
  type: "feature" | "improvement" | "fix" | "security" | "maintenance" | "breaking";
  text: string;
  badge?: string;
}

export interface ChangelogEntry {
  _id: string;
  version: string;
  title: string;
  summary?: string;
  releaseDate: string;
  category: "feature" | "improvement" | "fix" | "security" | "maintenance" | "breaking";
  status: "draft" | "published" | "archived";
  audience: "all" | "public" | "internal" | "partners";
  items: ChangelogItem[];
  modules: string[];
  authorName: string;
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}

export const CATEGORY_STYLES: Record<string, { label: string; bg: string; text: string; border: string; icon: any }> = {
  feature: {
    label: "Feature",
    bg: "bg-emerald-50",
    text: "text-emerald-800",
    border: "border-emerald-200",
    icon: Sparkles,
  },
  improvement: {
    label: "Improvement",
    bg: "bg-teal-50",
    text: "text-[#007A6C]",
    border: "border-teal-200",
    icon: Wrench,
  },
  fix: {
    label: "Bug Fix",
    bg: "bg-amber-50",
    text: "text-amber-800",
    border: "border-amber-200",
    icon: Bug,
  },
  security: {
    label: "Security",
    bg: "bg-purple-50",
    text: "text-purple-800",
    border: "border-purple-200",
    icon: ShieldCheck,
  },
  maintenance: {
    label: "Maintenance",
    bg: "bg-slate-100",
    text: "text-slate-700",
    border: "border-slate-200",
    icon: Layers,
  },
  breaking: {
    label: "Breaking",
    bg: "bg-rose-50",
    text: "text-rose-800",
    border: "border-rose-200",
    icon: AlertCircle,
  },
};

interface ChangelogViewProps {
  initialCreateModal?: boolean;
}

export const ChangelogView: React.FC<ChangelogViewProps> = ({ initialCreateModal = false }) => {
  const { token, user } = useAuth();
  const [changelogs, setChangelogs] = useState<ChangelogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [audienceFilter, setAudienceFilter] = useState("all");
  const [viewMode, setViewMode] = useState<ViewMode>("table");

  // Sorting
  const [sortField, setSortField] = useState<string | null>("releaseDate");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalCount, setTotalCount] = useState(0);

  // Modals / Drawers
  const [isFormModalOpen, setIsFormModalOpen] = useState(initialCreateModal);
  const [editingEntry, setEditingEntry] = useState<ChangelogEntry | null>(null);
  const [viewingEntry, setViewingEntry] = useState<ChangelogEntry | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState<{
    version: string;
    title: string;
    summary: string;
    releaseDate: string;
    category: "feature" | "improvement" | "fix" | "security" | "maintenance" | "breaking";
    status: "draft" | "published" | "archived";
    audience: "all" | "public" | "internal" | "partners";
    items: ChangelogItem[];
    modulesText: string;
    notes: string;
  }>({
    version: "",
    title: "",
    summary: "",
    releaseDate: new Date().toISOString().split("T")[0],
    category: "feature",
    status: "published",
    audience: "all",
    items: [],
    modulesText: "",
    notes: "",
  });

  const [formSubmitting, setFormSubmitting] = useState(false);
  const [formError, setFormError] = useState("");
  const [toastMessage, setToastMessage] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const getAuthHeaders = () => {
    const authToken =
      token ||
      (typeof window !== "undefined" ? localStorage.getItem("akeezo_auth_token") : null);
    return {
      "Content-Type": "application/json",
      ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
    };
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 4000);
  };

  const fetchChangelogs = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      params.set("page", String(currentPage));
      params.set("limit", String(pageSize));
      if (searchQuery.trim()) params.set("search", searchQuery.trim());
      if (categoryFilter !== "all") params.set("category", categoryFilter);
      if (statusFilter !== "all") params.set("status", statusFilter);
      if (audienceFilter !== "all") params.set("audience", audienceFilter);
      if (sortField) {
        params.set("sortField", sortField);
        params.set("sortDirection", sortDirection || "desc");
      }

      const res = await fetch(`/api/v1/admin/changelogs?${params.toString()}`, {
        headers: getAuthHeaders(),
      });
      if (res.ok) {
        const json = await res.json();
        setChangelogs(json.data || []);
        setTotalCount(json.pagination?.total || 0);
      }
    } catch (err) {
      console.error("Failed to fetch changelogs", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChangelogs();
  }, [
    currentPage,
    pageSize,
    searchQuery,
    categoryFilter,
    statusFilter,
    audienceFilter,
    sortField,
    sortDirection,
  ]);

  const handleSort = (field: string) => {
    const next = getNextSortDirection(sortField, field, sortDirection);
    setSortField(next.field);
    setSortDirection(next.direction);
  };

  const openCreateModal = () => {
    setEditingEntry(null);
    setFormData({
      version: `v1.${changelogs.length + 1}.0`,
      title: "",
      summary: "",
      releaseDate: new Date().toISOString().split("T")[0],
      category: "feature",
      status: "published",
      audience: "all",
      items: [
        { type: "feature", text: "", badge: "Core" },
      ],
      modulesText: "Admin, Website",
      notes: "",
    });
    setFormError("");
    setIsFormModalOpen(true);
  };

  const openEditModal = (entry: ChangelogEntry) => {
    setEditingEntry(entry);
    setFormData({
      version: entry.version,
      title: entry.title,
      summary: entry.summary || "",
      releaseDate: entry.releaseDate ? entry.releaseDate.split("T")[0] : new Date().toISOString().split("T")[0],
      category: entry.category,
      status: entry.status,
      audience: entry.audience,
      items: entry.items && entry.items.length > 0 ? [...entry.items] : [{ type: "feature", text: "", badge: "" }],
      modulesText: (entry.modules || []).join(", "),
      notes: entry.notes || "",
    });
    setFormError("");
    setIsFormModalOpen(true);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitting(true);
    setFormError("");

    try {
      const payload = {
        version: formData.version.trim(),
        title: formData.title.trim(),
        summary: formData.summary.trim(),
        releaseDate: formData.releaseDate,
        category: formData.category,
        status: formData.status,
        audience: formData.audience,
        items: formData.items.filter((it) => it.text.trim().length > 0),
        modules: formData.modulesText
          .split(",")
          .map((m) => m.trim())
          .filter(Boolean),
        notes: formData.notes.trim(),
        authorName: user?.name || "Akeezo Super Admin",
      };

      const url = editingEntry
        ? `/api/v1/admin/changelogs/${editingEntry._id}`
        : "/api/v1/admin/changelogs";
      const method = editingEntry ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: getAuthHeaders(),
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (!res.ok) {
        setFormError(json.error?.message || "Failed to save changelog.");
        return;
      }

      setIsFormModalOpen(false);
      showToast(
        editingEntry
          ? `Changelog ${payload.version} updated successfully.`
          : `Changelog ${payload.version} recorded successfully.`
      );
      fetchChangelogs();
    } catch (err: any) {
      setFormError(err.message || "An unexpected error occurred.");
    } finally {
      setFormSubmitting(false);
    }
  };

  const handleTogglePublish = async (entry: ChangelogEntry) => {
    try {
      const res = await fetch(`/api/v1/admin/changelogs/${entry._id}/publish`, {
        method: "POST",
        headers: getAuthHeaders(),
      });
      if (res.ok) {
        const nextStatus = entry.status === "published" ? "draft" : "published";
        setChangelogs((prev) =>
          prev.map((c) => (c._id === entry._id ? { ...c, status: nextStatus } : c))
        );
        showToast(`Changelog ${entry.version} status changed to ${nextStatus}.`);
      }
    } catch (err: any) {
      console.error("Failed to toggle publish status", err);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/v1/admin/changelogs/${id}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      });
      if (res.ok) {
        setChangelogs((prev) => prev.filter((c) => c._id !== id));
        setDeletingId(null);
        showToast("Changelog entry deleted successfully.");
      }
    } catch (err: any) {
      console.error("Failed to delete changelog", err);
    }
  };

  const handleCopyMarkdown = (entry: ChangelogEntry) => {
    const md = `## [${entry.version}] - ${entry.title} (${entry.releaseDate ? entry.releaseDate.split("T")[0] : "Recent"})\n\n${entry.summary ? `${entry.summary}\n\n` : ""}${entry.items.map((i) => `- **[${i.type.toUpperCase()}]** ${i.text}${i.badge ? ` \`#${i.badge}\`` : ""}`).join("\n")}\n`;
    navigator.clipboard.writeText(md);
    setCopiedId(entry._id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const handleAddItemRow = () => {
    setFormData((prev) => ({
      ...prev,
      items: [...prev.items, { type: "improvement", text: "", badge: "" }],
    }));
  };

  const handleRemoveItemRow = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index),
    }));
  };

  const handleItemChange = (index: number, field: keyof ChangelogItem, value: any) => {
    setFormData((prev) => {
      const copy = [...prev.items];
      copy[index] = { ...copy[index], [field]: value };
      return { ...prev, items: copy };
    });
  };

  // KPI calculations
  const stats = useMemo(() => {
    const published = changelogs.filter((c) => c.status === "published").length;
    const drafts = changelogs.filter((c) => c.status === "draft").length;
    const latest = changelogs[0]?.version || "v1.0.0";
    return { total: totalCount, published, drafts, latest };
  }, [changelogs, totalCount]);

  return (
    <div className="space-y-6 font-sans">
      {/* 1. Header Banner */}
      <div className="bg-gradient-to-r from-[#061E1B] via-teal-950 to-[#061E1B] rounded-2xl p-6 text-white shadow-md border border-[#00C7BE]/30 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#007A6C]/50 text-[#00C7BE] border border-[#00C7BE]/30">
            <Tag className="w-3.5 h-3.5 text-[#00C7BE]" />
            <span>Product Release Governance</span>
          </div>
          <h1 className="text-xl font-black tracking-tight">Platform Changelog & Release Notes</h1>
          <p className="text-xs text-teal-100/80 max-w-2xl leading-relaxed">
            Record, categorize, and publish software versions, medical feature releases, security updates, and architecture milestones across the Akeezo Platform.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={openCreateModal}
            className="px-4 py-2.5 text-xs font-bold text-white bg-[#FF6B00] hover:bg-[#e05e00] rounded-xl shadow-xs transition flex items-center gap-1.5 shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Record Changelog</span>
          </button>
        </div>
      </div>

      {/* 2. KPI Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Releases</div>
          <div className="text-2xl font-black text-slate-900 mt-1">{stats.total}</div>
          <div className="text-[11px] text-slate-500 mt-0.5">Recorded versions</div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Published</div>
          <div className="text-2xl font-black text-emerald-600 mt-1">{stats.published}</div>
          <div className="text-[11px] text-slate-500 mt-0.5">Live on public /api</div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Draft Releases</div>
          <div className="text-2xl font-black text-amber-600 mt-1">{stats.drafts}</div>
          <div className="text-[11px] text-slate-500 mt-0.5">Pending approval</div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Latest Version</div>
          <div className="text-2xl font-black text-[#007A6C] font-mono mt-1">{stats.latest}</div>
          <div className="text-[11px] text-slate-500 mt-0.5">Active production</div>
        </div>
      </div>

      {/* 3. Toast Notifications */}
      {toastMessage && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* 4. Filter & Search Toolbar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2.5 flex-1">
          {/* Search */}
          <div className="relative min-w-[200px] flex-1 max-w-xs">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Search version, title, notes..."
              className="w-full text-xs pl-8 pr-3 py-2 rounded-xl border border-slate-300 focus:border-[#007A6C] focus:outline-none"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Category Filter */}
          <select
            value={categoryFilter}
            onChange={(e) => {
              setCategoryFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="text-xs px-3 py-2 rounded-xl border border-slate-300 focus:border-[#007A6C] focus:outline-none bg-white font-medium"
          >
            <option value="all">All Categories</option>
            <option value="feature">Features (New)</option>
            <option value="improvement">Improvements</option>
            <option value="fix">Bug Fixes</option>
            <option value="security">Security</option>
            <option value="maintenance">Maintenance</option>
            <option value="breaking">Breaking</option>
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="text-xs px-3 py-2 rounded-xl border border-slate-300 focus:border-[#007A6C] focus:outline-none bg-white font-medium"
          >
            <option value="all">All Statuses</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
            <option value="archived">Archived</option>
          </select>

          {/* Audience Filter */}
          <select
            value={audienceFilter}
            onChange={(e) => {
              setAudienceFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="text-xs px-3 py-2 rounded-xl border border-slate-300 focus:border-[#007A6C] focus:outline-none bg-white font-medium"
          >
            <option value="all">All Audiences</option>
            <option value="public">Public Only</option>
            <option value="internal">Internal Only</option>
            <option value="partners">Partners Only</option>
          </select>
        </div>

        <div className="flex items-center gap-2 self-end md:self-auto">
          <ViewToggle mode={viewMode} onChange={setViewMode} />
          <button
            type="button"
            onClick={fetchChangelogs}
            disabled={loading}
            className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition"
            title="Refresh changelogs"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin text-[#007A6C]" : ""}`} />
          </button>
        </div>
      </div>

      {/* 5. Main Content: Table or Card Grid */}
      {loading && changelogs.length === 0 ? (
        <div className="p-12 text-center text-slate-400 text-xs font-semibold bg-white rounded-2xl border border-slate-200">
          Loading platform changelogs...
        </div>
      ) : changelogs.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 space-y-3">
          <Tag className="w-10 h-10 text-slate-300 mx-auto" />
          <div className="text-sm font-bold text-slate-800">No changelog entries found</div>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            {searchQuery || categoryFilter !== "all" || statusFilter !== "all"
              ? "No release records match your active search filters. Try clearing filters."
              : "No releases recorded yet. Click 'Record Changelog' above to create your first release note."}
          </p>
          <button
            type="button"
            onClick={openCreateModal}
            className="px-4 py-2 text-xs font-bold text-white bg-[#007A6C] hover:bg-[#005F54] rounded-xl transition"
          >
            Record New Release
          </button>
        </div>
      ) : viewMode === "table" ? (
        /* TABLE VIEW */
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase text-[10px] tracking-wider">
                <tr>
                  <SortHeader
                    field="version"
                    label="Version"
                    currentSortField={sortField}
                    currentSortDirection={sortDirection}
                    onSort={handleSort}
                  />
                  <SortHeader
                    field="title"
                    label="Release Title & Summary"
                    currentSortField={sortField}
                    currentSortDirection={sortDirection}
                    onSort={handleSort}
                  />
                  <SortHeader
                    field="category"
                    label="Category"
                    currentSortField={sortField}
                    currentSortDirection={sortDirection}
                    onSort={handleSort}
                  />
                  <th className="px-4 py-3">Audience</th>
                  <SortHeader
                    field="releaseDate"
                    label="Release Date"
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
                  <th className="px-4 py-3">Author</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {changelogs.map((entry) => {
                  const catStyle = CATEGORY_STYLES[entry.category] || CATEGORY_STYLES.feature;
                  const CatIcon = catStyle.icon;

                  return (
                    <tr key={entry._id} className="hover:bg-slate-50/80 transition">
                      {/* Version */}
                      <td className="px-4 py-3.5 whitespace-nowrap">
                        <span className="font-mono font-bold text-xs px-2.5 py-1 rounded-lg bg-teal-50 text-[#007A6C] border border-teal-200">
                          {entry.version}
                        </span>
                      </td>

                      {/* Title & Summary */}
                      <td className="px-4 py-3.5 max-w-md">
                        <div className="font-bold text-slate-900 line-clamp-1">{entry.title}</div>
                        {entry.summary && (
                          <div className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                            {entry.summary}
                          </div>
                        )}
                        {entry.modules && entry.modules.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-1">
                            {entry.modules.map((m, i) => (
                              <span
                                key={i}
                                className="text-[10px] px-1.5 py-0.5 rounded-md bg-slate-100 text-slate-600 font-medium"
                              >
                                #{m}
                              </span>
                            ))}
                          </div>
                        )}
                      </td>

                      {/* Category */}
                      <td className="px-4 py-3.5 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${catStyle.bg} ${catStyle.text} ${catStyle.border}`}
                        >
                          <CatIcon className="w-3 h-3" />
                          <span>{catStyle.label}</span>
                        </span>
                      </td>

                      {/* Audience */}
                      <td className="px-4 py-3.5 whitespace-nowrap">
                        <span className="text-[11px] font-medium text-slate-600 capitalize">
                          {entry.audience}
                        </span>
                      </td>

                      {/* Release Date */}
                      <td className="px-4 py-3.5 whitespace-nowrap font-mono text-slate-600 text-[11px]">
                        {entry.releaseDate ? entry.releaseDate.split("T")[0] : "—"}
                      </td>

                      {/* Status */}
                      <td className="px-4 py-3.5 whitespace-nowrap">
                        <button
                          type="button"
                          onClick={() => handleTogglePublish(entry)}
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full border transition flex items-center gap-1 ${
                            entry.status === "published"
                              ? "bg-emerald-100 text-emerald-800 border-emerald-300 hover:bg-emerald-200"
                              : entry.status === "draft"
                              ? "bg-amber-100 text-amber-800 border-amber-300 hover:bg-amber-200"
                              : "bg-slate-100 text-slate-600 border-slate-300 hover:bg-slate-200"
                          }`}
                          title="Click to toggle Published / Draft"
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              entry.status === "published" ? "bg-emerald-600" : "bg-amber-600"
                            }`}
                          />
                          <span className="capitalize">{entry.status}</span>
                        </button>
                      </td>

                      {/* Author */}
                      <td className="px-4 py-3.5 whitespace-nowrap text-slate-500 text-[11px]">
                        {entry.authorName || "Engineering"}
                      </td>

                      {/* Actions */}
                      <td className="px-4 py-3.5 whitespace-nowrap text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* View details */}
                          <button
                            type="button"
                            onClick={() => setViewingEntry(entry)}
                            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition"
                            title="View release notes"
                          >
                            <Eye className="w-4 h-4" />
                          </button>

                          {/* Copy Markdown */}
                          <button
                            type="button"
                            onClick={() => handleCopyMarkdown(entry)}
                            className="p-1.5 text-slate-400 hover:text-[#007A6C] hover:bg-slate-100 rounded-lg transition"
                            title="Copy Markdown release notes"
                          >
                            {copiedId === entry._id ? (
                              <Check className="w-4 h-4 text-emerald-600" />
                            ) : (
                              <Copy className="w-4 h-4" />
                            )}
                          </button>

                          {/* Edit */}
                          <button
                            type="button"
                            onClick={() => openEditModal(entry)}
                            className="p-1.5 text-slate-400 hover:text-[#007A6C] hover:bg-slate-100 rounded-lg transition"
                            title="Edit changelog"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>

                          {/* Delete */}
                          <button
                            type="button"
                            onClick={() => setDeletingId(entry._id)}
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                            title="Delete changelog"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* CARD GRID VIEW */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {changelogs.map((entry) => {
            const catStyle = CATEGORY_STYLES[entry.category] || CATEGORY_STYLES.feature;
            const CatIcon = catStyle.icon;

            return (
              <div
                key={entry._id}
                className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:border-[#00C7BE]/40 transition space-y-3"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-xs px-2.5 py-0.5 rounded-lg bg-teal-50 text-[#007A6C] border border-teal-200">
                      {entry.version}
                    </span>
                    <span
                      className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full border ${catStyle.bg} ${catStyle.text} ${catStyle.border}`}
                    >
                      <CatIcon className="w-3 h-3" />
                      <span>{catStyle.label}</span>
                    </span>
                  </div>

                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      entry.status === "published"
                        ? "bg-emerald-100 text-emerald-800"
                        : "bg-amber-100 text-amber-800"
                    }`}
                  >
                    {entry.status}
                  </span>
                </div>

                <div>
                  <h3 className="text-sm font-bold text-slate-900">{entry.title}</h3>
                  {entry.summary && (
                    <p className="text-xs text-slate-500 mt-1 line-clamp-2">{entry.summary}</p>
                  )}
                </div>

                {entry.items && entry.items.length > 0 && (
                  <div className="space-y-1.5 pt-2 border-t border-slate-100">
                    {entry.items.slice(0, 3).map((item, idx) => (
                      <div key={idx} className="text-xs text-slate-600 flex items-start gap-1.5">
                        <span className="text-[#007A6C] font-bold shrink-0">•</span>
                        <span className="line-clamp-1">{item.text}</span>
                        {item.badge && (
                          <span className="text-[10px] font-mono font-bold px-1.5 py-0.2 rounded bg-slate-100 text-slate-600 shrink-0">
                            {item.badge}
                          </span>
                        )}
                      </div>
                    ))}
                    {entry.items.length > 3 && (
                      <span className="text-[11px] text-slate-400 block">
                        +{entry.items.length - 3} more updates...
                      </span>
                    )}
                  </div>
                )}

                <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-xs text-slate-400">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5" />
                    <span className="font-mono text-[11px]">
                      {entry.releaseDate ? entry.releaseDate.split("T")[0] : "Recent"}
                    </span>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => setViewingEntry(entry)}
                      className="px-2.5 py-1 text-xs font-bold text-[#007A6C] hover:bg-teal-50 rounded-lg transition"
                    >
                      Inspect
                    </button>
                    <button
                      type="button"
                      onClick={() => openEditModal(entry)}
                      className="p-1 text-slate-400 hover:text-[#007A6C] rounded-lg transition"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeletingId(entry._id)}
                      className="p-1 text-slate-400 hover:text-rose-600 rounded-lg transition"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 6. Pagination Footer */}
      {changelogs.length > 0 && (
        <TablePagination
          currentPage={currentPage}
          pageSize={pageSize}
          totalItems={totalCount}
          onPageChange={setCurrentPage}
          onPageSizeChange={(newSize) => {
            setPageSize(newSize);
            setCurrentPage(1);
          }}
        />
      )}

      {/* ======================================================== */}
      {/* MODAL 1: RECORD / EDIT CHANGELOG                         */}
      {/* ======================================================== */}
      {isFormModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden">
            {/* Modal Header */}
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-teal-50 border border-teal-200 flex items-center justify-center text-[#007A6C]">
                  <Tag className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-slate-900">
                    {editingEntry ? `Edit Changelog ${editingEntry.version}` : "Record New Platform Release"}
                  </h2>
                  <p className="text-xs text-slate-500">
                    Document changes, bug fixes, security enhancements, and feature rollouts.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsFormModalOpen(false)}
                className="p-2 text-slate-400 hover:text-slate-600 rounded-xl"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body / Scrollable Form */}
            <form onSubmit={handleFormSubmit} className="flex-1 overflow-y-auto p-6 space-y-4">
              {formError && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* Version */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Version <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.version}
                    onChange={(e) => setFormData({ ...formData, version: e.target.value })}
                    placeholder="v1.4.0"
                    required
                    className="w-full text-xs font-mono font-bold px-3 py-2 rounded-xl border border-slate-300 focus:border-[#007A6C] focus:outline-none"
                  />
                </div>

                {/* Release Date */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Release Date <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={formData.releaseDate}
                    onChange={(e) => setFormData({ ...formData, releaseDate: e.target.value })}
                    required
                    className="w-full text-xs px-3 py-2 rounded-xl border border-slate-300 focus:border-[#007A6C] focus:outline-none"
                  />
                </div>

                {/* Category */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Primary Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({ ...formData, category: e.target.value as any })
                    }
                    className="w-full text-xs px-3 py-2 rounded-xl border border-slate-300 focus:border-[#007A6C] focus:outline-none bg-white font-medium"
                  >
                    <option value="feature">Feature (New Addition)</option>
                    <option value="improvement">Improvement</option>
                    <option value="fix">Bug Fix</option>
                    <option value="security">Security Patch</option>
                    <option value="maintenance">Maintenance</option>
                    <option value="breaking">Breaking Changes</option>
                  </select>
                </div>
              </div>

              {/* Title */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Release Title <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Media Library WebP Engine & Responsive Variants"
                  required
                  className="w-full text-xs px-3 py-2 rounded-xl border border-slate-300 focus:border-[#007A6C] focus:outline-none font-bold"
                />
              </div>

              {/* Summary */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Executive Summary</label>
                <textarea
                  value={formData.summary}
                  onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                  rows={2}
                  placeholder="Brief high-level overview explaining the purpose of this release..."
                  className="w-full text-xs px-3 py-2 rounded-xl border border-slate-300 focus:border-[#007A6C] focus:outline-none"
                />
              </div>

              {/* Status & Audience & Modules */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Publication Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                    className="w-full text-xs px-3 py-2 rounded-xl border border-slate-300 focus:border-[#007A6C] focus:outline-none bg-white"
                  >
                    <option value="published">Published (Active)</option>
                    <option value="draft">Draft (Private)</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Target Audience</label>
                  <select
                    value={formData.audience}
                    onChange={(e) => setFormData({ ...formData, audience: e.target.value as any })}
                    className="w-full text-xs px-3 py-2 rounded-xl border border-slate-300 focus:border-[#007A6C] focus:outline-none bg-white"
                  >
                    <option value="all">All (Public & Internal)</option>
                    <option value="public">Public Website Only</option>
                    <option value="internal">Internal Team Only</option>
                    <option value="partners">Hospitals & Partners</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Modules (Comma-separated)
                  </label>
                  <input
                    type="text"
                    value={formData.modulesText}
                    onChange={(e) => setFormData({ ...formData, modulesText: e.target.value })}
                    placeholder="Admin, Media, Security"
                    className="w-full text-xs px-3 py-2 rounded-xl border border-slate-300 focus:border-[#007A6C] focus:outline-none"
                  />
                </div>
              </div>

              {/* Itemized Bullet Points Builder */}
              <div className="pt-2 border-t border-slate-100">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-bold text-slate-800">
                    Itemized Changes & Release Points ({formData.items.length})
                  </label>
                  <button
                    type="button"
                    onClick={handleAddItemRow}
                    className="text-xs font-bold text-[#007A6C] hover:underline flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Item</span>
                  </button>
                </div>

                <div className="space-y-2">
                  {formData.items.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-2 p-2 rounded-xl bg-slate-50 border border-slate-200"
                    >
                      <select
                        value={item.type}
                        onChange={(e) => handleItemChange(idx, "type", e.target.value)}
                        className="text-[11px] font-bold px-2 py-1 rounded-lg border border-slate-300 bg-white"
                      >
                        <option value="feature">Feature</option>
                        <option value="improvement">Improvement</option>
                        <option value="fix">Fix</option>
                        <option value="security">Security</option>
                        <option value="maintenance">Maintenance</option>
                        <option value="breaking">Breaking</option>
                      </select>

                      <input
                        type="text"
                        value={item.text}
                        onChange={(e) => handleItemChange(idx, "text", e.target.value)}
                        placeholder="Description of change or feature..."
                        required
                        className="text-xs flex-1 px-2.5 py-1 rounded-lg border border-slate-300 bg-white focus:outline-none focus:border-[#007A6C]"
                      />

                      <input
                        type="text"
                        value={item.badge || ""}
                        onChange={(e) => handleItemChange(idx, "badge", e.target.value)}
                        placeholder="Tag (e.g. Core)"
                        className="text-[11px] font-mono w-24 px-2 py-1 rounded-lg border border-slate-300 bg-white focus:outline-none"
                      />

                      <button
                        type="button"
                        onClick={() => handleRemoveItemRow(idx)}
                        className="p-1 text-slate-400 hover:text-rose-600 rounded"
                        title="Remove row"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Detailed Markdown Notes */}
              <div className="pt-2 border-t border-slate-100">
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Detailed Notes / Technical Specifications (Optional)
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  rows={3}
                  placeholder="Full markdown release notes, architectural decisions, testing details..."
                  className="w-full text-xs font-mono px-3 py-2 rounded-xl border border-slate-300 focus:border-[#007A6C] focus:outline-none"
                />
              </div>

              {/* Form Actions Footer */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsFormModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={formSubmitting}
                  className="px-5 py-2 text-xs font-bold text-white bg-[#007A6C] hover:bg-[#005F54] rounded-xl shadow-xs transition disabled:opacity-60 flex items-center gap-1.5"
                >
                  {formSubmitting && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
                  <span>{editingEntry ? "Update Release" : "Publish Release"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* DRAWER / MODAL 2: VIEW RELEASE NOTES PREVIEW             */}
      {/* ======================================================== */}
      {viewingEntry && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden">
            {/* Header */}
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-3">
                <span className="font-mono font-bold text-sm px-3 py-1 rounded-xl bg-teal-50 text-[#007A6C] border border-teal-200">
                  {viewingEntry.version}
                </span>
                <div>
                  <h2 className="text-base font-bold text-slate-900">{viewingEntry.title}</h2>
                  <span className="text-[11px] text-slate-400 font-mono">
                    Released {viewingEntry.releaseDate ? viewingEntry.releaseDate.split("T")[0] : "Recent"} by{" "}
                    {viewingEntry.authorName}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleCopyMarkdown(viewingEntry)}
                  className="px-3 py-1.5 text-xs font-bold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-xl flex items-center gap-1"
                >
                  {copiedId === viewingEntry._id ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Markdown</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => setViewingEntry(null)}
                  className="p-2 text-slate-400 hover:text-slate-600 rounded-xl"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Content Body */}
            <div className="p-6 overflow-y-auto space-y-4">
              {viewingEntry.summary && (
                <div className="p-4 bg-teal-50/50 rounded-xl border border-teal-100 text-xs text-slate-700 leading-relaxed">
                  <span className="font-bold text-[#007A6C] block mb-0.5">Summary</span>
                  {viewingEntry.summary}
                </div>
              )}

              {/* Items List */}
              {viewingEntry.items && viewingEntry.items.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                    Changes in this version ({viewingEntry.items.length})
                  </h4>
                  <div className="space-y-2">
                    {viewingEntry.items.map((it, idx) => {
                      const catStyle = CATEGORY_STYLES[it.type] || CATEGORY_STYLES.improvement;
                      const CatIcon = catStyle.icon;

                      return (
                        <div
                          key={idx}
                          className="p-3 bg-white rounded-xl border border-slate-200 flex items-start gap-2.5 text-xs"
                        >
                          <span
                            className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-md border shrink-0 ${catStyle.bg} ${catStyle.text} ${catStyle.border}`}
                          >
                            <CatIcon className="w-3 h-3" />
                            <span>{catStyle.label}</span>
                          </span>

                          <span className="flex-1 text-slate-800 leading-relaxed font-medium">
                            {it.text}
                          </span>

                          {it.badge && (
                            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-600 shrink-0">
                              #{it.badge}
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Notes */}
              {viewingEntry.notes && (
                <div className="space-y-1 pt-3 border-t border-slate-100">
                  <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                    Technical Specifications
                  </h4>
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 font-mono text-xs text-slate-700 whitespace-pre-wrap">
                    {viewingEntry.notes}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL 3: DELETE CONFIRMATION                             */}
      {/* ======================================================== */}
      {deletingId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xl max-w-sm w-full space-y-4">
            <div className="flex items-center gap-3 text-rose-600">
              <div className="w-10 h-10 rounded-xl bg-rose-50 flex items-center justify-center">
                <Trash2 className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Delete Changelog?</h3>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Are you sure you want to delete this changelog entry? This action cannot be undone and will be permanently recorded in the administrative audit log.
            </p>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setDeletingId(null)}
                className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleDelete(deletingId)}
                className="px-4 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-xl shadow-xs transition"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
