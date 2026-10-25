---
name: akeezo-reference-mern-build
description: Build Akeezo using the audited CureMeAbroad page layouts and the accompanying MERN project specification.
---

# Akeezo reference implementation skill

## Trigger and objective

Use for implementation or review of this Akeezo rebuild. Match the audited reference's structure and visual composition while using Akeezo content and branding. Required stack: MongoDB + Express + React + Node.js, with TypeScript. Keep public rendering SEO-capable. Do not silently replace this stack with Next.js, a hosted page builder, Firebase, Supabase or a SQL database.

## Required reading

Read README, prd, reference-audit, routes, design, page-specs, specialized-pages, architecture, database and api. Then read the relevant admin, flows, content, assets, seo, security and testing files before implementing those features. Read decisions-and-gaps before inventing data. The documents are co-located with this file.

## Workflow

1. Inspect the repository and its existing instructions. Report its actual structure; preserve working integrations and data. Treat all paths and APIs in this blueprint as proposed until implemented.
2. Create a traceability table: route → page template → components → content models → public endpoint → admin editor → tests.
3. Implement the design tokens and shared shell first. Match the homepage and one directory page before spreading components across routes.
4. Build MongoDB persistence, validation and authorization. Use immutable published revisions with a separate draft. Public reads must never expose draft content or patient records.
5. Implement every applicable template from the route matrix, including nested geographic and editorial routes. Reuse templates without erasing their structural differences.
6. Connect admin editors, protected previews, publish/restore, search and forms. A success message must correspond to a durable server write.
7. Use verified Akeezo content or clearly marked private fixtures. Omit unavailable public claims and hide unsupported promotion modules. Do not fill empty data with invented statistics.
8. Verify the full workflows, SSR responses, permissions and responsive rendering. Keep evidence of actual tests and acknowledge blocked tests.
9. Deliver a private preview and a completion report. Do not make the live domain public or replace the current site without the owner's explicit approval.

## Design rules

- Follow the reference's layout families; do not substitute a generic SaaS homepage.
- Use the official Akeezo logo intact, including its tagline variant where specified. Never redraw it from memory.
- Use measured desktop geometry in design.md as the initial baseline. Mobile values are proposed and require implementation QA.
- Use Akeezo Lato typography; tune widths and line breaks to preserve composition rather than forcing competitor typography.
- All CTA, tab, filter, pagination, accordion, modal, save and comparison controls need defined behavior.
- Fix reference defects: dead links, mismatched content, blank results without recovery, Markdown leaked into prose, and fake or stale badges.

## Backend rules

- Never trust frontend permissions, provider IDs, submitted prices or upload MIME strings.
- Validate a known route registry rather than guessing whether a slug is a country, procedure or city.
- Store media in durable object storage and metadata in MongoDB. Sensitive records use a separate private bucket.
- Persist enquiries before queuing notifications. Idempotent retries must not create duplicate enquiries.
- Do not label a consultation request as a confirmed appointment or an indicative estimate as a final quote.
- Use approved server-side integrations; do not expose credentials to the React bundle.

## Definition of done

Every in-scope route resolves correctly, data survives refresh, drafts remain private, admin publication updates public SSR and dependent listings, forms persist, navigation has no dead ends, and the testing matrix passes. Report unresolved provider data or brand assets without falsely claiming full production readiness. A build passing alone is insufficient.
