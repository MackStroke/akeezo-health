import React, { useState, useEffect } from "react";
import { Check, Save, Globe, Phone, Mail, MapPin, Palette, Sparkles, ExternalLink } from "lucide-react";

export const SiteSettingsTab: React.FC = () => {
  const [settings, setSettings] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/v1/admin/site-settings");
      const json = await res.json();
      setSettings(json.data);
    } catch (err) {
      console.error("Failed to load site settings", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      setSaveSuccess(false);
      const res = await fetch("/api/v1/admin/site-settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });

      if (res.ok) {
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 4000);
      } else {
        alert("Failed to update site settings");
      }
    } catch (err: any) {
      alert(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading || !settings) {
    return <div className="p-8 text-center text-xs text-slate-400">Loading site settings...</div>;
  }

  return (
    <form onSubmit={handleSave} className="space-y-6">
      <div className="flex items-center justify-between pb-2 border-b border-slate-200">
        <div>
          <h2 className="text-base font-bold text-slate-800">
            Brand Identity, Helplines & Global Metadata
          </h2>
          <p className="text-xs text-slate-500">
            Updates brand assets, contact numbers, and emergency hotlines across the public website.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <a
            href="/"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 text-xs text-[#007A6C] hover:text-[#005F54] font-bold border border-[#007A6C]/40 hover:bg-[#E6F8F6] px-3 py-1.5 rounded-lg transition"
          >
            <span>View Live Site</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>

          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-1.5 bg-[#FF6B00] hover:bg-[#FF6D1B] active:bg-[#E05E00] text-white text-xs font-bold px-4 py-2 rounded-lg shadow-sm transition"
          >
            {saveSuccess ? (
              <>
                <Check className="w-4 h-4 text-emerald-300" />
                <span>Saved & Live!</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>{saving ? "Saving..." : "Save & Publish Settings"}</span>
              </>
            )}
          </button>
        </div>
      </div>

      {saveSuccess && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-xs font-semibold text-emerald-900 flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-600" />
          <span>Site settings successfully updated in MongoDB and delivered to the public site.</span>
        </div>
      )}

      {/* Theme Studio Callout Banner */}
      <div className="p-4 bg-gradient-to-r from-teal-900 to-[#061E1B] rounded-xl text-white flex items-center justify-between border border-[#00C7BE]/30 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-[#007A6C]/40 text-[#00C7BE]">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-bold flex items-center gap-2">
              <span>Full Branding & Theme Studio Active</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-[#00C7BE]/20 text-[#00C7BE] border border-[#00C7BE]/30 font-extrabold uppercase">Architecture Verified</span>
            </div>
            <p className="text-[11px] text-teal-200/80">
              Control full color swatches, button styles, typography, light/dark modes, and 1-click curated presets in the dedicated <strong>Branding & Theme Studio</strong> tab with zero hardcoding.
            </p>
          </div>
        </div>
      </div>

      {/* Grid Section 1: Brand & Colors */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-800 uppercase tracking-wider">
          <Palette className="w-4 h-4 text-[#007A6C]" />
          <span>Brand Identity & Tokens</span>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">
              Brand Name
            </label>
            <input
              type="text"
              value={settings.brandName || ""}
              onChange={(e) => setSettings({ ...settings, brandName: e.target.value })}
              className="w-full text-xs p-2.5 bg-slate-50 border rounded-lg focus:outline-teal-600 font-bold"
            />
          </div>
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">
              Global Tagline
            </label>
            <input
              type="text"
              value={settings.tagline || ""}
              onChange={(e) => setSettings({ ...settings, tagline: e.target.value })}
              className="w-full text-xs p-2.5 bg-slate-50 border rounded-lg focus:outline-teal-600"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">
              Primary Brand Teal
            </label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={settings.primaryColor || "#00C7BE"}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    primaryColor: e.target.value,
                    websiteTheme: {
                      ...(settings.websiteTheme || {}),
                      primaryColor: e.target.value,
                    },
                  })
                }
                className="w-9 h-9 rounded border cursor-pointer"
              />
              <input
                type="text"
                value={settings.primaryColor || ""}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    primaryColor: e.target.value,
                    websiteTheme: {
                      ...(settings.websiteTheme || {}),
                      primaryColor: e.target.value,
                    },
                  })
                }
                className="w-full text-xs p-2 bg-slate-50 border rounded-lg font-mono uppercase"
              />
            </div>
          </div>
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">
              Action / CTA Button
            </label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={settings.actionColor || "#007A6C"}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    actionColor: e.target.value,
                    websiteTheme: {
                      ...(settings.websiteTheme || {}),
                      actionColor: e.target.value,
                    },
                  })
                }
                className="w-9 h-9 rounded border cursor-pointer"
              />
              <input
                type="text"
                value={settings.actionColor || ""}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    actionColor: e.target.value,
                    websiteTheme: {
                      ...(settings.websiteTheme || {}),
                      actionColor: e.target.value,
                    },
                  })
                }
                className="w-full text-xs p-2 bg-slate-50 border rounded-lg font-mono uppercase"
              />
            </div>
          </div>
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">
              Brand Orange Accent
            </label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={settings.secondaryColor || "#FF6B00"}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    secondaryColor: e.target.value,
                    websiteTheme: {
                      ...(settings.websiteTheme || {}),
                      secondaryColor: e.target.value,
                    },
                  })
                }
                className="w-9 h-9 rounded border cursor-pointer"
              />
              <input
                type="text"
                value={settings.secondaryColor || ""}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    secondaryColor: e.target.value,
                    websiteTheme: {
                      ...(settings.websiteTheme || {}),
                      secondaryColor: e.target.value,
                    },
                  })
                }
                className="w-full text-xs p-2 bg-slate-50 border rounded-lg font-mono uppercase"
              />
            </div>
          </div>
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">
              Accent Orange Alt
            </label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={settings.accentColor || "#FF6D1B"}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    accentColor: e.target.value,
                    websiteTheme: {
                      ...(settings.websiteTheme || {}),
                      accentColor: e.target.value,
                    },
                  })
                }
                className="w-9 h-9 rounded border cursor-pointer"
              />
              <input
                type="text"
                value={settings.accentColor || ""}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    accentColor: e.target.value,
                    websiteTheme: {
                      ...(settings.websiteTheme || {}),
                      accentColor: e.target.value,
                    },
                  })
                }
                className="w-full text-xs p-2 bg-slate-50 border rounded-lg font-mono uppercase"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Grid Section 2: Helplines & Contacts */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-800 uppercase tracking-wider">
          <Phone className="w-4 h-4 text-teal-700" />
          <span>Patient Contact Helplines & Emergency Controls</span>
        </div>

        {/* Top Emergency Utility Bar Controls */}
        <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-lg space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-slate-800 block">
                Top Emergency & Utility Bar
              </span>
              <span className="text-[11px] text-slate-500">
                Displays the 24/7 emergency response badge, quick calling buttons, hospital/agent portals, and regional switcher.
              </span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.showTopUtilityBar !== false}
                onChange={(e) => setSettings({ ...settings, showTopUtilityBar: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-9 h-5 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-teal-700"></div>
            </label>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">
              Emergency Notice Label
            </label>
            <input
              type="text"
              value={settings.emergencyNotice || "EMERGENCY?"}
              onChange={(e) => setSettings({ ...settings, emergencyNotice: e.target.value })}
              className="w-full text-xs p-2 bg-white border rounded-lg focus:outline-teal-600 font-bold"
              placeholder="EMERGENCY?"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">
              Emergency Care Helpline
            </label>
            <input
              type="text"
              value={settings.emergencyHelpline || ""}
              onChange={(e) => setSettings({ ...settings, emergencyHelpline: e.target.value })}
              className="w-full text-xs p-2.5 bg-slate-50 border rounded-lg focus:outline-teal-600 font-bold"
            />
          </div>
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">
              WhatsApp Concierge Number
            </label>
            <input
              type="text"
              value={settings.whatsappHelpline || ""}
              onChange={(e) => setSettings({ ...settings, whatsappHelpline: e.target.value })}
              className="w-full text-xs p-2.5 bg-slate-50 border rounded-lg focus:outline-teal-600 font-bold"
            />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">
              Patient Care Email
            </label>
            <input
              type="email"
              value={settings.careEmail || ""}
              onChange={(e) => setSettings({ ...settings, careEmail: e.target.value })}
              className="w-full text-xs p-2.5 bg-slate-50 border rounded-lg focus:outline-teal-600"
            />
          </div>
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">
              Clinical / Medical Email
            </label>
            <input
              type="email"
              value={settings.medicalEmail || ""}
              onChange={(e) => setSettings({ ...settings, medicalEmail: e.target.value })}
              className="w-full text-xs p-2.5 bg-slate-50 border rounded-lg focus:outline-teal-600"
            />
          </div>
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">
              Partnership Email
            </label>
            <input
              type="email"
              value={settings.partnershipEmail || ""}
              onChange={(e) => setSettings({ ...settings, partnershipEmail: e.target.value })}
              className="w-full text-xs p-2.5 bg-slate-50 border rounded-lg focus:outline-teal-600"
            />
          </div>
        </div>

        <div>
          <label className="text-xs font-bold text-slate-700 block mb-1">
            Headquarters Office Address
          </label>
          <input
            type="text"
            value={settings.headquartersAddress || ""}
            onChange={(e) => setSettings({ ...settings, headquartersAddress: e.target.value })}
            className="w-full text-xs p-2.5 bg-slate-50 border rounded-lg focus:outline-teal-600"
          />
        </div>
      </div>
    </form>
  );
};
