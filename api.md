# REST API contract

Base `/api/v1`. JSON only except controlled uploads. All contracts are proposed; generate an OpenAPI document during implementation. Use one shared validation package for request/DTO types while enforcing all business rules on the server.

## Conventions

Success `{data,meta?}`; list meta `{page,pageSize,total,totalPages}`. Error `{error:{code,message,fieldErrors?,requestId}}`. Do not echo confidential input. Status: 200 read/update, 201 creation, 202 background processing accepted, 400 invalid syntax/query, 401 unauthenticated, 403 denied action, 404 missing or inaccessible private object, 409 version/idempotency conflict, 422 field/domain validation, 429 rate limited, 503 dependency unavailable. Server sets request ID and structured logs.

Lists default page=1/pageSize=12, maximum 48. Use stable secondary `_id` ordering. Validate filter names and values; reject arbitrary MongoDB operators. Date/time is ISO UTC; money is minor integer + currency. Queries do not include patient narrative or contact details.

## Public reads

| Method/path | Input | Response / rule |
| --- | --- | --- |
| GET `/site` | locale | Published settings/navigation only |
| GET `/route` | path, locale | pageKind, published payload, related public DTOs, SEO, revisionId |
| GET `/search` | q 2–100 chars, types, filters, limit≤20 | Grouped suggestions or bounded results; published only |
| GET `/treatments` | q,page | Cards |
| GET `/treatments/:slug` | slug | Treatment public DTO |
| GET `/procedures` | treatment, q, page | Procedure public DTOs |
| GET `/hospitals` | documented directory filters | Hospital cards with canonical URLs |
| GET `/hospitals/:slug` | slug | Profile and published relations |
| GET `/doctors` / `/doctors/:slug` | filters / slug | Doctor cards/profile |
| GET `/destinations` / `/:slug` | filters / slug | Country/city public records |
| GET `/articles` / `/articles/:slug` | category,page / slug | Editorial cards/article |
| GET `/packages` / `/packages/:slug` | filters / slug | Available package data |
| GET `/faqs` | category,entity | Published questions |
| GET `/compare` | type; 2–3 comma-separated public IDs | Allowlisted shared-field DTOs |
| GET `/community/posts` / `/:id` | community,page / id | Approved public projection only |

Unknown paths return 404 before SSR. Public endpoints never expose passwords, contacts from applications, patient records, draftRevisionId, moderation notes or private evidence.

## Public submissions

### POST `/enquiries`

Headers: CSRF token for same-origin cookie session; `Idempotency-Key` random per intentional submission. Body:

```json
{
  "name": "Example Patient",
  "contact": {"email": "example@example.test", "phone": null},
  "preferredChannel": "email",
  "preferredLanguage": "en",
  "serviceType": "treatmentPlanning",
  "context": {"treatmentId": null, "procedureId": null, "hospitalId": null},
  "message": "",
  "sourcePath": "/contact",
  "consent": {"careProcessing": true, "version": "<active-version>"}
}
```

Validate name 2–100, message ≤3000, at least one usable contact, phone normalized to E.164, channel compatible with supplied contact and IDs actually available. Source path is a same-site path without query; server records trusted campaign metadata separately. Success 201 `{data:{receiptId,status:"received"}}` after commit. Do not return the submitted medical/contact payload. Notification failure does not change acceptance. Honeypot/rate limiting protect abuse; challenge only on elevated risk.

### POST `/estimates/calculate`

Body `{procedureId,destinationId,cityId?,preferences,currency}`. Preferences contain bounded logistical choices, not a clinical eligibility questionnaire. Server resolves approved price rules and calculates totals. Return `{status:"indicative"|"needsReview",range?,lineItems,missingItems,ruleVersions,expiresAt,disclaimer}`. No rule means needsReview, never zero-price. Do not accept client-supplied cost components. Saving or sharing a personal estimate uses authenticated/session-bound `/estimate-runs`, not a public URL with clinical details.

### POST `/partner-applications`

Validates partner type, organization/person, location, contact, service categories, website and consent. Returns receipt; no auto-publication or auto-assignment of partner privileges. Idempotent, rate limited. Subsequent credential uploads require a scoped token/session and quarantine.

## Identity and private user endpoints

`POST /auth/login`, `/logout`, `/password-reset/request`, `/password-reset/complete`, `/auth/mfa/verify` are delegated to the chosen established auth integration with enumeration-resistant responses and rate limits. `GET /me` returns only current user's account projection. Session cookie: HttpOnly, Secure in production, SameSite=Lax, narrow path/domain. Rotate at login and privilege changes; revoke at logout.

`GET/POST/DELETE /me/saved-items`; `GET /me/cases`; `GET /me/cases/:id`; `GET /me/estimate-runs/:id`. Enforce ownership on every request. `POST /cases/:id/documents/init` returns a short-lived upload authorization; `/complete` verifies actual object metadata and queues scanning. `GET /cases/:caseId/documents/:documentId/download` checks current case permissions and scan state before a short-lived private URL. Unauthorized IDs return indistinguishable 404.

## Partner endpoints

`GET /partner/profiles`; `PATCH /partner/profiles/:id/draft`; `POST /partner/profiles/:id/submit-review`; `GET /partner/enquiries`. Require active membership and allowedProviderIds; submitted changes enter review. Partners see only explicitly assigned/consented case information, never every website lead. Response DTOs differ from admin DTOs.

## Admin endpoints

| Method/path | Capability | Behavior |
| --- | --- | --- |
| GET/POST `/admin/:collection` | read/edit known collection | Search/list/create validated typed record |
| GET/PATCH `/admin/:collection/:id` | read/edit + object scope | expectedVersion required on writes |
| POST `/admin/:collection/:id/submit-review` | editor | Validate and enter review |
| POST `/admin/:collection/:id/publish` | publisher | version check + transaction; returns publicationJobId |
| POST `/admin/:collection/:id/unpublish` | publisher | Remove public eligibility and invalidate |
| GET `/admin/publications/:id` | publisher/editor scope | pending, delivered or failed status |
| GET `/admin/:collection/:id/revisions` | editor | Revision summaries |
| POST `/admin/:collection/:id/restore` | publisher | Create new revision from specified historical version |
| POST `/admin/previews` | editor | Issue short-lived scoped preview token |
| GET `/admin/enquiries` / `/:id` | coordinator/admin | Assigned/enabled scope only |
| PATCH `/admin/enquiries/:id` | coordinator scope | status/assignment; audited |
| POST `/admin/media/init` / `/complete` | media editor | Validated media/quarantine workflow |
| GET `/admin/audit` | administrator | Read-only redacted history |
| PATCH `/admin/users/:id/access` | access administrator | Deny self-escalation; audit changes |

`:collection` is an explicit enum mapped to typed controllers; never a raw database collection string. Use separate handlers for users, enquiries and medical documents. CSRF and server-side permissions apply to every mutation. Publish validates references, media rights, placeholder flags and required review, then records delivery state.

## Minimum API test examples

Unpublished doctor slug →404. Editor publishing →403. Partner editing another organization →404. Conflicting expectedVersion →409. Same enquiry key/payload →same receipt; changed payload →409. Expired price →needsReview. Unscanned report →download denied. Filter `{ "$ne": null }` or unknown sort →400/422. Sanitized rich text never executes scripts in preview or public render.
