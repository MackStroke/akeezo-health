import React, { useState, useMemo, useRef } from "react";
import type { PublicRouteResponseDTO } from "@akeezo/contracts";
import {
  Search,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Shield,
  Sparkles,
  CheckCircle2,
  X,
  Clock,
  DollarSign,
  Award,
  ArrowLeft,
  Activity,
  HeartPulse
} from "lucide-react";
import { SiteHeader } from "../components/SiteHeader.js";
import { SiteFooter } from "../components/SiteFooter.js";
import {
  ALL_TREATMENTS,
  TOP_TREATMENTS,
  getTreatmentBySlug,
  type TreatmentItem
} from "../data/treatmentsData.js";

export interface TreatmentsTemplateProps {
  data: PublicRouteResponseDTO;
}

export const TreatmentsTemplate: React.FC<TreatmentsTemplateProps> = ({ data }) => {
  const { siteSettings } = data;

  // Detect whether we are on a detail page (/treatments/:slug) or directory (/treatments)
  const currentPath = data.path || (typeof window !== "undefined" ? window.location.pathname : "/treatments");
  const pathSlug = currentPath.startsWith("/treatments/")
    ? currentPath.replace(/^\/treatments\/?/, "").split("/")[0]
    : "";

  const selectedDetailTreatment = useMemo(() => {
    return pathSlug ? getTreatmentBySlug(pathSlug) : undefined;
  }, [pathSlug]);

  const isDetailPage = Boolean(selectedDetailTreatment);

  // Search State for directory
  const [searchQuery, setSearchQuery] = useState("");

  // Header & Consultation Modals
  const [isCalculatorOpen, setIsCalculatorOpen] = useState(false);
  const [isExploreOpen, setIsExploreOpen] = useState(false);
  const [isConsultModalOpen, setIsConsultModalOpen] = useState(false);
  const [consultProcedure, setConsultProcedure] = useState(
    selectedDetailTreatment?.title || "Cosmetic/Plastic Surgery"
  );
  const [consultName, setConsultName] = useState("");
  const [consultContact, setConsultContact] = useState("");
  const [consultNotes, setConsultNotes] = useState("");
  const [consultSuccess, setConsultSuccess] = useState(false);
  const [consultError, setConsultError] = useState("");

  // Top Treatments Horizontal Carousel Scroll State
  const carouselRef = useRef<HTMLDivElement>(null);
  const [activeDot, setActiveDot] = useState(0);

  const scrollCarousel = (direction: "left" | "right") => {
    if (carouselRef.current) {
      const scrollAmount = 228 * 2; // card width (212px) + gap (16px)
      carouselRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth"
      });
      setActiveDot((prev) => (direction === "left" ? Math.max(0, prev - 1) : Math.min(1, prev + 1)));
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const el = document.getElementById("all-treatments-section");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Filtered treatments based on search query
  const filteredTreatments = useMemo(() => {
    if (!searchQuery.trim()) {
      return ALL_TREATMENTS;
    }
    const q = searchQuery.toLowerCase().trim();
    return ALL_TREATMENTS.filter((item) => {
      return (
        item.title.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q) ||
        (item.procedures && item.procedures.some((p) => p.toLowerCase().includes(q)))
      );
    });
  }, [searchQuery]);

  // Split into first 20 items (Batch 1) and remaining items (Batch 2) to place the Mid-Page CTA banner
  const firstBatch = useMemo(() => {
    return filteredTreatments.slice(0, 20);
  }, [filteredTreatments]);

  const secondBatch = useMemo(() => {
    return filteredTreatments.slice(20);
  }, [filteredTreatments]);

  const handleConsultSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!consultName.trim()) {
      setConsultError("Please enter your full name.");
      return;
    }
    if (!consultContact.trim() || consultContact.trim().length < 5) {
      setConsultError("Please enter a valid phone number or email address.");
      return;
    }
    setConsultError("");
    setConsultSuccess(true);
  };

  // Render a standard treatment card matching audited reference composition
  const renderCard = (treatment: TreatmentItem) => {
    return (
      <div
        key={treatment.id}
        className="relative group cursor-pointer md:shadow-[0_0px_13px_rgba(0,0,0,0.06)] md:border-0 shadow-md md:ml-0 ml-0.5 rounded-2xl md:mr-0 md:my-1 md:mb-1.5 mb-2 transition-all duration-200"
      >
        <div className="rounded-2xl z-[10] group hover:bg-[#E6F8F6] transition-colors duration-200 bg-white shrink-0 md:h-[253px] h-[269px] flex flex-col md:space-y-[6px] space-y-[10px] md:p-3 p-[11px] md:pb-2 border border-gray-100">
          <div className="rounded-lg overflow-hidden w-full h-[131px] shrink-0 mb-1 bg-gray-50">
            <img
              draggable={false}
              alt={treatment.title}
              loading="lazy"
              width={300}
              height={240}
              decoding="async"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              src={treatment.image}
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src = treatment.fallbackImage;
              }}
            />
          </div>
          <div className="flex-1 min-w-0 transition-all duration-200 md:space-y-[6px] space-y-[10px]">
            <h3 className="text-[16px] whitespace-nowrap truncate font-medium text-gray-900">
              {treatment.title}
            </h3>
            <p className="text-sm leading-tight opacity-60 line-clamp-2 [overflow-wrap:anywhere] text-gray-600">
              {treatment.description}
            </p>
          </div>
          <div>
            <a
              className="group/btn inline-flex items-center gap-1 whitespace-nowrap transition-all duration-150 text-[12px] md:text-xs md:font-medium text-black hover:text-[#007A6C]"
              aria-label={`Learn more about ${treatment.title}, Learn More`}
              href={treatment.href}
            >
              <span>Learn More</span>
              <svg
                aria-hidden="true"
                className="fill-current transition-all duration-150 w-2 h-2 text-gray-700 group-hover/btn:text-[#007A6C] group-hover/btn:translate-x-0.5"
                width="10"
                height="18"
                viewBox="0 0 10 18"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M0.970753 0.0175653C1.12634 0.0506155 1.2704 0.128803 1.38384 0.243151L8.65532 7.58007C8.74258 7.66784 8.81825 7.76569 8.88384 7.8701C8.90217 7.89899 8.92017 7.92798 8.93657 7.95799C8.94215 7.96822 8.94683 7.9789 8.9522 7.98924C8.96741 8.0186 8.98278 8.04782 8.99614 8.07811C9.001 8.089 9.00715 8.09934 9.01177 8.11034C9.01912 8.12785 9.02456 8.14633 9.0313 8.16405C9.03587 8.1763 9.03972 8.18879 9.04399 8.20116C9.10475 8.37299 9.13892 8.55288 9.14067 8.73436C9.14092 8.86602 9.12518 8.99677 9.09478 9.12401L9.0938 9.13085C9.07396 9.21527 9.04698 9.29823 9.01372 9.37792L9.00884 9.39257C8.97332 9.47688 8.93118 9.5581 8.88189 9.63475C8.85228 9.67727 8.81919 9.72217 8.78521 9.76464C8.75402 9.8045 8.72109 9.84292 8.6856 9.87889L8.67681 9.88768C8.65668 9.90804 8.6345 9.92614 8.61333 9.9453L1.41899 17.2295C1.30045 17.349 1.15064 17.4318 0.988331 17.4668C0.825885 17.5018 0.657646 17.4881 0.505909 17.4267C0.354215 17.3653 0.224893 17.2592 0.134815 17.1221C0.0447586 16.9849 -0.00173331 16.8221 4.94045e-05 16.6553L0.0264166 14.7373C0.0292721 14.5302 0.0723666 14.3244 0.15337 14.1318C0.234464 13.9392 0.352105 13.763 0.499073 13.6142L5.30962 8.74315L0.545948 3.93749C0.392813 3.78303 0.270926 3.59989 0.186573 3.3994C0.102243 3.19894 0.0574297 2.98442 0.0547369 2.76854L0.02544 0.798815C0.0233707 0.638956 0.0682529 0.483423 0.154346 0.35155C0.240462 0.219673 0.363529 0.117093 0.508838 0.0576043C0.654209 -0.00184612 0.815127 -0.0154387 0.970753 0.0175653Z"
                />
              </svg>
            </a>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#FDFDFC] font-sans text-[#262626] antialiased overflow-x-clip">
      {/* SECTION 0: STRUCTURED DATA */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            name: isDetailPage && selectedDetailTreatment
              ? `${selectedDetailTreatment.title} Worldwide | Find Best Treatment Options | AKEEZO`
              : "Medical Treatments Worldwide | Find Best Treatment Options | AKEEZO",
            description: isDetailPage && selectedDetailTreatment
              ? `${selectedDetailTreatment.description.slice(0, 160)}...`
              : "Discover comprehensive medical treatments worldwide. Compare prices, read reviews, and find the best healthcare options for your needs.",
            url: isDetailPage && selectedDetailTreatment
              ? `https://akeezo.com${selectedDetailTreatment.href}`
              : "https://akeezo.com/treatments"
          })
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              {
                "@type": "ListItem",
                position: 1,
                name: "Home",
                item: "https://akeezo.com/"
              },
              {
                "@type": "ListItem",
                position: 2,
                name: "Treatments",
                item: "https://akeezo.com/treatments"
              },
              ...(isDetailPage && selectedDetailTreatment
                ? [
                    {
                      "@type": "ListItem",
                      position: 3,
                      name: selectedDetailTreatment.title,
                      item: `https://akeezo.com${selectedDetailTreatment.href}`
                    }
                  ]
                : [])
            ]
          })
        }}
      />

      {/* Global Header */}
      <SiteHeader
        siteSettings={siteSettings}
        activePath={data.path}
        isCalculatorOpen={isCalculatorOpen}
        onCalculatorOpenChange={setIsCalculatorOpen}
        isExploreOpen={isExploreOpen}
        onExploreOpenChange={setIsExploreOpen}
      />

      <main className="flex-1 min-h-0">
        {isDetailPage && selectedDetailTreatment ? (
          /* =========================================================================
             DETAIL VIEW: Individual Specialty & Treatment Deep Dive (/treatments/:slug)
             ========================================================================= */
          <div className="min-h-screen space-y-6 md:space-y-10 py-6 md:py-10 max-w-[1324px] mx-auto px-4 md:px-10">
            {/* Breadcrumb Navigation */}
            <div className="flex items-center gap-2 text-xs md:text-sm text-gray-500 font-medium">
              <a href="/" className="hover:text-[#007A6C] transition-colors">Home</a>
              <span>/</span>
              <a href="/treatments" className="hover:text-[#007A6C] transition-colors">Treatments</a>
              <span>/</span>
              <span className="text-gray-900 font-semibold">{selectedDetailTreatment.title}</span>
            </div>

            {/* Back Button */}
            <div>
              <a
                href="/treatments"
                className="inline-flex items-center gap-2 text-xs font-semibold text-gray-600 hover:text-[#007A6C] transition-colors cursor-pointer py-1"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to All Treatments</span>
              </a>
            </div>

            {/* Treatment Hero Banner */}
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#061E1B] via-[#0A2E2A] to-[#007A6C] text-white p-6 md:p-12 shadow-xl">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 relative z-10">
                <div className="space-y-4 max-w-2xl">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-white/90 text-xs font-semibold border border-white/20">
                    <Sparkles className="w-3.5 h-3.5 text-[#00C7BE]" />
                    <span>{selectedDetailTreatment.category}</span>
                  </div>
                  <h1 className="text-3xl md:text-5xl font-bold tracking-tight">
                    {selectedDetailTreatment.title} Abroad
                  </h1>
                  <p className="text-sm md:text-base text-gray-200 leading-relaxed max-w-xl">
                    World-class clinical expertise at internationally accredited JCI and NABH hospitals.
                    Save up to 70% with direct hospital rates and zero service commissions.
                  </p>
                  <div className="pt-2 flex flex-wrap items-center gap-4">
                    <button
                      type="button"
                      onClick={() => {
                        setConsultProcedure(selectedDetailTreatment.title);
                        setIsConsultModalOpen(true);
                      }}
                      className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#00C7BE] text-[#061E1B] font-bold text-sm hover:bg-[#00b0a8] transition-all shadow-md cursor-pointer"
                    >
                      <span>Get Free Treatment Plan</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                    <a
                      href="#pricing-comparison"
                      className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white/10 hover:bg-white/20 text-white font-semibold text-sm transition-all border border-white/20"
                    >
                      <span>View Cost Comparison</span>
                    </a>
                  </div>
                </div>

                <div className="lg:w-[380px] shrink-0">
                  <div className="rounded-2xl overflow-hidden shadow-2xl border-4 border-white/10 aspect-video lg:aspect-4/3 bg-gray-900">
                    <img
                      src={selectedDetailTreatment.image}
                      alt={selectedDetailTreatment.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src = selectedDetailTreatment.fallbackImage;
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Three Value Pillars */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8 pt-8 border-t border-white/15 text-xs md:text-sm">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#00C7BE]/20 flex items-center justify-center shrink-0">
                    <Award className="w-4 h-4 text-[#00C7BE]" />
                  </div>
                  <div>
                    <strong className="block font-semibold">JCI & NABH Accredited</strong>
                    <span className="text-white/70">Top-tier verified hospitals</span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#00C7BE]/20 flex items-center justify-center shrink-0">
                    <DollarSign className="w-4 h-4 text-[#00C7BE]" />
                  </div>
                  <div>
                    <strong className="block font-semibold">Direct Hospital Rates</strong>
                    <span className="text-white/70">Zero middleman markup</span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#00C7BE]/20 flex items-center justify-center shrink-0">
                    <Shield className="w-4 h-4 text-[#00C7BE]" />
                  </div>
                  <div>
                    <strong className="block font-semibold">100% Free Discovery</strong>
                    <span className="text-white/70">Personal clinical coordinators</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Clinical Overview & Details */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pt-4">
              <div className="lg:col-span-2 space-y-8">
                {/* Clinical Description Section */}
                <div className="bg-white rounded-3xl p-6 md:p-8 border border-gray-100 shadow-xs space-y-4">
                  <div className="flex items-center gap-2.5 text-[#007A6C]">
                    <Activity className="w-5 h-5" />
                    <h2 className="text-xl md:text-2xl font-bold text-gray-900">
                      About {selectedDetailTreatment.title}
                    </h2>
                  </div>
                  <div className="text-sm md:text-base leading-relaxed text-gray-700 whitespace-pre-line space-y-4">
                    {selectedDetailTreatment.description}
                  </div>
                </div>

                {/* Sub-procedures Covered */}
                {selectedDetailTreatment.procedures && selectedDetailTreatment.procedures.length > 0 && (
                  <div className="bg-white rounded-3xl p-6 md:p-8 border border-gray-100 shadow-xs space-y-4">
                    <h2 className="text-xl md:text-2xl font-bold text-gray-900 flex items-center gap-2">
                      <HeartPulse className="w-5 h-5 text-[#007A6C]" />
                      <span>Key Procedures & Treatments Covered</span>
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                      {selectedDetailTreatment.procedures.map((proc, idx) => (
                        <div
                          key={idx}
                          className="flex items-start gap-3 p-3.5 rounded-2xl bg-gray-50 border border-gray-100/80 hover:bg-[#E6F8F6] transition-colors"
                        >
                          <CheckCircle2 className="w-4 h-4 text-[#007A6C] shrink-0 mt-0.5" />
                          <span className="text-xs md:text-sm font-semibold text-gray-800">{proc}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Pricing Comparison Table */}
                <div id="pricing-comparison" className="bg-white rounded-3xl p-6 md:p-8 border border-gray-100 shadow-xs space-y-4">
                  <h2 className="text-xl md:text-2xl font-bold text-gray-900 flex items-center gap-2">
                    <DollarSign className="w-5 h-5 text-[#007A6C]" />
                    <span>Estimated Cost Comparison</span>
                  </h2>
                  <p className="text-xs md:text-sm text-gray-500">
                    Indicative procedure pricing at leading international hospitals vs Western countries (US/UK/Canada).
                  </p>
                  <div className="overflow-x-auto pt-2">
                    <table className="w-full text-left text-xs md:text-sm border-collapse">
                      <thead>
                        <tr className="border-b border-gray-200 text-gray-500 font-semibold bg-gray-50/50">
                          <th className="py-3 px-4">Cost Factor</th>
                          <th className="py-3 px-4 text-[#007A6C]">International Hospital (Abroad)</th>
                          <th className="py-3 px-4 text-gray-600">Western Market (US / UK)</th>
                          <th className="py-3 px-4 text-emerald-600">Typical Patient Savings</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        <tr>
                          <td className="py-3.5 px-4 font-semibold text-gray-800">Average Treatment Package</td>
                          <td className="py-3.5 px-4 font-bold text-[#007A6C]">
                            {selectedDetailTreatment.avgCostAbroad || "$2,500 - $6,500"}
                          </td>
                          <td className="py-3.5 px-4 text-gray-500 line-through">
                            {selectedDetailTreatment.avgCostHome || "$15,000 - $35,000"}
                          </td>
                          <td className="py-3.5 px-4 font-bold text-emerald-600">65% – 80%</td>
                        </tr>
                        <tr>
                          <td className="py-3.5 px-4 font-semibold text-gray-800">Estimated In-Country Recovery</td>
                          <td className="py-3.5 px-4 text-gray-700" colSpan={3}>
                            <div className="inline-flex items-center gap-1.5 font-medium text-gray-900">
                              <Clock className="w-4 h-4 text-[#007A6C]" />
                              <span>{selectedDetailTreatment.recoveryTime || "7 - 14 days"}</span>
                            </div>
                          </td>
                        </tr>
                        <tr>
                          <td className="py-3.5 px-4 font-semibold text-gray-800">Care Coordination & Second Opinion</td>
                          <td className="py-3.5 px-4 text-emerald-600 font-bold">100% Free via AKEEZO</td>
                          <td className="py-3.5 px-4 text-gray-500">$500 – $1,500</td>
                          <td className="py-3.5 px-4 font-bold text-emerald-600">100% Free</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              {/* Sidebar: Free Consultation / Quote Request */}
              <div className="space-y-6">
                <div className="bg-gradient-to-br from-[#F5FBF9] to-white rounded-3xl p-6 md:p-8 border border-[#B2EBE4] shadow-md sticky top-6">
                  <div className="flex items-center gap-2 mb-2 text-[#007A6C]">
                    <Sparkles className="w-5 h-5" />
                    <span className="text-xs font-bold uppercase tracking-wider">Free Medical Inquiry</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-1">
                    Request a Customized Treatment Plan
                  </h3>
                  <p className="text-xs text-gray-500 mb-6 leading-relaxed">
                    Receive comprehensive pricing estimates and physician reviews from top accredited hospitals within 24 hours.
                  </p>

                  {consultSuccess ? (
                    <div className="py-6 text-center space-y-3 bg-white rounded-2xl p-4 border border-emerald-100">
                      <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
                      <h4 className="text-lg font-bold text-gray-900">Inquiry Received</h4>
                      <p className="text-xs text-gray-600">
                        Thank you, <strong>{consultName}</strong>! Our clinical coordinator will reach out shortly regarding{" "}
                        <strong>{selectedDetailTreatment.title}</strong>.
                      </p>
                    </div>
                  ) : (
                    <form onSubmit={handleConsultSubmit} className="space-y-4">
                      {consultError && (
                        <div className="p-2.5 rounded-xl bg-red-50 text-red-600 text-xs font-semibold border border-red-100">
                          {consultError}
                        </div>
                      )}
                      <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1">
                          Full Name
                        </label>
                        <input
                          type="text"
                          required
                          value={consultName}
                          onChange={(e) => setConsultName(e.target.value)}
                          placeholder="e.g. John Doe"
                          className="w-full rounded-xl border border-gray-200 bg-white p-3 text-xs text-gray-900 placeholder:text-gray-400 focus:border-[#007A6C] focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1">
                          WhatsApp / Phone / Email
                        </label>
                        <input
                          type="text"
                          required
                          value={consultContact}
                          onChange={(e) => setConsultContact(e.target.value)}
                          placeholder="+91 98765 43210 or name@domain.com"
                          className="w-full rounded-xl border border-gray-200 bg-white p-3 text-xs text-gray-900 placeholder:text-gray-400 focus:border-[#007A6C] focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1">
                          Medical Notes / Inquiries (Optional)
                        </label>
                        <textarea
                          rows={3}
                          value={consultNotes}
                          onChange={(e) => setConsultNotes(e.target.value)}
                          placeholder="Briefly describe your symptoms or specific procedure requirements..."
                          className="w-full rounded-xl border border-gray-200 bg-white p-3 text-xs text-gray-900 placeholder:text-gray-400 focus:border-[#007A6C] focus:outline-none"
                        />
                      </div>

                      <div className="p-3 bg-teal-50/70 rounded-xl border border-teal-100/60 flex items-center gap-2.5 text-[11px] text-[#007A6C]">
                        <Shield className="w-4 h-4 shrink-0" />
                        <span>100% Free · Zero Middleman Fees · Strict DPDP Privacy</span>
                      </div>

                      <button
                        type="submit"
                        className="w-full py-3.5 rounded-full bg-[#007A6C] hover:bg-[#005f54] text-white text-xs font-bold transition-all shadow-md cursor-pointer"
                      >
                        Submit Consultation Request
                      </button>
                    </form>
                  )}
                </div>
              </div>
            </div>

            {/* Related Treatments Slider / Recommendations */}
            <div className="pt-10 border-t border-gray-100">
              <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-6">
                Explore More Treatments on AKEEZO
              </h3>
              <div className="grid gap-4 md:gap-4 md:gap-y-6 lg:grid-cols-5 md:grid-cols-4 sm:grid-cols-3">
                {ALL_TREATMENTS.filter((t) => t.id !== selectedDetailTreatment.id)
                  .slice(0, 5)
                  .map((t) => renderCard(t))}
              </div>
            </div>
          </div>
        ) : (
          /* =========================================================================
             DIRECTORY VIEW: Audited Reference Composition from curemeabroad.com/treatments
             ========================================================================= */
          <div className="min-h-screen space-y-5 md:space-y-10 overflow-x-clip">
            <div className="max-w-[1324px] mx-auto">
              <div className="md:pt-6 pt-4 space-y-12 md:space-y-16">

                {/* -------------------------------------------------------------
                    SECTION 1: HERO BANNER & FLOATING PILL SEARCH BAR
                    ------------------------------------------------------------- */}
                <div className="md:px-10 px-4 space-y-12 md:space-y-16">
                  <div className="w-full relative z-10">
                    <div className="relative md:h-[450px] h-[400px] rounded-3xl flex md:items-center items-end justify-center text-white">
                      {/* Background Hero Banner Image with Gradient */}
                      <div className="absolute inset-0 rounded-3xl overflow-hidden">
                        <div className="absolute inset-0 z-10 bg-gradient-to-b from-transparent via-black/20 to-black/80" />
                        <img
                          draggable={false}
                          alt="Find The Best Treatments Worldwide"
                          fetchPriority="high"
                          width={1200}
                          height={600}
                          decoding="async"
                          className="w-full h-full object-cover"
                          src="/uploads/treatments/treatments-banner.webp"
                          onError={(e) => {
                            (e.currentTarget as HTMLImageElement).src =
                              "https://d162jy5nwnavsz.cloudfront.net/static/pages/treatments/treatments-banner.webp";
                          }}
                        />
                      </div>

                      {/* Hero Title & Subtitle */}
                      <div className="absolute bottom-16 z-[30] text-center md:px-4 px-8">
                        <h1 className="md:text-4xl text-[28px] leading-tight font-semibold mb-4">
                          Find The Best Treatments Worldwide
                        </h1>
                        <p className="opacity-80 md:text-base text-[16px] font-medium max-w-4xl mx-auto">
                          World-class care, anywhere in the world.
                        </p>
                      </div>

                      {/* Desktop Floating Pill Search Bar */}
                      <div className="absolute h-[60px] z-[40] w-[75%] bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 hidden lg:block">
                        <div className="relative z-[9999999] h-[65px]">
                          <form onSubmit={handleSearchSubmit}>
                            <div className="bg-white rounded-full text-black shadow-lg flex items-center justify-between py-2 pr-2">
                              <div className="flex-1 hover:bg-white transition-all duration-500 rounded-full cursor-pointer flex flex-col lg:px-8">
                                <input
                                  className="outline-none bg-transparent placeholder:text-[16px] lg:pl-0 md:pl-6 pl-1 placeholder:opacity-55 placeholder:font-normal py-2 border-none focus:outline-none focus:ring-0 text-sm font-medium"
                                  placeholder="Search treatments"
                                  value={searchQuery}
                                  onChange={(e) => setSearchQuery(e.target.value)}
                                />
                              </div>
                              <button
                                type="submit"
                                aria-label="Search for treatments"
                                className="bg-[#007A6C] flex items-center justify-center text-white rounded-full hover:bg-[#005f54] transition-colors font-medium text-base leading-none shrink-0 px-7 py-4 cursor-pointer"
                              >
                                Search
                              </button>
                            </div>
                          </form>
                        </div>
                      </div>

                      {/* Mobile Floating Pill Search Bar */}
                      <div className="absolute z-[40] w-[90%] bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 lg:hidden">
                        <div className="bg-white h-[62px] rounded-full text-black shadow-md flex items-center justify-between px-[5px] py-[4px]">
                          <div className="flex pl-[25px] w-full items-center gap-2 overflow-hidden">
                            <input
                              type="text"
                              className="text-[14px] flex-1 text-gray-700 placeholder:text-gray-500 outline-none bg-transparent whitespace-nowrap truncate"
                              placeholder="Search treatments"
                              value={searchQuery}
                              onChange={(e) => setSearchQuery(e.target.value)}
                            />
                            <button
                              type="button"
                              aria-label="Search"
                              onClick={handleSearchSubmit}
                              className="bg-[#007A6C] p-4 flex items-center text-white rounded-full hover:bg-[#005f54] transition-colors cursor-pointer shrink-0"
                            >
                              <svg
                                width="19"
                                height="19"
                                viewBox="0 0 19 19"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <ellipse
                                  cx="8.74223"
                                  cy="8.75247"
                                  rx="7.94145"
                                  ry="7.95169"
                                  stroke="white"
                                  strokeWidth="1.6"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                                <path
                                  d="M17.8002 17.8197L14.8008 14.8164"
                                  stroke="white"
                                  strokeWidth="1.6"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                              </svg>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Reassurance Microcopy */}
                    <p className="md:mt-[55px] mt-[40px] text-center opacity-50 text-sm font-light">
                      No sales. No commissions. Just discovery so you can choose what's right for you
                    </p>
                  </div>
                </div>

                {/* -------------------------------------------------------------
                    SECTION 2: TOP TREATMENTS ON AKEEZO (HORIZONTAL SLIDER)
                    ------------------------------------------------------------- */}
                <div className="px-4 md:px-0">
                  <div className="bg-amber-100/0 md:overflow-x-clip">
                    <div>
                      <div className="md:px-10 md:pb-5 pb-4 gap-10 w-full flex items-start justify-between">
                        <div className="md:text-[32px] md:font-semibold text-[20px] leading-tight font-semibold md:w-full whitespace-pre-line md:whitespace-normal">
                          Top Treatments on AKEEZO
                        </div>
                      </div>
                    </div>

                    <div className="md:-mx-2">
                      <div className="flex relative flex-1 mb-2 md:px-12 overflow-visible items-center w-full">
                        {/* Prev Button */}
                        <button
                          type="button"
                          onClick={() => scrollCarousel("left")}
                          className="absolute w-[30px] h-[30px] md:flex items-center justify-center group hidden z-[9] rounded-full p-1 bg-gray-200 border border-gray-300 hover:bg-[#007A6C] hover:border-[#007A6C] shadow-sm hover:shadow-md transition-all duration-200 left-[10px] md:left-[9px] cursor-pointer"
                          aria-label="Previous slide"
                        >
                          <ChevronLeft className="h-4 w-4 text-gray-700 group-hover:text-white transition-colors" />
                        </button>

                        {/* Next Button */}
                        <button
                          type="button"
                          onClick={() => scrollCarousel("right")}
                          className="absolute w-[30px] h-[30px] md:flex items-center justify-center group hidden z-[9] rounded-full p-1 bg-gray-200 border border-gray-300 hover:bg-[#007A6C] hover:border-[#007A6C] shadow-sm hover:shadow-md transition-all duration-200 right-[10px] md:right-[9px] cursor-pointer"
                          aria-label="Next slide"
                        >
                          <ChevronRight className="h-4 w-4 text-gray-700 group-hover:text-white transition-colors" />
                        </button>

                        {/* Carousel Scroll Container */}
                        <div
                          ref={carouselRef}
                          className="flex overflow-x-auto no-scrollbar gap-4 py-2 px-2 scroll-smooth w-full"
                          style={{ scrollbarWidth: "none" }}
                        >
                          {TOP_TREATMENTS.map((treatment) => (
                            <div
                              key={treatment.id}
                              className="shrink-0"
                              style={{ width: "212px", marginRight: "16px" }}
                            >
                              <div className="relative group cursor-pointer md:shadow-[0_0px_13px_rgba(0,0,0,0.06)] md:border-0 shadow-md md:ml-0 ml-0.5 rounded-2xl md:mr-0 md:my-1 md:mb-1.5 mb-2 transition-all duration-200">
                                <div className="rounded-2xl z-[10] group hover:bg-[#E6F8F6] transition-colors duration-200 bg-white shrink-0 md:h-[253px] h-[269px] flex flex-col md:space-y-[6px] space-y-[10px] md:p-3 p-[11px] md:pb-2 border border-gray-100">
                                  <div className="rounded-lg overflow-hidden w-full h-[131px] shrink-0 mb-1 bg-gray-50">
                                    <img
                                      draggable={false}
                                      alt={treatment.title}
                                      loading="lazy"
                                      width={300}
                                      height={240}
                                      decoding="async"
                                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                      src={treatment.image}
                                      onError={(e) => {
                                        (e.currentTarget as HTMLImageElement).src = treatment.fallbackImage;
                                      }}
                                    />
                                  </div>
                                  <div className="flex-1 min-w-0 transition-all duration-200 md:space-y-[6px] space-y-[10px]">
                                    <h3 className="text-[16px] whitespace-nowrap truncate font-medium text-gray-900">
                                      {treatment.title}
                                    </h3>
                                    <p className="text-sm leading-tight opacity-60 line-clamp-2 [overflow-wrap:anywhere] text-gray-600">
                                      {treatment.description}
                                    </p>
                                  </div>
                                  <div>
                                    <a
                                      className="group/btn inline-flex items-center gap-1 whitespace-nowrap transition-all duration-150 text-[12px] md:text-xs md:font-medium text-black hover:text-[#007A6C]"
                                      aria-label={`Learn more about ${treatment.title}, Learn More`}
                                      href={treatment.href}
                                    >
                                      <span>Learn More</span>
                                      <svg
                                        aria-hidden="true"
                                        className="fill-current transition-all duration-150 w-2 h-2 text-gray-700 group-hover/btn:text-[#007A6C] group-hover/btn:translate-x-0.5"
                                        width="10"
                                        height="18"
                                        viewBox="0 0 10 18"
                                        xmlns="http://www.w3.org/2000/svg"
                                      >
                                        <path
                                          fillRule="evenodd"
                                          clipRule="evenodd"
                                          d="M0.970753 0.0175653C1.12634 0.0506155 1.2704 0.128803 1.38384 0.243151L8.65532 7.58007C8.74258 7.66784 8.81825 7.76569 8.88384 7.8701C8.90217 7.89899 8.92017 7.92798 8.93657 7.95799C8.94215 7.96822 8.94683 7.9789 8.9522 7.98924C8.96741 8.0186 8.98278 8.04782 8.99614 8.07811C9.001 8.089 9.00715 8.09934 9.01177 8.11034C9.01912 8.12785 9.02456 8.14633 9.0313 8.16405C9.03587 8.1763 9.03972 8.18879 9.04399 8.20116C9.10475 8.37299 9.13892 8.55288 9.14067 8.73436C9.14092 8.86602 9.12518 8.99677 9.09478 9.12401L9.0938 9.13085C9.07396 9.21527 9.04698 9.29823 9.01372 9.37792L9.00884 9.39257C8.97332 9.47688 8.93118 9.5581 8.88189 9.63475C8.85228 9.67727 8.81919 9.72217 8.78521 9.76464C8.75402 9.8045 8.72109 9.84292 8.6856 9.87889L8.67681 9.88768C8.65668 9.90804 8.6345 9.92614 8.61333 9.9453L1.41899 17.2295C1.30045 17.349 1.15064 17.4318 0.988331 17.4668C0.825885 17.5018 0.657646 17.4881 0.505909 17.4267C0.354215 17.3653 0.224893 17.2592 0.134815 17.1221C0.0447586 16.9849 -0.00173331 16.8221 4.94045e-05 16.6553L0.0264166 14.7373C0.0292721 14.5302 0.0723666 14.3244 0.15337 14.1318C0.234464 13.9392 0.352105 13.763 0.499073 13.6142L5.30962 8.74315L0.545948 3.93749C0.392813 3.78303 0.270926 3.59989 0.186573 3.3994C0.102243 3.19894 0.0574297 2.98442 0.0547369 2.76854L0.02544 0.798815C0.0233707 0.638956 0.0682529 0.483423 0.154346 0.35155C0.240462 0.219673 0.363529 0.117093 0.508838 0.0576043C0.654209 -0.00184612 0.815127 -0.0154387 0.970753 0.0175653Z"
                                        />
                                      </svg>
                                    </a>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Pagination Indicator Dots */}
                      <div className="mx-auto md:mt-0 -mt-2">
                        <div className="flex justify-center gap-1">
                          <span
                            onClick={() => {
                              if (carouselRef.current) carouselRef.current.scrollTo({ left: 0, behavior: "smooth" });
                              setActiveDot(0);
                            }}
                            className={`w-[6px] h-[6px] rounded-full transition-all duration-200 cursor-pointer ${
                              activeDot === 0 ? "bg-[#007A6C]" : "bg-gray-300"
                            }`}
                          />
                          <span
                            onClick={() => {
                              if (carouselRef.current) carouselRef.current.scrollTo({ left: 600, behavior: "smooth" });
                              setActiveDot(1);
                            }}
                            className={`w-[6px] h-[6px] rounded-full transition-all duration-200 cursor-pointer ${
                              activeDot === 1 ? "bg-[#007A6C]" : "bg-gray-300"
                            }`}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* -------------------------------------------------------------
                    SECTION 3: PROMOTIONAL FREE CONSULTATION BANNER
                    ------------------------------------------------------------- */}
                <div className="px-4 md:px-10 space-y-12 md:space-y-16">
                  <div className="group flex flex-col lg:flex-row lg:items-stretch gap-6 lg:gap-8 relative overflow-hidden bg-[#fafafa] p-6 md:p-12 rounded-3xl border border-gray-100">
                    <div className="order-1 flex flex-col items-center text-center lg:w-[42%] lg:items-start lg:justify-between lg:text-left">
                      <div className="flex flex-col items-center lg:items-start">
                        <h2 className="text-[28px] lg:text-[clamp(22px,4vw,44px)] leading-tight font-semibold text-gray-900">
                          <span className="flex flex-row items-center justify-center lg:justify-start">
                            <span className="text-[#007A6C] mr-1">AKEEZO</span>
                            <span className="font-normal">Care</span>
                          </span>
                          Is Absolutely Free
                        </h2>
                        <p className="mt-3 text-[14px] lg:text-[clamp(14px,2.5vw,17px)] text-[#4b5563] lg:max-w-[92%]">
                          Just discovery so you can choose what's right for you!
                        </p>
                        <button
                          type="button"
                          onClick={() => setIsConsultModalOpen(true)}
                          className="group/btn items-center justify-center gap-2 whitespace-nowrap rounded-full font-normal transition-colors duration-200 bg-[#007A6C] text-white hover:bg-[#005f54] h-11 px-5 text-sm mt-6 hidden lg:flex cursor-pointer shadow-sm"
                        >
                          <span>Get In Touch</span>
                          <ArrowRight className="size-4 shrink-0 transition-transform duration-200 group-hover/btn:translate-x-0.5" />
                        </button>
                      </div>
                      <p className="mt-8 hidden font-light text-black opacity-40 lg:block text-sm">
                        <span className="font-semibold opacity-100">World's Leading</span> Medical Travel & Hospital Guidance Platform
                      </p>
                    </div>

                    <div className="order-2 flex cursor-pointer justify-center lg:flex-1 lg:items-center">
                      <img
                        alt="Get a free consultation with AKEEZO"
                        loading="lazy"
                        width={1436}
                        height={1104}
                        decoding="async"
                        className="h-auto max-w-[420px] object-contain transition-transform duration-500 ease-out group-hover:scale-[1.03] lg:hidden"
                        src="/uploads/treatments/free-banner-girl.png"
                        onError={(e) => {
                          (e.currentTarget as HTMLImageElement).src =
                            "https://curemeabroad.com/v2/free-banner-girl.png";
                        }}
                      />
                      <img
                        alt="Get a free consultation with AKEEZO"
                        loading="lazy"
                        width={1318}
                        height={804}
                        decoding="async"
                        className="hidden h-auto w-full max-w-[600px] object-contain transition-transform duration-500 ease-out group-hover:scale-[1.03] lg:block"
                        src="/uploads/treatments/free-banner-model-v2.png"
                        onError={(e) => {
                          (e.currentTarget as HTMLImageElement).src =
                            "https://curemeabroad.com/v2/free-banner-model-v2.png";
                        }}
                      />
                    </div>

                    <div className="order-3 flex flex-col items-center gap-4 lg:hidden">
                      <p className="text-center text-[12px] font-light text-gray-500">
                        <span className="font-semibold text-gray-900">World's Leading</span> Medical Travel & Hospital Guidance Platform
                      </p>
                      <button
                        type="button"
                        onClick={() => setIsConsultModalOpen(true)}
                        className="group/btn inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full font-normal transition-colors duration-200 bg-[#007A6C] text-white hover:bg-[#005f54] h-11 px-5 text-sm cursor-pointer shadow-sm"
                      >
                        <span>Get In Touch</span>
                        <ArrowRight className="size-4 shrink-0 transition-transform duration-200 group-hover/btn:translate-x-0.5" />
                      </button>
                    </div>
                  </div>

                  {/* -------------------------------------------------------------
                      SECTION 4: ALL TREATMENTS DIRECTORY WITH EMBEDDED MID-PAGE CTA
                      ------------------------------------------------------------- */}
                  <div id="all-treatments-section" className="space-y-12">
                    <div>
                      <div className="md:mb-6 mb-4">
                        <div className="md:text-[32px] md:font-semibold text-[20px] leading-tight font-semibold md:w-full whitespace-pre-line md:whitespace-normal text-gray-900">
                          All Treatments
                        </div>
                      </div>

                      {filteredTreatments.length > 0 ? (
                        <div>
                          {/* Grid 1: First 20 items */}
                          <div className="grid gap-4 md:gap-4 md:gap-y-6 lg:grid-cols-5 md:grid-cols-4 sm:grid-cols-3">
                            {firstBatch.map((treatment) => renderCard(treatment))}
                          </div>

                          {/* Mid-Grid Callout Banner: "Make Confident Healthcare Decisions" */}
                          <div className="w-full my-12 relative bg-white overflow-hidden flex md:gap-4 gap-6 md:rounded-3xl rounded-2xl md:flex-row flex-col items-center md:justify-between justify-center text-xl font-semibold border border-gray-100 shadow-xs">
                            <div className="md:text-left text-center md:pl-10 md:space-y-8 space-y-4 md:py-10 p-6">
                              <div className="mb-6">
                                <h2 className="md:text-4xl text-2xl leading-tight md:leading-tight font-bold text-gray-900">
                                  Make Confident
                                </h2>
                                <h2 className="md:text-4xl text-2xl leading-tight md:leading-tight font-bold text-gray-900">
                                  Healthcare Decisions
                                </h2>
                              </div>
                              <button
                                type="button"
                                onClick={() => setIsConsultModalOpen(true)}
                                className="group/btn inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full font-normal transition-colors duration-200 bg-[#007A6C] text-white hover:bg-[#005f54] h-11 px-5 text-sm cursor-pointer shadow-sm"
                              >
                                <span>Get Started</span>
                                <ArrowRight className="size-4 shrink-0 transition-transform duration-200 group-hover/btn:translate-x-0.5" />
                              </button>
                            </div>

                            {/* Desktop Pill (Right) */}
                            <div className="md:absolute md:flex hidden right-0 top-1/2 md:-translate-y-1/2 bg-[#007A6C] md:p-7 p-4 items-center justify-between md:gap-12 gap-6 text-white md:pr-10 font-normal md:w-[58%] w-full overflow-hidden md:rounded-r-3xl rounded-r-2xl md:rounded-l-full rounded-l-full shadow-inner">
                              <div className="md:w-[280px] md:h-[280px] w-full aspect-square bg-white rounded-full overflow-hidden shrink-0 border-4 border-white/20">
                                <img
                                  draggable={false}
                                  alt="Confident Healthcare"
                                  loading="lazy"
                                  width={280}
                                  height={280}
                                  decoding="async"
                                  className="w-full h-full object-cover rounded-full"
                                  src="/uploads/treatments/confident-banner.jpg"
                                  onError={(e) => {
                                    (e.currentTarget as HTMLImageElement).src =
                                      "https://curemeabroad.com/v2/all-treatment/banner.jpg";
                                  }}
                                />
                              </div>
                              <p className="md:text-xl text-sm md:p-0 px-2 md:pb-0 pb-4 font-medium leading-snug">
                                Trusted information backed by real patient experiences.
                              </p>
                            </div>

                            {/* Mobile Pill */}
                            <div
                              style={{ borderRadius: "100px 20px 20px 100px" }}
                              className="md:hidden bg-[#007A6C] p-4 flex items-center justify-between gap-[20px] text-white font-normal w-full overflow-hidden"
                            >
                              <div className="w-[120px] h-[120px] aspect-square bg-white rounded-full overflow-hidden shrink-0 border-2 border-white/20">
                                <img
                                  draggable={false}
                                  alt="Confident Healthcare"
                                  loading="lazy"
                                  width={120}
                                  height={120}
                                  decoding="async"
                                  className="w-full h-full object-cover rounded-full"
                                  src="/uploads/treatments/confident-banner.jpg"
                                  onError={(e) => {
                                    (e.currentTarget as HTMLImageElement).src =
                                      "https://curemeabroad.com/v2/all-treatment/banner.jpg";
                                  }}
                                />
                              </div>
                              <p className="text-[14px] leading-tight font-medium">
                                Trusted information backed by real patient experiences.
                              </p>
                            </div>
                          </div>

                          {/* Grid 2: Remainder of items (from 21 onwards) */}
                          {secondBatch.length > 0 && (
                            <div className="grid gap-4 md:gap-4 md:gap-y-6 lg:grid-cols-5 md:grid-cols-4 sm:grid-cols-3">
                              {secondBatch.map((treatment) => renderCard(treatment))}
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center max-w-lg mx-auto">
                          <Search className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                          <h3 className="text-base font-bold text-gray-900 mb-1">No treatments found</h3>
                          <p className="text-xs text-gray-500 mb-4">
                            We could not find treatments matching "{searchQuery}". Try searching for another medical condition or clear your search query.
                          </p>
                          <button
                            type="button"
                            onClick={() => setSearchQuery("")}
                            className="rounded-full bg-[#007A6C] text-white px-5 py-2 text-xs font-semibold hover:bg-[#005f54] transition-colors cursor-pointer"
                          >
                            Clear Search
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* -------------------------------------------------------------
          SECTION 5: TREATMENT CONSULTATION & PRICE INQUIRY MODAL
          ------------------------------------------------------------- */}
      {isConsultModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs font-sans">
          <div className="relative w-full max-w-lg rounded-3xl bg-white p-6 md:p-8 shadow-2xl border border-gray-100">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-full bg-[#E6F8F6] flex items-center justify-center text-[#007A6C]">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">Treatment Consultation</h3>
                  <p className="text-xs text-gray-500">Free, unbiased quotes from accredited hospitals</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setIsConsultModalOpen(false);
                  setConsultSuccess(false);
                  setConsultError("");
                }}
                className="rounded-full p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {consultSuccess ? (
              <div className="py-8 text-center space-y-4">
                <CheckCircle2 className="w-14 h-14 text-emerald-500 mx-auto" />
                <h4 className="text-xl font-bold text-gray-900">Inquiry Received</h4>
                <p className="text-sm text-gray-600 max-w-md mx-auto leading-relaxed">
                  Thank you, <strong>{consultName}</strong>. Our clinical coordinators have received your inquiry for{" "}
                  <strong>{consultProcedure}</strong>. A dedicated medical advisor will reach out to you within 24 hours.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setIsConsultModalOpen(false);
                    setConsultSuccess(false);
                  }}
                  className="rounded-full bg-[#007A6C] text-white px-7 py-3 text-sm font-semibold hover:bg-[#005f54] transition-colors cursor-pointer shadow-md"
                >
                  Done
                </button>
              </div>
            ) : (
              <form onSubmit={handleConsultSubmit} className="space-y-4 mt-5">
                {consultError && (
                  <div className="rounded-xl bg-red-50 p-3 text-xs font-semibold text-red-600 border border-red-100">
                    {consultError}
                  </div>
                )}

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                    Selected Specialty or Procedure
                  </label>
                  <select
                    value={consultProcedure}
                    onChange={(e) => setConsultProcedure(e.target.value)}
                    className="w-full rounded-xl border border-gray-200 bg-gray-50/50 p-3 text-sm font-medium text-gray-900 focus:border-[#007A6C] focus:bg-white focus:outline-none"
                  >
                    {ALL_TREATMENTS.map((t) => (
                      <option key={t.id} value={t.title}>
                        {t.title}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                    Your Full Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. John Doe"
                    value={consultName}
                    onChange={(e) => setConsultName(e.target.value)}
                    className="w-full rounded-xl border border-gray-200 p-3 text-sm text-gray-900 placeholder:text-gray-400 focus:border-[#007A6C] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                    WhatsApp Phone Number or Email
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="+91 98765 43210 or patient@email.com"
                    value={consultContact}
                    onChange={(e) => setConsultContact(e.target.value)}
                    className="w-full rounded-xl border border-gray-200 p-3 text-sm text-gray-900 placeholder:text-gray-400 focus:border-[#007A6C] focus:outline-none"
                  />
                </div>

                <div className="p-3 bg-teal-50/60 rounded-xl border border-teal-100 flex items-center gap-2.5 text-xs text-[#007A6C]">
                  <Shield className="w-4 h-4 text-[#007A6C] shrink-0" />
                  <span>100% Free Service · No Commissions · HIPAA & DPDP Protected</span>
                </div>

                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsConsultModalOpen(false)}
                    className="rounded-full bg-gray-100 px-5 py-2.5 text-xs font-semibold text-gray-700 hover:bg-gray-200 transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="rounded-full bg-[#007A6C] hover:bg-[#005f54] px-6 py-2.5 text-xs font-semibold text-white shadow-md transition-all cursor-pointer"
                  >
                    Submit Consultation Request
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Global Footer */}
      <SiteFooter siteSettings={siteSettings} />
    </div>
  );
};

export default TreatmentsTemplate;
