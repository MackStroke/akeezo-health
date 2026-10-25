import React from "react";
import { Shield, ShieldAlert, Key, Lock, Users, CheckCircle2 } from "lucide-react";

export const RbacView: React.FC = () => {
  const roles = [
    {
      role: "Super Administrator",
      scope: "Overall System & Platform",
      permissions: "Overall responsible for website management, brand settings, user access, and super admin of managing Case Management System. Authoritative oversight.",
      badge: "Super Admin",
      badgeColor: "bg-[#061E1B] text-[#00C7BE] border border-[#00C7BE]/40",
    },
    {
      role: "Content Editor",
      scope: "Editorial & Content",
      permissions: "Draft page content, upload editorial media, preview draft templates, submit revisions for medical review.",
      badge: "CMS Editor",
      badgeColor: "bg-[#E6F8F6] text-[#007A6C] border border-[#00C7BE]/40",
    },
    {
      role: "Medical Reviewer",
      scope: "Clinical Accuracy",
      permissions: "Review medical treatment guides, clinical claims, and hospital evidence. Cannot alter billing or access patient files unlogged.",
      badge: "Clinical Gate",
      badgeColor: "bg-[#FFF4EC] text-[#FF6B00] border border-[#FF6B00]/40",
    },
    {
      role: "Publisher",
      scope: "Website Delivery",
      permissions: "Publish and unpublish approved revisions, commit atomic updates to live website, restore historical revisions, manage route redirects.",
      badge: "Release Authority",
      badgeColor: "bg-emerald-50 text-emerald-800 border border-emerald-300",
    },
    {
      role: "Case Coordinator",
      scope: "Case Operations ERP",
      permissions: "Intake and triage incoming leads, manage active cases through all 7 pipeline stages, request hospital quotes, coordinate travel visas.",
      badge: "Operations",
      badgeColor: "bg-[#E6F8F6] text-[#007A6C] border border-[#00C7BE]/40",
    },
    {
      role: "Partner Manager",
      scope: "Agencies & Facilitators",
      permissions: "Review partner agency onboarding applications, manage facilitator agreements, oversee commission payout tiers.",
      badge: "Partners",
      badgeColor: "bg-[#FFF4EC] text-[#FF6B00] border border-[#FF6B00]/40",
    },
  ];

  return (
    <div className="space-y-6 font-sans">
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-2">
        <div className="flex items-center gap-2">
          <ShieldAlert className="w-5 h-5 text-[#007A6C]" />
          <h2 className="text-base font-bold text-slate-800">
            Platform Roles & Authorization Governance
          </h2>
        </div>
        <p className="text-xs text-slate-500 max-w-3xl leading-relaxed">
          Server enforcement is authoritative. A hidden menu is not authorization. Public content, drafts, patient records, and partner data exist in strictly separated access scopes in accordance with DPDP Act 2023.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {roles.map((r) => (
          <div key={r.role} className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${r.badgeColor}`}>
                {r.badge}
              </span>
              <span className="text-[10px] font-semibold text-slate-400">{r.scope}</span>
            </div>
            <h3 className="text-sm font-bold text-slate-900">{r.role}</h3>
            <p className="text-xs text-slate-600 leading-relaxed">{r.permissions}</p>
            <div className="pt-2 border-t border-slate-100 flex items-center gap-1.5 text-[11px] font-semibold text-emerald-700">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Authoritative Server RBAC Active</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
