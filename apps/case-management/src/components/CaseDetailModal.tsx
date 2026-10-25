import React, { useState, useEffect } from "react";
import {
  X,
  CheckCircle2,
  AlertCircle,
  FileText,
  DollarSign,
  Activity,
  Calendar,
  MessageSquare,
  ShieldCheck,
  Send,
  Plus,
  Play,
  Check,
  Award,
} from "lucide-react";
import { CASE_STAGES, CaseStage } from "@akeezo/contracts";
import { STAGE_CONFIG } from "./PipelineBoard.js";

interface CaseDetailModalProps {
  caseId: string;
  onClose: () => void;
  onRefresh: () => void;
}

export const CaseDetailModal: React.FC<CaseDetailModalProps> = ({
  caseId,
  onClose,
  onRefresh,
}) => {
  const [caseData, setCaseData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<
    "overview" | "quotes" | "treatment" | "money" | "activity"
  >("overview");

  // Stage Guard evaluation state
  const [readiness, setReadiness] = useState<any>(null);
  const [targetStage, setTargetStage] = useState<CaseStage | "">("");
  const [guardLoading, setGuardLoading] = useState(false);
  const [stageError, setStageError] = useState<string | null>(null);

  // Billing modal state
  const [billingEpisodeId, setBillingEpisodeId] = useState<string | null>(null);
  const [billedAmount, setBilledAmount] = useState<string>("");

  // Series modal state
  const [showSeriesModal, setShowSeriesModal] = useState(false);
  const [seriesCycles, setSeriesCycles] = useState(6);

  useEffect(() => {
    fetchCase();
  }, [caseId]);

  const fetchCase = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/v1/cases/${caseId}`);
      const json = await res.json();
      if (json.data) {
        setCaseData(json.data);
      }
    } catch (err) {
      console.error("Failed to load case", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCheckReadiness = async (toStage: CaseStage) => {
    try {
      setTargetStage(toStage);
      setGuardLoading(true);
      setStageError(null);
      const res = await fetch(`/api/v1/cases/${caseId}/readiness?toStage=${toStage}`);
      const json = await res.json();
      setReadiness(json.data);
    } catch (err: any) {
      setStageError(err.message);
    } finally {
      setGuardLoading(false);
    }
  };

  const handleConfirmStageMove = async () => {
    if (!targetStage) return;
    try {
      setStageError(null);
      const res = await fetch(`/api/v1/cases/${caseId}/stage-transitions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ toStage: targetStage }),
      });
      const json = await res.json();
      if (res.ok) {
        setReadiness(null);
        setTargetStage("");
        fetchCase();
        onRefresh();
      } else {
        setStageError(json.error?.message || "Stage transition blocked by guard criteria.");
      }
    } catch (err: any) {
      setStageError(err.message);
    }
  };

  const handleActivateEpisode = async (episodeId: string) => {
    try {
      setStageError(null);
      const res = await fetch(`/api/v1/episodes/${episodeId}/activate`, {
        method: "POST",
      });
      const json = await res.json();
      if (res.ok) {
        fetchCase();
        onRefresh();
      } else {
        alert(json.error?.message || "Failed to activate episode");
      }
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleCompleteEpisode = async (episodeId: string) => {
    try {
      const res = await fetch(`/api/v1/episodes/${episodeId}/complete`, {
        method: "POST",
      });
      if (res.ok) {
        fetchCase();
        onRefresh();
      }
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleFinaliseBilling = async () => {
    if (!billingEpisodeId || !billedAmount) return;
    try {
      const amountPaise = Math.round(parseFloat(billedAmount) * 100);
      const res = await fetch(`/api/v1/episodes/${billingEpisodeId}/billing`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          billedAmountMinor: amountPaise,
          billedCurrency: "INR",
          invoiceRef: `INV-${Date.now().toString().slice(-6)}`,
        }),
      });
      if (res.ok) {
        setBillingEpisodeId(null);
        setBilledAmount("");
        fetchCase();
        onRefresh();
      }
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleCreateSeries = async () => {
    if (!caseData) return;
    try {
      const res = await fetch(`/api/v1/cases/${caseId}/episode-series`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          label: "FOLFOX Chemotherapy Protocol",
          plannedTotal: seriesCycles,
          defaultHospitalId: caseData.quotes?.[0]?.hospitalId?._id || "67b938000000000000000001",
          firstCycleDate: new Date().toISOString(),
          intervalDays: 21,
          expectedAmountPerCycleMinor: 12500000,
        }),
      });
      if (res.ok) {
        setShowSeriesModal(false);
        fetchCase();
        onRefresh();
      }
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleSelectQuote = async (quoteId: string) => {
    try {
      const res = await fetch(`/api/v1/quotes/${quoteId}/select`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ selectedVia: "whatsapp" }),
      });
      if (res.ok) {
        fetchCase();
        onRefresh();
      }
    } catch (err: any) {
      alert(err.message);
    }
  };

  if (loading || !caseData) {
    return (
      <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
        <div className="bg-white p-6 rounded-xl shadow-xl text-center text-sm font-medium text-slate-600">
          Loading case record...
        </div>
      </div>
    );
  }

  const currentStageIndex = CASE_STAGES.indexOf(caseData.stage);
  const nextStage = CASE_STAGES[currentStageIndex + 1] as CaseStage | undefined;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl h-[88vh] flex flex-col overflow-hidden border border-slate-200">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono font-bold text-sm text-teal-300">
                  {caseData.caseCode}
                </span>
                <span className="text-[10px] bg-teal-800 text-teal-100 px-2 py-0.5 rounded font-bold uppercase tracking-wider">
                  {STAGE_CONFIG[caseData.stage as CaseStage]?.label || caseData.stage}
                </span>
                <span
                  className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase ${
                    caseData.urgency === "critical"
                      ? "bg-red-500 text-white"
                      : "bg-orange-500 text-white"
                  }`}
                >
                  {caseData.urgency}
                </span>
              </div>
              <h2 className="text-lg font-black tracking-tight text-white mt-0.5">
                {caseData.patientId?.fullName} ({caseData.patientId?.nationality || "Intl"})
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {nextStage && (
              <button
                onClick={() => handleCheckReadiness(nextStage)}
                className="bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white text-xs font-bold px-3.5 py-2 rounded-lg flex items-center gap-1.5 shadow-sm transition"
              >
                <span>Advance to {STAGE_CONFIG[nextStage]?.label}</span>
                <CheckCircle2 className="w-4 h-4" />
              </button>
            )}

            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Stage Progress Bar */}
        <div className="bg-slate-100 px-6 py-2 border-b border-slate-200 overflow-x-auto shrink-0 flex items-center gap-2 text-[11px] font-semibold text-slate-600">
          {CASE_STAGES.filter((s) => s !== "closed").map((stage, idx) => {
            const isCompleted = idx < currentStageIndex;
            const isCurrent = idx === currentStageIndex;

            return (
              <div key={stage} className="flex items-center gap-1.5 shrink-0">
                <div
                  className={`px-2 py-1 rounded flex items-center gap-1 ${
                    isCurrent
                      ? "bg-teal-700 text-white shadow-xs"
                      : isCompleted
                      ? "bg-slate-200 text-slate-700"
                      : "text-slate-400"
                  }`}
                >
                  {isCompleted ? (
                    <Check className="w-3 h-3 text-emerald-600 font-bold" />
                  ) : (
                    <span>{idx + 1}.</span>
                  )}
                  <span>{STAGE_CONFIG[stage]?.label}</span>
                </div>
                {idx < CASE_STAGES.length - 2 && (
                  <span className="text-slate-300">→</span>
                )}
              </div>
            );
          })}
        </div>

        {/* Readiness Checklist Modal Overlay (if checking stage move) */}
        {readiness && (
          <div className="bg-amber-50 border-b border-amber-200 p-4 shrink-0 transition-all">
            <div className="flex items-center justify-between pb-2">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-amber-700" />
                <h4 className="text-xs font-bold text-amber-900">
                  Exit Criteria Checklist for "{STAGE_CONFIG[targetStage as CaseStage]?.label}"
                </h4>
              </div>
              <button
                onClick={() => setReadiness(null)}
                className="text-xs text-slate-500 hover:text-slate-800"
              >
                Dismiss
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs py-2">
              {readiness.guards.map((g: any, i: number) => (
                <div
                  key={i}
                  className={`p-2 rounded border flex items-start gap-2 ${
                    g.passed
                      ? "bg-emerald-50 border-emerald-200 text-emerald-900"
                      : "bg-red-50 border-red-200 text-red-900"
                  }`}
                >
                  {g.passed ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                  )}
                  <div>
                    <div className="font-semibold">{g.guard}</div>
                    <div className="text-[11px] opacity-90">{g.message}</div>
                  </div>
                </div>
              ))}
            </div>

            {stageError && (
              <div className="text-xs text-red-700 font-semibold py-1">
                {stageError}
              </div>
            )}

            <div className="pt-2 flex justify-end gap-2">
              <button
                onClick={() => setReadiness(null)}
                className="text-xs px-3 py-1.5 border border-slate-300 rounded-lg text-slate-700 bg-white"
              >
                Cancel
              </button>
              <button
                disabled={!readiness.isReady}
                onClick={handleConfirmStageMove}
                className={`text-xs px-4 py-1.5 rounded-lg font-bold text-white transition ${
                  readiness.isReady
                    ? "bg-teal-700 hover:bg-teal-800 shadow-sm"
                    : "bg-slate-300 cursor-not-allowed"
                }`}
              >
                Confirm Move to {STAGE_CONFIG[targetStage as CaseStage]?.label}
              </button>
            </div>
          </div>
        )}

        {/* Tab Navigation */}
        <div className="px-6 border-b border-slate-200 flex gap-6 text-xs font-bold text-slate-600 shrink-0">
          {[
            { id: "overview", label: "Overview", icon: FileText },
            { id: "quotes", label: "Quotes RFQ", icon: Award, count: caseData.quotes?.length },
            { id: "treatment", label: "Treatment Episodes", icon: Activity, count: caseData.episodes?.length },
            { id: "money", label: "Commission & Money", icon: DollarSign },
            { id: "activity", label: "Activity Log", icon: MessageSquare, count: caseData.notes?.length },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-3 flex items-center gap-2 border-b-2 transition ${
                  isActive
                    ? "border-teal-700 text-teal-800 font-black"
                    : "border-transparent text-slate-500 hover:text-slate-800"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
                {tab.count !== undefined && (
                  <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.2 rounded font-bold">
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Tab Body */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* TAB 1: OVERVIEW */}
          {activeTab === "overview" && (
            <div className="grid grid-cols-3 gap-6">
              <div className="col-span-2 space-y-6">
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                  <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider pb-2">
                    Medical Condition & Need
                  </h3>
                  <div className="text-sm font-semibold text-slate-900 pb-1">
                    Specialty: <span className="text-teal-800">{caseData.specialty}</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {caseData.diagnosisSummary}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-white border border-slate-200 rounded-lg">
                    <span className="text-[10px] text-slate-400 font-bold uppercase block">
                      Preferred City / Location
                    </span>
                    <span className="text-xs font-semibold text-slate-800">
                      {caseData.preferredCity || "Any NCR / Metro"}
                    </span>
                  </div>
                  <div className="p-3 bg-white border border-slate-200 rounded-lg">
                    <span className="text-[10px] text-slate-400 font-bold uppercase block">
                      Estimated Budget Range
                    </span>
                    <span className="text-xs font-semibold text-slate-800">
                      {caseData.budgetMinMinor
                        ? `₹${(caseData.budgetMinMinor / 100000).toLocaleString("en-IN")} L – ₹${(
                            (caseData.budgetMaxMinor || caseData.budgetMinMinor) /
                            100000
                          ).toLocaleString("en-IN")} L`
                        : "Not specified"}
                    </span>
                  </div>
                </div>

                <div className="p-3 bg-white border border-slate-200 rounded-lg flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold uppercase block">
                      Facilitation Fee Disclosure Status
                    </span>
                    <span className="text-xs font-semibold text-slate-800">
                      {caseData.feeDisclosedToPartner
                        ? "Disclosed to Partner / Family"
                        : "Pending Disclosure"}
                    </span>
                  </div>
                  <ShieldCheck
                    className={`w-5 h-5 ${
                      caseData.feeDisclosedToPartner ? "text-teal-600" : "text-slate-300"
                    }`}
                  />
                </div>
              </div>

              {/* Patient & Partner Side Box */}
              <div className="space-y-4">
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
                  <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Patient Profile
                  </h3>
                  <div className="text-xs space-y-1">
                    <div>
                      <span className="text-slate-400">DOB:</span>{" "}
                      <span className="font-semibold text-slate-800">
                        {caseData.patientId?.dateOfBirth || "N/A"}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400">Gender:</span>{" "}
                      <span className="font-semibold text-slate-800 capitalize">
                        {caseData.patientId?.sex || "N/A"}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400">Passport:</span>{" "}
                      <span className="font-mono font-bold text-teal-800">
                        {caseData.patientId?.passportNumberMasked || "Masked (Restricted)"}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400">Phone:</span>{" "}
                      <span className="font-semibold text-slate-800">
                        {caseData.patientId?.phone || "N/A"}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
                  <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Referring Partner
                  </h3>
                  <div className="text-xs space-y-1">
                    <div className="font-bold text-slate-900">
                      {caseData.partnerId?.name || "Direct Family"}
                    </div>
                    <div className="text-slate-500 text-[11px]">
                      Code: {caseData.partnerId?.partnerCode || "DIRECT"}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: QUOTES */}
          {activeTab === "quotes" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-2">
                <div>
                  <h3 className="text-sm font-bold text-slate-800">
                    Hospital Quotations & Side-by-Side Comparison
                  </h3>
                  <p className="text-xs text-slate-500">
                    Quotes requested across network hospitals with lowest package pricing highlighted.
                  </p>
                </div>
              </div>

              {caseData.quotes?.length === 0 ? (
                <div className="text-center py-12 border-2 border-dashed border-slate-200 rounded-xl text-slate-400 text-xs">
                  No quotes logged yet. Create an RFQ to send to hospitals.
                </div>
              ) : (
                <div className="grid grid-cols-3 gap-4">
                  {caseData.quotes.map((q: any) => {
                    const minLakh = (q.amountMinMinor / 100000).toLocaleString("en-IN");
                    const maxLakh = (q.amountMaxMinor / 100000).toLocaleString("en-IN");

                    return (
                      <div
                        key={q._id}
                        className={`p-4 rounded-xl border transition-all ${
                          q.isSelected
                            ? "bg-teal-50/60 border-teal-500 ring-2 ring-teal-500/20"
                            : "bg-white border-slate-200 shadow-xs"
                        }`}
                      >
                        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                          <div>
                            <h4 className="font-bold text-xs text-slate-900">
                              {q.hospitalId?.name || "Hospital"}
                            </h4>
                            <span className="text-[10px] text-slate-400">
                              {q.hospitalId?.city || "Delhi NCR"}
                            </span>
                          </div>
                          {q.isSelected ? (
                            <span className="text-[10px] bg-teal-600 text-white font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                              <Check className="w-3 h-3" /> Selected
                            </span>
                          ) : (
                            <button
                              onClick={() => handleSelectQuote(q._id)}
                              className="text-[11px] text-teal-700 hover:text-teal-900 font-bold border border-teal-600 hover:bg-teal-50 px-2 py-1 rounded transition"
                            >
                              Select Quote
                            </button>
                          )}
                        </div>

                        <div className="py-3">
                          <span className="text-[10px] text-slate-400 uppercase font-bold block">
                            Estimate Package
                          </span>
                          <span className="text-lg font-black text-slate-900 tracking-tight">
                            ₹{minLakh} L – ₹{maxLakh} L
                          </span>
                        </div>

                        <div className="text-[11px] space-y-1.5 text-slate-600 border-t border-slate-100 pt-2">
                          <div>
                            <span className="font-bold text-slate-700">Inclusions:</span>{" "}
                            {q.inclusions || "Standard package"}
                          </div>
                          <div>
                            <span className="font-bold text-slate-700">Exclusions:</span>{" "}
                            {q.exclusions || "Unplanned ICU, implants"}
                          </div>
                          <div className="text-slate-400 text-[10px] pt-1">
                            Stay: {q.estimatedStayDays || 14} days · Valid until{" "}
                            {new Date(q.validityUntil).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: TREATMENT EPISODES */}
          {activeTab === "treatment" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-800">
                    Treatment Episodes & Multi-Hospital Mapping
                  </h3>
                  <p className="text-xs text-slate-500">
                    Rule EP-3: At any moment only ONE episode can be in Active state.
                  </p>
                </div>
                <button
                  onClick={() => setShowSeriesModal(true)}
                  className="bg-teal-700 hover:bg-teal-800 text-white text-xs font-semibold px-3 py-1.5 rounded-lg flex items-center gap-1 transition"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Create Chemo / Cycle Series</span>
                </button>
              </div>

              {caseData.episodes?.length === 0 ? (
                <div className="text-center py-12 border-2 border-dashed border-slate-200 rounded-xl text-slate-400 text-xs">
                  No treatment episodes scheduled yet.
                </div>
              ) : (
                <div className="space-y-3">
                  {caseData.episodes.map((ep: any) => {
                    const isActive = ep.status === "active";
                    const isCompleted = ep.status === "completed";

                    return (
                      <div
                        key={ep._id}
                        className={`p-4 rounded-xl border flex items-center justify-between transition-all ${
                          isActive
                            ? "bg-emerald-50 border-emerald-300 ring-2 ring-emerald-400/20"
                            : isCompleted
                            ? "bg-slate-50 border-slate-200"
                            : "bg-white border-slate-200 shadow-xs"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs ${
                              isActive
                                ? "bg-emerald-600 text-white"
                                : isCompleted
                                ? "bg-slate-300 text-slate-700"
                                : "bg-slate-100 text-slate-500"
                            }`}
                          >
                            {ep.cycleNo || ep.sequenceNo}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-xs text-slate-900">
                                {ep.treatmentName}
                              </span>
                              <span
                                className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase ${
                                  isActive
                                    ? "bg-emerald-600 text-white"
                                    : isCompleted
                                    ? "bg-slate-200 text-slate-700"
                                    : "bg-slate-100 text-slate-600"
                                }`}
                              >
                                {ep.status}
                              </span>
                            </div>
                            <div className="text-[11px] text-slate-500">
                              Hospital: {ep.hospitalId?.name || "Hospital"} · Type: {ep.episodeType}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          {ep.billedAmountMinor ? (
                            <div className="text-right">
                              <span className="text-[10px] text-slate-400 uppercase font-bold block">
                                Billed Amount
                              </span>
                              <span className="text-xs font-black text-slate-800">
                                ₹{(ep.billedAmountMinor / 100).toLocaleString("en-IN")}
                              </span>
                            </div>
                          ) : isCompleted ? (
                            <button
                              onClick={() => {
                                setBillingEpisodeId(ep._id);
                                setBilledAmount("1000000"); // Suggested 10 Lakhs
                              }}
                              className="text-xs bg-orange-600 hover:bg-orange-700 text-white font-bold px-3 py-1.5 rounded-lg transition"
                            >
                              Finalise Billing
                            </button>
                          ) : null}

                          {ep.status === "planned" && (
                            <button
                              onClick={() => handleActivateEpisode(ep._id)}
                              className="text-xs bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-3 py-1.5 rounded-lg flex items-center gap-1 transition"
                            >
                              <Play className="w-3 h-3" />
                              <span>Activate</span>
                            </button>
                          )}

                          {isActive && (
                            <button
                              onClick={() => handleCompleteEpisode(ep._id)}
                              className="text-xs bg-slate-800 hover:bg-slate-900 text-white font-bold px-3 py-1.5 rounded-lg flex items-center gap-1 transition"
                            >
                              <Check className="w-3 h-3" />
                              <span>Mark Complete</span>
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* TAB 4: COMMISSION & MONEY */}
          {activeTab === "money" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-2">
                <div>
                  <h3 className="text-sm font-bold text-slate-800">
                    Commission Records & Settlement (Per Episode)
                  </h3>
                  <p className="text-xs text-slate-500">
                    Rule CM-2: Commission calculated using hospital agreement and partner share formula.
                  </p>
                </div>
              </div>

              {caseData.commissionRecords?.length === 0 ? (
                <div className="text-center py-12 border-2 border-dashed border-slate-200 rounded-xl text-slate-400 text-xs">
                  No commission records generated yet. Finalise an episode's billing to generate commission.
                </div>
              ) : (
                <div className="space-y-4">
                  {caseData.commissionRecords.map((cr: any) => (
                    <div
                      key={cr._id}
                      className="p-5 rounded-xl border border-slate-200 bg-white shadow-xs space-y-4"
                    >
                      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                        <div>
                          <span className="text-[10px] text-slate-400 uppercase font-bold block">
                            Commission Status
                          </span>
                          <span className="text-xs font-bold uppercase tracking-wider text-teal-800 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                            {cr.status}
                          </span>
                        </div>
                        <div className="text-right">
                          <span className="text-[10px] text-slate-400 uppercase font-bold block">
                            Episode Billed Amount
                          </span>
                          <span className="text-base font-black text-slate-900">
                            ₹{(cr.billedAmountMinor / 100).toLocaleString("en-IN")}
                          </span>
                        </div>
                      </div>

                      {/* 3 Metrics: Akeezo Commission, Partner Share, Akeezo Net */}
                      <div className="grid grid-cols-3 gap-4 p-3 bg-slate-50 rounded-lg text-center">
                        <div>
                          <span className="text-[10px] text-slate-400 font-bold uppercase block">
                            Akeezo Gross ({cr.hospitalRateSnapshot?.value || 15}%)
                          </span>
                          <span className="text-sm font-black text-slate-800">
                            ₹{(cr.akeezoCommissionMinor / 100).toLocaleString("en-IN")}
                          </span>
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-400 font-bold uppercase block">
                            Partner Share ({cr.partnerShareSnapshot?.value || 40}%)
                          </span>
                          <span className="text-sm font-black text-teal-700">
                            ₹{(cr.partnerShareMinor / 100).toLocaleString("en-IN")}
                          </span>
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-400 font-bold uppercase block">
                            Akeezo Net Margin
                          </span>
                          <span className="text-sm font-black text-slate-900">
                            ₹{(cr.akeezoNetMinor / 100).toLocaleString("en-IN")}
                          </span>
                        </div>
                      </div>

                      {/* Payment tracking: Hospital received vs Partner Paid */}
                      <div className="grid grid-cols-2 gap-4 text-xs">
                        <div className="p-3 bg-white border border-slate-200 rounded-lg">
                          <span className="text-[10px] text-slate-400 font-bold uppercase block">
                            Received from Hospital
                          </span>
                          <span className="font-bold text-slate-800 text-sm">
                            ₹{(cr.hospitalReceivedMinor / 100).toLocaleString("en-IN")}
                          </span>
                        </div>
                        <div className="p-3 bg-white border border-slate-200 rounded-lg">
                          <span className="text-[10px] text-slate-400 font-bold uppercase block">
                            Paid to Partner so far
                          </span>
                          <span className="font-bold text-slate-800 text-sm">
                            ₹{(cr.partnerPaidMinor / 100).toLocaleString("en-IN")}
                          </span>
                        </div>
                      </div>

                      {/* Recovery due alert if negative */}
                      {cr.recoveryDueMinor > 0 && (
                        <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-center justify-between text-xs text-red-900">
                          <div className="flex items-center gap-2">
                            <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                            <span>
                              <strong>Recovery Due:</strong> Partner was overpaid by ₹
                              {(cr.recoveryDueMinor / 100).toLocaleString("en-IN")} due to bill revision.
                            </span>
                          </div>
                          <span className="text-[10px] font-bold bg-red-600 text-white px-2 py-0.5 rounded">
                            Action for Finance
                          </span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 5: ACTIVITY LOG */}
          {activeTab === "activity" && (
            <div className="space-y-4">
              <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider pb-2">
                Timeline & Communication Log
              </h3>
              {caseData.notes?.length === 0 ? (
                <div className="text-center py-8 text-xs text-slate-400">
                  No activity notes logged yet.
                </div>
              ) : (
                <div className="space-y-2">
                  {caseData.notes.map((n: any) => (
                    <div
                      key={n._id}
                      className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs flex items-start gap-3"
                    >
                      <MessageSquare className="w-4 h-4 text-teal-700 shrink-0 mt-0.5" />
                      <div>
                        <div className="font-bold text-slate-800">
                          {n.authorId?.name || "Staff"} ·{" "}
                          <span className="text-slate-400 font-normal">
                            {new Date(n.occurredAt).toLocaleString()}
                          </span>
                        </div>
                        <p className="text-slate-600 mt-0.5">{n.summary}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Billing Finalisation Modal Dialog */}
        {billingEpisodeId && (
          <div className="fixed inset-0 z-60 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white p-6 rounded-xl shadow-xl w-full max-w-sm border border-slate-200 space-y-4">
              <h3 className="text-sm font-bold text-slate-800">
                Finalise Episode Billing (INR)
              </h3>
              <div>
                <label className="text-xs text-slate-500 font-semibold block mb-1">
                  Billed Amount (INR)
                </label>
                <input
                  type="number"
                  value={billedAmount}
                  onChange={(e) => setBilledAmount(e.target.value)}
                  className="w-full text-sm font-bold p-2.5 border rounded-lg focus:outline-teal-600"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  onClick={() => setBillingEpisodeId(null)}
                  className="text-xs px-3 py-2 border rounded-lg text-slate-600"
                >
                  Cancel
                </button>
                <button
                  onClick={handleFinaliseBilling}
                  className="text-xs px-4 py-2 bg-teal-700 hover:bg-teal-800 font-bold text-white rounded-lg"
                >
                  Confirm & Calculate Commission
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Series Modal Dialog */}
        {showSeriesModal && (
          <div className="fixed inset-0 z-60 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white p-6 rounded-xl shadow-xl w-full max-w-sm border border-slate-200 space-y-4">
              <h3 className="text-sm font-bold text-slate-800">
                Create Chemo / Cycle Series
              </h3>
              <div>
                <label className="text-xs text-slate-500 font-semibold block mb-1">
                  Number of Planned Cycles
                </label>
                <input
                  type="number"
                  min="2"
                  max="20"
                  value={seriesCycles}
                  onChange={(e) => setSeriesCycles(parseInt(e.target.value, 10))}
                  className="w-full text-sm font-bold p-2.5 border rounded-lg focus:outline-teal-600"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  onClick={() => setShowSeriesModal(false)}
                  className="text-xs px-3 py-2 border rounded-lg text-slate-600"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateSeries}
                  className="text-xs px-4 py-2 bg-teal-700 hover:bg-teal-800 font-bold text-white rounded-lg"
                >
                  Generate {seriesCycles} Cycles
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
