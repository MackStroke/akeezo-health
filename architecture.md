# MERN architecture

## Decision

Use a TypeScript monorepo with React public UI, React admin/partner/patient UI, an Express Node server, MongoDB and Mongoose. Use Vite for development and bundling. Public content is server-rendered with React's Node streaming renderer and hydrated on the client; Express owns the HTML request lifecycle and REST API. This preserves MERN and avoids a crawler-dependent client-only shell. No Next.js dependency is required.

Select supported stable package versions at implementation time, record them in an ADR and commit one lockfile. Do not copy an unverified version list from these documents. SSR integration must be validated against those pinned versions before feature work spreads.

## Proposed repository

```text
apps/
  web/src/entry-client.tsx
  web/src/entry-server.tsx
  web/src/routes/
  web/src/templates/
  web/src/components/
  web/src/styles/
  admin/src/
  server/src/http/
  server/src/modules/
  server/src/ssr/
  server/src/jobs/
packages/
  contracts/src/
  ui/src/
  config/
scripts/
  migrations/
  seeds/
tests/
  integration/
  e2e/
  visual/
docs/akeezo-blueprint/
```

`modules/` contains content, routes, providers, taxonomy, pricing, enquiries, media, identity, partners, community and audit. Each module separates HTTP controller, validation, service, repository and DTO projection. Avoid an oversized generic controller that accepts arbitrary MongoDB filters.

## Rendering flow

1. Express normalizes the path and locale, checks exact redirects and resolves RouteEntry.
2. Public repository loads the registered published revision and related published records with explicit field projections.
3. Resolve 404/410/redirect before starting the HTML stream. Build title, canonical, social metadata and JSON-LD from the same snapshot.
4. Render the shared React template using `renderToPipeableStream`; include safe serialized initial data and hashed client assets from the Vite build manifest.
5. Client calls `hydrateRoot` with identical initial data. Browser-only code runs after hydration; dates/currency use the same locale/timezone rules on both sides.
6. Client navigation uses the route-data API and the same template registry. Preserve standard links and browser history; avoid rendering a blank screen when JavaScript fails.

Vite dev middleware is development-only. Production Express serves compiled assets and imports the built SSR bundle. Catch stream errors, abort on disconnect/time limit, and log only request IDs. Do not stream private data into a public cache.

## Persistence and publication

Public content uses immutable ContentRevision documents and mutable entity pointers. An editor saves a draft revision; a publisher validates and atomically switches the entity's publishedRevisionId and RouteEntry in a MongoDB transaction. Insert audit event and publication-outbox job in the same transaction. MongoDB must run as a replica set or supported managed deployment for this flow.

Publish also updates the minimal publishedCatalog listing projection transactionally (see database.md). A worker refreshes route cache, optional external search indexes and sitemap eligibility. Publication status is `committed_pending_delivery` until refresh completes; failures are visible and retryable. Baseline implementation can disable HTML caching so committed revisions appear immediately; search/index jobs still require status tracking. Do not claim publish success while serving a stale cached page.

Restoration copies an old revision into a new revision and publishes normally. Unpublish removes the public pointer/route eligibility and invalidates dependent listings. Block deletion of referenced media/content or require explicit reassignment. Optimistic concurrency uses expectedVersion on every admin mutation.

## Services

- MongoDB: content, identities, revisions, enquiries, audit and outbox. TTL indexes for expiring tokens/sessions only; health-record retention uses audited deletion jobs.
- Object storage: public brand/editorial media bucket and separate private patient-document bucket. CDN only for public variants.
- Search: initial MongoDB text search with explicit indexes and bounded results; a MongoDB Atlas Search adapter is optional if the chosen deployment supports it. No unrestricted regex queries.
- Jobs: durable MongoDB outbox with leases/retry/backoff initially. Redis/queue is optional if operational scale justifies it, not a hidden hard dependency.
- Email: transactional provider adapter; notification contains a secure admin link and receipt ID, not medical details or attachments.
- Auth: established session library/provider with server-side session store; secure HttpOnly cookie. No access tokens in localStorage.
- Analytics: allowlisted aggregate product events, stripped of health/contact content.

## Deployment topology

TLS reverse proxy → Express public SSR/API + compiled admin assets → MongoDB/private object storage. Worker runs separately using scoped credentials. Same-origin `/api/v1` simplifies cookie and CSRF policy. CDN caches hashed static assets; public HTML cache is optional and version-tagged. Admin/patient/preview pages send `Cache-Control: private, no-store` and noindex.

## Architecture decisions

ADR-01: MERN with Express-owned SSR to meet stack and search visibility requirements.
ADR-02: Explicit RouteEntry registry to prevent procedure/country/city slug collisions.
ADR-03: Immutable revisions with separate published pointers to prevent draft leakage.
ADR-04: No automated medical recommendation engine in baseline; planner narrows logistical preferences only.
ADR-05: No payments or partner subscription engine without approved business scope.
ADR-06: Public and sensitive media have separate stores, delivery paths and permissions.

Technical references: [React server rendering](https://react.dev/reference/react-dom/server/renderToPipeableStream), [Express security](https://expressjs.com/en/advanced/best-practice-security/), [MongoDB transactions](https://www.mongodb.com/docs/manual/core/transactions/). Those documents informed the architecture; this pack is not evidence that an application has been implemented or tested.
