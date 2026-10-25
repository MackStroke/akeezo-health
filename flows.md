# User flows and state machines

## Search and discovery

Focus search → suggestions appear → type at least two characters → debounce 250ms → cancel stale request → grouped results → keyboard selection or submit → detail page or search results. Suggestions are published data, not a hand-maintained duplicate array. No-results state suggests broadening filters and contacting Akeezo. Search query/filter state is reflected in URL; avoid logging raw health searches to third-party analytics.

Homepage Explore opens the observed treatment-selector pattern. Proposed Akeezo completion: choose a treatment → show a scoped exploration panel with treatment, hospital, doctor and destination options → navigate with `speciality` query. The selected context is visible and removable. Do not silently carry it into unrelated searches.

## Calculator

Reference landing layout is observed; only stages 1 and 2 were traversed. Detailed subsequent behavior below is proposed for Akeezo.

Landing → Start → stage 1 Treatment → stage 2 Destination → stage 3 Requirements → stage 4 Preferences → indicative result → optional coordinator enquiry.

| Stage | Fields | Validation / transition |
| --- | --- | --- |
| 1 | treatmentId, procedureId via search/cards | Published procedure required; Not sure routes to coordinator form |
| 2 | destinationId, cityId optional | Supported geography required; India preselected only if clearly shown |
| 3 | resident country, preferred timing, budget band optional, assistance needs | No diagnosis inference; no reports required for a generic estimate |
| 4 | accommodation preference, companion count 0–5, transfer/interpreter request, currency | Validate enums and quantities; unavailable service marked on request |
| Result | price range if approved, line items, exclusions, source/update date, validity | Missing components shown separately; request hospital quote CTA |

Desktop: left stepper ~240px, flexible right panel, search/category pills, two-column selection cards, sticky Back/Next footer. Mobile: progress at top, single-column cards and bottom controls. Next disabled until required data valid; Back preserves choices; editing procedure clears incompatible destination/pricing choices.

Calculation: resolve exact approved price rules; subtotal low/high for included treatment/logistics components; avoid duplicate included line items. Currency conversion uses a stored approved FX snapshot with source/time; if no current FX data, display original currency and omit conversion. Unknown hotel, flight or interpreter price is “On request”, never zero. Show “Indicative estimate; hospital evaluation determines the final written quote.” No fixed savings percentage without comparable evidence. A price rule cannot infer treatment eligibility from age or symptoms.

Results can be calculated without submitting contact information. User may intentionally send the selected context to a coordinator through an enquiry. Personal estimate saving is session/account scoped; a shared summary requires a separate deliberate action and limited token. Private health fields never go in query strings.

Reference stage 2 showed no destination prices. Akeezo must offer “Request a reviewed estimate” and allow Back rather than trapping the visitor. Never manufacture an estimate to avoid an empty state.

## Two-step journey planner

Observed reference has a two-step shell with procedure search and destination chips. Proposed Akeezo flow: (1) choose procedure or Not sure; (2) location, timing and logistical priorities. Results show matching published providers and a Request my plan action. Persist a plan only after deliberate save/submission. Do not market a deterministic filter as a clinical AI recommendation. AI chat is optional and not a prerequisite for a working planner.

## Enquiry

Open contextual form → choose preferred channel → enter minimum contact → read care-processing notice → consent → submit with idempotency key → transaction stores request → receipt shown → notification worker. Timeout retains key and input, offers retry; retry returns original receipt if already saved. Notification failure shows success for the accepted request and an internal notification warning in admin. No email/WhatsApp is sent to a provider automatically without a defined consented workflow.

## Compare and saved items

Choose same entity type → add 2–3 → tray shows selection count → comparison page. Reject cross-type combinations; replace/remove controls work. Fields: hospitals location/specialties/accreditation/languages/services; doctors specialty/credentials/experience/hospitals/languages; destinations provider availability/travel support/indicative costs. Missing values remain unknown. Compare factual attributes without declaring a medically best choice.

Guest saved items use local opaque entity IDs, with clear privacy notice and Clear all; account sync requires sign-in. Do not require login simply to view a profile. A deleted/unpublished saved record shows unavailable with remove action.

## Secure records

Account/case established → patient chooses report → upload authorization → private quarantine → file validation/scan → attach to case → permitted coordinator can access. No public URL, public image optimizer, email attachment or analytics capture. Patient can see upload status and retry; failed scan never becomes downloadable.

## Authentication

Sign-in opens a dedicated route/dialog with return path limited to same-site routes. Use established auth; MFA required for staff with sensitive access. Login failure is generic and rate limited. Logged-out access to saved/private case routes redirects to sign-in; public discovery remains available. No screenshots or claims about competitor's private dashboard are assumed.

## Community and reviews

Authenticated author submits → pending moderation → approved public projection. Report flags route to moderator. Show clear distinction between personal experiences and professional guidance. No publication of medical documents, addresses or contact details. Hospital review submission does not change aggregate rating until moderated; provider cannot approve its own reviews.

## Contact channels

Use verified Akeezo website contacts in content.md. Telegram channel URL is established project context; it is a broadcast destination, not automatically a private messaging handle. Never prefill a messaging link with the patient's medical narrative. Keep CTA copy explicit: call, WhatsApp, email, join channel or request a coordinator.
