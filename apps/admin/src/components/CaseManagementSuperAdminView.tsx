import React, { useState, useEffect } from "react";
import {
  Briefcase,
  Users,
  Building2,
  ExternalLink,
  ShieldCheck,
  TrendingUp,
  FolderKanban,
  ArrowRight,
} from "lucide-react";

interface CaseStats {
  caseManagement: {
    totalCases: number;
    activeCases: number;
    closedCases: number;
    totalPartners: number;
    totalHospitals: number;
    stageBreakdown: Record<string, number>;
  };
  leads: {
    totalEnquiries: number;
    convertedEnquiries: number;
    conversionRatePercent: number;
  };
}

export const CaseManagementSuperAdminView: React.FC = () => {
  const [stats, setStats] = useState<CaseStats | null>(null);
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
      console.error("Failed to load case management stats", err);
    } finally {
      setLoading(false);
    }
  };

  const stages = [
    { id: "new_referral", label: "New Referral", color: "bg-[#FF6B00]" },
    { id: "quotes_requested", label: "Quotes Requested", color: "bg-[#007A6C]" },
    { id: "quotes_shared", label: "Quotes Shared", color: "bg-[#00C7BE]" },
    { id: "partner_decision", label: "Partner Decision", color: "bg-[#FF6D1B]" },
    { id: "visa_travel", label: "Visa & Inbound", color: "bg-[#007A6C]" },
    { id: "in_treatment", label: "In Treatment", color: "bg-[#061E1B]" },
    { id: "settlement", label: "Billing & Settlement", color: "bg-[#FF6B00]" },
    { id: "closed", label: "Closed & Archived", color: "bg-slate-400" },
  ];

  return (
    <div className="space-y-6 font-sans">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#061E1B] via-teal-950 to-[#061E1B] rounded-2xl p-6 text-white shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4 border border-[#00C7BE]/30 relative overflow-hidden">
        <div className="space-y-1 relative z-10">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#007A6C]/50 text-[#00C7BE] border border-[#00C7BE]/30">
            <ShieldCheck className="w-3.5 h-3.5 text-[#00C7BE]" />
            <span>Akeezo ERP Operational Governance</span>
          </div>
          <h1 className="text-xl font-black tracking-tight">Case Management System Oversight</h1>
          <p className="text-xs text-teal-100/80 max-w-2xl leading-relaxed">
            Executive oversight over clinical, logistical, and financial operations across the 12-stage patient journey in the Akeezo Case Management System.
          </p>
        </div>

        <div className="flex items-center gap-3 relative z-10">
          <a
            href="/case-management/"
            className="inline-flex items-center gap-2 bg-[#FF6B00] hover:bg-[#FF6D1B] active:scale-98 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-md transition"
          >
            <Briefcase className="w-4 h-4" />
            <span>Launch Case Management System</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Cases Managed</span>
            <FolderKanban className="w-4 h-4 text-[#007A6C]" />
          </div>
          <p className="text-2xl font-black text-slate-900 mt-2">
            {stats?.caseManagement.totalCases ?? "..."}
          </p>
          <span className="text-[10px] text-[#007A6C] font-bold block mt-1">
            {stats?.caseManagement.activeCases ?? 0} In Active Care
          </span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Lead Conversion Rate</span>
            <TrendingUp className="w-4 h-4 text-[#FF6B00]" />
          </div>
          <p className="text-2xl font-black text-[#B54700] mt-2">
            {stats?.leads.conversionRatePercent ?? 0}%
          </p>
          <span className="text-[10px] text-slate-500 block mt-1">
            {stats?.leads.convertedEnquiries ?? 0} Converted into Cases
          </span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Partner Facilitators</span>
            <Users className="w-4 h-4 text-[#FF6B00]" />
          </div>
          <p className="text-2xl font-black text-slate-900 mt-2">
            {stats?.caseManagement.totalPartners ?? "..."}
          </p>
          <span className="text-[10px] text-slate-500 block mt-1">Active Agency Agreements</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Hospital Network</span>
            <Building2 className="w-4 h-4 text-[#007A6C]" />
          </div>
          <p className="text-2xl font-black text-slate-900 mt-2">
            {stats?.caseManagement.totalHospitals ?? "..."}
          </p>
          <span className="text-[10px] text-slate-500 block mt-1">Accredited Partner Providers</span>
        </div>
      </div>

      {/* Pipeline Stage Breakdown */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h3 className="text-sm font-bold text-slate-800">Operational Pipeline Stages</h3>
            <p className="text-xs text-slate-500">Live distribution of patient journeys across all operational checkpoints.</p>
          </div>
          <a
            href="/case-management/"
            className="text-xs font-bold text-[#007A6C] hover:text-[#005F54] flex items-center gap-1 border border-[#B2EBE4] bg-[#E6F8F6] px-3 py-1.5 rounded-lg transition"
          >
            <span>Open Pipeline Board</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </a>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3">
          {stages.map((st) => {
            const count = stats?.caseManagement.stageBreakdown[st.id] || 0;
            return (
              <div key={st.id} className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-2 hover:border-[#00C7BE] transition">
                <div className="flex items-center gap-2">
                  <div className={`w-2.5 h-2.5 rounded-full ${st.color}`} />
                  <span className="text-[11px] font-bold text-slate-700 truncate">{st.label}</span>
                </div>
                <p className="text-xl font-black text-slate-900">{count}</p>
                <div className="text-[10px] text-slate-400">Cases in stage</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Cross-System Quick Launch */}
      <div className="bg-[#061E1B] rounded-2xl p-6 text-white border border-[#00C7BE]/30 shadow-md flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="space-y-1">
          <h3 className="text-base font-bold text-white">Direct Access to Case Management CMS</h3>
          <p className="text-xs text-teal-100/70 max-w-xl leading-relaxed">
            As Super Admin, launch the dedicated Case Management System to manage quotations, assign hospital RFQs, generate visas, record admissions, and finalize partner commission payouts.
          </p>
        </div>
        <a
          href="/case-management/"
          className="bg-[#FF6B00] hover:bg-[#FF6D1B] active:scale-98 text-white font-bold text-xs px-5 py-3 rounded-xl transition flex items-center gap-2 shrink-0 shadow-md"
        >
          <span>Open Full CMS & ERP Platform</span>
          <ExternalLink className="w-4 h-4" />
        </a>
      </div>
    </div>
  );
};
