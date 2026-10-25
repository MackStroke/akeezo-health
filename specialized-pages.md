# Specialized reference page templates

These families account for most sitemap URLs. Build templates and registered content entries, not thousands of hardcoded React components. Never publish every possible treatment × location combination automatically. Each published route requires unique useful content, valid relationships and real service coverage.

## G01 — Speciality in a country

Reference example: https://curemeabroad.com/treatments/neurology/india.

Sequence: tinted split hero with location badge, H1, brief summary, 2–3 metrics and primary/secondary CTA; destination photo right; verification/service strip; horizontal sticky anchor bar; overview and small facts; procedure grid; cost block when available; hospitals; coordination interstitial; doctors; approved stories; why this destination; FAQs; reviewer and updated date; shared bottom.

Use treatmentId + destinationId relations. CTAs preselect those IDs. Titles follow “{Speciality} in {Destination}: hospitals, doctors and care planning”. Metrics derive from published relations, not reference page numbers. Certification tiles belong to verified facilities; replace category-wide certification claims with coordination benefits.

## G02 — Procedure in a country

Reference example: https://curemeabroad.com/treatments/neurology/brain-aneurysm-treatment/india.

Same geographic hero, but procedure-specific sections: overview, indicative costs, hospitals, doctors, risks, pre-enquiry checklist, FAQs, other supported destinations. Do not insert a before/after section merely because the reference anchor exists; many procedures are unsuitable for cosmetic outcome imagery. Require procedureId to belong to the selected specialty and pricing coverage to match the destination.

## G03 — Country cost pages

Examples end in `/india/cost`, at speciality or procedure depth. Sequence: breadcrumb and cost-led title; approved range or “Request an estimate”; CTA; line-item/inclusion data; factors affecting costs; provider lists; coordination banner; FAQs; medical/source review block. The reference showed sparse data in some panels. Akeezo must handle that intentionally: explain that a hospital review is needed, without fabricating a numeric range.

## G04 — Procedure cost guide

Reference: https://curemeabroad.com/treatments/cosmetic-plastic-surgery/breast-augmentation/cost.

Two-column editorial hero: left large title, introduction, price panel, trust/service row and two CTAs; right relevant authorized illustration/photo, approximately portrait ratio. The price panel may use a teal band for the estimate and white band for exclusions or another genuinely comparable quote. Do not publish a “with Akeezo / without Akeezo” savings comparison unless both datasets share currency, date and clinical scope and are substantiated.

Below: destination/city cost comparison → approved stories → detailed price table → included/excluded columns → cost drivers → risk/checklist accordions → questions before payment → reviewed recovery summary → FAQs → reviewer block. Data: Procedure, PriceRule, LocationGuide, Article sections. Numeric tables are generated from structured price data, never parsed from prose.

## G05 — Safety guide

Split editorial hero, short scope statement and consultation CTA. Then risk categories, procedure-specific considerations, signs requiring clinical follow-up, provider-check questions, consented stories if appropriate, FAQs, reviewers and sources. Card hierarchy can mirror the reference. Medical copy remains a draft until qualified review. Do not copy competitor's estimates of complication risk or promise safety based on geography.

## G06 — Recovery guide

Split editorial hero → milestone timeline → stage cards → expected variation → clinician-contact section → travel/flight planning → packing/support checklist → approved patient story → FAQs/reviewer. Timeline data must carry source, review date and explicit individual-variation wording. Do not auto-generate instructions about exercise, medications, flying or urgent symptoms from template names.

## G07 — Procedure city guide

Reference: `/treatments/cosmetic-plastic-surgery/mommy-makeover/istanbul`. Use Akeezo-supported city records. Sequence: city/procedure hero → local provider landscape → logistics cards (airport, transfer, accommodation, companion) → coordinator journey timeline → providers → approved stories → questions/checks → FAQs → reviewer. Distinguish logistical editorial content from medical eligibility. City slugs resolve by RouteEntry; do not confuse a city with a country sharing a name.

## G08 — Combined procedures

Reference contains a combined-procedure route separate from its ordinary procedure records. Use a `combinedProcedure` guide referencing two or more procedure IDs. Hero → what each part covers → considerations in combined planning → itemised estimate-request panel → authorized illustrations → consented stories → FAQs/reviewer. Do not automatically add prices or imply combined surgery is clinically appropriate. A clinician must assess the person.

## G09 — Procedure comparison

Reference example ends `/tummy-tuck-vs-liposuction`. Hero → side-by-side explanation → semantic comparison table → original explanatory visuals → decision factors → related combined-procedure page where approved → outcome variation → FAQs/reviewer. Comparisons explain differences and questions to discuss, not algorithmically choose a treatment for a patient. Columns reference actual procedure IDs with stable labels. On mobile, each comparison row stacks label + option A + option B, preserving meaning.

## G10 — Before/after directory and detail

Directory: heading/short context → procedure grid → filters/pagination. Detail: split hero + optional estimate card → comparison gallery → context for interpreting images → outcome variables → limitations/risks → reviewed recovery context → FAQs/reviewer. Image pair metadata: same case, procedure, elapsed time, permission record and truthful caption. Never use generated images as patient evidence.

Comparison slider is a real accessible range input; arrows move in 5% increments, Home/End set endpoints, visible before/after labels remain. Equal aspect ratio and crop alignment are required. Provide side-by-side fallback and alt descriptions. Consent withdrawal removes affected public assets and cache variants while preserving necessary audit evidence under retention policy.

## Generic editorial schema

`Guide.kind` discriminates cost, safety, recovery, city, combined and comparison pages. Allowed blocks: prose, facts, comparisonTable, priceTable, timeline, checklist, image, gallery, relatedCollection, faq, reviewer. Sections have stable IDs and constrained variants. No arbitrary JSX, scripts or remote embeds in the editor. Every route validates required references and its subject before publishing. A heading mentioning another procedure triggers an editorial validation warning and a reviewer check.
