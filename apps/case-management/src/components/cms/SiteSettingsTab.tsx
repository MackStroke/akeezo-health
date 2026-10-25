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
            href="http://localhost:4000/"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 text-xs text-teal-700 hover:text-teal-900 font-bold border border-teal-600 hover:bg-teal-50 px-3 py-1.5 rounded-lg transition"
          >
            <span>View Live Site</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>

          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-1.5 bg-teal-800 hover:bg-teal-900 active:bg-teal-950 text-white text-xs font-bold px-4 py-2 rounded-lg shadow-sm transition"
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

      {/* Grid Section 1: Brand & Colors */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-800 uppercase tracking-wider">
          <Palette className="w-4 h-4 text-teal-700" />
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

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">
              Primary Theme Color
            </label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={settings.primaryColor || "#00C7BE"}
                onChange={(e) => setSettings({ ...settings, primaryColor: e.target.value })}
                className="w-9 h-9 rounded border cursor-pointer"
              />
              <input
                type="text"
                value={settings.primaryColor || ""}
                onChange={(e) => setSettings({ ...settings, primaryColor: e.target.value })}
                className="w-full text-xs p-2 bg-slate-50 border rounded-lg font-mono"
              />
            </div>
          </div>
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">
              Action / CTA Button Color
            </label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={settings.actionColor || "#007A6C"}
                onChange={(e) => setSettings({ ...settings, actionColor: e.target.value })}
                className="w-9 h-9 rounded border cursor-pointer"
              />
              <input
                type="text"
                value={settings.actionColor || ""}
                onChange={(e) => setSettings({ ...settings, actionColor: e.target.value })}
                className="w-full text-xs p-2 bg-slate-50 border rounded-lg font-mono"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Grid Section 2: Helplines & Contacts */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-800 uppercase tracking-wider">
          <Phone className="w-4 h-4 text-teal-700" />
          <span>Patient Contact Helplines & WhatsApp</span>
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
