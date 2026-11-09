import React, { useState, useMemo } from "react";
import type { PublicRouteResponseDTO, CommunityThread } from "@akeezo/contracts";
import {
  Search,
  MessageSquare,
  Sparkles,
  Stethoscope,
  Shield,
  HelpCircle,
  TrendingUp,
  ArrowRight,
  Calendar,
  Building2,
} from "lucide-react";
import { SiteHeader } from "../components/SiteHeader.js";
import { SiteFooter } from "../components/SiteFooter.js";
import { CommunityThreadCard } from "../components/CommunityThreadCard.js";
import { AskCommunityModal } from "../components/AskCommunityModal.js";
import { ShareStoryModal } from "../components/ShareStoryModal.js";
import { CURATED_COMMUNITY_THREADS } from "../data/communityData.js";

export interface CommunityTemplateProps {
  data: PublicRouteResponseDTO;
}

const CATEGORIES = [
  "All Topics",
  "Cosmetic & Plastic Surgery",
  "IVF & Fertility Treatment",
  "Hair Transplant",
  "Dental Care",
  "Orthopedics & Spine",
  "Bariatric & Weight Loss",
  "Cardiac & Oncology",
  "Travel, Visa & Logistics",
];

const FEATURED_DOCTORS = [
  {
    name: "Dr. Chokchai Amornpiwat",
    specialty: "Plastic & Reconstructive Surgery",
    hospital: "Yanhee International Hospital, Bangkok",
    image: "/uploads/doctors/doctor-2220.jpg",
    slug: "chokchai-amornpiwat",
  },
  {
    name: "Prof. Dr. Semra Kahraman",
    specialty: "Reproductive Endocrinology & IVF",
    hospital: "Memorial Şişli Hospital, Istanbul",
    image: "/uploads/doctors/doctor-3797.jpg",
    slug: "semra-kahraman",
  },
  {
    name: "Dr. Naresh Trehan",
    specialty: "Cardiovascular & Thoracic Surgery",
    hospital: "Medanta The Medicity, Gurugram",
    image: "/uploads/doctors/doctor-14660.jpg",
    slug: "naresh-trehan",
  },
];

export const CommunityTemplate: React.FC<CommunityTemplateProps> = ({ data }) => {
  const { siteSettings } = data;
  const payload = (data.payload as any) || {};

  // All threads
  const initialThreads: CommunityThread[] = useMemo(() => {
    if (payload.threads && Array.isArray(payload.threads) && payload.threads.length > 0) {
      return payload.threads;
    }
    return CURATED_COMMUNITY_THREADS;
  }, [payload.threads]);

  const [threads, setThreads] = useState<CommunityThread[]>(initialThreads);
  const [selectedCategory, setSelectedCategory] = useState("All Topics");
  const [activeTab, setActiveTab] = useState<"trending" | "doctor_answered" | "stories" | "recent">("trending");
  const [searchQuery, setSearchQuery] = useState("");

  const [isAskModalOpen, setIsAskModalOpen] = useState(false);
  const [isStoryModalOpen, setIsStoryModalOpen] = useState(false);

  // Filter threads
  const filteredThreads = useMemo(() => {
    let result = [...threads].filter((t) => t.status === "published");

    if (selectedCategory !== "All Topics") {
      result = result.filter((t) => t.category === selectedCategory);
    }

    if (activeTab === "doctor_answered") {
      result = result.filter((t) => t.isDoctorAnswered);
    } else if (activeTab === "stories") {
      result = result.filter((t) => t.isStory);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (t) =>
          t.title.toLowerCase().includes(q) ||
          t.content.toLowerCase().includes(q) ||
          (t.tags && t.tags.some((tag) => tag.toLowerCase().includes(q))) ||
          t.category.toLowerCase().includes(q) ||
          t.author.country.toLowerCase().includes(q)
      );
    }

    if (activeTab === "recent") {
      result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } else {
      result.sort((a, b) => (b.isPinned ? 1 : 0) - (a.isPinned ? 1 : 0) || b.upvotes - a.upvotes);
    }

    return result;
  }, [threads, selectedCategory, activeTab, searchQuery]);

  const handleThreadCreated = (newThread: CommunityThread) => {
    setThreads((prev) => [newThread, ...prev]);
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-gray-900 selection:bg-[#007A6C] selection:text-white flex flex-col">
      <SiteHeader siteSettings={siteSettings} activePath="/community" />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#005a4f] via-[#007A6C] to-[#006357] text-white pt-10 pb-16 sm:pb-20 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-teal-100 text-xs font-semibold mb-4">
            <Sparkles className="size-3.5 text-amber-300" />
            <span>Ask CMA & Akeezo Global Healthcare Community</span>
          </div>

          <h1 className="text-2xl sm:text-4xl md:text-5xl font-black tracking-tight leading-tight max-w-4xl mx-auto">
            Medical Travel Q&amp;A &amp; Real Patient Stories
          </h1>

          <p className="mt-3 sm:mt-4 text-xs sm:text-base text-teal-50/90 max-w-2xl mx-auto leading-relaxed">
            Transparent surgical costs, hospital experiences, post-op recovery advice, and doctor-verified answers from 45+ countries.
          </p>

          {/* Search Bar */}
          <div className="mt-6 sm:mt-8 max-w-2xl mx-auto">
            <div className="relative flex items-center bg-white rounded-full shadow-xl p-1.5 pl-5 border border-white/30 text-gray-900">
              <Search className="size-5 text-gray-400 shrink-0 mr-3" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search questions, patient experiences, hospitals, or procedures..."
                className="w-full text-xs sm:text-sm font-medium outline-none bg-transparent placeholder:text-gray-400"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="px-2 text-xs text-gray-400 hover:text-gray-600 font-semibold cursor-pointer"
                >
                  Clear
                </button>
              )}
              <button
                type="button"
                className="bg-[#FF6D1B] hover:bg-[#e65c0d] text-white px-5 sm:px-6 py-2.5 rounded-full text-xs font-bold transition-all shadow-sm shrink-0 flex items-center gap-1.5 cursor-pointer"
              >
                <span>Search</span>
              </button>
            </div>
          </div>

          {/* Action Triggers */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => setIsAskModalOpen(true)}
              className="inline-flex items-center gap-2 bg-[#FF6D1B] hover:bg-[#e65c0d] text-white font-bold text-xs sm:text-sm px-6 py-2.5 rounded-full shadow-md hover:shadow-lg transition-all cursor-pointer"
            >
              <HelpCircle className="size-4" />
              <span>Ask a Question</span>
            </button>

            <button
              type="button"
              onClick={() => setIsStoryModalOpen(true)}
              className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/30 text-white font-bold text-xs sm:text-sm px-6 py-2.5 rounded-full transition-all cursor-pointer"
            >
              <Sparkles className="size-4 text-amber-300" />
              <span>Share Your Journey</span>
            </button>
          </div>

          {/* Trust Stat Counters */}
          <div className="mt-10 pt-6 border-t border-white/15 grid grid-cols-2 md:grid-cols-4 gap-4 text-center text-xs">
            <div>
              <div className="text-xl sm:text-2xl font-black text-white">1,400+</div>
              <div className="text-teal-200 text-[11px] font-medium mt-0.5">Verified Patient Stories</div>
            </div>
            <div>
              <div className="text-xl sm:text-2xl font-black text-white">320+</div>
              <div className="text-teal-200 text-[11px] font-medium mt-0.5">Specialist Doctor Answers</div>
            </div>
            <div>
              <div className="text-xl sm:text-2xl font-black text-white">45+</div>
              <div className="text-teal-200 text-[11px] font-medium mt-0.5">Countries Represented</div>
            </div>
            <div>
              <div className="text-xl sm:text-2xl font-black text-white">100%</div>
              <div className="text-teal-200 text-[11px] font-medium mt-0.5">Medically Moderated</div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12 flex-1 w-full">
        {/* Category Horizontal Filter Bar */}
        <div className="mb-6 overflow-x-auto pb-2 scrollbar-none">
          <div className="flex items-center gap-2 min-w-max">
            {CATEGORIES.map((cat) => {
              const isSelected = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
                    isSelected
                      ? "bg-[#007A6C] text-white shadow-xs"
                      : "bg-white hover:bg-gray-100 text-gray-700 border border-gray-200"
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>

        {/* Layout Grid: Discussions List & Sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: View Mode Tabs & Discussion Cards (8 cols) */}
          <div className="lg:col-span-8 space-y-6">
            {/* View Mode Tabs Bar */}
            <div className="bg-white rounded-2xl border border-gray-100 p-1.5 shadow-2xs flex flex-wrap items-center justify-between gap-2">
              <div className="flex flex-wrap items-center gap-1">
                <button
                  type="button"
                  onClick={() => setActiveTab("trending")}
                  className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    activeTab === "trending"
                      ? "bg-teal-50 text-[#007A6C] border border-teal-200/60"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  <TrendingUp className="size-3.5" />
                  <span>Trending</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab("doctor_answered")}
                  className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    activeTab === "doctor_answered"
                      ? "bg-teal-50 text-[#007A6C] border border-teal-200/60"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  <Stethoscope className="size-3.5" />
                  <span>Doctor Answered</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab("stories")}
                  className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    activeTab === "stories"
                      ? "bg-teal-50 text-[#007A6C] border border-teal-200/60"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  <Sparkles className="size-3.5 text-amber-500" />
                  <span>Patient Stories</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab("recent")}
                  className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    activeTab === "recent"
                      ? "bg-teal-50 text-[#007A6C] border border-teal-200/60"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  <Calendar className="size-3.5" />
                  <span>Recent</span>
                </button>
              </div>

              <span className="text-xs text-gray-500 font-medium px-2">
                Showing <strong className="text-gray-900">{filteredThreads.length}</strong> discussions
              </span>
            </div>

            {/* Discussions Feed */}
            {filteredThreads.length === 0 ? (
              <div className="bg-white rounded-3xl border border-gray-100 p-10 text-center space-y-4">
                <div className="size-16 rounded-full bg-teal-50 text-[#007A6C] mx-auto flex items-center justify-center">
                  <MessageSquare className="size-7" />
                </div>
                <h3 className="text-base font-bold text-gray-900">No discussions match your filter</h3>
                <p className="text-xs text-gray-500 max-w-sm mx-auto">
                  Be the first to start a conversation about {selectedCategory} or clear your search terms.
                </p>
                <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedCategory("All Topics");
                      setSearchQuery("");
                      setActiveTab("trending");
                    }}
                    className="px-4 py-2 rounded-full border border-gray-200 text-xs font-bold text-gray-700 hover:bg-gray-50 cursor-pointer"
                  >
                    Reset Filters
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsAskModalOpen(true)}
                    className="px-5 py-2 rounded-full bg-[#007A6C] text-white text-xs font-bold shadow-xs hover:bg-[#006357] cursor-pointer"
                  >
                    Ask a Question
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredThreads.map((thread) => (
                  <CommunityThreadCard key={thread.id || thread.slug || (thread as any)._id} thread={thread} />
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Sticky Sidebar Modules (4 cols) */}
          <aside className="lg:col-span-4 space-y-6">
            {/* Ask / Share CTA Card */}
            <div className="bg-gradient-to-br from-teal-900 to-[#005a4f] text-white rounded-3xl p-6 shadow-md relative overflow-hidden">
              <div className="relative z-10 space-y-3">
                <span className="text-[10px] font-bold uppercase tracking-wider text-teal-200">
                  Participate in Community
                </span>
                <h3 className="text-lg font-bold leading-snug">
                  Have a question about surgery, costs, or travel abroad?
                </h3>
                <p className="text-xs text-teal-100 leading-relaxed">
                  Post your inquiry to receive authentic advice from verified medical travelers and specialist doctors.
                </p>
                <div className="pt-1 flex flex-col gap-2">
                  <button
                    type="button"
                    onClick={() => setIsAskModalOpen(true)}
                    className="w-full inline-flex items-center justify-center gap-2 bg-[#FF6D1B] hover:bg-[#e65c0d] text-white font-bold text-xs py-2.5 rounded-full transition-all cursor-pointer shadow-xs"
                  >
                    <HelpCircle className="size-3.5" />
                    <span>Ask Community Question</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsStoryModalOpen(true)}
                    className="w-full inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 border border-white/25 text-white font-bold text-xs py-2.5 rounded-full transition-all cursor-pointer"
                  >
                    <Sparkles className="size-3.5 text-amber-300" />
                    <span>Share Patient Story</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Featured Answering Doctors */}
            <div className="bg-white rounded-3xl border border-gray-100 p-5 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold uppercase tracking-wider text-gray-800 flex items-center gap-1.5">
                  <Stethoscope className="size-4 text-[#007A6C]" />
                  <span>Featured Specialist Doctors</span>
                </h3>
              </div>

              <div className="divide-y divide-gray-100">
                {FEATURED_DOCTORS.map((doc) => (
                  <div key={doc.slug} className="py-3 first:pt-0 last:pb-0 flex items-center gap-3">
                    <img
                      src={doc.image}
                      alt={doc.name}
                      className="size-11 rounded-full object-cover border border-gray-200 shrink-0"
                      loading="lazy"
                    />
                    <div className="text-xs flex-1 min-w-0">
                      <a
                        href={`/doctors/${doc.slug}`}
                        className="font-bold text-gray-900 hover:text-[#007A6C] block truncate"
                      >
                        {doc.name}
                      </a>
                      <p className="text-[11px] text-gray-500 truncate">{doc.specialty}</p>
                      <p className="text-[10px] text-gray-400 truncate">{doc.hospital}</p>
                    </div>
                  </div>
                ))}
              </div>

              <a
                href="/doctors"
                className="inline-flex items-center gap-1 text-xs font-bold text-[#007A6C] hover:underline pt-1"
              >
                <span>View all verified doctors</span>
                <ArrowRight className="size-3" />
              </a>
            </div>

            {/* Need Direct Hospital Quote Bridge */}
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200/80 rounded-3xl p-5 space-y-3">
              <div className="flex items-center gap-2 text-amber-800 font-bold text-xs uppercase tracking-wider">
                <Building2 className="size-4 text-[#FF6D1B]" />
                <span>Need Direct Hospital Pricing?</span>
              </div>
              <p className="text-xs text-gray-700 leading-relaxed">
                Compare official accredited procedure rates for <strong>Yanhee Hospital</strong>, <strong>Memorial Şişli</strong>, and <strong>Medanta The Medicity</strong> with typical US &amp; UK savings.
              </p>
              <div className="pt-1 flex flex-col gap-2">
                <a
                  href="/hospitals/yanhee-international-hospital#surgeries"
                  className="inline-flex items-center justify-between p-2.5 rounded-xl bg-white border border-amber-200 text-xs font-semibold text-gray-800 hover:text-[#007A6C] hover:border-[#007A6C] transition-colors"
                >
                  <span>Yanhee Hospital Surgeries</span>
                  <span className="text-[11px] font-bold text-[#007A6C]">Save up to 76%</span>
                </a>
                <a
                  href="/#opinion"
                  className="inline-flex items-center justify-center gap-1.5 bg-[#FF6D1B] hover:bg-[#e65c0d] text-white font-bold text-xs py-2 rounded-full shadow-xs transition-all"
                >
                  <span>Get Free Hospital Second Opinion</span>
                  <ArrowRight className="size-3" />
                </a>
              </div>
            </div>

            {/* Medical Disclaimer & Safety Rules */}
            <div className="bg-white rounded-3xl border border-gray-100 p-5 shadow-xs text-xs space-y-2.5 text-gray-500">
              <div className="flex items-center gap-1.5 font-bold text-gray-800">
                <Shield className="size-4 text-emerald-600" />
                <span>Community Safety &amp; DPDP Policy</span>
              </div>
              <p className="text-[11px] leading-relaxed">
                The Akeezo Community is a peer support and educational forum. Content is not formal medical diagnosis. For acute emergencies, contact local healthcare services. Protected under India DPDP Act 2023.
              </p>
            </div>
          </aside>
        </div>
      </main>

      {/* Modals */}
      <AskCommunityModal
        isOpen={isAskModalOpen}
        onClose={() => setIsAskModalOpen(false)}
        onThreadCreated={handleThreadCreated}
      />

      <ShareStoryModal
        isOpen={isStoryModalOpen}
        onClose={() => setIsStoryModalOpen(false)}
        onStoryCreated={handleThreadCreated}
      />

      <SiteFooter siteSettings={siteSettings} />
    </div>
  );
};
