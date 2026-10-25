# Security and health-data requirements

This is an engineering specification, not a declaration of regulatory compliance. Applicable legal requirements, provider-sharing terms, retention schedules and approved policy wording must be reviewed for Akeezo's actual operation before release. Do not copy HIPAA/GDPR/ISO badges from the reference or claim certification from implementing this checklist.

## Access boundaries

Public content, editorial drafts, applications, patient cases and uploaded medical records are separate DTO/access domains. Deny by default; authenticate and authorize every object/action. Partners are scoped by organization and provider IDs. Coordinators see assigned cases. Publishers do not receive patient-record access solely because they publish web pages. Require MFA for staff with sensitive access and access administrators.

## Sessions and transport

HTTPS in production; secure HttpOnly SameSite cookies; CSRF protection and Origin validation on cookie-authenticated mutations; narrow CORS allowlist; no wildcard origins with credentials. Rotate sessions at authentication/privilege change, revoke logout tokens, enforce expiry server-side and rate-limit login/reset attempts. Passwords, if managed locally, use a maintained password-hashing library and reviewed configuration. Reset tokens are hashed, single-use and expiring. Do not store auth tokens in browser localStorage.

## Input, output and uploads

Validate all inputs and limit sizes; allowlist query/sort fields. Never spread req.body into MongoDB queries/updates. Reject unsafe URL schemes and remote-fetch URLs that can access internal services. Rich text renders from known blocks with safe links; sanitize supported HTML if imported. Use CSP, secure headers and encoded output. JSON-LD and hydration payloads must be safe against script-breakout sequences.

Public media and patient documents use separate buckets and access policies. Initial document uploads go to private quarantine. Check file signatures, type, size, dimensions/page count as appropriate; scan; reject executable/active formats or sanitize through a dedicated process. Suggested initial limits: images ≤10MB, reports PDF/JPEG/PNG ≤20MB, max 10 files/request; tune with operational needs. Never serve uploaded SVG/HTML inline on the application origin without sanitization. Private document access checks authorization each time and uses short-lived signed URLs. Do not index or transform private reports through the public CDN.

## Consent and minimization

Collect minimum contact/context for initial enquiries. Medical reports are optional and handled in secure case workflows. Separate care-processing consent, provider-sharing consent and optional marketing consent; marketing is unchecked by default. Record text version/time and withdrawal. Provider-sharing grants specify recipient, purpose, scope and expiry. Do not send report attachments in notification emails or messaging links.

Exclude health details, search text, contact fields, report names and full request bodies from logs, error monitoring, session replay and analytics. Use opaque request/receipt IDs. Disable session replay on all patient forms and private pages. Redact sensitive data before sending an error to an external monitoring service.

## Abuse and integrity

Rate limit enquiries, applications, search, auth and uploads. Use idempotency for forms; honeypot and risk-based challenges reduce spam without making every visitor complete a CAPTCHA. Community content is moderated before publication; prevent public personal-data leakage. Review submission and aggregate ratings are protected from provider self-approval. Admin audit log records actor, action, subject and revision IDs with controlled append-only access.

## Operational security

Secrets remain server-side in secret storage; separate environments and least-privilege database credentials. Encrypt managed storage/backups, restrict database network access and test restore. Run dependency/security checks with the pinned lockfile, review findings and document exceptions. Maintain security contact, incident response owner, backup recovery procedure and access review process. Automatically expiring sessions do not replace explicit case-retention/deletion workflows.

## AI boundary

Baseline planner is deterministic discovery and logistics. If an AI assistant is later enabled, it uses approved public knowledge, discloses limitations and routes clinical decisions to professionals. It must not diagnose, prescribe, promise outcomes, autonomously share records or make bookings. Health data cannot be sent to an external AI service merely because a chat widget exists. A separate consent and vendor review is required for that integration.
