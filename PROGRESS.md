# Progress Tracker

Single source of truth for what's been built. Updated after every completed step.

Legend: `[ ]` = not started · `[~]` = in progress · `[x]` = done · `[!]` = blocked

---

## Build Steps

- [x] **Step 1 — Scaffold Next.js + TypeScript + Tailwind** _(done 2026-04-29)_
  - `create-next-app` ran with: TypeScript, Tailwind v4, ESLint, App Router, no src dir, alias `@/*`
  - Installed: Next.js **16.2.4**, React **19.2.4**, Tailwind **v4**, TypeScript **5**
  - Type check passes (`npx tsc --noEmit` clean)
  - Note: Node 21 in use; Next prefers 18/20/≥22 LTS. Works but consider Node 22 LTS later.
  - Files scaffolded: `package.json`, `tsconfig.json`, `next.config.ts`, `eslint.config.mjs`, `postcss.config.mjs`, `app/{layout,page,globals.css,favicon.ico}`, `public/`, `.gitignore`, `AGENTS.md`, `README.md`

- [x] **Step 2 — Install core dependencies** _(done 2026-04-29)_
  - **Animations:** `framer-motion@12.38`
  - **3D:** `three@0.184`, `@react-three/fiber@9.6`, `@react-three/drei@10.7`, `@types/three@0.184` (dev)
  - **Theme:** `next-themes@0.4`
  - **Icons:** `lucide-react@1.14`
  - **Utils:** `clsx@2.1`, `tailwind-merge@3.5`
  - 62 new packages added total. Type check passes.
  - ⚠️ Node engine warning: `camera-controls` (a drei dep) wants Node ≥22, you're on 21. Works for now but switching to Node 22 LTS later is recommended.

- [x] **Step 3 — Theme, fonts, globals** _(done 2026-04-29)_
  - `ThemeProvider` (next-themes) added to `app/layout.tsx`. Default theme: `dark`. Attribute: `class`. System preference enabled.
  - Fonts wired via `next/font/google`: **Geist** (sans), **Geist Mono** (mono), **Bricolage Grotesque** (display, weights 400/600/700/800).
  - `app/globals.css` rewritten with CSS-first design tokens:
    - Light & dark palettes (`--background`, `--foreground`, `--muted`, `--border`, `--accent`, `--accent-foreground`)
    - Tailwind v4 `@theme inline` block exposes colors as utilities (`bg-background`, `text-muted`, `text-accent`, etc.) and fonts as `font-sans` / `font-mono` / `font-display`
    - `@custom-variant dark` registered so `dark:*` classes use `.dark` class swap
    - Smooth color transition on theme toggle, custom selection color
  - `lib/utils.ts` — `cn()` helper using `clsx` + `tailwind-merge`
  - `lib/data.ts` — central content file (currently just owner basics)
  - `app/page.tsx` — placeholder shows site name in display font with accent highlight on "Gunawan"
  - **Production build passes** (`npm run build`): 4 routes, all static prerendered.

- [x] **Step 4 — Navbar + ScrollProgress + ThemeToggle** _(done 2026-04-29)_
  - `components/nav/scroll-progress.tsx` — thin 2px accent bar at top, spring-smoothed via Framer Motion `useScroll` + `useSpring`
  - `components/nav/theme-toggle.tsx` — sun/moon button (lucide-react), uses `next-themes` `resolvedTheme`, hydration-safe (renders icon only after mount)
  - `components/nav/navbar.tsx` — sticky top, blurred translucent background, name + section links + theme toggle. Section links hidden on mobile (mobile menu drawer is a polish-step task).
  - `lib/data.ts` — added `navLinks` array (About, Skills, Work, Experience, Contact)
  - `app/layout.tsx` — wires `ScrollProgress` + `Navbar` into the layout, adds `id="top"` wrapper around children for the logo "scroll to top" link
  - `app/page.tsx` — added 5 placeholder sections with proper IDs so nav links scroll correctly. Hero placeholder kept; sections will be filled in Steps 5–9.
  - **Production build passes**, type check clean, no a11y warnings.

- [x] **Step 5 — Hero section** _(done 2026-04-29)_
  - `components/hero/hero-canvas.tsx` — R3F `<Canvas>` with a high-poly distorted sphere (`MeshDistortMaterial` from drei). Cursor-reactive rotation via `useFrame` + `pointer`. Color: accent (`#ff4d2e`).
  - `components/hero/name-reveal.tsx` — per-word slide-up entrance. Each word wrapped in `overflow-hidden` so the slide is clipped cleanly. Cubic-bezier ease, staggered 120ms.
  - `components/hero/rotating-text.tsx` — cycles `["alive", "fast", "bold", "fluid"]` every 2.2s using Framer Motion `AnimatePresence`. Word in display font + accent color.
  - `components/hero/hero.tsx` — composes everything. 3D blob behind text with radial mask + 60% opacity so text stays readable. Role label, name reveal, tagline, two CTAs (View Work → #projects, Get in Touch → #contact). Fade-up entrance for non-name elements.
  - `lib/data.ts` — added `hero` block (tagline lead, rotating words, CTAs)
  - `app/page.tsx` — replaced hero placeholder with `<Hero />`. Other section placeholders unchanged.
  - **Production build passes**, type check clean.

- [x] **Step 6 — About + Skills** _(done 2026-04-29)_
  - `components/about/about.tsx` — two-column layout (bio left, snapshot list right). Eyebrow label + display heading + 3-paragraph bio. Snapshot is a `<dl>` with mono labels and border-left accents. Scroll-reveal motion (whileInView, fires once).
  - `components/skills/skills.tsx` — section wrapper with eyebrow + heading + responsive grid (2 / 3 / 4 cols).
  - `components/skills/skill-card.tsx` — tile with lucide icon (Atom/Triangle/Braces/Code2/FileCode2/Paintbrush/Wind), name, 5 proficiency dots. Hover lifts -4px, accent border, accent glow blur. Stagger via `index * 0.06`.
  - `lib/data.ts` — added `about` (eyebrow, heading, bio[], snapshot[]), `skillsSection` (eyebrow, heading), `skills[]` (name + level 1–5). Set `site.location` to "Jakarta, Indonesia".
  - `app/page.tsx` — replaced about/skills placeholders with real components; projects/experience/contact still placeholders for Steps 7–9.
  - **Production build passes**, type check clean.

- [x] **Step 7 — Projects (3 case studies) + parallax pass** _(done 2026-04-29)_
  - `components/projects/projects.tsx` — section header (eyebrow, heading, intro) + sticky-stack wrapper rendering 3 ProjectCards. 20vh tail spacer so the last card unsticks before the next section.
  - `components/projects/project-card.tsx` — `sticky top-0 h-screen` wrapper per card. Inner `<motion.article>` uses `useScroll({ offset: ["start start", "end start"] })` to drive `scale` (1 → ~0.85 depending on stack depth) and `opacity` (1 → 0.7) so each card visually shrinks behind the next. Each card also gets a small `paddingTop = index * 28px` to "peek" beneath the previous one.
  - `components/projects/browser-mockup.tsx` — fake browser frame: chrome dots + URL bar + 360–440px canvas. Inside: animated radial gradients, two slowly drifting accent blobs (framer infinite loop), abstract sidebar bars, and a fake bar chart whose bars scale-up on viewport entry. Subtle dot-grain overlay.
  - `lib/data.ts` — added `projectsSection` (eyebrow/heading/intro) and `projects[]` with title, kind, blurb, role, year, tech[], `accent` color, and `domain` (each project has its own accent so previews feel distinct).
  - `components/hero/hero.tsx` — added scroll parallax: 3D blob drifts down (y: 0 → 40%) and fades (opacity: 0.6 → 0); foreground content drifts up slightly (y: 0 → -15%) and fades (1 → 0.2). Driven by `useScroll` on the section ref.
  - `components/about/about.tsx` — added scroll parallax: bio column drifts up by -12%, snapshot column by -28% across the section's `[start end, end start]` range. Subtle depth, not distracting.
  - `app/page.tsx` — replaced projects placeholder with `<Projects />`. Experience + contact still placeholders for Steps 8–9.
  - **Production build passes**, type check clean.

- [x] **Step 8 — Experience timeline** _(done 2026-04-29)_
  - `components/experience/experience.tsx` — left-aligned timeline. Vertical line at `left-[9px]`; faded base line + accent draw line driven by `useScroll({ offset: ["start 75%", "end 60%"] })` and `scaleY` from 0→1 (origin top) so the accent line draws itself as the user scrolls through.
  - Each entry has a dot at the same x-coordinate as the line, with `-translate-x-1/2` so it sits centered. Current role gets a filled accent dot + an animated halo (infinite scale 1→2.2 + fade) for a subtle "live" pulse.
  - Entries fade-in with a slight x-offset stagger.
  - Resume button at the bottom: lucide `<Download>` icon + "Download Resume" pill. Links to `/resume.pdf` (placeholder — drop a real PDF in `public/` to make it work).
  - `lib/data.ts` — added `experienceSection` (eyebrow/heading), `experience[]` (3 entries: current role, first role, university), and `resumeUrl`.
  - `app/page.tsx` — replaced experience placeholder with `<Experience />`. Contact still placeholder for Step 9.
  - **Production build passes**, type check clean.

- [x] **Step 9 — Contact footer** _(done 2026-04-29)_
  - `components/contact/parallax-marquee.tsx` — looping horizontal text strip. Outer `motion.div` applies a scroll-driven `x` offset (via `useScroll` + `useTransform`); inner `motion.div` runs an infinite `x: 0% → -50%` loop (6 copies of the phrase so the loop is seamless). Direction prop flips both the scroll offset sign and the loop direction. Exposes `accent` for the inverted color row.
  - `components/contact/contact.tsx` — section renders two opposing marquees (one foreground, one accent, different speeds), then a centered eyebrow + huge headline + copy + 3-card link grid. Headline drifts on scroll via parallax y-transform.
  - Cards: each link is a rounded card with icon + label + handle + ArrowUpRight indicator. Hover: accent border, accent arrow lift. Empty `href` (e.g. LinkedIn) renders as a dashed disabled card with "Coming soon" — flips to active automatically when the URL is filled in `lib/data.ts`.
  - Lucide v1 dropped brand glyphs, so `GithubIcon` and `LinkedinIcon` are local inline SVGs in `contact.tsx`.
  - Footer: thin top-bordered row with copyright + "Built with Next.js · Tailwind · Framer Motion" credit.
  - `lib/data.ts` — set `site.email = "maxmaxwellgilbert@gmail.com"` and `site.social.github = "https://github.com/kmkbf15"` (LinkedIn left blank). Added `contactSection` (eyebrow/marqueeText/headline/copy) and `contactLinks[]` (built off `site` so editing email/socials in one place updates everywhere).
  - `app/page.tsx` — wired `<Contact />` as the final section; placeholders gone.
  - **Production build passes**, type check clean.

- [x] **Step 10 — Polish: custom cursor + magnetic buttons** _(done 2026-04-29)_
  - `components/ui/custom-cursor.tsx` — two-layer cursor: solid accent dot tracks the pointer 1:1, hollow accent ring follows with spring lag (`useSpring`, stiffness 200 / damping 22). Ring scales to 1.6× when the pointer is over an `a`, `button`, or `[data-cursor='link']`. First touch event flips the device into "touch" mode and unmounts the cursor permanently. Adds `.custom-cursor-active` to `<html>` while mounted.
  - `app/globals.css` — `@media (hover: hover) and (pointer: fine)` rule that hides the native cursor only when `.custom-cursor-active` is on `<html>`, so phones never lose their cursor.
  - `components/ui/magnetic.tsx` — generic wrapper. Uses `useMotionValue` + `useSpring` to translate the wrapped child by `(pointer - center) * strength` on `pointermove`, springs back to 0 on `pointerleave`. Caller controls layout via className (`inline-block` for inline buttons, `block` for cards).
  - `app/layout.tsx` — mounts `<CustomCursor />` once at the root.
  - `components/hero/hero.tsx` — both CTAs wrapped in `<Magnetic className="inline-block">`.
  - `components/experience/experience.tsx` — resume button wrapped in Magnetic.
  - `components/nav/theme-toggle.tsx` — sun/moon button wrapped in Magnetic (strength 0.5 — small target gets a stronger pull).
  - `components/contact/contact.tsx` — active link cards wrapped in Magnetic (strength 0.25, gentler since the targets are bigger). Disabled "Coming soon" card stays unwrapped.
  - **Production build passes**, type check clean.

- [x] **Performance pass — Lighthouse 74 → optimize** _(done 2026-04-30)_
  - **Lazy-loaded the R3F hero canvas** via `next/dynamic({ ssr: false })`. Three.js + drei (~865KB) is now an async chunk loaded after first paint instead of blocking LCP. Hero text renders immediately; the blob fades in once the chunk resolves.
  - **Reduced sphere geometry**: 96×96 → 64×64 segments (~55% fewer verts). Distort `speed` 2.2 → 1.6, `distort` 0.55 → 0.5 — cheaper noise shader per frame, visually almost identical.
  - **Capped DPR** at `[1, 1.5]` (was `[1, 2]`). At dpr=2 the shader runs 4× the pixels on retina displays for marginal visual gain.
  - **Added `powerPreference: "high-performance"`** to the WebGL context — prefers the discrete GPU on hybrid laptops.
  - **Trimmed Bricolage Grotesque weights** to `[600, 700]` (was `[400, 600, 700, 800]`). Verified by greping `font-display` usages — only 600 and 700 are actually used. Roughly halved display-font payload.
  - **Added `display: "swap"`** to all three `next/font` declarations so text renders immediately with the fallback while the webfont streams in (eliminates FOIT, improves FCP/LCP).
  - **Custom cursor — eliminated React re-renders on pointermove**: replaced `useState(hovering)` (which re-rendered on every link enter/leave) with a `useMotionValue` driving the ring's `scale` via spring. Also throttled the `closest()` lookup to one rAF per frame; the dot's position is still applied immediately so it stays glued to the cursor.
  - `next/font` declarations also now have `display: "swap"` for FCP improvement.
  - **Production build passes**, type check clean. Three.js correctly split into its own async chunk (verified in `out/_next/static/chunks`).

- [x] **Step 11 — Cloudflare Pages deploy config** _(done 2026-04-30)_
  - The site is fully client-side (every component is `"use client"`, no API routes, no server actions, no SSR data fetching), so a **Next.js static export** is the cleanest fit for Cloudflare Pages — much simpler than `@cloudflare/next-on-pages` and avoids the Workers/edge-runtime constraints.
  - `next.config.ts` — added `output: "export"` (emits a fully static site to `out/`), `images: { unoptimized: true }` (the default loader needs a Node runtime; this keeps a future `<Image>` import working under export), and `trailingSlash: true` (generates `/about/index.html` instead of `/about.html` so Cloudflare's static hosting serves clean URLs without redirects).
  - `.nvmrc` — added with `22` so Cloudflare Pages auto-selects Node 22 LTS (matches what `camera-controls` / drei want).
  - **Local build verified**: `npm run build` produces `out/` with `index.html`, `404.html`, `_next/static/{chunks,media}`, `favicon.ico`, etc. Confirmed nothing pulls in a server runtime.
  - **Cloudflare Pages dashboard settings**:
    - Framework preset: **Next.js (Static HTML Export)** _(or "None" — both work)_
    - Build command: `npm run build`
    - Build output directory: `out`
    - Node version: auto-detected from `.nvmrc` (`22`)
    - Environment variables: none needed for MVP
  - User pushes the `next.config.ts` + `.nvmrc` changes and retries the deploy. If anything still fails, paste the Cloudflare build log.

- [x] **Step 12 — Multi-palette theme switcher** _(done 2026-05-02)_
  - Hybrid theme model: 5 preset accent palettes (Sunset, Ocean, Forest, Royal, Rose) × light/dark mode + a custom-accent color picker.
  - `components/providers/palette-provider.tsx` — context that holds the active palette id + custom hex, persists both to `localStorage`, and applies them to `<html>` (`data-palette` attribute for presets; inline `style.--accent` + readable `--accent-foreground` derived via sRGB luminance for custom).
  - `app/globals.css` — added `:root[data-palette="…"]` and `.dark[data-palette="…"]` overrides for the four non-default presets. Only `--accent` and `--accent-foreground` swap; backgrounds/text stay coherent with light/dark mode.
  - `components/ui/popover.tsx` — Framer Motion popover (no Radix). Trigger + Content + portal to `document.body`. Computes `getBoundingClientRect()` to anchor a fixed-position wrapper; the inner motion.div animates only `scale`/`opacity` from a transform-origin matching the trigger side+align (so framer's transform doesn't fight the wrapper's positioning translate). Recomputes on scroll/resize. Closes on click-outside (mousedown) and Escape.
  - `components/nav/theme-switcher.tsx` — replaces the old sun/moon `ThemeToggle`. Palette icon trigger (still wrapped in `<Magnetic>`). Popover panel has three sections: Mode (Light/Dark), Palette (5 swatches with active ring + check mark), Custom accent (native `<input type="color">` + live hex readout). Selecting a swatch sets `data-palette`; picking a custom color flips palette to `"custom"` automatically.
  - `app/layout.tsx` — wraps the tree with `<PaletteProvider>` inside `<ThemeProvider>`.
  - `components/nav/navbar.tsx` — uses `<ThemeSwitcher />`. Old `theme-toggle.tsx` deleted.
  - Type check clean.

- [x] **Step 13 — Remove custom cursor** _(done 2026-05-02)_
  - Reverted to the native browser cursor. Removed `<CustomCursor />` from `app/layout.tsx`, deleted `components/ui/custom-cursor.tsx`, and stripped the `.custom-cursor-active { cursor: none }` rule from `app/globals.css`.
  - `<Magnetic>` wrappers stay — they're independent of the cursor and still pull links/buttons toward the pointer.

- [x] **Step 14 — Smooth color transitions on theme/palette change** _(done 2026-05-02)_
  - Removed `disableTransitionOnChange` from `<ThemeProvider>` (it was injecting `* { transition: none !important }` during theme switches and killing all our transitions).
  - Added a global `*,*::before,*::after` rule in `globals.css` that tweens `background-color`, `border-color`, `color`, `fill`, `stroke` over 350ms ease. Transform/opacity/layout properties are intentionally not listed so existing hover and scroll animations stay snappy.
  - Tailwind's per-element `transition-colors` utilities still win on specificity, so buttons with their own 150ms hover timings keep them — only "untouched" elements pick up the global tween.
  - Effect: switching mode (light/dark) and switching palette swatches both fade colors smoothly across the whole page; the custom accent picker also drags-update colors fluidly as you scrub the picker.
  - Follow-up: tried adding `background-image` + `box-shadow` to cover gradients/shadows on light/dark swap — caused visible lag because animating gradient interpolation on every node is expensive. Reverted to a leaner property list (`background-color`, `border-color`, `color`, `fill`, `stroke`) at 200ms.
  - Final: light/dark swap was still felt heavy on slower frames because it changes virtually every element's bg/border/text simultaneously. Re-enabled `disableTransitionOnChange` on `<ThemeProvider>` — it injects a one-frame `transition: none !important` only during the light/dark flip, so that swap is now instant. Palette swaps (managed directly on `<html data-palette>` by `PaletteProvider`, not via next-themes) bypass that injected style and still crossfade smoothly via the global rule.

---

## Files & Folders Created

_(updated as we go)_

- `PLAN.md` — full project plan
- `CLAUDE.md` — guidance for Claude in this repo
- `PROGRESS.md` — this file
- `AGENTS.md` — autogenerated by create-next-app (can be removed if unused)
- `app/layout.tsx` — root layout (default Next.js scaffold, will be customized in Step 3)
- `app/page.tsx` — home page (default Next.js welcome page, will be replaced in Step 5+)
- `app/globals.css` — Tailwind v4 base styles (will be extended in Step 3)
- `next.config.ts`, `tsconfig.json`, `eslint.config.mjs`, `postcss.config.mjs` — config files
- `public/` — Next.js default assets (will be replaced)
- `.claude/settings.local.json` — project-scoped permissions (auto-allow tools so Claude works frictionlessly here)
- `lib/utils.ts` — `cn()` class-merge helper
- `lib/data.ts` — central content/copy file (edit here to update site)
- `components/providers/theme-provider.tsx` — next-themes wrapper (client component)
- `components/nav/navbar.tsx` — sticky top nav (client) with sliding accent underline that follows hovered link
- `components/nav/scroll-progress.tsx` — top scroll progress bar (client)
- `components/nav/theme-switcher.tsx` — palette icon → popover with mode + 5 palette swatches + custom accent picker (client)
- `components/providers/palette-provider.tsx` — context that persists palette id / custom accent and applies them to `<html>` (client)
- `components/ui/popover.tsx` — Framer Motion popover (no Radix); portal-rendered, scale/fade from trigger origin (client)
- `components/hero/hero.tsx` — hero section orchestrator (client)
- `components/hero/lamp-container.tsx` — Aceternity lamp-effect backdrop with smoother expo-out timings (client)
- `components/hero/name-reveal.tsx` — animated name (client)
- `components/hero/layout-text-flip.tsx` — Aceternity-style layout-animated word flip (client)
- `components/hero/scroll-indicator.tsx` — mouse-with-bouncing-dot scroll cue at hero bottom; fades on scroll (client)
- `components/about/about.tsx` — about section (client)
- `components/skills/skills.tsx` — skills section wrapper (client)
- `components/skills/skill-card.tsx` — single skill tile (client)
- `components/projects/projects.tsx` — projects section + sticky-stack wrapper (client)
- `components/projects/project-card.tsx` — sticky-pinned card with scroll-driven scale/opacity (client)
- `components/projects/browser-mockup.tsx` — stylized browser preview with animated abstract gradient (client)
- `components/experience/experience.tsx` — vertical timeline w/ scroll-draw accent line + pulsing current-role dot (client)
- `components/contact/contact.tsx` — contact section: marquee rows, headline, link cards, footer (client)
- `components/contact/parallax-marquee.tsx` — looping marquee with scroll-driven extra offset (client)
- `components/ui/magnetic.tsx` — generic wrapper that pulls children toward the cursor (client)
- `.nvmrc` — pins Node 22 LTS for Cloudflare Pages builds

---

## Notes / Decisions

- 2026-04-29 — Project kicked off. Owner: Maxwell Gilbert Gunawan, junior dev.
- Building incrementally; user reviews after each step before next begins.
- 2026-04-29 — GitHub repo live at **https://github.com/kmkbf15/maxwell-portfolio** (public, branch `main`). All future commits & pushes are done by the user, not Claude.
- 2026-05-02 — Hero entrance choreographed: role → name → tagline → MAX backdrop → lamp → buttons → scroll indicator. `LampContainer` and `TextHoverEffect` now accept `startDelay` so timing is configured from `hero.tsx`.
- 2026-05-02 — Responsive sweep: navbar gained a working hamburger + slide-down mobile menu; lamp cones capped at `max-w-[55vw]` to stop overflow on phones; hero h1 retuned `text-4xl → text-8xl` across breakpoints; project cards downsized padding/typography on mobile; browser mockup heights step `260 → 360 → 440`; marquee text rebased at `text-4xl`; contact links use `1 → 2 → 3` columns instead of jumping to 3.
