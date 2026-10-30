import React, { useState } from "react";
import type { SiteSettings } from "@akeezo/contracts";
import { ChevronDown, Search, Check, X, Globe2 } from "lucide-react";
import {
  COUNTRIES,
  LANGUAGES,
  DIRECTORY_TABS,
  type CountryOption
} from "./navigationData.js";

export interface SiteFooterProps {
  siteSettings?: Partial<SiteSettings>;
}

export const SiteFooter: React.FC<SiteFooterProps> = ({ siteSettings = {} }) => {
  const [activeTab, setActiveTab] = useState<"treatments" | "hospitals" | "doctors" | "destinations">("treatments");

  // Regional Currency & Language Switcher State
  const [selectedCountry, setSelectedCountry] = useState<CountryOption>(COUNTRIES[0]);
  const [selectedLanguage, setSelectedLanguage] = useState(LANGUAGES[0]);
  const [isCountryLangOpen, setIsCountryLangOpen] = useState(false);
  const [switcherTab, setSwitcherTab] = useState<"currency" | "language">("currency");
  const [switcherSearch, setSwitcherSearch] = useState("");

  const filteredCountries = COUNTRIES.filter(
    (c) =>
      c.countryName.toLowerCase().includes(switcherSearch.toLowerCase()) ||
      c.currencyCode.toLowerCase().includes(switcherSearch.toLowerCase()) ||
      c.currencyName.toLowerCase().includes(switcherSearch.toLowerCase())
  );

  const filteredLanguages = LANGUAGES.filter(
    (l) =>
      l.name.toLowerCase().includes(switcherSearch.toLowerCase()) ||
      l.local.toLowerCase().includes(switcherSearch.toLowerCase())
  );

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
                    ? "bg-action text-white shadow-xs"
                    : "bg-surface-muted text-ink-muted hover:text-ink hover:bg-surface-teal/50 hover:text-action"
                }`}
              >
                Treatments
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("hospitals")}
                className={`px-3 py-1.5 rounded-full text-xs font-bold transition-colors cursor-pointer ${
                  activeTab === "hospitals"
                    ? "bg-action text-white shadow-xs"
                    : "bg-surface-muted text-ink-muted hover:text-ink hover:bg-surface-teal/50 hover:text-action"
                }`}
              >
                Hospitals
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("doctors")}
                className={`px-3 py-1.5 rounded-full text-xs font-bold transition-colors cursor-pointer ${
                  activeTab === "doctors"
                    ? "bg-action text-white shadow-xs"
                    : "bg-surface-muted text-ink-muted hover:text-ink hover:bg-surface-teal/50 hover:text-action"
                }`}
              >
                Specialists
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("destinations")}
                className={`px-3 py-1.5 rounded-full text-xs font-bold transition-colors cursor-pointer ${
                  activeTab === "destinations"
                    ? "bg-action text-white shadow-xs"
                    : "bg-surface-muted text-ink-muted hover:text-ink hover:bg-surface-teal/50 hover:text-action"
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
            <div className="mb-3">
              <a href="/about" className="hover:text-action font-bold text-action inline-flex items-center gap-1">
                Meet Our Team &amp; Story &rarr;
              </a>
            </div>
            <div className="font-bold text-ink">ISO 9001:2015 Certified</div>
          </div>

          <div>
            <h3 className="font-bold text-ink text-sm mb-3">Patient Support</h3>
            <ul className="space-y-2">
              <li><a href="/treatments" className="hover:text-action">All Treatments Directory</a></li>
              <li><a href="/hospitals" className="hover:text-action">Accredited Hospitals Directory</a></li>
              <li><a href="/doctors" className="hover:text-action">Top Doctors Directory</a></li>
              <li><a href="/cost-calculator" className="hover:text-action">Cost Calculator</a></li>
              <li><a href="/#opinion" className="hover:text-action">Free Second Opinion</a></li>
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
              <div>
                <span className="font-bold text-ink">Helpline:</span>{" "}
                <a href={`tel:${phoneClean}`} className="hover:text-action hover:underline font-semibold">
                  {phone}
                </a>
              </div>
              <div>
                <span className="font-bold text-ink">Care:</span>{" "}
                <a href={`mailto:${careEmail}`} className="hover:text-action hover:underline">
                  {careEmail}
                </a>
              </div>
              <div><span className="font-bold text-ink">Office:</span> {officeAddress}</div>
              <div className="pt-2">
                <a
                  href={`https://wa.me/${phoneClean}?text=Hello%20Akeezo%20Care%20Desk`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-full bg-surface-teal border border-border-teal px-3 py-1 font-bold text-action text-[11px] hover:bg-surface-teal/70 transition-colors"
                >
                  <span>💬 WhatsApp 24/7 Desk</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        <hr className="border-border my-6" />

        {/* Bottom Bar: Copyright, Country/Language Switcher & Grievance */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-ink-muted">
          <a
            href="/"
            aria-label="Akeezo Healthcare Platform Home"
            className="flex items-center gap-2 hover:opacity-80 transition-opacity cursor-pointer"
          >
            <img src="/logo/favicon.svg" alt="Akeezo" className="size-5" />
            <span>{`© ${new Date().getFullYear()} ${legalEntity}. All rights reserved.`}</span>
          </a>

          <div className="flex items-center gap-4 flex-wrap">
            {/* Regional Country / Currency / Language Switcher Button (Moved to Footer) */}
            <button
              type="button"
              data-cy="footer-country-lang-switcher"
              data-testid="footer-country-lang-switcher"
              onClick={() => setIsCountryLangOpen(true)}
              className="flex items-center gap-1.5 rounded-sm bg-surface-muted px-2.5 py-1 text-[0.75rem] font-bold text-ink border border-border transition-colors hover:bg-surface-teal/50 hover:text-action hover:border-action focus-visible:outline-2 focus-visible:outline-action cursor-pointer shadow-2xs"
              aria-haspopup="dialog"
              aria-expanded={isCountryLangOpen}
            >
              <span data-countrycode={selectedCountry.countryCode} className="inline-flex items-center shrink-0">
                <img
                  alt=""
                  aria-hidden="true"
                  className="h-3 w-4.5 rounded-[1px] object-cover shadow-xs"
                  srcSet={`https://flagcdn.com/w80/${selectedCountry.countryCode.toLowerCase()}.png 2x`}
                  src={selectedCountry.flagUrl}
                />
              </span>
              <span className="font-extrabold uppercase tracking-tight">{selectedCountry.currencyCode}</span>
              <span className="text-ink-muted/60">|</span>
              <span className="font-medium text-ink-muted">{selectedLanguage.name}</span>
              <ChevronDown
                className={`size-3 text-ink-muted/80 transition-transform duration-200 ${isCountryLangOpen ? "rotate-180" : ""}`}
                aria-hidden="true"
              />
            </button>

            <span>Regulated under Indian Clinical Establishments Acts</span>
            <a href="/grievance-officer" className="hover:text-action font-bold">Grievance Desk</a>
          </div>
        </div>
      </div>

      {/* Regional Currency & Language Selection Modal */}
      {isCountryLangOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="footer-country-lang-modal-title"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs font-sans text-ink"
          onClick={() => setIsCountryLangOpen(false)}
        >
          <div
            className="relative max-h-[85vh] w-full max-w-md overflow-hidden rounded-[20px] bg-white p-6 sm:p-7 shadow-2xl flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-border pb-3.5">
              <div className="flex items-center gap-2.5">
                <div className="inline-flex size-9 items-center justify-center rounded-full bg-surface-teal text-action border border-[#b2ebe4]">
                  <Globe2 className="size-4" />
                </div>
                <div>
                  <h3 id="footer-country-lang-modal-title" className="text-base font-bold text-ink">
                    Select Currency & Language
                  </h3>
                  <p className="text-[11px] text-ink-muted">Tailor healthcare pricing and language to your region</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsCountryLangOpen(false)}
                className="rounded-full p-2 text-ink-muted hover:bg-surface-muted hover:text-ink cursor-pointer"
                aria-label="Close region and language dialog"
              >
                <X className="size-5" />
              </button>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-border mt-3">
              <button
                type="button"
                onClick={() => {
                  setSwitcherTab("currency");
                  setSwitcherSearch("");
                }}
                className={`flex-1 py-2.5 text-center text-xs font-bold transition-colors border-b-2 cursor-pointer ${
                  switcherTab === "currency"
                    ? "border-action text-action"
                    : "border-transparent text-ink-muted hover:text-ink"
                }`}
              >
                Currency ({selectedCountry.currencyCode})
              </button>
              <button
                type="button"
                onClick={() => {
                  setSwitcherTab("language");
                  setSwitcherSearch("");
                }}
                className={`flex-1 py-2.5 text-center text-xs font-bold transition-colors border-b-2 cursor-pointer ${
                  switcherTab === "language"
                    ? "border-action text-action"
                    : "border-transparent text-ink-muted hover:text-ink"
                }`}
              >
                Language ({selectedLanguage.name})
              </button>
            </div>

            {/* Search Bar */}
            <div className="my-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-ink-muted" />
                <input
                  type="search"
                  value={switcherSearch}
                  onChange={(e) => setSwitcherSearch(e.target.value)}
                  placeholder={
                    switcherTab === "currency"
                      ? "Search currency by code, country, or name..."
                      : "Search language..."
                  }
                  className="w-full rounded-xl border border-border bg-surface-muted py-2 pl-9 pr-4 text-xs text-ink placeholder:text-ink-muted/70 focus:border-action focus:outline-none focus:bg-white"
                />
              </div>
            </div>

            {/* List */}
            <div className="overflow-y-auto max-h-[300px] divide-y divide-border/60 pr-1">
              {switcherTab === "currency" ? (
                filteredCountries.length > 0 ? (
                  filteredCountries.map((c) => {
                    const isSelected = selectedCountry.countryCode === c.countryCode;
                    return (
                      <button
                        key={c.countryCode}
                        type="button"
                        onClick={() => {
                          setSelectedCountry(c);
                          setIsCountryLangOpen(false);
                        }}
                        className={`w-full flex items-center justify-between px-3 py-2.5 text-left rounded-lg transition-colors cursor-pointer hover:bg-surface-teal/30 ${
                          isSelected ? "bg-surface-teal/50 font-bold" : ""
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <img
                            alt={c.countryName}
                            className="h-4 w-6 rounded-[2px] object-cover shadow-2xs border border-black/10"
                            src={c.flagUrl}
                          />
                          <div>
                            <div className="text-xs text-ink">
                              <span className="font-extrabold">{c.currencyCode}</span>
                              <span className="mx-1 text-ink-muted">·</span>
                              <span>{c.currencyName}</span>
                            </div>
                            <div className="text-[11px] text-ink-muted">
                              {c.countryName} ({c.currencySymbol})
                            </div>
                          </div>
                        </div>
                        {isSelected && <Check className="size-4 text-action shrink-0" />}
                      </button>
                    );
                  })
                ) : (
                  <div className="py-6 text-center text-xs text-ink-muted">No currencies match your search</div>
                )
              ) : filteredLanguages.length > 0 ? (
                filteredLanguages.map((l) => {
                  const isSelected = selectedLanguage.code === l.code;
                  return (
                    <button
                      key={l.code}
                      type="button"
                      onClick={() => {
                        setSelectedLanguage(l);
                        setIsCountryLangOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2.5 text-left rounded-lg transition-colors cursor-pointer hover:bg-surface-teal/30 ${
                        isSelected ? "bg-surface-teal/50 font-bold" : ""
                      }`}
                    >
                      <div>
                        <span className="text-xs text-ink font-bold">{l.name}</span>
                        <span className="ml-2 text-xs text-ink-muted">({l.local})</span>
                      </div>
                      {isSelected && <Check className="size-4 text-action shrink-0" />}
                    </button>
                  );
                })
              ) : (
                <div className="py-6 text-center text-xs text-ink-muted">No languages match your search</div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="mt-4 pt-3 border-t border-border flex items-center justify-between">
              <span className="text-[11px] text-ink-muted">
                Active: <strong className="text-ink">{selectedCountry.currencyCode} ({selectedCountry.currencySymbol})</strong> · {selectedLanguage.name}
              </span>
              <button
                type="button"
                onClick={() => setIsCountryLangOpen(false)}
                className="rounded-full bg-action px-5 py-1.5 text-xs font-bold text-white hover:bg-action-hover cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </footer>
  );
};
