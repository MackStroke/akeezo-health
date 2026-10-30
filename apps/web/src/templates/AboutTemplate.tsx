import React, { useState, useRef } from "react";
import type { PublicRouteResponseDTO } from "@akeezo/contracts";
import {
  ChevronRight,
  ChevronLeft,
  Star,
  ThumbsUp,
  Lock,
  ArrowRight,
  X,
  CheckCircle2,
  Building2,
  Users,
  Globe
} from "lucide-react";
import { SiteHeader } from "../components/SiteHeader.js";
import { SiteFooter } from "../components/SiteFooter.js";
import {
  TEAM_MEMBERS,
  FEATURED_ARTICLES,
  PRESS_ARTICLES,
  ABOUT_STATS
} from "../data/aboutData.js";

export interface AboutTemplateProps {
  data: PublicRouteResponseDTO;
}

export function AboutTemplate({ data }: AboutTemplateProps) {
  // Team slider state
  const teamSliderRef = useRef<HTMLDivElement>(null);

  // Inquiry modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: ""
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const scrollTeamSlider = (direction: "left" | "right") => {
    if (!teamSliderRef.current) return;
    const scrollAmount = direction === "left" ? -300 : 300;
    teamSliderRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
  };

  const handleSubmitInquiry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) return;
    setIsSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-[#FDFCFB] flex flex-col font-sans text-gray-900 selection:bg-brand-orange/20 selection:text-brand-orange-hover">
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "AboutPage",
            name: data.seo.title || "About Us | AKEEZO Healthcare Platform",
            description:
              data.seo.description ||
              "Learn about AKEEZO's mission, leadership team, and patient advocacy. We connect global patients with world-class accredited hospitals with transparent direct pricing.",
            url: "https://akeezo.com/about",
            publisher: {
              "@type": "Organization",
              name: "AKEEZO Healthcare Platform",
              logo: {
                "@type": "ImageObject",
                url: "https://akeezo.com/logo/akeezo-logo.svg"
              }
            }
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
                name: "About Us",
                item: "https://akeezo.com/about"
              }
            ]
          })
        }}
      />

      {/* Global Site Header */}
      <SiteHeader siteSettings={data.siteSettings} activePath="/about" />

      <main className="flex-1">
        <div className="mx-auto max-w-[1324px]">
          {/* BREADCRUMB */}
          <nav
            aria-label="Breadcrumb"
            className="flex flex-wrap items-center gap-y-1 md:py-5 py-4 md:px-10 px-4 text-[12px] md:text-[16px]"
          >
            <div className="flex items-center">
              <a href="/" className="flex items-center text-[#A8A8A8] hover:text-black transition">
                Home
              </a>
              <ChevronRight className="mx-1 shrink-0 text-gray-400 w-3.5 h-3.5 md:w-4 md:h-4" />
            </div>
            <div className="flex items-center">
              <span className="text-gray-900 font-medium">About Us</span>
            </div>
          </nav>

          <div className="md:pt-6 pt-4 space-y-12 md:space-y-16 pb-10 md:pb-16">
            {/* SECTION 1: HERO & OUR STORY */}
            <section
              className="px-4 md:px-10 space-y-8 md:space-y-16"
              aria-labelledby="about-hero-heading"
            >
              <div className="flex flex-col gap-y-10 md:gap-y-12 lg:grid lg:grid-cols-2 lg:gap-x-16 lg:gap-y-0 lg:items-start">
                <div className="contents lg:flex lg:flex-col lg:gap-y-14">
                  <div className="order-1 pt-2 md:pt-6 lg:max-w-[600px]">
                    <h1
                      id="about-hero-heading"
                      className="text-[28px] md:text-[38px] leading-tight font-bold md:mb-4 mb-2 tracking-tight text-gray-900"
                    >
                      Hey! We&apos;re AKEEZO
                    </h1>
                    <p className="text-[14px] md:text-[20px] text-gray-700 leading-relaxed">
                      We&apos;re a team of patient advocates, healthcare researchers, and travel experts — obsessed with one thing: making world-class medical care reachable for anyone, anywhere. Read on to learn our story, what we stand for, and the people building this.
                    </p>
                  </div>

                  <div className="order-4 hidden md:block">
                    <img
                      alt="AKEEZO patient consultation"
                      loading="lazy"
                      width={1230}
                      height={1122}
                      decoding="async"
                      className="object-contain w-max max-w-full h-[clamp(300px,44vw,545px)] rounded-2xl"
                      src="/uploads/about/hero-consult.webp"
                      onError={(e) => {
                        e.currentTarget.src = "https://curemeabroad.com/v2/about-us/hero-consult.webp";
                      }}
                    />
                  </div>

                  <div className="order-5 lg:max-w-[560px] space-y-3 md:space-y-4">
                    <h2
                      id="about-story-heading"
                      className="text-[28px] md:text-[36px] leading-tight font-bold md:mb-4 mb-2 tracking-tight text-gray-900"
                    >
                      Our Story
                    </h2>
                    <p className="text-[14px] md:text-[18px] text-gray-700 leading-relaxed">
                      We launched a concierge navigation service in mid-2025 — helping individual patients navigate accredited hospitals abroad, coordinate travel, and feel genuinely supported through the whole process. No confusing paperwork. No unanswered calls. Just real people guiding other real people through one of the most critical decisions of their lives.
                    </p>
                    <p className="text-[14px] md:text-[18px] text-gray-700 leading-relaxed">
                      Word spread faster than we expected. Within months, we were handling 60–80 patient cases a day across the US, UK, Germany, and Australia. Families were flying to India, Thailand, and Turkey for surgeries that would have cost them ten times more at home, and they were returning healthier, relieved, and grateful.
                    </p>
                  </div>
                </div>

                <div className="contents lg:flex lg:flex-col lg:items-end lg:gap-y-16">
                  <div className="order-2 w-full flex justify-center lg:justify-end lg:mt-2">
                    <img
                      alt="AKEEZO doctor consultation"
                      width={1246}
                      height={1106}
                      decoding="async"
                      className="object-contain w-max max-w-full h-[320px] lg:h-[clamp(360px,44vw,555px)] rounded-2xl"
                      src="/uploads/about/hero-doctor.webp"
                      onError={(e) => {
                        e.currentTarget.src = "https://curemeabroad.com/v2/about-us/hero-doctor.webp";
                      }}
                    />
                  </div>

                  <div className="order-6 w-full flex justify-center lg:justify-end">
                    <picture>
                      <source
                        media="(min-width: 1024px)"
                        srcSet="/uploads/about/collage-desktop.webp"
                        type="image/webp"
                      />
                      <img
                        alt="AKEEZO team collage"
                        loading="lazy"
                        width={1176}
                        height={1003}
                        decoding="async"
                        className="w-full max-w-[560px] h-auto rounded-2xl"
                        src="/uploads/about/collage-desktop.webp"
                        onError={(e) => {
                          e.currentTarget.src = "https://curemeabroad.com/v2/about-us/collage-desktop.webp";
                        }}
                      />
                    </picture>
                  </div>
                </div>
              </div>
            </section>

            {/* SECTION 2: BY THE NUMBERS & CUSTOMER RATINGS */}
            <section
              className="px-4 md:px-10"
              aria-label="AKEEZO by the numbers and customer ratings"
            >
              <div className="bg-white rounded-3xl border border-gray-200/80 shadow-xs flex flex-col items-center gap-y-6 py-8 md:flex-row md:justify-center md:gap-y-0 md:py-10">
                <div className="flex items-center divide-x divide-gray-200">
                  <div className="flex flex-col items-center px-6 md:px-12 first:ps-0">
                    <div className="flex items-center gap-2">
                      <Building2 className="w-5 h-5 text-brand-orange" />
                      <span className="font-extrabold leading-none text-[26px] md:text-[34px] text-gray-900">
                        {ABOUT_STATS.hospitals}
                      </span>
                    </div>
                    <span className="mt-1 text-[13px] md:text-[15px] font-medium text-gray-500">
                      Hospitals
                    </span>
                  </div>

                  <div className="flex flex-col items-center px-6 md:px-12">
                    <div className="flex items-center gap-2">
                      <Users className="w-5 h-5 text-brand-orange" />
                      <span className="font-extrabold leading-none text-[26px] md:text-[34px] text-gray-900">
                        {ABOUT_STATS.doctors}
                      </span>
                    </div>
                    <span className="mt-1 text-[13px] md:text-[15px] font-medium text-gray-500">
                      Doctors
                    </span>
                  </div>

                  <div className="flex flex-col items-center px-6 md:px-12">
                    <div className="flex items-center gap-2">
                      <Globe className="w-5 h-5 text-brand-orange" />
                      <span className="font-extrabold leading-none text-[26px] md:text-[34px] text-gray-900">
                        {ABOUT_STATS.countries}
                      </span>
                    </div>
                    <span className="mt-1 text-[13px] md:text-[15px] font-medium text-gray-500">
                      Countries
                    </span>
                  </div>
                </div>

                <div className="flex items-center divide-x divide-gray-200 md:border-s md:border-gray-200 md:ps-8">
                  {/* Google Reviews */}
                  <a
                    href="https://g.page/r/CdcHj8nzvnyEEBM/review"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="See reviews on Google"
                    className="flex items-center gap-3 px-6 md:px-8 rounded-md transition-opacity hover:opacity-80"
                  >
                    <div className="flex flex-col leading-tight">
                      <span className="text-[10px] md:text-[11px] text-gray-500 font-medium">Rated</span>
                      <span className="text-[17px] md:text-[19px] font-bold text-gray-900 leading-none">
                        {ABOUT_STATS.googleRating}
                      </span>
                      <span className="text-[10px] md:text-[11px] text-gray-500 font-medium">out of 5</span>
                    </div>
                    <img
                      alt="Google Reviews"
                      loading="lazy"
                      width={96}
                      height={54}
                      className="h-8 md:h-9 w-auto object-contain"
                      src="/uploads/about/google-logo.png"
                      onError={(e) => {
                        e.currentTarget.src =
                          "https://d162jy5nwnavsz.cloudfront.net/landing-page/surrogacy/google-logo.png";
                      }}
                    />
                  </a>

                  {/* Trustpilot */}
                  <a
                    href="https://www.trustpilot.com/evaluate/curemeabroad.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="See reviews on Trustpilot"
                    className="flex flex-col items-center gap-1 px-6 md:px-8 rounded-md transition-opacity hover:opacity-80"
                  >
                    <img
                      alt="Trustpilot"
                      loading="lazy"
                      width={103}
                      height={50}
                      className="h-5 md:h-6 w-auto object-contain"
                      src="/uploads/about/trustpilot-logo.png"
                      onError={(e) => {
                        e.currentTarget.src =
                          "https://d162jy5nwnavsz.cloudfront.net/landing-page/surrogacy/trustpilot-logo.png";
                      }}
                    />
                    <div className="flex items-center gap-0.5" aria-hidden="true">
                      {[...Array(5)].map((_, i) => (
                        <span
                          key={i}
                          className="flex h-3.5 w-3.5 md:h-4 md:w-4 items-center justify-center rounded-[3px] bg-[#00b67a]"
                        >
                          <Star className="h-2 w-2 md:h-2.5 md:w-2.5 fill-white text-white" />
                        </span>
                      ))}
                    </div>
                    <span className="text-[10px] md:text-[12px] text-gray-500 font-medium">
                      TrustScore {ABOUT_STATS.trustScore}
                    </span>
                  </a>
                </div>
              </div>
            </section>

            {/* SECTION 3: MEET OUR TEAM */}
            <section
              className="px-4 md:px-10 space-y-8 md:space-y-12"
              aria-labelledby="team-heading"
            >
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div className="max-w-2xl">
                  <span className="text-xs uppercase tracking-wider font-bold text-brand-orange">
                    Leadership &amp; Clinical Staff
                  </span>
                  <h2
                    id="team-heading"
                    className="text-[26px] leading-tight font-bold md:text-[36px] tracking-tight text-gray-900 mt-1"
                  >
                    Meet Our Team
                  </h2>
                  <p className="text-[14px] text-gray-600 md:text-[18px] mt-1">
                    Driven by purpose and expertise, our team works together to connect patients with trusted healthcare across the globe.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => scrollTeamSlider("left")}
                    aria-label="Previous team slide"
                    className="w-9 h-9 rounded-full border border-gray-300 bg-white hover:bg-brand-orange hover:border-brand-orange hover:text-white flex items-center justify-center transition-colors shadow-xs cursor-pointer"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => scrollTeamSlider("right")}
                    aria-label="Next team slide"
                    className="w-9 h-9 rounded-full border border-gray-300 bg-white hover:bg-brand-orange hover:border-brand-orange hover:text-white flex items-center justify-center transition-colors shadow-xs cursor-pointer"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Team Slider / Horizontal Scroll */}
              <div
                ref={teamSliderRef}
                className="flex gap-5 overflow-x-auto scrollbar-hide pb-4 -mx-4 px-4 md:-mx-0 md:px-0 scroll-smooth"
              >
                {TEAM_MEMBERS.map((member, idx) => (
                  <div
                    key={idx}
                    className="w-[240px] md:w-[260px] shrink-0 group flex flex-col items-center text-center bg-white rounded-2xl border border-gray-200/80 p-4 shadow-xs hover:shadow-md transition-all duration-300"
                  >
                    <div className="h-[200px] md:h-[230px] w-full rounded-xl overflow-hidden bg-gradient-to-t from-gray-100 to-gray-50 flex items-end justify-center">
                      <img
                        alt={member.name}
                        loading="lazy"
                        className="h-full w-full object-contain object-bottom group-hover:scale-105 transition-transform duration-500 ease-out"
                        src={member.image}
                        onError={(e) => {
                          e.currentTarget.src = member.imageFallback;
                        }}
                      />
                    </div>

                    <div className="mt-4 flex items-center justify-center gap-1.5 w-full">
                      <h3 className="font-bold text-[15px] md:text-[17px] text-gray-900 truncate">
                        {member.name}
                      </h3>
                      {member.linkedin ? (
                        <a
                          href={member.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={`${member.name} on LinkedIn`}
                          className="shrink-0 text-[#0A66C2] hover:opacity-75 transition-opacity"
                        >
                          <svg
                            viewBox="0 0 24 24"
                            fill="currentColor"
                            className="h-4 w-4"
                            aria-hidden="true"
                          >
                            <path d="M20.8079 0C21.4977 0 22.1593 0.274032 22.6471 0.761812C23.1349 1.24959 23.4089 1.91116 23.4089 2.60099V20.8079C23.4089 21.4977 23.1349 22.1593 22.6471 22.6471C22.1593 23.1349 21.4977 23.4089 20.8079 23.4089H2.60099C1.91116 23.4089 1.24959 23.1349 0.761812 22.6471C0.274032 22.1593 0 21.4977 0 20.8079V2.60099C0 1.91116 0.274032 1.24959 0.761812 0.761812C1.24959 0.274032 1.91116 0 2.60099 0H20.8079ZM20.1577 20.1577V13.265C20.1577 12.1406 19.711 11.0623 18.9159 10.2672C18.1208 9.47211 17.0425 9.02543 15.9181 9.02543C14.8126 9.02543 13.5251 9.70169 12.9009 10.7161V9.27253H9.27253V20.1577H12.9009V13.7462C12.9009 12.7448 13.7072 11.9255 14.7086 11.9255C15.1915 11.9255 15.6546 12.1174 15.996 12.4588C16.3375 12.8003 16.5293 13.2634 16.5293 13.7462V20.1577H20.1577ZM5.04592 7.23075C5.62537 7.23075 6.18109 7.00056 6.59083 6.59083C7.00056 6.18109 7.23075 5.62537 7.23075 5.04592C7.23075 3.83646 6.25538 2.84808 5.04592 2.84808C4.46302 2.84808 3.90399 3.07964 3.49181 3.49181C3.07964 3.90399 2.84808 4.46302 2.84808 5.04592C2.84808 6.25538 3.83646 7.23075 5.04592 7.23075ZM6.85361 20.1577V9.27253H3.25124V20.1577H6.85361Z" />
                          </svg>
                        </a>
                      ) : (
                        <span className="text-xs text-gray-400 font-semibold">MD</span>
                      )}
                    </div>
                    <p className="mt-0.5 text-[12px] md:text-[13px] text-gray-500 font-medium">
                      {member.role}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            {/* SECTION 4: TRUSTED BY PATIENTS / NEWS & PRESS */}
            <section
              className="px-4 md:px-10 space-y-8 md:space-y-12"
              aria-labelledby="news-heading"
            >
              <div className="mx-auto max-w-3xl flex flex-col items-center gap-2 text-center">
                <span className="text-xs uppercase tracking-wider font-bold text-brand-orange">
                  Press &amp; Media Coverage
                </span>
                <h2
                  id="news-heading"
                  className="text-[26px] leading-tight font-bold md:text-[36px] tracking-tight text-gray-900"
                >
                  Trusted by Patients Across the Globe
                </h2>
                <p className="text-[14px] text-gray-600 md:text-[18px]">
                  Learn about the newest trends in medical tourism, treatment breakthroughs, and patient experiences from around the world.
                </p>
              </div>

              <div className="grid md:grid-cols-5 gap-8 md:gap-9">
                {/* 2 Featured Articles */}
                <div className="md:col-span-2 space-y-6">
                  {FEATURED_ARTICLES.map((article) => (
                    <article
                      key={article.id}
                      className="space-y-3 bg-white rounded-2xl border border-gray-200/80 p-4 shadow-xs hover:shadow-md transition-shadow"
                    >
                      <div className="relative overflow-hidden rounded-xl h-[240px] md:h-[280px] bg-gray-100">
                        <img
                          alt={article.title}
                          loading="lazy"
                          className="w-full h-full object-cover"
                          src={article.image}
                          onError={(e) => {
                            e.currentTarget.src = article.imageFallback;
                          }}
                        />
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <span className="inline-block bg-brand-orange text-white text-[11px] font-bold px-2.5 py-0.5 rounded-full">
                            {article.source}
                          </span>
                          <span className="text-xs text-gray-400 font-medium">{article.date}</span>
                        </div>
                        <h3 className="text-[16px] md:text-[20px] leading-snug font-bold text-gray-900 line-clamp-2">
                          {article.title}
                        </h3>
                        <p className="text-[13px] md:text-[14px] leading-relaxed text-gray-600 line-clamp-3">
                          {article.description}
                        </p>
                      </div>
                    </article>
                  ))}
                </div>

                {/* 5 Compact Media Articles */}
                <div className="md:col-span-3 space-y-3.5">
                  {PRESS_ARTICLES.map((article) => (
                    <article
                      key={article.id}
                      className="w-full bg-white flex gap-3 md:gap-4 rounded-xl border border-gray-200/80 p-3.5 md:p-4 shadow-xs hover:shadow-md transition-shadow"
                    >
                      <div className="relative shrink-0 overflow-hidden rounded-lg h-[80px] w-[80px] md:h-[110px] md:w-[110px] bg-gray-100">
                        <img
                          alt={article.title}
                          loading="lazy"
                          className="w-full h-full object-cover"
                          src={article.image}
                          onError={(e) => {
                            e.currentTarget.src = article.imageFallback;
                          }}
                        />
                      </div>
                      <div className="flex flex-col justify-between py-0.5">
                        <div className="flex items-center gap-2">
                          <span className="text-[11px] md:text-[12px] font-bold text-brand-orange">
                            {article.source}
                          </span>
                          <span className="h-1 w-1 rounded-full bg-gray-300" />
                          <span className="text-[11px] md:text-[12px] text-gray-400">{article.date}</span>
                        </div>
                        <h3 className="font-bold text-[13px] md:text-[16px] leading-snug text-gray-900 line-clamp-2">
                          {article.title}
                        </h3>
                        <p className="text-[11px] md:text-[13px] leading-snug text-gray-500 line-clamp-2">
                          {article.description}
                        </p>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            </section>

            {/* SECTION 5: TESTIMONIALS & SOCIAL PROOF WIDGETS */}
            <section
              className="px-4 md:px-10 space-y-8 md:space-y-12"
              aria-labelledby="testimonial-heading"
            >
              <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:gap-6">
                {/* Left Column */}
                <div className="flex flex-col gap-4 lg:w-[33%]">
                  <div className="flex items-center gap-3">
                    <span className="flex h-10 w-10 md:h-12 md:w-12 items-center justify-center rounded-full bg-brand-orange text-white">
                      <ThumbsUp className="h-5 w-5 md:h-6 md:w-6" />
                    </span>
                    <div>
                      <h2
                        id="testimonial-heading"
                        className="text-[28px] font-bold leading-none text-gray-900 md:text-[38px] tracking-tight"
                      >
                        Testimonial
                      </h2>
                    </div>
                  </div>
                  <p className="-mt-1 text-[14px] font-medium text-gray-500 md:text-[18px]">
                    Social Proof &amp; Reviews Widgets
                  </p>

                  {/* Customer Review Card 1 */}
                  <div className="rounded-2xl bg-white shadow-sm border border-gray-200/80 p-5 flex items-center gap-4 hover:shadow-md transition-shadow">
                    <img
                      alt="Verified patient review"
                      loading="lazy"
                      className="h-14 w-14 rounded-full object-cover ring-2 ring-brand-orange/20 shrink-0"
                      src="/uploads/about/testi-woman.webp"
                      onError={(e) => {
                        e.currentTarget.src = "https://curemeabroad.com/v2/about-us/testi-woman.webp";
                      }}
                    />
                    <div className="min-w-0">
                      <div className="flex items-center gap-0.5 text-brand-orange mb-1">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="h-3.5 w-3.5 fill-current" />
                        ))}
                      </div>
                      <p className="text-[13px] font-semibold text-gray-900">Our happy customer</p>
                      <p className="text-[11px] text-gray-500 line-clamp-2 mt-0.5 leading-snug">
                        &ldquo;Really enjoyed my experience with the AKEEZO team — smooth from first call to recovery.&rdquo;
                      </p>
                      <p className="text-[10px] font-bold text-gray-700 mt-1">Verified Google review</p>
                    </div>
                  </div>

                  {/* Customer Review Card 2 */}
                  <div className="rounded-2xl bg-white shadow-sm border border-gray-200/80 p-4 flex gap-3.5 hover:shadow-md transition-shadow">
                    <div className="relative h-[95px] w-[80px] shrink-0 overflow-hidden rounded-xl bg-gray-100">
                      <img
                        alt="Patient feedback"
                        loading="lazy"
                        className="h-full w-full object-cover"
                        src="/uploads/about/testi-blonde.webp"
                        onError={(e) => {
                          e.currentTarget.src = "https://curemeabroad.com/v2/about-us/testi-blonde.webp";
                        }}
                      />
                    </div>
                    <div className="min-w-0 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center gap-0.5 text-brand-orange mb-1">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className="h-3 w-3 fill-current" />
                          ))}
                        </div>
                        <p className="text-xs font-bold text-gray-900">Verified review</p>
                        <p className="text-[11px] text-gray-500 line-clamp-3 leading-snug mt-0.5">
                          &ldquo;The service was outstanding, reliable, and very reasonably priced — I felt supported through the whole journey.&rdquo;
                        </p>
                      </div>
                      <span className="text-[10px] text-gray-400 font-medium">5.0 / 5.0 Rating</span>
                    </div>
                  </div>

                  {/* Google Reviews Breakdown Meter */}
                  <div className="rounded-2xl bg-white shadow-sm border border-gray-200/80 p-5 hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-3 mb-3">
                      <img
                        alt="Google Reviews"
                        loading="lazy"
                        className="h-auto w-[74px] shrink-0"
                        src="/uploads/about/google-reviews.webp"
                        onError={(e) => {
                          e.currentTarget.src = "https://curemeabroad.com/v2/about-us/google-reviews.webp";
                        }}
                      />
                      <div className="flex items-center gap-1">
                        <span className="text-[38px] font-extrabold leading-none text-gray-900">4.8</span>
                        <Star className="h-6 w-6 fill-brand-orange text-brand-orange mb-1" />
                      </div>
                    </div>

                    <div className="space-y-1.5 text-gray-400" aria-hidden="true">
                      {[
                        { stars: 5, pct: "96%" },
                        { stars: 4, pct: "72%" },
                        { stars: 3, pct: "52%" },
                        { stars: 2, pct: "32%" },
                        { stars: 1, pct: "16%" }
                      ].map((bar) => (
                        <div key={bar.stars} className="flex items-center gap-1.5">
                          <span className="w-2.5 text-[9px] text-right font-medium">{bar.stars}</span>
                          <Star className="h-2 w-2 fill-gray-300 text-gray-300" />
                          <span className="block h-1.5 flex-1 rounded-full bg-gray-100 overflow-hidden">
                            <span
                              className="block h-full rounded-full bg-brand-orange"
                              style={{ width: bar.pct }}
                            />
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Center Column */}
                <div className="flex flex-col gap-4 lg:w-[35%]">
                  {/* Highlight Testimonial Box */}
                  <div className="rounded-2xl bg-gradient-to-br from-brand-orange to-[#EA580C] p-6 text-center text-white shadow-md">
                    <div className="flex items-end justify-center mb-3">
                      <img
                        alt="Senior patient"
                        className="h-11 w-11 rounded-full object-cover ring-2 ring-white/60 translate-x-3 shrink-0"
                        src="/uploads/about/testi-elder.webp"
                        onError={(e) => {
                          e.currentTarget.src = "https://curemeabroad.com/v2/about-us/testi-elder.webp";
                        }}
                      />
                      <img
                        alt="Patient advocate"
                        className="h-16 w-16 rounded-full object-cover ring-4 ring-white z-10 shrink-0"
                        src="/uploads/about/testi-bearded.webp"
                        onError={(e) => {
                          e.currentTarget.src = "https://curemeabroad.com/v2/about-us/testi-bearded.webp";
                        }}
                      />
                      <img
                        alt="Executive patient"
                        className="h-11 w-11 rounded-full object-cover ring-2 ring-white/60 -translate-x-3 shrink-0"
                        src="/uploads/about/testi-suit.webp"
                        onError={(e) => {
                          e.currentTarget.src = "https://curemeabroad.com/v2/about-us/testi-suit.webp";
                        }}
                      />
                    </div>
                    <p className="text-[16px] font-bold">Verified Google Review</p>
                    <blockquote className="mt-2 text-[13px] leading-relaxed text-white/90">
                      &ldquo;Visited their office — love how much the team obsesses over customer experience!&rdquo;
                    </blockquote>
                    <div className="mt-4 flex items-center justify-center gap-2">
                      <span className="font-extrabold text-[18px]">5.0</span>
                      <span className="text-[12px] font-medium text-white/80">/ 5.0 Rating</span>
                      <div className="flex items-center text-white ml-1">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="h-4 w-4 fill-current" />
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Security & Compliance Card */}
                  <div className="rounded-2xl bg-[#0F172A] p-6 text-white shadow-md border border-gray-800">
                    <div className="flex items-center gap-2.5">
                      <div className="p-2 rounded-lg bg-white/10 text-brand-orange">
                        <Lock className="h-5 w-5" />
                      </div>
                      <h3 className="text-[16px] font-bold">Security &amp; Compliance</h3>
                    </div>

                    <div className="mt-4 flex -space-x-2">
                      {["testi-elder", "testi-bearded", "testi-blonde", "testi-suit", "testi-woman"].map(
                        (imgName, i) => (
                          <img
                            key={i}
                            alt=""
                            className="h-8 w-8 rounded-full object-cover ring-2 ring-[#0F172A]"
                            src={`/uploads/about/${imgName}.webp`}
                            onError={(e) => {
                              e.currentTarget.src = `https://curemeabroad.com/v2/about-us/${imgName}.webp`;
                            }}
                          />
                        )
                      )}
                    </div>

                    <p className="mt-4 text-[15px] font-bold text-white">Trusted with your care</p>
                    <p className="mt-1.5 text-[12px] leading-relaxed text-gray-400">
                      Every case is handled with HIPAA, GDPR, and India DPDP Act 2023 compliant processes — your clinical data and privacy stay protected end-to-end.
                    </p>

                    <button
                      type="button"
                      onClick={() => setIsModalOpen(true)}
                      className="mt-5 inline-flex items-center gap-2 text-xs font-bold text-brand-orange hover:text-brand-orange-hover transition-colors cursor-pointer"
                    >
                      <span>Get started free</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>

                {/* Right Column */}
                <div className="flex flex-col gap-4 lg:w-[32%]">
                  {/* Patients Worldwide */}
                  <div className="rounded-2xl bg-white shadow-sm border border-gray-200/80 p-5 hover:shadow-md transition-shadow">
                    <p className="text-[15px] font-bold text-gray-900">Patients worldwide</p>
                    <div className="mt-3 flex items-center justify-between">
                      <div className="flex -space-x-2">
                        {["testi-suit", "testi-bearded", "testi-elder", "testi-blonde"].map((imgName, i) => (
                          <img
                            key={i}
                            alt=""
                            className="h-8 w-8 rounded-full object-cover ring-2 ring-white"
                            src={`/uploads/about/${imgName}.webp`}
                          />
                        ))}
                      </div>
                      <span className="text-xs font-bold text-gray-700">
                        US &bull; UK &bull; DE &bull; AU
                      </span>
                    </div>
                    <div className="my-3 h-px bg-gray-100" />
                    <p className="text-[12px] leading-relaxed text-gray-500 line-clamp-3">
                      &ldquo;The service was outstanding, reliable, and very reasonably priced — I felt supported through the whole journey.&rdquo;
                    </p>
                    <div className="mt-3 flex items-center justify-between">
                      <span className="text-[11px] font-bold text-gray-900">Verified review</span>
                      <div className="flex items-center gap-1">
                        <div className="flex text-brand-orange">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className="h-3 w-3 fill-current" />
                          ))}
                        </div>
                        <span className="text-[11px] text-gray-400 font-semibold">5.0</span>
                      </div>
                    </div>
                  </div>

                  {/* Trustpilot Widget Box */}
                  <div className="rounded-2xl bg-white shadow-sm border border-gray-200/80 p-5 text-center hover:shadow-md transition-shadow">
                    <span className="text-[17px] font-bold text-gray-900">Trustpilot</span>
                    <div className="flex items-center justify-center gap-1 my-2">
                      {[...Array(4)].map((_, i) => (
                        <span
                          key={i}
                          className="flex h-7 w-7 items-center justify-center rounded-[4px] bg-[#00b67a]"
                        >
                          <Star className="h-4 w-4 fill-white text-white" />
                        </span>
                      ))}
                      <span className="flex h-7 w-7 items-center justify-center rounded-[4px] bg-[#00b67a]/40">
                        <Star className="h-4 w-4 fill-white text-white" />
                      </span>
                    </div>
                    <p className="text-[13px] text-gray-500 font-medium">Rated 4.2 / 5.0</p>
                  </div>

                  {/* Verified Review snippet */}
                  <div className="rounded-2xl bg-white shadow-sm border border-gray-200/80 p-4 flex gap-3 hover:shadow-md transition-shadow">
                    <img
                      alt="Verified patient review"
                      loading="lazy"
                      className="h-16 w-16 rounded-xl object-cover shrink-0"
                      src="/uploads/about/testi-review.webp"
                      onError={(e) => {
                        e.currentTarget.src = "https://curemeabroad.com/v2/about-us/testi-review.webp";
                      }}
                    />
                    <div className="min-w-0">
                      <div className="flex text-brand-orange mb-1">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="h-3 w-3 fill-current" />
                        ))}
                      </div>
                      <blockquote className="text-[11px] text-gray-600 line-clamp-2 leading-snug">
                        &ldquo;The service was outstanding, reliable, and very reasonably priced.&rdquo;
                      </blockquote>
                      <p className="text-[10px] font-bold text-gray-900 mt-1">Verified Google review</p>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </main>

      {/* Global Site Footer */}
      <SiteFooter siteSettings={data.siteSettings} />

      {/* Consultation Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 md:p-8 shadow-2xl relative border border-gray-100">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute right-4 top-4 text-gray-400 hover:text-gray-700 p-1.5 rounded-full hover:bg-gray-100 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {isSubmitted ? (
              <div className="text-center py-8">
                <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  Inquiry Received!
                </h3>
                <p className="text-sm text-gray-600 mb-6 max-w-sm mx-auto">
                  Thank you, <span className="font-semibold text-gray-900">{formData.name}</span>. An AKEEZO Senior Medical Coordinator will review your inquiry and contact you within 24 hours.
                </p>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="bg-brand-orange text-white text-sm font-semibold px-6 py-2.5 rounded-full hover:bg-brand-orange-hover transition-colors cursor-pointer"
                >
                  Close
                </button>
              </div>
            ) : (
              <div>
                <div className="mb-6">
                  <span className="text-xs font-bold text-brand-orange uppercase tracking-wider">
                    Free Patient Navigation
                  </span>
                  <h3 className="text-xl md:text-2xl font-bold text-gray-900 mt-1">
                    Connect With Our Team
                  </h3>
                  <p className="text-xs text-gray-500 mt-1">
                    Speak directly with a dedicated patient coordinator for hospital quotes, medical visa support, and clinical records review.
                  </p>
                </div>

                <form onSubmit={handleSubmitInquiry} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. John Doe"
                      className="w-full text-sm rounded-xl border border-gray-300 px-3.5 py-2.5 outline-none focus:border-brand-orange focus:ring-1 focus:ring-brand-orange"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="john@example.com"
                        className="w-full text-sm rounded-xl border border-gray-300 px-3.5 py-2.5 outline-none focus:border-brand-orange focus:ring-1 focus:ring-brand-orange"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="+1 (555) 000-0000"
                        className="w-full text-sm rounded-xl border border-gray-300 px-3.5 py-2.5 outline-none focus:border-brand-orange focus:ring-1 focus:ring-brand-orange"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      How Can We Help You? (Optional)
                    </label>
                    <textarea
                      rows={3}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Tell us about your medical requirements or desired destination..."
                      className="w-full text-sm rounded-xl border border-gray-300 px-3.5 py-2 outline-none focus:border-brand-orange focus:ring-1 focus:ring-brand-orange resize-none"
                    />
                  </div>

                  <p className="text-[11px] text-gray-400">
                    By submitting, you agree to AKEEZO&apos;s privacy policy. Your medical data is strictly confidential and encrypted under DPDP standards.
                  </p>

                  <button
                    type="submit"
                    className="w-full bg-brand-orange hover:bg-brand-orange-hover text-white text-sm font-semibold py-3 rounded-full transition-all shadow-md hover:shadow-lg cursor-pointer"
                  >
                    Submit Inquiry
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
