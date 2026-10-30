import React, { useState } from "react";
import type { SiteSettings } from "@akeezo/contracts";
import {
  ChevronDown,
  Search,
  Check,
  X,
  Globe2,
  Crosshair,
  HeartPulse,
  HeartHandshake,
  Brain,
  Dna,
  Bone,
  Smile,
  Activity,
  Building2,
  MapPin,
  ShieldCheck,
  Stethoscope,
  Award
} from "lucide-react";
import {
  COUNTRIES,
  LANGUAGES,
  DIRECTORY_TABS,
  type CountryOption
} from "./navigationData.js";

const getTreatmentIcon = (name: string, category: string) => {
  const lowerName = name.toLowerCase();
  const lowerCat = category.toLowerCase();

  if (lowerName.includes("cyberknife") || lowerCat.includes("oncology")) {
    return <Crosshair className="w-4 h-4" />;
  }
  if (lowerName.includes("heart") || lowerName.includes("bypass") || lowerCat.includes("cardiac")) {
    return <HeartPulse className="w-4 h-4" />;
  }
  if (lowerName.includes("liver") || lowerName.includes("transplant") || lowerCat.includes("transplant")) {
    return <HeartHandshake className="w-4 h-4" />;
  }
  if (lowerName.includes("brain") || lowerCat.includes("neuro")) {
    return <Brain className="w-4 h-4" />;
  }
  if (lowerName.includes("marrow") || lowerCat.includes("hematology")) {
    return <Dna className="w-4 h-4" />;
  }
  if (lowerName.includes("dental") || lowerCat.includes("dental")) {
    return <Smile className="w-4 h-4" />;
  }
  if (lowerName.includes("knee") || lowerName.includes("hip") || lowerCat.includes("orthoped")) {
    return <Bone className="w-4 h-4" />;
  }
  return <Activity className="w-4 h-4" />;
};

const getDoctorIcon = (_name: string, role: string) => {
  const lowerRole = role.toLowerCase();
  if (lowerRole.includes("cardiac") || lowerRole.includes("cardiovascular")) {
    return <HeartPulse className="w-4 h-4" />;
  }
  if (lowerRole.includes("liver") || lowerRole.includes("transplant")) {
    return <HeartHandshake className="w-4 h-4" />;
  }
  if (lowerRole.includes("neuro")) {
    return <Brain className="w-4 h-4" />;
  }
  if (lowerRole.includes("oncology")) {
    return <Crosshair className="w-4 h-4" />;
  }
  if (lowerRole.includes("orthopedic") || lowerRole.includes("joint")) {
    return <Bone className="w-4 h-4" />;
  }
  return <Stethoscope className="w-4 h-4" />;
};

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
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <div className="w-8 h-8 rounded-lg bg-surface-teal text-action flex items-center justify-center shrink-0 group-hover:bg-action group-hover:text-white transition-colors">
                      {getTreatmentIcon(item.name, item.category)}
                    </div>
                    <div className="text-[11px] font-semibold text-action uppercase tracking-wider truncate">
                      {item.category}
                    </div>
                  </div>
                  <div className="text-sm font-bold text-ink group-hover:text-action transition-colors leading-snug">
                    {item.name}
                  </div>
                  <div className="text-xs text-ink-muted mt-2 flex items-center gap-1 group-hover:text-action transition-colors">
                    <span>Free Clinical Opinion &amp; Estimate</span>
                    <span className="transition-transform group-hover:translate-x-0.5">&rarr;</span>
                  </div>
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
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <div className="w-8 h-8 rounded-lg bg-surface-teal text-action flex items-center justify-center shrink-0 group-hover:bg-action group-hover:text-white transition-colors">
                      <Building2 className="w-4 h-4" />
                    </div>
                    <div className="text-xs text-action font-semibold flex items-center gap-1 truncate">
                      <MapPin className="w-3 h-3 shrink-0" />
                      <span>{item.location}</span>
                    </div>
                  </div>
                  <div className="text-sm font-bold text-ink group-hover:text-action transition-colors leading-snug">
                    {item.name}
                  </div>
                  <div className="text-xs text-ink-muted mt-2 flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-action shrink-0" />
                    <span>NABH / JCI Accredited Quaternary</span>
                  </div>
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
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <div className="w-8 h-8 rounded-lg bg-surface-teal text-action flex items-center justify-center shrink-0 group-hover:bg-action group-hover:text-white transition-colors">
                      {getDoctorIcon(item.name, item.role)}
                    </div>
                    <div className="text-xs text-ink-muted font-medium flex items-center gap-1 bg-surface-muted px-2 py-0.5 rounded-full border border-border">
                      <Award className="w-3 h-3 text-action shrink-0" />
                      <span>{item.experience}</span>
                    </div>
                  </div>
                  <div className="text-sm font-bold text-ink group-hover:text-action transition-colors leading-snug">
                    {item.name}
                  </div>
                  <div className="text-xs text-action font-semibold mt-2 flex items-center gap-1.5 truncate">
                    <Stethoscope className="w-3.5 h-3.5 shrink-0 text-action/70" />
                    <span className="truncate">{item.role}</span>
                  </div>
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
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <div className="w-8 h-8 rounded-lg bg-surface-teal flex items-center justify-center text-base shrink-0 group-hover:bg-action group-hover:text-white transition-colors">
                      {item.flag}
                    </div>
                    <div className="text-xs text-action font-semibold flex items-center gap-1 bg-surface-teal/50 px-2 py-0.5 rounded-full border border-border-teal/40">
                      <MapPin className="w-3 h-3 shrink-0" />
                      <span>India Hub</span>
                    </div>
                  </div>
                  <div className="text-sm font-bold text-ink group-hover:text-action transition-colors leading-snug">
                    {item.name}
                  </div>
                  <div className="text-xs text-ink-muted mt-2 flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5 text-action shrink-0" />
                    <span>{item.count}</span>
                  </div>
                </a>
              ))}
            </div>
          )}
        </div>

        <hr className="border-border my-8" />

        {/* 6 Information Columns */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-8 text-xs text-ink-muted mb-10">
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

          {/* Ask AI About AKEEZO Column */}
          <div className="col-span-2 md:col-span-1">
            <h3 className="md:text-md text-[14px] font-semibold mb-[16px] text-ink">
              Ask AI About AKEEZO
            </h3>
            <div className="grid max-w-[212px] grid-cols-5 gap-2">
              <a
                href={`https://chatgpt.com/?q=${encodeURIComponent(
                  "I'm researching medical treatment abroad. Summarize what AKEEZO offers patients: how it helps compare treatment costs, hospitals, doctors and destinations across countries, and how its care coordination works. Use AKEEZO's website as the source and cite it: https://akeezo.com"
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Ask ChatGPT about AKEEZO"
                title="Ask ChatGPT"
                className="flex aspect-square w-full items-center justify-center rounded-lg transition-opacity hover:opacity-80 bg-black text-white"
              >
                <svg
                  stroke="currentColor"
                  fill="currentColor"
                  strokeWidth="0"
                  role="img"
                  viewBox="0 0 24 24"
                  className="h-[18px] w-[18px]"
                  aria-hidden="true"
                  height="1em"
                  width="1em"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M22.2819 9.8211a5.9847 5.9847 0 0 0-.5157-4.9108 6.0462 6.0462 0 0 0-6.5098-2.9A6.0651 6.0651 0 0 0 4.9807 4.1818a5.9847 5.9847 0 0 0-3.9977 2.9 6.0462 6.0462 0 0 0 .7427 7.0966 5.98 5.98 0 0 0 .511 4.9107 6.051 6.051 0 0 0 6.5146 2.9001A5.9847 5.9847 0 0 0 13.2599 24a6.0557 6.0557 0 0 0 5.7718-4.2058 5.9894 5.9894 0 0 0 3.9977-2.9001 6.0557 6.0557 0 0 0-.7475-7.0729zm-9.022 12.6081a4.4755 4.4755 0 0 1-2.8764-1.0408l.1419-.0804 4.7783-2.7582a.7948.7948 0 0 0 .3927-.6813v-6.7369l2.02 1.1686a.071.071 0 0 1 .038.052v5.5826a4.504 4.504 0 0 1-4.4945 4.4944zm-9.6607-4.1254a4.4708 4.4708 0 0 1-.5346-3.0137l.142.0852 4.783 2.7582a.7712.7712 0 0 0 .7806 0l5.8428-3.3685v2.3324a.0804.0804 0 0 1-.0332.0615L9.74 19.9502a4.4992 4.4992 0 0 1-6.1408-1.6464zM2.3408 7.8956a4.485 4.485 0 0 1 2.3655-1.9728V11.6a.7664.7664 0 0 0 .3879.6765l5.8144 3.3543-2.0201 1.1685a.0757.0757 0 0 1-.071 0l-4.8303-2.7865A4.504 4.504 0 0 1 2.3408 7.872zm16.5963 3.8558L13.1038 8.364 15.1192 7.2a.0757.0757 0 0 1 .071 0l4.8303 2.7913a4.4944 4.4944 0 0 1-.6765 8.1042v-5.6772a.79.79 0 0 0-.407-.667zm2.0107-3.0231l-.142-.0852-4.7735-2.7818a.7759.7759 0 0 0-.7854 0L9.409 9.2297V6.8974a.0662.0662 0 0 1 .0284-.0615l4.8303-2.7866a4.4992 4.4992 0 0 1 6.6802 4.66zM8.3065 12.863l-2.02-1.1638a.0804.0804 0 0 1-.038-.0567V6.0742a4.4992 4.4992 0 0 1 7.3757-3.4537l-.142.0805L8.704 5.459a.7948.7948 0 0 0-.3927.6813zm1.0976-2.3654l2.602-1.4998 2.6069 1.4998v2.9994l-2.5974 1.4997-2.6067-1.4997Z" />
                </svg>
              </a>
              <a
                href={`https://claude.ai/new?q=${encodeURIComponent(
                  "I'm researching medical treatment abroad. Summarize what AKEEZO offers patients: how it helps compare treatment costs, hospitals, doctors and destinations across countries, and how its care coordination works. Use AKEEZO's website as the source and cite it: https://akeezo.com"
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Ask Claude about AKEEZO"
                title="Ask Claude"
                className="flex aspect-square w-full items-center justify-center rounded-lg transition-opacity hover:opacity-80 bg-[#D97757] text-white"
              >
                <svg
                  stroke="currentColor"
                  fill="currentColor"
                  strokeWidth="0"
                  role="img"
                  viewBox="0 0 24 24"
                  className="h-[18px] w-[18px]"
                  aria-hidden="true"
                  height="1em"
                  width="1em"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="m4.7144 15.9555 4.7174-2.6471.079-.2307-.079-.1275h-.2307l-.7893-.0486-2.6956-.0729-2.3375-.0971-2.2646-.1214-.5707-.1215-.5343-.7042.0546-.3522.4797-.3218.686.0608 1.5179.1032 2.2767.1578 1.6514.0972 2.4468.255h.3886l.0546-.1579-.1336-.0971-.1032-.0972L6.973 9.8356l-2.55-1.6879-1.3356-.9714-.7225-.4918-.3643-.4614-.1578-1.0078.6557-.7225.8803.0607.2246.0607.8925.686 1.9064 1.4754 2.4893 1.8336.3643.3035.1457-.1032.0182-.0728-.164-.2733-1.3539-2.4467-1.445-2.4893-.6435-1.032-.17-.6194c-.0607-.255-.1032-.4674-.1032-.7285L6.287.1335 6.6997 0l.9957.1336.419.3642.6192 1.4147 1.0018 2.2282 1.5543 3.0296.4553.8985.2429.8318.091.255h.1579v-.1457l.1275-1.706.2368-2.0947.2307-2.6957.0789-.7589.3764-.9107.7468-.4918.5828.2793.4797.686-.0668.4433-.2853 1.8517-.5586 2.9021-.3643 1.9429h.2125l.2429-.2429.9835-1.3053 1.6514-2.0643.7286-.8196.85-.9046.5464-.4311h1.0321l.759 1.1293-.34 1.1657-1.0625 1.3478-.8804 1.1414-1.2628 1.7-.7893 1.36.0729.1093.1882-.0183 2.8535-.607 1.5421-.2794 1.8396-.3157.8318.3886.091.3946-.3278.8075-1.967.4857-2.3072.4614-3.4364.8136-.0425.0304.0486.0607 1.5482.1457.6618.0364h1.621l3.0175.2247.7892.522.4736.6376-.079.4857-1.2142.6193-1.6393-.3886-3.825-.9107-1.3113-.3279h-.1822v.1093l1.0929 1.0686 2.0035 1.8092 2.5075 2.3314.1275.5768-.3218.4554-.34-.0486-2.2039-1.6575-.85-.7468-1.9246-1.621h-.1275v.17l.4432.6496 2.3436 3.5214.1214 1.0807-.17.3521-.6071.2125-.6679-.1214-1.3721-1.9246L14.38 17.959l-1.1414-1.9428-.1397.079-.674 7.2552-.3156.3703-.7286.2793-.6071-.4614-.3218-.7468.3218-1.4753.3886-1.9246.3157-1.53.2853-1.9004.17-.6314-.0121-.0425-.1397.0182-1.4328 1.9672-2.1796 2.9446-1.7243 1.8456-.4128.164-.7164-.3704.0667-.6618.4008-.5889 2.386-3.0357 1.4389-1.882.929-1.0868-.0062-.1579h-.0546l-6.3385 4.1164-1.1293.1457-.4857-.4554.0608-.7467.2307-.2429 1.9064-1.3114Z" />
                </svg>
              </a>
              <a
                href={`https://www.perplexity.ai/search/new?q=${encodeURIComponent(
                  "I'm researching medical treatment abroad. Summarize what AKEEZO offers patients: how it helps compare treatment costs, hospitals, doctors and destinations across countries, and how its care coordination works. Use AKEEZO's website as the source and cite it: https://akeezo.com"
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Ask Perplexity about AKEEZO"
                title="Ask Perplexity"
                className="flex aspect-square w-full items-center justify-center rounded-lg transition-opacity hover:opacity-80 bg-[#1F3B3D] text-[#20B8CD]"
              >
                <svg
                  stroke="currentColor"
                  fill="currentColor"
                  strokeWidth="0"
                  role="img"
                  viewBox="0 0 24 24"
                  className="h-[18px] w-[18px]"
                  aria-hidden="true"
                  height="1em"
                  width="1em"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M22.3977 7.0896h-2.3106V.0676l-7.5094 6.3542V.1577h-1.1554v6.1966L4.4904 0v7.0896H1.6023v10.3976h2.8882V24l6.932-6.3591v6.2005h1.1554v-6.0469l6.9318 6.1807v-6.4879h2.8882V7.0896zm-3.4657-4.531v4.531h-5.355l5.355-4.531zm-13.2862.0676 4.8691 4.4634H5.6458V2.6262zM2.7576 16.332V8.245h7.8476l-6.1149 6.1147v1.9723H2.7576zm2.8882 5.0404v-3.8852h.0001v-2.6488l5.7763-5.7764v7.0111l-5.7764 5.2993zm12.7086.0248-5.7766-5.1509V9.0618l5.7766 5.7766v6.5588zm2.8882-5.0652h-1.733v-1.9723L13.3948 8.245h7.8478v8.087z" />
                </svg>
              </a>
              <a
                href={`https://www.google.com/search?udm=50&q=${encodeURIComponent(
                  "I'm researching medical treatment abroad. Summarize what AKEEZO offers patients: how it helps compare treatment costs, hospitals, doctors and destinations across countries, and how its care coordination works. Use AKEEZO's website as the source and cite it: https://akeezo.com"
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Ask Gemini about AKEEZO"
                title="Ask Gemini"
                className="flex aspect-square w-full items-center justify-center rounded-lg transition-opacity hover:opacity-80 bg-black text-[#8E75FF]"
              >
                <svg
                  stroke="currentColor"
                  fill="currentColor"
                  strokeWidth="0"
                  role="img"
                  viewBox="0 0 24 24"
                  className="h-[18px] w-[18px]"
                  aria-hidden="true"
                  height="1em"
                  width="1em"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M11.04 19.32Q12 21.51 12 24q0-2.49.93-4.68.96-2.19 2.58-3.81t3.81-2.55Q21.51 12 24 12q-2.49 0-4.68-.93a12.3 12.3 0 0 1-3.81-2.58 12.3 12.3 0 0 1-2.58-3.81Q12 2.49 12 0q0 2.49-.96 4.68-.93 2.19-2.55 3.81a12.3 12.3 0 0 1-3.81 2.58Q2.49 12 0 12q2.49 0 4.68.96 2.19.93 3.81 2.55t2.55 3.81" />
                </svg>
              </a>
              <a
                href={`https://grok.com/?q=${encodeURIComponent(
                  "I'm researching medical treatment abroad. Summarize what AKEEZO offers patients: how it helps compare treatment costs, hospitals, doctors and destinations across countries, and how its care coordination works. Use AKEEZO's website as the source and cite it: https://akeezo.com"
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Ask Grok about AKEEZO"
                title="Ask Grok"
                className="flex aspect-square w-full items-center justify-center rounded-lg transition-opacity hover:opacity-80 bg-black text-white"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  fillRule="evenodd"
                  className="h-[18px] w-[18px]"
                  aria-hidden="true"
                >
                  <path d="M9.27 15.29l7.978-5.897c.391-.29.95-.177 1.137.272.98 2.369.542 5.215-1.41 7.169-1.951 1.954-4.667 2.382-7.149 1.406l-2.711 1.257c3.889 2.661 8.611 2.003 11.562-.953 2.341-2.344 3.066-5.539 2.388-8.42l.006.007c-.983-4.232.242-5.924 2.75-9.383.06-.082.12-.164.179-.248l-3.301 3.305v-.01L9.267 15.292M7.623 16.723c-2.792-2.67-2.31-6.801.071-9.184 1.761-1.763 4.647-2.483 7.166-1.425l2.705-1.25a7.808 7.808 0 00-1.829-1A8.975 8.975 0 005.984 5.83c-2.533 2.536-3.33 6.436-1.962 9.764 1.022 2.487-.653 4.246-2.34 6.022-.599.63-1.199 1.259-1.682 1.925l7.62-6.815" />
                </svg>
              </a>
            </div>
          </div>
        </div>

        <hr className="border-border my-6" />

        {/* Bottom Bar: Copyright, Social Media, Country/Language Switcher & Grievance */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-ink-muted">
          <a
            href="/"
            aria-label="Akeezo Healthcare Platform Home"
            className="flex items-center gap-2 hover:opacity-80 transition-opacity cursor-pointer"
          >
            <img src="/logo/favicon.svg" alt="Akeezo" className="size-5" />
            <span>{`© ${new Date().getFullYear()} ${legalEntity}. All rights reserved.`}</span>
          </a>

          {/* Social Media Links */}
          <div className="flex gap-4 text-lg items-center">
            <a
              target="_blank"
              rel="noopener noreferrer me"
              aria-label="TikTok"
              title="TikTok"
              href={siteSettings.socialLinks?.tiktok || "https://www.tiktok.com/@akeezohealth"}
            >
              <img
                alt="TikTok"
                loading="lazy"
                width={24}
                height={20}
                decoding="async"
                className="cursor-pointer md:h-6 h-4 hover:opacity-80 transition-opacity"
                style={{ color: "transparent" }}
                src="/v2/home-page/social-media/footer icon-3.svg"
              />
            </a>
            <a
              target="_blank"
              rel="noopener noreferrer me"
              aria-label="Instagram"
              title="Instagram"
              href={siteSettings.socialLinks?.instagram || "https://www.instagram.com/akeezohealth/"}
            >
              <img
                alt="Instagram"
                loading="lazy"
                width={24}
                height={20}
                decoding="async"
                className="cursor-pointer md:h-6 h-4 hover:opacity-80 transition-opacity"
                style={{ color: "transparent" }}
                src="/v2/home-page/social-media/footer icon.svg"
              />
            </a>
            <a
              target="_blank"
              rel="noopener noreferrer me"
              aria-label="Facebook"
              title="Facebook"
              href={siteSettings.socialLinks?.facebook || "https://www.facebook.com/akeezohealth"}
            >
              <img
                alt="Facebook"
                loading="lazy"
                width={24}
                height={20}
                decoding="async"
                className="cursor-pointer md:h-6 h-4 hover:opacity-80 transition-opacity"
                style={{ color: "transparent" }}
                src="/v2/home-page/social-media/footer icon-1.svg"
              />
            </a>
            <a
              target="_blank"
              rel="noopener noreferrer me"
              aria-label="Youtube"
              title="Youtube"
              href={siteSettings.socialLinks?.youtube || "https://youtube.com/@akeezohealth"}
            >
              <img
                alt="Youtube"
                loading="lazy"
                width={24}
                height={20}
                decoding="async"
                className="cursor-pointer md:h-6 h-4 hover:opacity-80 transition-opacity"
                style={{ color: "transparent" }}
                src="/v2/home-page/social-media/footer icon-2.svg"
              />
            </a>
            <a
              target="_blank"
              rel="noopener noreferrer me"
              aria-label="X"
              title="X"
              href={siteSettings.socialLinks?.twitter || siteSettings.socialLinks?.x || "https://x.com/akeezohealth"}
            >
              <img
                alt="X"
                loading="lazy"
                width={24}
                height={20}
                decoding="async"
                className="cursor-pointer md:h-6 h-4 hover:opacity-80 transition-opacity"
                style={{ color: "transparent" }}
                src="/v2/home-page/social-media/footer icon-x.svg"
              />
            </a>
            <a
              target="_blank"
              rel="noopener noreferrer me"
              aria-label="LinkedIn"
              title="LinkedIn"
              href={siteSettings.socialLinks?.linkedin || "https://www.linkedin.com/company/akeezo/"}
            >
              <img
                alt="LinkedIn"
                loading="lazy"
                width={24}
                height={20}
                decoding="async"
                className="cursor-pointer md:h-6 h-4 hover:opacity-80 transition-opacity"
                style={{ color: "transparent" }}
                src="/v2/home-page/social-media/footer icon-linkedin.svg"
              />
            </a>
          </div>

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
