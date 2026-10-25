# Product requirements

## Outcome

Akeezo becomes a coherent medical care discovery and coordination website with the reference's search-led homepage, catalogues, detailed provider pages, cost-planning tools and supporting content. Patients can explore options, compare relevant information and send a contextual request to a coordinator. Staff can maintain the entire website without code edits.

## Audience

Patients within India; international patients considering care in India; accompanying family members; hospitals, doctors and other approved care partners. Preserve Akeezo's existing home-care and emergency coordination offerings. International content should support English initially with reviewed Russian and Uzbek translations, reflecting the established Akeezo audience. These are proposed launch locales, not a claim that all current website text is translated.

## Product boundaries

The site coordinates healthcare; medical diagnosis, treatment selection, final clinical quotations and fitness-to-travel decisions belong to qualified providers. A request is not a booking. Discovery and estimate generation should not require account creation. Patient accounts enable saved items and secure journey records.

## Scope and stages

| Stage | Deliverables | Exit condition |
| --- | --- | --- |
| Foundation | Theme, shell, route registry, SSR, auth, content revisions, media | Public/private separation and first publish round trip pass |
| Core site | Home; treatment/procedure, hospital/doctor/destination lists and details; blog; company/support/legal | Every template renders from approved data and matches layout |
| Conversion | Search, 4-step calculator, 2-step planner, enquiry forms, comparison, saved items | End-to-end flow persists and errors recover |
| Operations | Full admin, partner applications, patient dashboard, assigned enquiries | Role and object authorization verified |
| Extended parity | Geographic landing pages, cost/safety/recovery guides, before/after, contributor pages, packages, experiences, community | Templates and moderation work; content-dependent modules launch only with approved content |
| Release | URL migration, security, backups, visual QA, performance, private UAT | Release checklist accepted; public rollout separately authorized |

All reference template families are specified. A feature flag may defer public exposure of unsupported business content; it must not conceal unfinished implementation from the completion report. No paid partner subscription billing, prescription checkout or automated clinical triage is included by default. The pricing layout is implemented as configurable partner-option cards/table; amounts require approved Akeezo terms.

## Functional requirements

FR-01: Search published treatments, procedures, hospitals, doctors and destinations with keyboard-operable suggestions.
FR-02: Support shareable filters and paginated results; no duplicated rows or resets on Back.
FR-03: Detail pages relate only to verified published providers/content; hide missing sections with their tabs.
FR-04: Compare 2–3 records of the same type using consistent fields and unknown values shown honestly.
FR-05: Estimate from approved price rules with provenance, inclusions, exclusions and expiry. Missing pricing routes to human review.
FR-06: Enquiries store consent, context, source and status; notifications are separate from acceptance.
FR-07: Admin edits have validation, preview, conflicts, publication and revision restoration.
FR-08: Partners submit applications and profile edits for review; they cannot publish or access unrelated enquiries.
FR-09: Patient records and uploaded reports are private, auditable and accessible only to permitted users.
FR-10: Every public page has server-rendered metadata, correct HTTP status, accessible content and a route-level empty/error state.

## Nonfunctional targets

Target WCAG 2.2 AA; 320–1920px layouts without accidental overflow; real-user p75 LCP ≤2.5s, INP ≤200ms and CLS ≤0.1 after launch. Before launch use mobile lab runs as a proxy, not proof of field performance. Set provisional API targets of p95 public reads <500ms and enquiry acceptance <1s under the agreed load profile. Establish load volume during infrastructure planning, then record it with results.

## Measurement

Track search completion, provider detail engagement, estimate completion, enquiry acceptance, coordinator contact and qualified-enquiry rate. Store aggregate event counts only; never send treatment searches, medical free text, report names, contact details or patient identifiers to advertising analytics.
