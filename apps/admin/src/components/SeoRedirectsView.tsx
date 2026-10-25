import React, { useState, useEffect } from "react";
import {
  Share2,
  Search,
  Plus,
  Trash2,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Edit2,
  Globe,
  Sparkles,
  ShieldAlert,
  ArrowRight,
  Eye,
  Save,
} from "lucide-react";

interface RedirectItem {
  _id: string;
  sourcePath: string;
  destinationPath: string;
  statusCode: number;
  hits: number;
  isEnabled: boolean;
  notes?: string;
  createdAt: string;
}

interface PageSeoItem {
  id: string;
  slug: string;
  title: string;
  path: string;
  seo?: {
    title?: string;
    description?: string;
    canonicalPath?: string;
    robots?: string;
    ogTitle?: string;
    ogDescription?: string;
    ogImage?: string;
  };
}

export const SeoRedirectsView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"seo" | "redirects">("seo");

  // --- Page SEO State ---
  const [pages, setPages] = useState<PageSeoItem[]>([]);
  const [loadingPages, setLoadingPages] = useState(true);
  const [pageSearch, setPageSearch] = useState("");
  const [selectedPage, setSelectedPage] = useState<PageSeoItem | null>(null);

  // Editable SEO Fields
  const [seoTitle, setSeoTitle] = useState("");
  const [seoDescription, setSeoDescription] = useState("");
  const [canonicalUrl, setCanonicalUrl] = useState("");
  const [robots, setRobots] = useState("index,follow");
  const [ogTitle, setOgTitle] = useState("");
  const [ogDescription, setOgDescription] = useState("");
  const [savingSeo, setSavingSeo] = useState(false);
  const [seoSuccess, setSeoSuccess] = useState(false);

  // --- Redirects State ---
  const [redirects, setRedirects] = useState<RedirectItem[]>([]);
  const [loadingRedirects, setLoadingRedirects] = useState(true);
  const [redirectSearch, setRedirectSearch] = useState("");

  // Create / Edit Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [editingRedirectId, setEditingRedirectId] = useState<string | null>(null);
  const [sourcePath, setSourcePath] = useState("");
  const [destinationPath, setDestinationPath] = useState("");
  const [statusCode, setStatusCode] = useState(301);
  const [notes, setNotes] = useState("");
  const [savingRedirect, setSavingRedirect] = useState(false);
  const [redirectError, setRedirectError] = useState("");

  useEffect(() => {
    fetchPages();
    fetchRedirects();
  }, []);

  const fetchPages = async () => {
    try {
      setLoadingPages(true);
      const res = await fetch("/api/v1/admin/pages");
      if (res.ok) {
        const json = await res.json();
        setPages(json.data || []);
        if (json.data && json.data.length > 0 && !selectedPage) {
          selectPageForSeo(json.data[0]);
        }
      }
    } catch (err) {
      console.error("Failed to fetch pages for SEO", err);
    } finally {
      setLoadingPages(false);
    }
  };

  const fetchRedirects = async () => {
    try {
      setLoadingRedirects(true);
      const res = await fetch("/api/v1/admin/redirects");
      if (res.ok) {
        const json = await res.json();
        setRedirects(json.data || []);
      }
    } catch (err) {
      console.error("Failed to fetch redirects", err);
    } finally {
      setLoadingRedirects(false);
    }
  };

  const selectPageForSeo = async (p: PageSeoItem) => {
    setSelectedPage(p);
    setSeoSuccess(false);

    try {
      const res = await fetch(`/api/v1/admin/pages/${p.slug}`);
      if (res.ok) {
        const json = await res.json();
        const s = json.data?.seo || {};
        setSeoTitle(s.title || p.title || "");
        setSeoDescription(s.description || "");
        setCanonicalUrl(s.canonicalPath || p.path || `/${p.slug}`);
        setRobots(s.robots || "index,follow");
        setOgTitle(s.ogTitle || s.title || p.title || "");
        setOgDescription(s.ogDescription || s.description || "");
      }
    } catch {
      // Fallback
      setSeoTitle(p.title || "");
      setSeoDescription("");
      setCanonicalUrl(p.path || `/${p.slug}`);
      setRobots("index,follow");
    }
  };

  const handleSaveSeo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPage) return;
    setSavingSeo(true);
    setSeoSuccess(false);

    try {
      // First get existing payload
      const detailRes = await fetch(`/api/v1/admin/pages/${selectedPage.slug}`);
      const detailJson = await detailRes.json();
      const payload = detailJson.data?.payload || {};

      const res = await fetch(`/api/v1/admin/pages/${selectedPage.slug}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          payload,
          seo: {
            title: seoTitle,
            description: seoDescription,
            canonicalPath: canonicalUrl,
            robots,
            ogTitle: ogTitle || seoTitle,
            ogDescription: ogDescription || seoDescription,
          },
          publishImmediately: true,
        }),
      });

      if (res.ok) {
        setSeoSuccess(true);
        setTimeout(() => setSeoSuccess(false), 3000);
      } else {
        const error = await res.json();
        alert(`Failed to save SEO: ${error.error?.message || "Unknown error"}`);
      }
    } catch (err: any) {
      alert(`Error saving SEO: ${err.message}`);
    } finally {
      setSavingSeo(false);
    }
  };

  const openCreateRedirect = () => {
    setEditingRedirectId(null);
    setSourcePath("");
    setDestinationPath("");
    setStatusCode(301);
    setNotes("");
    setRedirectError("");
    setModalOpen(true);
  };

  const openEditRedirect = (red: RedirectItem) => {
    setEditingRedirectId(red._id);
    setSourcePath(red.sourcePath);
    setDestinationPath(red.destinationPath);
    setStatusCode(red.statusCode);
    setNotes(red.notes || "");
    setRedirectError("");
    setModalOpen(true);
  };

  const handleRedirectSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingRedirect(true);
    setRedirectError("");

    try {
      const url = editingRedirectId
        ? `/api/v1/admin/redirects/${editingRedirectId}`
        : "/api/v1/admin/redirects";
      const method = editingRedirectId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sourcePath,
          destinationPath,
          statusCode,
          notes,
          isEnabled: true,
        }),
      });

      const json = await res.json();
      if (!res.ok) {
        setRedirectError(json.error?.message || "Failed to save redirect.");
        return;
      }

      setModalOpen(false);
      await fetchRedirects();
    } catch (err: any) {
      setRedirectError(err.message);
    } finally {
      setSavingRedirect(false);
    }
  };

  const handleToggleRedirectEnabled = async (red: RedirectItem) => {
    try {
      const res = await fetch(`/api/v1/admin/redirects/${red._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          isEnabled: !red.isEnabled,
        }),
      });
      if (res.ok) {
        setRedirects((prev) =>
          prev.map((r) => (r._id === red._id ? { ...r, isEnabled: !red.isEnabled } : r))
        );
      }
    } catch (err: any) {
      alert(`Toggle failed: ${err.message}`);
    }
  };

  const handleDeleteRedirect = async (id: string) => {
    if (!confirm("Delete this URL redirect?")) return;
    try {
      const res = await fetch(`/api/v1/admin/redirects/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setRedirects((prev) => prev.filter((r) => r._id !== id));
      }
    } catch (err: any) {
      alert(`Delete failed: ${err.message}`);
    }
  };

  const filteredPages = pages.filter((p) =>
    p.title?.toLowerCase().includes(pageSearch.toLowerCase()) ||
    p.slug?.toLowerCase().includes(pageSearch.toLowerCase())
  );

  const filteredRedirects = redirects.filter((r) =>
    r.sourcePath?.toLowerCase().includes(redirectSearch.toLowerCase()) ||
    r.destinationPath?.toLowerCase().includes(redirectSearch.toLowerCase()) ||
    r.notes?.toLowerCase().includes(redirectSearch.toLowerCase())
  );

  return (
    <div className="space-y-6 font-sans">
      {/* 1. Header Banner */}
      <div className="bg-gradient-to-r from-[#061E1B] via-teal-950 to-[#061E1B] rounded-2xl p-6 text-white shadow-md border border-[#00C7BE]/30 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#007A6C]/50 text-[#00C7BE] border border-[#00C7BE]/30">
            <Share2 className="w-3.5 h-3.5 text-[#00C7BE]" />
            <span>Search Discovery & URL Governance</span>
          </div>
          <h1 className="text-xl font-black tracking-tight">Technical SEO & Route Redirects</h1>
          <p className="text-xs text-teal-100/80 max-w-2xl leading-relaxed">
            Manage Open Graph social cards, search snippet previews, canonical tags, and 301/302 URL redirects. Automatic loop prevention and reserved route protection ensure stable platform routing.
          </p>
        </div>

        {activeTab === "redirects" && (
          <button
            onClick={openCreateRedirect}
            className="flex items-center gap-1.5 bg-[#FF6B00] hover:bg-[#FF6D1B] active:scale-98 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-md transition shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>New Redirect</span>
          </button>
        )}
      </div>

      {/* 2. Tab Navigation */}
      <div className="flex border-b border-slate-200 gap-2">
        <button
          onClick={() => setActiveTab("seo")}
          className={`px-4 py-3 text-xs font-bold border-b-2 flex items-center gap-2 transition ${
            activeTab === "seo"
              ? "border-[#007A6C] text-[#007A6C] bg-[#E6F8F6]/60 rounded-t-xl"
              : "border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-50"
          }`}
        >
          <Globe className="w-4 h-4 text-[#007A6C]" />
          <span>Page SEO & Social Metadata ({pages.length} Pages)</span>
        </button>

        <button
          onClick={() => setActiveTab("redirects")}
          className={`px-4 py-3 text-xs font-bold border-b-2 flex items-center gap-2 transition ${
            activeTab === "redirects"
              ? "border-[#007A6C] text-[#007A6C] bg-[#E6F8F6]/60 rounded-t-xl"
              : "border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-50"
          }`}
        >
          <Share2 className="w-4 h-4 text-[#007A6C]" />
          <span>URL Redirects & Aliases ({redirects.length})</span>
        </button>
      </div>

      {/* TAB 1: PAGE SEO */}
      {activeTab === "seo" && (
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left: Page Selector */}
          <div className="lg:w-80 bg-white rounded-2xl border border-slate-200 p-4 shadow-xs space-y-3 shrink-0">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={pageSearch}
                onChange={(e) => setPageSearch(e.target.value)}
                placeholder="Search page..."
                className="w-full text-xs pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none"
              />
            </div>

            <div className="space-y-1 max-h-[600px] overflow-y-auto">
              {filteredPages.map((p) => {
                const isSelected = selectedPage?.slug === p.slug;
                return (
                  <button
                    key={p.slug}
                    onClick={() => selectPageForSeo(p)}
                    className={`w-full text-left p-3 rounded-xl transition text-xs ${
                      isSelected
                        ? "bg-[#007A6C] text-white shadow-xs font-semibold"
                        : "text-slate-700 hover:bg-slate-100"
                    }`}
                  >
                    <div className="font-bold truncate">{p.title}</div>
                    <div className={`font-mono text-[10px] ${isSelected ? "text-teal-200" : "text-slate-400"}`}>
                      {p.path || `/${p.slug}`}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right: SEO Editor & Previews */}
          {selectedPage && (
            <div className="flex-1 space-y-6">
              <form onSubmit={handleSaveSeo} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div>
                    <h2 className="text-base font-bold text-slate-900">
                      SEO Settings: {selectedPage.title}
                    </h2>
                    <span className="text-xs text-slate-400 font-mono">Canonical: {canonicalUrl}</span>
                  </div>

                  <button
                    type="submit"
                    disabled={savingSeo}
                    className="px-4 py-2 text-xs font-bold text-white bg-[#007A6C] hover:bg-[#005F54] rounded-xl shadow-xs transition disabled:opacity-60 flex items-center gap-1.5"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>{savingSeo ? "Saving..." : "Save & Commit SEO"}</span>
                  </button>
                </div>

                {seoSuccess && (
                  <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>SEO settings saved and updated in public SSR route entry!</span>
                  </div>
                )}

                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-xs font-bold text-slate-700">Meta SEO Title</label>
                      <span className="text-[10px] text-slate-400">{seoTitle.length} / 60 characters</span>
                    </div>
                    <input
                      type="text"
                      value={seoTitle}
                      onChange={(e) => setSeoTitle(e.target.value)}
                      required
                      className="w-full text-xs px-3 py-2 rounded-xl border border-slate-300 focus:border-[#007A6C] focus:outline-none"
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-xs font-bold text-slate-700">Meta Description</label>
                      <span className="text-[10px] text-slate-400">{seoDescription.length} / 160 characters</span>
                    </div>
                    <textarea
                      rows={3}
                      value={seoDescription}
                      onChange={(e) => setSeoDescription(e.target.value)}
                      required
                      className="w-full text-xs px-3 py-2 rounded-xl border border-slate-300 focus:border-[#007A6C] focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Canonical URL</label>
                      <input
                        type="text"
                        value={canonicalUrl}
                        onChange={(e) => setCanonicalUrl(e.target.value)}
                        className="w-full text-xs px-3 py-2 rounded-xl border border-slate-300 focus:border-[#007A6C] focus:outline-none font-mono"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Robots Indexing</label>
                      <select
                        value={robots}
                        onChange={(e) => setRobots(e.target.value)}
                        className="w-full text-xs px-3 py-2 rounded-xl border border-slate-300 focus:border-[#007A6C] focus:outline-none font-medium"
                      >
                        <option value="index,follow">index, follow (Allow in Google search)</option>
                        <option value="noindex,nofollow">noindex, nofollow (Exclude from search engines)</option>
                        <option value="noindex,follow">noindex, follow</option>
                      </select>
                    </div>
                  </div>
                </div>
              </form>

              {/* Real-Time Search & Social Card Previews */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Google Search Snippet Preview */}
                <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3">
                  <div className="flex items-center gap-2">
                    <Search className="w-4 h-4 text-blue-600" />
                    <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                      Google Search Snippet Preview
                    </h3>
                  </div>

                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 font-sans space-y-1">
                    <div className="text-[11px] text-slate-600 flex items-center gap-1.5">
                      <span className="text-slate-800 font-semibold">https://akeezo.com</span>
                      <span className="text-slate-400">› {selectedPage.slug}</span>
                    </div>
                    <div className="text-sm font-semibold text-[#1a0dab] hover:underline cursor-pointer truncate">
                      {seoTitle || "AKEEZO - Healthcare Discovery"}
                    </div>
                    <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                      {seoDescription || "World-class healthcare discovery and coordination in India."}
                    </p>
                  </div>
                </div>

                {/* Social Card / Open Graph Preview */}
                <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3">
                  <div className="flex items-center gap-2">
                    <Share2 className="w-4 h-4 text-[#007A6C]" />
                    <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                      Social Card / Open Graph Preview
                    </h3>
                  </div>

                  <div className="rounded-xl border border-slate-200 overflow-hidden bg-slate-50 text-xs">
                    <div className="h-28 bg-[#061E1B] flex items-center justify-center p-3 relative">
                      <img src="/logo/favicon.svg" alt="Akeezo" className="w-12 h-12" />
                      <span className="absolute bottom-2 right-2 text-[10px] font-bold text-[#00C7BE] uppercase tracking-wider">
                        AKEEZO HEALTHCARE
                      </span>
                    </div>
                    <div className="p-3 space-y-1">
                      <div className="text-[10px] uppercase font-bold text-slate-400">akeezo.com</div>
                      <div className="font-bold text-slate-900 truncate">
                        {ogTitle || seoTitle || "Akeezo Healthcare"}
                      </div>
                      <p className="text-[11px] text-slate-500 line-clamp-1">
                        {ogDescription || seoDescription}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: REDIRECTS */}
      {activeTab === "redirects" && (
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={redirectSearch}
                onChange={(e) => setRedirectSearch(e.target.value)}
                placeholder="Search redirect source or destination..."
                className="w-full text-xs pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-[#007A6C] focus:outline-none"
              />
            </div>

            <div className="text-xs text-slate-500 font-medium">
              Redirects execute before SSR rendering with zero performance impact.
            </div>
          </div>

          {/* Redirects Table */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4">Source Path</th>
                  <th className="py-3 px-4">Destination</th>
                  <th className="py-3 px-4">Type</th>
                  <th className="py-3 px-4">Hits</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {loadingRedirects ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-slate-400 font-semibold">
                      Loading redirects...
                    </td>
                  </tr>
                ) : filteredRedirects.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-slate-400 font-semibold">
                      No URL redirects configured yet.
                    </td>
                  </tr>
                ) : (
                  filteredRedirects.map((red) => (
                    <tr key={red._id} className="hover:bg-slate-50 transition">
                      <td className="py-3.5 px-4 font-mono font-bold text-slate-900">
                        {red.sourcePath}
                      </td>
                      <td className="py-3.5 px-4 font-mono text-[#007A6C]">
                        {red.destinationPath}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-md">
                          {red.statusCode}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-slate-600">{red.hits} hits</td>
                      <td className="py-3.5 px-4">
                        <button
                          onClick={() => handleToggleRedirectEnabled(red)}
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase transition ${
                            red.isEnabled
                              ? "bg-emerald-100 text-emerald-800"
                              : "bg-slate-200 text-slate-600"
                          }`}
                        >
                          {red.isEnabled ? "Active" : "Disabled"}
                        </button>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="inline-flex items-center gap-1.5">
                          <button
                            onClick={() => openEditRedirect(red)}
                            className="p-1 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg"
                            title="Edit redirect"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteRedirect(red._id)}
                            className="p-1 text-rose-500 hover:bg-rose-50 rounded-lg"
                            title="Delete redirect"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* CREATE / EDIT REDIRECT MODAL */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-md p-6 space-y-4">
            <h3 className="text-sm font-bold text-slate-900">
              {editingRedirectId ? "Edit URL Redirect" : "Create New URL Redirect"}
            </h3>

            {redirectError && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{redirectError}</span>
              </div>
            )}

            <form onSubmit={handleRedirectSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Source Path (From)
                </label>
                <input
                  type="text"
                  value={sourcePath}
                  onChange={(e) => setSourcePath(e.target.value)}
                  required
                  placeholder="/old-cardiac-tariff"
                  className="w-full text-xs px-3 py-2 rounded-xl border border-slate-300 focus:border-[#007A6C] focus:outline-none font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Destination Path (To)
                </label>
                <input
                  type="text"
                  value={destinationPath}
                  onChange={(e) => setDestinationPath(e.target.value)}
                  required
                  placeholder="/#treatments or https://..."
                  className="w-full text-xs px-3 py-2 rounded-xl border border-slate-300 focus:border-[#007A6C] focus:outline-none font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  HTTP Redirect Code
                </label>
                <select
                  value={statusCode}
                  onChange={(e) => setStatusCode(Number(e.target.value))}
                  className="w-full text-xs px-3 py-2 rounded-xl border border-slate-300 focus:border-[#007A6C] focus:outline-none"
                >
                  <option value={301}>301 Permanent Redirect (SEO Equity Passed)</option>
                  <option value={302}>302 Temporary Redirect (Campaigns)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Internal Notes / Campaign Reason
                </label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Migration from legacy blog"
                  className="w-full text-xs px-3 py-2 rounded-xl border border-slate-300 focus:border-[#007A6C] focus:outline-none"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingRedirect}
                  className="px-4 py-2 text-xs font-bold text-white bg-[#007A6C] hover:bg-[#005F54] rounded-xl shadow-xs disabled:opacity-60"
                >
                  {savingRedirect ? "Saving..." : "Save Redirect"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
