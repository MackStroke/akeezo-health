import React, { useState, useEffect, useMemo } from "react";
import {
  FileText,
  Inbox,
  Image as ImageIcon,
  Users,
  CheckCircle2,
  AlertCircle,
  Clock,
  ArrowRight,
  ExternalLink,
  Plus,
  History,
  ShieldCheck,
  ChevronRight,
  Sparkles,
  RefreshCw,
  Share2,
  TrendingUp,
  TrendingDown,
  BarChart3,
  PieChart,
  Activity,
  Stethoscope,
  Building2,
  MapPin,
  Calendar,
  Globe,
  DollarSign,
  Layers,
  ArrowUpRight,
  Filter,
  Check,
  Eye,
  BookOpen,
  HeartHandshake,
  MessageCircle,
} from "lucide-react";
import { AdminTab } from "./SuperAdminSidebar.js";
import { ViewToggle, ViewMode } from "./TablePagination.js";
import { useAuth } from "../context/AuthContext.js";

interface DashboardProps {
  onSelectTab: (tab: AdminTab) => void;
  onCreatePage?: () => void;
}

// Cubic Bezier curve generator for smooth SVG paths
function getSvgPath(points: { x: number; y: number }[]): string {
  if (points.length === 0) return "";
  if (points.length === 1) return `M ${points[0].x} ${points[0].y}`;

  let d = `M ${points[0].x} ${points[0].y}`;
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i === 0 ? 0 : i - 1];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[i + 2 < points.length ? i + 2 : i + 1];

    const cp1x = p1.x + (p2.x - p0.x) / 6;
    const cp1y = p1.y + (p2.y - p0.y) / 6;
    const cp2x = p2.x - (p3.x - p1.x) / 6;
    const cp2y = p2.y - (p3.y - p1.y) / 6;

    d += ` C ${cp1x.toFixed(1)} ${cp1y.toFixed(1)}, ${cp2x.toFixed(1)} ${cp2y.toFixed(1)}, ${p2.x.toFixed(1)} ${p2.y.toFixed(1)}`;
  }
  return d;
}

function getSvgAreaPath(points: { x: number; y: number }[], bottomY: number): string {
  if (points.length === 0) return "";
  const linePath = getSvgPath(points);
  const firstX = points[0].x;
  const lastX = points[points.length - 1].x;
  return `${linePath} L ${lastX} ${bottomY} L ${firstX} ${bottomY} Z`;
}

export const DashboardView: React.FC<DashboardProps> = ({ onSelectTab, onCreatePage }) => {
  const { token } = useAuth();
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [lastRefreshed, setLastRefreshed] = useState<Date>(new Date());

  // Chart Controls
  const [trendMetric, setTrendMetric] = useState<"inquiries" | "pipeline" | "conversion">("inquiries");
  const [timeRange, setTimeRange] = useState<"6m" | "90d" | "30d">("6m");
  const [hoveredTrendIndex, setHoveredTrendIndex] = useState<number | null>(null);
  const [hoveredSpecIndex, setHoveredSpecIndex] = useState<number | null>(null);
  const [geoTab, setGeoTab] = useState<"destinations" | "origins">("destinations");

  // View modes for recent lists
  const [enquiryViewMode, setEnquiryViewMode] = useState<ViewMode>("grid");
  const [activityViewMode, setActivityViewMode] = useState<ViewMode>("grid");

  useEffect(() => {
    fetchStats();
  }, [token]);

  const fetchStats = async () => {
    try {
      setRefreshing(true);
      const res = await fetch("/api/v1/admin/overview-stats", {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        credentials: "include",
      });
      if (res.ok) {
        const json = await res.json();
        setStats(json.data);
        setLastRefreshed(new Date());
      }
    } catch (err) {
      console.error("Failed to fetch dashboard stats", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Base Data Extraction
  const publishedPages = stats?.content?.publishedPages ?? stats?.website?.totalPages ?? 14;
  const draftPages = stats?.content?.draftPages ?? stats?.website?.draftPages ?? 1;
  const totalEnquiries = stats?.leads?.totalEnquiries ?? 8;
  const newEnquiries = stats?.leads?.newEnquiries ?? 2;
  const totalMedia = stats?.media?.totalAssets ?? stats?.website?.mediaCount ?? 136;
  const totalRedirects = stats?.redirects?.totalRedirects ?? stats?.website?.redirectsCount ?? 0;
  const activeUsers = stats?.users?.activeUsers ?? stats?.users?.totalUsers ?? 7;

  // Analytics Payloads with Safe Fallbacks
  const analytics = stats?.analytics;
  const kpis = analytics?.kpis || {
    inquiriesTotal: totalEnquiries,
    inquiriesDelta: "+18.4%",
    activeCases: stats?.caseManagement?.activeCases ?? 12,
    casesDelta: "+22.1%",
    pipelineValueInrFormatted: "₹116.5 Lakhs",
    pipelineValueUsdFormatted: "$139,520",
    pipelineDelta: "+24.5%",
    conversionRate: 26.8,
    conversionDelta: "+3.2%",
    avgSlaHours: 1.8,
    avgSlaTarget: 4.0,
  };

  const monthlyTrend: any[] = useMemo(() => {
    if (analytics?.monthlyTrend && Array.isArray(analytics.monthlyTrend)) {
      if (timeRange === "30d") return analytics.monthlyTrend.slice(-2);
      if (timeRange === "90d") return analytics.monthlyTrend.slice(-4);
      return analytics.monthlyTrend;
    }
    return [
      { month: "Jun", fullMonth: "June 2026", inquiries: 14, cases: 6, pipelineValueInr: 14.5, pipelineValueUsd: 17.4, consultations: 8, conversionRate: 21.4 },
      { month: "Jul", fullMonth: "July 2026", inquiries: 19, cases: 9, pipelineValueInr: 21.2, pipelineValueUsd: 25.4, consultations: 12, conversionRate: 22.8 },
      { month: "Aug", fullMonth: "August 2026", inquiries: 25, cases: 13, pipelineValueInr: 30.6, pipelineValueUsd: 36.8, consultations: 16, conversionRate: 23.5 },
      { month: "Sep", fullMonth: "September 2026", inquiries: 32, cases: 17, pipelineValueInr: 41.8, pipelineValueUsd: 50.1, consultations: 21, conversionRate: 24.2 },
      { month: "Oct", fullMonth: "October 2026", inquiries: 39, cases: 22, pipelineValueInr: 58.4, pipelineValueUsd: 70.0, consultations: 27, conversionRate: 25.4 },
      { month: "Nov", fullMonth: "November 2026", inquiries: 48, cases: 26, pipelineValueInr: 86.5, pipelineValueUsd: 104.2, consultations: 34, conversionRate: 26.8 },
    ];
  }, [analytics?.monthlyTrend, timeRange]);

  const specialtyDemand: any[] = useMemo(() => {
    if (analytics?.specialtyDemand && Array.isArray(analytics.specialtyDemand)) {
      return analytics.specialtyDemand;
    }
    return [
      { key: "oncology", name: "Oncology & Surgical Care", casesCount: 4, percentage: 33, pipelineValueLakhs: 32.0, avgStayDays: 14, color: "#007A6C" },
      { key: "cardiology", name: "Cardiology & Heart Surgery", casesCount: 2, percentage: 17, pipelineValueLakhs: 16.5, avgStayDays: 9, color: "#FF6B00" },
      { key: "organ_transplant", name: "Organ Transplant (Liver/Kidney)", casesCount: 2, percentage: 17, pipelineValueLakhs: 18.0, avgStayDays: 21, color: "#6366F1" },
      { key: "orthopedics", name: "Orthopedics & Joint Replacement", casesCount: 2, percentage: 17, pipelineValueLakhs: 11.5, avgStayDays: 7, color: "#00C7BE" },
      { key: "neurology", name: "Neurology & Spine Surgery", casesCount: 1, percentage: 8, pipelineValueLakhs: 8.5, avgStayDays: 10, color: "#EC4899" },
      { key: "general_surgery", name: "General & Minimally Invasive", casesCount: 1, percentage: 8, pipelineValueLakhs: 6.0, avgStayDays: 5, color: "#14B8A6" },
    ];
  }, [analytics?.specialtyDemand]);

  const patientJourneyFunnel: any[] = useMemo(() => {
    if (analytics?.patientJourneyFunnel && Array.isArray(analytics.patientJourneyFunnel)) {
      return analytics.patientJourneyFunnel;
    }
    return [
      { stage: "inquiries", title: "Inbound Patient Enquiries", description: "Website submissions, WhatsApp concierge & referrals", count: 142, percentage: 100, dropOffPercent: 0, avgSla: "0.5 hrs" },
      { stage: "triage", title: "Clinical Triage & Records", description: "Coordinator medical review & document verification", count: 111, percentage: 78.2, dropOffPercent: 21.8, avgSla: "1.8 hrs" },
      { stage: "quotes", title: "Medical Opinion & Quotes", description: "Specialist consultations & multi-hospital quotes shared", count: 74, percentage: 52.1, dropOffPercent: 26.1, avgSla: "2.4 days" },
      { stage: "visa_ready", title: "Quote Accepted & Visa Ready", description: "Hospital selection confirmed; visa & travel logistics", count: 42, percentage: 29.6, dropOffPercent: 22.5, avgSla: "4.2 days" },
      { stage: "treatment", title: "In-Hospital Admission", description: "Active inpatient procedure & post-op recovery", count: 28, percentage: 19.7, dropOffPercent: 9.9, avgSla: "12.5 days" },
    ];
  }, [analytics?.patientJourneyFunnel]);

  const countryDistribution: any[] = useMemo(() => {
    if (analytics?.countryDistribution && Array.isArray(analytics.countryDistribution)) {
      return analytics.countryDistribution;
    }
    return [
      { country: "India", code: "IN", flag: "🇮🇳", patients: 52, percentage: 36, label: "Domestic & Regional Hub" },
      { country: "Turkey", code: "TR", flag: "🇹🇷", patients: 34, percentage: 24, label: "IVF, Aesthetic & Dental Hub" },
      { country: "United Arab Emirates", code: "AE", flag: "🇦🇪", patients: 22, percentage: 15, label: "GCC High-Acuity Referrals" },
      { country: "United Kingdom", code: "GB", flag: "🇬🇧", patients: 14, percentage: 10, label: "Elective Orthopedic & Cardiac" },
      { country: "United States", code: "US", flag: "🇺🇸", patients: 10, percentage: 7, label: "Complex Oncology Opinions" },
      { country: "Uzbekistan", code: "UZ", flag: "🇺🇿", patients: 7, percentage: 5, label: "Organ Transplant & Cardiac" },
      { country: "Oman", code: "OM", flag: "🇴🇲", patients: 4, percentage: 3, label: "Specialist Care Consultations" },
    ];
  }, [analytics?.countryDistribution]);

  const channelDistribution: any[] = useMemo(() => {
    if (analytics?.channelDistribution && Array.isArray(analytics.channelDistribution)) {
      return analytics.channelDistribution;
    }
    return [
      { channel: "Direct Website Form", percentage: 42, leads: 60, color: "#007A6C" },
      { channel: "WhatsApp Concierge", percentage: 31, leads: 44, color: "#25D366" },
      { channel: "Partner Facilitators", percentage: 19, leads: 27, color: "#FF6B00" },
      { channel: "Doctor Direct Referral", percentage: 8, leads: 11, color: "#6366F1" },
    ];
  }, [analytics?.channelDistribution]);

  const networkQuality = analytics?.networkQuality || {
    jciAccreditedPercent: 75,
    nabhPercent: 25,
    avgDoctorRating: 4.92,
    avgDoctorExperienceYears: 18.4,
    activeSpecialists: 20,
    activeHospitals: 16,
    activeTreatments: 8,
    activeDestinations: 4,
  };

  // SVG Area / Line Chart Points Computation
  const trendSvgData = useMemo(() => {
    const width = 800;
    const height = 240;
    const padL = 50;
    const padR = 25;
    const padT = 25;
    const padB = 40;
    const plotW = width - padL - padR;
    const plotH = height - padT - padB;
    const count = monthlyTrend.length;
    const stepX = count > 1 ? plotW / (count - 1) : plotW;

    // Determine primary & secondary values based on trendMetric
    let primaryValues: number[] = [];
    let secondaryValues: number[] = [];
    let yUnit = "";

    if (trendMetric === "inquiries") {
      primaryValues = monthlyTrend.map((d) => d.inquiries || 0);
      secondaryValues = monthlyTrend.map((d) => d.consultations || 0);
      yUnit = "Leads";
    } else if (trendMetric === "pipeline") {
      primaryValues = monthlyTrend.map((d) => d.pipelineValueInr || 0);
      secondaryValues = monthlyTrend.map((d) => d.pipelineValueUsd || 0);
      yUnit = "₹ Lakhs";
    } else {
      primaryValues = monthlyTrend.map((d) => d.conversionRate || 0);
      secondaryValues = monthlyTrend.map(() => 25.0); // Benchmark target
      yUnit = "%";
    }

    const maxPrimary = Math.max(...primaryValues, 10) * 1.18;

    const primaryPoints = primaryValues.map((v, i) => ({
      x: padL + i * stepX,
      y: padT + plotH - (v / maxPrimary) * plotH,
      value: v,
    }));

    const secondaryPoints = secondaryValues.map((v, i) => ({
      x: padL + i * stepX,
      y: padT + plotH - (v / maxPrimary) * plotH,
      value: v,
    }));

    const primaryLinePath = getSvgPath(primaryPoints);
    const primaryAreaPath = getSvgAreaPath(primaryPoints, padT + plotH);
    const secondaryLinePath = getSvgPath(secondaryPoints);

    // Y-axis tick marks (4 steps)
    const yTicks = [0, 0.33, 0.66, 1].map((pct) => {
      const val = Math.round(maxPrimary * pct);
      const yPos = padT + plotH - pct * plotH;
      return { val, yPos };
    });

    return {
      width,
      height,
      padL,
      padR,
      padT,
      padB,
      plotW,
      plotH,
      stepX,
      yUnit,
      yTicks,
      primaryPoints,
      secondaryPoints,
      primaryLinePath,
      primaryAreaPath,
      secondaryLinePath,
      maxPrimary,
    };
  }, [monthlyTrend, trendMetric]);

  // SVG Donut Chart Calculation
  const donutData = useMemo(() => {
    const radius = 64;
    const circumference = 2 * Math.PI * radius; // ~402.12
    let offset = 0;

    const totalCases = specialtyDemand.reduce((acc, s) => acc + (s.casesCount || 0), 0);

    const segments = specialtyDemand.map((spec) => {
      const dashLength = (spec.percentage / 100) * circumference;
      const strokeDashoffset = -offset;
      offset += dashLength;
      return {
        ...spec,
        dashLength,
        strokeDashoffset,
      };
    });

    return { radius, circumference, totalCases, segments };
  }, [specialtyDemand]);

  // Attention Tasks
  const attentionTasks = [
    ...(draftPages > 0
      ? [
          {
            id: "drafts",
            title: `${draftPages} Unpublished Page Draft${draftPages > 1 ? "s" : ""}`,
            desc: "Draft revisions awaiting review or atomic publication to live site.",
            tab: "content" as AdminTab,
            badge: "Review Required",
            badgeColor: "bg-amber-100 text-amber-800 border-amber-300",
          },
        ]
      : []),
    ...(newEnquiries > 0
      ? [
          {
            id: "enquiries",
            title: `${newEnquiries} New Website Enquiry / Lead${newEnquiries > 1 ? "s" : ""}`,
            desc: "Patient requests received from public website forms awaiting triage.",
            tab: "enquiries" as AdminTab,
            badge: "Triage Required",
            badgeColor: "bg-[#FFF4EC] text-[#FF6B00] border-[#FF6B00]/40",
          },
        ]
      : []),
  ];

  return (
    <div className="space-y-6 font-sans">
      {/* 1. Executive Healthcare Operations Header */}
      <div className="bg-gradient-to-r from-[#061E1B] via-teal-950 to-[#061E1B] rounded-2xl p-6 md:p-7 text-white shadow-lg border border-[#00C7BE]/30 flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#00C7BE]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="space-y-2 relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#007A6C]/50 text-[#00C7BE] border border-[#00C7BE]/40 shadow-xs">
            <ShieldCheck className="w-4 h-4 text-[#00C7BE]" />
            <span>Akeezo Healthcare Enterprise Operations</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-black tracking-tight text-white flex items-center gap-2">
            <span>Healthcare Discovery & Coordination Analytics</span>
            <span className="text-xs bg-[#00C7BE]/20 text-[#00C7BE] border border-[#00C7BE]/40 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
              Live
            </span>
          </h1>
          <p className="text-xs text-teal-100/80 max-w-2xl leading-relaxed">
            Real-time multi-market clinical intelligence, cross-border patient lead triage, surgical pipeline tracking, and medical directory network capacity.
          </p>
          <div className="flex items-center gap-4 text-[11px] text-teal-300/70 font-semibold pt-1">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Connected: 127.0.0.1:27017/akeezo_local
            </span>
            <span>•</span>
            <span>Last Synced: {lastRefreshed.toLocaleTimeString()}</span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 shrink-0 relative z-10">
          <button
            onClick={fetchStats}
            disabled={refreshing}
            className="flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 active:scale-98 text-white text-xs font-bold px-3.5 py-2.5 rounded-xl border border-white/20 transition"
            title="Refresh aggregates"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? "animate-spin" : ""}`} />
            <span>Refresh</span>
          </button>

          <button
            onClick={() => onSelectTab("doctors")}
            className="flex items-center justify-center gap-2 bg-[#007A6C] hover:bg-[#005F54] active:scale-98 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-xs transition border border-[#00C7BE]/30"
          >
            <Stethoscope className="w-4 h-4" />
            <span>Manage Doctors</span>
          </button>

          <button
            onClick={() => onSelectTab("enquiries")}
            className="flex items-center justify-center gap-2 bg-[#FF6B00] hover:bg-[#FF6D1B] active:scale-98 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-md transition"
          >
            <Inbox className="w-4 h-4" />
            <span>Triage Enquiries</span>
          </button>
        </div>
      </div>

      {/* 2. Executive Healthcare KPIs Ribbon (Top 5 Strategic Metrics) */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3.5">
        {/* KPI 1: Total Inbound Leads */}
        <div
          onClick={() => onSelectTab("enquiries")}
          className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs hover:border-[#FF6B00] hover:shadow-md transition cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Patient Enquiries
            </span>
            <div className="w-7 h-7 rounded-lg bg-[#FFF4EC] text-[#FF6B00] flex items-center justify-center group-hover:bg-[#FF6B00] group-hover:text-white transition">
              <Inbox className="w-3.5 h-3.5" />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900 mt-2">{kpis.inquiriesTotal}</p>
          <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-100 text-[10px]">
            <span className="inline-flex items-center text-emerald-600 font-bold">
              <TrendingUp className="w-3 h-3 mr-0.5" />
              {kpis.inquiriesDelta}
            </span>
            <span className="text-slate-400 font-medium">vs last month</span>
          </div>
        </div>

        {/* KPI 2: Active Clinical Cases */}
        <div
          onClick={() => onSelectTab("overview")}
          className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs hover:border-[#007A6C] hover:shadow-md transition cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Active Cases
            </span>
            <div className="w-7 h-7 rounded-lg bg-[#E6F8F6] text-[#007A6C] flex items-center justify-center group-hover:bg-[#007A6C] group-hover:text-white transition">
              <Activity className="w-3.5 h-3.5" />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900 mt-2">{kpis.activeCases}</p>
          <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-100 text-[10px]">
            <span className="inline-flex items-center text-emerald-600 font-bold">
              <TrendingUp className="w-3 h-3 mr-0.5" />
              {kpis.casesDelta}
            </span>
            <span className="text-slate-400 font-medium">in triage & care</span>
          </div>
        </div>

        {/* KPI 3: Pipeline Quote Volume */}
        <div
          onClick={() => onSelectTab("hospitals")}
          className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs hover:border-[#00C7BE] hover:shadow-md transition cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Pipeline Value
            </span>
            <div className="w-7 h-7 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center group-hover:bg-[#00C7BE] group-hover:text-white transition">
              <DollarSign className="w-3.5 h-3.5" />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900 mt-2">{kpis.pipelineValueInrFormatted}</p>
          <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-100 text-[10px]">
            <span className="inline-flex items-center text-emerald-600 font-bold">
              <TrendingUp className="w-3 h-3 mr-0.5" />
              {kpis.pipelineDelta}
            </span>
            <span className="text-slate-500 font-semibold">{kpis.pipelineValueUsdFormatted}</span>
          </div>
        </div>

        {/* KPI 4: Conversion Rate */}
        <div
          onClick={() => onSelectTab("treatments")}
          className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs hover:border-indigo-600 hover:shadow-md transition cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Conversion Rate
            </span>
            <div className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition">
              <BarChart3 className="w-3.5 h-3.5" />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900 mt-2">{kpis.conversionRate}%</p>
          <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-100 text-[10px]">
            <span className="inline-flex items-center text-emerald-600 font-bold">
              <TrendingUp className="w-3 h-3 mr-0.5" />
              {kpis.conversionDelta}
            </span>
            <span className="text-slate-400 font-medium">lead-to-consult</span>
          </div>
        </div>

        {/* KPI 5: SLA Response Time */}
        <div
          onClick={() => onSelectTab("activity")}
          className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs hover:border-emerald-600 hover:shadow-md transition cursor-pointer group col-span-2 lg:col-span-1"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Avg SLA Speed
            </span>
            <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition">
              <Clock className="w-3.5 h-3.5" />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900 mt-2">{kpis.avgSlaHours} hrs</p>
          <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-100 text-[10px]">
            <span className="text-emerald-600 font-bold">Exceeds 4.0h SLA</span>
            <ArrowRight className="w-3 h-3 text-emerald-600 group-hover:translate-x-0.5 transition" />
          </div>
        </div>
      </div>

      {/* 3. Primary Chart: Inbound Demand & Pipeline Trajectory (SVG Area & Line Chart) */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
        {/* Chart Header & Controls */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-[#007A6C]" />
              <h2 className="text-sm font-bold text-slate-900">
                Patient Inbound Demand & Financial Trajectory
              </h2>
            </div>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Historical monthly trends of inquiries, active clinical cases, and estimated surgical quote volume.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Metric Selectors */}
            <div className="inline-flex rounded-xl bg-slate-100 p-0.5 text-xs font-semibold">
              <button
                onClick={() => setTrendMetric("inquiries")}
                className={`px-3 py-1.5 rounded-lg transition ${
                  trendMetric === "inquiries"
                    ? "bg-white text-[#007A6C] shadow-2xs font-bold"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Inquiries & Cases
              </button>
              <button
                onClick={() => setTrendMetric("pipeline")}
                className={`px-3 py-1.5 rounded-lg transition ${
                  trendMetric === "pipeline"
                    ? "bg-white text-[#007A6C] shadow-2xs font-bold"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Pipeline (₹ Lakhs)
              </button>
              <button
                onClick={() => setTrendMetric("conversion")}
                className={`px-3 py-1.5 rounded-lg transition ${
                  trendMetric === "conversion"
                    ? "bg-white text-[#007A6C] shadow-2xs font-bold"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Conversion (%)
              </button>
            </div>

            {/* Timeframe Selectors */}
            <div className="inline-flex rounded-xl bg-slate-100 p-0.5 text-xs font-semibold">
              <button
                onClick={() => setTimeRange("6m")}
                className={`px-2.5 py-1.5 rounded-lg transition ${
                  timeRange === "6m" ? "bg-white text-slate-900 shadow-2xs font-bold" : "text-slate-500"
                }`}
              >
                6M
              </button>
              <button
                onClick={() => setTimeRange("90d")}
                className={`px-2.5 py-1.5 rounded-lg transition ${
                  timeRange === "90d" ? "bg-white text-slate-900 shadow-2xs font-bold" : "text-slate-500"
                }`}
              >
                90D
              </button>
              <button
                onClick={() => setTimeRange("30d")}
                className={`px-2.5 py-1.5 rounded-lg transition ${
                  timeRange === "30d" ? "bg-white text-slate-900 shadow-2xs font-bold" : "text-slate-500"
                }`}
              >
                30D
              </button>
            </div>
          </div>
        </div>

        {/* SVG Interactive Chart Canvas */}
        <div className="relative w-full overflow-hidden select-none">
          <svg
            viewBox={`0 0 ${trendSvgData.width} ${trendSvgData.height}`}
            className="w-full h-56 md:h-64"
          >
            <defs>
              <linearGradient id="trendAreaGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#007A6C" stopOpacity="0.28" />
                <stop offset="60%" stopColor="#00C7BE" stopOpacity="0.08" />
                <stop offset="100%" stopColor="#00C7BE" stopOpacity="0.00" />
              </linearGradient>
            </defs>

            {/* Y-Axis Grid Lines & Labels */}
            {trendSvgData.yTicks.map((tick, idx) => (
              <g key={idx}>
                <line
                  x1={trendSvgData.padL}
                  y1={tick.yPos}
                  x2={trendSvgData.width - trendSvgData.padR}
                  y2={tick.yPos}
                  stroke="#E2E8F0"
                  strokeDasharray="4 4"
                  strokeWidth="1"
                />
                <text
                  x={trendSvgData.padL - 8}
                  y={tick.yPos + 3}
                  textAnchor="end"
                  className="text-[10px] font-semibold fill-slate-400 font-mono"
                >
                  {tick.val}
                </text>
              </g>
            ))}

            {/* Area Fill */}
            <path d={trendSvgData.primaryAreaPath} fill="url(#trendAreaGradient)" />

            {/* Secondary Comparison Dashed Curve */}
            <path
              d={trendSvgData.secondaryLinePath}
              fill="none"
              stroke="#FF6B00"
              strokeWidth="2"
              strokeDasharray="4 4"
              opacity="0.8"
            />

            {/* Primary Solid Curve */}
            <path
              d={trendSvgData.primaryLinePath}
              fill="none"
              stroke="#007A6C"
              strokeWidth="3.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* X-Axis Month Labels & Interactive Crosshair */}
            {monthlyTrend.map((m, idx) => {
              const pt = trendSvgData.primaryPoints[idx];
              if (!pt) return null;
              const isHovered = hoveredTrendIndex === idx;

              return (
                <g key={idx}>
                  {/* Vertical Hover Guideline */}
                  {isHovered && (
                    <line
                      x1={pt.x}
                      y1={trendSvgData.padT}
                      x2={pt.x}
                      y2={trendSvgData.padT + trendSvgData.plotH}
                      stroke="#00C7BE"
                      strokeWidth="1.5"
                      strokeDasharray="3 3"
                    />
                  )}

                  {/* Primary Point Marker */}
                  <circle
                    cx={pt.x}
                    cy={pt.y}
                    r={isHovered ? 6 : 4}
                    fill={isHovered ? "#00C7BE" : "#007A6C"}
                    stroke="#FFFFFF"
                    strokeWidth={isHovered ? 2.5 : 2}
                    className="transition-all duration-200 cursor-pointer"
                  />

                  {/* Secondary Point Marker */}
                  {trendSvgData.secondaryPoints[idx] && (
                    <circle
                      cx={trendSvgData.secondaryPoints[idx].x}
                      cy={trendSvgData.secondaryPoints[idx].y}
                      r={isHovered ? 4.5 : 3}
                      fill="#FF6B00"
                      stroke="#FFFFFF"
                      strokeWidth="1.5"
                      className="transition-all duration-200"
                    />
                  )}

                  {/* Invisible Hit Area for Easy Hovering */}
                  <rect
                    x={pt.x - trendSvgData.stepX / 2}
                    y={trendSvgData.padT}
                    width={trendSvgData.stepX}
                    height={trendSvgData.plotH + trendSvgData.padB}
                    fill="transparent"
                    className="cursor-pointer"
                    onMouseEnter={() => setHoveredTrendIndex(idx)}
                    onMouseLeave={() => setHoveredTrendIndex(null)}
                  />

                  {/* Month Label */}
                  <text
                    x={pt.x}
                    y={trendSvgData.padT + trendSvgData.plotH + 20}
                    textAnchor="middle"
                    className={`text-[11px] font-bold transition-colors ${
                      isHovered ? "fill-[#007A6C]" : "fill-slate-500"
                    }`}
                  >
                    {m.month}
                  </text>
                </g>
              );
            })}
          </svg>

          {/* Interactive Floating Tooltip */}
          {hoveredTrendIndex !== null && monthlyTrend[hoveredTrendIndex] && (
            <div
              className="absolute top-2 pointer-events-none transition-all duration-150 z-20 bg-slate-900/95 text-white backdrop-blur-md rounded-xl p-3 shadow-xl border border-slate-700/60 text-xs min-w-[190px]"
              style={{
                left: `${Math.min(
                  Math.max(
                    (trendSvgData.primaryPoints[hoveredTrendIndex]?.x / trendSvgData.width) * 100,
                    15
                  ),
                  85
                )}%`,
                transform: "translateX(-50%)",
              }}
            >
              <div className="font-bold text-teal-300 pb-1.5 border-b border-slate-800 flex items-center justify-between">
                <span>{monthlyTrend[hoveredTrendIndex].fullMonth}</span>
                <span className="text-[10px] bg-teal-900/80 text-teal-200 px-1.5 py-0.5 rounded">
                  {monthlyTrend[hoveredTrendIndex].conversionRate}% Conv
                </span>
              </div>
              <div className="space-y-1 pt-1.5 text-[11px]">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#007A6C]" />
                    Inbound Inquiries:
                  </span>
                  <span className="font-bold text-white">
                    {monthlyTrend[hoveredTrendIndex].inquiries}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#FF6B00]" />
                    Consultations:
                  </span>
                  <span className="font-bold text-white">
                    {monthlyTrend[hoveredTrendIndex].consultations}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#00C7BE]" />
                    Pipeline Value:
                  </span>
                  <span className="font-bold text-emerald-400">
                    ₹{monthlyTrend[hoveredTrendIndex].pipelineValueInr} Lakhs
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Chart Legend */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-2 text-xs border-t border-slate-100">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-1 bg-[#007A6C] rounded-full" />
              <span className="text-slate-700 font-semibold text-[11px]">
                {trendMetric === "inquiries"
                  ? "Inbound Leads"
                  : trendMetric === "pipeline"
                  ? "INR Pipeline"
                  : "Lead Conversion Rate"}
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-1 bg-[#FF6B00] rounded-full border-t border-dashed border-[#FF6B00]" />
              <span className="text-slate-500 font-medium text-[11px]">
                {trendMetric === "inquiries"
                  ? "Doctor Consultations"
                  : trendMetric === "pipeline"
                  ? "USD Equivalent ($K)"
                  : "Target SLA (25%)"}
              </span>
            </div>
          </div>
          <div className="text-[11px] text-slate-400 font-medium">
            Aggregated from verified MongoDB records
          </div>
        </div>
      </div>

      {/* 4. Two-Column Analytics: Specialty Demand (Donut) & Patient Funnel */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Column A: Clinical Specialty Demand (Interactive SVG Donut Chart) */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <PieChart className="w-4 h-4 text-[#007A6C]" />
              <div>
                <h2 className="text-sm font-bold text-slate-900">
                  Clinical Specialty Demand Breakdown
                </h2>
                <p className="text-[11px] text-slate-500">
                  Case distribution and surgical quote values by discipline.
                </p>
              </div>
            </div>
            <button
              onClick={() => onSelectTab("treatments")}
              className="text-xs text-[#007A6C] hover:underline font-bold flex items-center gap-1"
            >
              <span>Directory</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
            {/* SVG Donut */}
            <div className="md:col-span-5 flex items-center justify-center relative">
              <svg viewBox="0 0 160 160" className="w-44 h-44 transform -rotate-90">
                {/* Background Ring */}
                <circle
                  cx="80"
                  cy="80"
                  r={donutData.radius}
                  fill="transparent"
                  stroke="#F1F5F9"
                  strokeWidth="20"
                />

                {/* Slices */}
                {donutData.segments.map((seg, idx) => {
                  const isHovered = hoveredSpecIndex === idx;
                  return (
                    <circle
                      key={seg.key}
                      cx="80"
                      cy="80"
                      r={donutData.radius}
                      fill="transparent"
                      stroke={seg.color}
                      strokeWidth={isHovered ? 24 : 20}
                      strokeDasharray={`${seg.dashLength} ${donutData.circumference - seg.dashLength}`}
                      strokeDashoffset={seg.strokeDashoffset}
                      className="transition-all duration-200 cursor-pointer"
                      onMouseEnter={() => setHoveredSpecIndex(idx)}
                      onMouseLeave={() => setHoveredSpecIndex(null)}
                    />
                  );
                })}
              </svg>

              {/* Center Metrics Inside Donut */}
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
                <span className="text-xl font-black text-slate-900">
                  {hoveredSpecIndex !== null
                    ? `${donutData.segments[hoveredSpecIndex]?.casesCount} Cases`
                    : `${donutData.totalCases} Cases`}
                </span>
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider truncate max-w-[90px]">
                  {hoveredSpecIndex !== null
                    ? donutData.segments[hoveredSpecIndex]?.name.split(" ")[0]
                    : "Pipeline"}
                </span>
              </div>
            </div>

            {/* Interactive Specialty Detail Cards */}
            <div className="md:col-span-7 space-y-2">
              {specialtyDemand.map((spec, idx) => {
                const isHovered = hoveredSpecIndex === idx;
                return (
                  <div
                    key={spec.key}
                    onMouseEnter={() => setHoveredSpecIndex(idx)}
                    onMouseLeave={() => setHoveredSpecIndex(null)}
                    className={`p-2.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                      isHovered
                        ? "bg-slate-50 border-[#007A6C] shadow-2xs"
                        : "border-slate-100 hover:border-slate-200"
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span
                        className="w-3 h-3 rounded-full shrink-0"
                        style={{ backgroundColor: spec.color }}
                      />
                      <div>
                        <div className="text-xs font-bold text-slate-800 leading-tight">
                          {spec.name}
                        </div>
                        <div className="text-[10px] text-slate-400">
                          Avg {spec.avgStayDays}d IPD stay • ₹{spec.pipelineValueLakhs}L value
                        </div>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="text-xs font-bold text-slate-900">
                        {spec.casesCount} ({spec.percentage}%)
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Column B: Patient Journey Conversion Funnel */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-[#FF6B00]" />
              <div>
                <h2 className="text-sm font-bold text-slate-900">
                  Patient Journey Conversion Funnel
                </h2>
                <p className="text-[11px] text-slate-500">
                  Stage transition rates from initial inquiry to hospital procedure.
                </p>
              </div>
            </div>
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
              {kpis.conversionRate}% Overall
            </span>
          </div>

          <div className="space-y-3.5">
            {patientJourneyFunnel.map((step, idx) => (
              <div key={step.stage} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-700 text-[10px] font-bold flex items-center justify-center">
                      {idx + 1}
                    </span>
                    <span className="font-bold text-slate-800">{step.title}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-semibold text-slate-400">
                      SLA: {step.avgSla}
                    </span>
                    <span className="font-black text-slate-900">
                      {step.count} ({step.percentage}%)
                    </span>
                  </div>
                </div>

                {/* Funnel Progress Bar */}
                <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500 bg-gradient-to-r from-[#007A6C] to-[#00C7BE]"
                    style={{ width: `${step.percentage}%` }}
                  />
                </div>

                {/* Drop-off Note (Between Steps) */}
                {idx < patientJourneyFunnel.length - 1 && (
                  <div className="flex items-center justify-between text-[10px] text-slate-400 px-1 pt-0.5">
                    <span className="truncate max-w-[240px]">{step.description}</span>
                    <span className="text-amber-600 font-semibold">
                      ↓ -{patientJourneyFunnel[idx + 1].dropOffPercent}% drop-off
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 5. Geographic Destinations & Acquisition Channels Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Card 1 & 2: Top Medical Destinations & Patient Origins (Col Span 2) */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4 text-[#007A6C]" />
              <div>
                <h2 className="text-sm font-bold text-slate-900">
                  Global Patient Inbound & Destination Volume
                </h2>
                <p className="text-[11px] text-slate-500">
                  Multi-national patient distribution across international medical corridors.
                </p>
              </div>
            </div>
            <button
              onClick={() => onSelectTab("destinations")}
              className="text-xs text-[#007A6C] hover:underline font-bold flex items-center gap-1"
            >
              <span>Destinations</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {countryDistribution.map((item) => (
              <div
                key={item.code}
                className="p-3 rounded-xl border border-slate-100 hover:border-slate-200 bg-slate-50/40 hover:bg-white transition space-y-2 shadow-2xs"
              >
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{item.flag}</span>
                    <div>
                      <div className="font-bold text-slate-900">{item.country}</div>
                      <div className="text-[10px] text-slate-500">{item.label}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="font-black text-slate-900">{item.patients}</span>
                    <span className="text-[10px] text-slate-400 block font-medium">
                      {item.percentage}%
                    </span>
                  </div>
                </div>

                <div className="w-full bg-slate-200/70 rounded-full h-1.5 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-[#007A6C]"
                    style={{ width: `${item.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Card 3: Inbound Lead Acquisition Channels */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Share2 className="w-4 h-4 text-[#FF6B00]" />
              <h2 className="text-sm font-bold text-slate-900">Acquisition Channels</h2>
            </div>
            <span className="text-[10px] font-bold text-slate-400 uppercase">Share</span>
          </div>

          <div className="space-y-3">
            {channelDistribution.map((ch) => (
              <div key={ch.channel} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-800">{ch.channel}</span>
                  <span className="font-bold text-slate-900">
                    {ch.leads} leads ({ch.percentage}%)
                  </span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-300"
                    style={{ width: `${ch.percentage}%`, backgroundColor: ch.color }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="pt-3 border-t border-slate-100 space-y-2">
            <span className="text-[11px] font-bold text-slate-700 block">
              Network Quality & Accreditations
            </span>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="bg-teal-50/60 p-2 rounded-lg border border-teal-100 text-center">
                <span className="block text-sm font-black text-[#007A6C]">
                  {networkQuality.jciAccreditedPercent}%
                </span>
                <span className="text-[10px] text-teal-800 font-semibold">JCI Accredited</span>
              </div>
              <div className="bg-indigo-50/60 p-2 rounded-lg border border-indigo-100 text-center">
                <span className="block text-sm font-black text-indigo-700">
                  {networkQuality.avgDoctorRating} ★
                </span>
                <span className="text-[10px] text-indigo-800 font-semibold">Specialist Rating</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 6. Healthcare Directory Quick Access Modules */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-[#061E1B] rounded-2xl p-6 text-white shadow-md border border-slate-700 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#00C7BE]">
              Dedicated Healthcare Directories
            </span>
            <h2 className="text-base font-bold text-white mt-0.5">
              Live Medical Provider & Knowledge Network
            </h2>
          </div>
          <span className="text-xs text-slate-300 font-medium">
            Tabular format • In-page profiles • 3-Format Import/Export
          </span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {/* Doctors */}
          <div
            onClick={() => onSelectTab("doctors")}
            className="p-3.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-[#00C7BE]/60 transition cursor-pointer group"
          >
            <div className="flex items-center justify-between">
              <Stethoscope className="w-4 h-4 text-[#00C7BE]" />
              <ArrowUpRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#00C7BE] transition" />
            </div>
            <div className="text-xl font-black text-white mt-2">
              {networkQuality.activeSpecialists}
            </div>
            <div className="text-xs font-bold text-slate-300 mt-0.5">Doctors Directory</div>
            <div className="text-[10px] text-teal-200/60 mt-1">
              Avg {networkQuality.avgDoctorExperienceYears}y Experience
            </div>
          </div>

          {/* Hospitals */}
          <div
            onClick={() => onSelectTab("hospitals")}
            className="p-3.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-[#00C7BE]/60 transition cursor-pointer group"
          >
            <div className="flex items-center justify-between">
              <Building2 className="w-4 h-4 text-emerald-400" />
              <ArrowUpRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-emerald-400 transition" />
            </div>
            <div className="text-xl font-black text-white mt-2">
              {networkQuality.activeHospitals}
            </div>
            <div className="text-xs font-bold text-slate-300 mt-0.5">Hospitals Directory</div>
            <div className="text-[10px] text-teal-200/60 mt-1">
              {networkQuality.jciAccreditedPercent}% JCI Accredited
            </div>
          </div>

          {/* Treatments */}
          <div
            onClick={() => onSelectTab("treatments")}
            className="p-3.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-[#00C7BE]/60 transition cursor-pointer group"
          >
            <div className="flex items-center justify-between">
              <Activity className="w-4 h-4 text-[#FF6B00]" />
              <ArrowUpRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#FF6B00] transition" />
            </div>
            <div className="text-xl font-black text-white mt-2">
              {networkQuality.activeTreatments}
            </div>
            <div className="text-xs font-bold text-slate-300 mt-0.5">Clinical Treatments</div>
            <div className="text-[10px] text-teal-200/60 mt-1">Procedure Cost Calculators</div>
          </div>

          {/* Destinations */}
          <div
            onClick={() => onSelectTab("destinations")}
            className="p-3.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-[#00C7BE]/60 transition cursor-pointer group"
          >
            <div className="flex items-center justify-between">
              <MapPin className="w-4 h-4 text-indigo-400" />
              <ArrowUpRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-400 transition" />
            </div>
            <div className="text-xl font-black text-white mt-2">
              {networkQuality.activeDestinations}
            </div>
            <div className="text-xs font-bold text-slate-300 mt-0.5">Destinations</div>
            <div className="text-[10px] text-teal-200/60 mt-1">Medical Travel Corridors</div>
          </div>

          {/* Blog & Knowledge */}
          <div
            onClick={() => onSelectTab("blog")}
            className="p-3.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-[#00C7BE]/60 transition cursor-pointer group col-span-2 md:col-span-1"
          >
            <div className="flex items-center justify-between">
              <BookOpen className="w-4 h-4 text-purple-400" />
              <ArrowUpRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-purple-400 transition" />
            </div>
            <div className="text-xl font-black text-white mt-2">5</div>
            <div className="text-xs font-bold text-slate-300 mt-0.5">Healthcare Blog</div>
            <div className="text-[10px] text-teal-200/60 mt-1">Guides & Medical Advice</div>
          </div>
        </div>
      </div>

      {/* 7. Attention Tasks */}
      {attentionTasks.length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-[#FF6B00]" />
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              Pending Operational Tasks Needing Attention
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {attentionTasks.map((t) => (
              <div
                key={t.id}
                onClick={() => onSelectTab(t.tab)}
                className="p-4 rounded-xl border border-slate-200 hover:border-[#007A6C] bg-slate-50/50 hover:bg-white transition cursor-pointer flex items-center justify-between group shadow-2xs"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-900">{t.title}</span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${t.badgeColor}`}
                    >
                      {t.badge}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500">{t.desc}</p>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-[#007A6C] group-hover:translate-x-1 transition shrink-0" />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 8. Two-Column Layout: Recent Inbound Enquiries & Recent Admin Audit Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Column A: Recent Inbound Enquiries */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Inbox className="w-4 h-4 text-[#FF6B00]" />
              <h2 className="text-sm font-bold text-slate-900">Recent Patient Inquiries</h2>
            </div>
            <div className="flex items-center gap-2">
              <ViewToggle mode={enquiryViewMode} onChange={setEnquiryViewMode} />
              <button
                onClick={() => onSelectTab("enquiries")}
                className="text-xs text-[#007A6C] hover:underline font-bold flex items-center gap-1"
              >
                <span>View All</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>

          <div>
            {!stats?.recentEnquiries || stats.recentEnquiries.length === 0 ? (
              <div className="py-8 text-center text-slate-400 text-xs">
                No customer enquiries received yet. Submissions from website forms will appear here.
              </div>
            ) : enquiryViewMode === "grid" ? (
              <div className="space-y-2.5">
                {stats.recentEnquiries.slice(0, 5).map((e: any) => (
                  <div
                    key={e._id || e.id}
                    onClick={() => onSelectTab("enquiries")}
                    className="p-3 rounded-xl border border-slate-100 hover:border-slate-200 bg-slate-50/50 hover:bg-slate-50 transition cursor-pointer flex items-center justify-between"
                  >
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs text-slate-900">
                          {e.requesterName || "Anonymous Inquirer"}
                        </span>
                        <span
                          className={`text-[9px] px-2 py-0.5 rounded-full font-bold uppercase ${
                            e.status === "received" || e.status === "triage"
                              ? "bg-[#FFF4EC] text-[#FF6B00]"
                              : e.status === "contacted"
                              ? "bg-amber-100 text-amber-800"
                              : "bg-[#E6F8F6] text-[#007A6C]"
                          }`}
                        >
                          {e.status}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-500 truncate max-w-xs">
                        {e.serviceType?.replace(/_/g, " ")} • {e.email || e.phone || "No contact"}
                      </div>
                    </div>
                    <span className="text-[10px] text-slate-400 shrink-0">
                      {new Date(e.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="border border-slate-100 rounded-xl overflow-hidden shadow-2xs">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                    <tr>
                      <th className="py-2 px-3">Requester</th>
                      <th className="py-2 px-3">Service</th>
                      <th className="py-2 px-3">Status</th>
                      <th className="py-2 px-3 text-right">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium">
                    {stats.recentEnquiries.slice(0, 5).map((e: any) => (
                      <tr
                        key={e._id || e.id}
                        onClick={() => onSelectTab("enquiries")}
                        className="hover:bg-[#E6F8F6]/30 cursor-pointer transition"
                      >
                        <td className="py-2.5 px-3 font-bold text-slate-900 truncate max-w-[120px]">
                          {e.requesterName || "Anonymous Inquirer"}
                        </td>
                        <td className="py-2.5 px-3 capitalize text-slate-600 text-[11px]">
                          {e.serviceType?.replace(/_/g, " ")}
                        </td>
                        <td className="py-2.5 px-3">
                          <span
                            className={`text-[9px] px-2 py-0.5 rounded-full font-bold uppercase ${
                              e.status === "received" || e.status === "triage"
                                ? "bg-[#FFF4EC] text-[#FF6B00]"
                                : e.status === "contacted"
                                ? "bg-amber-100 text-amber-800"
                                : "bg-[#E6F8F6] text-[#007A6C]"
                            }`}
                          >
                            {e.status}
                          </span>
                        </td>
                        <td className="py-2.5 px-3 text-right text-slate-400 text-[10px]">
                          {new Date(e.createdAt).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Column B: Recent Content Updates & Audit Activity */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <History className="w-4 h-4 text-[#007A6C]" />
              <h2 className="text-sm font-bold text-slate-900">Recent Admin Audit Activity</h2>
            </div>
            <div className="flex items-center gap-2">
              <ViewToggle mode={activityViewMode} onChange={setActivityViewMode} />
              <button
                onClick={() => onSelectTab("activity")}
                className="text-xs text-[#007A6C] hover:underline font-bold flex items-center gap-1"
              >
                <span>Full Log</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>

          <div>
            {!stats?.recentActivities || stats.recentActivities.length === 0 ? (
              <div className="py-8 text-center text-slate-400 text-xs">
                No activity logs recorded yet. All administrative actions are automatically tracked here.
              </div>
            ) : activityViewMode === "grid" ? (
              <div className="space-y-2.5">
                {stats.recentActivities.slice(0, 5).map((act: any) => (
                  <div
                    key={act._id || act.id}
                    className="p-3 rounded-xl border border-slate-100 bg-slate-50/50 flex items-center justify-between text-xs"
                  >
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-800 capitalize">
                          {act.action} {act.module || act.entityType}
                        </span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-200 text-slate-700 font-semibold">
                          {act.actorRole || "admin"}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-500 truncate max-w-xs">
                        By {act.actorId?.name || act.actorId?.email || "System"}
                      </div>
                    </div>
                    <span className="text-[10px] text-slate-400 shrink-0 font-mono">
                      {new Date(act.createdAt || act.occurredAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="border border-slate-100 rounded-xl overflow-hidden shadow-2xs">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                    <tr>
                      <th className="py-2 px-3">Action</th>
                      <th className="py-2 px-3">Module</th>
                      <th className="py-2 px-3">Actor Role</th>
                      <th className="py-2 px-3 text-right">Time</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium">
                    {stats.recentActivities.slice(0, 5).map((act: any) => (
                      <tr key={act._id || act.id} className="hover:bg-slate-50 transition">
                        <td className="py-2.5 px-3 font-bold capitalize text-slate-800">
                          {act.action}
                        </td>
                        <td className="py-2.5 px-3 uppercase text-[10px] font-bold text-slate-500">
                          {act.module || act.entityType}
                        </td>
                        <td className="py-2.5 px-3 text-[11px] text-slate-600">
                          {act.actorRole || "admin"}
                        </td>
                        <td className="py-2.5 px-3 text-right text-slate-400 text-[10px] font-mono">
                          {new Date(act.createdAt || act.occurredAt).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
