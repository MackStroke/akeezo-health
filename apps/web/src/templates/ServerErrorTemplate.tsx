import React from "react";
import type { PublicRouteResponseDTO } from "@akeezo/contracts";
import { SiteHeader } from "../components/SiteHeader.js";
import { SiteFooter } from "../components/SiteFooter.js";
import {
  RotateCcw,
  Home,
  PhoneCall,
  AlertTriangle,
  ShieldCheck,
  HeartPulse
} from "lucide-react";

export interface ServerErrorTemplateProps {
  data: PublicRouteResponseDTO;
  error?: Error;
}

export const ServerErrorTemplate: React.FC<ServerErrorTemplateProps> = ({ data, error }) => {
  const { siteSettings } = data;

  const phone = siteSettings.phone || siteSettings.emergencyHelpline || "+91 82876 39443";
  const phoneClean = phone.replace(/[^0-9]/g, "");
  const careEmail = siteSettings.careEmail || siteSettings.contactEmail || "care@akeezo.com";
  const medicalEmail = siteSettings.medicalEmail || "medical@akeezo.com";

  const handleReload = () => {
    if (typeof window !== "undefined") {
      window.location.reload();
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#f8fafc] font-sans text-ink selection:bg-surface-teal selection:text-action">
      {/* Canonical Header */}
      <SiteHeader siteSettings={siteSettings} activePath={data.path} />

      {/* Main 500 Error Section */}
      <main className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-3xl bg-white rounded-3xl border border-border p-6 sm:p-10 md:p-12 shadow-sm text-center">
          {/* Status Badge */}
          <div className="inline-flex items-center gap-2 rounded-full bg-amber-50 border border-amber-200 px-3.5 py-1 text-xs font-bold text-amber-800 mb-6">
            <AlertTriangle className="size-3.5 text-amber-600" />
            <span>HTTP Status: 500 · Server Interruption</span>
          </div>

          {/* Icon Beacon */}
          <div className="mx-auto size-16 sm:size-20 rounded-full bg-amber-100 flex items-center justify-center mb-4">
            <HeartPulse className="size-8 sm:size-10 text-amber-600" />
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-ink mb-3">
            Temporary System Interruption
          </h1>
          <p className="max-w-xl mx-auto text-sm sm:text-base text-ink-muted leading-relaxed mb-6">
            Our servers encountered an unexpected condition while processing your request. Our technical team has been notified and is working to resolve it immediately.
          </p>

          {/* Reassurance Banner regarding Data Security */}
          <div className="max-w-lg mx-auto rounded-xl bg-surface-muted border border-border/80 p-3.5 mb-8 flex items-center gap-3 text-left">
            <ShieldCheck className="size-5 text-action shrink-0" />
            <p className="text-xs text-ink-muted">
              <strong className="text-ink font-semibold">Your Information is Safe:</strong> Submitted medical records, consultation requests, and treatment estimates are encrypted and securely preserved in our database.
            </p>
          </div>

          {/* Optional Developer error info */}
          {error && (import.meta as { env?: { DEV?: boolean } }).env?.DEV && (
            <div className="max-w-lg mx-auto mb-6 p-3 rounded-lg bg-red-50 border border-red-200 text-left text-xs font-mono text-red-800 overflow-x-auto">
              <div className="font-bold mb-1">Diagnostic Detail:</div>
              <div>{error.message}</div>
            </div>
          )}

          {/* Primary Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3 mb-10">
            <button
              type="button"
              onClick={handleReload}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-action px-6 py-3 text-xs sm:text-sm font-bold text-white shadow-sm hover:bg-action-hover transition-colors cursor-pointer"
            >
              <RotateCcw className="size-4" />
              <span>Try Again / Reload</span>
            </button>

            <a
              href="/"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-border bg-white px-6 py-3 text-xs sm:text-sm font-bold text-ink hover:border-action hover:bg-surface-teal/30 hover:text-action transition-colors"
            >
              <Home className="size-4" />
              <span>Return to Homepage</span>
            </a>

            <a
              href={`https://wa.me/${phoneClean}?text=Hello%20Akeezo%20Care%20Desk,%20I%20experienced%20a%20technical%20issue%20and%20need%20assistance`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-surface-orange border border-[#ffd8bf] px-6 py-3 text-xs sm:text-sm font-bold text-action-accent hover:bg-surface-orange/80 transition-colors"
            >
              <PhoneCall className="size-4" />
              <span>WhatsApp 24/7 Desk</span>
            </a>
          </div>

          {/* Emergency Patient Care Coordination Box */}
          <div className="rounded-2xl border border-border bg-slate-50/80 p-5 text-left flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="text-xs font-bold uppercase tracking-wider text-action">
                24/7 Patient Emergency & Inquiries
              </div>
              <div className="text-sm font-extrabold text-ink">
                Hotline: <a href={`tel:${phoneClean}`} className="text-action underline">{phone}</a>
              </div>
              <div className="text-xs text-ink-muted">
                Medical Records: <a href={`mailto:${medicalEmail}`} className="underline">{medicalEmail}</a> · Support: <a href={`mailto:${careEmail}`} className="underline">{careEmail}</a>
              </div>
            </div>
            <a
              href={`tel:${phoneClean}`}
              className="shrink-0 rounded-full bg-action px-5 py-2 text-xs font-bold text-white hover:bg-action-hover transition-colors inline-flex items-center gap-1.5"
            >
              <PhoneCall className="size-3.5" />
              <span>Call Helpline</span>
            </a>
          </div>
        </div>
      </main>

      {/* Canonical Footer */}
      <SiteFooter siteSettings={siteSettings} />
    </div>
  );
};

export default ServerErrorTemplate;
