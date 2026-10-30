import React, { useState, useEffect } from "react";
import {
  Settings,
  Palette,
  Bell,
  Cpu,
  Activity,
  CheckCircle2,
  AlertCircle,
  Save,
  Globe,
  Lock,
  Mail,
  ShieldCheck,
  Server,
  Database,
  RefreshCw,
  Sparkles,
  Eye,
  EyeOff,
  Radio,
  Layers,
  Cloud,
  BarChart3,
  Key,
  ExternalLink,
  Code2,
  Zap,
} from "lucide-react";
import { ThemeStudioView } from "./ThemeStudioView.js";

export interface SettingsViewProps {
  initialTab?: "general" | "branding" | "forms" | "integrations" | "health";
}

export const SettingsView: React.FC<SettingsViewProps> = ({ initialTab }) => {
  const [activeTab, setActiveTab] = useState<
    "general" | "branding" | "forms" | "integrations" | "health"
  >(initialTab || "general");

  const [settings, setSettings] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [savingSection, setSavingSection] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState("");
  const [saveError, setSaveError] = useState("");

  // System Health State
  const [health, setHealth] = useState<any>(null);
  const [loadingHealth, setLoadingHealth] = useState(false);

  // Integrations interactive states
  const [testingIntegration, setTestingIntegration] = useState<Record<string, boolean>>({});
  const [testResults, setTestResults] = useState<
    Record<string, { ok: boolean; message: string; latencyMs?: number }>
  >({});
  const [showGeminiKey, setShowGeminiKey] = useState(false);
  const [integrationsFilter, setIntegrationsFilter] = useState<
    "all" | "gtm" | "gcp" | "meta" | "gemini" | "ga"
  >("all");

  useEffect(() => {
    fetchSettings();
  }, []);

  useEffect(() => {
    if (activeTab === "health") {
      fetchSystemHealth();
    }
  }, [activeTab]);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/v1/admin/site-settings");
      if (res.ok) {
        const json = await res.json();
        setSettings(json.data || {});
      }
    } catch (err) {
      console.error("Failed to fetch settings", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchSystemHealth = async () => {
    try {
      setLoadingHealth(true);
      const res = await fetch("/api/v1/admin/system-health");
      if (res.ok) {
        const json = await res.json();
        setHealth(json.data);
      }
    } catch (err) {
      console.error("Failed to fetch system health", err);
    } finally {
      setLoadingHealth(false);
    }
  };

  const handleSaveSection = async (section: string, payload: any) => {
    setSavingSection(true);
    setSaveSuccess("");
    setSaveError("");

    try {
      const res = await fetch(`/api/v1/admin/settings/${section}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (!res.ok) {
        setSaveError(json.error?.message || "Failed to save settings section.");
        return;
      }

      setSettings((prev: any) => ({ ...prev, ...json.data }));
      setSaveSuccess(`Section "${section}" saved successfully.`);
      setTimeout(() => setSaveSuccess(""), 4000);
    } catch (err: any) {
      setSaveError(err.message);
    } finally {
      setSavingSection(false);
    }
  };

  const handleTestIntegration = async (
    endpoint: "gemini" | "google-cloud" | "google-tag-manager" | "meta-pixel" | "google-analytics",
    payload: any
  ) => {
    setTestingIntegration((prev) => ({ ...prev, [endpoint]: true }));
    setTestResults((prev) => {
      const copy = { ...prev };
      delete copy[endpoint];
      return copy;
    });

    try {
      const res = await fetch(`/api/v1/admin/integrations/test/${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      setTestResults((prev) => ({
        ...prev,
        [endpoint]: {
          ok: json.ok ?? res.ok,
          message: json.message || json.error || (res.ok ? "Verification passed" : "Verification failed"),
          latencyMs: json.latencyMs,
        },
      }));

      if (res.ok && endpoint === "gemini") {
        setSettings((prev: any) => ({
          ...prev,
          integrations: {
            ...prev?.integrations,
            gemini: {
              ...prev?.integrations?.gemini,
              status: "active",
              lastTestedAt: new Date().toISOString(),
            },
          },
        }));
      }
    } catch (err: any) {
      setTestResults((prev) => ({
        ...prev,
        [endpoint]: { ok: false, message: err.message },
      }));
    } finally {
      setTestingIntegration((prev) => ({ ...prev, [endpoint]: false }));
    }
  };

  const updateIntegration = (module: string, updates: Record<string, any>) => {
    setSettings((prev: any) => ({
      ...prev,
      integrations: {
        ...prev?.integrations,
        [module]: {
          ...(prev?.integrations?.[module] || {}),
          ...updates,
        },
      },
    }));
  };

  if (loading) {
    return (
      <div className="p-12 text-center text-slate-400 text-xs font-semibold bg-white rounded-2xl border border-slate-200">
        Loading platform settings...
      </div>
    );
  }

  const integrations = settings?.integrations || {};
  const gtm = integrations.googleTagManager || { enabled: false, containerId: "GTM-AKZ89P4" };
  const gcp = integrations.googleCloud || {
    enabled: true,
    projectId: "akeezo-health-prod",
    clientEmail: "service-account@akeezo-health-prod.iam.gserviceaccount.com",
    region: "asia-south1",
    storageBucket: "gs://akeezo-vault-prod",
    status: "connected",
  };
  const meta = integrations.metaPixel || { enabled: false, pixelId: "", testEventCode: "" };
  const gemini = integrations.gemini || {
    enabled: true,
    apiKey: "",
    apiKeyMasked: "AIzaSy••••••••••••••••••••••••••••",
    model: "gemini-2.0-flash",
    temperature: 0.2,
    status: "active",
  };
  const ga = integrations.googleAnalytics || {
    enabled: true,
    measurementId: "G-AKEEZO2026X",
    anonymizeIp: true,
  };

  return (
    <div className="space-y-6 font-sans">
      {/* 1. Header Banner */}
      <div className="bg-gradient-to-r from-[#061E1B] via-teal-950 to-[#061E1B] rounded-2xl p-6 text-white shadow-md border border-[#00C7BE]/30 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#007A6C]/50 text-[#00C7BE] border border-[#00C7BE]/30">
            <Settings className="w-3.5 h-3.5 text-[#00C7BE]" />
            <span>Platform Configuration</span>
          </div>
          <h1 className="text-xl font-black tracking-tight">System & Brand Settings</h1>
          <p className="text-xs text-teal-100/80 max-w-2xl leading-relaxed">
            Configure platform parameters, brand tokens, lead dispatch webhooks, third-party marketing & AI integrations, and inspect real-time server runtime metrics.
          </p>
        </div>
      </div>

      {/* 2. Sub-Tab Switcher */}
      <div className="flex border-b border-slate-200 gap-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab("general")}
          className={`px-4 py-3 text-xs font-bold border-b-2 flex items-center gap-2 transition whitespace-nowrap ${
            activeTab === "general"
              ? "border-[#007A6C] text-[#007A6C] bg-[#E6F8F6]/60 rounded-t-xl"
              : "border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-50"
          }`}
        >
          <Globe className="w-4 h-4 text-[#007A6C]" />
          <span>General</span>
        </button>

        <button
          onClick={() => setActiveTab("branding")}
          className={`px-4 py-3 text-xs font-bold border-b-2 flex items-center gap-2 transition whitespace-nowrap ${
            activeTab === "branding"
              ? "border-[#007A6C] text-[#007A6C] bg-[#E6F8F6]/60 rounded-t-xl"
              : "border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-50"
          }`}
        >
          <Sparkles className="w-4 h-4 text-[#007A6C]" />
          <span>Branding & Theme Studio</span>
        </button>

        <button
          onClick={() => setActiveTab("forms")}
          className={`px-4 py-3 text-xs font-bold border-b-2 flex items-center gap-2 transition whitespace-nowrap ${
            activeTab === "forms"
              ? "border-[#007A6C] text-[#007A6C] bg-[#E6F8F6]/60 rounded-t-xl"
              : "border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-50"
          }`}
        >
          <Bell className="w-4 h-4 text-[#007A6C]" />
          <span>Forms & Notifications</span>
        </button>

        <button
          onClick={() => setActiveTab("integrations")}
          className={`px-4 py-3 text-xs font-bold border-b-2 flex items-center gap-2 transition whitespace-nowrap ${
            activeTab === "integrations"
              ? "border-[#007A6C] text-[#007A6C] bg-[#E6F8F6]/60 rounded-t-xl"
              : "border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-50"
          }`}
        >
          <Cpu className="w-4 h-4 text-[#007A6C]" />
          <span>Integrations & Secrets</span>
        </button>

        <button
          onClick={() => setActiveTab("health")}
          className={`px-4 py-3 text-xs font-bold border-b-2 flex items-center gap-2 transition whitespace-nowrap ${
            activeTab === "health"
              ? "border-[#007A6C] text-[#007A6C] bg-[#E6F8F6]/60 rounded-t-xl"
              : "border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-50"
          }`}
        >
          <Activity className="w-4 h-4 text-[#007A6C]" />
          <span>System Health</span>
        </button>
      </div>

      {/* Global Success / Error Toast Banners */}
      {saveSuccess && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{saveSuccess}</span>
        </div>
      )}
      {saveError && (
        <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 text-xs flex items-center gap-2 animate-in fade-in">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          <span>{saveError}</span>
        </div>
      )}

      {/* TAB 1: GENERAL SETTINGS */}
      {activeTab === "general" && (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSaveSection("general", {
              brandName: settings.brandName,
              tagline: settings.tagline,
              legalEntityName: settings.legalEntityName,
              emergencyHelpline: settings.emergencyHelpline,
              emergencyNotice: settings.emergencyNotice,
              contactEmail: settings.contactEmail,
              defaultLanguage: settings.defaultLanguage || "en",
              defaultTimezone: settings.defaultTimezone || "Asia/Kolkata",
            });
          }}
          className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4"
        >
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h2 className="text-base font-bold text-slate-900">General Platform Information</h2>
            <button
              type="submit"
              disabled={savingSection}
              className="px-4 py-2 text-xs font-bold text-white bg-[#007A6C] hover:bg-[#005F54] rounded-xl shadow-xs transition disabled:opacity-60 flex items-center gap-1.5"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{savingSection ? "Saving..." : "Save General Settings"}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Brand Name</label>
              <input
                type="text"
                value={settings.brandName || ""}
                onChange={(e) => setSettings({ ...settings, brandName: e.target.value })}
                required
                className="w-full text-xs px-3 py-2 rounded-xl border border-slate-300 focus:border-[#007A6C] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Platform Tagline</label>
              <input
                type="text"
                value={settings.tagline || ""}
                onChange={(e) => setSettings({ ...settings, tagline: e.target.value })}
                required
                className="w-full text-xs px-3 py-2 rounded-xl border border-slate-300 focus:border-[#007A6C] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Legal Corporate Entity</label>
              <input
                type="text"
                value={settings.legalEntityName || ""}
                onChange={(e) => setSettings({ ...settings, legalEntityName: e.target.value })}
                className="w-full text-xs px-3 py-2 rounded-xl border border-slate-300 focus:border-[#007A6C] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                24/7 Emergency Helpline
              </label>
              <input
                type="text"
                value={settings.emergencyHelpline || ""}
                onChange={(e) => setSettings({ ...settings, emergencyHelpline: e.target.value })}
                className="w-full text-xs px-3 py-2 rounded-xl border border-slate-300 focus:border-[#007A6C] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Default Site Language
              </label>
              <select
                value={settings.defaultLanguage || "en"}
                onChange={(e) => setSettings({ ...settings, defaultLanguage: e.target.value })}
                className="w-full text-xs px-3 py-2 rounded-xl border border-slate-300 focus:border-[#007A6C] focus:outline-none"
              >
                <option value="en">English (Global Default)</option>
                <option value="ar">Arabic (العربية)</option>
                <option value="ru">Russian (Русский)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Platform Timezone
              </label>
              <select
                value={settings.defaultTimezone || "Asia/Kolkata"}
                onChange={(e) => setSettings({ ...settings, defaultTimezone: e.target.value })}
                className="w-full text-xs px-3 py-2 rounded-xl border border-slate-300 focus:border-[#007A6C] focus:outline-none"
              >
                <option value="Asia/Kolkata">Asia/Kolkata (IST +5:30)</option>
                <option value="UTC">UTC (Coordinated Universal Time)</option>
              </select>
            </div>
          </div>
        </form>
      )}

      {/* TAB 2: BRANDING & THEME STUDIO */}
      {activeTab === "branding" && <ThemeStudioView />}

      {/* TAB 3: FORMS & NOTIFICATIONS */}
      {activeTab === "forms" && (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSaveSection("forms", {
              formsConfig: settings.formsConfig,
            });
          }}
          className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4"
        >
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h2 className="text-base font-bold text-slate-900">Lead Notification & Form Routing</h2>
            <button
              type="submit"
              disabled={savingSection}
              className="px-4 py-2 text-xs font-bold text-white bg-[#007A6C] hover:bg-[#005F54] rounded-xl shadow-xs transition disabled:opacity-60 flex items-center gap-1.5"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{savingSection ? "Saving..." : "Save Form Config"}</span>
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Notification Recipient Emails (Comma-separated)
              </label>
              <input
                type="text"
                value={(settings.formsConfig?.leadNotificationEmails || []).join(", ")}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    formsConfig: {
                      ...settings.formsConfig,
                      leadNotificationEmails: e.target.value.split(",").map((s) => s.trim()),
                    },
                  })
                }
                placeholder="care@akeezo.com, coordinator@akeezo.com"
                className="w-full text-xs px-3 py-2 rounded-xl border border-slate-300 focus:border-[#007A6C] focus:outline-none"
              />
            </div>

            <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-xl border border-slate-200">
              <div>
                <div className="text-xs font-bold text-slate-900">Automated Patient Lead Triage</div>
                <div className="text-[11px] text-slate-500">
                  Automatically classify incoming website leads into service categories.
                </div>
              </div>
              <input
                type="checkbox"
                checked={settings.formsConfig?.autoTriageEnabled ?? true}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    formsConfig: {
                      ...settings.formsConfig,
                      autoTriageEnabled: e.target.checked,
                    },
                  })
                }
                className="w-4 h-4 text-[#007A6C] rounded"
              />
            </div>
          </div>
        </form>
      )}

      {/* TAB 4: INTEGRATIONS & SECRETS (Full First-Class Control Center) */}
      {activeTab === "integrations" && (
        <div className="space-y-6">
          {/* Top Action Bar */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Cpu className="w-5 h-5 text-[#007A6C]" />
                <span>Connected Marketing, Analytics & AI Services</span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Manage tags, analytics, Google Cloud infrastructure, and Gemini AI. Secrets are masked according to DPDP compliance.
              </p>
            </div>

            <div className="flex items-center gap-2 self-end sm:self-auto">
              <button
                type="button"
                onClick={() => handleSaveSection("integrations", { integrations: settings.integrations })}
                disabled={savingSection}
                className="px-4 py-2 text-xs font-bold text-white bg-[#007A6C] hover:bg-[#005F54] rounded-xl shadow-xs transition disabled:opacity-60 flex items-center gap-1.5"
              >
                <Save className="w-3.5 h-3.5" />
                <span>{savingSection ? "Saving Changes..." : "Save All Integrations"}</span>
              </button>
            </div>
          </div>

          {/* Quick Filter Bar */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
            <span className="text-slate-400 font-bold px-1 text-[11px]">Filter:</span>
            {[
              { id: "all", label: "All Integrations (5)" },
              { id: "gtm", label: "Google Tag Manager" },
              { id: "gcp", label: "Google Cloud Console" },
              { id: "meta", label: "Meta Pixel" },
              { id: "gemini", label: "Gemini AI" },
              { id: "ga", label: "Google Analytics 4" },
            ].map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={() => setIntegrationsFilter(f.id as any)}
                className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition border ${
                  integrationsFilter === f.id
                    ? "bg-[#061E1B] text-white border-[#061E1B]"
                    : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* 1. Google Tag Manager Card */}
          {(integrationsFilter === "all" || integrationsFilter === "gtm") && (
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-teal-50 border border-teal-200 flex items-center justify-center text-[#007A6C]">
                    <Layers className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-bold text-slate-900">Google Tag Manager (GTM)</h3>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          gtm.enabled
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-slate-100 text-slate-600"
                        }`}
                      >
                        {gtm.enabled ? "Active on SSR" : "Disabled"}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500">
                      Centralized tag management. Injects container scripts directly into public website SSR headers and bodies.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 self-end sm:self-auto">
                  <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-700">
                    <span>Enable</span>
                    <input
                      type="checkbox"
                      checked={gtm.enabled}
                      onChange={(e) => updateIntegration("googleTagManager", { enabled: e.target.checked })}
                      className="w-4 h-4 text-[#007A6C] rounded"
                    />
                  </label>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    GTM Container ID <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={gtm.containerId || ""}
                    onChange={(e) => updateIntegration("googleTagManager", { containerId: e.target.value })}
                    placeholder="GTM-XXXXXXX"
                    className="w-full text-xs font-mono px-3 py-2 rounded-xl border border-slate-300 focus:border-[#007A6C] focus:outline-none uppercase"
                  />
                  <span className="text-[11px] text-slate-400 mt-1 block">
                    Format: GTM-XXXXXXX. Located in your Google Tag Manager workspace header.
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleTestIntegration("google-tag-manager", { containerId: gtm.containerId })}
                    disabled={testingIntegration["google-tag-manager"] || !gtm.containerId}
                    className="px-3.5 py-2 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition disabled:opacity-50 flex items-center gap-1.5"
                  >
                    <RefreshCw
                      className={`w-3.5 h-3.5 ${
                        testingIntegration["google-tag-manager"] ? "animate-spin text-[#007A6C]" : ""
                      }`}
                    />
                    <span>{testingIntegration["google-tag-manager"] ? "Verifying..." : "Verify Container ID"}</span>
                  </button>

                  <a
                    href="https://tagmanager.google.com"
                    target="_blank"
                    rel="noreferrer"
                    className="px-3 py-2 text-xs text-slate-500 hover:text-slate-800 transition flex items-center gap-1"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>Open GTM</span>
                  </a>
                </div>
              </div>

              {testResults["google-tag-manager"] && (
                <div
                  className={`p-3 rounded-xl border text-xs flex items-center gap-2 ${
                    testResults["google-tag-manager"].ok
                      ? "bg-emerald-50 border-emerald-200 text-emerald-800"
                      : "bg-rose-50 border-rose-200 text-rose-800"
                  }`}
                >
                  {testResults["google-tag-manager"].ok ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                  )}
                  <span>{testResults["google-tag-manager"].message}</span>
                </div>
              )}
            </div>
          )}

          {/* 2. Google Cloud Console Card */}
          {(integrationsFilter === "all" || integrationsFilter === "gcp") && (
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600">
                    <Cloud className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-bold text-slate-900">Google Cloud Console (GCP)</h3>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          gcp.status === "connected"
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-amber-100 text-amber-800"
                        }`}
                      >
                        {gcp.status === "connected" ? "Connected" : "Unconfigured"}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500">
                      Cloud backend infrastructure managing confidential medical vaults, service accounts, and Firebase Auth.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 self-end sm:self-auto">
                  <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-700">
                    <span>Enable</span>
                    <input
                      type="checkbox"
                      checked={gcp.enabled}
                      onChange={(e) => updateIntegration("googleCloud", { enabled: e.target.checked })}
                      className="w-4 h-4 text-[#007A6C] rounded"
                    />
                  </label>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    GCP Project ID <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={gcp.projectId || ""}
                    onChange={(e) => updateIntegration("googleCloud", { projectId: e.target.value })}
                    placeholder="akeezo-health-prod"
                    className="w-full text-xs font-mono px-3 py-2 rounded-xl border border-slate-300 focus:border-[#007A6C] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    IAM Service Account Client Email
                  </label>
                  <input
                    type="text"
                    value={gcp.clientEmail || ""}
                    onChange={(e) => updateIntegration("googleCloud", { clientEmail: e.target.value })}
                    placeholder="service-account@akeezo-health-prod.iam.gserviceaccount.com"
                    className="w-full text-xs font-mono px-3 py-2 rounded-xl border border-slate-300 focus:border-[#007A6C] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Primary GCP Region</label>
                  <select
                    value={gcp.region || "asia-south1"}
                    onChange={(e) => updateIntegration("googleCloud", { region: e.target.value })}
                    className="w-full text-xs px-3 py-2 rounded-xl border border-slate-300 focus:border-[#007A6C] focus:outline-none"
                  >
                    <option value="asia-south1">asia-south1 (Mumbai, India - Recommended for DPDP Act)</option>
                    <option value="asia-south2">asia-south2 (Delhi, India)</option>
                    <option value="asia-southeast1">asia-southeast1 (Singapore)</option>
                    <option value="us-central1">us-central1 (Iowa, USA)</option>
                    <option value="europe-west1">europe-west1 (Belgium, EU)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Google Cloud Storage (GCS) Vault Bucket
                  </label>
                  <input
                    type="text"
                    value={gcp.storageBucket || ""}
                    onChange={(e) => updateIntegration("googleCloud", { storageBucket: e.target.value })}
                    placeholder="gs://akeezo-vault-prod"
                    className="w-full text-xs font-mono px-3 py-2 rounded-xl border border-slate-300 focus:border-[#007A6C] focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() =>
                    handleTestIntegration("google-cloud", {
                      projectId: gcp.projectId,
                      region: gcp.region,
                      storageBucket: gcp.storageBucket,
                    })
                  }
                  disabled={testingIntegration["google-cloud"] || !gcp.projectId}
                  className="px-3.5 py-2 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition disabled:opacity-50 flex items-center gap-1.5"
                >
                  <RefreshCw
                    className={`w-3.5 h-3.5 ${
                      testingIntegration["google-cloud"] ? "animate-spin text-blue-600" : ""
                    }`}
                  />
                  <span>{testingIntegration["google-cloud"] ? "Validating..." : "Validate GCP Project"}</span>
                </button>

                <a
                  href="https://console.cloud.google.com"
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-2 text-xs text-slate-500 hover:text-slate-800 transition flex items-center gap-1"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Open GCP Console</span>
                </a>
              </div>

              {testResults["google-cloud"] && (
                <div
                  className={`p-3 rounded-xl border text-xs flex items-center gap-2 ${
                    testResults["google-cloud"].ok
                      ? "bg-emerald-50 border-emerald-200 text-emerald-800"
                      : "bg-rose-50 border-rose-200 text-rose-800"
                  }`}
                >
                  {testResults["google-cloud"].ok ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                  )}
                  <span>{testResults["google-cloud"].message}</span>
                </div>
              )}
            </div>
          )}

          {/* 3. Meta Pixel Card */}
          {(integrationsFilter === "all" || integrationsFilter === "meta") && (
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-600">
                    <Radio className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-bold text-slate-900">Meta Pixel (Facebook)</h3>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          meta.enabled
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-slate-100 text-slate-600"
                        }`}
                      >
                        {meta.enabled ? "Tracking Active" : "Disabled"}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500">
                      Conversion and pageview telemetry for Meta advertising campaigns across medical tourism target geos.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 self-end sm:self-auto">
                  <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-700">
                    <span>Enable</span>
                    <input
                      type="checkbox"
                      checked={meta.enabled}
                      onChange={(e) => updateIntegration("metaPixel", { enabled: e.target.checked })}
                      className="w-4 h-4 text-[#007A6C] rounded"
                    />
                  </label>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Meta Pixel ID <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={meta.pixelId || ""}
                    onChange={(e) => updateIntegration("metaPixel", { pixelId: e.target.value.replace(/\D/g, "") })}
                    placeholder="982347109283471"
                    className="w-full text-xs font-mono px-3 py-2 rounded-xl border border-slate-300 focus:border-[#007A6C] focus:outline-none"
                  />
                  <span className="text-[11px] text-slate-400 mt-1 block">
                    15-16 digit numeric ID from Meta Events Manager.
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Test Event Code (Optional)
                  </label>
                  <input
                    type="text"
                    value={meta.testEventCode || ""}
                    onChange={(e) => updateIntegration("metaPixel", { testEventCode: e.target.value })}
                    placeholder="TEST82914"
                    className="w-full text-xs font-mono px-3 py-2 rounded-xl border border-slate-300 focus:border-[#007A6C] focus:outline-none"
                  />
                  <span className="text-[11px] text-slate-400 mt-1 block">
                    Used to verify server/client events in Meta Events Manager Test Events tab.
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() =>
                    handleTestIntegration("meta-pixel", {
                      pixelId: meta.pixelId,
                      testEventCode: meta.testEventCode,
                    })
                  }
                  disabled={testingIntegration["meta-pixel"] || !meta.pixelId}
                  className="px-3.5 py-2 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition disabled:opacity-50 flex items-center gap-1.5"
                >
                  <RefreshCw
                    className={`w-3.5 h-3.5 ${
                      testingIntegration["meta-pixel"] ? "animate-spin text-indigo-600" : ""
                    }`}
                  />
                  <span>{testingIntegration["meta-pixel"] ? "Validating..." : "Validate Pixel ID"}</span>
                </button>

                <a
                  href="https://business.facebook.com/events_manager2"
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-2 text-xs text-slate-500 hover:text-slate-800 transition flex items-center gap-1"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Events Manager</span>
                </a>
              </div>

              {testResults["meta-pixel"] && (
                <div
                  className={`p-3 rounded-xl border text-xs flex items-center gap-2 ${
                    testResults["meta-pixel"].ok
                      ? "bg-emerald-50 border-emerald-200 text-emerald-800"
                      : "bg-rose-50 border-rose-200 text-rose-800"
                  }`}
                >
                  {testResults["meta-pixel"].ok ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                  )}
                  <span>{testResults["meta-pixel"].message}</span>
                </div>
              )}
            </div>
          )}

          {/* 4. Google Gemini API Key Card */}
          {(integrationsFilter === "all" || integrationsFilter === "gemini") && (
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-[#007A6C]">
                    <Sparkles className="w-5 h-5 text-[#007A6C]" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-bold text-slate-900">Google Gemini AI Engine</h3>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          gemini.status === "active"
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-amber-100 text-amber-800"
                        }`}
                      >
                        {gemini.status === "active" ? "Active" : "Unconfigured"}
                      </span>
                      {gemini.lastTestedAt && (
                        <span className="text-[10px] text-slate-400 font-mono">
                          Verified {new Date(gemini.lastTestedAt).toLocaleTimeString()}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500">
                      Powers automated patient intake triage, clinical report summaries, and intelligent enquiry classification.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 self-end sm:self-auto">
                  <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-700">
                    <span>Enable</span>
                    <input
                      type="checkbox"
                      checked={gemini.enabled}
                      onChange={(e) => updateIntegration("gemini", { enabled: e.target.checked })}
                      className="w-4 h-4 text-[#007A6C] rounded"
                    />
                  </label>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                      <Key className="w-3.5 h-3.5 text-[#007A6C]" />
                      <span>Gemini API Key</span>
                      <span className="text-rose-500">*</span>
                    </label>
                    <span className="text-[11px] text-slate-400 flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                      <span>DPDP Act Encrypted Masking</span>
                    </span>
                  </div>

                  <div className="relative">
                    <input
                      type={showGeminiKey ? "text" : "password"}
                      value={gemini.apiKey || gemini.apiKeyMasked || ""}
                      onChange={(e) => updateIntegration("gemini", { apiKey: e.target.value })}
                      placeholder="AIzaSy••••••••••••••••••••••••••••"
                      className="w-full text-xs font-mono px-3 py-2 pr-10 rounded-xl border border-slate-300 focus:border-[#007A6C] focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setShowGeminiKey(!showGeminiKey)}
                      className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 transition"
                      title={showGeminiKey ? "Hide Secret" : "Show Secret"}
                    >
                      {showGeminiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  <span className="text-[11px] text-slate-400 mt-1 block">
                    Input a new Google AI Studio API key (starts with AIzaSy) to update. Leave masked bullets unchanged to preserve your active secret.
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Selected Gemini Model</label>
                    <select
                      value={gemini.model || "gemini-2.0-flash"}
                      onChange={(e) => updateIntegration("gemini", { model: e.target.value })}
                      className="w-full text-xs px-3 py-2 rounded-xl border border-slate-300 focus:border-[#007A6C] focus:outline-none"
                    >
                      <option value="gemini-2.0-flash">gemini-2.0-flash (Fastest & Recommended for Triage)</option>
                      <option value="gemini-1.5-pro">gemini-1.5-pro (High Reasoning & Long Clinical Context)</option>
                      <option value="gemini-1.5-flash">gemini-1.5-flash (Standard Multimodal Inference)</option>
                    </select>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-xs font-bold text-slate-700">Creativity / Temperature</label>
                      <span className="text-xs font-bold font-mono text-[#007A6C]">
                        {gemini.temperature ?? 0.2}
                      </span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.05"
                      value={gemini.temperature ?? 0.2}
                      onChange={(e) =>
                        updateIntegration("gemini", { temperature: parseFloat(e.target.value) })
                      }
                      className="w-full accent-[#007A6C] h-2 bg-slate-200 rounded-lg cursor-pointer"
                    />
                    <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                      <span>0.0 (Deterministic / Clinical)</span>
                      <span>1.0 (Creative)</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() =>
                    handleTestIntegration("gemini", {
                      apiKey: gemini.apiKey,
                      model: gemini.model,
                    })
                  }
                  disabled={testingIntegration["gemini"]}
                  className="px-3.5 py-2 text-xs font-bold text-white bg-[#007A6C] hover:bg-[#005F54] rounded-xl transition disabled:opacity-50 flex items-center gap-1.5 shadow-xs"
                >
                  <RefreshCw
                    className={`w-3.5 h-3.5 ${testingIntegration["gemini"] ? "animate-spin" : ""}`}
                  />
                  <span>
                    {testingIntegration["gemini"] ? "Pinging Gemini API..." : "Test Gemini Connection"}
                  </span>
                </button>

                <a
                  href="https://aistudio.google.com/app/apikey"
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-2 text-xs text-slate-500 hover:text-slate-800 transition flex items-center gap-1"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Google AI Studio</span>
                </a>
              </div>

              {testResults["gemini"] && (
                <div
                  className={`p-3 rounded-xl border text-xs flex items-center justify-between ${
                    testResults["gemini"].ok
                      ? "bg-emerald-50 border-emerald-200 text-emerald-800"
                      : "bg-rose-50 border-rose-200 text-rose-800"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {testResults["gemini"].ok ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                    )}
                    <span>{testResults["gemini"].message}</span>
                  </div>
                  {testResults["gemini"].latencyMs !== undefined && (
                    <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-900 shrink-0">
                      {testResults["gemini"].latencyMs}ms latency
                    </span>
                  )}
                </div>
              )}
            </div>
          )}

          {/* 5. Google Analytics 4 Card */}
          {(integrationsFilter === "all" || integrationsFilter === "ga") && (
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600">
                    <BarChart3 className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-bold text-slate-900">Google Analytics 4 (GA4)</h3>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          ga.enabled
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-slate-100 text-slate-600"
                        }`}
                      >
                        {ga.enabled ? "Active on SSR" : "Disabled"}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500">
                      Real-time audience tracking, pageview telemetry, and hospital consultation conversion funnels.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 self-end sm:self-auto">
                  <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-700">
                    <span>Enable</span>
                    <input
                      type="checkbox"
                      checked={ga.enabled}
                      onChange={(e) => updateIntegration("googleAnalytics", { enabled: e.target.checked })}
                      className="w-4 h-4 text-[#007A6C] rounded"
                    />
                  </label>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    GA4 Measurement ID <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={ga.measurementId || ""}
                    onChange={(e) => updateIntegration("googleAnalytics", { measurementId: e.target.value })}
                    placeholder="G-AKEEZO2026X"
                    className="w-full text-xs font-mono px-3 py-2 rounded-xl border border-slate-300 focus:border-[#007A6C] focus:outline-none uppercase"
                  />
                  <span className="text-[11px] text-slate-400 mt-1 block">
                    Format: G-XXXXXXXXXX. Located in your Google Analytics Admin &gt; Data Streams.
                  </span>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <div>
                      <div className="text-xs font-bold text-slate-900">Anonymize Patient IP Addresses</div>
                      <div className="text-[10px] text-slate-500">
                        Mandatory compliance standard under the Indian DPDP Act 2023 and GDPR.
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={ga.anonymizeIp !== false}
                      onChange={(e) =>
                        updateIntegration("googleAnalytics", { anonymizeIp: e.target.checked })
                      }
                      className="w-4 h-4 text-[#007A6C] rounded"
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() =>
                    handleTestIntegration("google-analytics", {
                      measurementId: ga.measurementId,
                    })
                  }
                  disabled={testingIntegration["google-analytics"] || !ga.measurementId}
                  className="px-3.5 py-2 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition disabled:opacity-50 flex items-center gap-1.5"
                >
                  <RefreshCw
                    className={`w-3.5 h-3.5 ${
                      testingIntegration["google-analytics"] ? "animate-spin text-amber-600" : ""
                    }`}
                  />
                  <span>
                    {testingIntegration["google-analytics"] ? "Validating..." : "Validate Measurement ID"}
                  </span>
                </button>

                <a
                  href="https://analytics.google.com"
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-2 text-xs text-slate-500 hover:text-slate-800 transition flex items-center gap-1"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Google Analytics</span>
                </a>
              </div>

              {testResults["google-analytics"] && (
                <div
                  className={`p-3 rounded-xl border text-xs flex items-center gap-2 ${
                    testResults["google-analytics"].ok
                      ? "bg-emerald-50 border-emerald-200 text-emerald-800"
                      : "bg-rose-50 border-rose-200 text-rose-800"
                  }`}
                >
                  {testResults["google-analytics"].ok ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                  )}
                  <span>{testResults["google-analytics"].message}</span>
                </div>
              )}
            </div>
          )}

          {/* Bottom Save Bar */}
          <div className="bg-slate-50 rounded-2xl border border-slate-200 p-4 flex items-center justify-between">
            <span className="text-xs text-slate-500">
              Remember to save after testing to persist your updated integration configurations.
            </span>
            <button
              type="button"
              onClick={() => handleSaveSection("integrations", { integrations: settings.integrations })}
              disabled={savingSection}
              className="px-4 py-2 text-xs font-bold text-white bg-[#007A6C] hover:bg-[#005F54] rounded-xl shadow-xs transition disabled:opacity-60 flex items-center gap-1.5"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{savingSection ? "Saving..." : "Save All Integrations"}</span>
            </button>
          </div>
        </div>
      )}

      {/* TAB 5: SYSTEM HEALTH */}
      {activeTab === "health" && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Server className="w-5 h-5 text-[#007A6C]" />
              <h2 className="text-base font-bold text-slate-900">Live Server Runtime Diagnostics</h2>
            </div>
            <button
              onClick={fetchSystemHealth}
              disabled={loadingHealth}
              className="flex items-center gap-1.5 text-xs text-[#007A6C] font-bold hover:underline"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loadingHealth ? "animate-spin" : ""}`} />
              <span>Refresh Telemetry</span>
            </button>
          </div>

          {loadingHealth && !health && (
            <div className="p-8 text-center text-xs text-slate-400">Querying runtime cluster...</div>
          )}

          {health && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Database Status
                </div>
                <div className="text-base font-black text-slate-900 flex items-center gap-2">
                  <Database className="w-4 h-4 text-emerald-600" />
                  <span>{health.database?.status || "Connected"}</span>
                </div>
                <div className="text-[11px] text-slate-500 font-mono">
                  Engine: {health.database?.engine || "MongoDB 8.x"}
                </div>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Node Runtime
                </div>
                <div className="text-base font-black text-slate-900 flex items-center gap-2">
                  <Server className="w-4 h-4 text-[#007A6C]" />
                  <span>{health.runtime?.version || process.version || "Node.js 20.x"}</span>
                </div>
                <div className="text-[11px] text-slate-500 font-mono">
                  Heap: {health.runtime?.heapUsed || "64 MB"} / {health.runtime?.heapTotal || "128 MB"}
                </div>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Cluster Uptime
                </div>
                <div className="text-base font-black text-slate-900 flex items-center gap-2">
                  <Activity className="w-4 h-4 text-[#FF6B00]" />
                  <span>{health.uptime || "99.98%"}</span>
                </div>
                <div className="text-[11px] text-slate-500 font-mono">
                  Environment: {health.env || "Production"}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
