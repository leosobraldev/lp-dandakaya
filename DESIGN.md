---
name: Dandakayá Espaço Afro
description: Salão de estética negra e acessórios de ancestralidade em Salvador; a página é uma peça de barro de Maragogipinho, torneada, queimada e pintada com tabatinga.
colors:
  sand: "#efe6d8"
  sand-deep: "#e5d6c0"
  tabatinga: "#f7f1e8"
  clay: "#a34a28"
  clay-fired: "#8e3d20"
  kiln-3: "#6e2f1a"
  kiln-4: "#522617"
  brown: "#3a2318"
  brown-soft: "#6b4a3a"
  clay-ink: "#f3e3d0"
  ember: "#b5541a"
  ember-hot: "#9c4714"
  ember-light: "#e8894a"
  ember-ink: "#fff8ee"
  gold: "#8a6a28"
  teal: "#00425c"
typography:
  display:
    fontFamily: "Bricolage Grotesque Variable, Bricolage Grotesque, ui-sans-serif, sans-serif"
    fontSize: "clamp(3.5rem, 1rem + 11vw, 6rem)"
    fontWeight: 780
    lineHeight: 0.95
    letterSpacing: "-0.04em"
  headline:
    fontFamily: "Bricolage Grotesque Variable, Bricolage Grotesque, ui-sans-serif, sans-serif"
    fontSize: "clamp(2rem, 1.35rem + 3vw, 3.75rem)"
    fontWeight: 720
    lineHeight: 1.02
    letterSpacing: "-0.03em"
  title:
    fontFamily: "Bricolage Grotesque Variable, Bricolage Grotesque, ui-sans-serif, sans-serif"
    fontSize: "clamp(1.75rem, 1.3rem + 2vw, 2.75rem)"
    fontWeight: 700
    lineHeight: 1.05
    letterSpacing: "-0.025em"
  title-sm:
    fontFamily: "Bricolage Grotesque Variable, Bricolage Grotesque, ui-sans-serif, sans-serif"
    fontSize: "clamp(1.125rem, 1rem + 0.6vw, 1.375rem)"
    fontWeight: 620
    lineHeight: 1.25
    letterSpacing: "-0.015em"
  logo:
    fontFamily: "Bricolage Grotesque Variable, Bricolage Grotesque, ui-sans-serif, sans-serif"
    fontSize: "1.5rem"
    fontWeight: 340
    lineHeight: 1
    letterSpacing: "-0.01em"
  body:
    fontFamily: "Figtree Variable, Figtree, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.0625rem"
    fontWeight: 400
    lineHeight: 1.6
  body-lg:
    fontFamily: "Figtree Variable, Figtree, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.1875rem"
    fontWeight: 400
    lineHeight: 1.6
  label:
    fontFamily: "Figtree Variable, Figtree, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 600
    lineHeight: 1
  lockup-sub:
    fontFamily: "Figtree Variable, Figtree, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.6875rem"
    fontWeight: 600
    lineHeight: 1
    letterSpacing: "0.16em"
rounded:
  sm: "0.75rem"
  md: "1.5rem"
  lg: "2.5rem"
  pill: "999px"
spacing:
  u: "0.5rem"
  gutter: "clamp(1rem, 5vw, 3rem)"
  section-y: "clamp(5rem, 12vw, 10rem)"
  max: "76rem"
components:
  button-ember:
    backgroundColor: "{colors.ember}"
    textColor: "{colors.ember-ink}"
    typography: "{typography.label}"
    rounded: "{rounded.pill}"
    padding: "0 1.5rem"
    height: "3rem"
  button-ember-hover:
    backgroundColor: "{colors.ember-hot}"
    textColor: "{colors.ember-ink}"
  button-ember-sm:
    backgroundColor: "{colors.ember}"
    textColor: "{colors.ember-ink}"
    rounded: "{rounded.pill}"
    padding: "0 1rem"
    height: "2.5rem"
  button-ember-lg:
    backgroundColor: "{colors.ember}"
    textColor: "{colors.ember-ink}"
    rounded: "{rounded.pill}"
    padding: "0 1.75rem"
    height: "3.5rem"
  button-outline:
    backgroundColor: "transparent"
    textColor: "{colors.brown}"
    typography: "{typography.label}"
    rounded: "{rounded.pill}"
    padding: "0 1.5rem"
    height: "3rem"
  button-outline-hover:
    backgroundColor: "{colors.brown}"
    textColor: "{colors.tabatinga}"
  carousel-button:
    backgroundColor: "transparent"
    textColor: "{colors.tabatinga}"
    rounded: "{rounded.pill}"
    size: "3rem"
  carousel-button-hover:
    backgroundColor: "{colors.tabatinga}"
    textColor: "{colors.brown}"
  button-admin-primary:
    backgroundColor: "{colors.brown}"
    textColor: "{colors.tabatinga}"
    rounded: "{rounded.pill}"
    padding: "0 1.25rem"
    height: "2.75rem"
  button-admin-primary-hover:
    backgroundColor: "{colors.clay-fired}"
    textColor: "{colors.tabatinga}"
  button-admin-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.brown}"
    rounded: "{rounded.pill}"
    padding: "0 1.25rem"
    height: "2.75rem"
  input-field:
    backgroundColor: "{colors.tabatinga}"
    textColor: "{colors.brown}"
    rounded: "{rounded.sm}"
    padding: "0.75rem 0.875rem"
  vessel-arch:
    backgroundColor: "{colors.clay}"
    textColor: "{colors.tabatinga}"
    rounded: "50% 50% 1.5rem 1.5rem / 40% 40% 1.5rem 1.5rem"
  vessel-bowl:
    backgroundColor: "{colors.clay-fired}"
    textColor: "{colors.tabatinga}"
    rounded: "1.5rem 1.5rem 50% 50% / 1.5rem 1.5rem 40% 40%"
  vessel-plate:
    backgroundColor: "{colors.clay-fired}"
    textColor: "{colors.tabatinga}"
    rounded: "{rounded.lg}"
  carousel-slide:
    backgroundColor: "{colors.kiln-3}"
    rounded: "50% 50% 1.5rem 1.5rem / 40% 40% 1.5rem 1.5rem"
    width: "min(72vw, 19rem)"
  band-clay:
    backgroundColor: "{colors.clay}"
    textColor: "{colors.clay-ink}"
    rounded: "2.5rem 2.5rem 0 0"
    padding: "clamp(5rem, 12vw, 10rem) 0"
  admin-card:
    backgroundColor: "{colors.tabatinga}"
    textColor: "{colors.brown}"
    rounded: "{rounded.md}"
    padding: "1.25rem"
---

# Design System: Dandakayá Espaço Afro

## Overview

**Creative North Star: "Barro de Maragogipinho"**

The page is a single piece of Maragogipinho pottery: thrown on the wheel, fired in a kiln, painted in white tabatinga clay. It starts on raw sand. As the visitor scrolls, it fires through terracotta, then fired clay, then two darker kiln tones, and ends on the deep brown of the footer. Each fired band carries clay grain and a painted lip frieze at its mouth. The first viewport sits on the wheel's axis: an enormous brown headline, the lede and the address, then a terracotta arch vessel ringed by concentric throwing rings, with the ember WhatsApp CTA seated on the vessel's mouth.

The system rejects the salon and boutique category default of a split hero over a row of cards. Form comes from the potter's repertoire: arches, bowls and plates, not plain rectangles. Type weight scales with heat: the hottest, largest statements are the heaviest. A single 8px module governs spacing. Ornament is painted, never iconographic: the white tabatinga marks are generated SVG plates with variable-pressure strokes, off-grid dots and a leaf frieze, drawn in `currentColor`. Photographs, when they exist, are fired into the same vessels; the founders' portrait sits in a plate, the Instagram feed runs as a row of alternating arch and bowl slides.

The admin panel uses the same clay and the same tokens with far less expression, because it is Operate mode. It stays on flat sand with tabatinga cards and brown actions. It has no bands, no grain and no paint; it only echoes the vessel shapes in its image previews.

**Key Characteristics:**
- Kiln sequence of full-bleed bands, each overlapping the previous with a 40px rounded top lip.
- Arch, bowl and plate vessels as image frames, ringed with concentric box-shadow "throwing rings".
- Ember orange reserved for the WhatsApp action.
- Hand-painted tabatinga plates (shoulder wave with dots, leaf frieze, lip frieze) at 40 to 90% opacity.
- feTurbulence clay grain on every fired surface.
- Bricolage Grotesque display at heavy variable weights over Figtree body.
- Official logo gold and teal confined to the brand lockup.

## Colors

The palette is earth that has been fired: raw sand, terracotta darkening step by step to brown, one hot ember for the action, and the logo's gold and teal kept to the lockup.

### Primary
- **Ember** (`ember`): The WhatsApp action and nothing else. It appears on the header button, the hero CTA on the vessel mouth and the footer phone button, always as a filled pill with `ember-ink` text.
- **Ember Hot** (`ember-hot`): Hover state of ember buttons.
- **Ember Light** (`ember-light`): Ember as an accent on the darkest band only. It colours the FAQ plus icon and summary hover on `kiln-4`, where full ember would lack contrast.
- **Ember Ink** (`ember-ink`): Warm white text on ember fills.

### Secondary
- **Clay / Terracotta** (`clay`): The first fired band, the hero vessel fill, the ring colour on sand, nav hover underlines, selection, caret, accent-color, the scrollbar thumb, input focus border and the admin preview fill.
- **Fired Clay** (`clay-fired`): The second band (Instagram), the fill of vessels on clay, the inner ring of carousel slides, the admin primary hover, admin links and admin error text.
- **Kiln Three** (`kiln-3`) and **Kiln Four** (`kiln-4`): The third and fourth bands (Sobre, FAQ). `kiln-3` also fills empty carousel slides and the ring gap around the founders plate.

### Tertiary
- **Logo Gold** (`gold`): The "Danda Kayá" name in the lockup, darkened from the logo's ~#B08A3E so it reads on sand.
- **Logo Teal** (`teal`): The "Espaço Afro" / "Painel" complement in the lockup.

### Neutral
- **Raw Sand** (`sand`): The page floor. Used for the hero, the header bar, the gaps between vessel rings on sand, the CTA halo, the admin background and theme-color.
- **Deep Sand** (`sand-deep`): Hover fill for the menu toggle and the admin `code` background.
- **Tabatinga White** (`tabatinga`): Painted motifs, headings on fired bands, the lip frieze, carousel controls, admin card and input surfaces, and focus outlines on dark bands.
- **Clay Ink** (`clay-ink`): Body text on every fired band and in the footer. Hairlines on dark surfaces use it at 18 to 22% alpha.
- **Deep Brown** (`brown`): Body text and headlines on sand, the footer band, the focus outline on sand, outline buttons and the admin primary button. Hairlines on sand use it at 12% alpha.
- **Soft Brown** (`brown-soft`): Secondary text on sand: the hero lede, the address line, admin hints and statuses.

### Named Rules
**The Kiln Sequence Rule.** Bands fire in one direction only: sand, then clay, fired, kiln-3, kiln-4, and brown for the footer. A later band is never lighter than the one before it. A new section takes the next step in the sequence; it never jumps back to a lighter one.

**The One Fire Rule.** Ember is the WhatsApp action. No decorative ember, no ember headings, no second ember action with a different destination.

**The Lockup Rule.** Gold and teal belong to the brand lockup. They do not spread into headings, borders or backgrounds. The lockup is now the vector redraw of the official logo in `public/logo/` (logo gold #9a7b3f and teal #00425c inside the SVG); the rule still holds. Use `dandakaya-logo-pequeno.svg` (stroke 11) at display heights under ~80px, the regular files above that. Never use it on the dark bands or the footer: the teal tail disappears on brown.

## Typography

**Display Font:** Bricolage Grotesque Variable (with ui-sans-serif, sans-serif)
**Body Font:** Figtree Variable (with ui-sans-serif, system-ui, sans-serif)

**Character:** Bricolage brings a warm, slightly irregular, heavy grotesque voice that feels hand-thrown at high weights. Figtree keeps body copy round, calm and legible on a phone.

### Hierarchy
- **Display** (780, `clamp(3.5rem, 1rem + 11vw, 6rem)`, 0.95, -0.04em): Hero headline in brown, max 8ch on mobile so it breaks into four lines and fills the top half, 12ch from 40rem up. The footer's "Vem pra Piedade." uses the same weight and leading at `clamp(2.75rem, 1.5rem + 6vw, 5.5rem)`.
- **Headline** (720, `clamp(2rem, 1.35rem + 3vw, 3.75rem)`, 1.02, -0.03em): Section titles, max 18ch, in tabatinga on fired bands. The Sobre title, a full sentence naming the founders, runs slightly larger (`clamp(2rem, 1.2rem + 3.6vw, 4.25rem)`) at 16ch, 22ch on desktop.
- **Title** (700, `clamp(1.75rem, 1.3rem + 2vw, 2.75rem)`, 1.05): Space names under vessels. Admin headings use 700 at 1.75rem.
- **Title small** (620, fluid 1.125 to 1.375rem, 1.25): FAQ summaries. Mobile menu links and the footer address name use 650 (1.5rem and 1.25rem).
- **Body** (400, 1.0625rem, 1.6): Default copy. Ledes and story text use body-lg (1.1875rem); the hero lede is fluid from 1.125 to 1.3125rem. Measures: 40ch for ledes, 58 to 60ch for prose, with `text-wrap: pretty`.
- **Label** (600, 1rem, 1): Buttons and links. Small buttons use 0.9375rem, large ones 1.0625rem.
- **Lockup**: the logo is an image (`public/logo/`), not set type. Header: `dandakaya-logo-pequeno.svg` at 3.25rem high. Admin login: full logo at 4.5rem; admin bar: small logo at 2.25rem; both followed by "Painel" in Bricolage 500, 1.0625rem, teal, after a thin teal divider.

### Named Rules
**The Heat Weight Rule.** Weight follows intensity: 780 for the hero and the closing call, 720 for section titles, about 700 for titles and 620 to 650 for list-level display text. The thin 340 belongs only to the logo name.

**The Lockup-Only Caps Rule.** Tracked uppercase exists only in the brand lockup, because the official logo carries it. Section titles stand alone, with no small label above them.

## Layout

Spatial model: a centred container (`max` 76rem, `gutter` `clamp(1rem, 5vw, 3rem)`) on full-bleed bands. Every gap is a multiple of the 8px module (`u`): 16, 24, 32, 40, 48, 80. Bands breathe with `section-y` (`clamp(5rem, 12vw, 10rem)`) of block padding.

- **Hero:** single centred column on the wheel axis. The vessel stage is `min(100% - 50px, 30rem)` wide (the 50px reserves room for the 25px outer ring). Its negative bottom margin (-6rem mobile, -12rem from 60rem) sets the vessel's foot inside the first clay band. The CTA is absolutely centred on the vessel apex with a 6px sand halo.
- **Bands:** each overlaps the previous by `-rounded.lg` and opens with a 40px top radius, so the page reads as stacked rims.
- **Spaces:** one column on mobile. From 48rem there are two columns, and the second vessel drops 10rem so the pair stays asymmetric.
- **Instagram carousel:** once photos exist the panel bleeds to the viewport edges. The track's inline padding aligns the first slide with the container edge (`max(gutter, (100vw - max)/2 + gutter)`) and lets the row run off the right side. Slides are `min(72vw, 19rem)` wide with 24px gaps, scroll-snapped to start. Prev/next controls appear right-aligned under the track only for hover pointers from 48rem.
- **Sobre:** stacked on mobile (title, plate, text, leaf plate). From 60rem the title spans the row, then a 7fr/5fr split puts the founders plate left and the story text and leaf plate right.
- **FAQ:** 5fr/7fr from 60rem; the title sticks at 7rem.
- **Footer:** the big line and the CTA share a row, then the address and map, then a meta row behind a hairline.
- **Breakpoints:** 40rem, 48rem, 60rem (desktop nav appears, menu toggle hides). Admin uses 52rem (two-up uploads, side-by-side gallery form) and 72rem (four-up uploads).
- **Admin:** a 64rem column, 4rem between sections, a sticky bar and a sticky save footer on sand.

**The Wheel Axis Rule.** The first viewport is centred on the vessel. Asymmetry enters only after the first band, in the offset vessel pair, the bleeding carousel and the fractional splits.

## Elevation & Depth

Depth comes from material, not from floating. Surfaces are flat. Bands create depth by overlapping with rounded lips, vessels by their concentric rings. Shadows appear only as rings, as state, or as a thin separator.

### Shadow Vocabulary
- **Lift** (`box-shadow: 0 10px 30px -12px rgb(58 35 24 / 0.35)`): Ember button hover, paired with `translateY(-2px)`.
- **Throwing rings** (`inset 0 0 0 12px fill, inset 0 0 0 14px rgb(247 241 232 / 0.6), 0 0 0 10px gap, 0 0 0 12px ring, 0 0 0 24px gap, 0 0 0 25px ring`): The vessel signature: a painted inner lip plus two outer wheel rings that follow the contour. On sand the ring is clay and the gap is sand. On fired bands the ring is tabatinga at 55% and the gap is the band colour. Once a photo loads, the inner lip drops away and only the outer rings remain.
- **Slide rim** (`0 0 0 8px clay-fired, 0 0 0 9.5px rgb(247 241 232 / 0.5)`): The lighter single rim on carousel slides, so a row of many vessels does not become a wall of rings.
- **CTA halo** (`0 0 0 6px var(--sand)`): Separates the hero CTA from the rings it sits on.
- **Scroll hairline** (`0 1px 0 rgb(58 35 24 / 0.12)`): Sticky header once scrolled, and the admin bar.
- **Drop sheet** (`0 20px 30px -20px rgb(58 35 24 / 0.35)`): Open mobile menu.
- **Admin card ambient** (`0 20px 50px -30px rgb(58 35 24 / 0.45)`): Login card only.

**The Flat Clay Rule.** At rest, nothing floats except the admin login card. A new surface gets depth from a band step, a ring or a tabatinga fill, not from a new shadow.

## Shapes

The form language is the wheel: arches, bowls, plates, rims and rings. Radii come from a short scale: `sm` 12px for inputs, drop zones and admin list rows; `md` 24px for vessel feet, admin cards and the map; `lg` 40px for band rims, the plate vessel and the Instagram fallback panel; `pill` for every button, the carousel controls and the menu toggle.

- **Arch** (4:5): elliptical top (`50% / 40%`) on `md` feet. Portrait images, the hero.
- **Bowl** (4:5): the arch inverted, `md` shoulders over an elliptical base.
- **Plate** (4:3): a broad, evenly rounded `lg` slab for landscape photographs; first used for the founders' portrait.
- Admin previews repeat arch, bowl and plate at one step smaller (`sm` feet, `md` plate).

Lines are hairlines at 12 to 22% alpha. The only strokes heavier than a hairline are the 1.5px button, carousel control and input borders.

**The Fit the Vessel Rule.** Choose the vessel by the photograph's orientation: arch or bowl for portrait, plate for landscape. Never crop a landscape group photo into an arch.

**The Painted Not Printed Rule.** Ornament is tabatinga paint: generated SVG plates in `currentColor` with variable-pressure strokes, dots set off the grid and leaf friezes. The lip frieze repeats at 28px high and 40% opacity, inset by `rounded.lg` from each band's top. The shoulder and leaf plates sit inside empty vessels at 75 to 90% opacity and disappear once a real photo loads; loose plates under text (Sobre, the Instagram fallback) run at 70%. Functional UI icons (WhatsApp, Instagram, pin, arrow, plus, menu) are 1.8px-stroke inline SVG symbols; they are tools, not ornament.

## Components

### Buttons
Warm, round and decisive.
- **Shape:** full pill (`rounded.pill`), 1.5px border slot, 600 Figtree.
- **Ember (primary):** `ember` fill, `ember-ink` text, 3rem high with 1.5rem inline padding. Small is 2.5rem, large 3.5rem. Always paired with the inline WhatsApp icon.
- **Hover / Focus:** `ember-hot`, -2px lift and the Lift shadow over 0.25s `ease-out`. Active returns to rest. Focus is a 3px brown outline at 3px offset, tabatinga on dark bands.
- **Outline:** transparent with a `currentColor` border. On hover it fills with the text colour and inverts the label: brown on sand, tabatinga on fired bands.
- **Carousel control:** a 3rem round tabatinga-outline button (border at 60%) holding the arrow icon, mirrored for previous. Hover fills tabatinga with brown icon; disabled drops to 35% opacity.
- **Admin:** a brown primary that turns fired clay on hover, and a ghost with a 25% brown border that darkens to brown on hover. Both are 2.75rem high (small 2.25rem), disabled at 50% opacity. Ember is not used in admin.

### Links
- **Arrow link:** 600 weight, a 1.5px underline at 0.35em offset and a trailing arrow that moves 4px on hover. On fired bands it is tabatinga.
- **Nav link:** 500 weight with no underline at rest. On desktop, a 2px clay bar grows from the left on hover.

### Vessel (Signature Component)
Image frame shaped as a thrown pot, filled with `clay` (or `clay-fired` on fired bands) over grain, ringed with the throwing-ring shadow. Until an image is uploaded it shows the tabatinga shoulder and leaf plates. Uploaded images fade in over 0.6s. In the hero the rings "throw" outward from zero on load (1.6s). Vessels lower on the page reveal once with fade, 24px rise and 0.98 scale. On a band other than clay, the ring gap takes that band's colour (the founders plate on `kiln-3`).

### Carousel (Instagram)
A native horizontal scroll-snap row fed by the admin gallery. Slides alternate arch and bowl, 4:5, `kiln-3` over grain while loading, with the Slide rim. Each slide links to its post; the image scales to 1.04 on hover. Touch and trackpad scroll natively; buttons page by 85% of the track width (instant under reduced motion). Without photos, the fallback panel stays: `rounded.lg`, brown at 28% over the band, a shoulder plate, one line of copy and an outline button to the profile.

### Band
Full-bleed section of the kiln sequence. It has a 40px top rim, overlaps the band above, carries the grain plus the 40% tabatinga lip frieze, and uses `clay-ink` body text with tabatinga headings. The footer is the final band in `brown`.

### Cards / Containers
- **Admin card / fieldset / upload / gallery form:** `tabatinga` on sand, `rounded.md`, 1 to 1.25rem padding, no border.
- **Admin gallery row:** `tabatinga`, `rounded.sm`, 0.75rem padding, a 4rem 4:5 thumbnail with 8px corners.

### Inputs / Fields
- **Style:** `tabatinga` fill with a 1.5px border in brown at 22% (40% on hover) and `rounded.sm` corners. The label sits above in 600 at 0.9375rem; meta and counters in 0.8125rem soft brown, tabular numerals.
- **Focus:** clay border plus a 3px ring in clay at 20%.
- **Drop zone:** 1.5px dashed brown at 30%. On hover or drag-over it gets a clay border and a clay tint at 6%.

### Navigation
A sticky sand bar, 4rem high, with the logo image at left and a small ember WhatsApp pill at right. Nav items are unnumbered. Below 60rem the menu toggle opens a sand sheet of 1.5rem Bricolage links separated by hairlines.

### FAQ Accordion
Native `details` with an exclusive `name`. Summaries are title-small in tabatinga, with an `ember-light` plus icon that rotates 45° when open. Clay-ink hairlines separate items, and answers fade in from 6px above.

### Motion
Easing is `cubic-bezier(0.16, 1, 0.3, 1)` throughout. One-time reveals, the hero throw, image fades and small hover moves; no loops, no autoplay. `prefers-reduced-motion` removes animation, makes carousel paging instant and reveals content immediately.

## Do's and Don'ts

### Do:
- **Do** take the next step of the kiln sequence (sand, clay, fired, kiln-3, kiln-4, brown) for each new band, with a 40px rim, the grain and the lip frieze.
- **Do** frame imagery in vessels with throwing rings: arch or bowl for portrait, plate for landscape. Keep the tabatinga plates until a real photo exists.
- **Do** use ember only for the WhatsApp action, as a pill with the WhatsApp icon.
- **Do** keep spacing on the 8px module and type weight proportional to intensity (780 for the hero, 720 for sections).
- **Do** use `clay-ink` for body text and `tabatinga` for headings, controls and focus outlines on fired bands.
- **Do** keep the admin on flat sand with tabatinga cards and brown actions, sharing tokens but not ornament.

### Don't:
- **Don't** fall back to a split hero with a row of cards. The first viewport is centred on the vessel.
- **Don't** put small tracked-caps labels above section titles. Tracked caps belong to the logo lockup only.
- **Don't** number the nav or the sections.
- **Don't** use gold or teal outside the brand lockup, and don't replace them with other brand colours.
- **Don't** replace painted tabatinga plates with icon glyphs or stock ornament.
- **Don't** embed third-party widgets that bring their own frames and colours into a band; feed content into vessels instead.
- **Don't** add resting shadows or hard offset shadows. Depth is rims, rings and band steps.
