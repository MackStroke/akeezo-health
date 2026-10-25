# SEO, structured data and discoverability

## Rendering

Every public content URL returns useful server-rendered HTML, one H1, title, description, canonical, Open Graph and Twitter metadata before hydration. View-source and JavaScript-disabled checks must expose the main content. Missing routes return HTTP 404, not a 200 SPA shell. Redirects happen server-side before streaming.

## URL and indexing rules

Use routes.md canonical mapping. Sitemap includes only published, publicly accessible, index-eligible canonical pages; lastmod is the meaningful published content change, not every request. Split large sitemaps by type and protocol limits; do not copy all reference URLs into the Akeezo sitemap. Every sitemap URL must resolve and self-canonicalize.

Noindex: internal search, comparison sessions, account/admin/partner/preview, form receipts, private estimates and filtered combinations without independent editorial content. Do not block a URL in robots.txt while relying on crawlers to read its noindex. Robots rules are not access control. Staging requires authentication/network control plus noindex; `robots.txt` alone is insufficient.

Index approved geographic/guide pages only when useful unique content, service coverage and valid relationships exist. Avoid mass-publishing all procedure × country combinations or near-duplicate city pages. Pagination uses crawlable links and a self-canonical for each meaningful page. Query permutations receive deterministic canonical policy; don't canonicalize distinct useful pages indiscriminately.

## Structured data

Use Organization for Akeezo, WebSite, BreadcrumbList, Article with genuine authors/reviewers where applicable, and suitable provider entity types for real hospitals/doctors. Do not describe Akeezo as the treating hospital. Use FAQPage only for visible eligible FAQ content and never promise a rich result. Include AggregateRating only for genuine eligible visible ratings with documented provenance. Do not emit fake price Offer data for an indicative range or unconfirmed treatment package.

Generate schema from the same public DTO as visible content. Escape serialized JSON safely, including `<` characters. Absolute URLs use the approved production origin. Every schema claim must correspond to visible content and an actual entity.

## AEO/GEO content structure

Give each guide a direct short answer, clear scope, concise headings, comparison tables where useful, author/reviewer identity, reviewed date and source list. Use consistent Akeezo business/contact information. A curated `llms.txt` can be considered later but is optional and does not guarantee AI visibility. Do not claim ranking, indexing, rich results or inclusion in AI answers.

## Migration

Before replacing akeezo.com, export current routes/metadata and create a mapping file. Preserve established `/about`, `/blog`, `/faq`, `/privacy`, `/terms`, `/refund-policy`, `/disclaimer`, `/consent`, `/grievance-officer`, `/join-partner`, `/insurance-agent-partner`, `/packages` and `/medicines` where applicable. Use one-hop redirects for moved equivalents; keep redirect history after subsequent edits. Verify internal links, canonical origins, hreflang and sitemap after private staging signoff and again after approved rollout.

## Localization

Hreflang only between real published equivalents, reciprocal links and x-default as appropriate. Language tag matches actual content; missing translation does not get a fake localized canonical. Sitemaps can carry alternate-language references. No personal medical information is included in URLs, page titles or social previews.
