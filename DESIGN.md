# Notion-As-Blog Design System

## 1. Atmosphere & Identity

Notion-As-Blog should feel like a governed publishing surface: calm enough for long reading, structured enough for documentation, and flexible enough for a personal or team blog. The signature is source-order clarity: each page exposes a clear reading path first, then supporting navigation and metadata are placed nearby without stealing attention.

## 2. Color

### Palette

| Role | Token | Light | Dark | Usage |
|------|-------|-------|------|-------|
| Surface/primary | `--background` | brand-configured warm white | brand-configured warm black | Main page background |
| Surface/secondary | `--muted` | brand-configured muted surface | brand-configured muted surface | Tag bars, quiet panels, thumbnail fallback |
| Surface/elevated | `--card` | brand-configured card surface | brand-configured card surface | Post cards and header/footer surfaces |
| Text/primary | `--foreground` | brand-configured text | brand-configured text | Body and headings |
| Text/secondary | `--muted-foreground` | brand-configured muted text | brand-configured muted text | Dates, labels, summaries |
| Border/default | `--border` | brand-configured edge | brand-configured edge | Dividers, focused panel edges |
| Accent/primary | `--primary` | brand-configured accent | brand-configured accent | Links, CTAs, active navigation |
| Accent/foreground | `--primary-foreground` | brand-configured contrast | brand-configured contrast | Text on primary surfaces |
| Focus/ring | `--ring` | brand-configured ring | brand-configured ring | Keyboard focus |
| Status/error | `--destructive` | brand-configured red | brand-configured red | Destructive or error states |

### Rules

- Keep color ownership in `src/config/brand.ts`; components consume semantic tokens through Tailwind/shadcn variables.
- Notion block colors are allowed as imported content semantics and live in `src/app/globals.css`.
- Accent color is interactive first. Decorative use must stay quiet and support reading hierarchy.

### Social Icon Interaction Colors

- `--social-github`: black in light mode, white in dark mode.
- `--social-linkedin`: LinkedIn blue `#0a66c2`.
- Footer platform order starts GitHub, Hugging Face, LinkedIn, X.
- Social links share a centered 32px focus box. Optical glyph sizes: GitHub 28px, X/Hugging Face 26px, LinkedIn 24px; preserve logo aspect ratios.
- X shares the black/white monochrome interaction palette. Hugging Face uses its official local SVG, muted with grayscale/opacity by default and full color on hover/focus. Empty profile URLs hide icons.
- Footer social icons use these colors on hover and keyboard focus; retain the visible focus ring and existing muted default.

## 3. Typography

### Scale

| Level | Size | Weight | Line Height | Tracking | Usage |
|-------|------|--------|-------------|----------|-------|
| Display | `clamp(2.5rem, 7vw, 4.5rem)` | 800 | 1.05-1.15 | tight | Home hero |
| H1 | `1.875rem` to `3rem` | 700 | 1.15 | tight | Article title |
| H2 | `1.5rem` to `1.875rem` | 700 | 1.25 | tight | Section headers |
| H3 | `1.25rem` to `1.5rem` | 600 | 1.35 | normal | Card titles |
| Body/lg | `1.125rem` to `1.25rem` | 400 | 1.65 | normal | Hero and article lead copy |
| Body | `1rem` | 400 | 1.6 | normal | Default text |
| Body/sm | `0.875rem` | 500 | 1.5 | normal | Navigation, metadata |
| Caption | `0.75rem` | 700 | 1.4 | wide | Sidebar labels |

### Font Stack

- Primary: `brand.fonts.sans.stack`
- Mono: `brand.fonts.mono.family`, monospace

### Rules

- Keep body measure near `70ch` for prose and summaries.
- Use `text-wrap: balance` or Tailwind balanced wrapping on display/title text.
- Article paragraphs and list items use 1.5 line height; paragraph margins use `--space-4`. Short paragraphs use balanced wrapping to avoid a very short final line.
- Metadata uses medium weight and muted color; it should not compete with headings.

## 4. Spacing & Layout

### Base Unit

All reusable spacing derives from a 4px base.

| Token | Value | Usage |
|-------|-------|-------|
| `--space-2` | 8px | Tight inline labels |
| `--space-3` | 12px | Compact groups |
| `--space-4` | 16px | Default local gap |
| `--space-6` | 24px | Card padding and comfortable clusters |
| `--space-8` | 32px | Feed item rhythm |
| `--space-10` | 40px | Local section rhythm |
| `--space-12` | 48px | Article/supporting separation |
| `--space-16` | 64px | Page section rhythm |
| `--space-20` | 80px | Hero-to-content rhythm |

### Grid

- Max content width: `1120px`
- Prose measure: `70ch`
- Article shell: `minmax(0, 1fr) 18rem` on large screens
- Repeating grid: `repeat(auto-fit, minmax(min(18rem, 100%), 1fr))`
- Breakpoints follow Tailwind defaults: `sm`, `md`, `lg`, `xl`, `2xl`

### Rules

- StyleGallery is the layout reference: use content limiter, stack, cluster, fluid repeat grid, and sticky aside patterns before custom layout.
- Document owns scrolling. Sidebars may be sticky, but they do not own an independent scroll container unless overflow behavior is explicit.
- Use normal DOM/source order for reading paths; visual layout must not reorder focus meaning.

## 5. Components

### Site Shell

- **Structure**: sticky header with a mobile category row, `main#main-content`, footer.
- **Variants**: normal, dark mode.
- **Spacing**: content limiter at `1120px`, horizontal page gutters.
- **States**: header links have active, hover, focus; skip link appears on focus.
- **Accessibility**: semantic landmarks and skip-to-content support.
- **Motion**: color and transform transitions only.

### Featured Slideshow

- **Structure**: featured post link, visible mobile controls, and slide indicators.
- **Spacing**: photo slides are at least `20rem` tall on mobile; text-only collections size to their content.
- **States**: autoplay pauses on hover, keyboard focus, and touch; arrow keys and buttons change slides.
- **Accessibility**: hidden slides leave the tab order; reduced motion keeps controls responsive.
- **Motion**: slides transition with opacity and transform, and skip transitions when reduced motion is requested.

### Header Navigation

- Text links use weight/color for active and hover states, without pill backgrounds or gradients.
- Desktop links retain the original 20px gap; keyboard focus remains visible.

### Article Shell

- **Structure**: `<article>` followed by desktop `<aside>` in a shared grid.
- **Variants**: with/without post animation, with/without supporting series/read-next content.
- **Spacing**: `--space-12` grid gap, `70ch` article measure, `18rem` aside.
- **Supporting navigation**: TOC rows have a `--space-3` gap without vertical link padding; its label has a single `--space-4` gap. Sidebar sections use `--space-8`, including inside animated reveal wrappers.
- **States**: aside links support hover/focus/active through their child components.
- **Accessibility**: article remains first in DOM; aside falls inline on mobile.
- **Motion**: existing animated reveal honors product config.

### Feed Section

- **Structure**: section header cluster, mobile tag reel, main post stack, sticky desktop tag aside.
- **Variants**: home, category/tag/search listings through existing props.
- **Spacing**: `--space-8` to `--space-12` between local groups.
- **States**: empty posts use `EmptyState`; pagination and search keep native focus behavior.
- **Accessibility**: section heading precedes controls; tag sidebar is supporting navigation.
- **Motion**: hover/active states use transform/color transitions only.

### Post Card

- **Structure**: link wrapping semantic `<article>`, metadata cluster, title, summary, optional thumbnail frame.
- **Variants**: with/without thumbnail, priority image.
- **Spacing**: `--space-4` to `--space-6` local gaps.
- **States**: default, hover, active, focus-visible.
- **Accessibility**: full-card link has visible focus and preserves readable title/summary order.
- **Motion**: title color transition only; no translation, elevation or thumbnail scale.

### Tag Navigation

- **Structure**: mobile horizontal reel, desktop sticky aside.
- **Variants**: all posts active, individual tag links.
- **Spacing**: cluster/reel gap at `--space-2`.
- **States**: hover, active, focus-visible, current all-posts state.
- **Accessibility**: link text includes tag names and visible counts.
- **Motion**: color/background transitions only.

## 6. Motion & Interaction

| Type | Duration | Easing | Usage |
|------|----------|--------|-------|
| Micro | 150ms | ease-out | Press and focus feedback |
| Standard | 200-300ms | ease-in-out | Hover surfaces, nav color |
| Emphasis | 500ms | ease-in-out | Featured slideshow |

### Rules

- Animate `transform`, `opacity`, `filter`, and color only.
- Every interactive surface has a visible hover and focus state.
- Respect existing reduced-motion behavior where configured by browser/framework.

## 7. Depth & Surface

### Strategy

Mixed, but quiet: tonal shifts carry most structure, borders define reading/support boundaries, and shadows are reserved for genuinely elevated overlays.

| Level | Value | Usage |
|-------|-------|-------|
| Tonal | `bg-muted/30`, `bg-card/70` | Feed rows and quiet panels |
| Border | `border-border` | Header, footer, sidebar dividers, focused cards |
| Shadow | `shadow-toss` | Elevated overlays only; not post rows |

### Rules

- Avoid decorative layout CSS in reusable StyleGallery-inspired utilities.
- Use rounded corners to support containment, not as the only hierarchy signal.
- Sidebar panels stay quieter than primary article/feed content.

## Editorial simplification

- Home, taxonomy, author and search listings share one PostCard primitive: transparent rows, a quiet bottom divider, 24px vertical spacing, 24px column gap, 20/24px titles, 16px summaries. Author names and reading time remain optional metadata.
- Hover changes only the title color (150ms); links retain visible focus rings. No decorative corners, elevation, translation, image zoom or repeated read CTA.
- Missing thumbnails omit the media slot entirely. Existing photographs retain their aspect ratio and image loading priority.
- Archive headers use a 24/30px title and localized post count, with a 24px bottom gap. Keep useful author biographies; omit redundant taxonomy badges and descriptions.
- Search fields use a modest 8px radius. Tag filters use text and an underline for selection; sidebar counts use plain tabular figures.
- Featured slides with photos retain the readability overlay. Text-only slides use a plain background, 24/40px padding, no gradient or text shadows, and enough space for controls. Mixed slides share a stable frame; text-only collections use a smaller frame.
- The home lead-to-list gap is 48px; remove accumulated section bottom margins. Body reading spacing and personal brand configuration stay governed by the existing rules.

## Footer alignment

- Desktop/tablet footer uses symmetric flexible outer columns with a content-sized navigation column at the exact content center. Logo aligns left and social links right.
- Below 768px, logo, navigation and social links stack in source order, each centered, with a 24px gap. Navigation uses centered wrapping for longer localized labels.

## Navigation feedback

- Header and footer navigation links share a 150ms transition to the primary text color on hover or visible keyboard focus. Keep focus rings and active header weight. No link background, scale or width change.

## Token ownership and reusable UI

- `src/config/brand.ts` owns brand colors and personal configuration. Tailwind's theme owns the shared typography and spacing scales; do not duplicate them as arbitrary values.
- `src/app/design-tokens.css` owns layout, optical social sizes and semantic interaction tokens: focus width (2px), navigation gap (20px), fast motion (150ms), control height (36px), search radius (8px), tag selection underline (2px), tag gap (16px).
- `src/app/ui-primitives.css` owns shared focus rings, navigation feedback, search control geometry and tag control states.
- TagControl is a text link or native filter button with the same typography, target height and color feedback. Selected controls use primary text plus a bottom underline; no rounded capsules, filled backgrounds, shadows or pressed scale. Visible counts stay plain tabular numerals.
- TagFilter, mobile tag navigation, desktop tag navigation and article tags use TagControl; preserve their existing URLs/filter callbacks. Use aria-current for selected navigation and aria-pressed for filter buttons.
- Repeated behavior/markup belongs in a component; repeated style values belong in tokens or a reusable style primitive. Preserve independent roles instead of forcing all links to look identical.
- Before adding shared UI styles, reuse a documented primitive. If a new value/state is needed, document it here and define it centrally before using it. Brand assets and Notion content colors are semantic inputs, not generic UI decoration.

## Featured slide direction

- Next/autoplay reveals the next slide from the left and sends the outgoing slide to the right. Previous reverses the direction. A rightward swipe advances next; leftward swipe goes previous. Retain arrow keys, swipe, indicators, pause-on-focus/hover/touch and reduced-motion instant updates.
- `--motion-slide: 500ms` governs both incoming and outgoing animations. Only transform/opacity change; no moving text within a slide. Keep inactive slides out of focus and accessibility order.

## Cleanup rules

- Routes use FeedPageHeader and PostCard directly; avoid single-use wrappers that only rename props. Feed author fallback is handled by the shared card when author enrichment is supplied.
- Unused badge and hover-shadow code from former pill/card treatments is removed. Keep configurable fallback/optional features even when currently disabled.
- Shared Notion cursor pagination belongs in queryDataSourcePages; content and author caches keep their independent configuration and failure behavior.
- Finish UI work with unused-reference and duplication checks, then lint/build and verify changed states in the browser.

## Cached archive rendering

- Archive lists and pagination render the first page in cached HTML. URL query synchronization suspends independently with an empty fallback, preserving native links and existing interactions. Query filters/page numbers apply after hydration; direct query URLs initially provide the same canonical first-page HTML.
- Keep the existing Notion data cache and ISR lifetimes; do not fetch Notion during client filter/pagination interaction.

## Related writing and media

- ReadNext keeps its existing layout and three-link limit. Rank public posts by shared series, then shared tags, category and publication date; never include link-only, draft or private content. Do not treat two missing categories as a relationship.
- Article hero images keep the 16:9 frame and loading priority while advertising the actual responsive article width with `sizes`. Person schema does not infer employment from publisher ownership; actual author roles remain source data.
