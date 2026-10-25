import React, { useState, useEffect } from "react";
import {
  Briefcase,
  Users,
  Building2,
  ExternalLink,
  ShieldCheck,
  TrendingUp,
  FolderKanban,
  CheckCircle2,
  Clock,
  ArrowRight,
  DollarSign,
  AlertTriangle,
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
    { id: "intake", label: "Intake & Triage", color: "bg-amber-500" },
    { id: "quotes", label: "Hospital Quotes & RFQ", color: "bg-blue-500" },
    { id: "travel", label: "Visa & Inbound Logistics", color: "bg-indigo-500" },
    { id: "medical", label: "Admitted & In-Care", color: "bg-purple-500" },
    { id: "discharge", label: "Discharge & Recovery", color: "bg-teal-500" },
    { id: "billing", label: "Final Billing & Commission", color: "bg-emerald-500" },
    { id: "closed", label: "Completed & Archived", color: "bg-slate-400" },
  ];

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-teal-950 to-slate-900 rounded-2xl p-6 text-white shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4 border border-teal-800/30">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-teal-800/60 text-teal-200 border border-teal-500/30">
            <ShieldCheck className="w-3.5 h-3.5 text-teal-300" />
            <span>Super Admin Operations & ERP Control</span>
          </div>
          <h1 className="text-xl font-black tracking-tight">Case Management System Oversight</h1>
          <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
            Overall administration, pipeline analytics, and executive oversight over the clinical, logistical, and financial operations in the Akeezo Case Management System.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <a
            href="/case-management/"
            className="inline-flex items-center gap-2 bg-teal-600 hover:bg-teal-500 active:bg-teal-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-md transition"
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
            <span className="text-[11px] font-bold text-slate-400 uppercase">Total Cases Managed</span>
            <FolderKanban className="w-4 h-4 text-teal-700" />
          </div>
          <p className="text-2xl font-black text-slate-900 mt-2">
            {stats?.caseManagement.totalCases ?? "..."}
          </p>
          <span className="text-[10px] text-teal-700 font-bold block mt-1">
            {stats?.caseManagement.activeCases ?? 0} Currently In Progress
          </span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-400 uppercase">Lead Conversion Rate</span>
            <TrendingUp className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-2xl font-black text-emerald-950 mt-2">
            {stats?.leads.conversionRatePercent ?? 0}%
          </p>
          <span className="text-[10px] text-slate-500 block mt-1">
            {stats?.leads.convertedEnquiries ?? 0} Cases from Website Leads
          </span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-400 uppercase">Partner Facilitators</span>
            <Users className="w-4 h-4 text-indigo-600" />
          </div>
          <p className="text-2xl font-black text-slate-900 mt-2">
            {stats?.caseManagement.totalPartners ?? "..."}
          </p>
          <span className="text-[10px] text-slate-500 block mt-1">Active Agency Agreements</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-400 uppercase">Hospital Network</span>
            <Building2 className="w-4 h-4 text-teal-600" />
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
            <p className="text-xs text-slate-500">Live distribution of patient journeys across all 7 operational checkpoints.</p>
          </div>
          <a
            href="/case-management/"
            className="text-xs font-bold text-teal-800 hover:text-teal-950 flex items-center gap-1 border border-teal-300 px-3 py-1.5 rounded-lg transition"
          >
            <span>Open Pipeline Board</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </a>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
          {stages.map((st) => {
            const count = stats?.caseManagement.stageBreakdown[st.id] || 0;
            return (
              <div key={st.id} className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/80 space-y-2">
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
      <div className="bg-slate-900 rounded-2xl p-6 text-white border border-slate-800 shadow-md flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="space-y-1">
          <h3 className="text-base font-bold text-white">Direct Access to Case Management CMS</h3>
          <p className="text-xs text-slate-400 max-w-xl">
            As Super Admin, you can launch the dedicated Case Management System to manage quotations, assign hospital RFQs, generate visas, record admissions, and finalize partner commission payouts.
          </p>
        </div>
        <a
          href="/case-management/"
          className="bg-teal-600 hover:bg-teal-500 active:bg-teal-700 text-white font-bold text-xs px-5 py-3 rounded-xl transition flex items-center gap-2 shrink-0 shadow-xs"
        >
          <span>Open Full CMS & ERP Platform</span>
          <ExternalLink className="w-4 h-4" />
        </a>
      </div>
    </div>
  );
};
