# About Me — Redesign Plan

> **Status:** proposal, awaiting review. No source files have been modified.
> **Owner:** Maxwell Gilbert Gunawan
> **Goal:** turn the current two-column editorial About into a dark-cinematic, scroll-driven, multi-layer parallax centerpiece — the section people screenshot.

---

## 1. Current state

`components/about/about.tsx` today:

- Two-column layout (`max-w-5xl`, 1.5fr / 1fr) — bio paragraphs + snapshot list.
- Eyebrow "About" + headline "A few things about me." + 3 bio paragraphs + 4 snapshot rows.
- Framer Motion: scroll-tied Y translate (bio `-12%`, snapshot `-28%`) + reveal-on-view fades.
- Tailwind v4 tokens (`bg-background`, `text-foreground`, `text-muted`, `text-accent`, `border-border`).
- Fonts: `font-display` (Bricolage), `font-mono` (Geist Mono), `font-sans` (Geist).

**What works:** typography, content density, restraint.
**What's missing:** depth, drama, "wow." It's a paragraph block — not a memorable moment.

**Stack already available:** Next 16 / React 19 / TS / Tailwind v4 / Framer Motion 12 / R3F + Drei / next-themes / lucide.
**To add:** Lenis (smooth scroll, page-wide), GSAP + ScrollTrigger (pinning + scrubbed timelines).

---

## 2. Target experience — what the visitor feels

A scroll-driven **three-act sequence**, pinned, that reveals "who is Maxwell" through atmosphere first and words second.

> Scroll into the section. The page **slows**. The viewport **locks**. A field of soft floating noise + a slow R3F shader plane fade in behind you. A single oversized word — `MAXWELL` — drifts in from the right at half scroll-speed while the eyebrow `01 / ABOUT` ticks up like a film cue. The cursor tilts the entire scene a few degrees in 3D.
>
> Keep scrolling — the giant word slides off, replaced by a **horizontal track** of bio "chapters." Each chapter is a layered card: a foreground line of body copy, a mid-layer pull-quote, and a background number that scales past you. Cards drift left at different scroll speeds; the foreground races, the background lags.
>
> Final beat — the section **un-pins** into a snapshot grid that **assembles itself** from four directions. The accent orange flickers in, then settles. You exit the section and the page resumes normal scroll.

Total scroll budget: ~250–300vh of pinned distance on desktop, ~150vh on mobile.

---

## 3. Design direction

**Mood:** dark cinematic editorial — magazine spread meets film title sequence. Restrained color, oversized type, deep z-depth, deliberate negative space.

**Palette (keeping current tokens):**
- Surface: `--background` (deep `#0a0a0a` dark / `#fafaf7` light)
- Text: `--foreground`, secondary `--muted`
- Accent: `--accent` `#ff5b3c` — used sparingly (one accent moment per act)
- New section-local token: `--about-haze` `rgba(255,91,60,0.08)` for the R3F shader tint
- Grain: a 2% opacity SVG noise overlay, fixed-position, multiply-blended

**Typography:**
- `font-display` (Bricolage) for the giant scrolling word — pushed to `clamp(8rem, 22vw, 22rem)`, tight `-0.04em` tracking
- `font-mono` for cue labels (`01 / ABOUT`, chapter indices, snapshot dt)
- `font-sans` for body — but bumped to `text-2xl sm:text-4xl` for the chapter foreground lines (read like pull quotes, not paragraphs)

**Layout:**
- Section is `min-h-[300vh]` (the pinned scroll budget) but visually one viewport at a time
- Inner stage: `h-screen w-screen` pinned container with absolute-positioned layers
- Z-axis used aggressively: `translateZ` via CSS perspective on the stage (`perspective: 1200px`)

---

## 4. Parallax architecture

A **layer stack** with explicit depth values. Each layer declares: trigger, transform, speed multiplier.

| Layer | Z-depth | Trigger | Transform | Speed |
|---|---|---|---|---|
| L0 — R3F shader plane (full-bleed gradient + noise) | -400 | scroll progress 0→1 | hue + uTime drift | 0.1× |
| L1 — SVG particle field (40 dots, drifting) | -300 | mouse + scroll | `translate3d(mx*-20px, my*-20px + scroll*-15%, 0)` | 0.15× |
| L2 — Background numeral (`01`, `02`, `03` per chapter) | -200 | scroll-pinned timeline | `scale(0.6→1.4)` + `translateX(40%→-40%)` | 0.3× |
| L3 — Giant display word `MAXWELL` | -100 | scroll 0→0.33 | `translateX(120%→-120%)` + `opacity` mask | 0.5× |
| L4 — Chapter mid-layer (pull-quote / number) | 0 | scroll-pinned | `translateY` + clip-path reveal mask | 1× |
| L5 — Foreground body line (chapter copy) | +80 | scroll-pinned | `translateX` opposite to L4 | 1.2× |
| L6 — Cursor 3D tilt on whole stage | — | mousemove | `rotateX(my*-4deg) rotateY(mx*4deg)` (lerped) | — |
| L7 — Grain overlay (SVG noise) | +200 | static | `mix-blend-mode: overlay` | — |
| L8 — Accent orange flash (one-shot) | +120 | scroll progress 0.92 | opacity 0→1→0 over 0.04 | — |

**Mouse parallax** is applied to the *stage* via lerped pointer offsets (a `useRef`-tracked lerp at ~0.08 to avoid jank). Each layer multiplies the lerped offset by its own depth factor (the further back, the more it moves on cursor — opposite of scroll, which is intentional and reads as 3D).

**Scroll engine:**
- **Lenis** runs page-wide (mounted in a top-level `SmoothScrollProvider`) so the whole site benefits.
- **GSAP ScrollTrigger** drives the pinned About timeline. Lenis exposes `scroll` to ScrollTrigger via the standard `lenis.on('scroll', ScrollTrigger.update)` wiring.
- **Framer Motion** continues to drive smaller per-element reveals (snapshot grid assemble) — no need to rip it out.

**Three-act timeline (pinned, 300vh scroll budget):**

```
scroll progress  0.00 ─────── 0.33 ─────── 0.66 ─────── 1.00
                 │            │            │            │
ACT I  Hero      [████████████]
       MAXWELL drifts R→L, eyebrow ticks up, R3F fades in

ACT II Chapters              [████████████████████████]
       Horizontal track of 3 cards, each a 0.11 slice
       BG numerals scale, FG copy slides counter-direction

ACT III Snapshot                                       [██████]
       Grid assembles from 4 directions, accent flash, un-pin
```

---

## 5. Section-by-section breakdown

### ACT I — "Title card"

```
┌──────────────────────────────────────────────────────┐
│  [L0 shader haze, full-bleed]                        │
│   [L1 particles drifting]                            │
│  01 / ABOUT  ◂── L4 mono cue, top-left               │
│                                                      │
│        MAXWELL  ◂── L3 giant display, slides R→L    │
│                                                      │
│   [L2 background "01" numeral, scaling up]           │
│  scroll ↓ ◂── L5 hint, bottom                        │
└──────────────────────────────────────────────────────┘
```

### ACT II — "Three chapters" (horizontal scrub inside pin)

Three chapters, each occupies ~0.18 of the timeline with 0.04 cross-fade gaps.

- Ch.01 **Origin** — where I'm from, what got me into frontend
- Ch.02 **Craft** — how I work, what I obsess over (motion, type, the click feel)
- Ch.03 **Now** — where I am, what I'm chasing next

```
┌──────────────────────────────────────────────────────┐
│   01                          02                03   │  ◂─ L2 numeral, drifts L
│  ╭────────────╮                                      │
│  │ "I notice  │   ◂── L4 pull-quote, mid-layer      │
│  │  the way   │                                      │
│  │  a button  │                                      │
│  │  settles." │                                      │
│  ╰────────────╯                                      │
│   ▶ Body line drifts opposite ◀  ◂── L5             │
└──────────────────────────────────────────────────────┘
```

### ACT III — "Snapshot assemble"

The four snapshot rows fly in from N/S/E/W, settle into a 2×2 grid, accent orange flashes once on the last item, section un-pins.

```
┌──────────────────────────────────────────────────────┐
│   ┌──────────┐   ┌──────────┐                        │
│   │ BASED IN │   │   ROLE   │                        │
│   │ Jakarta  │   │ Frontend │                        │
│   └──────────┘   └──────────┘                        │
│   ┌──────────┐   ┌──────────┐                        │
│   │  STACK   │   │   INTO   │ ◂─ accent flash here  │
│   │ React··· │   │ Motion   │                        │
│   └──────────┘   └──────────┘                        │
└──────────────────────────────────────────────────────┘
```

---

## 6. Library / tool choices

| Tool | Why |
|---|---|
| **Lenis 1.x** | Buttery page-scroll. Required to make scrub feel cinematic at intensity 5. Mounted globally — benefits hero/projects too. |
| **GSAP + ScrollTrigger** | The right tool for pinning, scrubbed timelines, and labeled multi-act sequences. Framer Motion's `useScroll` works for one-axis drift but is awkward for pinned multi-act timelines. |
| **Framer Motion** (kept) | Still ideal for the snapshot Act III assemble (per-item enter, easier API than GSAP for that). |
| **R3F + Drei** (kept) | Reuse for the L0 shader plane. Custom GLSL fragment for an animated gradient + value-noise tint. |
| **No new icon / animation libs** | Keep dependency footprint honest. |

Bundle impact estimate: `gsap` ~30kb gz, `lenis` ~3kb gz, custom shader ~1kb. Acceptable for the centerpiece section.

---

## 7. Performance & accessibility

**Reduced motion (`prefers-reduced-motion: reduce`):**
- ScrollTrigger pin disabled — section renders as a normal-flow stack
- Lenis disabled (native scroll)
- R3F canvas not mounted (replaced by a static gradient div)
- Mouse parallax skipped
- Framer Motion variants set to `initial=false` (instant)
- Result: same content, same hierarchy, zero animation. Content remains fully readable & accessible.

**Mobile (`< 768px`):**
- Pin distance reduced to 150vh
- ACT II horizontal track collapses to vertical stack of 3 chapters
- R3F canvas uses `dpr=[1,1.5]` and a smaller plane
- Mouse parallax disabled (no cursor)
- Particle count: 40 → 12
- Giant display word capped at `clamp(5rem, 18vw, 9rem)`

**Tablet (768–1024px):** keeps ACT I and ACT III; ACT II runs at 80% intensity (smaller numerals, shorter pin).

**Perf targets:**
- 60fps on mid-tier laptops; 50fps on iPhone 12-class
- Paint: ≤ 1 R3F canvas, ≤ 1 fixed grain overlay, all transforms `transform`/`opacity` only (no layout-affecting properties in the timeline)
- `will-change: transform` only on actively-animating layers, removed after timeline ends

**Accessibility:**
- Section uses semantic `<section>` with `aria-labelledby`
- Headline + body copy live in real DOM (not in the canvas), so screen readers and search engines see everything
- Focus order is unaffected by the pin (focus traversal works on the source order)
- Color contrast on body copy meets WCAG AA against `--background` in both themes

---

## 8. Implementation phases (small, reviewable)

Each phase ends in a working, mergeable state. Stop after each for review.

1. **Phase 1 — Smooth scroll foundation.** Add Lenis as a global provider (`components/providers/smooth-scroll-provider.tsx`), wire it to ScrollTrigger. No visual change to About yet.
2. **Phase 2 — Content rewrite.** Replace `about` block in `lib/data.ts` with the new three-chapter structure (eyebrow/cue, hero word, 3 chapters with `index/pullQuote/body`, snapshot grid copy).
3. **Phase 3 — Pinned shell.** Rebuild About as a pinned 300vh section with three empty act containers. Confirm pin/un-pin behavior across breakpoints. No layers yet.
4. **Phase 4 — ACT I (title card).** Eyebrow cue, giant `MAXWELL` word, particle field, mouse-tilt on stage. No R3F yet.
5. **Phase 5 — R3F haze plane.** Add the L0 shader background. Custom fragment, scroll-driven uniforms.
6. **Phase 6 — ACT II (chapters).** Horizontal track, background numerals, foreground/mid layers with opposite-direction scrub.
7. **Phase 7 — ACT III (snapshot assemble).** Framer Motion 4-direction enter, accent flash one-shot, un-pin handoff.
8. **Phase 8 — Reduced-motion + mobile fallbacks.** Implement the static fallback and the mobile collapsed timeline.
9. **Phase 9 — Polish pass.** Easing curves, timing, contrast in light theme, Lighthouse run, fix any CLS/INP regressions.

---

## 9. Open questions / risks

**Open questions (for you):**
- Q1. The new copy: do you want me to draft the three chapter texts and the rewritten snapshot in Phase 2, or do you want to write them yourself?
- Q2. Section-local accent moments — OK to introduce a single non-token color (a deep teal `#0d3b3e`) as a *background* shader tint to push depth? Or strictly stay within current tokens?
- Q3. Should the giant `MAXWELL` word use full name `MAXWELL GILBERT` (longer drift, more drama) or just `MAXWELL`?
- Q4. The Lenis smooth-scroll provider affects the **whole site**. OK to ship that change site-wide in Phase 1, or want it scoped to just About?

**Risks:**
- R1. Pinning + iOS Safari has known quirks (rubber-band, address bar resize). Mitigation: test early; Lenis handles most of it but ACT II horizontal scrub may need a `100svh` fallback.
- R2. R3F + Lenis + ScrollTrigger together is a lot of moving parts. If perf drops on mid-tier mobile, the R3F layer is the first to drop (replaced by CSS gradient).
- R3. The pinned 300vh changes section anchor scroll behavior — `#about` link from navbar needs to scroll to the *start* of the pin, not the middle. Will verify in Phase 3.
- R4. Bundle size grows by ~35kb gz. Acceptable for the centerpiece, but worth flagging.

---

## 10. File-by-file change list

**New files:**
- `components/providers/smooth-scroll-provider.tsx` — Lenis instance, ScrollTrigger wiring, reduced-motion bypass
- `components/about/about-stage.tsx` — the pinned stage container; orchestrates the GSAP timeline
- `components/about/act-title.tsx` — ACT I title card layer stack
- `components/about/act-chapters.tsx` — ACT II horizontal chapter track
- `components/about/act-snapshot.tsx` — ACT III snapshot assemble
- `components/about/haze-canvas.tsx` — R3F canvas + shader plane (L0)
- `components/about/particle-field.tsx` — SVG particle layer (L1)
- `components/about/use-mouse-parallax.ts` — lerped pointer hook used by the stage
- `components/about/use-reduced-motion.ts` — small wrapper around `matchMedia`

**Modified files:**
- `app/layout.tsx` — wrap children in `<SmoothScrollProvider>`
- `components/about/about.tsx` — becomes a thin shell that renders `<AboutStage />` (or the static fallback under reduced-motion)
- `lib/data.ts` — replace the `about` export with the three-chapter shape:
  ```ts
  export const about = {
    cue: "01 / ABOUT",
    displayWord: "MAXWELL",
    chapters: [
      { index: "01", title: "Origin",  pullQuote: "...", body: "..." },
      { index: "02", title: "Craft",   pullQuote: "...", body: "..." },
      { index: "03", title: "Now",     pullQuote: "...", body: "..." },
    ],
    snapshot: [ /* same shape as today, copy rewritten */ ],
  };
  ```
- `app/globals.css` — add `--about-haze` token, optional `@keyframes` for grain shimmer
- `package.json` — add `lenis`, `gsap`

**Untouched:** hero, skills, projects, experience, contact, navbar, theme system.

---

**Awaiting your review.** Once you green-light (and answer Q1–Q4), I'll start at Phase 1.

---

## 11. Progress log

> Updated as phases land. When resuming a session, read this section first to find the next unchecked phase.

**Resolved defaults (user said "execute it" without answering Q1–Q4):**
- Q1 → Claude drafts chapter copy in Phase 2.
- Q2 → Stay within current tokens, no teal.
- Q3 → Use `MAXWELL` (not full name).
- Q4 → Lenis stays site-wide (it's already site-wide — see Phase 1 note).

**Phase status:**
- [x] **Phase 1 — Smooth scroll foundation.** Lenis was already installed + mounted in `app/layout.tsx` via `components/providers/smooth-scroll.tsx`. Added `gsap`, refactored the provider to drive Lenis via `gsap.ticker` and bind `lenis.on('scroll', ScrollTrigger.update)`. ScrollTrigger now reads scroll from Lenis. No visual change.
- [x] **Phase 2 — Content rewrite.** Added `cue`, `displayWord`, and 3 `chapters` (Origin / Craft / Now) with index, title, pullQuote, body. Snapshot kept. Legacy `eyebrow/heading/bio` left in place so current About still renders — they get removed in Phase 3.
- [x] **Phase 3 — Pinned shell.** Replaced `components/about/about.tsx` with a 300vh section + 100vh pinned stage driven by `ScrollTrigger`. Cue label top-left, scaffolding "ACT N · pp%" indicator top-right, big placeholder word per act in center. Indicator gets removed in Phase 7.
- [x] **Phase 4 — ACT I title card.** Fixed navbar overlap (cue + indicator pushed to `top-20 sm:top-24`). Added `act-title.tsx` (giant `MAXWELL` word slides R→L, Framer Motion scroll-driven x + opacity), `particle-field.tsx` (40 deterministic SVG dots with scroll + mouse drift), and `use-mouse-parallax.ts` (lerped rAF hook, MotionValues, touch/reduced-motion guard). Stage wrapped in `perspective: 1200px` parent + `motion.div` with `rotateX/rotateY` from mouse offsets.
- [x] **Phase 5 — R3F haze plane.** Added `haze-canvas.tsx`: fullscreen quad with a custom GLSL fragment shader (value-noise + scroll-driven warm bias drifting from bottom-right toward center). Accent and background colors are read from CSS variables every frame via `getComputedStyle`, so palette swaps take effect immediately. Under `prefers-reduced-motion`, a static `bg-gradient-to-tr from-background via-background to-accent/5` div is rendered instead.
- [x] **Phase 6 — ACT II chapters.** Created `act-chapters.tsx`: three hardcoded chapter blocks (hooks-in-loops avoided), each with a scroll-driven background numeral (L2, drifts left + scales), pull-quote (L4, vertical drift), and body+label (L5, drifts right — opposite L2 for depth illusion). Cross-fade opacities with ~0.02 overlap. Mounted in `about.tsx`; ACT II placeholder removed.
- [x] **Phase 7 — ACT III snapshot assemble.** Created `act-snapshot.tsx`: 2×2 grid of 4 cards flying in from left/top/bottom/right (Framer Motion scroll-driven x/y), whole act fades in at 0.64–0.70, accent overlay flash blinks at 0.90–0.96. Removed `progress` state, `act` derivation, `onUpdate` callback, and the scaffolding indicator from `about.tsx`; file is now lean.
- [x] **Phase 8 — Reduced-motion + mobile fallbacks.** Reduced-motion users see `<AboutStatic />`: a clean, static editorial section with the same content (cue, MAXWELL heading, three chapters, 2×2 snapshot grid) and zero animation. Mobile users (< 768px) get the full cinematic pinned at 175vh with 14 particles, tighter ±10% chapter drift, and DPR clamped to [1, 1.25] on the R3F canvas.
- [x] **Phase 9 — Polish pass**
  - Item 1 (Easing curves): Added 3-stop multi-stop to all 4 snapshot card slides `[0.68, 0.78, 0.85]` → `["-120%", "-15%", "0%"]` so cards decelerate as they settle.
  - Item 2 (Light-theme contrast): Bumped L2 chapter numeral opacity from `/[0.08]` to `/[0.15]` on all 3 chapters; also removed the redundant `dark:text-foreground/[0.08]` override on Ch.01 since the value is now shared.
  - Item 3 (CLS/hydration): Added explanatory comment in `about.tsx` about the intentional layout shift between static/cinematic. Added `isMobile` to the pin `useEffect` deps array so ScrollTrigger re-initialises when viewport crosses 768px.
  - Item 4 (ACT N indicator): Confirmed fully removed in Phase 7. No stray references found.
  - Item 5 (will-change hygiene): Only `marquee-track` (outside About) has it. Confirmed nothing inside About has permanent `will-change`. Left as-is.
  - Item 6 (Mouse parallax rAF): Already guards on `prefersReduced || isTouch` before starting the loop. Two MotionValue writes per frame — cheap enough to run site-wide. Left as-is.
  - Item 7 (Pull-quote vs body z-order): DOM order per chapter is L2 numeral → L4 pull-quote → L5 body (last = topmost stacking context). Correct. Left as-is.
  - Item 8 (Snapshot grid centering): Added `-translate-y-4 sm:-translate-y-8` to the grid container to compensate for the navbar + cue label visual bias.
  - Item 9 (ACT I → ACT II handoff): Pushed `actOpacity` and `ch1Opacity` fade-in start from 0.30/0.33 to 0.33/0.34. Origin now only appears after MAXWELL has exited, eliminating the large-type collision.
  - Item 10 (Build sanity): `npx tsc --noEmit` clean. `npm run lint` — 5 pre-existing errors in unrelated files, zero new errors. `npm run build` — compiled successfully, all static pages generated.

**Last session ended:** Phase 10 V2 redesign shipped. Awaiting eye-test.

### Phase 10 — V2 pivot (signature trick)

V1 (Phases 1–9) shipped a multi-layer parallax that read as cheap maximalism. V2 strips it
to one signature mechanic: scroll-velocity-driven smear/crystallize on still typography.

**What changed:**
- One trick: velocity smear via `<Smear>` wrapper (skewX + scaleX + filter blur, gel-spring smoothed)
- Pin: 200vh desktop / 150vh mobile (was 300/175)
- Three beats, one element on screen at a time, slow cross-fades, no movement on the elements themselves
- Beat 1: just MAXWELL, centered, still
- Beat 2: pull-quote first, body second, no horizontal drift, no background numeral
- Beat 3: clean 2-col snapshot list (not a card grid, no fly-in, no orange flash)
- Haze canvas softened (smaller warm bias, slower time)

**Deleted:** particle-field.tsx, use-mouse-parallax.ts, mouse tilt, perspective wrapper, MAXWELL slide, horizontal chapter drift, snapshot fly-in, orange flash, scaffolding.

**Files created:** components/about/smear.tsx, components/about/use-scroll-velocity.ts
**Files rewritten:** about.tsx, act-title.tsx, act-chapters.tsx, act-snapshot.tsx, haze-canvas.tsx (shader tweak), about-static.tsx (content shape match)

- **Hotfix:** hoisted scrollYProgress from each Act to about.tsx (Framer Motion useScroll does not re-bind a passed-down ref — was causing chapters/snapshot to never appear).
- **Hotfix 2:** Replaced fragile pinSpacing:false pattern with canonical pin (h-screen section + end:"+=200%" + pinSpacing:true). Scroll progress now read from ScrollTrigger's onUpdate into a MotionValue, eliminating useScroll/pin-math mismatch. Added temporary debug overlay (will remove after user confirms fix).

### Open follow-ups

- **Lint pre-existing errors**: 5 `react-hooks/set-state-in-effect` and `react-hooks/refs` errors exist in `theme-switcher.tsx`, `encrypted-text.tsx`, and `popover.tsx` — not introduced by the About redesign. Worth addressing in a separate pass.
- **iOS Safari rubber-band**: Noted as Risk R1 in §9. Not stress-tested on device during this redesign. The Lenis + ScrollTrigger pin combo should handle it, but worth a real device check before launch.
- **Lighthouse / INP**: No formal Lighthouse run was done (CLI environment only). Run a real Lighthouse on the deployed Cloudflare Pages URL, particularly checking INP on the About pin scroll on a mid-tier mobile device.
