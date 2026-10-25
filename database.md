# MongoDB data model

All collection names and fields below are proposed. Use Mongoose strict schemas plus shared request validation. ObjectIds are server-generated; timestamps are UTC ISO instants. Store monetary values as integer minor units with ISO currency; counts are non-negative integers. Never use floating-point arithmetic for billing/price totals. Every relation is validated in the service layer because MongoDB does not enforce foreign keys.

## Content envelope

Mutable entity records: `_id`, `entityType`, `slug`, `locale`, `localeGroupId`, `status`, `draftRevisionId`, `publishedRevisionId`, `version`, `createdAt`, `updatedAt`, `createdBy`, `updatedBy`, `archivedAt?`. Status is draft/review/published/archived; publishedRevisionId remains active while a new draft is edited. A `status` value alone does not decide which revision is public. Each localized content entity has its own locale and revision pointers; localeGroupId connects translations. Administrative edits only update draft pointers, never the public search projection.

ContentRevision: `_id`, `entityType`, `entityId`, `locale`, `revisionNumber`, `schemaVersion`, typed `payload`, `seo`, `sourceReferences[]`, `reviewedBy?`, `reviewedAt?`, `createdBy`, `createdAt`. Immutable. Keep versioned schema migrations; never mutate history to apply a display fix.

SEO: `title` (target ≤60 characters, warning rather than arbitrary truncation), `description` (target 140–160), `canonicalPath`, `ogMediaId?`, `robots`, `schemaKind`. Page heading and title are separate. SourceReference: URL/document identifier, publisher, checkedAt, claimScope and evidenceOwner.

## Collections and fields

| Collection | Required / important payload | Relationships and constraints |
| --- | --- | --- |
| siteSettings | brand name, logo variants, approved tokens, contacts, social links, locales, footer/legal text | Singleton per environment; drafts/revisions apply |
| navigation | location, ordered items `{label,href,children,visible}` | Same-site routes must resolve at publish |
| pages | templateKey, title, typed sections `{id,type,variant,enabled,order,data}` | Allowlisted registry; no executable HTML/JS |
| treatments | name, slug, summary, heroMediaId, overview, insightTiles, FAQ refs | Unique slug; published source/reviewer for medical copy |
| procedures | treatmentId, name, slug, summary, facts, overview, risks, preparation, recovery | Compound unique treatmentId+slug; validated parent |
| destinations | name, countryCode, slug, intro, gallery, logistics, supportedServices | Unique countryCode; no unsupported countries by default |
| cities | destinationId, name, slug, region, coordinates?, airport/logistics | Compound unique destinationId+slug |
| hospitals | name, slug, type, ownership, address, cityId, countryCode, gallery, treatmentIds, procedureIds, facilities, languages, internationalServices | Verification separate from publication; coordinates optional |
| doctors | name, slug, portraitId, specialtyIds, procedureIds, hospitalIds, registration, experienceStartYear?, statedExperience?, education, experience, languages | Verify professional data; no derived fake ranking |
| verifications | subjectType/id, claimType, issuer, evidenceRef, checkedBy/At, expiresAt?, state | Accreditation/identity claims have exact scope; public projection excludes private evidence |
| priceRules | subjectType/id, destinationId, cityId?, hospitalId?, currency, lowMinor, highMinor, lineItems, inclusions, exclusions, source, validFrom, validUntil | low≤high, validUntil>validFrom; exact scope matching; approved state required |
| packages | name, providerId, procedureIds, destinationId/cityId, gallery, inclusions, exclusions, itinerary, priceRuleId?, validUntil | Expired packages cannot advertise availability |
| guides | kind, treatmentId, procedureIds, destinationId?, cityId?, typed body blocks, reviewerId | Required references depend on discriminated kind |
| articles | title, slug, excerpt, coverId, body, categoryIds, authorId, reviewerId?, publishedAt | Structured article blocks; sources and correction history |
| contributors | name, role, bio, portraitId, credentials, evidenceLinks | Distinct from treating doctor profile |
| faqs | question, answer, category, entityRefs, order | Stable IDs, localized revisions |
| testimonials | displayName, quote, mediaId?, consentId, source, context, approvedAt | No fabricated or unlicensed external reviews |
| offers | headline, copy, imageId, CTA, termsPageId, startAt, endAt, eligibility | Must be approved and current; fallback service cards |
| beforeAfterCases | procedureId, beforeMediaId, afterMediaId, elapsedTime, caption, consentId, providerId?, approvedAt | Consent required, no generated outcome evidence |
| mediaAssets | storageKey, variants, mime, bytes, width, height, altByLocale, focalPoint, owner, license, visibility, scanState | Private/public must not share delivery path |
| routeEntries | locale, path, pageKind, entityId, publishedRevisionId?, redirectTo?, statusCode? | Unique locale+path; redirect target validated; no cycles |
| contentRevisions | See envelope | Unique entityType+entityId+locale+revisionNumber |

## Operational/private collections

| Collection | Fields / rules |
| --- | --- |
| users | emailNormalized?, phoneE164?, displayName, authProviderId/passwordHash as appropriate, roles, active, MFA state, createdAt; never public |
| sessions | hashed session ID, userId, expiry, rotation/revocation metadata; TTL cleanup; server checks expiry immediately |
| enquiries | receiptId, requester/contact, preferredLanguage/channel, serviceType, entityRefs, message?, consentVersion/At, sourcePath, status, assignedCoordinatorId, idempotencyScope/key/hash, createdAt |
| patientCases | patientUserId, enquiryId, coordinatorIds, provider sharing grants, timeline, restricted notes, status |
| medicalDocuments | caseId, privateMediaId, uploadedBy, scanState, visibility grants, retentionDueAt, accessLog linkage |
| estimateRuns | owner/session scope, selected IDs, ruleVersion IDs, currency, indicative lineItems/range, missingItems, expiresAt; no public access by guessable ID |
| partnerApplications | type, organization/name, location, contacts, evidence IDs, consent, reviewState, reviewer, decision notes |
| partnerMemberships | userId, organizationId, allowedProviderIds, permissions; server-authoritative object scope |
| savedItems | userId, entityType, entityId; unique tuple; no treatment narrative |
| communityPosts/replies | authorId, communityId, body, moderationState, reportCount, createdAt; published projection strips private identity |
| consents | subject/case, purpose, textVersion, acceptedAt, withdrawnAt?, proof; separate marketing and care-processing purposes |
| auditEvents | actorId, action, entityType/id, revision IDs, requestId, timestamp; no plaintext medical bodies or secrets |
| outboxJobs | type, payload of opaque IDs, state, attemptCount, leaseUntil, nextAttemptAt, dedupeKey |
| publicationJobs | revision/route IDs, committedAt, deliveryState, affectedPaths, lastErrorCode, completedAt |

## Published listing projections

The table above describes revision payloads. To support fast directory queries, maintain a separate `publishedCatalog` collection with entityType, entityId, locale, revisionId, canonicalPath and explicitly allowlisted listing/search fields. Publish or unpublish updates this projection in the same transaction as the published pointer; workers handle optional external indexes and caches. Draft fields must never overwrite these projections. Full profiles load immutable published revisions. SiteSettings/navigation are localized records under one environment-scoped logical singleton. Private users, enquiries and jobs are operational collections, not revisioned public content.

## Index plan

Unique: routeEntries(locale,path); treatments(locale,slug); procedures(locale,treatmentId,slug); hospitals(locale,slug); doctors(locale,slug); destinations(locale,countryCode); cities(locale,destinationId,slug); publishedCatalog(entityType,entityId,locale); users(emailNormalized) partial when present; savedItems(userId,entityType,entityId); contentRevisions(entityType,entityId,locale,revisionNumber); outboxJobs(dedupeKey) partial when populated.

Public query indexes belong on publishedCatalog: (entityType,locale,cityId,_id), (entityType,locale,specialtyIds,_id), (entityType,locale,publishedAt,_id). Private/operational indexes: enquiries(assignedCoordinatorId,status,createdAt), priceRules(subjectType,subjectId,destinationId,validUntil), communityPosts(moderationState,communityId,createdAt). Do not combine two independent array fields in one compound multikey index; design separate indexes and inspect query plans. Add a text index or a dedicated published search projection for approved searchable fields; exclude private collections.

## Concurrency and idempotency

Admin PATCH includes expectedVersion; `findOneAndUpdate({_id,version:expectedVersion}, {$set:..., $inc:{version:1}})` must affect one record or return 409. Revision creation and draft pointer change use a transaction. Publish atomically updates published pointer, RouteEntry, audit event and outbox job.

Enquiry idempotency unique key is `(anonymousSessionOrUserId, key)` with stored normalized request hash. Same key/same hash returns the original receipt; same key/different hash returns 409. Notification retry never creates another enquiry. Do not use contact email as a global dedupe key that merges different legitimate requests.

## Lifecycle

Seed scripts upsert deterministic fixture IDs into development only and fail closed against a production environment. Index migrations have explicit names/version/checksum. Back up before schema/data migration. A deleted provider must be removed from lists and relationships; retained published references require archive/block policy rather than broken joins. Retention periods are business/legal configuration, not invented defaults; private drafts and raw upload quarantine have short operational expiries.

## Illustrative price record

```json
{
  "subjectType": "procedure",
  "subjectId": "<existing-procedure-object-id>",
  "destinationId": "<existing-india-object-id>",
  "currency": "INR",
  "lowMinor": 10000000,
  "highMinor": 15000000,
  "source": {"kind": "providerQuote", "reference": "DEMO-ONLY"},
  "state": "draft",
  "fixture": true
}
```

Numbers are synthetic schema examples, not an Akeezo treatment price. Production publishing rejects fixture records and placeholders.
