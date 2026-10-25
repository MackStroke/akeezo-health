import React, { useState } from "react";
import type { PublicRouteResponseDTO } from "@akeezo/contracts";
import { SiteHeader } from "../components/SiteHeader.js";
import { SiteFooter } from "../components/SiteFooter.js";
import {
  Search,
  Home,
  PhoneCall,
  Building2,
  Stethoscope
} from "lucide-react";

export interface NotFoundTemplateProps {
  data: PublicRouteResponseDTO;
}

export const NotFoundTemplate: React.FC<NotFoundTemplateProps> = ({ data }) => {
  const { siteSettings } = data;
  const [searchQuery, setSearchQuery] = useState("");

  const [searchError, setSearchError] = useState("");

  const phone = siteSettings.phone || siteSettings.emergencyHelpline || "+91 82876 39443";
  const phoneClean = phone.replace(/[^0-9]/g, "");
  const careEmail = siteSettings.careEmail || siteSettings.contactEmail || "care@akeezo.com";

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      setSearchError("Please enter a procedure, doctor or hospital name to inquire.");
      return;
    }
    setSearchError("");
    window.location.href = `https://wa.me/${phoneClean}?text=${encodeURIComponent(
      `Hello Akeezo Care Desk, I am looking for information on: ${searchQuery}`
    )}`;
  };

  const quickLinks = [
    { label: "Cardiac Surgery", query: "Cardiac Surgery CABG" },
    { label: "Oncology & Cancer Care", query: "Cancer Treatment Proton Beam" },
    { label: "Robotic Knee Replacement", query: "Robotic Joint Replacement" },
    { label: "Neuro & Spine", query: "CyberKnife Spine Surgery" },
    { label: "Liver & Kidney Transplant", query: "Organ Transplant" },
    { label: "IVF & Fertility", query: "IVF Treatment" }
  ];

  return (
    <div className="flex flex-col min-h-screen bg-[#f8fafc] font-sans text-ink selection:bg-surface-teal selection:text-action">
      {/* Canonical Header */}
      <SiteHeader siteSettings={siteSettings} activePath={data.path} />

      {/* Main 404 Error Hero */}
      <main className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-3xl bg-white rounded-3xl border border-border p-6 sm:p-10 md:p-12 shadow-sm text-center">
          {/* Status Badge */}
          <div className="inline-flex items-center gap-2 rounded-full bg-surface-teal border border-border-teal px-3.5 py-1 text-xs font-bold text-action mb-6">
            <span className="size-2 rounded-full bg-action animate-pulse" />
            <span>HTTP Status: 404 · Page Not Found</span>
          </div>

          {/* Big Medical 404 Headline */}
          <div className="text-6xl sm:text-7xl md:text-8xl font-black text-action tracking-tight mb-2">
            404
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-ink mb-3">
            Healthcare Resource Not Found
          </h1>
          <p className="max-w-xl mx-auto text-sm sm:text-base text-ink-muted leading-relaxed mb-8">
            The doctor profile, hospital department, treatment procedure, or page you requested is not available at this address. The URL may have been moved or updated.
          </p>

          {/* Quick Search on WhatsApp */}
          <form onSubmit={handleSearchSubmit} className="max-w-lg mx-auto mb-8">
            <div className="relative flex items-center">
              <Search className="absolute left-4 size-4.5 text-ink-muted/80" />
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  if (searchError) setSearchError("");
                }}
                aria-invalid={!!searchError}
                aria-describedby="notfound-search-error"
                placeholder="Search procedure, doctor or hospital name..."
                className="w-full rounded-full border border-border bg-surface-muted py-3 pl-11 pr-28 text-sm text-ink placeholder:text-ink-muted/70 focus:border-action focus:bg-white focus:outline-none transition-colors"
              />
              <button
                type="submit"
                className="absolute right-1.5 rounded-full bg-brand-orange hover:bg-brand-orange-alt px-4 py-2 text-xs font-bold text-white shadow-md shadow-brand-orange/20 transition-colors cursor-pointer"
              >
                Inquire Desk
              </button>
            </div>
            {searchError && (
              <div
                id="notfound-search-error"
                role="alert"
                className="mt-2.5 rounded-lg bg-red-50 border border-red-200 px-4 py-2 text-xs font-bold text-red-700 text-left flex items-center gap-2"
              >
                <span>⚠️</span>
                <span>{searchError}</span>
              </div>
            )}

            {/* Specialty Suggestions */}
            <div className="mt-3 flex flex-wrap items-center justify-center gap-1.5 text-xs">
              <span className="text-ink-muted font-medium">Popular:</span>
              {quickLinks.map((item, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    window.location.href = `https://wa.me/${phoneClean}?text=${encodeURIComponent(
                      `Hello Akeezo, I am inquiring about ${item.query}`
                    )}`;
                  }}
                  className="rounded-full bg-surface-muted px-2.5 py-1 text-[11px] font-semibold text-ink-muted hover:bg-surface-teal hover:text-action transition-colors cursor-pointer"
                >
                  {item.label}
                </button>
              ))}
            </div>
          </form>

          {/* Primary Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3 mb-10">
            <a
              href="/"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-action px-6 py-3 text-xs sm:text-sm font-bold text-white shadow-md shadow-action/20 hover:bg-action-hover transition-colors"
            >
              <Home className="size-4" />
              <span>Return to Homepage</span>
            </a>

            <a
              href={`https://wa.me/${phoneClean}?text=Hello%20Akeezo%20Care%20Desk,%20I%20need%20help%20finding%20treatment%20information`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-border-orange bg-surface-orange px-6 py-3 text-xs sm:text-sm font-bold text-action-accent hover:bg-[#ffe8d9] transition-colors"
            >
              <PhoneCall className="size-4 text-action-accent" />
              <span>Chat with 24/7 Desk</span>
            </a>

            <a
              href="/#hospitals"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-surface-muted px-6 py-3 text-xs sm:text-sm font-bold text-ink hover:bg-border transition-colors"
            >
              <Building2 className="size-4 text-ink-muted" />
              <span>Accredited Hospitals</span>
            </a>
          </div>

          {/* Reassuring Care Coordinator Help Card */}
          <div className="rounded-2xl border border-border-teal bg-surface-teal/60 p-5 text-left flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="size-10 rounded-full bg-action/10 flex items-center justify-center shrink-0">
                <Stethoscope className="size-5 text-action" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-ink">Need Immediate Medical Coordination?</h2>
                <p className="text-xs text-ink-muted mt-0.5">
                  Our medical coordinators are on duty 24/7. Call{" "}
                  <a href={`tel:${phoneClean}`} className="font-bold text-action underline">
                    {phone}
                  </a>{" "}
                  or email{" "}
                  <a href={`mailto:${careEmail}`} className="font-bold text-action underline">
                    {careEmail}
                  </a>
                </p>
              </div>
            </div>
            <a
              href={`https://wa.me/${phoneClean}?text=Hello%20Akeezo%20Coordinator`}
              target="_blank"
              rel="noopener noreferrer"
              className="shrink-0 rounded-full bg-brand-orange hover:bg-brand-orange-alt px-5 py-2.5 text-xs font-bold text-white shadow-md shadow-brand-orange/20 transition-colors"
            >
              Get Free Help
            </a>
          </div>
        </div>
      </main>

      {/* Canonical Footer */}
      <SiteFooter siteSettings={siteSettings} />
    </div>
  );
};

export default NotFoundTemplate;
