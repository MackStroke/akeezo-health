import React, { useState, useEffect } from "react";
import {
  FileText,
  Save,
  Check,
  ExternalLink,
  Search,
  ShieldAlert,
  Sparkles,
  Layers,
  Calendar,
  Eye,
  AlertCircle
} from "lucide-react";

interface PageSummary {
  id: string;
  slug: string;
  title: string;
  status: string;
  version: number;
  publishedAt?: string;
  path: string;
}

export const PageContentTab: React.FC = () => {
  const [pages, setPages] = useState<PageSummary[]>([]);
  const [selectedSlug, setSelectedSlug] = useState<string>("home");
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);

  // Editable Page State
  const [pageMeta, setPageMeta] = useState<any>(null);
  const [seo, setSeo] = useState<any>({
    title: "",
    description: "",
    canonicalPath: "",
    robots: "index,follow",
    schemaKind: "MedicalWebPage",
  });
  const [payload, setPayload] = useState<any>({});

  useEffect(() => {
    fetchPagesList();
  }, []);

  useEffect(() => {
    if (selectedSlug) {
      fetchPageDetail(selectedSlug);
    }
  }, [selectedSlug]);

  const fetchPagesList = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/v1/admin/pages");
      const json = await res.json();
      if (json.data && json.data.length > 0) {
        setPages(json.data);
      } else {
        // Fallback default list if database pages aren't queried yet
        setPages([
          { id: "1", slug: "home", title: "AKEEZO - Healthcare Discovery Portal", status: "published", version: 1, path: "/" },
          { id: "2", slug: "privacy", title: "Privacy & Health Data Protection", status: "published", version: 1, path: "/privacy" },
          { id: "3", slug: "terms", title: "Terms of Medical Discovery Service", status: "published", version: 1, path: "/terms" },
          { id: "4", slug: "disclaimer", title: "Clinical & Regulatory Disclaimer", status: "published", version: 1, path: "/disclaimer" },
        ]);
      }
    } catch (err) {
      console.error("Failed to fetch pages", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchPageDetail = async (slug: string) => {
    try {
      setLoading(true);
      const res = await fetch(`/api/v1/admin/pages/${slug}`);
      if (res.ok) {
        const json = await res.json();
        setPageMeta(json.data.page);
        setSeo(json.data.seo || {
          title: "AKEEZO Healthcare Platform",
          description: "World-Class Medical Care in India",
          canonicalPath: slug === "home" ? "/" : `/${slug}`,
          robots: "index,follow",
          schemaKind: "MedicalWebPage",
        });
        setPayload(json.data.payload || {});
      } else {
        // Init default template structure
        initDefaultsForSlug(slug);
      }
    } catch (err) {
      console.error("Failed to load page detail", err);
      initDefaultsForSlug(slug);
    } finally {
      setLoading(false);
    }
  };

  const initDefaultsForSlug = (slug: string) => {
    if (slug === "home") {
      setSeo({
        title: "AKEEZO Healthcare Platform | World-Class Medical Care in India",
        description: "Heal In India, Heal By Akeezo. Access premier NABH/JCI accredited hospitals with transparent cost estimates.",
        canonicalPath: "/",
        robots: "index,follow",
        schemaKind: "MedicalWebPage",
      });
      setPayload({
        headline: "World-Class Healthcare in India, Simplified & Trusted",
        subheadline: "Direct connections to India's top 100+ accredited super-specialty hospitals, verified procedure pricing, and end-to-end medical visa facilitation.",
        searchPlaceholder: "Search surgeries, robotic oncology, CAR-T, IVF or top specialists...",
        heroBadge: "JCI & NABH ACCREDITED NETWORK",
        statsTagline: "Over 12,000+ international and domestic patients coordinated with zero hidden facilitation fees.",
      });
    } else if (slug === "privacy") {
      setSeo({
        title: "Privacy & Protected Health Information (PHI) Policy | AKEEZO",
        description: "Our compliance commitment with GDPR, HIPAA, and DPDP Act 2023 for patient records.",
        canonicalPath: "/privacy",
        robots: "index,follow",
        schemaKind: "MedicalWebPage",
      });
      setPayload({
        title: "Protected Health Information (PHI) & Privacy Policy",
        effectiveDate: "2026-10-14",
        complianceStandards: "GDPR, HIPAA, DPDP Act 2023 (India), UK DPA 2018",
        dpoContact: "privacy@akeezo.com",
        summary: "AKEEZO operates under strict multi-layer zero-trust data protection principles. All diagnostic scans, passport copies, and clinical histories are encrypted using AES-256-GCM at rest.",
      });
    } else if (slug === "terms") {
      setSeo({
        title: "Terms of Healthcare Discovery & Coordination Service | AKEEZO",
        description: "Terms governing healthcare information discovery, hospital quotation requests, and case facilitation.",
        canonicalPath: "/terms",
        robots: "index,follow",
        schemaKind: "MedicalWebPage",
      });
      setPayload({
        title: "Terms of Service & Coordination Agreement",
        effectiveDate: "2026-10-14",
        governingLaw: "New Delhi, India",
        supportEmail: "legal@akeezo.com",
        summary: "AKEEZO is an authorized healthcare coordination and discovery facilitator, not a hospital or licensed medical practitioner. Medical diagnoses and treatments remain under the exclusive professional judgment of attending hospital physicians.",
      });
    } else if (slug === "disclaimer") {
      setSeo({
        title: "Medical & Regulatory Disclaimer | AKEEZO Healthcare",
        description: "Non-clinical advice notice, independent hospital liability, and emergency treatment instructions.",
        canonicalPath: "/disclaimer",
        robots: "index,follow",
        schemaKind: "MedicalWebPage",
      });
      setPayload({
        title: "Medical & Regulatory Disclaimer",
        effectiveDate: "2026-10-14",
        emergencyNotice: "If you are experiencing an acute medical emergency, immediately contact your local emergency services or visit the nearest emergency room.",
        summary: "All quotation ranges, procedural timelines, and hospital options provided by AKEEZO are for informational guidance and financial planning. Final treatment protocols and hospital billing are determined after in-person clinical evaluation.",
      });
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      setSaveSuccess(false);

      const res = await fetch(`/api/v1/admin/pages/${selectedSlug}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          payload,
          seo,
          publishImmediately: true,
        }),
      });

      if (res.ok) {
        setSaveSuccess(true);
        await fetchPagesList();
        setTimeout(() => setSaveSuccess(false), 4000);
      } else {
        const error = await res.json();
        alert(`Failed to save page: ${error.error?.message || "Unknown error"}`);
      }
    } catch (err: any) {
      alert(`Error saving page: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  const currentPath = selectedSlug === "home" ? "/" : `/${selectedSlug}`;

  return (
    <div className="space-y-6">
      {/* Header & Page Selector */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h2 className="text-base font-bold text-slate-800 flex items-center gap-2">
            <FileText className="w-5 h-5 text-teal-700" />
            <span>Page Content & Public SEO Management</span>
          </h2>
          <p className="text-xs text-slate-500">
            Publish revisions to discovery routes. Changes update MongoDB route entries and reflect live on SSR instantly.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <a
            href={`http://localhost:4000${currentPath}`}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 text-xs text-teal-700 hover:text-teal-900 font-bold border border-teal-600 hover:bg-teal-50 px-3 py-1.5 rounded-lg transition"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>View Live Route ({currentPath})</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>

          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-1.5 bg-teal-800 hover:bg-teal-900 active:bg-teal-950 text-white text-xs font-bold px-4 py-2 rounded-lg shadow-sm transition"
          >
            {saveSuccess ? (
              <>
                <Check className="w-4 h-4 text-emerald-300" />
                <span>Published Live!</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>{saving ? "Publishing..." : "Save & Publish Revision"}</span>
              </>
            )}
          </button>
        </div>
      </div>

      {saveSuccess && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-xs font-semibold text-emerald-900 flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-600" />
          <span>New content revision created and route entry updated! Live SSR on <strong>{currentPath}</strong> is now rendering this revision.</span>
        </div>
      )}

      {/* Page Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 overflow-x-auto pb-1">
        {[
          { slug: "home", label: "Home Discovery (/)" },
          { slug: "privacy", label: "Privacy Policy (/privacy)" },
          { slug: "terms", label: "Terms of Service (/terms)" },
          { slug: "disclaimer", label: "Medical Disclaimer (/disclaimer)" },
        ].map((tab) => (
          <button
            key={tab.slug}
            type="button"
            onClick={() => setSelectedSlug(tab.slug)}
            className={`px-3 py-2 text-xs font-bold rounded-t-lg transition flex items-center gap-1.5 border-b-2 ${
              selectedSlug === tab.slug
                ? "border-teal-700 text-teal-900 bg-teal-50/60"
                : "border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-50"
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {loading ? (
        <div className="p-8 text-center text-xs text-slate-400">Loading page revision data...</div>
      ) : (
        <form onSubmit={handleSave} className="space-y-6">
          {/* SEO Metadata Card */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="text-xs font-bold uppercase tracking-wider text-teal-800 flex items-center gap-2">
                <Search className="w-4 h-4" />
                <span>Search Engine Optimization (SEO) & OpenGraph Metadata</span>
              </h3>
              <span className="text-[10px] text-slate-400 font-mono">Route: {currentPath}</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Page Meta Title</label>
                <input
                  type="text"
                  value={seo.title || ""}
                  onChange={(e) => setSeo({ ...seo, title: e.target.value })}
                  placeholder="e.g. AKEEZO Healthcare Platform | World-Class Medical Care in India"
                  className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-teal-700"
                />
                <p className="text-[10px] text-slate-400">Appears in browser tabs and search engine headline results.</p>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Robots Directive</label>
                <select
                  value={seo.robots || "index,follow"}
                  onChange={(e) => setSeo({ ...seo, robots: e.target.value })}
                  className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-teal-700"
                >
                  <option value="index,follow">index, follow (Public Search Indexing)</option>
                  <option value="noindex,nofollow">noindex, nofollow (Private / Internal)</option>
                  <option value="index,nofollow">index, nofollow</option>
                  <option value="noindex,follow">noindex, follow</option>
                </select>
                <p className="text-[10px] text-slate-400">Controls Google, Bing, and web crawler indexing policies.</p>
              </div>

              <div className="space-y-1 md:col-span-2">
                <label className="text-xs font-semibold text-slate-700">Meta Description</label>
                <textarea
                  rows={2}
                  value={seo.description || ""}
                  onChange={(e) => setSeo({ ...seo, description: e.target.value })}
                  placeholder="Brief 150-160 character snippet summarizing the page value proposition..."
                  className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-teal-700"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Canonical Path</label>
                <input
                  type="text"
                  value={seo.canonicalPath || ""}
                  onChange={(e) => setSeo({ ...seo, canonicalPath: e.target.value })}
                  className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg font-mono text-slate-600 focus:outline-none focus:ring-1 focus:ring-teal-700"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Schema.org Structured Data Kind</label>
                <input
                  type="text"
                  value={seo.schemaKind || "MedicalWebPage"}
                  onChange={(e) => setSeo({ ...seo, schemaKind: e.target.value })}
                  className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg font-mono text-slate-600 focus:outline-none focus:ring-1 focus:ring-teal-700"
                />
              </div>
            </div>
          </div>

          {/* Page Content Editor Card */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="text-xs font-bold uppercase tracking-wider text-teal-800 flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                <span>
                  {selectedSlug === "home" ? "Home Discovery Hero & Highlights" : "Legal Document & Policy Content"}
                </span>
              </h3>
              <span className="text-[10px] text-slate-400">Content Model: {selectedSlug}</span>
            </div>

            {selectedSlug === "home" ? (
              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Hero Main Headline</label>
                  <input
                    type="text"
                    value={payload.headline || ""}
                    onChange={(e) => setPayload({ ...payload, headline: e.target.value })}
                    placeholder="e.g. World-Class Healthcare in India, Simplified & Trusted"
                    className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-teal-700"
                  />
                  <p className="text-[10px] text-slate-400">Primary hero value proposition header displayed to visiting patients.</p>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Hero Subheadline / Mission Narrative</label>
                  <textarea
                    rows={3}
                    value={payload.subheadline || ""}
                    onChange={(e) => setPayload({ ...payload, subheadline: e.target.value })}
                    placeholder="Direct connections to India's top accredited hospitals, verified procedure pricing..."
                    className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-teal-700"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-700">Search Bar Placeholder</label>
                    <input
                      type="text"
                      value={payload.searchPlaceholder || ""}
                      onChange={(e) => setPayload({ ...payload, searchPlaceholder: e.target.value })}
                      placeholder="Search surgeries, robotic oncology, CAR-T, IVF..."
                      className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-teal-700"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-700">Hero Verification Badge</label>
                    <input
                      type="text"
                      value={payload.heroBadge || ""}
                      onChange={(e) => setPayload({ ...payload, heroBadge: e.target.value })}
                      placeholder="JCI & NABH ACCREDITED NETWORK"
                      className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-teal-700"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Trust Metrics & Statistics Tagline</label>
                  <input
                    type="text"
                    value={payload.statsTagline || ""}
                    onChange={(e) => setPayload({ ...payload, statsTagline: e.target.value })}
                    placeholder="Over 12,000+ international and domestic patients coordinated with zero hidden facilitation fees."
                    className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-teal-700"
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-700">Document Title</label>
                    <input
                      type="text"
                      value={payload.title || ""}
                      onChange={(e) => setPayload({ ...payload, title: e.target.value })}
                      placeholder="e.g. Privacy & Health Data Protection Policy"
                      className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-teal-700"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-700">Effective Date</label>
                    <input
                      type="text"
                      value={payload.effectiveDate || "2026-10-14"}
                      onChange={(e) => setPayload({ ...payload, effectiveDate: e.target.value })}
                      className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-teal-700"
                    />
                  </div>
                </div>

                {selectedSlug === "privacy" && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-700">Compliance Frameworks</label>
                      <input
                        type="text"
                        value={payload.complianceStandards || ""}
                        onChange={(e) => setPayload({ ...payload, complianceStandards: e.target.value })}
                        placeholder="GDPR, HIPAA, DPDP Act 2023 (India), UK DPA 2018"
                        className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-teal-700"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-700">DPO / Privacy Office Email</label>
                      <input
                        type="email"
                        value={payload.dpoContact || ""}
                        onChange={(e) => setPayload({ ...payload, dpoContact: e.target.value })}
                        placeholder="privacy@akeezo.com"
                        className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-teal-700"
                      />
                    </div>
                  </div>
                )}

                {selectedSlug === "disclaimer" && (
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-amber-800 flex items-center gap-1.5">
                      <AlertCircle className="w-4 h-4 text-amber-600" />
                      <span>Urgent Medical Emergency Notice</span>
                    </label>
                    <textarea
                      rows={2}
                      value={payload.emergencyNotice || ""}
                      onChange={(e) => setPayload({ ...payload, emergencyNotice: e.target.value })}
                      className="w-full text-xs px-3 py-2 border border-amber-300 bg-amber-50/40 rounded-lg focus:outline-none focus:ring-1 focus:ring-amber-700"
                    />
                  </div>
                )}

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Executive Summary & Operational Scope</label>
                  <textarea
                    rows={4}
                    value={payload.summary || ""}
                    onChange={(e) => setPayload({ ...payload, summary: e.target.value })}
                    placeholder="Enter formal executive scope and preamble..."
                    className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-teal-700"
                  />
                </div>
              </div>
            )}
          </div>
        </form>
      )}
    </div>
  );
};
