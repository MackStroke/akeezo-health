import React, { useState } from "react";
import { Palette, FileText, Inbox, Globe, ExternalLink, ShieldCheck } from "lucide-react";
import { SiteSettingsTab } from "./SiteSettingsTab.js";
import { PageContentTab } from "./PageContentTab.js";
import { PublicEnquiriesTab } from "./PublicEnquiriesTab.js";

export const SiteAdminView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"settings" | "pages" | "enquiries">("settings");

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-teal-900 via-teal-800 to-slate-900 rounded-2xl p-6 text-white shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-teal-700/60 text-teal-200 border border-teal-500/30">
            <ShieldCheck className="w-3.5 h-3.5 text-teal-300" />
            <span>Dedicated Public Site CMS & Content Operations</span>
          </div>
          <h1 className="text-xl font-black tracking-tight">Website Front End & Content Administration</h1>
          <p className="text-xs text-teal-100/80 max-w-2xl leading-relaxed">
            Manage public discovery portal identity, emergency helplines, landing page heroes, legal policies, and incoming public leads independently from the core B2B Case Operations ERP.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <a
            href="http://localhost:4000/"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 active:bg-white/30 text-white text-xs font-bold px-4 py-2.5 rounded-xl border border-white/20 shadow-xs transition"
          >
            <Globe className="w-4 h-4 text-teal-300" />
            <span>Open Public Site</span>
            <ExternalLink className="w-3.5 h-3.5 opacity-70" />
          </a>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-slate-200 gap-2">
        <button
          type="button"
          onClick={() => setActiveTab("settings")}
          className={`px-4 py-3 text-xs font-bold border-b-2 flex items-center gap-2 transition ${
            activeTab === "settings"
              ? "border-teal-800 text-teal-900 bg-teal-50/50 rounded-t-lg"
              : "border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-50"
          }`}
        >
          <Palette className="w-4 h-4" />
          <span>Brand Identity & Helplines</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("pages")}
          className={`px-4 py-3 text-xs font-bold border-b-2 flex items-center gap-2 transition ${
            activeTab === "pages"
              ? "border-teal-800 text-teal-900 bg-teal-50/50 rounded-t-lg"
              : "border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-50"
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Page Content & SEO</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("enquiries")}
          className={`px-4 py-3 text-xs font-bold border-b-2 flex items-center gap-2 transition ${
            activeTab === "enquiries"
              ? "border-teal-800 text-teal-900 bg-teal-50/50 rounded-t-lg"
              : "border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-50"
          }`}
        >
          <Inbox className="w-4 h-4" />
          <span>Public Website Enquiries</span>
        </button>
      </div>

      {/* Tab Panels */}
      <div>
        {activeTab === "settings" && <SiteSettingsTab />}
        {activeTab === "pages" && <PageContentTab />}
        {activeTab === "enquiries" && <PublicEnquiriesTab />}
      </div>
    </div>
  );
};
