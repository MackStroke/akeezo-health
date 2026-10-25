# Reference audit — 25 October 2026

## Method and evidence grades

Public search, direct desktop browser inspection, rendered DOM measurements and sitemap retrieval were used. Browser viewport was approximately 1363×936 CSS pixels; screenshots exposed about 1353px of content after the scrollbar. Images sometimes appeared after the first observation. Initial blank image regions are loading states, not intentional design.

- **V**: visually inspected with screenshot plus rendered DOM.
- **D**: route opened; structure inspected in rendered DOM, without a detailed visual measurement pass.
- **S**: URL discovered in sitemap, not individually inspected.
- **P**: proposed Akeezo behavior, not observed reference behavior.

No account was created, no enquiry submitted, no real patient information entered, and no authenticated dashboard inspected. Mobile/tablet layouts were not directly observed. Breakpoints and mobile interactions in this pack are proposed. Reference backend implementation, databases and private business logic are unknown.

## Direct page coverage

All paths below use https://curemeabroad.com unless stated otherwise.

| Path or sample | Grade | Observed structure / finding |
| --- | --- | --- |
| `/` | V | Minimal navigation; oversized centered logo; search/chips; two feature cards; trust metrics; three offer cards; planning banner; directory-tab footer |
| `/treatments` | V | Photographic banner, overlapping pill search, featured treatment area, promotional CTA, treatment grid |
| `/hospitals` | V | Breadcrumb; image hero; search; section tabs; treatment/country filters; hospital collections; recently viewed section |
| `/doctors` | V | Matching directory hero; filters; portrait cards; comparison CTA; community banner; pagination |
| `/destinations` | V | Image hero; search; featured carousel; country grid; interstitial banner; pagination |
| `/treatments/neurology` | V | Image-left split introduction; metrics band; anchor tabs; offers; insights; overview with cost sidebar; related collections |
| `/treatments/neurology/deep-brain-stimulation-dbs` | D | Procedure variation with preparation/risk guidance, procedure facts, doctors/hospitals and FAQs |
| `/hospitals/apollo-hospital` | V | Breadcrumb/actions; heading/type/address; four-image gallery; tabs; accreditation accordion; facilities; prices and related providers |
| `/doctors/ashok-rajgopal` | V | Circular portrait; identity and metrics; tabs; offers; biography/experience columns; affiliations; reviews and FAQs |
| `/destinations/india` | V | Title/introduction/gallery; tabs; overview/cost columns; stories; providers; travel/lifestyle sections; FAQs |
| `/cost-calculator` | V | Split promotional hero, testimonials, four-step explanation, FAQ filters; start replaces body with left-stepper calculator |
| `/cma-planner` | V | Two-step planner, procedure search, Next control, destination chips and planning banner |
| `/about-us` | V | Story introduction with photo collage, metrics, team, press and testimonial blocks |
| `/mission-vision` | V | Centered tinted hero; narrow editorial column; mission/vision and value cards |
| `/partnerships` | V | Partner hero, metrics, network, four tier cards, benefits, process, FAQs and final application CTA |
| `/partners` | D | Redirected to `/partnerships` |
| `/pricing` | D | Partner plan comparison table, tier CTAs, FAQ and conversion banner |
| `/blogs` | V | Featured story left; six latest posts right; three-column article grid |
| `/blogs/medical-tourism-in-india` | D | Article headline; author/reviewer links; image and content; references; related links and FAQs |
| `/contributors/ishwari-bhonsle` | D | Contributor identity, qualifications, experience and credentials |
| `/help-centre` | D | FAQ accordion and contact-support block |
| `/faqs` | D | Single FAQ list with broad patient questions |
| `/contact` | V | Centered introduction; message form left; contact methods/office details right |
| `/privacy-policy` | D | Title, quick-navigation sidebar and numbered long-form sections |
| `/terms-of-use` | D | Same legal framework with numbered sections |
| `/refund` | D | Long-form refund/deposit policy |
| `/ask-cma` | D | Community sidebar, discovery cards, feed regions and recent-post sidebar |
| `/ask-cma/explore` | D | Returned visible 404; do not reproduce this dead navigation |
| `/before-after` | D | Gallery directory grouped by procedure |
| `/before-after/abdominoplasty` | V | Large split editorial hero; price card; comparison imagery; comparison control; outcome/risk/recovery content and reviewer block |
| `/experiences` | D | Search hero and region-based experience groupings; no detail links found in observed main content |
| `/packages` | D | Search hero and featured package cards; View all links to `/packages/top-packages` |
| `/packages/top-packages` | D | Shared shell loaded; main content initially empty. Detailed package result layout remains unverified |
| `/treatments/neurology/india` | V | Tinted country/treatment hero with image right, metrics and CTA; verification strip; sticky section links; related providers |
| `/treatments/neurology/india/cost` | D | Country-specific cost page; quote CTA; cost explanation; providers and FAQs |
| `/treatments/neurology/brain-aneurysm-treatment/india` | D | Procedure/country landing variation with risks, checklist and other-country links |
| `/treatments/neurology/brain-aneurysm-treatment/india/cost` | D | Procedure/country pricing variation |
| `/treatments/cosmetic-plastic-surgery/breast-augmentation/cost` | V | Editorial split hero with stacked estimate comparison card; destination costs, inclusion columns, risks, timeline and FAQs |
| `/treatments/cosmetic-plastic-surgery/breast-augmentation/safety` | D | Risk-focused editorial sections/cards, FAQs and medical reviewers |
| `/treatments/cosmetic-plastic-surgery/breast-augmentation/recovery` | D | Milestones, recovery stages, escalation guidance, travel checklist and FAQs |
| `/treatments/cosmetic-plastic-surgery/mommy-makeover/istanbul` | D | City guide with logistics cards, journey timeline, caution sections and FAQs |
| `/treatments/cosmetic-plastic-surgery/breast-lift-mastopexy-and-breast-augmentation` | D | Dual-procedure comparison/combination content and estimate CTA |
| `/treatments/cosmetic-plastic-surgery/tummy-tuck-vs-liposuction` | D | Side-by-side procedure comparison, decision factors, combined-treatment link and FAQs |
| `https://akeezo.com/` | V | Current brand tokens, logo URLs, contacts and existing service links inspected |

## Interaction evidence

The homepage Explore control opened a centered treatment selector after rendering settled: white modal approximately 668px wide, large rounded corners, four columns × two rows of photo tiles, close icon and View More link. This is not a generic navigation dropdown.

Starting the cost calculator displayed four stages: treatment, country, patient details, preferences. Selecting the knee-replacement option reached stage 2, which displayed an empty destination/pricing state and disabled Next. Stages 3–4 and results were not traversed; their detailed field contracts are proposed in flows.md. No submission was made.

The selected speciality affected header state and some links across tabs. Akeezo should make this context explicit and URL-driven instead of creating hidden cross-page filter surprises. Homepage Explore and treatment selection are visual references; the final Akeezo navigation behavior is specified separately.

## Defects and inconsistencies to avoid

- `/ask-cma/explore` was a visible 404 despite being linked.
- Package sublisting main content was empty during observation.
- Some text showed Markdown syntax in rendered descriptions.
- Reference metric/review totals differed across pages. They are not reusable Akeezo facts.
- Some medical editorial headings referenced the wrong procedure. Templates must validate subject relationships.
- Do not copy broad accreditation badges onto a treatment or destination as if the whole category were accredited.
- Do not turn a temporary image-loading gap into fixed blank whitespace.

## Coverage limits

The full sitemap URL inventory is an enumeration, not a claim that all 26,226 pages were visually inspected. The sitemap index repeated the before/after sitemap; it was deduplicated before counting. Destination pages and contributors were discoverable through navigation even though there was no dedicated destination/contributor child sitemap in the retrieved index. Sitemap counts describe advertised URLs, not proven accessible or indexable pages.

The reference remains live and may change. Exact visual signoff must use a frozen set of reference captures at agreed desktop/mobile viewports. This pack contains original specifications and measured observations, not third-party source code or reproduced imagery.
