# TrueBuilder.ai — Landing Page Build Plan

## Non-Negotiable Standards (ALL Mockups)

Every mockup must feel **alive**. Not "has hover states" — alive. Every visible element should respond to the user in some way. If it's on screen, it's interactive.

### Assets
- **ALWAYS use the real TrueBuilder emblem** from `trubuilder_logo/Logo files/Emblem/SVG/`
  - Asset 5 = black fill (`#0d0d0d`) — use on light backgrounds
  - Asset 6 = white fill — use on dark backgrounds
  - Asset 7 = brand blue fill (`#305cde`) — use for accent/wireframe contexts
  - Emblem viewBox: `0 0 447.04 431.61`
  - Two paths: one `<path>` (the angular shape) + one `<polygon>` (the T crossbar)
- **Full logo lockups** from `trubuilder_logo/Logo files/SVG/Logo-{1-5}.svg` or PNG equivalents
  - Logo-1: Blue emblem + black text (light bg)
  - Logo-2: Blue emblem + white text (dark bg)
  - Logo-3: All black (monochrome light)
  - Logo-4: All white (monochrome dark)
  - Logo-5: White on brand blue bg
- **NEVER hallucinate SVG paths.** Always extract from the actual logo files.

### Animation & Interactivity Stack
- **Motion** (framer-motion v12) — already installed. Use for:
  - Page entrance animations (`initial` / `animate` / `whileInView`)
  - Hover/tap feedback (`whileHover` / `whileTap`)
  - Staggered reveals (parent `staggerChildren`)
  - Layout animations (`AnimatePresence`, `layoutId`)
  - Spring physics for organic feel
  - Scroll-linked effects (`useScroll` / `useTransform`)
- **React Bits** — install components via `npx shadcn@latest add "https://reactbits.dev/r/{Component}-TS-TW"`
  - Free components: DecryptedText, Noise, SplitText, GlitchText, BlurText, ShinyText, GradientText, CircularText, CountUp, ClickSpark, StarBorder
  - Pro components (we have license): Hyperspeed, Beams, ElectricBorder, GridMotion, DotGrid, GridScan, Radar, MagnetLines, FaultyTerminal, StickerPeel, ScrambledText, GlareHover, SoftAurora, FadeContent

### Interactivity Rules
1. **Every decorative element gets a hover.** Orbit circles, corner brackets, grid lines, accent bars — all respond on hover.
2. **Every text block gets a text effect.** Headlines get DecryptedText/SplitText/GlitchText/BlurText. Labels get ScrambledText. Status text gets typing effects.
3. **Every CTA is spring-loaded.** `whileHover={{ scale }}` + `whileTap={{ scale: 0.96 }}` minimum. Buttons glow, borders animate, text shimmers.
4. **Background layers are alive.** Noise overlays animate. Grids pulse or scan. Gradients shift. Nothing is a flat static image.
5. **Clickable assets scroll to form.** The hero visual element (emblem, wireframe, animation) always scrolls to the email capture on click.
6. **Form has full state choreography.** Loading = pulsing text. Success = scale+fade with check. Error = shake + red flash. All via AnimatePresence.
7. **Entrance animations stagger.** Every section fades/slides in with cascading delays. Nothing pops in all at once.
8. **Cursor feedback.** Interactive elements use appropriate cursors — `pointer` for clickable, `crosshair` for exploratory areas.

### Email Form (shared)
- POST to `/api/v1/subscribe/` with `{ email }` JSON body
- Include CSRF token from cookie
- States: idle → loading → success | error
- AnimatePresence transitions between states

### Colors (from BRAND.md)
| Name | Hex | Usage |
|------|-----|-------|
| Brand Blue | `#3656CE` | Primary accent everywhere |
| Sky Blue | `#2CB6FA` | Secondary accent on dark themes |
| White | `#FFFFFF` | Text on dark, backgrounds on light |
| Black | `#000000` | Text on light, backgrounds on dark |
| Cloud | `#E6EFF1` | Subtle light fills |
| Smoke | `#D5DDE5` | Light borders |
| Graphite | `#6E7185` | Muted text |
| Arsenic | `#42424D` | Dark muted text |
| Phantom | `#1E1E24` | Dark subtle borders |

### Typography
- **Manrope** — primary (400, 600, 700, 800, 900)
- **Space Grotesk** — headline accent (700)
- **JetBrains Mono** — monospace labels/code (400, 500, 700)
- **Azeret Mono** — monospace alt for Mockup 2 (400, 500)
- All loaded via Google Fonts in `frontend/index.html`

---

## Mockup 1 — Technical Blueprint (BUILT)

**Status:** Live at `/` — needs polish pass

**File:** `frontend/src/pages/static/Home.tsx`
**Source:** `landing_mockups/01-technical-blueprint.html`

**Background:** Light cream `#F7F7F5`, mosaic SVG grid pattern, Noise overlay at 2.5%
**Logo:** Logo-1 PNG in nav (`/static/images/truebuilder-logo.png`), real emblem wireframe in hero
**Layout:** Two-column — left 60% headline, right 40% wireframe visualization

### What's Built
- [x] DecryptedText headline ("The Future Is Coming." scrambles on load + re-scrambles on hover)
- [x] Staggered entrance animations (nav, headline, mono label, wireframe, form)
- [x] Corner brackets with hover (fly outward + scale on hover)
- [x] 3 rotating orbit circles (each independently hoverable — scale + brighten)
- [x] Real TB emblem (wireframe stroked version from Logo-1.svg paths)
- [x] Emblem hover (scale 1.2 + rotate 15deg spring)
- [x] Reference codes hover (brighten + slide inward)
- [x] Whole wireframe section clicks to scroll to form
- [x] Email form with full state machine (idle/loading/success/error)
- [x] AnimatePresence form transitions
- [x] Noise overlay (CSS SVG)
- [x] Footer with pulsing status dot
- [x] Nav "Request Access" scrolls to form

### Still Needs
- [ ] Install React Bits `DecryptedText` component (currently using inline implementation — works but should use the real component for consistency)
- [ ] React Bits `Noise` component (currently CSS-only — real component animates the grain)
- [ ] Mono label text effect — "TRUEBUILDER.AI — ARTIFICIAL INTELLIGENCE FOR CONSTRUCTION" should use ScrambledText on hover
- [ ] Nav metadata items should have ScrambledText hover effect ("01. STATUS: COMING SOON" etc)
- [ ] Footer "BATCH 001" — CountUp from 000 on mount
- [ ] Form tagline "We build the tools that build the future." — BlurText fade-in on scroll
- [ ] Wireframe outer border — subtle pulse animation (border-opacity oscillates)
- [ ] Mobile responsive polish (test stacked layout)
- [ ] Orbit circles should have small dot markers that travel along the path

---

## Mockup 2 — Neon Velocity

**File:** `frontend/src/pages/static/Home.tsx` (swap in when building)
**Source:** `landing_mockups/02-neon-velocity.html`

**Background:** Near-black `#050505`, radial glow (`#3656CE` center, blur 80px, 15% opacity), noise overlay 3%
**Logo:** Logo-2 style — white monospace "TRUEBUILDER.AI" + small white emblem in header
**Layout:** Centered single-column stack — header → bordered headline → metadata → pill form → footer

### Key Visual Elements
- 12px thick white border box around headline
- Radial blue glow behind everything (centered, 80vw circle)
- Glassmorphic pill-shaped email form (backdrop-blur-xl, white 5% bg)
- Fixed accent lines: bottom-left horizontal bar + top-right vertical bar (Sky Blue `#2CB6FA`)
- Social icons in footer (Twitter, LinkedIn, GitHub)

### Build Spec — Animations & React Bits

| Element | Effect | Source |
|---------|--------|--------|
| Background glow | **React Bits `Hyperspeed`** or **`Beams`** — animated rays/particles behind the radial glow | React Bits Pro |
| Headline border | **React Bits `ElectricBorder`** — animated neon border crawling around the 12px white border | React Bits Pro |
| "THE FUTURE IS COMING" | **React Bits `ShinyText`** — shimmer/shine pass sweeping across the text | React Bits Free |
| Headline entrance | **Motion** — scale from 0.95 + blur(8px) → clear, spring timing | Motion |
| Email form container | **React Bits `GlareHover`** — glare light sweep following cursor across the glassmorphic pill | React Bits Pro |
| Submit button border | **React Bits `StarBorder`** — animated particle border on the CTA | React Bits Free |
| Noise overlay | **React Bits `Noise`** — animated grain at 3% opacity | React Bits Free |
| Status metadata | **React Bits `DecryptedText`** — "SYSTEM_STATUS: INITIALIZING" decrypts on load | React Bits Free |
| Social icons | **Motion** `whileHover={{ y: -3, color: '#2CB6FA' }}` — lift + color shift | Motion |
| Accent lines | **Motion** — grow from 0 width/height on mount, subtle pulse opacity | Motion |
| Radial glow | **Motion** `useScroll` — glow shifts position slightly on scroll | Motion |
| Whole page | **Motion** staggered entrance — each section fades up with cascade | Motion |
| Submit button | `whileHover={{ scale: 1.03, boxShadow }}` + `whileTap={{ scale: 0.96 }}` | Motion |

### Interactivity Details
- Headline border box: hover makes border glow brighter (box-shadow pulse)
- Form pill: entire container has GlareHover, individual input has focus glow
- Clicking the headline area scrolls to form
- Footer social icons lift + colorize on hover
- Background glow responds to scroll position (parallax drift)

---

## Mockup 3 — Disruptor Beta

**File:** TBD
**Source:** `landing_mockups/03-disruptor-beta.html`

**Background:** Dark charcoal `#121212`, large TB emblem watermark at 3% opacity centered
**Logo:** Emblem-only in nav (white emblem in 4px bordered square) + "TrueBuilder.ai" text
**Layout:** Centered stack — nav, headline, feature list, CTA, footer. Vertical text on left edge.

### Key Visual Elements
- 4px thick borders everywhere (brutalist aesthetic)
- 8px neo-shadows in Brand Blue or black (offset box-shadows)
- Tilted "COMING SOON" sticker badge (rotate 3deg)
- Vertical text "TRUEBUILDER.AI — 2026" on left edge (writing-mode: vertical-rl)
- Feature list: Construction Data Visualizer / Autonomous Site Planning / Real-time Cost Analytics
- Corner bracket decorations (24px, 4px border in Brand Blue)
- Large TB emblem as background watermark

### Build Spec — Animations & React Bits

| Element | Effect | Source |
|---------|--------|--------|
| Headline | **React Bits `GlitchText`** — headline glitches/flickers on load before settling to clean text | React Bits Free |
| "COMING SOON" sticker | **React Bits `StickerPeel`** — peels up on hover revealing something underneath | React Bits Pro |
| CTA button click | **React Bits `ClickSpark`** — particle sparks explode from button on click | React Bits Free |
| Feature list items | **React Bits `ScrambledText`** — each feature name scrambles on hover | React Bits Pro |
| Background | **React Bits `FaultyTerminal`** — CRT scanline/glitch bg effect at low opacity | React Bits Pro |
| CTA button | **Motion** `whileTap={{ x: 1, y: 1 }}` — brutalist pressed offset matching the neo-shadow | Motion |
| Neo-shadows | **Motion** — shadows animate on hover (shadow shrinks as element "presses in") | Motion |
| Vertical text | **Motion** `whileInView` — text slides up from below on scroll | Motion |
| Feature list | **Motion** staggerChildren — each feature fades in sequentially | Motion |
| Corner brackets | **Motion** — fly in from corners on mount, hover pushes them outward | Motion |
| TB watermark | **Motion** `useScroll` — watermark drifts slightly with parallax | Motion |
| Emblem in nav | **Motion** `whileHover={{ rotate: 360 }}` — full spin on hover | Motion |
| Sticker badge | **Motion** `whileHover={{ rotate: -3 }}` — counter-tilts on hover | Motion |
| Form container | **Motion** `whileInView` slide up + neo-shadow animates in from offset | Motion |

### Interactivity Details
- Every 4px border responds to hover (glow or color shift)
- Neo-shadows shrink on hover (button "presses into" the surface)
- Feature dots pulse with staggered timing
- Background watermark drifts on scroll (very subtle parallax)
- Clicking the large headline area scrolls to form
- Social icons: bordered squares, hover fills white with icon turning black

---

## Mockup 4 — Apple Minimal

**File:** TBD
**Source:** `landing_mockups/04-apple-minimal.html`

**Background:** Off-white `#FAFAFA`, completely clean — no patterns, no grids
**Logo:** Logo-1 — small blue emblem + "TrueBuilder" bold + ".ai" lighter in header
**Layout:** Full-screen vertical center, extreme whitespace. Pill badge → headline → subtitle → CTA. Footer.

### Key Visual Elements
- "Coming Soon" pill badge (light blue `#E6EFF1` bg, small uppercase text)
- Headline: sentence case "The Future Is Coming." — 48-64px, Manrope 600-700
- Subtitle in muted gray
- "Notify Me" text-only CTA (no button — just text + arrow)
- Maximum negative space — restraint IS the design
- No shadows, no borders, no decorative elements

### Build Spec — Animations & React Bits

**CRITICAL: Restraint is the design. Max 2-3 effects total. Every animation must be subtle and Apple-like.**

| Element | Effect | Source |
|---------|--------|--------|
| Headline | **React Bits `BlurText`** — text fades in from gaussian blur (the ONE hero effect) | React Bits Free |
| Content stack | **React Bits `FadeContent`** — each element fades in with staggered timing (badge → headline → subtitle → CTA) | React Bits Pro |
| Pill badge | **Motion** spring — drops in with very soft bounce (overshoot: 1.02 max) | Motion |
| Background | **React Bits `SoftAurora`** — barely-there aurora gradient behind the white, 2-3% visibility | React Bits Pro |
| CTA arrow | **Motion** `whileHover={{ x: 4 }}` — arrow slides right on hover | Motion |
| CTA text | **Motion** `whileHover={{ opacity: 0.7 }}` + `whileTap={{ scale: 0.98 }}` | Motion |
| Form input | Focus ring appears with Motion spring (not CSS transition) | Motion |
| Social icons | `whileHover={{ y: -2 }}` — very subtle lift | Motion |

### Interactivity Details
- Clicking anywhere in the hero area scrolls to form (the whole page is the CTA)
- Form is minimal — rounded input, text CTA, no heavy button
- Success state: check icon fades in, text slides up
- NO noise, NO grid, NO particles, NO glow. White space is sacred here.

---

## Mockup 5 — Blueprint on Blue

**File:** TBD
**Source:** `landing_mockups/05-blueprint-on-blue.html`

**Background:** Full Brand Blue `#3656CE`, white hairline grid at 10% opacity (100px squares)
**Logo:** Logo-5 — all white emblem + text on blue
**Layout:** Two-column (50/50) — left: headline + subtitle + CTA, right: wireframe visualization. Form section below.

### Key Visual Elements
- Full blue background with white grid overlay
- White L-shaped corner markers on containers (12px, 1px border)
- Wireframe: concentric dashed circles (white 30%), crosshair lines, emblem center
- Technical mono labels: "[ PROJECT_STATUS: INITIALIZING ]"
- Footer status bar: "BATCH 001 — NOW ACCEPTING | SF // LDN // DXB"
- Vertical left accent line before headline
- "ENCRYPTED CONNECTION ESTABLISHED" notice below form

### Build Spec — Animations & React Bits

| Element | Effect | Source |
|---------|--------|--------|
| Grid background | **React Bits `GridScan`** — animated scanning line sweeps across the grid | React Bits Pro |
| Wireframe area | **React Bits `Radar`** — radar sweep behind the emblem area | React Bits Pro |
| "PROJECT_STATUS: INITIALIZING" | **React Bits `DecryptedText`** — decrypts from random chars like a terminal boot | React Bits Free |
| TB emblem | **React Bits `CircularText`** — rotating text ring around the emblem ("TRUEBUILDER / AI / CONSTRUCTION / INTELLIGENCE") | React Bits Free |
| Corner markers | **Motion** — fly in from respective corners on mount, hover pushes outward | Motion |
| Headline | **React Bits `DecryptedText`** — "The Future Is Coming." decrypts on blue bg | React Bits Free |
| Grid | **React Bits `DotGrid`** — interactive dot grid replacing static SVG (dots react to cursor proximity) | React Bits Pro |
| Orbit circles | **Motion** rotate infinite — same pattern as Mockup 1 but white strokes | Motion |
| Accent line | **Motion** scaleY from 0 on mount | Motion |
| Form container | **Motion** whileInView slide up, corner brackets animate in | Motion |
| Footer status | Pulsing dot + DecryptedText for location codes | Motion + React Bits |
| "ENCRYPTED" notice | Typing effect — text types out character by character after form loads | Custom + Motion |
| Submit button | `whileHover={{ backgroundColor: '#E6EFF1' }}` + `whileTap={{ scale: 0.96 }}` | Motion |

### Interactivity Details
- Grid dots react to cursor proximity (glow/brighten near mouse)
- Radar sweep rotates continuously behind the wireframe
- Corner markers expand outward on hover
- Wireframe area clicks to scroll to form
- CircularText ring rotates slowly, speeds up on hover
- "ENCRYPTED CONNECTION ESTABLISHED" types out after form submit success
- Everything white on blue — all hover states brighten or shift opacity

---

## Mockup 6 — Editorial Waitlist

**File:** TBD
**Source:** `landing_mockups/06-editorial-waitlist.html`

**Background:** Matte dark `#0A0A0A`, noise overlay 3%
**Logo:** Logo-2 — white emblem + white text + "System Online" pulsing status
**Layout:** Vertical center — header → giant headline with echo → divider → two-column (content + form) → footer with rotating badge

### Key Visual Elements
- Giant headline with text echo/depth effect (outlined text in Brand Blue at 30% opacity, offset 4px behind solid white)
- "Building the tools that build the future." tagline
- "Request Access" CTA button (Brand Blue fill, hover Sky Blue)
- Rotating "WAITING LIST" circular badge (20s infinite rotation) with arrow center
- Horizontal dividers in Phantom (`#1E1E24`)
- Left indicator line (6px) before "Early Access" label
- Pulsing status dot in header

### Build Spec — Animations & React Bits

| Element | Effect | Source |
|---------|--------|--------|
| Rotating badge | **React Bits `CircularText`** — "WAITING LIST" text rotating around arrow icon | React Bits Free |
| Headline | **React Bits `SplitText`** — each character animates in individually with stagger | React Bits Free |
| Headline echo | **Motion** — the blue outline echo layer fades in 0.5s after the solid text, with slight y-offset animation | Motion |
| Noise overlay | **React Bits `Noise`** — animated grain at 3% opacity | React Bits Free |
| Headline color | **React Bits `GradientText`** — subtle gradient shift on the white headline (white → slight blue tint cycling) | React Bits Free |
| Background | **React Bits `MagnetLines`** — cursor-reactive lines in the background (very subtle, 5% opacity) | React Bits Pro |
| Form success | **Motion** `AnimatePresence` — form morphs into success state | Motion |
| CTA button | `whileHover={{ backgroundColor: '#2CB6FA', scale: 1.02 }}` + `whileTap={{ scale: 0.96 }}` | Motion |
| Tagline | **React Bits `BlurText`** — fades in from blur after headline completes | React Bits Free |
| Status dot | **Motion** `animate={{ opacity: [1, 0.3, 1] }}` — continuous pulse | Motion |
| Dividers | **Motion** scaleX from 0 → 1 on scroll into view | Motion |
| Left indicator | **Motion** scaleY from 0 with spring | Motion |
| Form input | Focus border animates from center outward (scaleX on pseudo-element) | Motion |
| Social links | `whileHover={{ y: -2, color: '#2CB6FA' }}` | Motion |
| Rotating badge | Badge also clicks to scroll to form | Interaction |

### Interactivity Details
- MagnetLines respond to cursor position across the entire viewport
- Headline echo shifts offset on hover (parallax depth effect)
- Rotating badge accelerates on hover
- Every divider line has hover brightening
- "Request Access" button glow increases on hover (box-shadow)
- Clicking the headline or the rotating badge scrolls to form
- Form success: text slides up, check icon scales in with spring

---

## React Bits Install Commands

Run these before building each mockup:

```bash
# Free components (install all upfront)
npx shadcn@latest add "https://reactbits.dev/r/DecryptedText-TS-TW"
npx shadcn@latest add "https://reactbits.dev/r/Noise-TS-TW"
npx shadcn@latest add "https://reactbits.dev/r/SplitText-TS-TW"
npx shadcn@latest add "https://reactbits.dev/r/GlitchText-TS-TW"
npx shadcn@latest add "https://reactbits.dev/r/BlurText-TS-TW"
npx shadcn@latest add "https://reactbits.dev/r/ShinyText-TS-TW"
npx shadcn@latest add "https://reactbits.dev/r/GradientText-TS-TW"
npx shadcn@latest add "https://reactbits.dev/r/CircularText-TS-TW"
npx shadcn@latest add "https://reactbits.dev/r/CountUp-TS-TW"
npx shadcn@latest add "https://reactbits.dev/r/ClickSpark-TS-TW"
npx shadcn@latest add "https://reactbits.dev/r/StarBorder-TS-TW"

# Pro components (install per-mockup as needed)
npx shadcn@latest add "https://reactbits.dev/r/Hyperspeed-TS-TW"
npx shadcn@latest add "https://reactbits.dev/r/Beams-TS-TW"
npx shadcn@latest add "https://reactbits.dev/r/ElectricBorder-TS-TW"
npx shadcn@latest add "https://reactbits.dev/r/GridMotion-TS-TW"
npx shadcn@latest add "https://reactbits.dev/r/DotGrid-TS-TW"
npx shadcn@latest add "https://reactbits.dev/r/GridScan-TS-TW"
npx shadcn@latest add "https://reactbits.dev/r/Radar-TS-TW"
npx shadcn@latest add "https://reactbits.dev/r/MagnetLines-TS-TW"
npx shadcn@latest add "https://reactbits.dev/r/FaultyTerminal-TS-TW"
npx shadcn@latest add "https://reactbits.dev/r/StickerPeel-TS-TW"
npx shadcn@latest add "https://reactbits.dev/r/ScrambledText-TS-TW"
npx shadcn@latest add "https://reactbits.dev/r/GlareHover-TS-TW"
npx shadcn@latest add "https://reactbits.dev/r/SoftAurora-TS-TW"
npx shadcn@latest add "https://reactbits.dev/r/FadeContent-TS-TW"
```

## Logo SVG Paths (copy-paste reference)

### Emblem — Brand Blue Fill
```jsx
<svg viewBox="0 0 447.04 431.61" xmlns="http://www.w3.org/2000/svg">
  <path d="M338.74,225.24l-14.88-24.64h-122.64s78.04,126.82,78.04,126.82H123.2l-46.85,76.07-17.36,28.13h284.81l12.48-23.13,45.3-81.07-23.7-38.58-39.15-63.6Z" fill="#3656CE"/>
  <polygon points="122.34 327.99 260.63 103.85 383.83 103.85 447.04 0 324.7 0 203.1 0 63.27 0 .06 103.85 138.8 103.85 0 327.99 122.34 327.99" fill="#3656CE"/>
</svg>
```

### Emblem — White Fill (for dark backgrounds)
```jsx
<svg viewBox="0 0 447.04 431.61" xmlns="http://www.w3.org/2000/svg">
  <path d="M338.74,225.24l-14.88-24.64h-122.64s78.04,126.82,78.04,126.82H123.2l-46.85,76.07-17.36,28.13h284.81l12.48-23.13,45.3-81.07-23.7-38.58-39.15-63.6Z" fill="#FFFFFF"/>
  <polygon points="122.34 327.99 260.63 103.85 383.83 103.85 447.04 0 324.7 0 203.1 0 63.27 0 .06 103.85 138.8 103.85 0 327.99 122.34 327.99" fill="#FFFFFF"/>
</svg>
```

### Emblem — Wireframe Stroke (for blueprint contexts)
```jsx
<svg viewBox="0 0 447.04 431.61" xmlns="http://www.w3.org/2000/svg" fill="none">
  <path d="M338.74,225.24l-14.88-24.64h-122.64s78.04,126.82,78.04,126.82H123.2l-46.85,76.07-17.36,28.13h284.81l12.48-23.13,45.3-81.07-23.7-38.58-39.15-63.6Z" stroke="#3656CE" strokeWidth="3"/>
  <polygon points="122.34 327.99 260.63 103.85 383.83 103.85 447.04 0 324.7 0 203.1 0 63.27 0 .06 103.85 138.8 103.85 0 327.99 122.34 327.99" stroke="#3656CE" strokeWidth="3"/>
</svg>
```

### Full Logo Lockup Emblem (from Logo-1.svg — the two blue polygons only)
```jsx
// viewBox from the full logo SVG — use when you need the emblem extracted from the lockup
<svg viewBox="404 416 70 68" xmlns="http://www.w3.org/2000/svg" fill="none">
  <polygon points="455.66 451.36 453.51 447.81 451.75 447.81 451.75 447.81 435.82 447.81 435.82 447.81 447.08 466.1 424.56 466.1 417.8 477.08 415.3 481.14 418.44 481.14 420.8 481.14 451.68 481.14 454.15 481.14 456.39 481.14 458.19 477.8 464.73 466.1 461.31 460.54 455.66 451.36" fill="#305cde"/>
  <polygon points="424.44 466.19 444.39 433.85 462.16 433.85 471.28 418.86 453.63 418.86 436.09 418.86 415.91 418.86 406.79 433.85 426.81 433.85 406.78 466.19 424.44 466.19" fill="#305cde"/>
</svg>
```

---

## Build Order

1. **Mockup 1 — Technical Blueprint** — BUILT, needs polish pass (install real React Bits components, add remaining text effects)
2. **Mockup 2 — Neon Velocity** — Build next (highest visual impact, dark theme)
3. **Mockup 6 — Editorial Waitlist** — Build third (dark theme, editorial feel, unique rotating badge)
4. **Mockup 3 — Disruptor Beta** — Build fourth (brutalist, lots of unique interactions)
5. **Mockup 5 — Blueprint on Blue** — Build fifth (blue theme, blueprint grid)
6. **Mockup 4 — Apple Minimal** — Build last (minimal = hardest to get right, need all learnings applied)

Each mockup = one `Home.tsx` variant. We'll either use a route param or a config to switch between them, TBD.
