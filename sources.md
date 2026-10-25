# Sources and provenance

Research date: 25 October 2026. These sites are live and may change after the audit. The direct page table in [reference-audit.md](reference-audit.md) is the authoritative record of which routes were opened and whether screenshot or DOM inspection was performed.

## Layout and information architecture

- [CureMeAbroad homepage](https://curemeabroad.com/): home composition, navigation, treatment-selection dialog, feature cards, conversion bands and footer.
- [Treatments](https://curemeabroad.com/treatments), [hospitals](https://curemeabroad.com/hospitals), [doctors](https://curemeabroad.com/doctors), [destinations](https://curemeabroad.com/destinations): directory layout families.
- [Neurology](https://curemeabroad.com/treatments/neurology), [Apollo Hospital](https://curemeabroad.com/hospitals/apollo-hospital), [Ashok Rajgopal](https://curemeabroad.com/doctors/ashok-rajgopal), [India](https://curemeabroad.com/destinations/india): representative detail templates.
- [Calculator](https://curemeabroad.com/cost-calculator), [planner](https://curemeabroad.com/cma-planner): publicly accessible interaction structure. Later calculator stages were not completed.
- [Blogs](https://curemeabroad.com/blogs), [about](https://curemeabroad.com/about-us), [contact](https://curemeabroad.com/contact), [partnerships](https://curemeabroad.com/partnerships): editorial, company and conversion layouts.
- Other corporate, support, legal, gallery and nested editorial paths are listed individually in the audit. They inform layout and structure, not reusable Akeezo medical claims or policy wording.

## URL discovery

- [Robots file](https://curemeabroad.com/robots.txt)
- [Sitemap index](https://curemeabroad.com/sitemap.xml)
- [Static sitemap](https://curemeabroad.com/static-sitemap.xml)
- Every retrieved child sitemap is linked in [sitemap-summary.md](evidence/sitemap-summary.md).

XML URL discovery was used to identify template breadth and enumerate 26,226 distinct locations. The duplicated before-after child-map reference was counted once. [reference-url-inventory.md](evidence/reference-url-inventory.md) lists all discovered URLs; these entries are not evidence that their pages were individually inspected, available or suitable to reproduce.

## Akeezo brand

[Akeezo homepage](https://akeezo.com/): rendered CSS variables, Lato typography, current logo source URLs, observed contacts and existing service links. Exact values and source image URLs are in [design.md](design.md), [content.md](content.md) and [assets.md](assets.md).

The Akeezo Telegram link `https://t.me/akeezohealth` comes from prior user-provided brand context. It was not established by this reference-site audit. Keep its destination configurable and verify the public link before launch. Russia/Uzbekistan audience assumptions likewise reflect user context; translation and clinical review remain pending.

Existing website statements do not independently verify a provider affiliation, outcome, rating, accreditation or medical benefit. Reuse only after the relevant approval process. This pack uses original Akeezo draft copy and avoids republishing competitor content as Akeezo fact.

## Official technical references

- [React — renderToPipeableStream](https://react.dev/reference/react-dom/server/renderToPipeableStream): Node streaming server renderer and client hydration integration.
- [Express — production security best practices](https://expressjs.com/en/advanced/best-practice-security/): production hardening principles.
- [MongoDB — transactions](https://www.mongodb.com/docs/manual/core/transactions/): atomic multi-document publication design and transaction deployment requirements.

Technology choices beyond those documented primitives are proposed project architecture. Recheck current supported releases and their official integration guides when pinning dependencies.

## Provenance convention

Measured/observed denotes rendered desktop evidence. Proposed denotes an implementation choice or completion of an unverified flow. Approved means approval must exist in Akeezo's actual content workflow; this document does not grant that approval. Sitemap-discovered denotes enumeration only.
