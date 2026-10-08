# Design System: Cha Benefits

## 1. Overview

**Creative North Star: "The Quiet Leaf"**

This is what an evidence-led wellness brand looks like when it refuses to shout. The canvas is warm paper, never sterile white; the type is a serif set deliberately *light* (300 weight) so presence comes from scale and optical sizing, not boldness; and the one saturated color in the system — a muted ink green — is spent like ink itself, sparingly, on links and moments that matter. Dark sections don't reach for the same green; they shift the whole palette to a deep pine "band" with gold kickers, so the accent never gets diluted by overuse.

Motion carries as much of the brand voice as color does. Nothing here bounces, snaps, or springs — border-radii drift through slow morphing blob shapes over 16–24 second loops, a fine grain texture animates almost imperceptibly, and every scroll reveal eases up 34px on a quiet exponential curve. The system explicitly rejects the vocabulary of a generic SaaS landing page: no hero-metric tiles, no gradient text, no glassmorphism-as-decoration, no identical icon-card grids. Confidence is expressed by what the system leaves out.

**Key Characteristics:**
- Warm oklch neutrals throughout; never pure `#fff` or `#000`.
- Fraunces at weight 300 for display type; one italic word per headline carries the accent color.
- A single working accent (ink green) plus a dark-mode counterpart (steeped gold) — never both loud at once.
- Organic, morphing blob frames as the system's signature photographic treatment.
- Motion drifts on slow, exponential ease-out curves; reduced-motion gets a fully equivalent static experience, not a stripped one.

## 2. Colors

The palette reads as "paper and ink, lit by one green and one gold" — a restrained strategy where color is structural signal, not decoration.

### Primary
- **Ink Green** (`oklch(52% 0.145 152)`): the working accent on light (paper) sections — links, active states, kicker rules, primary CTA fills, focus outlines, selection color.
- **Ink Green Deep** (`oklch(45% 0.122 152)`): hover/pressed state for Ink Green fills; also used for live/emphasized numerals (the steep timer's countdown).

### Secondary
- **Steeped Gold** (`oklch(72% 0.105 73)`): the accent on dark (band) sections — kickers, the italic headline word in the hero, CTA fills on dark, hover states for ghost buttons and nav links on dark backgrounds. Never appears on light sections; keeps the two accents from competing.

### Neutral
- **Warm Paper** (`oklch(95.9% 0.008 79)`): primary canvas background on light sections; also the "on-dark" text color, reused across the light/dark boundary.
- **Warm Paper Card** (`oklch(99.5% 0.004 79)`): the lift-state surface for hovered/active list rows — barely lighter than Warm Paper, a whisper of elevation rather than a visible card.
- **Ink** (`oklch(24% 0.022 55)`): primary body text and headings on light sections.
- **Ink Soft** (`oklch(44% 0.027 58)`): secondary/supporting text on light sections (descriptions, captions).
- **Night Pine** family (`oklch(26% 0.048 168)` band, `oklch(34% 0.050 168)` mid, `oklch(20% 0.042 168)` deep): the dark canvas — full-bleed backgrounds for the hero, ritual, signup, and footer sections. Functions as Warm Paper's dark-mode counterpart, not as a border/shadow neutral.
- **On Dark / On Dark Soft** (`oklch(95.9% 0.008 79)` / `/ 0.70` alpha): text on Night Pine surfaces, primary and secondary weight.

### Named Rules
**The Ink Rule.** The accent green is used like ink — sparingly, and only where it signals something (a link, an active state, a CTA). It is never a background fill of any real surface area.

**The No-Pure Rule.** No `#fff`, no `#000`, anywhere in the system. Every neutral, light or dark, carries the same warm hue lean (`~79` or `~55–58` hue) so paper and ink read as part of one material, not a generic light/dark toggle.

**Illustrative exception.** The steep-timer's cup illustration is deliberately outside this token system: the tea-liquid RGB values in `js/brew.js` and the leaf/glass fills in the inline cup SVG are literal, naturalistic colors chosen to look like what each real steeped tea actually looks like, not brand chrome. They should not shift if the OKLCH palette above changes. The glass-shine highlight in that same SVG is the one exception to the exception — it should stay `oklch(99.5% 0.004 79)` (Warm Paper Card), not pure white, since it's a surface highlight, not a liquid color.

## 3. Typography

**Display Font:** Fraunces (variable, `font-optical-sizing: auto`), with system serif fallback.
**Body Font:** Karla, with system sans-serif fallback.

**Character:** A quiet, editorial serif/sans pairing. Fraunces is set light (300) at display sizes so scale — not weight — does the work of announcing importance; Karla carries the functional weight (labels, body, buttons) at 400–600, always with wide uppercase tracking on small label text so it never competes with the serif's calm.

### Hierarchy
- **Display** (300, `clamp(3.4rem, 9.2vw, 7.6rem)`, line-height 1.0): the hero headline only. Animates in line-by-line on a slow rise.
- **Headline** (300, `clamp(2.1rem, 4.6vw, 3.6rem)`, line-height 1.08): section titles (Benefits, Ritual, Brew, Signup).
- **Title** (400, `--title-size`: `clamp(1.3rem, 2.1vw, 1.6rem)`): component-level headings, benefit names and ritual stop names.
- **Small title** (400, `--title-size-sm`: 1.25rem): brew step titles, where titles sit in a compact list.
- **Body** (400, 1rem, line-height 1.6–1.7, Karla): running copy, capped near 46–60ch in practice (`.step-desc`, `.section-intro`).
- **Label** (600, 0.75rem, letter-spacing 0.30em, uppercase, Karla): kickers, nav links, buttons, form notes — the system's only heavily-tracked, all-caps text.

### Named Rules
**The Italic Word Rule.** Exactly one word per major headline flips to italic in the section's accent color (Ink Green on light, Steeped Gold on dark). This is the brand's single strongest voice signal — reserve it for the word that carries the emotional payload of the line ("*Live greener*," "*quietly does*," "*Steeped, never rushed*"), never for emphasis of convenience.

## 4. Elevation

Flat by default; shadow is a rare, meaningful accent rather than a structural system. Most surfaces — the paper canvas, the pine bands, list rows — carry no shadow at all; depth there comes from color contrast (Warm Paper vs. Warm Paper Card) and the 1px hairline borders between rows. Shadow appears only under things that are meant to read as physically lifted: blob-framed photography, the brew cup, and buttons on hover. When a shadow does appear, it is soft and diffuse (large blur, negative spread), never a tight "material design" drop shadow.

### Shadow Vocabulary
- **Blob-frame float** (`box-shadow: 0 30px 70px -30px oklch(24% 0.022 55 / 0.40)` on light sections, `0 18px 40px -18px oklch(10% 0.02 168 / 0.85)` on dark): under the sticky benefits image and each ritual-stop image — signals "this photograph is floating above the page."
- **Button lift** (`box-shadow: 0 14px 28px -12px [accent color] / 0.4–0.45`): appears only on hover, paired with `translateY(-3px)`, tinted to match the button's own fill color.
- **Cup float** (`filter: drop-shadow(0 26px 32px oklch(24% 0.022 55 / 0.16))`): the steep-timer cup illustration, keeping it visually separate from the page behind it.

### Named Rules
**The Floats, Doesn't Sit Rule.** Shadow is reserved for elements the system wants to read as suspended above the page — photography, the cup, a hovered button — never applied to static cards, containers, or rest-state UI. If nothing is "floating," there is no shadow.

## 5. Components

Buttons, toggles, and inputs share one felt quality: unhurried tactility. Every interactive surface is a soft pill, every hover state lifts by the same 3px on the same slow exponential curve — nothing snaps into its hover state, everything rises into it.

### Buttons
- **Shape:** full pill (`border-radius: 99px`), never square or lightly-rounded.
- **Primary** (Ink Green fill, Warm Paper text): `padding: 0.95rem 1.9rem`, uppercase Karla 600 label type, `0.16em` tracking.
- **Gold** (Steeped Gold fill, Night Pine Deep text): the "big ask" CTA variant — used for the hero's primary action and the newsletter Subscribe button. Dark (Night Pine) sections only, per the Steeped Gold rule.
- **Ghost / Ghost-dark:** transparent fill, 1.5px border at low opacity (`ink / 0.28` on light, `on-dark / 0.35` on dark); border and text shift to the section's accent color on hover.
- **Hover / Focus:** `translateY(-3px)` plus a tinted diffuse shadow matching the button's own fill color; `:active` snaps back down in 0.08s — the one intentionally fast transition in the system, giving buttons a physical "press."

### Toggle Pills (tea selector)
- **Style:** ghost pill by default (transparent, `ink-soft` text, low-opacity border); selected state (`aria-pressed="true"`) fills solid Ink Green with Warm Paper text.
- **State:** driven by `aria-pressed`, not a custom class — keep this pattern for any future segmented control.

### List Rows (editorial index)
- **Style:** full-width row with a top/bottom 1px hairline (`ink / 0.14`), no card container. A leading italic serif numeral (`01`, `02`…) anchors each row.
- **Hover / Active state:** background lifts to Warm Paper Card and the leading numeral shifts from a faint tint to full Ink Green — no side border or rail; the numeral and background tint alone carry the affordance.

### Inputs
- **Style:** compound pill — the entire form group (input + button) shares one pill container with a 1px low-opacity border, not individually-boxed fields.
- **Focus:** the whole pill's border shifts to Steeped Gold on `:focus-within`, so focus is visible on the container even though the text input itself has `outline: none`.

### Navigation
- **Style:** fixed, transparent over the hero; crossfades to a frosted Warm Paper surface (`backdrop-filter: blur(14px)`, 85% opacity) once scrolled, with matching color swaps for logo, links, and CTA.
- **Link hover:** underline reveals via `scaleX` from left, not an instant border/background change.
- **Mobile:** hamburger opens a full-bleed Night Pine takeover panel, not a dropdown or drawer.

### Blob Frame (signature component)
The system's most distinctive move: photographic and decorative elements sit inside an organically morphing frame (`border-radius: 46% 54% 52% 48% / 55% 47% 53% 45%`, animating through three more radius states over a 16–24s alternating loop, each instance offset in delay so multiple blobs on a page never sync). Used for the sticky benefits figure, every ritual-stop photo, and as a large, near-invisible decorative shape (7% opacity) behind the signup form. This is the one place the system allows a fully organic, non-geometric shape — everywhere else is pills and hairlines.

## 6. Do's and Don'ts

### Do:
- **Do** keep every neutral tinted warm (hue ~55–79); never introduce a pure white or pure black surface.
- **Do** spend the Ink Green / Steeped Gold accents sparingly — on links, active states, and CTAs, never as a large fill.
- **Do** use the italic-word treatment for at most one word per headline, on the word carrying the emotional weight of the line.
- **Do** ease all motion with a slow, exponential ease-out (`cubic-bezier(.22,.9,.28,1)` / `.4,.05,.2,1`) — drift, never bounce or spring.
- **Do** ship a fully equivalent `prefers-reduced-motion` fallback for every brand-carrying animation (blob morph, grain, canvas particles, scroll reveal) — static, not degraded.
- **Do** reserve shadow for things meant to read as floating (photography, the cup, hover states) — flat everywhere else.

### Don't:
- **Don't** build hero-metric tiles (big number + label + gradient accent) — the PRODUCT.md anti-reference is explicitly "generic SaaS landing page" patterns like this.
- **Don't** use gradient text (`background-clip: text`) for emphasis; emphasis comes from the italic-word rule or weight/size, never a gradient fill.
- **Don't** reach for glassmorphism as decoration; the one `backdrop-filter` in the system (scrolled nav) is functional legibility, not a decorative panel.
- **Don't** default to identical icon-heading-text card grids; the benefits section is deliberately an editorial list, not a card grid.
- **Don't** reach for a modal as the first solution; the system has none, and nothing here (signup, tea picker, brew timer) needed one.
- **Don't** write urgency copy (countdowns, "limited time," exclamation-heavy CTAs) — the brand's confidence comes from restraint, not pressure.
