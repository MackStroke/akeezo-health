# Akeezo MERN website blueprint

Prepared 25 October 2026. Reference: https://curemeabroad.com. Brand source: https://akeezo.com.

## What this pack does

Specifies a high-fidelity recreation of the reference website's layout, page hierarchy and interactions using Akeezo branding and a MongoDB, Express, React and Node.js stack. This is an implementation specification, not a finished website or a copy of the reference source code.

Research covered all 21 routes in the reference's static sitemap, additional linked pages, and representative detail and editorial templates. Seventeen unique child sitemaps advertised 26,226 distinct URLs. Their full URL inventory is included. Individual provider records and every generated URL were not opened. Desktop layouts were visually inspected; mobile rules are proposed implementation requirements, not measured reference behavior. See [reference-audit.md](reference-audit.md) for evidence and limitations.

## Start here

1. Put this folder at `docs/akeezo-blueprint/` in the project.
2. Give your coding agent [guide.md](guide.md), [skill.md](skill.md), [design.md](design.md), and [architecture.md](architecture.md).
3. Run the staged prompts in [implementation-prompts.md](implementation-prompts.md). Complete each stage's checks before moving on.
4. Use the route registry and page contracts to build every template. Do not turn this into a single generic landing page.
5. Build in a private local/staging environment. Public deployment and replacement of the existing Akeezo site require the owner's approval.

## Documents

| File | Purpose |
| --- | --- |
| [skill.md](skill.md) | Project-specific instructions for the implementation agent |
| [AGENTS.md](AGENTS.md) | Compact repository instruction entry point |
| [prd.md](prd.md) | Scope, audience, priorities and completion conditions |
| [reference-audit.md](reference-audit.md) | Inspected routes, observations, defects and research limits |
| [routes.md](routes.md) | Akeezo route families, redirects and route resolution |
| [design.md](design.md) | Verified brand tokens, desktop geometry and responsive rules |
| [page-specs.md](page-specs.md) | Home, directories, profiles, support, corporate and editorial pages |
| [specialized-pages.md](specialized-pages.md) | Geographic, cost, safety, recovery, comparison and gallery pages |
| [components.md](components.md) | Reusable component contracts and interaction states |
| [architecture.md](architecture.md) | MERN architecture, SSR, folder structure and publication flow |
| [database.md](database.md) | MongoDB collections, fields, relationships and indexes |
| [api.md](api.md) | Public, patient, partner and admin API contracts |
| [admin.md](admin.md) | Editable-content contract, roles and workflows |
| [flows.md](flows.md) | Search, calculator, planner, enquiries, comparison and account flows |
| [content.md](content.md) | Akeezo copy, content governance and localization |
| [assets.md](assets.md) | Official logo sources and replacement media requirements |
| [seo.md](seo.md) | SSR metadata, structured data, URL migration and indexing |
| [security.md](security.md) | Sessions, access control, health data and upload handling |
| [testing.md](testing.md) | Functional, visual, accessibility and security acceptance tests |
| [deployment.md](deployment.md) | Environments, operations, rollout and rollback |
| [guide.md](guide.md) | Build order and developer handoff |
| [implementation-prompts.md](implementation-prompts.md) | Ready-to-paste staged build instructions |
| [decisions-and-gaps.md](decisions-and-gaps.md) | Explicit assumptions, missing inputs and release gates |
| [sources.md](sources.md) | Evidence provenance and official technical references |
| [evidence/sitemap-summary.md](evidence/sitemap-summary.md) | Counts and examples from each child sitemap |
| [evidence/reference-url-inventory.md](evidence/reference-url-inventory.md) | All sitemap-discovered URLs; discovery does not mean page inspection |

## Fidelity and truthfulness

Preserve section order, proportions, whitespace, rounded cards, search placement, galleries, tabs, CTA placements and directory density. Substitute Akeezo's official logo, colors, typography, original copy and authorized media. Do not publish competitor reviews, ratings, accreditations, prices, staff, provider relationships or promotions as Akeezo facts. Correct observed broken states and preserve Akeezo's existing service routes. A pixel-exact claim requires a later screenshot comparison against a frozen reference at identical viewports; this documentation alone cannot establish it.

`skill.md` is a project handoff file. This pack does not install or modify a personal ChatGPT skill.
