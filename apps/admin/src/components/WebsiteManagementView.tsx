import React, { useState } from "react";
import { Palette, FileText, Globe, ExternalLink, ShieldCheck } from "lucide-react";
import { SiteSettingsTab } from "./SiteSettingsTab.js";
import { PageContentTab } from "./PageContentTab.js";

export const WebsiteManagementView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"settings" | "pages">("settings");

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-teal-900 via-teal-800 to-slate-900 rounded-2xl p-6 text-white shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-teal-700/60 text-teal-200 border border-teal-500/30">
            <ShieldCheck className="w-3.5 h-3.5 text-teal-300" />
            <span>Website Management & Content CMS</span>
          </div>
          <h1 className="text-xl font-black tracking-tight">Public Website & Brand Administration</h1>
          <p className="text-xs text-teal-100/80 max-w-2xl leading-relaxed">
            Overall responsible for website management: brand identity, emergency helplines, WhatsApp direct channels, landing page heroes, treatments, and legal policies with full draft revision and atomic publishing lifecycle.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <a
            href="/"
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
          <span>Pages & Content Revisions</span>
        </button>
      </div>

      {/* Tab Panels */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
        {activeTab === "settings" && <SiteSettingsTab />}
        {activeTab === "pages" && <PageContentTab />}
      </div>
    </div>
  );
};
