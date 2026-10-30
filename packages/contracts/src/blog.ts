import { z } from "zod";

export const BlogCategoryEnum = z.enum([
  "Cardiology",
  "Orthopedics",
  "Oncology",
  "Neurology",
  "Organ Transplant",
  "Medical Travel Guide",
  "Patient Stories",
  "Wellness & Prevention",
  "Clinical Insights",
  "Healthcare Policy",
]);

export type BlogCategory = z.infer<typeof BlogCategoryEnum>;

export const BlogStatusEnum = z.enum(["draft", "review", "published", "archived"]);
export type BlogStatus = z.infer<typeof BlogStatusEnum>;

export const SeoCheckSeveritySchema = z.enum(["error", "warning", "good"]);
export type SeoCheckSeverity = z.infer<typeof SeoCheckSeveritySchema>;

export const SeoCheckItemSchema = z.object({
  id: z.string(),
  label: z.string(),
  passed: z.boolean(),
  severity: SeoCheckSeveritySchema,
  message: z.string(),
  suggestion: z.string().optional(),
  value: z.union([z.string(), z.number()]).optional(),
});
export type SeoCheckItem = z.infer<typeof SeoCheckItemSchema>;

export const SeoAuditResultSchema = z.object({
  score: z.number().min(0).max(100),
  grade: z.enum(["poor", "fair", "good", "optimal"]),
  focusKeyword: z.string(),
  wordCount: z.number().int().min(0),
  readingTimeMinutes: z.number().int().min(1),
  keywordDensity: z.number().min(0),
  keywordOccurrences: z.number().int().min(0),
  checks: z.array(SeoCheckItemSchema),
  passedCount: z.number().int().min(0),
  warningCount: z.number().int().min(0),
  errorCount: z.number().int().min(0),
});
export type SeoAuditResult = z.infer<typeof SeoAuditResultSchema>;

export const BlogPostSchema = z.object({
  _id: z.string().optional(),
  title: z.string().min(5, "Title must be at least 5 characters").max(200),
  slug: z.string().min(3).max(120),
  excerpt: z.string().max(400).default(""),
  content: z.string().min(10, "Article content cannot be empty"),
  category: BlogCategoryEnum.default("Medical Travel Guide"),
  tags: z.array(z.string()).default([]),
  featuredImage: z
    .object({
      url: z.string().default(""),
      alt: z.string().default(""),
      caption: z.string().optional(),
    })
    .default({ url: "", alt: "" }),
  author: z
    .object({
      name: z.string().default("Akeezo Medical Editorial Board"),
      role: z.string().default("Clinical Content Specialist"),
      avatarUrl: z.string().optional(),
    })
    .default({ name: "Akeezo Medical Editorial Board", role: "Clinical Content Specialist" }),
  status: BlogStatusEnum.default("draft"),
  publishedAt: z.string().nullable().optional(),
  seo: z
    .object({
      focusKeyword: z.string().default(""),
      seoTitle: z.string().max(120).default(""),
      metaDescription: z.string().max(300).default(""),
      canonicalUrl: z.string().optional(),
      ogImage: z.string().optional(),
      noIndex: z.boolean().default(false),
      seoScore: z.number().min(0).max(100).default(0),
      schemaType: z.string().default("MedicalWebPage"),
    })
    .default({ focusKeyword: "", seoTitle: "", metaDescription: "", noIndex: false, seoScore: 0, schemaType: "MedicalWebPage" }),
  estimatedReadTime: z.number().int().default(3),
  medicalDisclaimerEnabled: z.boolean().default(true),
  viewsCount: z.number().int().default(0),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
});
export type BlogPost = z.infer<typeof BlogPostSchema>;

export const CreateBlogPostDTO = BlogPostSchema.omit({
  _id: true,
  createdAt: true,
  updatedAt: true,
  viewsCount: true,
});
export type CreateBlogPostDTO = z.infer<typeof CreateBlogPostDTO>;

export const UpdateBlogPostDTO = CreateBlogPostDTO.partial();
export type UpdateBlogPostDTO = z.infer<typeof UpdateBlogPostDTO>;

/**
 * Intelligent Real-Time SEO Content Score & Tracker Engine
 * Computes a weighted 0-100 score based on 13 critical on-page SEO signals.
 */
export function calculateSeoContentScore(input: {
  title: string;
  slug: string;
  content: string;
  focusKeyword: string;
  seoTitle?: string;
  metaDescription?: string;
  featuredImageAlt?: string;
}): SeoAuditResult {
  const kw = (input.focusKeyword || "").trim().toLowerCase();
  const title = (input.title || "").trim();
  const seoTitle = (input.seoTitle || input.title || "").trim();
  const metaDescription = (input.metaDescription || "").trim();
  const slug = (input.slug || "").trim().toLowerCase();
  const content = (input.content || "").trim();
  const imgAlt = (input.featuredImageAlt || "").trim().toLowerCase();

  // 1. Text Metrics
  // Strip Markdown characters and HTML tags for accurate word count
  const cleanText = content
    .replace(/<[^>]*>/g, " ")
    .replace(/[#*_`~\[\]\(\)\-\+\=\|\{\}\\]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  const words = cleanText.length > 0 ? cleanText.split(/\s+/).filter(Boolean) : [];
  const wordCount = words.length;
  const readingTimeMinutes = Math.max(1, Math.ceil(wordCount / 200));

  // Count keyword occurrences
  let keywordOccurrences = 0;
  if (kw.length > 0) {
    const escapedKw = kw.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const regex = new RegExp(`\\b${escapedKw}\\b`, "gi");
    const matches = cleanText.match(regex);
    keywordOccurrences = matches ? matches.length : 0;
  }

  const keywordDensity = wordCount > 0 && kw.length > 0
    ? Number(((keywordOccurrences / wordCount) * 100).toFixed(2))
    : 0;

  const checks: SeoCheckItem[] = [];
  let earnedWeight = 0;
  const totalWeight = 100;

  // Check 1: Target Focus Keyword Defined (Weight: 10)
  if (kw.length >= 2) {
    earnedWeight += 10;
    checks.push({
      id: "focus_keyword_set",
      label: "Target Focus Keyword",
      passed: true,
      severity: "good",
      message: `Focus keyword "${kw}" is configured.`,
      value: kw,
    });
  } else {
    checks.push({
      id: "focus_keyword_set",
      label: "Target Focus Keyword",
      passed: false,
      severity: "error",
      message: "No focus keyword set. Add a focus keyword to evaluate SEO ranking factors.",
      suggestion: "Enter a high-intent search term (e.g., 'robotic knee replacement in India').",
    });
  }

  // Check 2: Focus Keyword in SEO Title (Weight: 15)
  const titleLower = seoTitle.toLowerCase();
  if (kw.length > 0 && titleLower.includes(kw)) {
    earnedWeight += 15;
    checks.push({
      id: "title_keyword",
      label: "Keyword in Title",
      passed: true,
      severity: "good",
      message: "Focus keyword appears in the SEO title.",
    });
  } else {
    checks.push({
      id: "title_keyword",
      label: "Keyword in Title",
      passed: false,
      severity: "error",
      message: "Focus keyword was not found in the SEO title.",
      suggestion: `Include "${kw}" naturally in your title tag.`,
    });
  }

  // Check 3: SEO Title Length (Weight: 8)
  const titleLen = seoTitle.length;
  if (titleLen >= 40 && titleLen <= 65) {
    earnedWeight += 8;
    checks.push({
      id: "title_length",
      label: "Title Length",
      passed: true,
      severity: "good",
      message: `SEO title is ${titleLen} characters (Optimal 40-65 chars).`,
      value: `${titleLen} chars`,
    });
  } else if (titleLen > 0 && titleLen < 40) {
    earnedWeight += 4;
    checks.push({
      id: "title_length",
      label: "Title Length",
      passed: false,
      severity: "warning",
      message: `SEO title is ${titleLen} characters (too short, recommend 40-65 chars).`,
      suggestion: "Expand your title with patient context or secondary keywords to maximize CTR.",
      value: `${titleLen} chars`,
    });
  } else if (titleLen > 65) {
    earnedWeight += 3;
    checks.push({
      id: "title_length",
      label: "Title Length",
      passed: false,
      severity: "warning",
      message: `SEO title is ${titleLen} characters (may be truncated on Google SERPs).`,
      suggestion: "Trim your title under 65 characters to avoid truncation ellipses in search results.",
      value: `${titleLen} chars`,
    });
  } else {
    checks.push({
      id: "title_length",
      label: "Title Length",
      passed: false,
      severity: "error",
      message: "SEO title is empty.",
      suggestion: "Provide a compelling clinical guide title.",
    });
  }

  // Check 4: Focus Keyword Near Beginning of Title (Weight: 5)
  if (kw.length > 0 && titleLower.includes(kw)) {
    const idx = titleLower.indexOf(kw);
    if (idx <= titleLower.length * 0.5) {
      earnedWeight += 5;
      checks.push({
        id: "title_keyword_position",
        label: "Keyword Position in Title",
        passed: true,
        severity: "good",
        message: "Focus keyword appears in the first half of the title.",
      });
    } else {
      checks.push({
        id: "title_keyword_position",
        label: "Keyword Position in Title",
        passed: false,
        severity: "warning",
        message: "Focus keyword is placed towards the end of the title.",
        suggestion: "Front-load your primary keyword for higher search query relevance weighting.",
      });
    }
  }

  // Check 5: Focus Keyword in Meta Description (Weight: 10)
  const descLower = metaDescription.toLowerCase();
  if (kw.length > 0 && descLower.includes(kw)) {
    earnedWeight += 10;
    checks.push({
      id: "desc_keyword",
      label: "Keyword in Meta Description",
      passed: true,
      severity: "good",
      message: "Focus keyword appears in the meta description snippet.",
    });
  } else {
    checks.push({
      id: "desc_keyword",
      label: "Keyword in Meta Description",
      passed: false,
      severity: "error",
      message: "Focus keyword is missing from the meta description.",
      suggestion: `Incorporate "${kw}" in your summary to prompt Google bolding in SERP results.`,
    });
  }

  // Check 6: Meta Description Length (Weight: 8)
  const descLen = metaDescription.length;
  if (descLen >= 120 && descLen <= 165) {
    earnedWeight += 8;
    checks.push({
      id: "desc_length",
      label: "Meta Description Length",
      passed: true,
      severity: "good",
      message: `Meta description is ${descLen} characters (Optimal 120-165 chars).`,
      value: `${descLen} chars`,
    });
  } else if (descLen > 0 && descLen < 120) {
    earnedWeight += 4;
    checks.push({
      id: "desc_length",
      label: "Meta Description Length",
      passed: false,
      severity: "warning",
      message: `Meta description is ${descLen} characters (recommend 120-165 chars for full SERP preview).`,
      suggestion: "Add a clear value proposition or clinical reassurance for prospective patients.",
      value: `${descLen} chars`,
    });
  } else if (descLen > 165) {
    earnedWeight += 4;
    checks.push({
      id: "desc_length",
      label: "Meta Description Length",
      passed: false,
      severity: "warning",
      message: `Meta description is ${descLen} characters (may get cut off in mobile search).`,
      suggestion: "Shorten description under 165 characters.",
      value: `${descLen} chars`,
    });
  } else {
    checks.push({
      id: "desc_length",
      label: "Meta Description Length",
      passed: false,
      severity: "error",
      message: "Meta description is missing.",
      suggestion: "Write a 120-160 character snippet summarizing clinical findings or treatment overview.",
    });
  }

  // Check 7: Focus Keyword in URL Slug (Weight: 10)
  const kwSlugPart = kw.replace(/\s+/g, "-");
  if (kw.length > 0 && slug.includes(kwSlugPart)) {
    earnedWeight += 10;
    checks.push({
      id: "slug_keyword",
      label: "Keyword in URL Slug",
      passed: true,
      severity: "good",
      message: `URL slug contains focus keyword part (${kwSlugPart}).`,
      value: `/blog/${slug}`,
    });
  } else {
    checks.push({
      id: "slug_keyword",
      label: "Keyword in URL Slug",
      passed: false,
      severity: "warning",
      message: "URL slug does not include the target focus keyword.",
      suggestion: `Update slug to include "${kwSlugPart}".`,
    });
  }

  // Check 8: Focus Keyword in Introduction / First 100 Words (Weight: 8)
  const first100Words = words.slice(0, 100).join(" ").toLowerCase();
  if (kw.length > 0 && first100Words.includes(kw)) {
    earnedWeight += 8;
    checks.push({
      id: "intro_keyword",
      label: "Keyword in Introduction",
      passed: true,
      severity: "good",
      message: "Focus keyword appears in the first 100 words of content.",
    });
  } else {
    checks.push({
      id: "intro_keyword",
      label: "Keyword in Introduction",
      passed: false,
      severity: "warning",
      message: "Focus keyword does not appear in the opening paragraph.",
      suggestion: "Introduce your primary keyword early to reassure readers and crawler bots immediately.",
    });
  }

  // Check 9: Focus Keyword in Subheadings (H2 / H3) (Weight: 8)
  const headingMatches = content.match(/^(?:#{2,3}\s+|<h[23][^>]*>)(.*?)(?:<\/h[23]>|$)/gim) || [];
  const headingsText = headingMatches.join(" ").toLowerCase();
  if (kw.length > 0 && headingsText.includes(kw)) {
    earnedWeight += 8;
    checks.push({
      id: "subheading_keyword",
      label: "Keyword in Subheadings (H2/H3)",
      passed: true,
      severity: "good",
      message: "Focus keyword appears in at least one H2/H3 subheading.",
      value: `${headingMatches.length} headings`,
    });
  } else if (headingMatches.length === 0) {
    checks.push({
      id: "subheading_keyword",
      label: "Keyword in Subheadings (H2/H3)",
      passed: false,
      severity: "warning",
      message: "No H2/H3 subheadings found in article content.",
      suggestion: "Use subheadings (## in Markdown) to break up medical content and organize sections.",
    });
  } else {
    checks.push({
      id: "subheading_keyword",
      label: "Keyword in Subheadings (H2/H3)",
      passed: false,
      severity: "warning",
      message: "Subheadings exist but none include the focus keyword.",
      suggestion: "Add your focus keyword or close synonym into at least one primary section heading.",
    });
  }

  // Check 10: Content Word Count (Weight: 10)
  if (wordCount >= 1000) {
    earnedWeight += 10;
    checks.push({
      id: "word_count",
      label: "Content Length",
      passed: true,
      severity: "good",
      message: `Excellent clinical in-depth coverage: ${wordCount} words (1000+ pillar standard).`,
      value: `${wordCount} words`,
    });
  } else if (wordCount >= 600) {
    earnedWeight += 8;
    checks.push({
      id: "word_count",
      label: "Content Length",
      passed: true,
      severity: "good",
      message: `Solid content length: ${wordCount} words (recommended 600+ words).`,
      value: `${wordCount} words`,
    });
  } else if (wordCount >= 300) {
    earnedWeight += 4;
    checks.push({
      id: "word_count",
      label: "Content Length",
      passed: false,
      severity: "warning",
      message: `Content is ${wordCount} words (short, recommend expanding to at least 600 words for clinical trust).`,
      suggestion: "Expand your medical article with patient eligibility, recovery steps, or hospital credentials.",
      value: `${wordCount} words`,
    });
  } else {
    checks.push({
      id: "word_count",
      label: "Content Length",
      passed: false,
      severity: "error",
      message: `Thin content: ${wordCount} words (minimum 300 words required, 600+ recommended).`,
      suggestion: "Thin pages rank poorly on Google Health. Write thorough, helpful medical explanations.",
      value: `${wordCount} words`,
    });
  }

  // Check 11: Keyword Density Balance (Weight: 6)
  if (kw.length > 0) {
    if (keywordDensity >= 0.8 && keywordDensity <= 2.5) {
      earnedWeight += 6;
      checks.push({
        id: "keyword_density",
        label: "Keyword Density",
        passed: true,
        severity: "good",
        message: `Keyword density is ${keywordDensity}% (${keywordOccurrences} matches, optimal 0.8% - 2.5%).`,
        value: `${keywordDensity}%`,
      });
    } else if (keywordDensity > 2.5) {
      checks.push({
        id: "keyword_density",
        label: "Keyword Density",
        passed: false,
        severity: "warning",
        message: `Keyword density is high at ${keywordDensity}% (${keywordOccurrences} matches). Risk of keyword stuffing penalty.`,
        suggestion: "Use natural synonyms instead of repeatedly reusing the exact phrase.",
        value: `${keywordDensity}%`,
      });
    } else {
      earnedWeight += 2;
      checks.push({
        id: "keyword_density",
        label: "Keyword Density",
        passed: false,
        severity: "warning",
        message: `Keyword density is low at ${keywordDensity}% (${keywordOccurrences} matches).`,
        suggestion: `Use "${kw}" a couple more times throughout the body paragraphs.`,
        value: `${keywordDensity}%`,
      });
    }
  }

  // Check 12: Featured Image with Keyword in Alt Text (Weight: 5)
  if (input.featuredImageAlt && kw.length > 0 && imgAlt.includes(kw)) {
    earnedWeight += 5;
    checks.push({
      id: "image_alt_keyword",
      label: "Image Alt Text",
      passed: true,
      severity: "good",
      message: "Featured image alt text contains the focus keyword.",
      value: input.featuredImageAlt,
    });
  } else if (input.featuredImageAlt) {
    earnedWeight += 2;
    checks.push({
      id: "image_alt_keyword",
      label: "Image Alt Text",
      passed: false,
      severity: "warning",
      message: "Featured image has alt text, but does not contain the focus keyword.",
      suggestion: "Include your primary keyword in the image alt attribute for Google Image SEO.",
    });
  } else {
    checks.push({
      id: "image_alt_keyword",
      label: "Image Alt Text",
      passed: false,
      severity: "warning",
      message: "No alt text set for the featured image.",
      suggestion: "Add descriptive alt text to improve accessibility and image search discovery.",
    });
  }

  // Check 13: Internal and External Link References (Weight: 5)
  const linkMatches = content.match(/\[([^\]]+)\]\(([^)]+)\)|<a\s+[^>]*href="([^"]*)"/g) || [];
  if (linkMatches.length >= 2) {
    earnedWeight += 5;
    checks.push({
      id: "links_presence",
      label: "Link References",
      passed: true,
      severity: "good",
      message: `Article contains ${linkMatches.length} link citations / internal pathways.`,
      value: `${linkMatches.length} links`,
    });
  } else if (linkMatches.length === 1) {
    earnedWeight += 2;
    checks.push({
      id: "links_presence",
      label: "Link References",
      passed: false,
      severity: "warning",
      message: "Only 1 link found in article.",
      suggestion: "Link to accredited partner hospitals or Akeezo free consultation forms.",
      value: "1 link",
    });
  } else {
    checks.push({
      id: "links_presence",
      label: "Link References",
      passed: false,
      severity: "warning",
      message: "No internal or external reference links detected.",
      suggestion: "Add links to relevant medical treatments, doctor directories, or scientific journals.",
    });
  }

  const finalScore = Math.min(100, Math.max(0, earnedWeight));

  let grade: "poor" | "fair" | "good" | "optimal" = "poor";
  if (finalScore >= 80) grade = "optimal";
  else if (finalScore >= 65) grade = "good";
  else if (finalScore >= 45) grade = "fair";
  else grade = "poor";

  const passedCount = checks.filter((c) => c.passed).length;
  const warningCount = checks.filter((c) => !c.passed && c.severity === "warning").length;
  const errorCount = checks.filter((c) => !c.passed && c.severity === "error").length;

  return {
    score: finalScore,
    grade,
    focusKeyword: kw,
    wordCount,
    readingTimeMinutes,
    keywordDensity,
    keywordOccurrences,
    checks,
    passedCount,
    warningCount,
    errorCount,
  };
}
