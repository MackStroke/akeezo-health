import React, { useState } from "react";
import type { SiteSettings } from "@akeezo/contracts";
import { DIRECTORY_TABS } from "./navigationData.js";

export interface SiteFooterProps {
  siteSettings?: Partial<SiteSettings>;
}

export const SiteFooter: React.FC<SiteFooterProps> = ({ siteSettings = {} }) => {
  const [activeTab, setActiveTab] = useState<"treatments" | "hospitals" | "doctors" | "destinations">("treatments");

  const phone = siteSettings.phone || siteSettings.emergencyHelpline || "+91 82876 39443";
  const phoneClean = phone.replace(/[^0-9]/g, "");
  const legalEntity = siteSettings.legalEntityName || "AKEEZO Healthcare Platform Private Limited";
  const careEmail = siteSettings.careEmail || siteSettings.contactEmail || "care@akeezo.com";
  const officeAddress = siteSettings.officeAddress || "Regus Elegance, Jasola District Centre, New Delhi, India 110025";

  return (
    <footer className="border-t border-border bg-white pt-12 pb-8 font-sans text-ink">
      <div className="mx-auto max-w-[1280px] px-4 sm:px-8">
        {/* Directory Exploration Tabs */}
        <div className="mb-10">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border pb-4 mb-6">
            <div>
              <h2 className="text-base font-bold text-ink">Directory of Accredited Indian Healthcare</h2>
              <p className="text-xs text-ink-muted mt-0.5">Explore medical specialities, premier hospital hubs, board-certified surgeons and destinations</p>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setActiveTab("treatments")}
                className={`px-3 py-1.5 rounded-full text-xs font-bold transition-colors cursor-pointer ${
                  activeTab === "treatments"
                    ? "bg-action text-white"
                    : "bg-surface-muted text-ink-muted hover:text-ink"
                }`}
              >
                Treatments
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("hospitals")}
                className={`px-3 py-1.5 rounded-full text-xs font-bold transition-colors cursor-pointer ${
                  activeTab === "hospitals"
                    ? "bg-action text-white"
                    : "bg-surface-muted text-ink-muted hover:text-ink"
                }`}
              >
                Hospitals
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("doctors")}
                className={`px-3 py-1.5 rounded-full text-xs font-bold transition-colors cursor-pointer ${
                  activeTab === "doctors"
                    ? "bg-action text-white"
                    : "bg-surface-muted text-ink-muted hover:text-ink"
                }`}
              >
                Specialists
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("destinations")}
                className={`px-3 py-1.5 rounded-full text-xs font-bold transition-colors cursor-pointer ${
                  activeTab === "destinations"
                    ? "bg-action text-white"
                    : "bg-surface-muted text-ink-muted hover:text-ink"
                }`}
              >
                Destinations
              </button>
            </div>
          </div>

          {activeTab === "treatments" && (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {DIRECTORY_TABS.treatments.map((item, idx) => (
                <a
                  key={idx}
                  href={`https://wa.me/${phoneClean}?text=Hello%20Akeezo,%20I%20would%20like%20to%20inquire%20about%20${encodeURIComponent(item.name)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group rounded-xl border border-border p-3.5 hover:border-action hover:bg-surface-teal/30 transition-all cursor-pointer block"
                >
                  <div className="text-[11px] font-semibold text-action uppercase tracking-wider mb-1">{item.category}</div>
                  <div className="text-sm font-bold text-ink group-hover:text-action">{item.name}</div>
                  <div className="text-xs text-ink-muted mt-1.5">Free Clinical Opinion & Estimate →</div>
                </a>
              ))}
            </div>
          )}

          {activeTab === "hospitals" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
              {DIRECTORY_TABS.hospitals.map((item, idx) => (
                <a
                  key={idx}
                  href={`https://wa.me/${phoneClean}?text=Hello%20Akeezo,%20I%20would%20like%20to%20inquire%20about%20admission%20at%20${encodeURIComponent(item.name)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group rounded-xl border border-border p-3.5 hover:border-action hover:bg-surface-teal/30 transition-all cursor-pointer block"
                >
                  <div className="text-xs text-action font-semibold mb-0.5">{item.location}</div>
                  <div className="text-sm font-bold text-ink group-hover:text-action">{item.name}</div>
                  <div className="text-xs text-ink-muted mt-1">NABH / JCI Accredited Quaternary</div>
                </a>
              ))}
            </div>
          )}

          {activeTab === "doctors" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
              {DIRECTORY_TABS.doctors.map((item, idx) => (
                <a
                  key={idx}
                  href={`https://wa.me/${phoneClean}?text=Hello%20Akeezo,%20I%20would%20like%20to%20consult%20with%20${encodeURIComponent(item.name)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group rounded-xl border border-border p-3.5 hover:border-action hover:bg-surface-teal/30 transition-all cursor-pointer block"
                >
                  <div className="text-xs text-ink-muted font-medium mb-0.5">{item.experience}</div>
                  <div className="text-sm font-bold text-ink group-hover:text-action">{item.name}</div>
                  <div className="text-xs text-action font-semibold mt-1">{item.role}</div>
                </a>
              ))}
            </div>
          )}

          {activeTab === "destinations" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
              {DIRECTORY_TABS.destinations.map((item, idx) => (
                <a
                  key={idx}
                  href={`https://wa.me/${phoneClean}?text=Hello%20Akeezo,%20I%20am%20planning%20medical%20treatment%20in%20${encodeURIComponent(item.name)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group rounded-xl border border-border p-3.5 hover:border-action hover:bg-surface-teal/30 transition-all cursor-pointer block"
                >
                  <div className="text-lg mb-1">{item.flag}</div>
                  <div className="text-sm font-bold text-ink group-hover:text-action">{item.name}</div>
                  <div className="text-xs text-ink-muted mt-1">{item.count}</div>
                </a>
              ))}
            </div>
          )}
        </div>

        <hr className="border-border my-8" />

        {/* 5 Information Columns */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-8 text-xs text-ink-muted mb-10">
          <div>
            <h3 className="font-bold text-ink text-sm mb-3">About Akeezo</h3>
            <p className="leading-relaxed mb-3">
              India's verified medical tourism and healthcare navigation platform. Bridging global patients to accredited hospitals with personalized care coordination.
            </p>
            <div className="font-bold text-ink">ISO 9001:2015 Certified</div>
          </div>

          <div>
            <h3 className="font-bold text-ink text-sm mb-3">Patient Support</h3>
            <ul className="space-y-2">
              <li><a href="/#opinion" className="hover:text-action">Free Second Opinion</a></li>
              <li><a href="/#calculator" className="hover:text-action">Cost Calculator</a></li>
              <li><a href="/#visa" className="hover:text-action">Medical Visa Assistance</a></li>
              <li><a href="/#concierge" className="hover:text-action">Airport Concierge & Stay</a></li>
              <li><a href="/#telehealth" className="hover:text-action">Video Consultation Desk</a></li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-ink text-sm mb-3">Clinical Quality</h3>
            <ul className="space-y-2">
              <li><span className="text-action font-semibold">JCI & NABH Audited</span></li>
              <li><a href="/privacy" className="hover:text-action">Data Protection Policy</a></li>
              <li><a href="/terms" className="hover:text-action">Platform Terms & Scope</a></li>
              <li><a href="/consent" className="hover:text-action">Informed Patient Consent</a></li>
              <li><a href="/refund-policy" className="hover:text-action">Zero-Markup Billing</a></li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-ink text-sm mb-3">Legal & Policies</h3>
            <ul className="space-y-2">
              <li><a href="/privacy" className="hover:text-action font-medium">Privacy Policy (DPDP / GDPR)</a></li>
              <li><a href="/terms" className="hover:text-action">Terms of Service</a></li>
              <li><a href="/disclaimer" className="hover:text-action">Medical Disclaimer</a></li>
              <li><a href="/grievance-officer" className="hover:text-action">Grievance Officer</a></li>
              <li><a href="/refund-policy" className="hover:text-action">Refund Policy</a></li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-ink text-sm mb-3">Care Coordination</h3>
            <div className="space-y-2">
              <div><span className="font-bold text-ink">Helpline:</span> {phone}</div>
              <div><span className="font-bold text-ink">Care:</span> {careEmail}</div>
              <div><span className="font-bold text-ink">Office:</span> {officeAddress}</div>
              <div className="pt-2">
                <a
                  href={`https://wa.me/${phoneClean}?text=Hello%20Akeezo%20Care%20Desk`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-full bg-surface-teal px-3 py-1 font-bold text-action text-[11px] hover:bg-surface-teal/70 transition-colors"
                >
                  <span>💬 WhatsApp 24/7 Desk</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        <hr className="border-border my-6" />

        {/* Bottom Bar: Copyright & Grievance */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-ink-muted">
          <div className="flex items-center gap-2">
            <img src="/logo/favicon.svg" alt="Akeezo" className="size-5" />
            <span>© 2026 {legalEntity}. All rights reserved.</span>
          </div>
          <div className="flex items-center gap-6">
            <span>Regulated under Indian Clinical Establishments Acts</span>
            <a href="/grievance-officer" className="hover:text-action font-bold">Grievance Desk</a>
          </div>
        </div>
      </div>
    </footer>
  );
};
