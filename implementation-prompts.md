# Staged implementation prompts

Use these prompts in order with the complete blueprint folder available to your coding agent. They describe work to perform, not work already completed. Existing working code takes precedence over scaffolding assumptions. Keep a progress checklist and evidence of actual checks in the target repository.

## 0 — Inspect and plan the build

```text
Build Akeezo using docs/akeezo-blueprint/ as the specification. Read README.md,
skill.md, guide.md, design.md, routes.md and architecture.md before editing.
Inspect the repository, its AGENTS.md, current stack, routes, assets and scripts.
Preserve unrelated work and working integrations. If no application exists,
initialize the TypeScript MERN monorepo described in architecture.md.

Create a route/template/module checklist mapped to page-specs.md and
specialized-pages.md. Separate observed reference layouts from proposed flows.
Record supported package versions and architectural choices. Proceed with
reversible local work; use private fixtures for unavailable business data.
Do not publish publicly or replace the production Akeezo website.

Deliver the inventory, implementation sequence and concrete unresolved inputs.
Do not claim any page or workflow complete until it runs and passes its checks.
```

## 1 — Foundation and working vertical slice

```text
Implement React + Express + Node + MongoDB with TypeScript, shared schemas,
Vite builds and Express-owned React SSR. Follow architecture.md and deployment.md.
Use a local replica set or compatible managed test database for transactions.
Validate environment variables. Add request IDs and safe error handling.

Implement RouteEntry lookup and one draft/published content entity. Render a
real published MongoDB record in SSR HTML, hydrate it, support client navigation,
and return a genuine HTTP 404 for a missing path. Do not insert private fields
into initial HTML. Separate public DTOs from admin persistence models.

Verify production builds, direct URL loading, HTML metadata, hydration without
warnings, 404 status and restart persistence. Document the actual commands run.
```

## 2 — Visual system and reference layout

```text
Implement design.md and components.md with Akeezo's verified Lato, teal/orange
brand palette and validated official SVG assets from assets.md. Build the home
and inner-page header variants, home search and Explore dialog, breadcrumbs,
directory hero/search overlap, card families, CTA bands and full footer.

Build the homepage and hospital directory first, preserving the documented
section sequence, proportions, whitespace, card radius and content density.
Use private fixture content where required and mark it as non-production.
Do not use competitor logos, statistics, testimonials or unlicensed imagery.

Check 1440, 1366, 1024, 768 and 390 CSS-pixel widths. Capture screenshots and
compare desktop geometry to the reference audit. Mobile layouts are proposed
and require usability checks. Verify keyboard interaction, dialog focus,
contrast, long names, missing media and no horizontal page overflow.
```

## 3 — Admin and publication lifecycle

```text
Implement database.md, admin.md and the admin API portion of api.md. Add session
authentication, server-side role/object permissions and audit events. Build
editors for settings, navigation, homepage modules, taxonomy and provider data.

Use immutable revisions, optimistic concurrency and separate published
pointers. Publish must validate references and atomically update the record,
RouteEntry, audit event and outbox job. Implement private preview, unpublish,
restore and visible delivery status. Do not let public loaders query drafts.

Demonstrate: edit homepage CTA -> save draft -> public unchanged -> preview
draft -> authorized publish -> public updated after reload/restart -> restore.
Test stale-version conflict, rejected unauthorized publish, missing media,
slug collision and worker retry. Persist all editable settings in MongoDB.
```

## 4 — Directories, profiles and destinations

```text
Implement treatments/procedures, hospitals, doctors and destination/city
templates from page-specs.md. Reuse typed components without flattening their
distinct page layouts. Add MongoDB-backed filtering, search, pagination,
related-content projections and exact route registration.

Implement URL-driven filter state and back navigation; reset pagination when
filters change. Build galleries, anchor tabs, sidebars, accordions, comparison
and saved items with their real state contracts. Hide unsupported review and
pricing claims. Show clear empty, loading, unavailable and error states.

Verify direct detail URLs, relationships, filters, stale/deleted records,
unauthorized draft exposure, empty data and responsive layouts. Ensure published
provider edits reach both profiles and directory cards through the same data.
```

## 5 — Calculator, planner and enquiries

```text
Implement flows.md and api.md for calculator, treatment planner, contact and
contextual enquiry. Preserve the reference's calculator landing and left-stepper
wizard structure. Stages 3–4 and results are proposed Akeezo flows.

Use only approved versioned price records; never fabricate an estimate when
coverage is unavailable. Retain selected treatment/destination into an enquiry.
Persist valid submissions with idempotency, consent version and receipt ID
before showing success. Deliver notifications asynchronously and surface failures
to coordinators. Give patient documents a separate authenticated/private path.

Test supported and unsupported pricing, edits/back steps, validation, retries,
duplicate submission, database failure, notification failure and restricted
coordinator access. Verify that health details never appear in URLs or analytics.
```

## 6 — Editorial, geographic and support templates

```text
Implement every remaining core template in page-specs.md and G01–G10 in
specialized-pages.md: blog/article/contributor, country/city procedure pages,
cost/safety/recovery/combined/comparison, before-after, company, mission,
contact, FAQ, help and legal. Build package and experience layouts as specified;
mark proposed detail behavior rather than claiming it was reference-observed.

Use typed content sections, approved reusable references and per-page SEO
metadata. Register overlapping nested routes explicitly. Every editorial page
must preserve its own subject and reviewer relationship. Sanitize rich text.
Do not create thousands of thin pages from the sitemap inventory.

Verify every template with realistic private fixture data, long content,
empty sections and missing optional media. Validate canonicals, headings,
breadcrumbs, anchor offsets and cross-links. Require consent for gallery media.
```

## 7 — Partner, community and existing Akeezo services

```text
Implement the partner landing, comparison and application flow without invented
subscription prices. Add scoped partner drafts and admin review. Build the
community feed/explore/detail interfaces behind a feature flag until moderation
is staffed; do not reproduce the reference's broken explore link.

Preserve current Akeezo service entry points and route migration from routes.md,
including medicines, home healthcare, emergency and insurance-agent partnership.
Do not imply medicine checkout or emergency dispatch integrations that do not
exist. Preserve reviewed contact/Telegram links through SiteSettings.

Test partner object scoping, public moderation status, report handling,
application persistence, disabled-feature navigation and legacy redirects.
```

## 8 — Complete and hand off private staging

```text
Execute testing.md and security.md against the actual application. Complete
the route/template checklist, metadata crawl, responsive screenshots, keyboard
checks, permission/draft leakage tests, upload controls and publication tests.
Implement approved old-to-new URL mappings, sitemap inclusion, locale handling
and noindex on private/staging surfaces. Verify backups and restore procedure.

Build a private staging release. Produce actual test results, screenshots,
configuration instructions, migration/rollback steps and unresolved launch gates
from decisions-and-gaps.md. Clearly distinguish implemented, verified, disabled
and pending-input features. Do not claim public rollout or exact visual parity
unless those actions and comparisons have actually occurred.
```

## Useful correction prompts

**Layout drift:** “Compare this page against design.md and its page contract. List section-order, width, spacing, typography and component mismatches. Correct them without changing the approved content model or reducing the page to a generic layout. Provide before/after captures.”

**Admin edits do not appear:** “Trace this field from editor to request validation, MongoDB revision, published pointer, public projection and cache. Reproduce the failure, fix the broken stage, and verify draft isolation plus publish/reload/restore. Do not hardcode a frontend fallback.”

**Incomplete feature:** “Follow the action from button to route/API, persistence and visible outcome. Implement the missing stages, add meaningful failure states and test the whole workflow. Remove completion claims unsupported by actual checks.”
