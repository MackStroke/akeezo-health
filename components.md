# Component contracts

## Shared primitives

Button (primary, secondary, ghost, emergency), TextField, SearchCombobox, Select, Checkbox, RadioGroup, Dialog, Drawer, Tabs, Accordion, Toast, Skeleton, ErrorPanel, EmptyPanel, Breadcrumbs, Pagination, Badge, OptimizedImage and RichTextRenderer. Use accessible primitives; CSS tokens supply brand styling. No clickable `<div>` substitutes or buttons nested inside links.

## Composition registry

| Component | Main inputs | Behavior / state |
| --- | --- | --- |
| PublicHeader | variant, nav, logo, context | home/inner variants; explicit treatment context; menu drawer |
| BrandSearchHero | logo, tagline, suggestions | searchable combobox; suggestion chips; semantic H1 |
| DirectoryHero | media, heading, summary, search | gradient image; overlapping search; dimensions reserved |
| SplitDetailHero | media, copy, metrics, CTA | typed metrics; no phantom numbers |
| EditorialHero | title, body, media, pricePanel | large type and two columns |
| GeographicHero | subject/location, media, facts | location-specific contextual CTAs |
| FeatureCard | title, body, image, action | entire card can link if no nested controls |
| TreatmentCard | title, excerpt, image, href | 3-line clamp; full text accessible at destination |
| HospitalCard | profile, media, save/compare | buttons are siblings to main card link |
| DoctorCard | portrait, name, specialties, affiliations | consistent portrait ratio; verified facts only |
| DestinationCard | place, image, available services | real destination link; no fabricated rating |
| PackageCard | provider, inclusions, range, validity | on-request fallback; no unavailable Buy action |
| AnchorNav | sections, activeId, offset | only rendered sections; scroll margin below sticky header |
| MediaMosaic | media IDs, focal points | 1–4 images; +N opens dialog; keyboard controls |
| PricePanel | range, currency, date, scope | indicative label; expired/unavailable state |
| ServiceOfferStrip | three approved cards | consistent geometry; hide expired promotion immediately |
| PlanningCTA | text, media, action | shared reference banner layout |
| DirectoryFooter | tabs, links, legal, social | keyboard tabs; no hidden focusable inactive content |
| ComparisonTable | type, records, field definitions | 2–3 records; unknown shown as unavailable |
| BeforeAfterSlider | case pair, position | range input, touch/keyboard, fallback |
| EnquiryForm | entity context, consentVersion | idle/invalid/submitting/success/error; retry idempotency |
| CalculatorShell | step, selections, status | validates each transition; sticky controls |
| ReviewList | approved reviews, pagination | provenance; no aggregate when insufficient data |
| ContributorBlock | author/reviewer evidence | real names, credentials and dates |

## Data boundary

Components accept explicit public DTOs, not raw MongoDB documents. Every list item has stable `id`, canonical `href`, localized label and optional image. Rich text is structured JSON rendered by an allowlisted renderer. URL validation allows same-site paths and approved HTTPS/tel/mailto links. Escape text and structured-data payloads.

## Keyboard and accessibility

Search exposes combobox/listbox roles, active descendant, Enter selection, Escape close and a clear button. Modal locks background focus, supports Escape and returns focus to opener. Tabs support arrow navigation and correct aria-controls. Accordions use headings wrapping buttons. Use links for navigation, buttons for mutations. Toasts supplement, never replace, inline field errors. Announce result counts after search without interrupting typing.

## Empty and long-content behavior

Cards tolerate a 90-character name and missing image. No card is clickable when its public route is unavailable. Layout slots collapse without leaving empty anchor targets. Comparison table aligns rows even when one record lacks values. Use `min-width:0` and tested wrapping for long Russian headings. Admin forms preserve unsaved edits during validation errors and show conflicts separately from network failure.
