# Primary page contracts

All pages use the route map, shared shell and design.md. Section sequences below are mandatory starting points; conditional sections and their tabs disappear together when content is unavailable. Each public render uses published revisions only. All CTAs have source page/entity context.

## H01 — Homepage `/`

Sequence: HomeHeader → BrandSearchHero → SuggestionChips → EstimateFeatureCard + ExploreFeatureCard → TrustStrip → three ServiceOfferCards → PlanningCTA → DirectoryFooter.

The estimate card opens `/cost-calculator`; Explore opens TreatmentSelectorModal. Selecting a treatment sets explicit speciality context and offers treatment, hospital, doctor and destination links. Search uses suggestions and `/search?q=`. Chips use oncology, cardiology, orthopaedics, neurology and fertility draft categories; the taxonomy editor selects final labels. Keep reference visual positions; do not transplant the old Akeezo tabbed booking form into the new hero.

Use verified metrics only. If none are approved, render three compact benefits in the same trust-strip footprint: hospital options, itemised estimates, one coordinator. Replace reference discount cards with Akeezo service cards unless an actual promotion is approved. Admin: Pages → Home with constrained section slots, linked images, CTAs and featured collections. Empty state: functional search + coordinator CTA remains.

## L01 — Treatment directory `/treatments`

Sequence: InnerHeader → image hero with overlapping search → featured treatment carousel → coordination CTA strip → all-treatment grid → PlanningCTA → footer. Card: 4:3 image, H3 title, 2–3-line summary and detail link; do not dump complete medical descriptions into cards. Search matches published categories and procedures. Featured items and order come from admin; otherwise show alphabetically. No generic accreditation badge on every category. Data: Treatment, Procedure, Page, Media.

## L02 — Hospital directory `/hospitals`

Sequence: breadcrumb → hospital image hero/search → tabs (Featured, Recently viewed, Explore) → filters → featured cards → coordination banner → recently viewed (when real history exists) → all results/pagination → PlanningCTA/footer. Cards: image, save control, name, location, key specialties, verified accreditation if documented, detail link. Show name/location before description. Recently viewed stores only opaque IDs locally and offers clear-history; never fabricate visits. Country filter defaults to supported India coverage, with cities selectable. Do not display a global network simply because the reference does.

## L03 — Doctor directory `/doctors`

Use matching directory hero and search; Featured / All doctors / Compare tabs; speciality/location/language filters; portrait grid; optional approved patient-story banner; pagination; hospital cross-links. Cards: portrait, name, specialty, hospital relation, years of experience when sourced, profile link and separate compare/save buttons. Rank badges are not shown unless a published ranking methodology exists. No inherited reference badges or affiliations.

## L04 — Destination directory `/destinations`

Hero/search → featured carousel with title/CTA left and image cards right → coordination banner → all destination cards → confidence/coordination interstitial → remaining cards/pagination → shared bottom. Launch with verified India destination and supported Indian city cards; architecture remains multi-country. Avoid empty carousel controls when one item exists. Country detail and city detail are distinct registered types.

## D01 — Treatment detail `/treatments/:speciality`

Sequence: breadcrumb → split image/introduction → indicative metrics band (conditional) → anchors → service cards → four insight tiles → overview + cost sidebar → procedure carousel → related doctors → related hospitals → destinations → FAQs → shared bottom. Anchors: Insights, Overview, Procedures, Doctors, Hospitals, Destinations, FAQs. CTA: Request guidance, retaining treatment ID. Cost panel: approved range, currency, date, inclusion note and estimate link; fallback Request an estimate. Editorial medical content requires reviewer attribution and review date.

## D02 — Procedure detail `/treatments/:speciality/:procedure`

Reuse D01 hero with procedure-specific summary. Sequence: overview/facts, preparation and risks, reviewed do/don't guidance, related providers, similar procedures, available destinations, FAQs. Facts may include duration and stay only when sourced and explicitly indicative. Do not suggest all patients are eligible. Cost button preselects both speciality and procedure IDs. Link to cost/safety/recovery/locations only when those pages are published.

## D03 — Hospital detail `/hospitals/:slug`

Breadcrumb and Share/Review/Save → name/type/ownership/address → gallery → anchors → service cards → overview/accreditation + price sidebar → specialty chips → international patient support → payment methods → facility/accessibility/room-type icons → procedures and prices → doctors → location → related hospitals → FAQ if available → shared bottom.

Main column is about two thirds. Price/consultation sidebar remains in flow on mobile. Gallery opens accessible lightbox with keyboard Next/Previous/Close. Map is lazy and has textual address fallback. Accreditation shows issuing body, source, expiry and exact facility scope; unknown means omitted. Hospital counts, founding year and ICU capacity are editable sourced fields. A hospital connection request is sent to Akeezo's coordination queue, not claimed as confirmed direct hospital contact.

## D04 — Doctor detail `/doctors/:slug`

Breadcrumb + Share/Save → portrait/identity/specialty → metrics → anchor tabs → service cards → biography and credentials → experience/education accordions → hospital affiliations → consultation request → procedures → approved reviews → similar doctors/comparison → FAQs → shared bottom. Only show a verified badge when its verification record is valid. Reviews show provenance, date and permission; external review data cannot be copied wholesale. Missing ratings show no aggregate rather than 0/5.

## D05 — Destination detail `/destinations/:country`

Breadcrumb/actions → headline/summary → image mosaic → anchors → overview and estimate panel → patient stories → treatments → hospitals/doctors → practical travel information → optional experiences/lifestyle cards → FAQs → destination comparison → shared bottom. Akeezo India content emphasizes hospitals/cities, coordination and practical preparation. Travel/visa assertions carry source and review dates. City variant substitutes city logistics, city hospitals and transport data; it is proposed, not an observed reference city-directory page.

## E01 — Blog directory `/blog`

Featured article takes about 58% width; Latest posts list about 40%. Featured image 16:9, title/excerpt/date below; latest list uses 80×64px thumbnails and separators. Three-column article grid below. Search/category filters are a proposed enhancement and must not displace the reference's feature composition. One H1 for the page; article cards use H2/H3 (the reference exposes multiple H1s; correct this). Pagination uses crawlable links.

## E02 — Article `/blog/:slug`

Breadcrumb → headline/deck → author and medical reviewer/date → cover → optional table of contents → structured article body with tables/checklists → related provider/treatment links → references → reviewer cards → related articles → shared bottom. Reading column max 800px; TOC can occupy a desktop sidebar. No clinical claims authored from competitor text; publish reviewed Akeezo articles with sources. Support citation links and correction history in admin.

## E03 — Contributor `/contributors/:slug`

Portrait/name/role → short bio → qualifications → experience → credentials and relevant memberships → authored/reviewed content. Links to professional evidence require verification. Do not turn a content reviewer into an available treating provider unless a separate Doctor record exists.

## C01 — About `/about`

Breadcrumb → two-column story hero with photo collage → actual metrics/reviews strip → team cards → real press articles → testimonial mosaic → coordination CTA/footer. Retain composition while writing original Akeezo story. Hide team/press if assets or evidence are missing. Do not invent founders, history or media coverage. Use layout placeholders only in private review.

## C02 — Mission `/mission-vision`

Centered tinted title/introduction → mission prose → four values cards (two columns) → vision prose → two-action closing panel. Narrow reading width ~850px. Approved Akeezo copy centered on access, budget clarity and coordinated care.

## C03 — Partnerships `/partnerships`

Split hero + image → verified network/metrics → partner logos → four configurable partner-option cards → six benefit cards → four-step process → FAQs → join CTA. Preserve reference layout; use Akeezo partner groups and approved commercial terms. No copied fees or conversion guarantees. Application links go to `/join-partner?type=`. Include hospitals, doctors and care professionals; referral/insurance pathways stay separate from patient messaging.

## C04 — Partner options `/partner-options`

Centered title → responsive comparison table, with columns from approved option records → FAQs → join CTA. Desktop sticky first column and semantic table; mobile horizontal scroll within the table with visible label. If pricing isn't approved, show services/eligibility and “Discuss partnership”; hide amount fields. No checkout unless separately scoped.

## C05 — Join partner and insurance partner

Proposed form completion: role choice; organization/person name; country/city; professional registration where relevant; business contact; website; service categories; message; explicit privacy consent. Upload evidence only after secure application/session creation. No public profile until reviewed. Insurance-agent route retains dedicated contextual copy and preselected partner type.

## S01 — Contact `/contact`

Centered heading/two short paragraphs → two columns: labeled enquiry form left, contact methods right. Fields: name; email or international phone (at least one); preferred channel; treatment/procedure optional; message optional; consent required. Reference requires both email/phone; Akeezo intentionally reduces collection. Include general care, medical coordination and partnerships contacts from settings; no competitor address. Persist first, show receipt reference, offer permitted channel links. Never show a fake response-time promise.

## S02 — FAQs and Help Centre

FAQ route: breadcrumb, centered heading, accordion list, contact CTA. Help Centre: heading, support categories, accordion and still-need-help block. Topic filtering is proposed. Each question has stable ID, category, short answer, order and optional related entity. Use button/region semantics, real expanded state and deep-linkable IDs.

## S03 — Legal pages

Title, last-updated date, optional quick-navigation sidebar, numbered sections, contact block. Reuse one LegalPage template; maintain independent policy records. Existing Akeezo policies are the migration source; do not replace them with reference legal text. Owner-approved content must identify the actual business, data practices and refund terms. Draft placeholders remain noindex and inaccessible publicly.

## U01 — Packages and experiences

Packages: photo/search hero, specialty group headings, package cards with provider/media/inclusions, filters, pagination. `/packages/top-packages` is the curated variant. Proposed detail page: gallery, provider, itemised inclusions/exclusions, validity, indicative price or on-request, itinerary and enquiry CTA. No payment/booking confirmation is implied. Experiences: image/search hero, geographic mosaic and optional travel cards. These are supporting content, not post-surgery activity recommendations; clinician clearance is outside this UI's decision-making.

## U02 — Community

Three-column desktop: navigation sidebar ~220px, central feed flexible, right recent/community panel ~280px. Top discovery tiles above feed. Post cards show author display name, topic, time, excerpt and reply count. Mobile becomes one column with drawer navigation. Proposed working explore page, topic page and post details complete the reference's broken/unfinished path. Posts/replies require authentication and moderation; medical records and contact details must not be public. Hide forum navigation if moderation is not staffed. Telegram channel remains a separate optional link, not a substitute database for forum posts.

## Universal route states

Skeleton → success; empty → relevant coordinator CTA; invalid query → reset; network failure → retry; absent record → real 404; removed → 404/410 policy; unpublished → unavailable publicly; stale price → quote request; missing image → branded neutral placeholder. Every condition must be explicitly testable.
