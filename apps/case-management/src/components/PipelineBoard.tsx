import React from "react";
import { Clock, AlertTriangle, UserCheck, Hospital, ArrowRight } from "lucide-react";
import { CASE_STAGES, CaseStage } from "@akeezo/contracts";

export const STAGE_CONFIG: Record<
  CaseStage,
  { label: string; bg: string; border: string; badge: string }
> = {
  new_referral: {
    label: "New Referral",
    bg: "bg-slate-50",
    border: "border-slate-300",
    badge: "bg-slate-200 text-slate-800",
  },
  under_review: {
    label: "Under Review",
    bg: "bg-amber-50/50",
    border: "border-amber-200",
    badge: "bg-amber-100 text-amber-800",
  },
  quotes_requested: {
    label: "Quotes Requested",
    bg: "bg-blue-50/50",
    border: "border-blue-200",
    badge: "bg-blue-100 text-blue-800",
  },
  quotes_shared: {
    label: "Quotes Shared",
    bg: "bg-indigo-50/50",
    border: "border-indigo-200",
    badge: "bg-indigo-100 text-indigo-800",
  },
  partner_decision: {
    label: "Partner Decision",
    bg: "bg-purple-50/50",
    border: "border-purple-200",
    badge: "bg-purple-100 text-purple-800",
  },
  visa_travel: {
    label: "Visa & Travel",
    bg: "bg-cyan-50/50",
    border: "border-cyan-200",
    badge: "bg-cyan-100 text-cyan-800",
  },
  arrival: {
    label: "Arrival in India",
    bg: "bg-teal-50/50",
    border: "border-teal-200",
    badge: "bg-teal-100 text-teal-800",
  },
  consultation: {
    label: "Consultation",
    bg: "bg-emerald-50/50",
    border: "border-emerald-200",
    badge: "bg-emerald-100 text-emerald-800",
  },
  final_quotation: {
    label: "Final Quotation",
    bg: "bg-yellow-50/50",
    border: "border-yellow-200",
    badge: "bg-yellow-100 text-yellow-800",
  },
  mapped: {
    label: "Mapped to Hospital",
    bg: "bg-lime-50/50",
    border: "border-lime-200",
    badge: "bg-lime-100 text-lime-800",
  },
  in_treatment: {
    label: "In Treatment",
    bg: "bg-emerald-100/50",
    border: "border-emerald-300",
    badge: "bg-emerald-200 text-emerald-900 font-bold",
  },
  treatment_completed: {
    label: "Treatment Done",
    bg: "bg-teal-100/50",
    border: "border-teal-300",
    badge: "bg-teal-200 text-teal-900",
  },
  settlement: {
    label: "Settlement",
    bg: "bg-orange-50/50",
    border: "border-orange-200",
    badge: "bg-orange-100 text-orange-800",
  },
  closed: {
    label: "Closed",
    bg: "bg-slate-100",
    border: "border-slate-300",
    badge: "bg-slate-300 text-slate-700",
  },
};

interface PipelineBoardProps {
  cases: any[];
  onSelectCase: (caseId: string) => void;
}

export const PipelineBoard: React.FC<PipelineBoardProps> = ({
  cases,
  onSelectCase,
}) => {
  // Group cases by stage
  const groupedCases = React.useMemo(() => {
    const groups: Record<CaseStage, any[]> = {} as any;
    for (const stage of CASE_STAGES) {
      groups[stage] = [];
    }
    for (const c of cases) {
      if (groups[c.stage as CaseStage]) {
        groups[c.stage as CaseStage].push(c);
      }
    }
    return groups;
  }, [cases]);

  return (
    <div className="h-full flex flex-col p-6 overflow-hidden">
      <div className="flex items-center justify-between pb-4">
        <div>
          <h1 className="text-xl font-black text-slate-800 tracking-tight">
            Case Lifecycle Pipeline
          </h1>
          <p className="text-xs text-slate-500">
            12-step end-to-end journey from Partner referral to final Commission settlement.
          </p>
        </div>
      </div>

      <div className="flex-1 overflow-x-auto pb-4 pt-1">
        <div className="flex gap-4 min-w-max h-full">
          {CASE_STAGES.filter((s) => s !== "closed").map((stage) => {
            const config = STAGE_CONFIG[stage];
            const stageCases = groupedCases[stage] || [];

            return (
              <div
                key={stage}
                className={`w-72 shrink-0 flex flex-col rounded-xl border ${config.border} ${config.bg} shadow-sm overflow-hidden`}
              >
                {/* Column Header */}
                <div className="p-3 border-b border-slate-200/80 bg-white/70 flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800">
                    {config.label}
                  </span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${config.badge}`}
                  >
                    {stageCases.length}
                  </span>
                </div>

                {/* Cards Container */}
                <div className="flex-1 p-2 space-y-2.5 overflow-y-auto max-h-[calc(100vh-14rem)]">
                  {stageCases.length === 0 ? (
                    <div className="text-center py-8 text-[11px] text-slate-400">
                      No cases in stage
                    </div>
                  ) : (
                    stageCases.map((c) => {
                      const daysInStage = Math.floor(
                        (Date.now() - new Date(c.stageChangedAt || c.createdAt).getTime()) /
                          (1000 * 60 * 60 * 24)
                      );
                      const isStale = daysInStage >= 7;

                      return (
                        <div
                          key={c._id}
                          onClick={() => onSelectCase(c._id)}
                          className="bg-white p-3 rounded-lg border border-slate-200 shadow-xs hover:shadow-md hover:border-teal-500 transition-all cursor-pointer group"
                        >
                          <div className="flex items-center justify-between pb-1.5">
                            <span className="text-[11px] font-mono font-bold text-teal-800">
                              {c.caseCode}
                            </span>
                            <span
                              className={`text-[10px] font-semibold px-1.5 py-0.5 rounded uppercase tracking-wider ${
                                c.urgency === "critical"
                                  ? "bg-red-100 text-red-700 font-bold"
                                  : c.urgency === "priority"
                                  ? "bg-orange-100 text-orange-700"
                                  : "bg-slate-100 text-slate-600"
                              }`}
                            >
                              {c.urgency}
                            </span>
                          </div>

                          <div className="text-xs font-bold text-slate-800 pb-1 flex items-center gap-1.5">
                            <span>{c.patientId?.fullName || "Patient"}</span>
                            {c.patientId?.nationality && (
                              <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.2 rounded font-normal">
                                {c.patientId.nationality}
                              </span>
                            )}
                          </div>

                          <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed pb-2">
                            {c.diagnosisSummary}
                          </p>

                          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400">
                            <span className="truncate max-w-[120px] text-slate-600 font-medium">
                              {c.partnerId?.name || "Direct Family"}
                            </span>

                            <div className="flex items-center gap-1">
                              {isStale && (
                                <span
                                  title="Stale Case (>=7 days without stage move)"
                                  className="flex items-center gap-0.5 text-amber-600 font-bold"
                                >
                                  <AlertTriangle className="w-3 h-3" />
                                </span>
                              )}
                              <span className="flex items-center gap-0.5">
                                <Clock className="w-3 h-3 text-slate-400" />
                                {daysInStage}d
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
