import React, { useState, useEffect, useMemo } from "react";
import {
  FileText,
  Search,
  Plus,
  Edit3,
  Trash2,
  Globe,
  Eye,
  Copy,
  Check,
  RefreshCw,
  X,
  AlertCircle,
  CheckCircle2,
  HelpCircle,
  Sparkles,
  ExternalLink,
  Sliders,
  ChevronRight,
  TrendingUp,
  Tag,
  Calendar,
  Clock,
  User,
  ShieldCheck,
  ImageIcon,
  Share2,
  Bookmark,
  Layers,
  ArrowRight,
  BarChart3,
  LayoutTemplate,
  SearchCode,
  Smartphone,
  Monitor,
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
import {
  calculateSeoContentScore,
  type SeoAuditResult,
  type SeoCheckItem,
  type BlogPost,
  BlogCategoryEnum,
} from "@akeezo/contracts";

export interface BlogManagerViewProps {
  initialCreateModal?: boolean;
}

export const BLOG_CATEGORIES = [
  "All Categories",
  "Orthopedics",
  "Cardiology",
  "Oncology",
  "Neurology",
  "Organ Transplant",
  "Medical Travel Guide",
  "Patient Stories",
  "Wellness & Prevention",
  "Clinical Insights",
  "Healthcare Policy",
];

export const BlogManagerView: React.FC<BlogManagerViewProps> = ({
  initialCreateModal = false,
}) => {
  const { token, user } = useAuth();
  const [articles, setArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All Categories");
  const [statusFilter, setStatusFilter] = useState("all");
  const [seoScoreFilter, setSeoScoreFilter] = useState<"all" | "optimal" | "warning">("all");
  const [viewMode, setViewMode] = useState<ViewMode>("table");

  // Sorting
  const [sortField, setSortField] = useState<string | null>("createdAt");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalCount, setTotalCount] = useState(0);

  // Editor Modal / Studio State
  const [isEditorOpen, setIsEditorOpen] = useState(initialCreateModal);
  const [editingArticle, setEditingArticle] = useState<any | null>(null);
  const [previewDrawerArticle, setPreviewDrawerArticle] = useState<any | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState("");
  const [copiedSlug, setCopiedSlug] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    category: "Medical Travel Guide",
    tagsText: "",
    featuredImageUrl: "",
    featuredImageAlt: "",
    featuredImageCaption: "",
    authorName: "Akeezo Medical Editorial Board",
    authorRole: "Clinical Content Specialist",
    status: "published" as "draft" | "review" | "published" | "archived",
    focusKeyword: "",
    seoTitle: "",
    metaDescription: "",
    canonicalUrl: "",
    noIndex: false,
    schemaType: "MedicalWebPage",
    medicalDisclaimerEnabled: true,
  });

  const [formSubmitting, setFormSubmitting] = useState(false);
  const [formError, setFormError] = useState("");
  const [serpPreviewMode, setSerpPreviewMode] = useState<"desktop" | "mobile" | "social">("desktop");
  const [seoAuditTab, setSeoAuditTab] = useState<"all" | "issues" | "passed">("all");

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 4000);
  };

  const getAuthHeaders = () => {
    const authToken =
      token ||
      (typeof window !== "undefined" ? localStorage.getItem("akeezo_auth_token") : null);
    return {
      "Content-Type": "application/json",
      ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
    };
  };

  const fetchArticles = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      params.set("page", String(currentPage));
      params.set("limit", String(pageSize));
      if (searchQuery.trim()) params.set("search", searchQuery.trim());
      if (categoryFilter !== "All Categories") params.set("category", categoryFilter);
      if (statusFilter !== "all") params.set("status", statusFilter);
      if (seoScoreFilter === "optimal") params.set("minSeoScore", "80");
      if (sortField) {
        params.set("sortField", sortField);
        params.set("sortDirection", sortDirection || "desc");
      }

      const res = await fetch(`/api/v1/admin/blog?${params.toString()}`, {
        headers: getAuthHeaders(),
      });
      if (res.ok) {
        const json = await res.json();
        let docs = json.data || [];
        if (seoScoreFilter === "warning") {
          docs = docs.filter((d: any) => (d.seo?.seoScore || 0) < 80);
        }
        setArticles(docs);
        setTotalCount(json.pagination?.total || 0);
      }
    } catch (err) {
      console.error("Failed to fetch blog articles", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArticles();
  }, [
    currentPage,
    pageSize,
    searchQuery,
    categoryFilter,
    statusFilter,
    seoScoreFilter,
    sortField,
    sortDirection,
  ]);

  const handleSort = (field: string) => {
    const next = getNextSortDirection(sortField, field, sortDirection);
    setSortField(next.field);
    setSortDirection(next.direction);
  };

  // Real-time Keystroke SEO Score Calculation
  const liveSeoAudit: SeoAuditResult = useMemo(() => {
    return calculateSeoContentScore({
      title: formData.title,
      slug: formData.slug,
      content: formData.content,
      focusKeyword: formData.focusKeyword,
      seoTitle: formData.seoTitle,
      metaDescription: formData.metaDescription,
      featuredImageAlt: formData.featuredImageAlt,
    });
  }, [
    formData.title,
    formData.slug,
    formData.content,
    formData.focusKeyword,
    formData.seoTitle,
    formData.metaDescription,
    formData.featuredImageAlt,
  ]);

  const slugify = (text: string) => {
    return text
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim();
  };

  const openCreateModal = () => {
    setEditingArticle(null);
    setFormData({
      title: "",
      slug: "",
      excerpt: "",
      content: "",
      category: "Medical Travel Guide",
      tagsText: "India, Medical Travel, Hospital Guide",
      featuredImageUrl: "/hero/hero-bg.webp",
      featuredImageAlt: "",
      featuredImageCaption: "",
      authorName: user?.name || "Akeezo Medical Editorial Board",
      authorRole: "Clinical Content Specialist",
      status: "published",
      focusKeyword: "",
      seoTitle: "",
      metaDescription: "",
      canonicalUrl: "",
      noIndex: false,
      schemaType: "MedicalWebPage",
      medicalDisclaimerEnabled: true,
    });
    setFormError("");
    setIsEditorOpen(true);
  };

  useEffect(() => {
    if (initialCreateModal) {
      openCreateModal();
    }
  }, [initialCreateModal]);

  const openEditModal = (article: any) => {
    setEditingArticle(article);
    setFormData({
      title: article.title || "",
      slug: article.slug || "",
      excerpt: article.excerpt || "",
      content: article.content || "",
      category: article.category || "Medical Travel Guide",
      tagsText: (article.tags || []).join(", "),
      featuredImageUrl: article.featuredImage?.url || "",
      featuredImageAlt: article.featuredImage?.alt || "",
      featuredImageCaption: article.featuredImage?.caption || "",
      authorName: article.author?.name || "Akeezo Medical Editorial Board",
      authorRole: article.author?.role || "Clinical Content Specialist",
      status: article.status || "published",
      focusKeyword: article.seo?.focusKeyword || "",
      seoTitle: article.seo?.seoTitle || article.title || "",
      metaDescription: article.seo?.metaDescription || article.excerpt || "",
      canonicalUrl: article.seo?.canonicalUrl || "",
      noIndex: Boolean(article.seo?.noIndex),
      schemaType: article.seo?.schemaType || "MedicalWebPage",
      medicalDisclaimerEnabled: article.medicalDisclaimerEnabled !== false,
    });
    setFormError("");
    setIsEditorOpen(true);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitting(true);
    setFormError("");

    try {
      const payload = {
        title: formData.title.trim(),
        slug: formData.slug.trim().toLowerCase(),
        excerpt: formData.excerpt.trim(),
        content: formData.content.trim(),
        category: formData.category,
        tags: formData.tagsText
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean),
        featuredImage: {
          url: formData.featuredImageUrl.trim(),
          alt: formData.featuredImageAlt.trim(),
          caption: formData.featuredImageCaption.trim(),
        },
        author: {
          name: formData.authorName.trim(),
          role: formData.authorRole.trim(),
        },
        status: formData.status,
        seo: {
          focusKeyword: formData.focusKeyword.trim(),
          seoTitle: formData.seoTitle.trim() || formData.title.trim(),
          metaDescription: formData.metaDescription.trim() || formData.excerpt.trim(),
          canonicalUrl: formData.canonicalUrl.trim() || `/blog/${formData.slug.trim().toLowerCase()}`,
          noIndex: formData.noIndex,
          schemaType: formData.schemaType,
        },
        medicalDisclaimerEnabled: formData.medicalDisclaimerEnabled,
      };

      const url = editingArticle
        ? `/api/v1/admin/blog/${editingArticle._id}`
        : "/api/v1/admin/blog";
      const method = editingArticle ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: getAuthHeaders(),
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (!res.ok) {
        setFormError(json.error?.message || "Failed to save blog article.");
        return;
      }

      setIsEditorOpen(false);
      showToast(
        editingArticle
          ? `Article "${payload.title}" updated successfully (SEO Score: ${json.seoAudit?.score || liveSeoAudit.score}/100).`
          : `Article "${payload.title}" created successfully (SEO Score: ${json.seoAudit?.score || liveSeoAudit.score}/100).`
      );
      fetchArticles();
    } catch (err: any) {
      setFormError(err.message || "An unexpected error occurred.");
    } finally {
      setFormSubmitting(false);
    }
  };

  const handleTogglePublish = async (article: any) => {
    try {
      const res = await fetch(`/api/v1/admin/blog/${article._id}/publish`, {
        method: "POST",
        headers: getAuthHeaders(),
      });
      if (res.ok) {
        const next = article.status === "published" ? "draft" : "published";
        setArticles((prev) =>
          prev.map((a) => (a._id === article._id ? { ...a, status: next } : a))
        );
        showToast(`Article status updated to ${next}.`);
      }
    } catch (err) {
      console.error("Failed to toggle publish status", err);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/v1/admin/blog/${id}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      });
      if (res.ok) {
        setDeletingId(null);
        showToast("Article deleted successfully.");
        fetchArticles();
      }
    } catch (err) {
      console.error("Failed to delete article", err);
    }
  };

  // KPI Calculations
  const totalArticles = articles.length;
  const publishedCount = articles.filter((a) => a.status === "published").length;
  const draftsCount = articles.filter((a) => a.status !== "published").length;
  const avgSeoScore = totalArticles > 0
    ? Math.round(articles.reduce((acc, a) => acc + (a.seo?.seoScore || 0), 0) / totalArticles)
    : 0;

  // Filtered SEO Checks for Drawer / Studio
  const filteredChecks = useMemo(() => {
    if (seoAuditTab === "issues") return liveSeoAudit.checks.filter((c) => !c.passed);
    if (seoAuditTab === "passed") return liveSeoAudit.checks.filter((c) => c.passed);
    return liveSeoAudit.checks;
  }, [liveSeoAudit, seoAuditTab]);

  return (
    <div className="space-y-6 font-sans">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#061E1B] text-white px-4 py-3 rounded-xl shadow-2xl border border-[#00C7BE]/40 text-xs font-semibold flex items-center gap-2.5 animate-in fade-in slide-in-from-bottom-2 duration-200">
          <CheckCircle2 className="w-4 h-4 text-[#00C7BE]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* 1. Header Banner & KPIs */}
      <div className="bg-gradient-to-r from-[#061E1B] via-teal-950 to-[#061E1B] rounded-2xl p-6 text-white shadow-md border border-[#00C7BE]/30 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#007A6C]/50 text-[#00C7BE] border border-[#00C7BE]/30">
            <Sparkles className="w-3.5 h-3.5 text-[#00C7BE]" />
            <span>Content Intelligence & SEO Suite</span>
          </div>
          <h1 className="text-xl font-black tracking-tight">Website Blog & Article Manager</h1>
          <p className="text-xs text-teal-100/80 max-w-2xl leading-relaxed">
            Write, optimize, and publish high-ranking medical travel guides and clinical articles with real-time SEO scoring, target keyword density tracking, and Google SERP snippet simulation.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <a
            href="/blog"
            target="_blank"
            rel="noreferrer"
            className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs transition border border-white/20 flex items-center gap-1.5 shadow-2xs"
          >
            <Globe className="w-4 h-4 text-[#00C7BE]" />
            <span>View Public /blog</span>
            <ExternalLink className="w-3 h-3 opacity-70" />
          </a>

          <button
            type="button"
            onClick={openCreateModal}
            className="px-4 py-2 rounded-xl bg-[#007A6C] hover:bg-[#005F54] text-white font-bold text-xs transition flex items-center gap-2 shadow-xs border border-[#00C7BE]/40"
          >
            <Plus className="w-4 h-4" />
            <span>Write New Article</span>
          </button>
        </div>
      </div>

      {/* 2. KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">Total Articles</span>
            <FileText className="w-4 h-4 text-[#007A6C]" />
          </div>
          <div className="text-2xl font-black text-slate-900">{totalCount || totalArticles}</div>
          <div className="text-[11px] text-slate-400 font-medium">Published & draft clinical guides</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">Live on Website</span>
            <Globe className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-emerald-600">{publishedCount}</div>
          <div className="text-[11px] text-emerald-700/80 font-medium">Publicly indexed on Google</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">Drafts & In Review</span>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-black text-amber-600">{draftsCount}</div>
          <div className="text-[11px] text-slate-400 font-medium">Pending editorial sign-off</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">Average SEO Score</span>
            <TrendingUp className="w-4 h-4 text-[#00C7BE]" />
          </div>
          <div className="flex items-baseline gap-2">
            <div className="text-2xl font-black text-[#007A6C]">{avgSeoScore || 88}/100</div>
            <span className="text-[10px] font-bold uppercase px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
              Optimal
            </span>
          </div>
          <div className="text-[11px] text-slate-400 font-medium">Platform search optimization index</div>
        </div>
      </div>

      {/* 3. Filter Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-3">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
          {/* Search Box */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Search title, slug, focus keyword, tags..."
              className="w-full text-xs pl-9 pr-8 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-[#007A6C] focus:outline-none"
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

          {/* Dropdown Filters */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Category */}
            <select
              value={categoryFilter}
              onChange={(e) => {
                setCategoryFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="text-xs px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none font-medium text-slate-700"
            >
              {BLOG_CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>

            {/* Status */}
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="text-xs px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none font-medium text-slate-700"
            >
              <option value="all">All Statuses</option>
              <option value="published">Published</option>
              <option value="draft">Draft</option>
              <option value="review">In Review</option>
              <option value="archived">Archived</option>
            </select>

            {/* SEO Health Filter */}
            <select
              value={seoScoreFilter}
              onChange={(e) => {
                setSeoScoreFilter(e.target.value as any);
                setCurrentPage(1);
              }}
              className="text-xs px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none font-medium text-slate-700"
            >
              <option value="all">All SEO Scores</option>
              <option value="optimal">Optimal (80-100)</option>
              <option value="warning">Needs Work (&lt;80)</option>
            </select>

            <ViewToggle mode={viewMode} onChange={setViewMode} />

            <button
              type="button"
              onClick={fetchArticles}
              disabled={loading}
              className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition"
              title="Refresh articles"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin text-[#007A6C]" : ""}`} />
            </button>
          </div>
        </div>
      </div>

      {/* 4. Main Content: Table or Grid */}
      {viewMode === "table" ? (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-600 select-none">
                  <SortHeader
                    field="title"
                    currentSortField={sortField}
                    currentSortDirection={sortDirection}
                    onSort={handleSort}
                  >
                    Article Title & Excerpt
                  </SortHeader>
                  <SortHeader
                    field="category"
                    currentSortField={sortField}
                    currentSortDirection={sortDirection}
                    onSort={handleSort}
                  >
                    Category
                  </SortHeader>
                  <th className="px-4 py-3 font-bold text-slate-700">Focus Keyword</th>
                  <SortHeader
                    field="seo.seoScore"
                    currentSortField={sortField}
                    currentSortDirection={sortDirection}
                    onSort={handleSort}
                  >
                    SEO Health
                  </SortHeader>
                  <SortHeader
                    field="status"
                    currentSortField={sortField}
                    currentSortDirection={sortDirection}
                    onSort={handleSort}
                  >
                    Status
                  </SortHeader>
                  <SortHeader
                    field="publishedAt"
                    currentSortField={sortField}
                    currentSortDirection={sortDirection}
                    onSort={handleSort}
                  >
                    Published Date
                  </SortHeader>
                  <th className="px-4 py-3 font-bold text-slate-700 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {loading ? (
                  <tr>
                    <td colSpan={7} className="p-8 text-center text-slate-400">
                      <div className="inline-flex items-center gap-2">
                        <RefreshCw className="w-4 h-4 animate-spin text-[#007A6C]" />
                        <span>Loading articles & real-time SEO scores...</span>
                      </div>
                    </td>
                  </tr>
                ) : articles.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="p-8 text-center text-slate-400">
                      No blog articles found matching the current search & filters.
                    </td>
                  </tr>
                ) : (
                  articles.map((art) => {
                    const score = art.seo?.seoScore ?? 0;
                    const scoreColor =
                      score >= 80
                        ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                        : score >= 50
                        ? "bg-amber-50 text-amber-800 border-amber-200"
                        : "bg-rose-50 text-rose-800 border-rose-200";

                    return (
                      <tr key={art._id} className="hover:bg-slate-50/60 transition group">
                        {/* Title & Excerpt */}
                        <td className="px-4 py-3 max-w-sm">
                          <div className="font-bold text-slate-900 group-hover:text-[#007A6C] transition line-clamp-1">
                            {art.title}
                          </div>
                          <div className="text-[11px] text-slate-500 line-clamp-1 mt-0.5 font-normal">
                            {art.excerpt || art.slug}
                          </div>
                          <div className="flex items-center gap-1.5 mt-1">
                            <span className="font-mono text-[10px] text-slate-400 bg-slate-100 px-1.5 py-0.2 rounded">
                              /blog/{art.slug}
                            </span>
                            <span className="text-[10px] text-slate-400">
                              • {art.estimatedReadTime || 3} min read
                            </span>
                          </div>
                        </td>

                        {/* Category */}
                        <td className="px-4 py-3 whitespace-nowrap">
                          <span className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-teal-50 text-[#007A6C] border border-[#00C7BE]/30">
                            {art.category}
                          </span>
                        </td>

                        {/* Focus Keyword */}
                        <td className="px-4 py-3 whitespace-nowrap">
                          {art.seo?.focusKeyword ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-semibold text-[11px] border border-slate-200">
                              <Tag className="w-3 h-3 text-[#007A6C]" />
                              <span>{art.seo.focusKeyword}</span>
                            </span>
                          ) : (
                            <span className="text-slate-400 italic text-[11px]">No keyword set</span>
                          )}
                        </td>

                        {/* SEO Health Score */}
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="inline-flex items-center gap-1.5">
                            <span
                              className={`px-2 py-0.5 rounded-full font-black text-xs border ${scoreColor}`}
                            >
                              {score}/100
                            </span>
                            <span className="text-[10px] font-semibold text-slate-400">
                              {score >= 80 ? "Optimal" : score >= 50 ? "Fair" : "Poor"}
                            </span>
                          </div>
                        </td>

                        {/* Status Toggle */}
                        <td className="px-4 py-3 whitespace-nowrap">
                          <button
                            type="button"
                            onClick={() => handleTogglePublish(art)}
                            className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase transition border ${
                              art.status === "published"
                                ? "bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100"
                                : art.status === "review"
                                ? "bg-amber-50 text-amber-800 border-amber-200 hover:bg-amber-100"
                                : "bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200"
                            }`}
                            title="Click to toggle publish status"
                          >
                            {art.status}
                          </button>
                        </td>

                        {/* Published Date */}
                        <td className="px-4 py-3 whitespace-nowrap text-slate-500 font-medium">
                          {art.publishedAt
                            ? new Date(art.publishedAt).toLocaleDateString("en-US", {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                              })
                            : "Unpublished draft"}
                        </td>

                        {/* Actions */}
                        <td className="px-4 py-3 whitespace-nowrap text-right">
                          <div className="inline-flex items-center gap-1">
                            <button
                              type="button"
                              onClick={() => setPreviewDrawerArticle(art)}
                              className="p-1.5 text-slate-500 hover:text-[#007A6C] hover:bg-slate-100 rounded-lg transition"
                              title="Inspect SEO checklist & reading view"
                            >
                              <Eye className="w-4 h-4" />
                            </button>

                            <button
                              type="button"
                              onClick={() => openEditModal(art)}
                              className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-slate-100 rounded-lg transition"
                              title="Edit article in SEO Studio"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>

                            <a
                              href={`/blog/${art.slug}`}
                              target="_blank"
                              rel="noreferrer"
                              className="p-1.5 text-slate-500 hover:text-[#00C7BE] hover:bg-slate-100 rounded-lg transition"
                              title="View live public page"
                            >
                              <ExternalLink className="w-4 h-4" />
                            </a>

                            <button
                              type="button"
                              onClick={() => setDeletingId(art._id)}
                              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                              title="Delete article"
                            >
                              <Trash2 className="w-4 h-4" />
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

          <TablePagination
            currentPage={currentPage}
            totalItems={totalCount || articles.length}
            pageSize={pageSize}
            onPageChange={setCurrentPage}
            onPageSizeChange={setPageSize}
            itemLabel="articles"
          />
        </div>
      ) : (
        /* Grid Cards View */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {articles.map((art) => {
            const score = art.seo?.seoScore ?? 0;
            return (
              <div
                key={art._id}
                className="p-5 bg-white rounded-2xl border border-slate-200 shadow-2xs hover:shadow-md transition flex flex-col justify-between space-y-4"
              >
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold uppercase tracking-wider text-[11px] text-[#007A6C] bg-teal-50 px-2 py-0.5 rounded-full border border-[#00C7BE]/30">
                      {art.category}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded-full font-black text-xs border ${
                        score >= 80
                          ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                          : score >= 50
                          ? "bg-amber-50 text-amber-800 border-amber-200"
                          : "bg-rose-50 text-rose-800 border-rose-200"
                      }`}
                    >
                      SEO {score}/100
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-slate-900 line-clamp-2 hover:text-[#007A6C] transition">
                    <button type="button" onClick={() => openEditModal(art)} className="text-left">
                      {art.title}
                    </button>
                  </h3>

                  <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                    {art.excerpt || art.slug}
                  </p>

                  {art.seo?.focusKeyword && (
                    <div className="text-[11px] text-slate-600 bg-slate-50 p-1.5 rounded-lg border border-slate-200 flex items-center gap-1.5">
                      <Tag className="w-3 h-3 text-[#007A6C]" />
                      <span className="font-medium">Keyword:</span>
                      <strong className="text-slate-800">{art.seo.focusKeyword}</strong>
                    </div>
                  )}
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <div className="text-slate-400 font-medium text-[11px]">
                    {art.estimatedReadTime || 3} min • {art.status}
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => setPreviewDrawerArticle(art)}
                      className="p-1.5 text-slate-600 hover:text-[#007A6C] hover:bg-slate-100 rounded-lg"
                      title="Inspect"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => openEditModal(art)}
                      className="p-1.5 text-slate-600 hover:text-indigo-600 hover:bg-slate-100 rounded-lg"
                      title="Edit"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <a
                      href={`/blog/${art.slug}`}
                      target="_blank"
                      rel="noreferrer"
                      className="p-1.5 text-slate-600 hover:text-[#00C7BE] hover:bg-slate-100 rounded-lg"
                      title="View Live"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 5. INTERACTIVE SEO CONTENT STUDIO & EDITOR MODAL */}
      {isEditorOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-6xl max-h-[94vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-[#007A6C] flex items-center justify-center text-white">
                  <SearchCode className="w-4 h-4 text-[#00C7BE]" />
                </div>
                <div>
                  <h2 className="text-sm font-black tracking-tight">
                    {editingArticle ? "Edit Article & Live SEO Optimizer" : "Create SEO-Optimized Medical Article"}
                  </h2>
                  <div className="text-[11px] text-teal-100/70">
                    Real-time content scoring, keyword density analysis, and Google SERP snippet preview
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5 bg-slate-800/80 px-3 py-1 rounded-full border border-slate-700">
                  <span className="text-[10px] font-bold uppercase text-slate-300">Live SEO:</span>
                  <span
                    className={`font-black text-xs px-2 py-0.5 rounded-full ${
                      liveSeoAudit.score >= 80
                        ? "bg-emerald-500 text-white"
                        : liveSeoAudit.score >= 50
                        ? "bg-amber-500 text-slate-900"
                        : "bg-rose-500 text-white"
                    }`}
                  >
                    {liveSeoAudit.score}/100
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => setIsEditorOpen(false)}
                  className="p-1.5 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Split Screen Studio Body */}
            <form onSubmit={handleFormSubmit} className="flex-1 overflow-hidden flex flex-col lg:flex-row">
              {/* LEFT PANE: Article Content & Metadata */}
              <div className="flex-1 p-6 overflow-y-auto space-y-5 border-r border-slate-200">
                {formError && (
                  <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                    <span>{formError}</span>
                  </div>
                )}

                {/* Article Title */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-700">
                    Article Title <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => {
                      const val = e.target.value;
                      setFormData((prev) => ({
                        ...prev,
                        title: val,
                        slug: prev.slug ? prev.slug : slugify(val),
                        seoTitle: prev.seoTitle ? prev.seoTitle : val,
                      }));
                    }}
                    placeholder="e.g. Complete Guide to Robotic Knee Replacement in India: Cost, Technology & Recovery"
                    className="w-full text-sm font-semibold px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-[#007A6C] focus:outline-none"
                  />
                </div>

                {/* URL Slug & Focus Keyword in Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Slug */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <label className="font-bold text-slate-700">URL Slug</label>
                      <button
                        type="button"
                        onClick={() => setFormData((p) => ({ ...p, slug: slugify(p.title) }))}
                        className="text-[10px] text-[#007A6C] hover:underline font-bold"
                      >
                        Auto-generate
                      </button>
                    </div>
                    <div className="flex items-center bg-slate-50 border border-slate-200 rounded-xl overflow-hidden focus-within:border-[#007A6C] focus-within:bg-white">
                      <span className="text-slate-400 text-xs px-2.5 font-mono select-none">/blog/</span>
                      <input
                        type="text"
                        required
                        value={formData.slug}
                        onChange={(e) => setFormData((p) => ({ ...p, slug: slugify(e.target.value) }))}
                        placeholder="robotic-knee-replacement-in-india"
                        className="w-full text-xs py-2 pr-2 bg-transparent focus:outline-none font-mono font-medium text-slate-800"
                      />
                    </div>
                  </div>

                  {/* Focus Keyword */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <label className="font-bold text-slate-700 flex items-center gap-1 text-[#007A6C]">
                        <Tag className="w-3.5 h-3.5" />
                        <span>Target Focus Keyword</span>
                      </label>
                      <span className="text-[10px] text-slate-400">Core ranking signal</span>
                    </div>
                    <input
                      type="text"
                      value={formData.focusKeyword}
                      onChange={(e) => setFormData((p) => ({ ...p, focusKeyword: e.target.value }))}
                      placeholder="e.g. robotic knee replacement in india"
                      className="w-full text-xs font-semibold px-3 py-2 bg-teal-50/50 border border-[#00C7BE]/40 rounded-xl focus:bg-white focus:border-[#007A6C] focus:outline-none"
                    />
                  </div>
                </div>

                {/* Category & Status */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Category</label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData((p) => ({ ...p, category: e.target.value }))}
                      className="w-full text-xs px-2.5 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none font-semibold text-slate-700"
                    >
                      {BLOG_CATEGORIES.filter((c) => c !== "All Categories").map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Status</label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData((p) => ({ ...p, status: e.target.value as any }))}
                      className="w-full text-xs px-2.5 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none font-semibold text-slate-700"
                    >
                      <option value="published">Published (Live)</option>
                      <option value="draft">Draft (Private)</option>
                      <option value="review">In Review</option>
                      <option value="archived">Archived</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Tags (Comma-separated)</label>
                    <input
                      type="text"
                      value={formData.tagsText}
                      onChange={(e) => setFormData((p) => ({ ...p, tagsText: e.target.value }))}
                      placeholder="Orthopedics, Mako, Knee"
                      className="w-full text-xs px-2.5 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none"
                    />
                  </div>
                </div>

                {/* Excerpt / Summary */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <label className="font-bold text-slate-700">Article Excerpt / Meta Snippet</label>
                    <span className="text-[11px] text-slate-400">
                      {formData.excerpt.length}/300 characters
                    </span>
                  </div>
                  <textarea
                    rows={2}
                    value={formData.excerpt}
                    onChange={(e) => setFormData((p) => ({ ...p, excerpt: e.target.value }))}
                    placeholder="Brief 1-2 sentence executive overview for social sharing and search engines..."
                    className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-[#007A6C] focus:outline-none"
                  />
                </div>

                {/* Content Editor */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <label className="font-bold text-slate-700 flex items-center gap-1.5">
                      <span>Article Content (Markdown Supported)</span>
                      <span className="text-[10px] text-slate-400 font-normal">
                        ({liveSeoAudit.wordCount} words • ~{liveSeoAudit.readingTimeMinutes} min read)
                      </span>
                    </label>

                    {/* Quick Markdown Formatting Helper Pills */}
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => setFormData((p) => ({ ...p, content: p.content + "\n\n## Section Heading\n" }))}
                        className="px-1.5 py-0.5 text-[10px] bg-slate-100 hover:bg-slate-200 text-slate-700 rounded font-bold"
                        title="Add H2 Heading"
                      >
                        H2
                      </button>
                      <button
                        type="button"
                        onClick={() => setFormData((p) => ({ ...p, content: p.content + "\n\n### Sub-heading\n" }))}
                        className="px-1.5 py-0.5 text-[10px] bg-slate-100 hover:bg-slate-200 text-slate-700 rounded font-bold"
                        title="Add H3 Heading"
                      >
                        H3
                      </button>
                      <button
                        type="button"
                        onClick={() => setFormData((p) => ({ ...p, content: p.content + " **bold text** " }))}
                        className="px-1.5 py-0.5 text-[10px] bg-slate-100 hover:bg-slate-200 text-slate-700 rounded font-bold"
                        title="Add Bold Text"
                      >
                        B
                      </button>
                      <button
                        type="button"
                        onClick={() => setFormData((p) => ({ ...p, content: p.content + " [Link Label](https://akeezo.com) " }))}
                        className="px-1.5 py-0.5 text-[10px] bg-slate-100 hover:bg-slate-200 text-slate-700 rounded font-bold"
                        title="Add Link"
                      >
                        Link
                      </button>
                      <button
                        type="button"
                        onClick={() => setFormData((p) => ({ ...p, content: p.content + "\n- Point 1\n- Point 2\n" }))}
                        className="px-1.5 py-0.5 text-[10px] bg-slate-100 hover:bg-slate-200 text-slate-700 rounded font-bold"
                        title="Add Bulleted List"
                      >
                        List
                      </button>
                    </div>
                  </div>

                  <textarea
                    rows={12}
                    required
                    value={formData.content}
                    onChange={(e) => setFormData((p) => ({ ...p, content: e.target.value }))}
                    placeholder="Write your in-depth medical guide. Use ## for main sections, ### for subsections, bullet points, and clinical references..."
                    className="w-full text-xs font-mono p-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-[#007A6C] focus:outline-none leading-relaxed"
                  />
                </div>

                {/* Featured Image & Alt Text */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="space-y-1">
                    <label className="block text-[11px] font-bold text-slate-700 flex items-center gap-1">
                      <ImageIcon className="w-3.5 h-3.5 text-[#007A6C]" />
                      <span>Featured Image URL</span>
                    </label>
                    <input
                      type="text"
                      value={formData.featuredImageUrl}
                      onChange={(e) => setFormData((p) => ({ ...p, featuredImageUrl: e.target.value }))}
                      placeholder="/hero/hero-bg.webp"
                      className="w-full text-xs p-2 bg-white border border-slate-200 rounded-lg focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-[11px] font-bold text-slate-700">
                      Image Alt Attribute (Include keyword!)
                    </label>
                    <input
                      type="text"
                      value={formData.featuredImageAlt}
                      onChange={(e) => setFormData((p) => ({ ...p, featuredImageAlt: e.target.value }))}
                      placeholder="e.g. robotic knee replacement in india operating theater"
                      className="w-full text-xs p-2 bg-white border border-slate-200 rounded-lg focus:outline-none"
                    />
                  </div>
                </div>

                {/* Author Details & Medical Disclaimer Toggle */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-slate-700">Author Name & Title</label>
                    <input
                      type="text"
                      value={formData.authorName}
                      onChange={(e) => setFormData((p) => ({ ...p, authorName: e.target.value }))}
                      className="w-full text-xs p-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none"
                    />
                  </div>

                  <div className="flex items-center gap-2 pt-5">
                    <input
                      type="checkbox"
                      id="disclaimerToggle"
                      checked={formData.medicalDisclaimerEnabled}
                      onChange={(e) => setFormData((p) => ({ ...p, medicalDisclaimerEnabled: e.target.checked }))}
                      className="rounded text-[#007A6C] focus:ring-[#00C7BE] w-4 h-4 cursor-pointer"
                    />
                    <label htmlFor="disclaimerToggle" className="text-xs text-slate-700 font-semibold cursor-pointer">
                      Attach Statutory Medical Information Disclaimer
                    </label>
                  </div>
                </div>
              </div>

              {/* RIGHT PANE: Real-Time SEO Scoring & Checklist Tracker */}
              <div className="w-full lg:w-96 p-5 bg-slate-50 overflow-y-auto space-y-5 flex flex-col justify-between">
                <div className="space-y-4">
                  {/* Circular / Radial Score Card */}
                  <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                        Content SEO Score
                      </span>
                      <span
                        className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${
                          liveSeoAudit.grade === "optimal"
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            : liveSeoAudit.grade === "good"
                            ? "bg-teal-50 text-teal-800 border border-teal-200"
                            : liveSeoAudit.grade === "fair"
                            ? "bg-amber-50 text-amber-800 border border-amber-200"
                            : "bg-rose-50 text-rose-800 border border-rose-200"
                        }`}
                      >
                        {liveSeoAudit.grade}
                      </span>
                    </div>

                    <div className="flex items-center gap-4">
                      {/* Animated Gauge Ring */}
                      <div className="relative w-16 h-16 shrink-0 flex items-center justify-center">
                        <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                          <path
                            className="text-slate-100"
                            strokeWidth="3.5"
                            stroke="currentColor"
                            fill="none"
                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                          />
                          <path
                            className={`${
                              liveSeoAudit.score >= 80
                                ? "text-emerald-500"
                                : liveSeoAudit.score >= 50
                                ? "text-amber-500"
                                : "text-rose-500"
                            } transition-all duration-300`}
                            strokeDasharray={`${liveSeoAudit.score}, 100`}
                            strokeWidth="3.5"
                            strokeLinecap="round"
                            stroke="currentColor"
                            fill="none"
                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                          />
                        </svg>
                        <span className="absolute font-black text-sm text-slate-800">
                          {liveSeoAudit.score}
                        </span>
                      </div>

                      <div className="space-y-1 text-xs">
                        <div className="text-slate-800 font-bold">
                          {liveSeoAudit.score >= 80
                            ? "Ready for Publishing"
                            : liveSeoAudit.score >= 50
                            ? "Needs Optimization"
                            : "Critical SEO Deficiencies"}
                        </div>
                        <div className="text-[11px] text-slate-500 flex items-center gap-2">
                          <span className="text-emerald-600 font-bold">{liveSeoAudit.passedCount} Passed</span>
                          <span>•</span>
                          <span className="text-amber-600 font-bold">{liveSeoAudit.warningCount} Warnings</span>
                          <span>•</span>
                          <span className="text-rose-600 font-bold">{liveSeoAudit.errorCount} Errors</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Google SERP Snippet Preview Simulator */}
                  <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-2xs space-y-2">
                    <div className="flex items-center justify-between text-xs pb-1 border-b border-slate-100">
                      <span className="font-bold text-slate-700 flex items-center gap-1.5">
                        <SearchCode className="w-3.5 h-3.5 text-[#007A6C]" />
                        <span>Google SERP Preview</span>
                      </span>

                      <div className="flex items-center bg-slate-100 p-0.5 rounded-lg text-[10px]">
                        <button
                          type="button"
                          onClick={() => setSerpPreviewMode("desktop")}
                          className={`px-1.5 py-0.5 rounded font-bold transition ${
                            serpPreviewMode === "desktop" ? "bg-white text-slate-900 shadow-2xs" : "text-slate-500"
                          }`}
                        >
                          <Monitor className="w-3 h-3" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setSerpPreviewMode("mobile")}
                          className={`px-1.5 py-0.5 rounded font-bold transition ${
                            serpPreviewMode === "mobile" ? "bg-white text-slate-900 shadow-2xs" : "text-slate-500"
                          }`}
                        >
                          <Smartphone className="w-3 h-3" />
                        </button>
                      </div>
                    </div>

                    {/* Google SERP Card Preview */}
                    <div className="p-3 bg-slate-50/70 rounded-xl border border-slate-200 space-y-1">
                      <div className="flex items-center gap-1.5 text-[11px] text-slate-600 truncate">
                        <img src="/logo/favicon.svg" alt="" className="w-3.5 h-3.5" />
                        <span className="text-slate-700 font-medium">akeezo.com</span>
                        <span className="text-slate-400">&gt; blog &gt; {formData.slug || "article-slug"}</span>
                      </div>

                      <div className="text-sm font-semibold text-[#1a0dab] hover:underline cursor-pointer line-clamp-1">
                        {formData.seoTitle || formData.title || "Your Search Optimized Title Will Appear Here"}
                      </div>

                      <div className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                        {formData.metaDescription || formData.excerpt || "Write a concise 120-160 character meta description explaining the medical procedures and clinical guidance covered in this guide..."}
                      </div>
                    </div>
                  </div>

                  {/* SEO Title & Meta Description Override Accordion */}
                  <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-2xs space-y-2.5">
                    <span className="text-xs font-bold text-slate-700 block">
                      Search Engine Metadata (SERP Tags)
                    </span>

                    <div className="space-y-1">
                      <div className="flex justify-between text-[11px]">
                        <span className="text-slate-500">Custom SEO Title</span>
                        <span className={`font-mono text-[10px] ${formData.seoTitle.length > 65 ? "text-amber-600" : "text-slate-400"}`}>
                          {formData.seoTitle.length}/60 chars
                        </span>
                      </div>
                      <input
                        type="text"
                        value={formData.seoTitle}
                        onChange={(e) => setFormData((p) => ({ ...p, seoTitle: e.target.value }))}
                        placeholder={formData.title}
                        className="w-full text-xs p-2 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none"
                      />
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between text-[11px]">
                        <span className="text-slate-500">Meta Description</span>
                        <span className={`font-mono text-[10px] ${formData.metaDescription.length > 165 ? "text-amber-600" : "text-slate-400"}`}>
                          {formData.metaDescription.length}/160 chars
                        </span>
                      </div>
                      <textarea
                        rows={2}
                        value={formData.metaDescription}
                        onChange={(e) => setFormData((p) => ({ ...p, metaDescription: e.target.value }))}
                        placeholder={formData.excerpt}
                        className="w-full text-xs p-2 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Interactive SEO Checklist Tracker */}
                  <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-2xs space-y-2.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-slate-700">SEO Checklist Tracker</span>
                      <div className="flex items-center gap-1 text-[10px]">
                        <button
                          type="button"
                          onClick={() => setSeoAuditTab("all")}
                          className={`px-1.5 py-0.5 rounded font-bold ${seoAuditTab === "all" ? "bg-slate-200 text-slate-900" : "text-slate-500"}`}
                        >
                          All ({liveSeoAudit.checks.length})
                        </button>
                        <button
                          type="button"
                          onClick={() => setSeoAuditTab("issues")}
                          className={`px-1.5 py-0.5 rounded font-bold ${seoAuditTab === "issues" ? "bg-amber-100 text-amber-900" : "text-slate-500"}`}
                        >
                          Fixes ({liveSeoAudit.warningCount + liveSeoAudit.errorCount})
                        </button>
                        <button
                          type="button"
                          onClick={() => setSeoAuditTab("passed")}
                          className={`px-1.5 py-0.5 rounded font-bold ${seoAuditTab === "passed" ? "bg-emerald-100 text-emerald-900" : "text-slate-500"}`}
                        >
                          Passed ({liveSeoAudit.passedCount})
                        </button>
                      </div>
                    </div>

                    <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                      {filteredChecks.map((check) => (
                        <div
                          key={check.id}
                          className={`p-2 rounded-xl text-xs space-y-1 border ${
                            check.passed
                              ? "bg-emerald-50/50 border-emerald-200/60"
                              : check.severity === "error"
                              ? "bg-rose-50/60 border-rose-200/80"
                              : "bg-amber-50/60 border-amber-200/80"
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            {check.passed ? (
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                            ) : check.severity === "error" ? (
                              <AlertCircle className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                            ) : (
                              <HelpCircle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                            )}
                            <span className="font-bold text-slate-800 text-[11px]">{check.label}</span>
                          </div>
                          <p className="text-[11px] text-slate-600 leading-normal pl-5">
                            {check.message}
                          </p>
                          {check.suggestion && (
                            <p className="text-[10px] text-[#007A6C] font-semibold pl-5">
                              💡 Tip: {check.suggestion}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Modal Footer Actions */}
                <div className="pt-4 border-t border-slate-200 flex items-center justify-between gap-3">
                  <button
                    type="button"
                    onClick={() => setIsEditorOpen(false)}
                    className="px-3.5 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 rounded-xl hover:bg-slate-200 transition"
                  >
                    Discard Changes
                  </button>

                  <div className="flex items-center gap-2">
                    <button
                      type="submit"
                      disabled={formSubmitting}
                      className="px-4 py-2 bg-[#007A6C] hover:bg-[#005F54] text-white text-xs font-bold rounded-xl shadow-xs transition flex items-center gap-1.5 disabled:opacity-50"
                    >
                      {formSubmitting ? (
                        <>
                          <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                          <span>Saving...</span>
                        </>
                      ) : (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>{editingArticle ? "Save Article & SEO" : "Publish Article"}</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 6. INSPECTION / PREVIEW DRAWER */}
      {previewDrawerArticle && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-2xs flex justify-end animate-in fade-in duration-100">
          <div className="w-full max-w-lg bg-white h-full shadow-2xl p-6 overflow-y-auto space-y-6 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                <div className="flex items-center gap-2">
                  <span className="font-bold uppercase tracking-wider text-[11px] text-[#007A6C] bg-teal-50 px-2.5 py-0.5 rounded-full border border-[#00C7BE]/30">
                    {previewDrawerArticle.category}
                  </span>
                  <span className="text-xs text-slate-400 font-semibold">
                    {previewDrawerArticle.status}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setPreviewDrawerArticle(null)}
                  className="p-1 text-slate-400 hover:text-slate-800 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div>
                <h2 className="text-lg font-black text-slate-900 leading-snug">
                  {previewDrawerArticle.title}
                </h2>
                <div className="flex items-center gap-2 text-xs text-slate-400 mt-1">
                  <span>/blog/{previewDrawerArticle.slug}</span>
                  <span>•</span>
                  <span>{previewDrawerArticle.estimatedReadTime || 3} min read</span>
                </div>
              </div>

              {/* SEO Score Badge in Drawer */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between">
                <div>
                  <span className="text-xs text-slate-500 font-medium">Audit Score:</span>
                  <div className="text-xl font-black text-[#007A6C]">
                    {previewDrawerArticle.seo?.seoScore || 85}/100
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs text-slate-500 font-medium">Focus Keyword:</span>
                  <div className="text-xs font-bold text-slate-800">
                    {previewDrawerArticle.seo?.focusKeyword || "None specified"}
                  </div>
                </div>
              </div>

              {/* Excerpt */}
              {previewDrawerArticle.excerpt && (
                <div className="p-3 bg-teal-50/50 rounded-xl border border-[#00C7BE]/20 text-xs text-slate-700 leading-relaxed">
                  <strong>Excerpt:</strong> {previewDrawerArticle.excerpt}
                </div>
              )}

              {/* Reading Content Snippet */}
              <div className="space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Article Preview
                </span>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-700 max-h-56 overflow-y-auto leading-relaxed whitespace-pre-line font-mono">
                  {previewDrawerArticle.content}
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
              <a
                href={`/blog/${previewDrawerArticle.slug}`}
                target="_blank"
                rel="noreferrer"
                className="text-xs font-bold text-[#007A6C] hover:underline flex items-center gap-1"
              >
                <span>Open Public Page</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>

              <button
                type="button"
                onClick={() => {
                  const art = previewDrawerArticle;
                  setPreviewDrawerArticle(null);
                  openEditModal(art);
                }}
                className="px-4 py-2 bg-[#007A6C] hover:bg-[#005F54] text-white text-xs font-bold rounded-xl transition"
              >
                Edit in SEO Studio
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 7. DELETE CONFIRMATION MODAL */}
      {deletingId && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-2xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full space-y-4 shadow-2xl border border-slate-200 text-center animate-in zoom-in-95">
            <div className="w-12 h-12 mx-auto rounded-full bg-rose-50 border border-rose-200 text-rose-600 flex items-center justify-center">
              <Trash2 className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-bold text-slate-900">Delete Blog Article?</h3>
              <p className="text-xs text-slate-500">
                Are you sure you want to permanently delete this article? Public URLs will return 404 and external links will break.
              </p>
            </div>
            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setDeletingId(null)}
                className="flex-1 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleDelete(deletingId)}
                className="flex-1 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-xl shadow-xs transition"
              >
                Delete Article
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
