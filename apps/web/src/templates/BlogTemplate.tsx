import { useState, useMemo } from "react";
import type { PublicRouteResponseDTO } from "@akeezo/contracts";
import { ArrowUpRight, Search, Calendar, ChevronRight } from "lucide-react";
import { SiteHeader } from "../components/SiteHeader.js";
import { SiteFooter } from "../components/SiteFooter.js";
import {
  FEATURED_BLOG_ARTICLE,
  LATEST_BLOG_POSTS,
  ALL_BLOG_ARTICLES,
  type BlogArticleItem
} from "../data/blogData.js";

export interface BlogTemplateProps {
  data: PublicRouteResponseDTO;
}

export function BlogTemplate({ data }: BlogTemplateProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  // Merge articles from server database payload if available
  const serverArticles = ((data.payload as any)?.articles as any[]) || [];

  const combinedArticles: BlogArticleItem[] = useMemo(() => {
    if (!serverArticles || serverArticles.length === 0) {
      return ALL_BLOG_ARTICLES;
    }

    const serverMapped: BlogArticleItem[] = serverArticles.map((sa) => ({
      slug: sa.slug,
      title: sa.title,
      date: sa.publishedAt
        ? new Date(sa.publishedAt).toISOString().split("T")[0]
        : "2026-10-25",
      excerpt: sa.excerpt || "",
      image:
        sa.featuredImage?.url ||
        "https://luxora-cms.s3.ap-south-1.amazonaws.com/cma-blogs/1793289557843-3of8glinqdt.jpg",
      category: sa.category || "Clinical Guide",
      readTime: sa.estimatedReadTime ? `${sa.estimatedReadTime} min read` : undefined,
      author: sa.author
        ? {
            name: sa.author.name || "Akeezo Medical Advisory Board",
            role: sa.author.role || "Specialist Reviewer",
          }
        : undefined,
    }));

    // Deduplicate against static fallback
    const seenSlugs = new Set(serverMapped.map((a) => a.slug));
    const remainingFallback = ALL_BLOG_ARTICLES.filter((a) => !seenSlugs.has(a.slug));
    return [...serverMapped, ...remainingFallback];
  }, [serverArticles]);

  const categories = useMemo(() => {
    const set = new Set<string>();
    combinedArticles.forEach((a) => {
      if (a.category) set.add(a.category);
    });
    return ["All", ...Array.from(set)];
  }, [combinedArticles]);

  const filteredArticles = useMemo(() => {
    return combinedArticles.filter((article) => {
      const matchesCategory =
        selectedCategory === "All" || article.category === selectedCategory;
      const matchesSearch =
        searchQuery.trim() === "" ||
        article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (article.excerpt || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.category.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [combinedArticles, selectedCategory, searchQuery]);

  const featured = FEATURED_BLOG_ARTICLE;
  const latestPosts = LATEST_BLOG_POSTS;

  return (
    <div className="min-h-screen bg-[#fcfdfd] flex flex-col font-sans text-gray-900">
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            name: data.seo?.title || "Medical Travel & Healthcare Insights Blog | AKEEZO",
            description:
              data.seo?.description ||
              "Authoritative clinical insights, hospital selection guides, treatment cost comparisons, and patient recovery stories for medical travel.",
            url: "https://akeezo.com/blogs",
            publisher: {
              "@type": "Organization",
              name: "AKEEZO Healthcare Platform",
              url: "https://akeezo.com",
              logo: "https://akeezo.com/logo/logo with tagline-light.svg",
            },
          }),
        }}
      />

      <SiteHeader siteSettings={data.siteSettings} />

      <main className="flex-1 min-h-0">
        <div className="mt-5">
          {/* Breadcrumb Navigation */}
          <nav className="max-w-[1324px] md:px-10 mx-auto px-4 py-2 flex items-center gap-1.5 text-xs text-gray-500 mb-2">
            <a href="/" className="hover:text-black transition">
              Home
            </a>
            <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
            <span className="text-gray-900 font-semibold">Blogs &amp; Insights</span>
          </nav>

          <div className="max-w-[1324px] md:px-10 mx-auto px-4">
            {/* Page Headline & Subtitle */}
            <div className="mb-6 border-b border-gray-100 pb-5">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 border border-[#00C7BE]/30 text-[#007A6C] text-xs font-bold uppercase tracking-wider mb-2">
                Clinical Editorial &amp; Patient Guides
              </div>
              <h1 className="text-2xl md:text-3xl lg:text-4xl font-extrabold text-gray-900 tracking-tight">
                Healthcare Insights &amp; Patient Guides
              </h1>
              <p className="text-sm md:text-base text-gray-600 max-w-3xl mt-1.5 leading-relaxed">
                Evidence-based medical guides, accredited hospital selection criteria, transparent procedure cost benchmarks in India, and cross-border recovery timelines.
              </p>
            </div>

            {/* Top Grid: Featured Hero (col 7) + Latest Posts (col 5) */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:mt-2">
              {/* Featured Hero Article */}
              <div className="md:col-span-7 col-span-1">
                <a
                  href={`/blogs/${featured.slug}`}
                  className="group block"
                  aria-label={featured.title}
                >
                  <div className="bg-[#e3e8ee] rounded-xl p-0 overflow-hidden relative aspect-[16/9] w-full">
                    <img
                      alt={featured.title}
                      fetchPriority="high"
                      width={700}
                      height={400}
                      decoding="async"
                      className="w-full h-full object-cover rounded-xl group-hover:scale-[1.02] transition-transform duration-300"
                      src={featured.image}
                    />
                  </div>
                  <div className="mt-6">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2 group-hover:text-[#007A6C] transition line-clamp-2">
                      {featured.title}
                    </h2>
                    <p className="text-gray-600 text-sm mb-2 leading-relaxed line-clamp-3">
                      {featured.excerpt}
                    </p>
                    <div className="flex items-center gap-3 text-xs text-gray-400 mb-2">
                      <span className="flex items-center gap-1 font-medium">
                        <Calendar className="w-3.5 h-3.5 text-gray-400" />
                        Published On: {featured.date}
                      </span>
                      <span>•</span>
                      <span className="text-[#007A6C] font-semibold">
                        {featured.readTime || "5 min read"}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-3">
                      <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-teal-50 text-[#007A6C] border border-[#00C7BE]/30">
                        {featured.category}
                      </span>
                      <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-orange-50 text-[#FF6B00] border border-[#FF6B00]/30">
                        Verified Guide
                      </span>
                    </div>
                  </div>
                </a>
              </div>

              {/* Latest Posts Sidebar */}
              <div className="md:col-span-5 col-span-1 flex flex-col gap-6">
                <div className="bg-white rounded-xl border border-gray-200 p-0 overflow-hidden shadow-xs">
                  <h2 className="font-bold text-base md:text-lg py-3 px-4 border-b border-gray-200 text-gray-900 flex items-center justify-between">
                    <span>Latest Posts</span>
                    <span className="text-xs font-normal text-gray-500">Recently Updated</span>
                  </h2>
                  <ul className="divide-y divide-gray-100">
                    {latestPosts.map((post) => (
                      <li key={post.slug} className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50/80 transition group">
                        <a className="flex gap-3 w-full" href={`/blogs/${post.slug}`}>
                          <div className="w-20 h-16 flex-shrink-0 rounded-md overflow-hidden bg-gray-100 relative">
                            <img
                              alt={post.title}
                              loading="lazy"
                              width={48}
                              height={48}
                              decoding="async"
                              className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-200"
                              src={post.image}
                            />
                          </div>
                          <div className="flex-1 min-w-0 flex flex-col justify-center">
                            <span className="text-sm font-medium text-gray-800 line-clamp-2 text-left group-hover:text-[#007A6C] transition leading-snug">
                              {post.title}
                            </span>
                            <span className="mt-1 text-xs text-gray-400 block">
                              {post.date}
                            </span>
                          </div>
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Filter & Search Bar */}
            <div className="mt-12 pt-8 border-t border-gray-200">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                {/* Category Pills */}
                <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setSelectedCategory(cat)}
                      className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition whitespace-nowrap cursor-pointer ${
                        selectedCategory === cat
                          ? "bg-[#007A6C] text-white shadow-xs"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>

                {/* Search Box */}
                <div className="relative w-full md:w-72 shrink-0">
                  <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search clinical topics..."
                    className="w-full pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-full text-xs text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#007A6C] focus:ring-1 focus:ring-[#007A6C]"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery("")}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 hover:text-gray-700"
                    >
                      ✕
                    </button>
                  )}
                </div>
              </div>

              {/* Results count when filtered */}
              {(selectedCategory !== "All" || searchQuery) && (
                <div className="text-xs text-gray-500 mb-4">
                  Showing {filteredArticles.length} article
                  {filteredArticles.length === 1 ? "" : "s"}
                  {selectedCategory !== "All" && <span> in <strong>{selectedCategory}</strong></span>}
                  {searchQuery && <span> matching &ldquo;<strong>{searchQuery}</strong>&rdquo;</span>}
                </div>
              )}
            </div>

            {/* Articles Grid (3 columns on md+, 2 on sm, 1 on mobile) */}
            {filteredArticles.length === 0 ? (
              <div className="py-16 text-center text-gray-500 bg-white rounded-2xl border border-gray-200 my-6">
                <p className="text-base font-semibold text-gray-800">No articles found</p>
                <p className="text-xs text-gray-500 mt-1">
                  Try adjusting your search query or select another clinical category.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedCategory("All");
                    setSearchQuery("");
                  }}
                  className="mt-4 px-4 py-2 bg-[#007A6C] text-white text-xs font-bold rounded-lg hover:bg-[#005f54] transition"
                >
                  Reset Filters
                </button>
              </div>
            ) : (
              <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-y-8 gap-x-0 sm:gap-x-6 md:gap-x-10 pb-16">
                {filteredArticles.map((article) => (
                  <a
                    key={article.slug}
                    className="flex flex-col mb-8 group"
                    href={`/blogs/${article.slug}`}
                  >
                    <div className="relative w-full aspect-[16/9] rounded-xl overflow-hidden mb-4 bg-gray-100">
                      <img
                        alt={article.title}
                        loading="lazy"
                        decoding="async"
                        className="object-cover absolute inset-0 w-full h-full group-hover:scale-105 transition-transform duration-300"
                        src={article.image}
                      />
                    </div>
                    <p className="text-sm mt-2 text-zinc-500">
                      Published On : {article.date}
                    </p>
                    <div className="flex items-start gap-2 mt-1">
                      <h3 className="font-semibold text-lg line-clamp-2 flex-1 text-gray-900 group-hover:text-[#007A6C] transition">
                        {article.title}
                      </h3>
                      <span className="mt-1 group-hover:translate-x-1 transition-transform shrink-0 text-gray-700 group-hover:text-[#007A6C]">
                        <ArrowUpRight className="w-5 h-5" />
                      </span>
                    </div>
                    <p className="mt-2 text-sm line-clamp-3 text-neutral-500 leading-relaxed">
                      {article.excerpt}
                    </p>
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      <SiteFooter siteSettings={data.siteSettings} />
    </div>
  );
}
