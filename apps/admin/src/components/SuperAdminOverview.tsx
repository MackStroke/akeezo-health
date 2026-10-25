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
    <div className="space-y-6 font-sans">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-[#061E1B] via-teal-950 to-[#061E1B] rounded-2xl p-7 text-white shadow-lg border border-[#00C7BE]/30 flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#00C7BE]/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="space-y-2 relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#007A6C]/50 text-[#00C7BE] border border-[#00C7BE]/40 shadow-xs">
            <ShieldCheck className="w-4 h-4 text-[#00C7BE]" />
            <span>Akeezo Super Admin Headquarters</span>
          </div>
          <h1 className="text-2xl font-black tracking-tight text-white">
            Healthcare Enterprise & Website Administration
          </h1>
          <p className="text-xs text-teal-100/80 max-w-2xl leading-relaxed">
            Centralized super administration for public website management, brand assets, inbound lead collection, and executive oversight of the Akeezo Case Management System.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0 relative z-10">
          <button
            onClick={() => onSelectTab("leads")}
            className="flex items-center justify-center gap-2 bg-[#FF6B00] hover:bg-[#FF6D1B] active:scale-98 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-md transition"
          >
            <Inbox className="w-4 h-4" />
            <span>Triage Inbound Leads</span>
          </button>
          <a
            href="/case-management/"
            className="flex items-center justify-center gap-2 bg-white text-[#061E1B] hover:bg-[#E6F8F6] active:scale-98 font-bold text-xs px-4 py-2.5 rounded-xl shadow-md transition border border-[#00C7BE]/40"
          >
            <Briefcase className="w-4 h-4 text-[#007A6C]" />
            <span>Launch Case Management System</span>
            <ExternalLink className="w-3.5 h-3.5 text-[#007A6C]" />
          </a>
        </div>
      </div>

      {/* Cross-Platform KPI Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Website Management */}
        <div
          onClick={() => onSelectTab("website")}
          className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-[#00C7BE] hover:shadow-md transition cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Website CMS Pages</span>
            <div className="w-8 h-8 rounded-lg bg-[#E6F8F6] text-[#007A6C] flex items-center justify-center group-hover:bg-[#007A6C] group-hover:text-white transition">
              <Globe className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900 mt-3">
            {stats?.website.totalPages ?? 7}
          </p>
          <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-100 text-[11px]">
            <span className="text-[#007A6C] font-bold">Manage Website Pages</span>
            <ArrowRight className="w-3.5 h-3.5 text-[#007A6C] group-hover:translate-x-0.5 transition" />
          </div>
        </div>

        {/* Card 2: Inbound Leads Collected */}
        <div
          onClick={() => onSelectTab("leads")}
          className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-[#FF6B00] hover:shadow-md transition cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Website Leads Collected</span>
            <div className="w-8 h-8 rounded-lg bg-[#FFF4EC] text-[#FF6B00] flex items-center justify-center group-hover:bg-[#FF6B00] group-hover:text-white transition">
              <Inbox className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900 mt-3">
            {stats?.leads.totalEnquiries ?? 0}
          </p>
          <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-100 text-[11px]">
            <span className="text-[#B54700] font-bold">{stats?.leads.newEnquiries ?? 0} Pending Triage</span>
            <ArrowRight className="w-3.5 h-3.5 text-[#B54700] group-hover:translate-x-0.5 transition" />
          </div>
        </div>

        {/* Card 3: Case Management Pipeline */}
        <div
          onClick={() => onSelectTab("cases-admin")}
          className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-[#00C7BE] hover:shadow-md transition cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Active Patient Cases</span>
            <div className="w-8 h-8 rounded-lg bg-[#E6F8F6] text-[#007A6C] flex items-center justify-center group-hover:bg-[#007A6C] group-hover:text-white transition">
              <Briefcase className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900 mt-3">
            {stats?.caseManagement.activeCases ?? 0}
          </p>
          <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-100 text-[11px]">
            <span className="text-[#007A6C] font-bold">Total: {stats?.caseManagement.totalCases ?? 0} Cases</span>
            <ArrowRight className="w-3.5 h-3.5 text-[#007A6C] group-hover:translate-x-0.5 transition" />
          </div>
        </div>

        {/* Card 4: Lead-to-Case Conversion */}
        <div
          onClick={() => onSelectTab("leads")}
          className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-[#FF6B00] hover:shadow-md transition cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Lead Conversion Rate</span>
            <div className="w-8 h-8 rounded-lg bg-[#FFF4EC] text-[#FF6B00] flex items-center justify-center group-hover:bg-[#FF6B00] group-hover:text-white transition">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900 mt-3">
            {stats?.leads.conversionRatePercent ?? 0}%
          </p>
          <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-100 text-[11px]">
            <span className="text-[#B54700] font-bold">{stats?.leads.convertedEnquiries ?? 0} Converted</span>
            <ArrowRight className="w-3.5 h-3.5 text-[#B54700] group-hover:translate-x-0.5 transition" />
          </div>
        </div>
      </div>

      {/* Two Pillars Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Pillar: Website Front End CMS */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col justify-between space-y-4 hover:border-[#00C7BE]/60 transition">
          <div className="space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-[#E6F8F6] text-[#007A6C] border border-[#B2EBE4] flex items-center justify-center font-black text-xs">
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
              className="flex-1 bg-[#007A6C] hover:bg-[#005F54] text-white font-bold text-xs py-2.5 rounded-xl transition flex items-center justify-center gap-1.5 shadow-xs"
            >
              <span>Manage Website & CMS</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <a
              href="/"
              target="_blank"
              rel="noreferrer"
              className="px-3.5 py-2.5 text-xs font-bold text-slate-700 hover:text-[#007A6C] border border-slate-200 hover:bg-[#E6F8F6] rounded-xl transition flex items-center gap-1"
            >
              <span>Preview</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>

        {/* Right Pillar: Case Management System */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col justify-between space-y-4 hover:border-[#FF6B00]/60 transition">
          <div className="space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-[#FFF4EC] text-[#FF6B00] border border-[#FFD8BF] flex items-center justify-center font-black text-xs">
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
              className="flex-1 bg-[#FF6B00] hover:bg-[#FF6D1B] active:scale-98 text-white font-bold text-xs py-2.5 rounded-xl transition flex items-center justify-center gap-1.5 shadow-xs"
            >
              <span>Open Case Management System</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
            <button
              onClick={() => onSelectTab("cases-admin")}
              className="px-3.5 py-2.5 text-xs font-bold text-slate-700 hover:text-[#007A6C] border border-slate-200 hover:bg-slate-50 rounded-xl transition"
            >
              <span>View Overview</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
