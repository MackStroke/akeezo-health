import React, { useState } from "react";
import {
  Palette,
  Check,
  Save,
  RotateCcw,
  Sparkles,
  Monitor,
  Layout,
  Sun,
  Moon,
  Type,
  Layers,
  Sliders,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
} from "lucide-react";
import { useTheme } from "../context/ThemeContext.js";
import {
  THEME_PRESETS,
  type WebsiteTheme,
  type AdminTheme,
} from "@akeezo/contracts";

export const ThemeStudioView: React.FC = () => {
  const {
    websiteTheme,
    adminTheme,
    updateWebsiteToken,
    updateAdminToken,
    applyPreset,
    resetToDefaults,
    saveTheme,
    isSaving,
    saveMessage,
    saveError,
  } = useTheme();

  const [activeScope, setActiveScope] = useState<"website" | "admin">("website");
  const [activeCategory, setActiveCategory] = useState<
    "colors" | "surfaces" | "typography" | "geometry"
  >("colors");
  const [presetTarget, setPresetTarget] = useState<"both" | "active">("both");

  return (
    <div className="space-y-6 font-sans">
      {/* 1. Header Banner */}
      <div className="bg-gradient-to-r from-[#061E1B] via-teal-950 to-[#061E1B] rounded-2xl p-6 text-white shadow-md border border-[#00C7BE]/30 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#007A6C]/50 text-[#00C7BE] border border-[#00C7BE]/30">
            <Sparkles className="w-3.5 h-3.5 text-[#00C7BE]" />
            <span>Theme & Brand Architecture</span>
          </div>
          <h1 className="text-xl font-black tracking-tight">Theme Studio & Design Tokens</h1>
          <p className="text-xs text-teal-100/80 max-w-2xl leading-relaxed">
            Customize theme colors, surface shades, button styles, typography, and corner radiuses for both the Public Website and the Admin Panel. Changes are saved to MongoDB and injected via real-time CSS variables with zero hardcoding.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            type="button"
            onClick={() => resetToDefaults(activeScope)}
            disabled={isSaving}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-300 hover:text-white bg-white/10 hover:bg-white/20 rounded-xl transition border border-white/20 disabled:opacity-50"
            title="Reset active theme to verified brand defaults"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Defaults</span>
          </button>

          <a
            href="/"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-[#00C7BE] hover:text-white bg-[#007A6C]/40 hover:bg-[#007A6C] rounded-xl transition border border-[#00C7BE]/40"
          >
            <span>Live Website</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>

          <button
            type="button"
            onClick={saveTheme}
            disabled={isSaving}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-[#FF6B00] hover:bg-[#FF6D1B] active:bg-[#E05E00] rounded-xl shadow-md transition disabled:opacity-50"
          >
            {isSaving ? (
              <span>Saving...</span>
            ) : (
              <>
                <Save className="w-3.5 h-3.5" />
                <span>Save & Publish Theme</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* 2. Notifications Banner */}
      {saveMessage && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span className="font-semibold">{saveMessage}</span>
        </div>
      )}
      {saveError && (
        <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          <span className="font-semibold">{saveError}</span>
        </div>
      )}

      {/* 3. 1-Click Curated Presets Bar */}
      <div
        className="rounded-2xl border p-5 shadow-xs space-y-3"
        style={{
          backgroundColor: "var(--admin-card-bg, #FFFFFF)",
          borderColor: "var(--admin-border, #E2E8F0)",
        }}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider" style={{ color: "var(--admin-text, #1E293B)" }}>
            <Palette className="w-4 h-4 text-[#007A6C]" />
            <span>Curated Brand Presets (1-Click Switch)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[11px]" style={{ color: "var(--admin-text-muted, #94A3B8)" }}>
              Apply Preset To:
            </span>
            <div className="inline-flex rounded-lg border p-0.5" style={{ borderColor: "var(--admin-border, #E2E8F0)" }}>
              <button
                type="button"
                onClick={() => setPresetTarget("both")}
                className={`px-2 py-0.5 text-[10px] font-bold rounded-md transition ${
                  presetTarget === "both"
                    ? "bg-[#007A6C] text-white shadow-xs"
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                Both Portals
              </button>
              <button
                type="button"
                onClick={() => setPresetTarget("active")}
                className={`px-2 py-0.5 text-[10px] font-bold rounded-md transition ${
                  presetTarget === "active"
                    ? "bg-[#007A6C] text-white shadow-xs"
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                {activeScope === "website" ? "Website Only" : "Admin Only"}
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {Object.values(THEME_PRESETS).map((preset) => {
            const isCurrent =
              websiteTheme.activePreset === preset.id ||
              adminTheme.activePreset === preset.id;
            return (
              <button
                key={preset.id}
                type="button"
                onClick={() => applyPreset(preset.id, presetTarget === "both" ? "both" : activeScope)}
                disabled={isSaving}
                className={`p-3.5 rounded-xl border text-left transition-all relative overflow-hidden group ${
                  isCurrent
                    ? "border-[#007A6C] bg-[#E6F8F6]/50 shadow-sm ring-2 ring-[#007A6C]/20"
                    : "border-slate-200 bg-slate-50 hover:bg-slate-100 hover:border-slate-300"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-slate-800 group-hover:text-[#007A6C]">
                    {preset.name.split("(")[0].trim()}
                  </span>
                  {isCurrent && (
                    <span className="inline-flex items-center gap-1 text-[9px] font-black uppercase px-1.5 py-0.5 rounded-full bg-[#007A6C] text-white">
                      Active
                    </span>
                  )}
                </div>

                {/* Color Swatch Dots */}
                <div className="flex items-center gap-1.5 mb-2">
                  <span
                    className="w-4 h-4 rounded-full border border-black/10 shadow-xs"
                    style={{ backgroundColor: preset.websiteTheme.primaryColor }}
                    title={`Primary: ${preset.websiteTheme.primaryColor}`}
                  />
                  <span
                    className="w-4 h-4 rounded-full border border-black/10 shadow-xs"
                    style={{ backgroundColor: preset.websiteTheme.secondaryColor }}
                    title={`Secondary: ${preset.websiteTheme.secondaryColor}`}
                  />
                  <span
                    className="w-4 h-4 rounded-full border border-black/10 shadow-xs"
                    style={{ backgroundColor: preset.websiteTheme.actionColor }}
                    title={`Action: ${preset.websiteTheme.actionColor}`}
                  />
                  <span
                    className="w-4 h-4 rounded-full border border-black/10 shadow-xs"
                    style={{ backgroundColor: preset.adminTheme.sidebarBackground }}
                    title={`Admin Sidebar: ${preset.adminTheme.sidebarBackground}`}
                  />
                </div>

                <p className="text-[10px] text-slate-500 line-clamp-2 leading-relaxed">
                  {preset.description}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. Target Scope Switcher (Public Website vs Admin Panel) */}
      <div className="flex items-center justify-between border-b border-slate-200">
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setActiveScope("website")}
            className={`px-4 py-3 text-xs font-bold border-b-2 flex items-center gap-2 transition ${
              activeScope === "website"
                ? "border-[#007A6C] text-[#007A6C] bg-[#E6F8F6]/60 rounded-t-xl"
                : "border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-50"
            }`}
          >
            <Monitor className="w-4 h-4 text-[#007A6C]" />
            <span>Public Website Theme Tokens</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveScope("admin")}
            className={`px-4 py-3 text-xs font-bold border-b-2 flex items-center gap-2 transition ${
              activeScope === "admin"
                ? "border-[#007A6C] text-[#007A6C] bg-[#E6F8F6]/60 rounded-t-xl"
                : "border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-50"
            }`}
          >
            <Layout className="w-4 h-4 text-[#007A6C]" />
            <span>Admin Panel Theme Tokens</span>
          </button>
        </div>

        {/* Display Mode Indicator (Light / Dark) */}
        <div className="flex items-center gap-2 pb-2">
          <span className="text-[11px] font-bold text-slate-500">Theme Mode:</span>
          {activeScope === "website" ? (
            <div className="inline-flex rounded-lg border border-slate-200 bg-slate-100 p-0.5 text-xs">
              <button
                type="button"
                onClick={() => updateWebsiteToken("mode", "light")}
                className={`px-2 py-1 rounded-md font-bold flex items-center gap-1 transition ${
                  websiteTheme.mode === "light"
                    ? "bg-white text-slate-900 shadow-xs"
                    : "text-slate-500 hover:text-slate-900"
                }`}
              >
                <Sun className="w-3 h-3 text-amber-500" />
                <span>Light</span>
              </button>
              <button
                type="button"
                onClick={() => updateWebsiteToken("mode", "dark")}
                className={`px-2 py-1 rounded-md font-bold flex items-center gap-1 transition ${
                  websiteTheme.mode === "dark"
                    ? "bg-slate-900 text-white shadow-xs"
                    : "text-slate-500 hover:text-slate-900"
                }`}
              >
                <Moon className="w-3 h-3 text-cyan-400" />
                <span>Dark</span>
              </button>
            </div>
          ) : (
            <div className="inline-flex rounded-lg border border-slate-200 bg-slate-100 p-0.5 text-xs">
              <button
                type="button"
                onClick={() => updateAdminToken("mode", "light")}
                className={`px-2 py-1 rounded-md font-bold flex items-center gap-1 transition ${
                  adminTheme.mode === "light"
                    ? "bg-white text-slate-900 shadow-xs"
                    : "text-slate-500 hover:text-slate-900"
                }`}
              >
                <Sun className="w-3 h-3 text-amber-500" />
                <span>Light</span>
              </button>
              <button
                type="button"
                onClick={() => updateAdminToken("mode", "dark")}
                className={`px-2 py-1 rounded-md font-bold flex items-center gap-1 transition ${
                  adminTheme.mode === "dark"
                    ? "bg-slate-900 text-white shadow-xs"
                    : "text-slate-500 hover:text-slate-900"
                }`}
              >
                <Moon className="w-3 h-3 text-cyan-400" />
                <span>Dark</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* 5. Main Workspace: Split between Token Controls & Live Interactive Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT COLUMN (7 COLS): TOKEN CONTROLS */}
        <div className="lg:col-span-7 space-y-4">
          {/* Subcategory switcher */}
          <div className="flex gap-2 p-1 bg-slate-100 rounded-xl">
            <button
              type="button"
              onClick={() => setActiveCategory("colors")}
              className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition flex items-center justify-center gap-1.5 ${
                activeCategory === "colors"
                  ? "bg-white text-slate-800 shadow-xs"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              <Palette className="w-3.5 h-3.5 text-[#007A6C]" />
              <span>Palette & Actions</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveCategory("surfaces")}
              className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition flex items-center justify-center gap-1.5 ${
                activeCategory === "surfaces"
                  ? "bg-white text-slate-800 shadow-xs"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              <Layers className="w-3.5 h-3.5 text-[#007A6C]" />
              <span>Surfaces & Borders</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveCategory("typography")}
              className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition flex items-center justify-center gap-1.5 ${
                activeCategory === "typography"
                  ? "bg-white text-slate-800 shadow-xs"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              <Type className="w-3.5 h-3.5 text-[#007A6C]" />
              <span>Typography</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveCategory("geometry")}
              className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition flex items-center justify-center gap-1.5 ${
                activeCategory === "geometry"
                  ? "bg-white text-slate-800 shadow-xs"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              <Sliders className="w-3.5 h-3.5 text-[#007A6C]" />
              <span>Corner Radii</span>
            </button>
          </div>

          {/* SCOPE 1: PUBLIC WEBSITE TOKENS */}
          {activeScope === "website" && (
            <div
              className="rounded-2xl border p-5 shadow-xs space-y-4"
              style={{
                backgroundColor: "var(--admin-card-bg, #FFFFFF)",
                borderColor: "var(--admin-border, #E2E8F0)",
              }}
            >
              {activeCategory === "colors" && (
                <div className="space-y-4">
                  <div className="text-xs font-bold" style={{ color: "var(--admin-text, #1E293B)" }}>
                    Primary Brand & Interaction Palette
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <ColorField
                      label="Primary Brand Color (Teal / Brand Accent)"
                      value={websiteTheme.primaryColor}
                      onChange={(v) => updateWebsiteToken("primaryColor", v)}
                      description="Used for branding badges, highlights, and secondary glow"
                    />
                    <ColorField
                      label="Action CTA Button (Dark Teal)"
                      value={websiteTheme.actionColor}
                      onChange={(v) => updateWebsiteToken("actionColor", v)}
                      description="Primary buttons, call-to-action cards, active links"
                    />
                    <ColorField
                      label="Secondary Brand Accent (Orange)"
                      value={websiteTheme.secondaryColor}
                      onChange={(v) => updateWebsiteToken("secondaryColor", v)}
                      description="Conversion buttons (Get Quote), urgency highlights"
                    />
                    <ColorField
                      label="Accent Orange Alt (Vibrant)"
                      value={websiteTheme.accentColor}
                      onChange={(v) => updateWebsiteToken("accentColor", v)}
                      description="Secondary hover and gradient transition accents"
                    />
                    <ColorField
                      label="Action Button Hover Shade"
                      value={websiteTheme.actionHoverColor}
                      onChange={(v) => updateWebsiteToken("actionHoverColor", v)}
                      description="Darkened or highlighted hover state for CTA buttons"
                    />
                    <ColorField
                      label="Action Accent Highlight"
                      value={websiteTheme.actionAccentColor}
                      onChange={(v) => updateWebsiteToken("actionAccentColor", v)}
                      description="Urgency text & pricing guarantee badge highlights"
                    />
                    <ColorField
                      label="Emergency / Urgent Notice Color"
                      value={websiteTheme.emergencyColor}
                      onChange={(v) => updateWebsiteToken("emergencyColor", v)}
                      description="24/7 emergency response bar and urgent notices"
                    />
                  </div>
                </div>
              )}

              {activeCategory === "surfaces" && (
                <div className="space-y-4">
                  <div className="text-xs font-bold" style={{ color: "var(--admin-text, #1E293B)" }}>
                    Background, Surfaces & Border Tints
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <ColorField
                      label="Global Page Background"
                      value={websiteTheme.backgroundColor}
                      onChange={(v) => updateWebsiteToken("backgroundColor", v)}
                      description="Base HTML canvas color"
                    />
                    <ColorField
                      label="Surface White / Card Color"
                      value={websiteTheme.surfaceColor}
                      onChange={(v) => updateWebsiteToken("surfaceColor", v)}
                      description="Hospital cards, modals, dropdowns"
                    />
                    <ColorField
                      label="Surface Muted (Neutral Slate)"
                      value={websiteTheme.surfaceMutedColor}
                      onChange={(v) => updateWebsiteToken("surfaceMutedColor", v)}
                      description="Section dividers, subtle backdrops"
                    />
                    <ColorField
                      label="Surface Teal Tint"
                      value={websiteTheme.surfaceTealColor}
                      onChange={(v) => updateWebsiteToken("surfaceTealColor", v)}
                      description="Subtle teal tint for featured procedure badges"
                    />
                    <ColorField
                      label="Surface Orange Tint"
                      value={websiteTheme.surfaceOrangeColor}
                      onChange={(v) => updateWebsiteToken("surfaceOrangeColor", v)}
                      description="Subtle orange tint for pricing guarantee cards"
                    />
                    <ColorField
                      label="Default Border Color"
                      value={websiteTheme.borderColor}
                      onChange={(v) => updateWebsiteToken("borderColor", v)}
                      description="Card outlines, table rows, input boundaries"
                    />
                    <ColorField
                      label="Border Teal Accent Color"
                      value={websiteTheme.borderTealColor}
                      onChange={(v) => updateWebsiteToken("borderTealColor", v)}
                      description="Card boundary highlights for featured clinical services"
                    />
                    <ColorField
                      label="Border Orange Accent Color"
                      value={websiteTheme.borderOrangeColor}
                      onChange={(v) => updateWebsiteToken("borderOrangeColor", v)}
                      description="Card boundary highlights for pricing guarantee cards"
                    />
                  </div>
                </div>
              )}

              {activeCategory === "typography" && (
                <div className="space-y-4">
                  <div className="text-xs font-bold text-slate-700">
                    Typography, Font Families & Text Inks
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <ColorField
                      label="Primary Body Text Ink"
                      value={websiteTheme.textColor}
                      onChange={(v) => updateWebsiteToken("textColor", v)}
                      description="High-contrast paragraphs and copy"
                    />
                    <ColorField
                      label="Muted Text Ink"
                      value={websiteTheme.textMutedColor}
                      onChange={(v) => updateWebsiteToken("textMutedColor", v)}
                      description="Captions, metadata, secondary descriptions"
                    />
                    <ColorField
                      label="Heading / Navy Text Color"
                      value={websiteTheme.headingColor}
                      onChange={(v) => updateWebsiteToken("headingColor", v)}
                      description="Hero headings, section titles, bold badges"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-100">
                    <div>
                      <label className="block text-xs font-bold mb-1" style={{ color: "var(--admin-text, #1E293B)" }}>
                        Body Font Family
                      </label>
                      <select
                        value={websiteTheme.fontFamily}
                        onChange={(e) => updateWebsiteToken("fontFamily", e.target.value)}
                        className="w-full text-xs p-2 rounded-xl border mb-1.5 focus:border-[#007A6C] focus:outline-none"
                        style={{
                          backgroundColor: "var(--admin-card-bg, #FFFFFF)",
                          borderColor: "var(--admin-border, #CBD5E1)",
                          color: "var(--admin-text, #1E293B)",
                        }}
                      >
                        <option value="'Lato', system-ui, -apple-system, sans-serif">
                          Lato (Official Akeezo Brand Default)
                        </option>
                        <option value="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif">
                          System Modern (Native Apple & Windows UI)
                        </option>
                        <option value="'Inter', system-ui, sans-serif">
                          Inter (Clinical Modern)
                        </option>
                        <option value="'Open Sans', system-ui, sans-serif">
                          Open Sans (Humanist Healthcare)
                        </option>
                        <option value="'Poppins', system-ui, sans-serif">
                          Poppins (Clean Rounded Geometric)
                        </option>
                      </select>
                      <input
                        type="text"
                        value={websiteTheme.fontFamily || ""}
                        onChange={(e) => updateWebsiteToken("fontFamily", e.target.value)}
                        placeholder="Custom Google Font, e.g. 'Roboto', sans-serif"
                        className="w-full text-xs px-2.5 py-1.5 rounded-lg border font-mono"
                        style={{
                          borderColor: "var(--admin-border, #CBD5E1)",
                          backgroundColor: "var(--admin-card-bg, #FFFFFF)",
                          color: "var(--admin-text, #1E293B)",
                        }}
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold mb-1" style={{ color: "var(--admin-text, #1E293B)" }}>
                        Heading Font Family
                      </label>
                      <select
                        value={websiteTheme.headingFontFamily}
                        onChange={(e) =>
                          updateWebsiteToken("headingFontFamily", e.target.value)
                        }
                        className="w-full text-xs p-2 rounded-xl border mb-1.5 focus:border-[#007A6C] focus:outline-none"
                        style={{
                          backgroundColor: "var(--admin-card-bg, #FFFFFF)",
                          borderColor: "var(--admin-border, #CBD5E1)",
                          color: "var(--admin-text, #1E293B)",
                        }}
                      >
                        <option value="'Lato', system-ui, -apple-system, sans-serif">
                          Lato (Official Akeezo Brand Default)
                        </option>
                        <option value="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif">
                          System Modern
                        </option>
                        <option value="'Inter', system-ui, sans-serif">
                          Inter (Clinical Modern)
                        </option>
                        <option value="'Poppins', system-ui, sans-serif">
                          Poppins (Geometric Display)
                        </option>
                      </select>
                      <input
                        type="text"
                        value={websiteTheme.headingFontFamily || ""}
                        onChange={(e) => updateWebsiteToken("headingFontFamily", e.target.value)}
                        placeholder="Custom Google Font, e.g. 'Montserrat', sans-serif"
                        className="w-full text-xs px-2.5 py-1.5 rounded-lg border font-mono"
                        style={{
                          borderColor: "var(--admin-border, #CBD5E1)",
                          backgroundColor: "var(--admin-card-bg, #FFFFFF)",
                          color: "var(--admin-text, #1E293B)",
                        }}
                      />
                    </div>
                  </div>
                </div>
              )}

              {activeCategory === "geometry" && (
                <div className="space-y-4">
                  <div className="text-xs font-bold text-slate-700">
                    Corner Geometry & Border Radii
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Card Border Radius
                      </label>
                      <input
                        type="text"
                        value={websiteTheme.radiusCard}
                        onChange={(e) => updateWebsiteToken("radiusCard", e.target.value)}
                        placeholder="20px"
                        className="w-full text-xs px-3 py-2 rounded-xl border border-slate-300 font-mono"
                      />
                      <span className="text-[10px] text-slate-400 mt-1 block">
                        Hospital cards, procedure cards, modals (default: 20px)
                      </span>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Button & Input Border Radius
                      </label>
                      <input
                        type="text"
                        value={websiteTheme.radiusButton}
                        onChange={(e) => updateWebsiteToken("radiusButton", e.target.value)}
                        placeholder="12px"
                        className="w-full text-xs px-3 py-2 rounded-xl border border-slate-300 font-mono"
                      />
                      <span className="text-[10px] text-slate-400 mt-1 block">
                        Action CTA buttons, form text inputs (default: 12px)
                      </span>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Hero Box Radius
                      </label>
                      <input
                        type="text"
                        value={websiteTheme.radiusHero}
                        onChange={(e) => updateWebsiteToken("radiusHero", e.target.value)}
                        placeholder="30px"
                        className="w-full text-xs px-3 py-2 rounded-xl border border-slate-300 font-mono"
                      />
                      <span className="text-[10px] text-slate-400 mt-1 block">
                        Homepage hero container corners (default: 30px)
                      </span>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Pill Badge Radius
                      </label>
                      <input
                        type="text"
                        value={websiteTheme.radiusPill}
                        onChange={(e) => updateWebsiteToken("radiusPill", e.target.value)}
                        placeholder="999px"
                        className="w-full text-xs px-3 py-2 rounded-xl border border-slate-300 font-mono"
                      />
                      <span className="text-[10px] text-slate-400 mt-1 block">
                        Emergency badges, pill chips (default: 999px)
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* SCOPE 2: ADMIN PANEL TOKENS */}
          {activeScope === "admin" && (
            <div
              className="rounded-2xl border p-5 shadow-xs space-y-4"
              style={{
                backgroundColor: "var(--admin-card-bg, #FFFFFF)",
                borderColor: "var(--admin-border, #E2E8F0)",
              }}
            >
              {activeCategory === "colors" && (
                <div className="space-y-4">
                  <div className="text-xs font-bold" style={{ color: "var(--admin-text, #1E293B)" }}>
                    Admin Navigation & Action Accents
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <ColorField
                      label="Admin Primary Accent (Active Tabs & Buttons)"
                      value={adminTheme.primaryColor}
                      onChange={(v) => updateAdminToken("primaryColor", v)}
                      description="Active sidebar tabs, save buttons, badges"
                    />
                    <ColorField
                      label="Admin Secondary / Highlight Color"
                      value={adminTheme.accentColor}
                      onChange={(v) => updateAdminToken("accentColor", v)}
                      description="Hover highlights, icons, notification badges"
                    />
                    <ColorField
                      label="Admin Alert / Attention Color"
                      value={adminTheme.secondaryColor}
                      onChange={(v) => updateAdminToken("secondaryColor", v)}
                      description="Critical warnings, leads badges, publish flags"
                    />
                  </div>
                </div>
              )}

              {activeCategory === "surfaces" && (
                <div className="space-y-4">
                  <div className="text-xs font-bold" style={{ color: "var(--admin-text, #1E293B)" }}>
                    Admin Layout Surfaces & Shell Backgrounds
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <ColorField
                      label="Sidebar Background"
                      value={adminTheme.sidebarBackground}
                      onChange={(v) => updateAdminToken("sidebarBackground", v)}
                      description="Dark navigation rail (default: #061E1B)"
                    />
                    <ColorField
                      label="Sidebar Text Color"
                      value={adminTheme.sidebarText}
                      onChange={(v) => updateAdminToken("sidebarText", v)}
                      description="Navigation item labels and icons"
                    />
                    <ColorField
                      label="Sidebar Active Item Background"
                      value={adminTheme.sidebarActiveBackground}
                      onChange={(v) => updateAdminToken("sidebarActiveBackground", v)}
                      description="Background tint for active sidebar item"
                    />
                    <ColorField
                      label="Top Header Background"
                      value={adminTheme.headerBackground}
                      onChange={(v) => updateAdminToken("headerBackground", v)}
                      description="Top sticky bar (default: #FFFFFF)"
                    />
                    <ColorField
                      label="Top Header Text Color"
                      value={adminTheme.headerText}
                      onChange={(v) => updateAdminToken("headerText", v)}
                      description="Header title, breadcrumb text (default: #111827)"
                    />
                    <ColorField
                      label="Main Content Workspace Background"
                      value={adminTheme.contentBackground}
                      onChange={(v) => updateAdminToken("contentBackground", v)}
                      description="Base workspace canvas (default: #F8FAFC)"
                    />
                    <ColorField
                      label="Admin Card Background"
                      value={adminTheme.cardBackground}
                      onChange={(v) => updateAdminToken("cardBackground", v)}
                      description="Panels, tables, modal containers"
                    />
                  </div>
                </div>
              )}

              {activeCategory === "typography" && (
                <div className="space-y-4">
                  <div className="text-xs font-bold" style={{ color: "var(--admin-text, #1E293B)" }}>
                    Admin Typography & Inks
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <ColorField
                      label="Admin Body Text Ink"
                      value={adminTheme.textColor}
                      onChange={(v) => updateAdminToken("textColor", v)}
                      description="Primary dashboard text and table entries"
                    />
                    <ColorField
                      label="Admin Muted Text Ink"
                      value={adminTheme.textMutedColor}
                      onChange={(v) => updateAdminToken("textMutedColor", v)}
                      description="Subtitles, table headers, breadcrumbs"
                    />
                    <ColorField
                      label="Admin Border Color"
                      value={adminTheme.borderColor}
                      onChange={(v) => updateAdminToken("borderColor", v)}
                      description="Card boundaries, table dividers, input borders"
                    />
                  </div>

                  <div className="pt-2 border-t border-slate-100 space-y-2">
                    <label className="block text-xs font-bold" style={{ color: "var(--admin-text, #1E293B)" }}>
                      Admin Font Family
                    </label>
                    <select
                      value={adminTheme.fontFamily || "'Lato', system-ui, sans-serif"}
                      onChange={(e) => updateAdminToken("fontFamily", e.target.value)}
                      className="w-full text-xs p-2 rounded-xl border focus:border-[#007A6C] focus:outline-none"
                      style={{
                        backgroundColor: "var(--admin-card-bg, #FFFFFF)",
                        borderColor: "var(--admin-border, #CBD5E1)",
                        color: "var(--admin-text, #1E293B)",
                      }}
                    >
                      <option value="'Lato', system-ui, -apple-system, sans-serif">
                        Lato (Official Akeezo Brand Default)
                      </option>
                      <option value="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif">
                        System Modern (Native Apple & Windows UI)
                      </option>
                      <option value="'Inter', system-ui, sans-serif">
                        Inter (Clinical Modern)
                      </option>
                      <option value="'Open Sans', system-ui, sans-serif">
                        Open Sans (Humanist Healthcare)
                      </option>
                      <option value="'Poppins', system-ui, sans-serif">
                        Poppins (Clean Rounded Geometric)
                      </option>
                    </select>
                    <div>
                      <input
                        type="text"
                        value={adminTheme.fontFamily || ""}
                        onChange={(e) => updateAdminToken("fontFamily", e.target.value)}
                        placeholder="Custom Google Font, e.g. 'Roboto', sans-serif"
                        className="w-full text-xs px-2.5 py-1.5 rounded-lg border font-mono"
                        style={{
                          borderColor: "var(--admin-border, #CBD5E1)",
                          backgroundColor: "var(--admin-card-bg, #FFFFFF)",
                          color: "var(--admin-text, #1E293B)",
                        }}
                      />
                      <span className="text-[10px] mt-0.5 block" style={{ color: "var(--admin-text-muted, #94A3B8)" }}>
                        Or enter any custom Google Web Font name (auto-loads dynamically via Google Fonts API)
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {activeCategory === "geometry" && (
                <div className="space-y-4">
                  <div className="text-xs font-bold text-slate-700">
                    Admin Corner Radii
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Admin Card Radius
                      </label>
                      <input
                        type="text"
                        value={adminTheme.radiusCard}
                        onChange={(e) => updateAdminToken("radiusCard", e.target.value)}
                        placeholder="16px"
                        className="w-full text-xs px-3 py-2 rounded-xl border border-slate-300 font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Admin Button Radius
                      </label>
                      <input
                        type="text"
                        value={adminTheme.radiusButton}
                        onChange={(e) => updateAdminToken("radiusButton", e.target.value)}
                        placeholder="10px"
                        className="w-full text-xs px-3 py-2 rounded-xl border border-slate-300 font-mono"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* RIGHT COLUMN (5 COLS): INTERACTIVE LIVE PREVIEW SANDBOX */}
        <div className="lg:col-span-5 sticky top-20 space-y-4">
          <div
            className="rounded-2xl border p-5 shadow-sm space-y-4"
            style={{
              backgroundColor: "var(--admin-card-bg, #FFFFFF)",
              borderColor: "var(--admin-border, #E2E8F0)",
            }}
          >
            <div className="flex items-center justify-between pb-3 border-b" style={{ borderColor: "var(--admin-border, #F1F5F9)" }}>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <h3
                  className="text-xs font-bold uppercase tracking-wider"
                  style={{ color: "var(--admin-text, #0F172A)" }}
                >
                  Real-Time Live Preview
                </h3>
              </div>
              <span className="text-[10px] text-slate-400 font-mono">
                {activeScope === "website" ? "Public Website View" : "Admin Panel View"}
              </span>
            </div>

            {/* LIVE PREVIEW: PUBLIC WEBSITE MOCKUP */}
            {activeScope === "website" ? (
              <div
                className="rounded-2xl p-4 border transition-all space-y-3.5"
                style={{
                  backgroundColor: websiteTheme.backgroundColor,
                  color: websiteTheme.textColor,
                  borderColor: websiteTheme.borderColor,
                  fontFamily: websiteTheme.fontFamily,
                }}
              >
                {/* 1. Mini Top Emergency Utility Bar */}
                <div
                  className="px-2.5 py-1 rounded-full text-[10px] font-bold flex items-center justify-between"
                  style={{
                    backgroundColor: websiteTheme.surfaceTealColor,
                    color: websiteTheme.actionColor,
                  }}
                >
                  <span className="inline-flex items-center gap-1">
                    <span
                      className="w-1.5 h-1.5 rounded-full"
                      style={{ backgroundColor: websiteTheme.emergencyColor }}
                    />
                    24/7 Emergency Care Hotline
                  </span>
                  <span className="font-mono text-[9px]">+91 82876 39443</span>
                </div>

                {/* 2. Mini Navbar */}
                <div
                  className="flex items-center justify-between px-3 py-2 rounded-xl border shadow-xs"
                  style={{
                    backgroundColor: websiteTheme.surfaceColor,
                    borderColor: websiteTheme.borderColor,
                  }}
                >
                  <div className="flex items-center gap-1.5">
                    <div
                      className="w-5 h-5 rounded-full flex items-center justify-center font-black text-[10px] text-white"
                      style={{ backgroundColor: websiteTheme.primaryColor }}
                    >
                      A
                    </div>
                    <span
                      className="font-black text-xs tracking-tight"
                      style={{ color: websiteTheme.headingColor }}
                    >
                      AKEEZO
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span
                      className="text-[10px] font-semibold"
                      style={{ color: websiteTheme.textMutedColor }}
                    >
                      Hospitals
                    </span>
                    <button
                      type="button"
                      className="px-2 py-1 text-[10px] font-bold text-white shadow-xs transition"
                      style={{
                        backgroundColor: websiteTheme.secondaryColor,
                        borderRadius: websiteTheme.radiusButton,
                      }}
                    >
                      Get Quote
                    </button>
                  </div>
                </div>

                {/* 3. Mini Hero Section */}
                <div
                  className="p-4 border text-center space-y-2 relative overflow-hidden"
                  style={{
                    backgroundColor: websiteTheme.surfaceColor,
                    borderColor: websiteTheme.borderColor,
                    borderRadius: websiteTheme.radiusHero,
                  }}
                >
                  <span
                    className="inline-block text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full"
                    style={{
                      backgroundColor: websiteTheme.surfaceOrangeColor,
                      color: websiteTheme.actionAccentColor,
                    }}
                  >
                    Medical Travel Made Safe
                  </span>

                  <h4
                    className="text-sm font-black tracking-tight"
                    style={{
                      color: websiteTheme.headingColor,
                      fontFamily: websiteTheme.headingFontFamily,
                    }}
                  >
                    World-Class Medical Care in India
                  </h4>

                  <p
                    className="text-[11px] leading-relaxed line-clamp-2"
                    style={{ color: websiteTheme.textMutedColor }}
                  >
                    Connect with JCI-accredited cardiac, oncology, and robotic surgery hospitals.
                  </p>

                  <div className="flex items-center justify-center gap-2 pt-1">
                    <button
                      type="button"
                      className="px-3 py-1.5 text-xs font-bold text-white shadow-xs"
                      style={{
                        backgroundColor: websiteTheme.actionColor,
                        borderRadius: websiteTheme.radiusButton,
                      }}
                    >
                      Explore Treatments
                    </button>
                    <button
                      type="button"
                      className="px-3 py-1.5 text-xs font-bold border"
                      style={{
                        backgroundColor: websiteTheme.surfaceColor,
                        color: websiteTheme.textColor,
                        borderColor: websiteTheme.borderColor,
                        borderRadius: websiteTheme.radiusButton,
                      }}
                    >
                      Compare Prices
                    </button>
                  </div>
                </div>

                {/* 4. Mini Procedure Card */}
                <div
                  className="p-3 border shadow-xs flex items-center justify-between"
                  style={{
                    backgroundColor: websiteTheme.cardColor,
                    borderColor: websiteTheme.borderTealColor,
                    borderRadius: websiteTheme.radiusCard,
                  }}
                >
                  <div className="space-y-0.5">
                    <span className="text-[11px] font-bold block" style={{ color: websiteTheme.headingColor }}>
                      Cardiac Bypass (CABG)
                    </span>
                    <span className="text-[10px] block" style={{ color: websiteTheme.textMutedColor }}>
                      Apollo Hospitals · New Delhi
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-black block" style={{ color: websiteTheme.actionColor }}>
                      $4,500
                    </span>
                    <span className="text-[9px] font-bold text-emerald-600 block">Save 75%</span>
                  </div>
                </div>
              </div>
            ) : (
              /* LIVE PREVIEW: ADMIN PANEL MOCKUP */
              <div
                className="rounded-2xl border transition-all overflow-hidden text-xs"
                style={{
                  backgroundColor: adminTheme.contentBackground,
                  color: adminTheme.textColor,
                  borderColor: adminTheme.borderColor,
                  fontFamily: adminTheme.fontFamily,
                }}
              >
                {/* Mini Top Header */}
                <div
                  className="px-3 py-2 border-b flex items-center justify-between shadow-xs"
                  style={{
                    backgroundColor: adminTheme.headerBackground,
                    borderColor: adminTheme.borderColor,
                  }}
                >
                  <div className="flex items-center gap-2">
                    <span
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: adminTheme.accentColor }}
                    />
                    <span className="font-bold text-[11px]" style={{ color: adminTheme.textColor }}>
                      Admin Workspace
                    </span>
                  </div>
                  <span
                    className="text-[9px] px-2 py-0.5 rounded-full font-bold uppercase"
                    style={{
                      backgroundColor: `${adminTheme.primaryColor}20`,
                      color: adminTheme.primaryColor,
                    }}
                  >
                    Super Admin
                  </span>
                </div>

                {/* Mini Body Layout: Sidebar + Main */}
                <div className="flex min-h-[220px]">
                  {/* Mini Sidebar */}
                  <div
                    className="w-28 p-2 space-y-1 select-none"
                    style={{
                      backgroundColor: adminTheme.sidebarBackground,
                      color: adminTheme.sidebarText,
                    }}
                  >
                    <div className="px-1.5 py-0.5 text-[8px] font-bold uppercase opacity-60">
                      Modules
                    </div>
                    <div
                      className="px-2 py-1 rounded text-[10px] font-bold flex items-center justify-between shadow-xs"
                      style={{
                        backgroundColor: adminTheme.primaryColor,
                        color: "#FFFFFF",
                      }}
                    >
                      <span>Dashboard</span>
                    </div>
                    <div className="px-2 py-1 rounded text-[10px] opacity-80 hover:opacity-100 cursor-pointer">
                      <span>Content</span>
                    </div>
                    <div className="px-2 py-1 rounded text-[10px] opacity-80 hover:opacity-100 cursor-pointer">
                      <span>Enquiries</span>
                    </div>
                    <div className="px-2 py-1 rounded text-[10px] opacity-80 hover:opacity-100 cursor-pointer">
                      <span>Settings</span>
                    </div>
                  </div>

                  {/* Mini Main Content Area */}
                  <div className="flex-1 p-3 space-y-2.5">
                    {/* Stat KPI Card */}
                    <div
                      className="p-2.5 border shadow-xs space-y-1"
                      style={{
                        backgroundColor: adminTheme.cardBackground,
                        borderColor: adminTheme.borderColor,
                        borderRadius: adminTheme.radiusCard,
                      }}
                    >
                      <div className="text-[10px] font-medium" style={{ color: adminTheme.textMutedColor }}>
                        Total Enquiries Today
                      </div>
                      <div className="text-base font-black" style={{ color: adminTheme.primaryColor }}>
                        128 Leads
                      </div>
                    </div>

                    {/* Quick Button */}
                    <button
                      type="button"
                      className="w-full py-1.5 text-[10px] font-bold text-white shadow-xs"
                      style={{
                        backgroundColor: adminTheme.primaryColor,
                        borderRadius: adminTheme.radiusButton,
                      }}
                    >
                      Save Configuration
                    </button>
                  </div>
                </div>
              </div>
            )}

            <div
              className="text-[11px] p-3 rounded-xl border flex items-start gap-2"
              style={{
                backgroundColor: "var(--admin-content-bg, #F8FAFC)",
                borderColor: "var(--admin-border, #E2E8F0)",
                color: "var(--admin-text-muted, #64748B)",
              }}
            >
              <HelpCircle className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
              <span>
                Tokens shown in this preview are instantly active in your admin session and will be delivered to public visitors upon clicking <strong>Save & Publish Theme</strong>.
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

interface ColorFieldProps {
  label: string;
  value?: string;
  onChange: (val: string) => void;
  description?: string;
}

const ColorField: React.FC<ColorFieldProps> = ({
  label,
  value = "#000000",
  onChange,
  description,
}) => {
  return (
    <div
      className="p-3 rounded-xl border space-y-1.5"
      style={{
        backgroundColor: "var(--admin-content-bg, #F8FAFC)",
        borderColor: "var(--admin-border, #E2E8F0)",
      }}
    >
      <label
        className="block text-xs font-bold"
        style={{ color: "var(--admin-text, #1E293B)" }}
      >
        {label}
      </label>
      <div className="flex items-center gap-2.5">
        <input
          type="color"
          value={value && value.startsWith("#") ? value : "#00C7BE"}
          onChange={(e) => onChange(e.target.value)}
          className="w-9 h-9 rounded-lg cursor-pointer border border-slate-300"
        />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="text-xs px-2.5 py-1.5 rounded-lg border font-mono w-28 uppercase font-bold"
          style={{
            borderColor: "var(--admin-border, #CBD5E1)",
            backgroundColor: "var(--admin-card-bg, #FFFFFF)",
            color: "var(--admin-text, #1E293B)",
          }}
        />
      </div>
      {description && (
        <span
          className="text-[10px] block leading-tight"
          style={{ color: "var(--admin-text-muted, #94A3B8)" }}
        >
          {description}
        </span>
      )}
    </div>
  );
};
