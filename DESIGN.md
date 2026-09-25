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
- **Spacing**: at least `20rem` tall on mobile so the title and summary remain readable.
- **States**: autoplay pauses on hover, keyboard focus, and touch; arrow keys and buttons change slides.
- **Accessibility**: hidden slides leave the tab order; reduced motion keeps controls responsive.
- **Motion**: slides transition with opacity and transform, and skip transitions when reduced motion is requested.

### Article Shell

- **Structure**: `<article>` followed by desktop `<aside>` in a shared grid.
- **Variants**: with/without post animation, with/without supporting series/read-next content.
- **Spacing**: `--space-12` grid gap, `70ch` article measure, `18rem` aside.
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

- **Structure**: link wrapping semantic `<article>`, metadata cluster, title, summary, CTA row, thumbnail frame.
- **Variants**: with/without thumbnail, priority image.
- **Spacing**: `--space-4` to `--space-6` local gaps.
- **States**: default, hover, active, focus-visible.
- **Accessibility**: full-card link has visible focus and preserves readable title/summary order.
- **Motion**: subtle translate and thumbnail scale; no layout animation.

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
| Emphasis | 500-700ms | ease-in-out | Existing slideshow and thumbnail reveal |

### Rules

- Animate `transform`, `opacity`, `filter`, and color only.
- Every interactive surface has a visible hover and focus state.
- Respect existing reduced-motion behavior where configured by browser/framework.

## 7. Depth & Surface

### Strategy

Mixed, but quiet: tonal shifts carry most structure, borders define reading/support boundaries, and shadows are reserved for card hover or elevated media.

| Level | Value | Usage |
|-------|-------|-------|
| Tonal | `bg-muted/30`, `bg-card/70` | Feed rows and quiet panels |
| Border | `border-border` | Header, footer, sidebar dividers, focused cards |
| Shadow | `shadow-toss`, `shadow-toss-hover` | Optional card elevation and hover polish |

### Rules

- Avoid decorative layout CSS in reusable StyleGallery-inspired utilities.
- Use rounded corners to support containment, not as the only hierarchy signal.
- Sidebar panels stay quieter than primary article/feed content.
