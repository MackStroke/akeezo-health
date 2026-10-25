# Asset manifest and production requirements

## Official Akeezo logo sources observed

These URLs were present on live Akeezo image elements. They are source references, not assets bundled in this documentation pack. During implementation download from the user's approved source, inspect the SVG and serve a controlled local copy.

| Usage | Observed source |
| --- | --- |
| Logo with tagline, light variant | `https://akeezo.com/images/logo%20with%20tagline-light.svg` |
| Logo with tagline, dark variant | `https://akeezo.com/images/logo%20with%20tagline-dark.svg` |
| Logo dark variant | `https://akeezo.com/images/logo-dark.svg` |

Inspect which variant is readable on each background; filenames alone are not proof of contrast. Retain native viewBox/aspect ratio, mark geometry and lettering. Use clear space of at least the symbol width around large hero logo. Favicon should derive from an approved icon asset; do not crop a wordmark arbitrarily.

## Required media slots

| Asset key | Suggested source dimensions / crop | Placement |
| --- | --- | --- |
| home-estimate | 1200×620, subject on right | Left feature card; Akeezo-branded mockup if used |
| home-explore | 1200×620, subject on right | Right feature card; authentic care coordination |
| directory-treatments | 1920×800 | Banner; clear lower text region |
| directory-hospitals | 1920×800 | Licensed/authorized hospital image |
| directory-doctors | 1920×800 | Authorized clinical-team image; no invented identities |
| directory-destinations | 1920×800 | India/location photograph |
| treatment-cover | 1000×1100 | Detail split hero |
| hospital-gallery | ≥1600px long edge | Main and secondary mosaic images |
| doctor-portrait | 800×800 | Card/circular detail portrait |
| destination-gallery | 1600×1000 | Location mosaic |
| planning-banner | 1000×800 transparent or cropped | Shared CTA right image |
| service-card-1/2/3 | 900×450 | Offer-strip replacements |
| editorial-cover | 1600×900 | Blog cards/article hero |
| guide-illustration | 1000×1300 | Editorial split hero |
| team-portrait | 800×1000 | Real Akeezo team card |

Dimensions are production targets, not extracted source sizes. Supply focal point, alt text, license/source, creator, upload owner and permission status for every item. Use original/authorized media; no hotlinking competitor images, reviewer portraits, brand graphics or before/after records. Generated illustration is allowed only when clearly illustrative; never use it as evidence of a patient result, named doctor, hospital or testimonial.

## Media pipeline

Validate actual MIME and dimensions; strip unnecessary metadata; quarantine/scan uploads; create AVIF/WebP + fallback responsive variants; store width/height and meaningful alt. Hero preload only the primary above-fold image; lazy-load below-fold imagery. Set `sizes` and `srcset`, object-fit cover and admin focal point. Avoid text baked into card images; copy stays editable HTML.

Fonts: self-host appropriately licensed Lato subsets, woff2, weights 400/700, with Latin/Cyrillic support for published locales. Use font-display swap and preload only necessary files. Use one consistent licensed outline icon set; do not redraw medical accreditations as decorative badges.

## Missing-media behavior

Use neutral Akeezo placeholder with reserved ratio in private preview. Public provider profile without an authorized portrait may use an honest initials/avatar treatment. Never substitute an unrelated doctor's photo. Content dependent on visual evidence remains unpublished until evidence is available.
