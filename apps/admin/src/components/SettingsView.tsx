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
} from "lucide-react";
import { ThemeStudioView } from "./ThemeStudioView.js";

export const SettingsView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<
    "general" | "branding" | "forms" | "integrations" | "health"
  >("general");

  const [settings, setSettings] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [savingSection, setSavingSection] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState("");
  const [saveError, setSaveError] = useState("");

  // System Health State
  const [health, setHealth] = useState<any>(null);
  const [loadingHealth, setLoadingHealth] = useState(false);

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
      setTimeout(() => setSaveSuccess(""), 3000);
    } catch (err: any) {
      setSaveError(err.message);
    } finally {
      setSavingSection(false);
    }
  };

  if (loading) {
    return (
      <div className="p-12 text-center text-slate-400 text-xs font-semibold bg-white rounded-2xl border border-slate-200">
        Loading platform settings...
      </div>
    );
  }

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
            Configure platform parameters, brand tokens, lead dispatch webhooks, third-party integrations, and inspect real-time server runtime metrics.
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
          <span>System Health & Diagnostics</span>
        </button>
      </div>

      {/* Notifications Banner */}
      {saveSuccess && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{saveSuccess}</span>
        </div>
      )}
      {saveError && (
        <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 text-xs flex items-center gap-2">
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

      {/* TAB 4: INTEGRATIONS & SECRETS */}
      {activeTab === "integrations" && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h2 className="text-base font-bold text-slate-900">Cloud Integrations & API Keys</h2>
              <span className="text-xs text-slate-400">
                Secrets are masked and protected in compliance with DPDP encryption policies.
              </span>
            </div>
          </div>

          <div className="space-y-3">
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between text-xs">
              <div>
                <div className="font-bold text-slate-900">Firebase Production Project</div>
                <div className="font-mono text-slate-500 text-[11px]">
                  {settings.integrations?.firebaseProjectMasked || "akeezo-health-prod (Active)"}
                </div>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                Connected
              </span>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between text-xs">
              <div>
                <div className="font-bold text-slate-900">SMTP Gateway (SendGrid / Postmark)</div>
                <div className="font-mono text-slate-500 text-[11px]">
                  {settings.integrations?.smtpHostMasked || "smtp.sendgrid.net (Configured)"}
                </div>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                Active
              </span>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between text-xs">
              <div>
                <div className="font-bold text-slate-900">Cloud Storage Bucket (GCS)</div>
                <div className="font-mono text-slate-500 text-[11px]">
                  {settings.integrations?.storageBucketMasked || "gs://akeezo-vault-prod (Protected)"}
                </div>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                Encrypted
              </span>
            </div>
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
              <span>Refresh Metrics</span>
            </button>
          </div>

          {health ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Node Engine</span>
                <div className="text-base font-black text-slate-900">{health.runtime?.node}</div>
                <span className="text-[10px] text-slate-500 font-mono">{health.runtime?.platform}</span>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Server Memory (RSS)</span>
                <div className="text-base font-black text-slate-900">{health.memory?.rssMb} MB</div>
                <span className="text-[10px] text-slate-500">Heap: {health.memory?.heapUsedMb} MB</span>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase">MongoDB Connection</span>
                <div className="text-base font-black text-emerald-600 capitalize">
                  {health.database?.status}
                </div>
                <span className="text-[10px] text-slate-500 font-mono">127.0.0.1:27017</span>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Server Uptime</span>
                <div className="text-base font-black text-slate-900">{health.runtime?.uptimeSeconds}s</div>
                <span className="text-[10px] text-slate-500">Active Daemon</span>
              </div>
            </div>
          ) : (
            <div className="py-8 text-center text-slate-400 text-xs">
              Loading runtime diagnostic metrics...
            </div>
          )}
        </div>
      )}
    </div>
  );
};
