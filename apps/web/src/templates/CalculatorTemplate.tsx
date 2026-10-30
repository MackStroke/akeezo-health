import React, { useState } from "react";
import type { PublicRouteResponseDTO } from "@akeezo/contracts";
import {
  Shield,
  Building2,
  Calculator,
  Star,
  ChevronDown
} from "lucide-react";
import { SiteHeader } from "../components/SiteHeader.js";
import { SiteFooter } from "../components/SiteFooter.js";

export interface CalculatorTemplateProps {
  data: PublicRouteResponseDTO;
}

interface FaqItem {
  id: string;
  category: "Estimates" | "Travel" | "Safety";
  question: string;
  answer: string;
}

const FAQ_ITEMS: FaqItem[] = [
  {
    id: "radix-_r_10_",
    category: "Estimates",
    question: "How accurate are the cost estimates provided by the calculator?",
    answer:
      "Our estimates are generated using real-time data from hundreds of our partner clinics and hospitals worldwide. While highly accurate, they are meant to serve as a baseline. The final quote may vary by 10-15% depending on your specific medical history, procedure complexity, and chosen facility."
  },
  {
    id: "radix-_r_12_",
    category: "Estimates",
    question: "Are travel and accommodation costs included in the estimate?",
    answer:
      "Medical estimates primarily cover hospital tariffs, surgeon fees, operating theater charges, anesthesia, and routine nursing stay. Travel, international flights, and hotel accommodation can be added via our concierge package or arranged independently with our travel desk assistance."
  },
  {
    id: "radix-_r_14_",
    category: "Travel",
    question: "What happens if I need follow-up care after returning home?",
    answer:
      "We ensure complete post-operative continuity. Before your discharge, you receive translated clinical summaries, operative reports, and digital imaging. Our coordinators arrange scheduled teleconsultations with your operating surgeon and can liaise with your local primary physician."
  },
  {
    id: "radix-_r_16_",
    category: "Safety",
    question: "How do you verify the quality of international hospitals?",
    answer:
      "Every partner facility undergoes rigorous vetting. We partner with hospitals accredited by JCI (Joint Commission International), NABH, and equivalent international standards, featuring board-certified department chairs and transparent clinical infection rates."
  },
  {
    id: "radix-_r_18_",
    category: "Safety",
    question: "Is it safe to get surgery abroad?",
    answer:
      "Yes, when choosing accredited tertiary and quaternary care hospitals with internationally trained surgical teams. Thousands of international patients travel each year for planned procedures, benefiting from advanced medical technology and personalized 1-on-1 care."
  },
  {
    id: "radix-_r_1a_",
    category: "Safety",
    question: "What if complications arise during or after the procedure?",
    answer:
      "Accredited partner hospitals maintain 24/7 dedicated intensive care units (ICUs) and rapid response medical teams. Our platform coordinates comprehensive medical surety, transparent clinical protocols, and on-ground patient advocates to support you at every stage."
  },
  {
    id: "radix-_r_1c_",
    category: "Travel",
    question: "How long should I plan to stay in the destination country?",
    answer:
      "Stay duration depends on the surgical procedure. Typically, minimally invasive or orthopedic joint surgeries require 7–14 days in-country (including hospital stay and mandatory fit-to-fly clearance), while minor procedures may require only 3–5 days."
  },
  {
    id: "radix-_r_1e_",
    category: "Safety",
    question: "Can I choose my own surgeon?",
    answer:
      "Absolutely. You can review detailed curriculum vitae (CVs), surgical case volumes, credentials, and patient reviews for lead surgeons across our network before selecting your preferred clinical specialist."
  }
];

export const CalculatorTemplate: React.FC<CalculatorTemplateProps> = ({ data }) => {
  const { siteSettings } = data;
  const [isCalculatorOpen, setIsCalculatorOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<"All Questions" | "Estimates" | "Travel" | "Safety">("All Questions");
  const [openFaqIds, setOpenFaqIds] = useState<Record<string, boolean>>({
    "radix-_r_10_": true
  });

  const toggleFaq = (id: string) => {
    setOpenFaqIds((prev) => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const filteredFaqs =
    selectedCategory === "All Questions"
      ? FAQ_ITEMS
      : FAQ_ITEMS.filter((item) => item.category === selectedCategory);

  return (
    <div className="min-h-screen bg-white font-sans text-ink antialiased overflow-x-hidden">
      <SiteHeader
        siteSettings={siteSettings}
        activePath={data.path}
        isCalculatorOpen={isCalculatorOpen}
        onCalculatorOpenChange={setIsCalculatorOpen}
      />

      <main id="main-content">
        <div className="max-w-7xl mx-auto px-4 lg:px-0 py-4 md:py-6">
          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb" className="mb-4">
            <ol className="flex items-center gap-2 text-sm text-gray-500">
              <li>
                <a href="/" className="hover:text-[#8B5CF6] transition-colors">
                  Home
                </a>
              </li>
              <li>/</li>
              <li className="text-gray-900 font-medium">Cost Calculator</li>
            </ol>
          </nav>

          <div className="space-y-0">
            {/* Hero Section */}
            <section className="relative overflow-hidden bg-gradient-to-br from-[#F0F7FF] via-white to-[#F0FDFA] rounded-3xl md:rounded-[32px]">
              <div className="px-4 md:px-8 py-10 md:py-16">
                <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
                  <div>
                    <div className="inline-flex items-center gap-1.5 bg-[#8B5CF6]/10 text-[#8B5CF6] text-xs font-medium px-3 py-1.5 rounded-full mb-4">
                      <Shield className="w-3.5 h-3.5" />
                      <span>Trusted by 15,000+ International Patients</span>
                    </div>

                    <h1 className="text-3xl md:text-[44px] md:leading-[1.15] font-bold text-gray-900">
                      Surgery Cost <br className="hidden md:block" />
                      Calculator Tool
                      <br />
                      <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#8B5CF6] to-[#6D28D9]">
                        Save up to 70%
                      </span>
                    </h1>

                    <p className="text-gray-600 text-sm md:text-base mt-4 max-w-lg leading-relaxed">
                      Compare surgery costs across top medical destinations. Get transparent estimates and connect with accredited international hospitals instantly.
                    </p>

                    <div className="flex flex-wrap gap-3 mt-6 md:mt-8">
                      <button
                        type="button"
                        onClick={() => setIsCalculatorOpen(true)}
                        className="inline-flex items-center gap-2 bg-[#8B5CF6] hover:bg-[#7C3AED] text-white text-sm font-semibold px-6 py-3 rounded-full transition-colors shadow-sm shadow-purple-200 cursor-pointer"
                      >
                        <span>Start Calculator</span>
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                      </button>

                      <button
                        type="button"
                        onClick={() => setIsCalculatorOpen(true)}
                        className="inline-flex items-center gap-2 border border-gray-300 text-gray-700 text-sm font-semibold px-6 py-3 rounded-full hover:border-gray-400 hover:bg-gray-50 transition-colors cursor-pointer"
                      >
                        <span>Get a Personalized Quote</span>
                      </button>
                    </div>

                    <div className="flex flex-wrap gap-4 mt-6 md:mt-8">
                      <div className="flex items-center gap-1.5 text-xs text-gray-600">
                        <Shield className="w-3.5 h-3.5 text-[#8B5CF6]" />
                        <span>No Hidden Fees</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-gray-600">
                        <Building2 className="w-3.5 h-3.5 text-blue-600" />
                        <span>JCI Accredited Hospitals</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-gray-600">
                        <Calculator className="w-3.5 h-3.5 text-purple-600" />
                        <span>Real Estimates</span>
                      </div>
                    </div>
                  </div>

                  <div className="relative">
                    <div className="relative rounded-2xl overflow-hidden aspect-[4/3] md:aspect-auto md:h-[420px] flex items-center justify-center">
                      <img
                        alt="Expert medical team for surgery cost consultation"
                        decoding="async"
                        className="object-contain w-full h-full max-h-[420px]"
                        src="/uploads/calculator-hero.png"
                        onError={(e) => {
                          (e.currentTarget as HTMLImageElement).src =
                            "https://d162jy5nwnavsz.cloudfront.net/webapp/Frame+48099013.png";
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Patient Success Stories */}
            <section className="py-12 md:py-16">
              <div className="text-center mb-8">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Patient Success Stories</h2>
                <p className="text-sm text-gray-500 mt-2">Real experiences from international patients.</p>
              </div>

              <div className="grid md:grid-cols-3 gap-4 md:gap-6">
                {/* Story 1 */}
                <div className="bg-white rounded-2xl border border-gray-100 p-5 md:p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#8B5CF6] to-[#6D28D9] flex items-center justify-center text-white font-bold text-sm">
                      S
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">Sarah M.</p>
                      <p className="text-[11px] text-gray-500">Cosmetic Surgery in Turkey</p>
                    </div>
                  </div>
                  <div className="flex gap-0.5 mb-3" aria-label="5 star rating">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    “Saved over 60% compared to US prices. The clinic was state of the art and the staff were incredibly supportive throughout my journey.”
                  </p>
                </div>

                {/* Story 2 */}
                <div className="bg-white rounded-2xl border border-gray-100 p-5 md:p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#8B5CF6] to-[#6D28D9] flex items-center justify-center text-white font-bold text-sm">
                      J
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">James L.</p>
                      <p className="text-[11px] text-gray-500">Knee Replacement in India</p>
                    </div>
                  </div>
                  <div className="flex gap-0.5 mb-3" aria-label="5 star rating">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    “The calculator estimate was spot on. I received world-class care at a fraction of the cost back home. Highly recommend this service.”
                  </p>
                </div>

                {/* Story 3 */}
                <div className="bg-white rounded-2xl border border-gray-100 p-5 md:p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#8B5CF6] to-[#6D28D9] flex items-center justify-center text-white font-bold text-sm">
                      E
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">Elena K.</p>
                      <p className="text-[11px] text-gray-500">Dental Implants in Thailand</p>
                    </div>
                  </div>
                  <div className="flex gap-0.5 mb-3" aria-label="5 star rating">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    “Everything was arranged perfectly. From the hospital to the hotel, the assistance experience gave me peace of mind.”
                  </p>
                </div>
              </div>
            </section>

            {/* How to Use Our Surgery Cost Calculator Tool */}
            <section className="py-12 md:py-16">
              <div className="text-center mb-8 md:mb-10">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                  How to Use Our Surgery Cost Calculator Tool
                </h2>
                <p className="text-sm text-gray-500 mt-2 max-w-xl mx-auto">
                  Get a transparent cost estimate in minutes. Our 4-step calculator helps you compare options and make informed decisions.
                </p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-5">
                {/* Step 1 */}
                <div className="bg-gradient-to-b from-blue-50 to-blue-100/50 rounded-2xl p-4 md:p-6 border border-gray-100/80">
                  <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg text-sm font-bold text-blue-600 bg-blue-50">
                    1
                  </span>
                  <h3 className="text-sm md:text-base font-semibold text-gray-900 mt-3 mb-1.5">
                    Select Treatment
                  </h3>
                  <p className="text-xs md:text-sm text-gray-500 leading-relaxed">
                    Choose from over 150+ procedures across specialities like orthopedics, cardiology, and cosmetic surgery.
                  </p>
                </div>

                {/* Step 2 */}
                <div className="bg-gradient-to-b from-purple-50 to-purple-100/50 rounded-2xl p-4 md:p-6 border border-gray-100/80">
                  <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg text-sm font-bold text-purple-600 bg-purple-50">
                    2
                  </span>
                  <h3 className="text-sm md:text-base font-semibold text-gray-900 mt-3 mb-1.5">
                    Choose Country
                  </h3>
                  <p className="text-xs md:text-sm text-gray-500 leading-relaxed">
                    Compare costs between top medical tourism destinations like Turkey, India, Thailand, and Mexico.
                  </p>
                </div>

                {/* Step 3 */}
                <div className="bg-gradient-to-b from-purple-50 to-purple-100/50 rounded-2xl p-4 md:p-6 border border-gray-100/80">
                  <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg text-sm font-bold text-purple-600 bg-purple-50">
                    3
                  </span>
                  <h3 className="text-sm md:text-base font-semibold text-gray-900 mt-3 mb-1.5">
                    Patient Details
                  </h3>
                  <p className="text-xs md:text-sm text-gray-500 leading-relaxed">
                    Provide basic medical history and requirements to receive the most accurate and personalized cost estimate.
                  </p>
                </div>

                {/* Step 4 */}
                <div className="bg-gradient-to-b from-orange-50 to-orange-100/50 rounded-2xl p-4 md:p-6 border border-gray-100/80">
                  <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg text-sm font-bold text-orange-600 bg-orange-50">
                    4
                  </span>
                  <h3 className="text-sm md:text-base font-semibold text-gray-900 mt-3 mb-1.5">
                    Preferences
                  </h3>
                  <p className="text-xs md:text-sm text-gray-500 leading-relaxed">
                    Select accommodation type, travel assistance needs, and companion requirements for a full package quote.
                  </p>
                </div>
              </div>
            </section>

            {/* Try Calculator Now Banner */}
            <section className="py-6">
              <div className="bg-gradient-to-r from-[#8B5CF6] to-[#6D28D9] rounded-2xl md:rounded-3xl p-6 md:p-10 text-center">
                <h2 className="text-xl md:text-2xl font-bold text-white mb-2">
                  Try the Calculator Now
                </h2>
                <p className="text-sm text-white/80 mb-6 max-w-md mx-auto">
                  Get your personalized surgery cost estimate in under 2 minutes.
                </p>
                <button
                  type="button"
                  onClick={() => setIsCalculatorOpen(true)}
                  className="inline-flex items-center gap-2 bg-white text-[#8B5CF6] text-sm font-semibold px-8 py-3.5 rounded-full hover:bg-gray-50 transition-colors shadow-lg shadow-purple-900/20 cursor-pointer"
                >
                  Start Calculator
                </button>
              </div>
            </section>

            {/* Frequently Asked Questions */}
            <section className="py-12 md:py-16" id="get-quote">
              <div className="text-center mb-6">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                  Frequently Asked Questions
                </h2>
                <p className="text-sm text-gray-500 mt-2">
                  Find quick answers to common questions about our platform and services.
                </p>
              </div>

              {/* Category Filter Chips */}
              <div className="flex items-center justify-center gap-2 mb-6 flex-wrap">
                {(["All Questions", "Estimates", "Travel", "Safety"] as const).map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setSelectedCategory(cat)}
                    className={`text-xs md:text-sm font-medium px-4 py-2 rounded-full border transition-colors cursor-pointer ${
                      selectedCategory === cat
                        ? "bg-[#8B5CF6] text-white border-[#8B5CF6]"
                        : "bg-white text-gray-600 border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* FAQ Accordion List */}
              <div className="max-w-4xl mx-auto">
                <div data-orientation="vertical">
                  {filteredFaqs.map((faq) => {
                    const isOpen = !!openFaqIds[faq.id];
                    return (
                      <div
                        key={faq.id}
                        data-state={isOpen ? "open" : "closed"}
                        data-orientation="vertical"
                        className="border-b border-gray-100"
                      >
                        <h3 data-orientation="vertical" data-state={isOpen ? "open" : "closed"} className="flex">
                          <button
                            type="button"
                            aria-controls={`${faq.id}-content`}
                            aria-expanded={isOpen}
                            data-state={isOpen ? "open" : "closed"}
                            data-orientation="vertical"
                            id={faq.id}
                            onClick={() => toggleFaq(faq.id)}
                            className="flex flex-1 items-center justify-between transition-all [&[data-state=open]>svg]:rotate-180 text-left text-sm md:text-base font-medium text-gray-900 hover:text-[#8B5CF6] hover:no-underline py-4 cursor-pointer"
                          >
                            <span>{faq.question}</span>
                            <ChevronDown className="h-4 w-4 shrink-0 transition-transform duration-200" />
                          </button>
                        </h3>

                        {isOpen && (
                          <div
                            id={`${faq.id}-content`}
                            role="region"
                            aria-labelledby={faq.id}
                            data-state="open"
                            data-orientation="vertical"
                            className="overflow-hidden text-sm transition-all pb-4 pt-0 text-gray-600 leading-relaxed"
                          >
                            {faq.answer}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </section>
          </div>
        </div>
      </main>

      <SiteFooter siteSettings={siteSettings} />
    </div>
  );
};

export default CalculatorTemplate;
