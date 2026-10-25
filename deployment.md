# Deployment and operations

## Environments

Local development, private staging and production have separate MongoDB databases, object buckets, secrets and notification configuration. Never seed synthetic providers/prices into production. Staging uses authentication or network controls; noindex is supplementary. Public deployment and replacing akeezo.com remain owner-authorized release actions.

## Configuration contract

```dotenv
NODE_ENV=development
PORT=4000
APP_ORIGIN=http://localhost:4000
PUBLIC_ORIGIN=http://localhost:4000
MONGODB_URI=<server-only-replica-set-uri>
SESSION_SECRET=<server-only-secret>
CSRF_SECRET=<server-only-secret>
PUBLIC_MEDIA_BUCKET=<configured-bucket>
PRIVATE_DOCUMENT_BUCKET=<separate-private-bucket>
OBJECT_STORAGE_ENDPOINT=<configured-endpoint>
OBJECT_STORAGE_ACCESS_KEY=<server-only>
OBJECT_STORAGE_SECRET_KEY=<server-only>
TRANSACTIONAL_EMAIL_PROVIDER=<selected-adapter>
TRANSACTIONAL_EMAIL_KEY=<server-only>
EMAIL_FROM=<verified-sender>
NOTIFICATIONS_ENABLED=false
COMMUNITY_ENABLED=false
AI_ASSISTANT_ENABLED=false
```

These are variable names/placeholders, not supplied credentials. Validate required environment values at startup. No server secret may be exposed through a `VITE_` variable or serialized into HTML. In local tests use a mail sink; test cases never contact real patients/providers.

## Build/start requirements

The implementation creates root scripts for `dev`, `build`, `start`, `worker`, `lint`, `typecheck`, `test`, `test:integration`, `test:e2e`, `test:visual`, `db:migrate` and `db:seed:dev`. These scripts are requirements, not commands already present in a repository. Build public client assets, SSR server bundle, admin bundle and Express server; verify production asset manifest paths and hydration. Serve immutable hashed assets with long cache life; HTML and data caching follow publication/privacy rules.

## Release pipeline

Install from lockfile → lint/typecheck → unit/integration tests → production build → dependency review → deploy private staging → migrate/seed safe fixture data → smoke/E2E/visual/accessibility checks → content verification and migration mapping → owner release approval → backup → production migration → atomic deploy → smoke/canonical/sitemap checks → observe error and job queues.

Migrations must be idempotent/versioned. Use expand-and-contract schema changes; maintain old readers during rollout. Do not rely on destructive rollback migrations. Application rollback restores the prior build while preserving compatible data; content rollback publishes a new revision. Database disaster recovery is a separate process.

## Observability

Health endpoints: `/health/live` (process), `/health/ready` (required dependencies without leaking connection strings). Monitor HTTP errors, SSR failures, API latency, database connections, outbox backlog, failed scans and publication delivery. Alert on accepted enquiries whose notifications remain failed. Logs contain request/receipt IDs, not medical payloads. Assign operational owners before release.

## Backup and recovery

Enable database snapshots/point-in-time recovery where supported and object versioning for relevant storage. Define owner-approved RPO/RTO and retention. Perform one isolated restore of database + media references before launch; record duration and result. Published-content history alone is not a backup of patient cases or uploaded reports.

## Launch gates

Official logo files validated; current contact ownership confirmed; real provider/price data approved; privacy/consent/refund text approved; notification sender configured; staff MFA and scoped access tested; no fixtures/placeholders published; security/visual/accessibility checks pass; old Akeezo redirects verified; backups restore; release authorization recorded.
