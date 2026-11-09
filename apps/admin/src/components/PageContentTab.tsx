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
  AlertCircle,
  Globe,
  Share2,
  ListFilter,
  CheckCircle2,
  Stethoscope,
  Building2,
  HeartPulse,
  Compass,
  MessageSquare,
  Users,
  Calculator,
  BookOpen,
  Scale,
} from "lucide-react";
import { CatalogueItemsManager, type CatalogueItemType } from "./CatalogueItemsManager.js";

interface PageOption {
  slug: string;
  name: string;
  path: string;
  category: "core" | "legal";
  icon: React.ComponentType<{ className?: string }>;
  itemType?: CatalogueItemType;
  collectionKey?: string;
}

const PAGE_OPTIONS: PageOption[] = [
  {
    slug: "cost-calculator",
    name: "Plan My Journey (Cost Calculator)",
    path: "/cost-calculator",
    category: "core",
    icon: Calculator,
    itemType: "procedure",
    collectionKey: "procedures",
  },
  {
    slug: "doctors",
    name: "Doctors & Specialists",
    path: "/doctors",
    category: "core",
    icon: Stethoscope,
    itemType: "doctor",
    collectionKey: "doctors",
  },
  {
    slug: "hospitals",
    name: "Hospitals",
    path: "/hospitals",
    category: "core",
    icon: Building2,
    itemType: "hospital",
    collectionKey: "hospitals",
  },
  {
    slug: "treatments",
    name: "Treatments",
    path: "/treatments",
    category: "core",
    icon: HeartPulse,
    itemType: "treatment",
    collectionKey: "treatments",
  },
  {
    slug: "destinations",
    name: "Destinations",
    path: "/destinations",
    category: "core",
    icon: Compass,
    itemType: "destination",
    collectionKey: "destinations",
  },
  {
    slug: "home",
    name: "Community & Homepage",
    path: "/",
    category: "core",
    icon: MessageSquare,
    itemType: "community",
    collectionKey: "community",
  },
  {
    slug: "about",
    name: "About Us & Team",
    path: "/about",
    category: "core",
    icon: Users,
    itemType: "teamMember",
    collectionKey: "teamMembers",
  },
  {
    slug: "blog",
    name: "Blogs & Clinical Guides",
    path: "/blog",
    category: "core",
    icon: BookOpen,
  },
  // Legal
  {
    slug: "privacy",
    name: "Privacy Policy",
    path: "/privacy",
    category: "legal",
    icon: Scale,
  },
  {
    slug: "terms",
    name: "Terms of Service",
    path: "/terms",
    category: "legal",
    icon: Scale,
  },
  {
    slug: "disclaimer",
    name: "Medical Disclaimer",
    path: "/disclaimer",
    category: "legal",
    icon: Scale,
  },
  {
    slug: "consent",
    name: "Patient Consent Agreement",
    path: "/consent",
    category: "legal",
    icon: Scale,
  },
  {
    slug: "refund-policy",
    name: "Refund Policy",
    path: "/refund-policy",
    category: "legal",
    icon: Scale,
  },
  {
    slug: "grievance-officer",
    name: "Grievance Redressal",
    path: "/grievance-officer",
    category: "legal",
    icon: Scale,
  },
];

export const PageContentTab: React.FC = () => {
  const [selectedSlug, setSelectedSlug] = useState<string>("cost-calculator");
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState<string>("");
  const [saveErrorMsg, setSaveErrorMsg] = useState<string>("");
  const [activeTab, setActiveTab] = useState<"sections" | "catalogue" | "seo">("sections");

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
  const [_revisions, setRevisions] = useState<any[]>([]);

  const currentPageOption = PAGE_OPTIONS.find((p) => p.slug === selectedSlug) || PAGE_OPTIONS[0];

  useEffect(() => {
    fetchPageDetail(selectedSlug);
  }, [selectedSlug]);

  const fetchPageDetail = async (slug: string) => {
    try {
      setLoading(true);
      setSaveSuccessMsg("");
      setSaveErrorMsg("");
      const res = await fetch(`/api/v1/admin/pages/${slug}`);
      if (res.ok) {
        const json = await res.json();
        setPageMeta(json.data.page);
        setSeo(
          json.data.seo || {
            title: `${slug.toUpperCase()} | AKEEZO Healthcare Platform`,
            description: "World-Class Medical Care in India",
            canonicalPath: slug === "home" ? "/" : `/${slug}`,
            robots: "index,follow",
            schemaKind: "MedicalWebPage",
          }
        );
        setPayload(json.data.payload || {});
        setRevisions(json.data.revisions || []);
      } else {
        setPageMeta(null);
        setPayload({});
        setSeo({
          title: `${slug.toUpperCase()} | AKEEZO`,
          description: "Healthcare discovery and medical travel coordination",
          canonicalPath: slug === "home" ? "/" : `/${slug}`,
          robots: "index,follow",
          schemaKind: "MedicalWebPage",
        });
      }
    } catch (err: any) {
      console.error("Failed to load page detail", err);
      setSaveErrorMsg(err.message || "Failed to load page details.");
    } finally {
      setLoading(false);
    }
  };

  const handleSavePage = async (publishImmediately: boolean = true) => {
    try {
      setSaving(true);
      setSaveSuccessMsg("");
      setSaveErrorMsg("");

      const res = await fetch(`/api/v1/admin/pages/${selectedSlug}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          payload,
          seo,
          publishImmediately,
        }),
      });

      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.error?.message || "Failed to save page.");
      }

      setSaveSuccessMsg(
        publishImmediately
          ? `Page '${currentPageOption.name}' published live to website successfully!`
          : `Draft saved for '${currentPageOption.name}'.`
      );
      if (json.data?.page) {
        setPageMeta(json.data.page);
      }
    } catch (err: any) {
      setSaveErrorMsg(err.message || "Save failed.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 font-sans">
      {/* 1. PAGE SELECTOR PILLS */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Select Core Discovery Page to Manage
          </span>
          <span className="text-[11px] text-slate-400">8 Primary Nav Links & Sections</span>
        </div>

        <div className="flex flex-wrap gap-2">
          {PAGE_OPTIONS.filter((p) => p.category === "core").map((opt) => {
            const Icon = opt.icon;
            const isSelected = selectedSlug === opt.slug;
            return (
              <button
                key={opt.slug}
                type="button"
                onClick={() => {
                  setSelectedSlug(opt.slug);
                  if (opt.itemType && activeTab === "catalogue") {
                    // keep catalogue tab
                  } else {
                    setActiveTab("sections");
                  }
                }}
                className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition shadow-2xs cursor-pointer ${
                  isSelected
                    ? "bg-[#007A6C] text-white shadow-xs"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isSelected ? "text-[#00C7BE]" : "text-slate-500"}`} />
                <span>{opt.name}</span>
              </button>
            );
          })}
        </div>

        {/* Legal Pages Dropdown */}
        <details className="pt-1 text-xs">
          <summary className="text-slate-500 hover:text-slate-800 font-bold cursor-pointer select-none">
            &gt; Legal, Privacy & Compliance Policies ({PAGE_OPTIONS.filter((p) => p.category === "legal").length})
          </summary>
          <div className="flex flex-wrap gap-1.5 pt-2">
            {PAGE_OPTIONS.filter((p) => p.category === "legal").map((opt) => (
              <button
                key={opt.slug}
                type="button"
                onClick={() => setSelectedSlug(opt.slug)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition cursor-pointer ${
                  selectedSlug === opt.slug
                    ? "bg-slate-800 text-white"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {opt.name}
              </button>
            ))}
          </div>
        </details>
      </div>

      {/* 2. ACTIVE PAGE BANNER */}
      <div className="bg-slate-50 rounded-2xl p-4 sm:p-5 border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-base font-bold text-slate-900">{currentPageOption.name}</span>
            <span
              className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                pageMeta?.status === "published"
                  ? "bg-emerald-100 text-emerald-800"
                  : "bg-amber-100 text-amber-800"
              }`}
            >
              {pageMeta?.status || "Draft"}
            </span>
            {pageMeta?.version && (
              <span className="text-[10px] font-mono text-slate-500 bg-white px-2 py-0.5 rounded-md border border-slate-200">
                Rev v{pageMeta.version}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span>Live Route:</span>
            <code className="text-[#007A6C] font-mono font-bold">{currentPageOption.path}</code>
          </div>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <a
            href={currentPageOption.path}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-slate-700 bg-white hover:bg-slate-100 border border-slate-300 rounded-xl transition shadow-2xs"
          >
            <span>Preview Live</span>
            <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
          </a>

          <button
            type="button"
            onClick={() => handleSavePage(false)}
            disabled={saving}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-slate-700 bg-white hover:bg-slate-100 border border-slate-300 rounded-xl transition shadow-2xs disabled:opacity-50 cursor-pointer"
          >
            <span>Save Draft</span>
          </button>

          <button
            type="button"
            onClick={() => handleSavePage(true)}
            disabled={saving}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-[#007A6C] hover:bg-[#005F54] rounded-xl transition shadow-xs disabled:opacity-50 cursor-pointer"
          >
            <Check className="w-4 h-4" />
            <span>{saving ? "Publishing..." : "Publish to Live"}</span>
          </button>
        </div>
      </div>

      {/* Notifications */}
      {saveSuccessMsg && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span className="font-medium">{saveSuccessMsg}</span>
        </div>
      )}
      {saveErrorMsg && (
        <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          <span className="font-medium">{saveErrorMsg}</span>
        </div>
      )}

      {/* 3. SEGMENTED TABS */}
      <div className="flex border-b border-slate-200 gap-3">
        <button
          type="button"
          onClick={() => setActiveTab("sections")}
          className={`pb-3 text-xs font-bold border-b-2 flex items-center gap-2 transition cursor-pointer ${
            activeTab === "sections"
              ? "border-[#007A6C] text-[#007A6C]"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Hero & Sections Content</span>
        </button>

        {currentPageOption.itemType && (
          <button
            type="button"
            onClick={() => setActiveTab("catalogue")}
            className={`pb-3 text-xs font-bold border-b-2 flex items-center gap-2 transition cursor-pointer ${
              activeTab === "catalogue"
                ? "border-[#007A6C] text-[#007A6C]"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>
              Catalogue Listings (
              {Array.isArray(payload[currentPageOption.collectionKey || ""])
                ? payload[currentPageOption.collectionKey || ""].length
                : 0}
              )
            </span>
          </button>
        )}

        <button
          type="button"
          onClick={() => setActiveTab("seo")}
          className={`pb-3 text-xs font-bold border-b-2 flex items-center gap-2 transition cursor-pointer ${
            activeTab === "seo"
              ? "border-[#007A6C] text-[#007A6C]"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          <Share2 className="w-4 h-4" />
          <span>SEO & Metadata</span>
        </button>
      </div>

      {/* 4. TAB PANELS */}
      {loading ? (
        <div className="p-12 text-center text-xs text-slate-400">Loading page content...</div>
      ) : (
        <>
          {/* TAB 1: HERO & SECTIONS */}
          {activeTab === "sections" && (
            <div className="space-y-4 bg-white p-5 rounded-2xl border border-slate-200">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Hero Banner & Promotional Copy
              </h3>

              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Primary Headline (H1)
                  </label>
                  <input
                    type="text"
                    value={payload.headline || payload.title || ""}
                    onChange={(e) => setPayload({ ...payload, headline: e.target.value })}
                    className="w-full text-xs px-3 py-2 border border-slate-300 rounded-xl focus:border-[#007A6C] focus:outline-none"
                    placeholder="Page Hero Title..."
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Subheadline / Reassurance Text
                  </label>
                  <textarea
                    rows={2}
                    value={payload.subheadline || payload.summary || ""}
                    onChange={(e) => setPayload({ ...payload, subheadline: e.target.value })}
                    className="w-full text-xs px-3 py-2 border border-slate-300 rounded-xl focus:border-[#007A6C] focus:outline-none"
                    placeholder="Subtitle or introduction..."
                  />
                </div>

                {/* Additional custom section fields per page */}
                {selectedSlug === "treatments" && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-slate-100">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Top Treatments Carousel Title
                      </label>
                      <input
                        type="text"
                        value={payload.topTreatmentsTitle || "Top Treatments on AKEEZO"}
                        onChange={(e) => setPayload({ ...payload, topTreatmentsTitle: e.target.value })}
                        className="w-full text-xs px-3 py-2 border border-slate-300 rounded-xl focus:border-[#007A6C] focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        All Treatments Directory Title
                      </label>
                      <input
                        type="text"
                        value={payload.allTreatmentsTitle || "All Treatments"}
                        onChange={(e) => setPayload({ ...payload, allTreatmentsTitle: e.target.value })}
                        className="w-full text-xs px-3 py-2 border border-slate-300 rounded-xl focus:border-[#007A6C] focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Free Consultation Banner Title
                      </label>
                      <input
                        type="text"
                        value={payload.freeConsultationTitle || "AKEEZO Care Is Absolutely Free"}
                        onChange={(e) => setPayload({ ...payload, freeConsultationTitle: e.target.value })}
                        className="w-full text-xs px-3 py-2 border border-slate-300 rounded-xl focus:border-[#007A6C] focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Confident Healthcare Banner Title
                      </label>
                      <input
                        type="text"
                        value={payload.confidentHealthcareTitle || "Make Confident Healthcare Decisions"}
                        onChange={(e) => setPayload({ ...payload, confidentHealthcareTitle: e.target.value })}
                        className="w-full text-xs px-3 py-2 border border-slate-300 rounded-xl focus:border-[#007A6C] focus:outline-none"
                      />
                    </div>
                  </div>
                )}

                {selectedSlug === "cost-calculator" && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-slate-100">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Hero Badge Text</label>
                      <input
                        type="text"
                        value={payload.badgeText || "100% Free · No Commissions"}
                        onChange={(e) => setPayload({ ...payload, badgeText: e.target.value })}
                        className="w-full text-xs px-3 py-2 border border-slate-300 rounded-xl focus:border-[#007A6C] focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Disclaimer Text</label>
                      <input
                        type="text"
                        value={payload.disclaimerText || "All cost figures are indicative benchmarks."}
                        onChange={(e) => setPayload({ ...payload, disclaimerText: e.target.value })}
                        className="w-full text-xs px-3 py-2 border border-slate-300 rounded-xl focus:border-[#007A6C] focus:outline-none"
                      />
                    </div>
                  </div>
                )}

                {selectedSlug === "about" && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-slate-100">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Our Mission</label>
                      <textarea
                        rows={2}
                        value={payload.mission || ""}
                        onChange={(e) => setPayload({ ...payload, mission: e.target.value })}
                        className="w-full text-xs px-3 py-2 border border-slate-300 rounded-xl focus:border-[#007A6C] focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Our Vision</label>
                      <textarea
                        rows={2}
                        value={payload.vision || ""}
                        onChange={(e) => setPayload({ ...payload, vision: e.target.value })}
                        className="w-full text-xs px-3 py-2 border border-slate-300 rounded-xl focus:border-[#007A6C] focus:outline-none"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: CATALOGUE ITEMS MANAGER */}
          {activeTab === "catalogue" && currentPageOption.itemType && (
            <div className="bg-white p-5 rounded-2xl border border-slate-200">
              <CatalogueItemsManager
                pageSlug={selectedSlug}
                itemType={currentPageOption.itemType}
                collectionKey={currentPageOption.collectionKey || "items"}
                items={Array.isArray(payload[currentPageOption.collectionKey || ""]) ? payload[currentPageOption.collectionKey || ""] : []}
                onItemsChange={(newItems) => {
                  setPayload({
                    ...payload,
                    [currentPageOption.collectionKey || "items"]: newItems,
                  });
                }}
                onSaveRevision={async (patch) => {
                  const updated = { ...payload, ...patch };
                  setPayload(updated);
                  const res = await fetch(`/api/v1/admin/pages/${selectedSlug}`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                      payload: updated,
                      seo,
                      publishImmediately: true,
                    }),
                  });
                  if (res.ok) {
                    setSaveSuccessMsg(`Catalogue items published live!`);
                  }
                }}
              />
            </div>
          )}

          {/* TAB 3: SEO & METADATA */}
          {activeTab === "seo" && (
            <div className="space-y-4 bg-white p-5 rounded-2xl border border-slate-200">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Search Engine Optimization & Social Previews
              </h3>

              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Meta Title</label>
                  <input
                    type="text"
                    value={seo.title || ""}
                    onChange={(e) => setSeo({ ...seo, title: e.target.value })}
                    className="w-full text-xs px-3 py-2 border border-slate-300 rounded-xl focus:border-[#007A6C] focus:outline-none"
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
                    className="w-full text-xs px-3 py-2 border border-slate-300 rounded-xl focus:border-[#007A6C] focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Canonical URL</label>
                    <input
                      type="text"
                      value={seo.canonicalPath || ""}
                      onChange={(e) => setSeo({ ...seo, canonicalPath: e.target.value })}
                      className="w-full text-xs px-3 py-2 border border-slate-300 rounded-xl focus:border-[#007A6C] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Robots Directive
                    </label>
                    <select
                      value={seo.robots || "index,follow"}
                      onChange={(e) => setSeo({ ...seo, robots: e.target.value })}
                      className="w-full text-xs px-3 py-2 border border-slate-300 rounded-xl focus:border-[#007A6C] focus:outline-none"
                    >
                      <option value="index,follow">index, follow (Default)</option>
                      <option value="noindex,follow">noindex, follow</option>
                      <option value="noindex,nofollow">noindex, nofollow</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};
