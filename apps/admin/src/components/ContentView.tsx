import React, { useState, useEffect, useMemo } from "react";
import {
  TablePagination,
  SortHeader,
  sortItems,
  getNextSortDirection,
  SortDirection,
  ViewToggle,
  ViewMode,
} from "./TablePagination";
import {
  FileText,
  Search,
  Plus,
  Eye,
  Copy,
  Archive,
  CheckCircle2,
  AlertCircle,
  Clock,
  Sparkles,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Trash2,
  ArrowUpDown,
  History,
  RotateCcw,
  Globe,
  Share2,
  ShieldAlert,
  Menu,
  Sliders,
  Check,
  Save,
  X,
  BookOpen,
} from "lucide-react";
import { BlogManagerView } from "./BlogManagerView.js";
import { useToast, DisabledGuideButton } from "@akeezo/ui";

interface PageItem {
  id: string;
  slug: string;
  title: string;
  status: "published" | "draft" | "archived";
  version: number;
  updatedAt?: string;
  publishedAt?: string;
  path: string;
}

interface NavItem {
  id: string;
  label: string;
  destination: string;
  isExternal: boolean;
  order: number;
  isVisible: boolean;
}

interface FooterGroup {
  id: string;
  title: string;
  order: number;
  links: {
    label: string;
    destination: string;
    isExternal: boolean;
    isVisible: boolean;
  }[];
}

interface ContentViewProps {
  initialSubTab?: "pages" | "blog" | "navigation";
  initialCreateModal?: boolean;
}

export const ContentView: React.FC<ContentViewProps> = ({
  initialSubTab = "pages",
  initialCreateModal = false,
}) => {
  const toast = useToast();
  const [activeSubTab, setActiveSubTab] = useState<"pages" | "blog" | "navigation">(initialSubTab);

  useEffect(() => {
    if (initialSubTab) {
      setActiveSubTab(initialSubTab);
    }
  }, [initialSubTab]);

  // --- Pages State ---
  const [pages, setPages] = useState<PageItem[]>([]);
  const [loadingPages, setLoadingPages] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedPage, setSelectedPage] = useState<PageItem | null>(null);
  const [editorOpen, setEditorOpen] = useState(false);
  const [editorTab, setEditorTab] = useState<"content" | "seo" | "revisions">("content");

  // Page Editor State
  const [editingTitle, setEditingTitle] = useState("");
  const [editingSlug, setEditingSlug] = useState("");
  const [payload, setPayload] = useState<any>({});
  const [seo, setSeo] = useState<any>({});
  const [revisions, setRevisions] = useState<any[]>([]);
  const [savingPage, setSavingPage] = useState(false);
  const [savePageSuccess, setSavePageSuccess] = useState("");
  const [editorError, setEditorError] = useState("");

  // Create Page Modal State
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newSlug, setNewSlug] = useState("");
  const [creatingPage, setCreatingPage] = useState(false);

  // --- Navigation & Footer State ---
  const [headerMenu, setHeaderMenu] = useState<NavItem[]>([]);
  const [footerGroups, setFooterGroups] = useState<FooterGroup[]>([]);
  const [loadingNav, setLoadingNav] = useState(false);
  const [savingNav, setSavingNav] = useState(false);
  const [navSuccess, setNavSuccess] = useState(false);

  useEffect(() => {
    fetchPages();
    fetchNavigation();
  }, []);

  const fetchPages = async () => {
    try {
      setLoadingPages(true);
      const res = await fetch("/api/v1/admin/pages");
      if (res.ok) {
        const json = await res.json();
        setPages(json.data || []);
      }
    } catch (err) {
      console.error("Failed to fetch pages", err);
    } finally {
      setLoadingPages(false);
    }
  };

  const fetchNavigation = async () => {
    try {
      setLoadingNav(true);
      const res = await fetch("/api/v1/admin/navigation");
      if (res.ok) {
        const json = await res.json();
        setHeaderMenu(json.data?.headerMenu || []);
        setFooterGroups(json.data?.footerGroups || []);
      }
    } catch (err) {
      console.error("Failed to fetch navigation", err);
    } finally {
      setLoadingNav(false);
    }
  };

  const openEditor = async (page: PageItem) => {
    setSelectedPage(page);
    setEditorTab("content");
    setEditorError("");
    setSavePageSuccess("");
    setEditingTitle(page.title);
    setEditingSlug(page.slug);

    try {
      const res = await fetch(`/api/v1/admin/pages/${page.slug}`);
      if (res.ok) {
        const json = await res.json();
        setPayload(json.data.payload || {});
        setSeo(json.data.seo || {});
        setRevisions(json.data.revisions || []);
      }
    } catch (err: any) {
      setEditorError(`Failed to load page details: ${err.message}`);
    }
    setEditorOpen(true);
  };

  const handleSavePage = async (publishImmediately: boolean) => {
    if (!selectedPage) return;
    setSavingPage(true);
    setEditorError("");
    setSavePageSuccess("");

    try {
      const res = await fetch(`/api/v1/admin/pages/${selectedPage.slug}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: editingTitle,
          payload,
          seo,
          publishImmediately,
        }),
      });

      const json = await res.json();
      if (!res.ok) {
        setEditorError(json.error?.message || "Failed to save page.");
        return;
      }

      setSavePageSuccess(
        publishImmediately
          ? "Page published live successfully! Public SSR cache updated."
          : "Draft saved safely. Public website remains on previous version."
      );
      await fetchPages();

      // Refresh revisions
      const detailRes = await fetch(`/api/v1/admin/pages/${selectedPage.slug}`);
      if (detailRes.ok) {
        const detailJson = await detailRes.json();
        setRevisions(detailJson.data.revisions || []);
      }
    } catch (err: any) {
      setEditorError(err.message);
    } finally {
      setSavingPage(false);
    }
  };

  const handleTogglePublish = async (page: PageItem) => {
    const newStatus = page.status === "published" ? "draft" : "published";
    try {
      const res = await fetch(`/api/v1/admin/pages/${page.slug}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      const json = await res.json();
      if (!res.ok) {
        toast.error("Status Update Failed", json.error?.message || "Failed to update page status.");
        return;
      }
      await fetchPages();
      toast.success(
        newStatus === "published" ? "Page Published" : "Page Unpublished",
        `Page "${page.title}" status changed to ${newStatus}.`
      );
    } catch (err: any) {
      toast.error("Status Update Error", err.message);
    }
  };

  const handleDuplicatePage = async (page: PageItem) => {
    const suggestedSlug = prompt(`Enter new slug for duplicated page:`, `${page.slug}-copy`);
    if (!suggestedSlug) return;

    try {
      const res = await fetch(`/api/v1/admin/pages/${page.slug}/duplicate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ newSlug: suggestedSlug }),
      });
      const json = await res.json();
      if (!res.ok) {
        toast.error("Duplicate Failed", json.error?.message || "Failed to duplicate page.");
        return;
      }
      await fetchPages();
      toast.success("Page Duplicated", `Page duplicated successfully as /${suggestedSlug}`);
    } catch (err: any) {
      toast.error("Duplicate Error", err.message);
    }
  };

  const handleArchivePage = async (page: PageItem) => {
    if (page.slug === "home") {
      toast.warning("Protected Page", "The homepage cannot be archived as it serves as the root route.");
      return;
    }
    if (!confirm(`Are you sure you want to archive page "${page.title}" (/ ${page.slug})?`)) return;

    try {
      const res = await fetch(`/api/v1/admin/pages/${page.slug}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "archived" }),
      });
      if (res.ok) {
        await fetchPages();
        toast.success("Page Archived", `Page "${page.title}" has been moved to archived state.`);
      } else {
        const json = await res.json();
        toast.error("Archive Failed", json.error?.message || "Failed to archive page.");
      }
    } catch (err: any) {
      toast.error("Archive Error", err.message);
    }
  };

  const handleRestoreRevision = async (revisionId: string) => {
    if (!selectedPage) return;
    if (!confirm("Restore this historical revision as active draft?")) return;

    try {
      const res = await fetch(`/api/v1/admin/pages/${selectedPage.slug}/restore/${revisionId}`, {
        method: "POST",
      });
      const json = await res.json();
      if (!res.ok) {
        toast.error("Restore Failed", json.error?.message || "Failed to restore revision");
        return;
      }
      setPayload(json.data.payload || {});
      setSeo(json.data.seo || {});
      setSavePageSuccess("Historical revision restored to draft.");
      toast.success("Revision Restored", "Historical revision loaded into editor as active draft.");
    } catch (err: any) {
      toast.error("Restore Error", err.message);
    }
  };

  const handleCreatePageSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreatingPage(true);
    try {
      const res = await fetch(`/api/v1/admin/pages/${newSlug}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: newTitle,
          payload: {
            title: newTitle,
            summary: "New page created in Akeezo website management.",
            content: "Draft content",
          },
          seo: {
            title: `${newTitle} | AKEEZO Healthcare`,
            description: "Akeezo Healthcare Discovery Portal",
            canonicalPath: `/${newSlug}`,
            robots: "index,follow",
          },
          publishImmediately: false,
        }),
      });

      const json = await res.json();
      if (!res.ok) {
        toast.error("Create Page Failed", json.error?.message || "Failed to create page");
        return;
      }

      setCreateModalOpen(false);
      setNewTitle("");
      setNewSlug("");
      await fetchPages();
      toast.success("Page Created", `New draft page "/${newSlug}" created successfully.`);
    } catch (err: any) {
      toast.error("Create Page Error", err.message);
    } finally {
      setCreatingPage(false);
    }
  };

  const handleSaveNavigation = async () => {
    setSavingNav(true);
    setNavSuccess(false);
    try {
      const res = await fetch("/api/v1/admin/navigation", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          headerMenu,
          footerGroups,
        }),
      });
      if (res.ok) {
        setNavSuccess(true);
        setTimeout(() => setNavSuccess(false), 3000);
        toast.success("Navigation Saved", "Public website header and footer menus updated.");
      } else {
        const json = await res.json();
        toast.error("Navigation Save Failed", json.error?.message || "Failed to save navigation.");
      }
    } catch (err: any) {
      toast.error("Navigation Error", `Error saving navigation: ${err.message}`);
    } finally {
      setSavingNav(false);
    }
  };

  // Sorting & Filtering State
  const [viewMode, setViewMode] = useState<ViewMode>("table");
  const [sortField, setSortField] = useState<string | null>("title");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");

  const handleSort = (field: string) => {
    const next = getNextSortDirection(sortField, field, sortDirection);
    setSortField(next.field);
    setSortDirection(next.direction);
  };

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, statusFilter, sortField, sortDirection]);

  const filteredPages = useMemo(() => {
    let result = pages.filter((p) => {
      const matchesSearch =
        !searchQuery.trim() ||
        p.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.slug?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.path?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === "all" || p.status === statusFilter;
      return matchesSearch && matchesStatus;
    });

    return sortItems(result, sortField, sortDirection);
  }, [pages, searchQuery, statusFilter, sortField, sortDirection]);

  const activeFiltersCount =
    (searchQuery ? 1 : 0) +
    (statusFilter !== "all" ? 1 : 0) +
    (sortField !== "title" || sortDirection !== "asc" ? 1 : 0);

  const clearAllFilters = () => {
    setSearchQuery("");
    setStatusFilter("all");
    setSortField("title");
    setSortDirection("asc");
  };

  const totalPages = Math.max(1, Math.ceil(filteredPages.length / pageSize));
  const safeCurrentPage = Math.min(Math.max(1, currentPage), totalPages);

  const paginatedPages = useMemo(() => {
    const start = (safeCurrentPage - 1) * pageSize;
    return filteredPages.slice(start, start + pageSize);
  }, [filteredPages, safeCurrentPage, pageSize]);

  return (
    <div className="space-y-6 font-sans">
      {/* 1. Header Banner */}
      <div className="bg-gradient-to-r from-[#061E1B] via-teal-950 to-[#061E1B] rounded-2xl p-6 text-white shadow-md border border-[#00C7BE]/30 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#007A6C]/50 text-[#00C7BE] border border-[#00C7BE]/30">
            <FileText className="w-3.5 h-3.5 text-[#00C7BE]" />
            <span>Website Content & Navigation</span>
          </div>
          <h1 className="text-xl font-black tracking-tight">Public Website Content Management</h1>
          <p className="text-xs text-teal-100/80 max-w-2xl leading-relaxed">
            Manage public discovery pages, hero headings, procedural pricing disclosures, and header/footer navigation. Separate draft states allow safe previewing before committing changes live to SSR.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={() => setCreateModalOpen(true)}
            className="flex items-center gap-1.5 bg-[#FF6B00] hover:bg-[#FF6D1B] active:scale-98 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-md transition"
          >
            <Plus className="w-4 h-4" />
            <span>Create Page</span>
          </button>
        </div>
      </div>

      {/* 2. Sub-Tab Switcher */}
      <div className="flex border-b border-slate-200 gap-2">
        <button
          onClick={() => {
            setActiveSubTab("pages");
            if (typeof window !== "undefined") {
              window.history.pushState(null, "", "/admin/content");
            }
          }}
          className={`px-4 py-3 text-xs font-bold border-b-2 flex items-center gap-2 transition ${
            activeSubTab === "pages"
              ? "border-[#007A6C] text-[#007A6C] bg-[#E6F8F6]/60 rounded-t-xl"
              : "border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-50"
          }`}
        >
          <FileText className="w-4 h-4 text-[#007A6C]" />
          <span>Pages & Content Revisions ({pages.length})</span>
        </button>

        <button
          onClick={() => {
            setActiveSubTab("blog");
            if (typeof window !== "undefined") {
              window.history.pushState(null, "", "/admin/blog");
            }
          }}
          className={`px-4 py-3 text-xs font-bold border-b-2 flex items-center gap-2 transition ${
            activeSubTab === "blog"
              ? "border-[#007A6C] text-[#007A6C] bg-[#E6F8F6]/60 rounded-t-xl"
              : "border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-50"
          }`}
        >
          <BookOpen className="w-4 h-4 text-[#007A6C]" />
          <span>Blog Articles & SEO Optimizer</span>
        </button>

        <button
          onClick={() => {
            setActiveSubTab("navigation");
            if (typeof window !== "undefined") {
              window.history.pushState(null, "", "/admin/content#navigation");
            }
          }}
          className={`px-4 py-3 text-xs font-bold border-b-2 flex items-center gap-2 transition ${
            activeSubTab === "navigation"
              ? "border-[#007A6C] text-[#007A6C] bg-[#E6F8F6]/60 rounded-t-xl"
              : "border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-50"
          }`}
        >
          <Menu className="w-4 h-4 text-[#007A6C]" />
          <span>Public Navigation & Footer Menus</span>
        </button>
      </div>

      {/* SUB-TAB: BLOG ARTICLES & SEO SUITE */}
      {activeSubTab === "blog" && (
        <BlogManagerView initialCreateModal={initialCreateModal} />
      )}

      {/* SUB-TAB 1: PAGES & REVISIONS */}
      {activeSubTab === "pages" && (
        <div className="space-y-4">
          {/* Filters Bar */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search page title, slug, or path..."
                className="w-full text-xs pl-9 pr-8 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-[#007A6C] focus:ring-1 focus:ring-[#00C7BE] focus:outline-none"
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

            <div className="flex items-center gap-2.5 w-full sm:w-auto justify-between sm:justify-end">
              <div className="flex items-center gap-1.5">
                <span className="text-xs text-slate-500 font-semibold whitespace-nowrap">Status:</span>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="text-xs px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none font-medium text-slate-700"
                >
                  <option value="all">All Statuses</option>
                  <option value="published">Published Live</option>
                  <option value="draft">Draft Only</option>
                  <option value="archived">Archived</option>
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

              {/* Layout Toggle */}
              <ViewToggle
                mode={viewMode}
                onChange={setViewMode}
              />
            </div>
          </div>

          {/* Pages View Container */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            {viewMode === "table" ? (
              <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
                  <tr>
                    <SortHeader
                      field="title"
                      label="Page Title & Path"
                      currentSortField={sortField}
                      currentSortDirection={sortDirection}
                      onSort={handleSort}
                    />
                    <SortHeader
                      field="slug"
                      label="Slug"
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
                      field="version"
                      label="Version"
                      currentSortField={sortField}
                      currentSortDirection={sortDirection}
                      onSort={handleSort}
                    />
                    <SortHeader
                      field="updatedAt"
                      label="Last Updated"
                      currentSortField={sortField}
                      currentSortDirection={sortDirection}
                      onSort={handleSort}
                    />
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {loadingPages ? (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-slate-400 font-semibold">
                        Loading published and draft pages...
                      </td>
                    </tr>
                  ) : filteredPages.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-slate-400 font-semibold">
                        No pages match the search query or status filter.
                      </td>
                    </tr>
                  ) : (
                    paginatedPages.map((page) => (
                      <tr key={page.id} className="hover:bg-slate-50/80 transition">
                        <td className="py-3.5 px-4">
                          <div className="font-bold text-slate-900">{page.title}</div>
                          <div className="text-[11px] text-[#007A6C] font-mono">{page.path}</div>
                        </td>
                        <td className="py-3.5 px-4 font-mono text-slate-600">/{page.slug}</td>
                        <td className="py-3.5 px-4">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                              page.status === "published"
                                ? "bg-emerald-100 text-emerald-800"
                                : page.status === "draft"
                                ? "bg-amber-100 text-amber-800"
                                : "bg-slate-200 text-slate-600"
                            }`}
                          >
                            {page.status}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 font-semibold text-slate-700">v{page.version || 1}</td>
                        <td className="py-3.5 px-4 text-slate-500 text-[11px]">
                          {page.updatedAt ? new Date(page.updatedAt).toLocaleDateString() : "Active"}
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <div className="inline-flex items-center gap-1.5">
                            <button
                              onClick={() => openEditor(page)}
                              className="px-2.5 py-1 text-xs font-bold text-white bg-[#007A6C] hover:bg-[#005F54] rounded-lg transition shadow-2xs"
                            >
                              Edit
                            </button>

                            <a
                              href={page.path}
                              target="_blank"
                              rel="noreferrer"
                              className="p-1 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition"
                              title="Preview on live site"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                            </a>

                            <button
                              onClick={() => handleTogglePublish(page)}
                              className={`p-1 rounded-lg transition ${
                                page.status === "published"
                                  ? "text-amber-600 hover:bg-amber-50"
                                  : "text-emerald-600 hover:bg-emerald-50"
                              }`}
                              title={page.status === "published" ? "Unpublish to draft" : "Publish to live site"}
                            >
                              <Globe className="w-3.5 h-3.5" />
                            </button>

                            <button
                              onClick={() => handleDuplicatePage(page)}
                              className="p-1 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition"
                              title="Duplicate page"
                            >
                              <Copy className="w-3.5 h-3.5" />
                            </button>

                            {page.slug !== "home" && (
                              <button
                                onClick={() => handleArchivePage(page)}
                                className="p-1 text-rose-500 hover:bg-rose-50 rounded-lg transition"
                                title="Archive page"
                              >
                                <Archive className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          ) : (
            /* Grid Card View */
            <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {loadingPages ? (
                <div className="col-span-full py-8 text-center text-slate-400 font-semibold">
                  Loading published and draft pages...
                </div>
              ) : filteredPages.length === 0 ? (
                <div className="col-span-full py-8 text-center text-slate-400 font-semibold">
                  No pages match the search query or status filter.
                </div>
              ) : (
                paginatedPages.map((page) => (
                  <div
                    key={page.id}
                    className="p-4 bg-white rounded-xl border border-slate-200 hover:border-[#00C7BE] hover:shadow-md transition-all flex flex-col justify-between space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-bold text-[#007A6C] bg-[#E6F8F6] px-2 py-0.5 rounded border border-[#00C7BE]/30">
                        /{page.slug}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          page.status === "published"
                            ? "bg-emerald-100 text-emerald-800"
                            : page.status === "draft"
                            ? "bg-amber-100 text-amber-800"
                            : "bg-slate-200 text-slate-600"
                        }`}
                      >
                        {page.status}
                      </span>
                    </div>

                    <div>
                      <h3 className="font-bold text-sm text-slate-900">{page.title}</h3>
                      <p className="text-[11px] text-slate-500 font-mono truncate">{page.path}</p>
                    </div>

                    <div className="text-xs text-slate-500 flex items-center justify-between border-t border-slate-100 pt-2.5">
                      <span className="text-[11px] text-slate-400 font-medium">
                        v{page.version || 1} · {page.updatedAt ? new Date(page.updatedAt).toLocaleDateString() : "Active"}
                      </span>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => openEditor(page)}
                          className="px-2.5 py-1 text-xs font-bold text-white bg-[#007A6C] hover:bg-[#005F54] rounded-lg transition"
                        >
                          Edit
                        </button>
                        <a
                          href={page.path}
                          target="_blank"
                          rel="noreferrer"
                          className="p-1 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition"
                          title="Preview on live site"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                        <button
                          onClick={() => handleTogglePublish(page)}
                          className={`p-1 rounded-lg transition ${
                            page.status === "published"
                              ? "text-amber-600 hover:bg-amber-50"
                              : "text-emerald-600 hover:bg-emerald-50"
                          }`}
                          title={page.status === "published" ? "Unpublish to draft" : "Publish to live site"}
                        >
                          <Globe className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDuplicatePage(page)}
                          className="p-1 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition"
                          title="Duplicate page"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* Pagination Controls */}
            <TablePagination
              currentPage={safeCurrentPage}
              totalItems={filteredPages.length}
              pageSize={pageSize}
              onPageChange={setCurrentPage}
              onPageSizeChange={setPageSize}
              pageSizeOptions={[10, 25, 50, 100]}
              itemLabel="pages"
            />
          </div>
        </div>
      )}

      {/* SUB-TAB 2: NAVIGATION & FOOTER MENUS */}
      {activeSubTab === "navigation" && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-200 gap-3">
              <div>
                <h2 className="text-base font-bold text-slate-900">Public Site Header & Footer Links</h2>
                <p className="text-xs text-slate-500">
                  Manage primary navigation destinations and legal footer link groups.
                </p>
              </div>

              <div className="flex items-center gap-3">
                {navSuccess && (
                  <span className="text-xs text-emerald-700 font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Navigation saved!</span>
                  </span>
                )}
                <button
                  onClick={handleSaveNavigation}
                  disabled={savingNav}
                  className="px-4 py-2 text-xs font-bold text-white bg-[#007A6C] hover:bg-[#005F54] rounded-xl shadow-xs transition disabled:opacity-60 flex items-center gap-1.5"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{savingNav ? "Saving..." : "Save & Publish Menus"}</span>
                </button>
              </div>
            </div>

            {/* Header Menu Builder */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Header Navigation Links
                </h3>
                <button
                  onClick={() => {
                    const label = prompt("Menu item label:");
                    if (!label) return;
                    const destination = prompt("Destination (e.g., /#treatments or https://...):", "/#");
                    if (!destination) return;
                    setHeaderMenu([
                      ...headerMenu,
                      {
                        id: `nav-${Date.now()}`,
                        label,
                        destination,
                        isExternal: destination.startsWith("http"),
                        order: headerMenu.length,
                        isVisible: true,
                      },
                    ]);
                  }}
                  className="text-xs text-[#007A6C] hover:underline font-bold flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Link</span>
                </button>
              </div>

              <div className="space-y-2">
                {headerMenu.length === 0 ? (
                  <div className="p-4 border border-dashed border-slate-200 rounded-xl text-center text-xs text-slate-400">
                    No custom header links configured. Default website links will be displayed.
                  </div>
                ) : (
                  headerMenu.map((item, idx) => (
                    <div
                      key={item.id}
                      className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between text-xs"
                    >
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-[10px] text-slate-400">{idx + 1}</span>
                        <input
                          type="text"
                          value={item.label}
                          onChange={(e) => {
                            const updated = [...headerMenu];
                            updated[idx].label = e.target.value;
                            setHeaderMenu(updated);
                          }}
                          className="font-bold text-slate-800 bg-transparent border-b border-transparent hover:border-slate-300 focus:border-[#007A6C] focus:outline-none px-1"
                        />
                        <input
                          type="text"
                          value={item.destination}
                          onChange={(e) => {
                            const updated = [...headerMenu];
                            updated[idx].destination = e.target.value;
                            setHeaderMenu(updated);
                          }}
                          className="font-mono text-slate-500 bg-transparent border-b border-transparent hover:border-slate-300 focus:border-[#007A6C] focus:outline-none px-1"
                        />
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            if (idx === 0) return;
                            const updated = [...headerMenu];
                            const temp = updated[idx - 1];
                            updated[idx - 1] = updated[idx];
                            updated[idx] = temp;
                            setHeaderMenu(updated);
                          }}
                          disabled={idx === 0}
                          className="p-1 text-slate-400 hover:text-slate-700 disabled:opacity-30"
                          title="Move up"
                        >
                          <ChevronUp className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            if (idx === headerMenu.length - 1) return;
                            const updated = [...headerMenu];
                            const temp = updated[idx + 1];
                            updated[idx + 1] = updated[idx];
                            updated[idx] = temp;
                            setHeaderMenu(updated);
                          }}
                          disabled={idx === headerMenu.length - 1}
                          className="p-1 text-slate-400 hover:text-slate-700 disabled:opacity-30"
                          title="Move down"
                        >
                          <ChevronDown className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            setHeaderMenu(headerMenu.filter((_, i) => i !== idx));
                          }}
                          className="p-1 text-rose-500 hover:bg-rose-50 rounded-lg transition"
                          title="Remove link"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Footer Link Groups */}
            <div className="space-y-3 pt-4 border-t border-slate-100">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Footer Link Groups
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                  <div className="font-bold text-xs text-slate-800">Specialty Treatments</div>
                  <ul className="text-xs text-slate-600 space-y-1">
                    <li>• Robotic Oncology (/#treatments)</li>
                    <li>• CAR-T Cell Therapy (/#treatments)</li>
                    <li>• Bone Marrow Transplant (/#treatments)</li>
                    <li>• Liver & Kidney Transplant (/#treatments)</li>
                  </ul>
                </div>

                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                  <div className="font-bold text-xs text-slate-800">Legal & Governance</div>
                  <ul className="text-xs text-slate-600 space-y-1">
                    <li>• Privacy & Protected Health Info (/privacy)</li>
                    <li>• Terms of Coordination (/terms)</li>
                    <li>• Clinical Disclaimer (/disclaimer)</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* PAGE EDITOR MODAL / DRAWER */}
      {editorOpen && selectedPage && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div
            className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150 font-sans"
            role="dialog"
            aria-modal="true"
          >
            {/* Editor Header */}
            <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-900 text-sm">
                    Editing: {editingTitle || selectedPage.title}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                      selectedPage.status === "published"
                        ? "bg-emerald-100 text-emerald-800"
                        : "bg-amber-100 text-amber-800"
                    }`}
                  >
                    {selectedPage.status}
                  </span>
                </div>
                <span className="font-mono text-xs text-slate-400">Path: /{selectedPage.slug}</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleSavePage(false)}
                  disabled={savingPage}
                  className="px-3 py-1.5 text-xs font-bold text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded-xl transition shadow-2xs"
                >
                  Save Draft
                </button>
                <button
                  type="button"
                  onClick={() => handleSavePage(true)}
                  disabled={savingPage}
                  className="px-3.5 py-1.5 text-xs font-bold text-white bg-[#007A6C] hover:bg-[#005F54] rounded-xl transition shadow-xs"
                >
                  Publish Live
                </button>
                <button
                  type="button"
                  onClick={() => setEditorOpen(false)}
                  className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg ml-2"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Notifications inside Editor */}
            {savePageSuccess && (
              <div className="mx-6 mt-4 p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{savePageSuccess}</span>
              </div>
            )}
            {editorError && (
              <div className="mx-6 mt-4 p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{editorError}</span>
              </div>
            )}

            {/* Editor Sub-Tabs */}
            <div className="flex border-b border-slate-200 px-6 pt-2 bg-white gap-3">
              <button
                onClick={() => setEditorTab("content")}
                className={`pb-2.5 text-xs font-bold border-b-2 flex items-center gap-1.5 transition ${
                  editorTab === "content"
                    ? "border-[#007A6C] text-[#007A6C]"
                    : "border-transparent text-slate-400 hover:text-slate-700"
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Structured Content Fields</span>
              </button>
              <button
                onClick={() => setEditorTab("seo")}
                className={`pb-2.5 text-xs font-bold border-b-2 flex items-center gap-1.5 transition ${
                  editorTab === "seo"
                    ? "border-[#007A6C] text-[#007A6C]"
                    : "border-transparent text-slate-400 hover:text-slate-700"
                }`}
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>Technical SEO & Robots</span>
              </button>
              <button
                onClick={() => setEditorTab("revisions")}
                className={`pb-2.5 text-xs font-bold border-b-2 flex items-center gap-1.5 transition ${
                  editorTab === "revisions"
                    ? "border-[#007A6C] text-[#007A6C]"
                    : "border-transparent text-slate-400 hover:text-slate-700"
                }`}
              >
                <History className="w-3.5 h-3.5" />
                <span>Revision History ({revisions.length})</span>
              </button>
            </div>

            {/* Editor Body */}
            <div className="p-6 overflow-y-auto space-y-4 flex-1">
              {/* TAB 1: Structured Content Fields */}
              {editorTab === "content" && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Internal Page Title
                    </label>
                    <input
                      type="text"
                      value={editingTitle}
                      onChange={(e) => setEditingTitle(e.target.value)}
                      className="w-full text-xs px-3 py-2 rounded-xl border border-slate-300 focus:border-[#007A6C] focus:ring-1 focus:ring-[#00C7BE] focus:outline-none"
                    />
                  </div>

                  {selectedPage.slug === "home" ? (
                    <div className="space-y-3">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Hero Heading (H1)
                        </label>
                        <input
                          type="text"
                          value={payload.headline || ""}
                          onChange={(e) => setPayload({ ...payload, headline: e.target.value })}
                          className="w-full text-xs px-3 py-2 rounded-xl border border-slate-300 focus:border-[#007A6C] focus:ring-1 focus:ring-[#00C7BE] focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Hero Subtitle & Accreditation Tag
                        </label>
                        <textarea
                          rows={2}
                          value={payload.subheadline || ""}
                          onChange={(e) => setPayload({ ...payload, subheadline: e.target.value })}
                          className="w-full text-xs px-3 py-2 rounded-xl border border-slate-300 focus:border-[#007A6C] focus:ring-1 focus:ring-[#00C7BE] focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Search Bar Placeholder
                        </label>
                        <input
                          type="text"
                          value={payload.searchPlaceholder || ""}
                          onChange={(e) => setPayload({ ...payload, searchPlaceholder: e.target.value })}
                          className="w-full text-xs px-3 py-2 rounded-xl border border-slate-300 focus:border-[#007A6C] focus:ring-1 focus:ring-[#00C7BE] focus:outline-none"
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Section Summary / Policy Notice
                        </label>
                        <textarea
                          rows={4}
                          value={payload.summary || ""}
                          onChange={(e) => setPayload({ ...payload, summary: e.target.value })}
                          className="w-full text-xs px-3 py-2 rounded-xl border border-slate-300 focus:border-[#007A6C] focus:ring-1 focus:ring-[#00C7BE] focus:outline-none"
                        />
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* TAB 2: SEO Settings */}
              {editorTab === "seo" && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Meta SEO Title
                    </label>
                    <input
                      type="text"
                      value={seo.title || ""}
                      onChange={(e) => setSeo({ ...seo, title: e.target.value })}
                      className="w-full text-xs px-3 py-2 rounded-xl border border-slate-300 focus:border-[#007A6C] focus:ring-1 focus:ring-[#00C7BE] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Meta Description
                    </label>
                    <textarea
                      rows={2}
                      value={seo.description || ""}
                      onChange={(e) => setSeo({ ...seo, description: e.target.value })}
                      className="w-full text-xs px-3 py-2 rounded-xl border border-slate-300 focus:border-[#007A6C] focus:ring-1 focus:ring-[#00C7BE] focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Canonical URL Path
                      </label>
                      <input
                        type="text"
                        value={seo.canonicalPath || `/${selectedPage.slug}`}
                        onChange={(e) => setSeo({ ...seo, canonicalPath: e.target.value })}
                        className="w-full text-xs px-3 py-2 rounded-xl border border-slate-300 focus:border-[#007A6C] focus:ring-1 focus:ring-[#00C7BE] focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Robots Directives
                      </label>
                      <select
                        value={seo.robots || "index,follow"}
                        onChange={(e) => setSeo({ ...seo, robots: e.target.value })}
                        className="w-full text-xs px-3 py-2 rounded-xl border border-slate-300 focus:border-[#007A6C] focus:ring-1 focus:ring-[#00C7BE] focus:outline-none"
                      >
                        <option value="index,follow">index, follow (Public Search)</option>
                        <option value="noindex,nofollow">noindex, nofollow (Private Draft)</option>
                        <option value="noindex,follow">noindex, follow</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: Historical Revisions */}
              {editorTab === "revisions" && (
                <div className="space-y-3">
                  {revisions.length === 0 ? (
                    <div className="py-8 text-center text-slate-400 text-xs">
                      No previous revisions found for this page.
                    </div>
                  ) : (
                    revisions.map((rev) => (
                      <div
                        key={rev._id}
                        className="p-3 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between text-xs"
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-slate-900">Revision #{rev.version}</span>
                            <span
                              className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase ${
                                rev.status === "published"
                                  ? "bg-emerald-100 text-emerald-800"
                                  : "bg-slate-200 text-slate-600"
                              }`}
                            >
                              {rev.status}
                            </span>
                          </div>
                          <div className="text-[10px] text-slate-500">
                            By {rev.authorId?.name || "Administrator"} •{" "}
                            {new Date(rev.createdAt).toLocaleString()}
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleRestoreRevision(rev._id)}
                          className="px-3 py-1.5 text-xs font-bold text-[#007A6C] hover:bg-[#E6F8F6] border border-[#007A6C]/30 rounded-lg transition flex items-center gap-1"
                        >
                          <RotateCcw className="w-3 h-3" />
                          <span>Restore</span>
                        </button>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* CREATE NEW PAGE MODAL */}
      {createModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-md p-6 space-y-4">
            <h3 className="text-sm font-bold text-slate-900">Create New Website Page</h3>
            <form onSubmit={handleCreatePageSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Page Title</label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => {
                    setNewTitle(e.target.value);
                    if (!newSlug) {
                      setNewSlug(
                        e.target.value
                          .toLowerCase()
                          .replace(/[^a-z0-9]+/g, "-")
                          .replace(/(^-|-$)/g, "")
                      );
                    }
                  }}
                  required
                  placeholder="e.g. Robotic Knee Surgery"
                  className="w-full text-xs px-3 py-2 rounded-xl border border-slate-300 focus:border-[#007A6C] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">URL Slug</label>
                <div className="flex items-center">
                  <span className="text-xs text-slate-400 bg-slate-100 px-3 py-2 border border-r-0 border-slate-300 rounded-l-xl font-mono">
                    /
                  </span>
                  <input
                    type="text"
                    value={newSlug}
                    onChange={(e) => setNewSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""))}
                    required
                    placeholder="robotic-knee-surgery"
                    className="w-full text-xs px-3 py-2 rounded-r-xl border border-slate-300 focus:border-[#007A6C] focus:outline-none font-mono"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setCreateModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <DisabledGuideButton
                  type="submit"
                  disabled={creatingPage || !newTitle.trim() || !newSlug.trim()}
                  guideTitle="Cannot Create Draft Page"
                  guideReason="A unique alphanumeric URL slug and page title are required before registering a new CMS page in MongoDB."
                  prerequisites={[
                    { label: "Page title provided", fulfilled: !!newTitle.trim() },
                    { label: "URL slug defined (e.g. robotic-surgery)", fulfilled: !!newSlug.trim() },
                  ]}
                  actionSteps={[
                    "Enter a descriptive title for the webpage.",
                    "Define a clean lowercase hyphenated URL slug.",
                  ]}
                  className="px-4 py-2 text-xs font-bold text-white bg-[#FF6B00] hover:bg-[#FF6D1B] rounded-xl shadow-xs"
                >
                  {creatingPage ? "Creating..." : "Create Draft Page"}
                </DisabledGuideButton>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
