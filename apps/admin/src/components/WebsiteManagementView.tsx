import React, { useState } from "react";
import { Palette, FileText, Globe, ExternalLink, ShieldCheck, Sliders } from "lucide-react";
import { SiteSettingsTab } from "./SiteSettingsTab.js";
import { PageContentTab } from "./PageContentTab.js";
import { HeroCarouselManager } from "./HeroCarouselManager.js";

export const WebsiteManagementView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"settings" | "carousel" | "pages">("settings");

  return (
    <div className="space-y-6 font-sans">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-[#061E1B] via-teal-950 to-[#061E1B] rounded-2xl p-6 text-white shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4 border border-[#00C7BE]/30 relative overflow-hidden">
        <div className="space-y-1 relative z-10">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#007A6C]/50 text-[#00C7BE] border border-[#00C7BE]/30">
            <ShieldCheck className="w-3.5 h-3.5 text-[#00C7BE]" />
            <span>Website Management & Content CMS</span>
          </div>
          <h1 className="text-xl font-black tracking-tight">Public Website & Brand Administration</h1>
          <p className="text-xs text-teal-100/80 max-w-2xl leading-relaxed">
            Super Admin control over website branding, emergency helplines, WhatsApp direct channels, landing page heroes, treatments, and legal policies with full draft revision and atomic publishing lifecycle.
          </p>
        </div>

        <div className="flex items-center gap-3 relative z-10">
          <a
            href="/"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 active:scale-98 text-white text-xs font-bold px-4 py-2.5 rounded-xl border border-white/20 shadow-xs transition"
          >
            <Globe className="w-4 h-4 text-[#00C7BE]" />
            <span>Open Public Site</span>
            <ExternalLink className="w-3.5 h-3.5 opacity-80" />
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
              ? "border-[#007A6C] text-[#007A6C] bg-[#E6F8F6]/60 rounded-t-lg"
              : "border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-50"
          }`}
        >
          <Palette className="w-4 h-4 text-[#007A6C]" />
          <span>Brand Identity & Helplines</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("carousel")}
          className={`px-4 py-3 text-xs font-bold border-b-2 flex items-center gap-2 transition ${
            activeTab === "carousel"
              ? "border-[#007A6C] text-[#007A6C] bg-[#E6F8F6]/60 rounded-t-lg"
              : "border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-50"
          }`}
        >
          <Sliders className="w-4 h-4 text-[#007A6C]" />
          <span>Feature Carousel</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("pages")}
          className={`px-4 py-3 text-xs font-bold border-b-2 flex items-center gap-2 transition ${
            activeTab === "pages"
              ? "border-[#007A6C] text-[#007A6C] bg-[#E6F8F6]/60 rounded-t-lg"
              : "border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-50"
          }`}
        >
          <FileText className="w-4 h-4 text-[#007A6C]" />
          <span>Pages & Content Revisions</span>
        </button>
      </div>

      {/* Tab Panels */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
        {activeTab === "settings" && <SiteSettingsTab />}
        {activeTab === "carousel" && <HeroCarouselManager />}
        {activeTab === "pages" && <PageContentTab />}
      </div>
    </div>
  );
};
