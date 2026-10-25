# Akeezo design system and layout fidelity

## Evidence versus implementation values

The reference was measured on desktop at approximately 1363×936. Exact reference-derived values are labeled **observed**. Rounded values used for implementation are **targets**, and mobile behavior is **proposed**. Do not describe targets as extracted CSS.

## Brand system

The live Akeezo site exposed the following CSS values on 25 October 2026:

| Role | Verified value | Use in rebuild |
| --- | --- | --- |
| Brand orange / current primary | `#FF6B00` | Accent graphics, selection emphasis, small decorative highlights |
| Current orange text accent | `#D95B00` | Reference only; check contrast for each use |
| Teal hero brand | `#00C7BE` | Large brand surfaces, illustration accents |
| Pale teal | `#E6F8F6` | Cards, selected backgrounds |
| Dark teal text | `#007A6C` | Primary interactive color and readable teal text |
| Pale orange | `#FFF4EC` | Promotional/service cards |
| Main text | `#262626` | Body and headings |
| Secondary text | `#595959` | Descriptions and metadata |
| Border | `#E2E8F0` | Separators, cards, inputs |
| Muted surface | `#F4F6F9` | Page background and inactive chips |
| White | `#FFFFFF` | Cards and primary canvas |
| Emergency | `#D92D20` | Emergency-only action, not general conversion |
| Font | `Lato` | Main text, headings, labels and buttons |

The reference homepage uses Inter; directory pages exposed Metropolis. Akeezo uses Lato, so text wrapping requires adjustment while preserving the reference's composition. Do not import competitor font files.

Proposed accessible additions: `--action-orange:#B54700` for white-text orange actions and `--action-teal:#007A6C` for white-text teal actions; hover darken to `#005F54`. These are deliberate accessibility adaptations, not existing Akeezo tokens. Do not put small white text on bright `#00C7BE` or `#FF6B00` without checking contrast. Teal brand panels may use dark text or a darkened overlay where needed.

```css
:root {
  --brand-teal: #00c7be;
  --brand-orange: #ff6b00;
  --action: #007a6c;
  --action-hover: #005f54;
  --action-accent: #b54700;
  --surface: #ffffff;
  --surface-muted: #f4f6f9;
  --surface-teal: #e6f8f6;
  --surface-orange: #fff4ec;
  --ink: #262626;
  --ink-muted: #595959;
  --border: #e2e8f0;
  --font-ui: 'Lato', system-ui, sans-serif;
  --page-max: 1280px;
  --page-gutter: clamp(16px, 4vw, 56px);
  --radius-card: 20px;
  --radius-hero: 30px;
  --radius-pill: 999px;
  --shadow-card: 0 4px 20px rgb(15 23 42 / 9%);
}
```

## Shared shell

Observed reference desktop header ~64px tall. Home has left-aligned text navigation and right language/account controls; the large logo belongs in the hero. Inner pages show a logo left, navigation centrally/right, treatment selector, language control and pill account action. Match these two variants. Home target content width 1180px; inner pages target 1240–1280px. Use 24–32px gaps.

Default navigation: Calculate Price, Treatments, Hospitals, Doctors, About. Inner pages: Plan Treatment, Destinations, Hospitals, Doctors, treatment selector, language, My Journey. Keep Akeezo's additional services discoverable in a secondary menu/footer rather than adding a large new homepage section that changes reference order.

Footer: broad white surface, Akeezo logo; tab row for Treatments/Hospitals/Doctors/Destinations; active link collection in a multi-column grid; divider; five link groups; divider; copyright, language, verified review link and social icons. Do not show inactive-tab content simultaneously on screen. Do not copy reference social/review accounts or AI prompts containing the competitor brand.

Global planning CTA: large teal rounded banner, copy left and authorized coordinator/patient illustration right, white or dark high-contrast copy, pill CTA. The reference heading was observed at 50px/62.5px on home. Target 46–50px desktop and 30px mobile, tuned to Lato. This block precedes the footer on most reference pages.

## Desktop homepage geometry

| Element | Observed / target |
| --- | --- |
| Navigation | ~64px tall; subtle lower shadow |
| Brand hero | Centered; substantial whitespace above/below; logo approximately 520px wide in reference |
| Hero logo target | Akeezo native aspect ratio, max-width 520px, max-height 108px; never stretch |
| Supporting line | 18px, muted, centered |
| Search | ~656px wide, ~56px high, fully rounded; action inset on right |
| Suggestion chips | 5 pills, 8px gaps, ~38px high; centered |
| Feature row | Starts around y=459 in observed home; 2 cards ~575×297px; 24px gap |
| Feature headings | Observed 23px/28.75px bold; target 24/30px Lato |
| Card internals | 28px padding; copy occupies left half; image on right with white-to-transparent fade |
| Trust strip | Horizontal below cards, centered; icon/value/label groups with vertical dividers |
| Promotions | Three equal cards; target ratio 2:1, 20px corners and 20–24px gutters |

Do not enforce absolute y coordinates; use normal-flow spacing and compare the resulting landmarks. Hero copy should remain short enough that the feature row begins near the reference position at the baseline viewport. Use one semantic H1 even when the visual centerpiece is a logo; a visually hidden descriptive H1 is acceptable.

## Directory geometry

Observed inner content starts around x=54px. Hospital/doctor hero begins y≈124, width≈1235 and height≈447px; rounded corners≈30px. The title is centered near the lower half, observed at 46px/57.5px, weight 600. Use a bottom dark image gradient. Search overlaps the bottom by about 30px; target width 75% (max 930px), height 60px. Helper text follows. Tabs sit below a generous 64–80px gap; filters beneath.

Treatment/destination directory banners use a closely related variant without the same breadcrumb offset. Keep variants explicit rather than equalizing every hero. Listings use 3–4 cards across depending on type: treatment/destination 4 when cards are compact, hospital 3, doctor 4. Adjust based on final text and comparison captures; these grid counts are implementation targets, not measurements for every reference section. Insert promotional/interstitial blocks at section boundaries, not randomly every N cards.

## Detail geometry

- Treatment: ~31% image / 69% copy, 32px gap; 400px-tall rounded image; title 32px target; metrics in a bordered horizontal band; section links below. Body uses ~2/3 prose and ~1/3 quote panel.
- Hospital: breadcrumb with Share/Review/Save right; title ~40px; category/address lines; large 4-image mosaic (one dominant image, three smaller cells); anchor navigation below; overview and pricing columns. Hide gallery cells when absent rather than stretching one low-resolution asset.
- Doctor: ~280px circular portrait left; title and specialty right; large 40px metrics with 14–16px labels; tabs; promotional row; biography ~66% and experience/education ~32%.
- Destination: heading/introduction; gallery; anchors; content ~66% and cost panel ~32%; cards for stories, providers and travel information.
- Editorial cost/safety/recovery: two equal hero columns; large 52–56px title, ~18px body, illustration right. Cost hero includes a two-band estimate card on the left. Long-form sections below use readable 760–840px prose widths or full-width grids.
- Geographic treatment: pale teal full-width band, text left/image right, small metric tiles and two CTAs; verification strip then sticky section navigation. Preserve the distinctive layout separate from ordinary treatment detail.

## Typography and rhythm targets

Scale: display 56/62; directory H1 46/58; standard H1 40/48; H2 32/40; H3 24/30; body 16/26; small 14/21; caption 12/18. Weight 400 body, 700 headings/buttons (Lato does not need synthetic 600). Spacing scale 4,8,12,16,24,32,48,64,80,96. Section separation generally 64–80px desktop, 40–48px mobile. Avoid tightly packed cards and giant text-only empty regions.

## Responsive rules — proposed

| Width | Layout rules |
| --- | --- |
| ≥1200 | Full nav, desktop split heroes, 3–4 card columns, visible sidebar |
| 768–1199 | Compact nav at fit threshold, 2–3 columns; hero type 36–40px; narrower gutters |
| 480–767 | Menu drawer, single-column hero, 2 compact cards where readable; filter drawer; stacked details |
| 320–479 | Single column; 16px gutters; 28–32px H1; search full width; 2-column treatment selector tiles |

Mobile search retains visible submit action. Chips and anchor tabs may horizontally scroll with an affordance; the entire page must not overflow. Gallery uses one main image with thumbnail strip. Footer link groups collapse as accessible accordions; active directory tab remains visible. Calculator stepper becomes progress label + four dots; sticky bottom controls respect safe-area insets. Keep CTA/chat widget clear of forms and navigation. Use sticky bottom contact CTA only on detail pages, 56px high, with matching content padding.

## Motion and states

Use 150–220ms color/opacity transitions and at most 4px card hover lift. Respect reduced motion; no autoplay healthcare videos or distracting looping hero animation. Lazy images keep reserved aspect ratio. Skeletons mirror final geometry. Error/empty states use the same container and a recovery action. Focus rings are 2px dark teal with 2px offset; do not remove them.

## Fidelity review

Compare identical viewport screenshots with final fonts loaded, stable fixtures and animation disabled. Overlay reference and Akeezo captures; check header height, content width, hero bounds, image crops, search overlap, card geometry, anchor placement and footer rhythm. Branding differences are expected. Initial target: key container edges within 8px at desktop; text wrapping judged with Akeezo copy. Do not claim raw pixel equality when changing fonts, logo and imagery.
