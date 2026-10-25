import React, { useState, useEffect } from "react";
import {
  Globe,
  Inbox,
  Briefcase,
  Users,
  Building2,
  TrendingUp,
  ShieldCheck,
  ArrowRight,
  ExternalLink,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";

interface OverviewProps {
  onSelectTab: (tab: "overview" | "website" | "leads" | "cases-admin" | "rbac") => void;
}

export const SuperAdminOverview: React.FC<OverviewProps> = ({ onSelectTab }) => {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/v1/admin/overview-stats");
      if (res.ok) {
        const json = await res.json();
        setStats(json.data);
      }
    } catch (err) {
      console.error("Failed to load overview stats", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-teal-950 via-teal-900 to-slate-900 rounded-2xl p-7 text-white shadow-lg border border-teal-800/40 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-teal-800/80 text-teal-200 border border-teal-600/40">
            <ShieldCheck className="w-4 h-4 text-teal-300" />
            <span>Super Admin Headquarters</span>
          </div>
          <h1 className="text-2xl font-black tracking-tight text-white">
            Akeezo Healthcare Enterprise Administration
          </h1>
          <p className="text-xs text-teal-100/80 max-w-2xl leading-relaxed">
            Centralized super administration for public website management, brand assets, inbound lead collection, and executive oversight of the Akeezo Case Management System.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
          <button
            onClick={() => onSelectTab("leads")}
            className="flex items-center justify-center gap-2 bg-teal-800 hover:bg-teal-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl border border-teal-600/50 shadow-xs transition"
          >
            <Inbox className="w-4 h-4" />
            <span>Triage Inbound Leads</span>
          </button>
          <a
            href="/case-management/"
            className="flex items-center justify-center gap-2 bg-white text-teal-950 hover:bg-teal-50 font-bold text-xs px-4 py-2.5 rounded-xl shadow-md transition"
          >
            <Briefcase className="w-4 h-4 text-teal-800" />
            <span>Launch Case Management System</span>
            <ExternalLink className="w-3.5 h-3.5 opacity-70" />
          </a>
        </div>
      </div>

      {/* Cross-Platform KPI Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Website Management */}
        <div
          onClick={() => onSelectTab("website")}
          className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-teal-400 hover:shadow-md transition cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-400 uppercase">Website CMS Pages</span>
            <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-800 flex items-center justify-center group-hover:bg-teal-800 group-hover:text-white transition">
              <Globe className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900 mt-3">
            {stats?.website.totalPages ?? 14}
          </p>
          <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-100 text-[11px]">
            <span className="text-teal-700 font-bold">Manage Website Pages</span>
            <ArrowRight className="w-3.5 h-3.5 text-teal-700 group-hover:translate-x-0.5 transition" />
          </div>
        </div>

        {/* Card 2: Inbound Leads Collected */}
        <div
          onClick={() => onSelectTab("leads")}
          className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-teal-400 hover:shadow-md transition cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-400 uppercase">Website Leads Collected</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-800 flex items-center justify-center group-hover:bg-amber-600 group-hover:text-white transition">
              <Inbox className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900 mt-3">
            {stats?.leads.totalEnquiries ?? 0}
          </p>
          <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-100 text-[11px]">
            <span className="text-amber-800 font-bold">{stats?.leads.newEnquiries ?? 0} Pending Triage</span>
            <ArrowRight className="w-3.5 h-3.5 text-amber-800 group-hover:translate-x-0.5 transition" />
          </div>
        </div>

        {/* Card 3: Case Management Pipeline */}
        <div
          onClick={() => onSelectTab("cases-admin")}
          className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-teal-400 hover:shadow-md transition cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-400 uppercase">Active Patient Cases</span>
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-800 flex items-center justify-center group-hover:bg-indigo-700 group-hover:text-white transition">
              <Briefcase className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900 mt-3">
            {stats?.caseManagement.activeCases ?? 0}
          </p>
          <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-100 text-[11px]">
            <span className="text-indigo-700 font-bold">Total: {stats?.caseManagement.totalCases ?? 0} Cases</span>
            <ArrowRight className="w-3.5 h-3.5 text-indigo-700 group-hover:translate-x-0.5 transition" />
          </div>
        </div>

        {/* Card 4: Lead-to-Case Conversion */}
        <div
          onClick={() => onSelectTab("leads")}
          className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-teal-400 hover:shadow-md transition cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-400 uppercase">Lead Conversion Rate</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-800 flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-emerald-950 mt-3">
            {stats?.leads.conversionRatePercent ?? 0}%
          </p>
          <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-100 text-[11px]">
            <span className="text-emerald-800 font-bold">{stats?.leads.convertedEnquiries ?? 0} Converted</span>
            <ArrowRight className="w-3.5 h-3.5 text-emerald-800 group-hover:translate-x-0.5 transition" />
          </div>
        </div>
      </div>

      {/* Two Pillars Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Pillar: Website Front End CMS */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-teal-100 text-teal-800 flex items-center justify-center font-bold text-xs">
                1
              </div>
              <h3 className="text-base font-bold text-slate-900">
                Akeezo Website Management (CMS)
              </h3>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Super Admin control over website branding, emergency phone numbers, WhatsApp helplines, home hero content, treatment descriptions, and hospital directory listings with immutable content revisions.
            </p>
            <ul className="text-xs text-slate-600 space-y-1.5 list-disc list-inside pt-1">
              <li>Manage Brand Identity, official SVGs, and helpline routing</li>
              <li>Edit Home, Treatments, Hospitals, and Legal Policies</li>
              <li>Draft revision preview and atomic live publication</li>
            </ul>
          </div>

          <div className="flex items-center gap-3 pt-3 border-t border-slate-100">
            <button
              onClick={() => onSelectTab("website")}
              className="flex-1 bg-teal-800 hover:bg-teal-900 text-white font-bold text-xs py-2.5 rounded-xl transition flex items-center justify-center gap-1.5"
            >
              <span>Manage Website & CMS</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <a
              href="/"
              target="_blank"
              rel="noreferrer"
              className="px-3 py-2.5 text-xs font-bold text-slate-700 hover:text-slate-900 border border-slate-200 hover:bg-slate-50 rounded-xl transition flex items-center gap-1"
            >
              <span>Preview</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>

        {/* Right Pillar: Case Management System */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-indigo-100 text-indigo-800 flex items-center justify-center font-bold text-xs">
                2
              </div>
              <h3 className="text-base font-bold text-slate-900">
                Akeezo Case Management System (ERP)
              </h3>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Autonomous operational platform responsible for handling leads and processing them through clinical intake, RFQ quotes, travel visas, hospital admissions, billing, and partner commission payouts.
            </p>
            <ul className="text-xs text-slate-600 space-y-1.5 list-disc list-inside pt-1">
              <li>Pipeline Board across 7 clinical checkpoints</li>
              <li>Hospital quotes comparison & doctor matching</li>
              <li>Partner agency facilitator revenue share calculations</li>
            </ul>
          </div>

          <div className="flex items-center gap-3 pt-3 border-t border-slate-100">
            <a
              href="/case-management/"
              className="flex-1 bg-indigo-700 hover:bg-indigo-800 text-white font-bold text-xs py-2.5 rounded-xl transition flex items-center justify-center gap-1.5 shadow-xs"
            >
              <span>Open Case Management System</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
            <button
              onClick={() => onSelectTab("cases-admin")}
              className="px-3 py-2.5 text-xs font-bold text-slate-700 hover:text-slate-900 border border-slate-200 hover:bg-slate-50 rounded-xl transition"
            >
              <span>View Overview</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
