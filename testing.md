# Acceptance and verification matrix

This file specifies tests to implement. No application tests were run during preparation of this documentation pack. Research page inspection is not proof of a working Akeezo build.

## Required test layers

- Unit: price arithmetic/inclusions, route resolution, permission predicates, source/expiry rules and data projections.
- Integration: real MongoDB test replica set; revisions/publish transaction; enquiry idempotency/outbox; private access.
- End-to-end: public discovery, filtering, calculator fallback, enquiry receipt, admin draft/publish/restore, partner scope and secure uploads.
- Visual/accessibility: stable fixtures, viewport matrix, keyboard flow, screen-reader semantics and automated accessibility scan.

## Functional tests

| ID | Scenario | Pass condition |
| --- | --- | --- |
| R01 | Each route family with published fixture | Correct template, data, metadata and HTTP 200 |
| R02 | Procedure/country/city slug collision | Publish rejects duplicate path; resolver never guesses wrong entity |
| R03 | Unknown/unpublished route | True 404; no draft data in HTML, JSON or sitemap |
| R04 | Old Akeezo aliases | One-hop redirect to actual canonical page |
| S01 | Search with slow/out-of-order requests | Newest query wins; no stale result overwrite |
| S02 | Filters + pagination + Back | URL, selection and result page remain consistent |
| S03 | Empty results | Honest count, reset/filter recovery and coordinator CTA |
| C01 | Approved price inputs | Exact low/high arithmetic, currency, inclusions and rule versions |
| C02 | Missing/expired pricing | needsReview; no zero/fabricated estimate; working enquiry path |
| C03 | Edit previous calculator step | Invalid downstream choices clear, valid choices persist |
| F01 | Valid enquiry | Receipt only after MongoDB commit; admin sees record |
| F02 | Retry after lost response | Same key returns same receipt; exactly one notification job |
| F03 | Notification provider failure | Enquiry remains stored; job retries; UI never requests resubmit as lost |
| F04 | Invalid phone/email/consent | Server rejects and UI displays field error with focus |
| P01 | Save draft then reload | Draft persists; public page remains unchanged |
| P02 | Publish | Route, listing, metadata and sitemap reflect published revision; delivery state truthful |
| P03 | Stale editor save | 409 and comparison/reapply path; no silent data loss |
| P04 | Restore/unpublish | New revision/audit; public and dependent caches update |
| M01 | Delete referenced media | Block or explicit reassignment; no broken retained revision |
| A01 | Partner requests another organization's profile | Server denies; hidden UI alone not accepted |
| A02 | User guesses another case/document ID | 404/deny without metadata leakage |
| A03 | Malicious rich text/URL/MongoDB operator | Rejected or safely rendered; no execution/query injection |
| A04 | Unscanned/oversized/mismatched file | Quarantined/rejected; no public or private download until approved |
| Q01 | Community post includes private details | Moderation prevents publication; reports handled |
| G01 | Before/after consent withdrawn | Public gallery and cached media references removed |
| I01 | Language switch and long Russian/Uzbek text | Correct content language and no clipped controls |

## Visual matrix

Test 1440×900, reference-like 1363×936, 1024×768, 768×1024, 390×844 and 320×740. Inspect home, each directory, treatment/procedure detail, hospital/doctor/destination profile, calculator each reachable state, planner, article, partner page, legal page, community and one page per specialized template family. Mobile designs are proposed; validate usability rather than claiming reference pixel parity.

Freeze deterministic data, fonts, dates, images and animations for comparisons. Record measured differences for header height, hero bounds, container widths, card ratios, text wrap, gallery layout, tab position and footer hierarchy. Targets: key desktop container boundaries within ~8px before brand-related adjustments; no unexplained section reordering. Do not use one global screenshot similarity score as the only acceptance rule.

## Accessibility

Keyboard-only: header/menu, search suggestions, treatment modal, tabs, filters, comparison tray, accordions, form validation, gallery and calculator Back/Next. Focus returns correctly after dialogs. Touch targets ≥44px where practical; body contrast ≥4.5:1 and large text ≥3:1; no color-only state. One logical H1 per page. At 200% zoom, controls remain usable. Reduced motion removes nonessential effects. No nested interactive elements. Errors are visible and associated with fields.

## SEO/performance

Fetch raw HTML for representative routes; verify content and metadata before JavaScript. Confirm status codes and noindex/private cache headers. Crawl internal links and generated sitemap; check canonicals, hreflang, structured data and image alt. Run production build with mobile lab performance test, document environment and asset sizes. Field Web Vitals targets are checked after authorized launch, not claimed from a single lab test.

## Definition-of-done report

List implemented route families, linked admin editors, test commands/results, tested viewports, private preview URL, unresolved data/integrations and launch gates. Include a route-to-test coverage table. Mark any untested control honestly. Compilation alone is not functional or visual completion.
