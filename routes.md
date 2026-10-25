# Route architecture and migration

## Route conventions

Use lowercase ASCII slugs, no trailing slash except `/`, and stable entity IDs independent of titles. English uses unprefixed routes; reviewed Russian and Uzbek versions use `/ru/` and `/uz/`. Reserve locale and suffix words. Preserve the reference's route hierarchy where useful; preserve Akeezo's existing canonical URLs where already established.

| Reference family | Akeezo canonical route | Template | Content requirement |
| --- | --- | --- | --- |
| `/` | `/` | Home | Published page config |
| `/treatments` | `/treatments` | TreatmentDirectory | At least one approved category |
| `/treatments/:speciality` | Same | TreatmentDetail | Treatment revision |
| `/treatments/:speciality/:procedure` | Same | ProcedureDetail | Procedure belonging to speciality |
| `/hospitals`, `/hospitals/:slug` | Same | HospitalDirectory / HospitalDetail | Published verified provider data |
| `/doctors`, `/doctors/:slug` | Same | DoctorDirectory / DoctorDetail | Published doctor profile |
| `/destinations`, `/destinations/:country` | Same | DestinationDirectory / DestinationDetail | Supported service destination |
| No direct audited equivalent | `/destinations/india/:city` | CityDetail | Proposed city variant, India first |
| `/cost-calculator` | Same | CalculatorLanding / Wizard / Result | Approved price coverage or quote-request fallback |
| `/cma-planner` | `/plan-treatment` | JourneyPlanner | Procedure and destination content |
| `/blogs`, `/blogs/:slug` | `/blog`, `/blog/:slug` | BlogDirectory / Article | Reviewed editorial content |
| `/contributors/:slug` | Same | ContributorProfile | Real author/reviewer credentials |
| `/about-us` | `/about` | About | Original Akeezo story/team |
| `/mission-vision` | Same | MissionVision | Approved copy |
| `/contact` | Same | Contact | Current contact settings |
| `/faqs` | `/faq` | FAQ | Published FAQ collection |
| `/help-centre` | Same | HelpCentre | Support content |
| `/privacy-policy` | `/privacy` | Legal | Akeezo policy |
| `/terms-of-use` | `/terms` | Legal | Akeezo terms |
| `/refund` | `/refund-policy` | Legal | Akeezo refund policy |
| Akeezo existing | `/disclaimer`, `/consent`, `/grievance-officer` | Legal | Approved current legal content |
| `/partnerships`, `/partners` | `/partnerships` | PartnerLanding | Akeezo partner categories |
| `/pricing` | `/partner-options` | PartnerComparison | Approved option definitions; no invented prices |
| Partner external application | `/join-partner` | PartnerApplication | Proposed local form |
| Akeezo existing | `/insurance-agent-partner` | PartnerCategory | Retain route and original role |
| `/ask-cma` | `/community` | CommunityFeed | Moderation operational |
| `/ask-cma/explore` (404) | `/community/explore` | CommunityExplore | Proposed working page |
| Not authenticated/inspected | `/community/:communitySlug`, `/community/posts/:postId` | CommunityDetail / PostDetail | Proposed functional completion |
| `/before-after`, `/before-after/:procedure` | Same | GalleryDirectory / ProcedureGallery | Explicit publication consent |
| `/packages`, `/packages/top-packages` | `/packages`, `/packages/top-packages` | PackageDirectory | Genuine available packages |
| Detail not verified | `/packages/:slug` | PackageDetail | Proposed detail completion |
| `/experiences` | `/experiences` | ExperienceDirectory | Optional travel content |
| Akeezo current home anchors | `/services/home-healthcare`, `/services/emergency`, `/services/medical-travel` | ServiceDetail | Preserve discoverability; operational claims reviewed |
| Akeezo existing | `/medicines` | MedicineEnquiry | Preserve enquiry route, no implied dispensing/checkout |
| New | `/search`, `/compare/:type`, `/saved` | Utility | Noindex |
| New | `/account/*`, `/partner/*`, `/admin/*`, `/preview/*` | Protected apps | Authentication and object scope |

## Nested editorial families

| Reference pattern | Akeezo route pattern | Page kind |
| --- | --- | --- |
| `/treatments/:s/:country` | Same | specialtyCountry |
| `/treatments/:s/:country/cost` | Same | specialtyCountryCost |
| `/treatments/:s/:p/:country` | Same | procedureCountry |
| `/treatments/:s/:p/:country/cost` | Same | procedureCountryCost |
| `/treatments/:s/:p/cost` | Same | procedureCost |
| `/treatments/:s/:p/safety` | Same | procedureSafety |
| `/treatments/:s/:p/recovery` | Same | procedureRecovery |
| `/treatments/:s/:p/:city` | Same, registered explicitly | procedureCity |
| `/treatments/:s/:combinedSlug` | Same | combinedProcedure |
| `/treatments/:s/:comparisonSlug` | Same | procedureComparison |

These paths overlap syntactically. Do not resolve with a chain of permissive wildcard routes or by guessing from words such as `india`. Use a `RouteEntry` collection with unique `{locale,path}`, `pageKind`, `entityId`, `publishedRevisionId` and optional `redirectTo`. The server looks up the exact path and dispatches its registered template. Validate kind-specific references before publication. A path cannot simultaneously belong to a procedure and a country page. Reserve `cost`, `safety`, `recovery`, `top-packages`, `posts`, `explore` and locale codes.

## Query contract

Directory filters: `q`, `speciality`, `procedure`, `country`, `city`, `language`, `page`, `sort`. Use stable slugs; page starts at 1; pageSize 12 default, maximum 48. Only support documented sorting (`relevance`, `name`, `recent`, `experience` for doctors). Do not label commercial ranking as clinical quality. `featured` is editorial selection and must be labeled accordingly.

Any filter change resets page to 1. Unknown filters return a validation error at the API and a recoverable reset UI. Back restores query and scroll. Share links contain no contact or medical narrative. Sensitive enquiry context stays in request bodies and secure sessions.

## Redirects

301 aliases: `/about-us` → `/about`; `/blogs` → `/blog`; `/blogs/:slug` → exact existing `/blog/:slug`; `/faqs` → `/faq`; `/privacy-policy` → `/privacy`; `/terms-of-use` → `/terms`; `/refund` → `/refund-policy`; `/partners` → `/partnerships`; `/cma-planner` → `/plan-treatment`; `/ask-cma` → `/community`; `/pricing` → `/partner-options`. Create only same-domain redirects to real published destinations. Never redirect unmatched content to the homepage.

Preserve existing Akeezo URL content before a domain replacement. Inventory existing URLs from its sitemap and production content export during implementation; this research did not inventory every old Akeezo URL. Maintain home anchor targets (`#emergency`, `#home-care`, `#partners`, `#plan`) as lightweight entry points linking to new pages. Canonicals use the new destination. Deleted records return 404 or a deliberate 410; moved equivalents get 301.
