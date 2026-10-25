# Admin panel and editable-content workflow

## Navigation and permissions

Sidebar: Overview; Pages; Treatments & Procedures; Hospitals; Doctors; Destinations & Cities; Pricing & Packages; Guides & Blog; FAQs; Testimonials & Galleries; Partners; Enquiries & Cases; Community; Media; Navigation; Settings; Users & Access; Audit History. Show modules according to role and implementation state. Overview uses real counts of pending reviews, enquiries and failed publication jobs; never fabricated traffic metrics.

| Role | Permissions |
| --- | --- |
| Content editor | Draft content, upload editorial media, preview, submit for review |
| Medical reviewer | Review medical content and evidence; cannot manage access or patient records by default |
| Publisher | Publish/unpublish approved content, restore revisions, manage route redirects |
| Coordinator | View assigned enquiries/cases, update operational status, request consented provider sharing |
| Partner manager | Review applications and scoped provider submissions |
| Moderator | Review/redact/reject community posts and reports |
| Administrator | Settings and access administration; sensitive case access separately granted |
| Partner | Only assigned organization/provider drafts and explicitly assigned enquiry fields |

Server enforcement is authoritative. A hidden menu is not authorization. Role combinations are explicit; administrator status should not silently grant unlogged medical document access.

## Content contract

| Website element | Admin location | Validation / storage | Publication and acceptance |
| --- | --- | --- | --- |
| Home logo/search/hero | Pages → Home | Headline/tagline, media IDs, 5 suggestion refs, two feature cards | Save draft; preview identical renderer; publish updates home |
| Theme and contacts | Settings → Brand/Contacts | Color allowlist, official logo variants, valid HTTPS/tel/mailto | Global revision; no broken nav or external competitor links |
| Directory heroes | Pages → directory | Heading ≤100, summary ≤220, focal point, search label | Correct directory template; public sees published revision |
| Featured collections | Pages → featured slots | Existing published IDs, explicit order, maximum slots | Listing caches refreshed when record changes/unpublishes |
| Provider profiles | Hospitals/Doctors | Identity, relationships, media, source-backed facts | Reviewer state separate; valid profile appears in correct filters |
| Geographic guides | Guides → Location | Subject and location relations; kind-specific blocks | Valid RouteEntry required; no duplicate/colliding path |
| Treatment prices | Pricing | Minor-unit low/high, currency, inclusions, source, expiry | Only approved current rules produce estimates |
| Shared service cards | Settings → Conversion | 3 cards, images, labels, CTA destinations | All placements update together |
| Promotions | Offers | Terms, eligibility, start/end and evidence | Expired/unapproved hidden; service fallback used |
| Articles/guides | Editorial | Structured text, author, reviewer, sources, images | Medical review gate; public metadata matches content |
| FAQs | FAQs | Question ≤180, answer ≤2000, category, references | Reused safely across matching pages |
| Gallery/testimonials | Galleries | Consent and rights evidence, caption, review | Consent withdrawal unpublishes affected media |
| Footer/navigation | Navigation | Valid route/external URL, label, order, nesting ≤2 | No draft/dead destinations; affected pages refreshed |
| Legal | Pages → Policies | Version/date/owner-approved content | Consent points to active version; old versions retained |
| Enquiries | Enquiries | Status, assignee, notes, audit | Durable operational updates; never exposed in public DTO |

## Editor UI

Header: title, current status, last save, version, preview, save draft, submit review and authorized publish action. Tabs: Content, Media, Relations, SEO, Review, Revisions. Forms have field-level validation, unsaved-change warning and reliable network error state. Publish summary shows affected URLs and unavailable references. Do not permit arbitrary layout classes, scripts or HTML embeds.

Page sections can be reordered only within template-defined zones. Keep critical hierarchy locked: hero before listings, breadcrumb before hero, footer last. Disabling a section disables its anchor link automatically. Brand tokens are centrally controlled; editors cannot create page-specific random colors.

## Publication sequence

Edit → server validates → persist immutable draft revision → authorized preview → submit review → record reviewer approval for that exact revision → publisher validates expectedVersion and all references → transaction commits publication → delivery job refreshes dependencies → status becomes delivered. Editing after review invalidates review approval. Public page remains on prior revision until publish. Preview is private/no-store/noindex and uses the same template renderer.

Conflicting save: return 409, show current server version and allow comparison/reapply; never overwrite silently. Restore creates a new draft from a selected revision and follows the same review/publish process. Unpublishing a hospital removes it from doctor affiliations/listings or displays a safe unavailable state, according to relation policy.

## Enquiry workflow

Statuses: received → triage → contacted → options-prepared → awaiting-patient → closed, with explicit outcome (converted/not-proceeding/duplicate/spam). Do not infer conversion from a button click. Assignment changes are audited. Notes and reports have separate permissions. Export requires an explicit capability and excludes reports by default. Notifications contain receipt ID and secure link only.

## Partner review

Application received → evidence check → accepted/rejected/needs-info. Acceptance creates an organization membership, not a public provider record automatically. Partner profile drafts go through content/verification review. Commercial terms are not editable by applicants. No global lead inbox in partner UI.
