# Plan — Hero Responsiveness Pass

**Scope:** `components/hero/hero.tsx` only. Do not touch `lamp-container.tsx`, `layout-text-flip.tsx`, or other hero subcomponents unless a fix is impossible without it — in which case stop and report back.

**Goal:** Hero looks intentional and readable on every common viewport (small phones → 4K), without horizontal overflow, clipped text, or CTAs that wrap awkwardly.

---

## Target breakpoints

| Range | Width | Notes |
|---|---|---|
| XS phones | 320–374px | iPhone SE, small Androids — tightest case |
| Phones | 375–639px | Default mobile |
| `sm` | 640–767px | Large phones, small tablets portrait |
| `md` | 768–1023px | Tablets |
| `lg` | 1024–1279px | Small laptops |
| `xl+` | 1280px+ | Desktops, ultrawides |

Also verify: landscape phones (short height, ~360–430px tall) and `prefers-reduced-motion`.

---

## Known issues to fix in `hero.tsx`

1. **Headline `text-4xl` (≈36px) may still overflow on 320–360px wide screens** for `site.name`. Add an explicit XS step (e.g. `text-3xl` base → `text-4xl` at `sm`) or reduce tracking. Verify against the actual `site.name` string length in `lib/data.ts`.
2. **Tagline row (`taglineLead` + `LayoutTextFlip`)** uses `flex-wrap` + `gap-2`. On narrow widths the flipping word drops to its own line, which is fine — but the row should stay center-aligned and not jitter when the longest rotating word swaps in. The flip component already grid-stacks for sizing; just ensure parent gap/leading don't cause vertical jump on wrap.
3. **CTA row** is `flex-col` below `sm` and `flex-row` from `sm` up. Confirm both buttons are full-width-comfortable on phones (currently `inline-flex` with `px-6` — fine, but check tap target ≥44px height).
4. **Top spacing** — `mt-6 sm:mt-8` between role kicker → headline → tagline is fine, but the whole content column lives inside `LampContainer` which has a fixed `-translate-y-80` on the content layer. On short viewports (landscape phones, ~400px tall) the top of the headline can clip above the fold. Consider:
   - Reducing top padding via classes on the inner `motion.div` for short screens, OR
   - Document this as a `LampContainer` constraint and leave hero alone.
5. **Scroll indicator** — `bottom-8` is fine but on very short landscape screens it overlaps CTAs. Hide below a min-height threshold (e.g. `max-[500px]:hidden` or `[@media(max-height:600px)]:hidden`).
6. **`max-w-5xl`** content width is fine; just verify `px-5` on `LampContainer`'s content layer gives enough side gutter on 320px screens (it does — 20px each side). No change unless overflow appears.
7. **Parallax transform `y: contentY`** — on mobile, `-15%` of a tall hero can push content noticeably up. Confirm this doesn't worsen the clipping issue from (4). Consider disabling parallax under `md` if it causes problems.

---

## Non-goals

- No copy changes (`site.name`, `hero.taglineLead`, rotating words stay as-is).
- No new components, no extracted helpers.
- No design-token edits.
- No changes to lamp visuals, beam sizes, or backdrop `TextHoverEffect`.
- Do **not** introduce a JS `useMediaQuery` — Tailwind responsive prefixes only.

---

## Code-writer agent — task

**File:** `components/hero/hero.tsx` (only).

**Do:**
1. Read `lib/data.ts` to know the actual `site.name` and `hero.*` string lengths before tuning headline sizes.
2. Add an explicit XS step for the `<h1>` so it never overflows at 320px width. Pattern: `text-3xl xs:text-4xl sm:text-6xl md:text-7xl lg:text-8xl` — but Tailwind v4 doesn't have `xs` by default, so either keep `text-4xl` as base if it actually fits, or drop base to `text-[2rem]` / `text-3xl` and step up at `sm`.
3. Tighten the tagline row so the rotating word wraps cleanly under the lead text on narrow screens without vertical jitter (`items-center` on the wrapper, consistent line-height).
4. Ensure CTA buttons keep ≥44px tap height on mobile (current `py-3` + `text-sm` ≈ 44px — verify, don't shrink).
5. Hide `ScrollIndicator` on short viewports: add `[@media(max-height:600px)]:hidden` (or equivalent) to its wrapper.
6. If headline/tagline clips on short landscape phones because of `LampContainer`'s `-translate-y-80`, reduce the inner content's top offset for short viewports via a class on the `motion.div`, e.g. `[@media(max-height:700px)]:mt-2`. Do **not** edit `lamp-container.tsx`.
7. Disable scroll-driven parallax `y` transform under `md` if it amplifies clipping — guard via a Tailwind class swap is not possible for motion values; instead leave parallax on but reduce range (e.g. `["0%", "-8%"]`) only if testing shows clipping. Prefer leaving it untouched if unproblematic.

**Do not:**
- Don't add new dependencies.
- Don't introduce comments that just restate Tailwind classes.
- Don't refactor unrelated code.
- Don't commit/push (user handles git).

**Definition of done:**
- No horizontal scroll at 320px width.
- Headline, tagline, and CTAs visible above fold on iPhone SE portrait (375×667) and a 360×640 Android.
- No overlap between CTAs and scroll indicator on landscape phones (e.g. 740×360).
- All Tailwind classes valid (no typos), `npm run lint` passes.

---

## Test-writer / runner agent — task

**This project has no test runner configured yet.** Do not scaffold one for this task. Instead, perform manual verification and report.

**Do:**
1. Run `npm run lint` — must pass.
2. Run `npm run build` — must succeed.
3. Start `npm run dev` and verify the hero at these viewport sizes using browser devtools or a headless browser if available:
   - 320×568 (XS phone portrait)
   - 375×667 (iPhone SE)
   - 390×844 (iPhone 14)
   - 414×896 (iPhone 11 Pro Max)
   - 740×360 (landscape phone)
   - 768×1024 (iPad portrait)
   - 1024×768 (iPad landscape / small laptop)
   - 1440×900 (laptop)
   - 1920×1080 (desktop)
4. For each viewport, check:
   - No horizontal scroll.
   - `site.name` headline fits on intended number of lines without clipping.
   - Tagline + rotating word row reads cleanly; rotating word swap doesn't cause layout shift.
   - Both CTAs visible and tappable (≥44px tall).
   - Scroll indicator visible only when there's room for it.
   - Parallax on scroll doesn't cause content to clip into the lamp glow oddly.
5. Verify with `prefers-reduced-motion: reduce` — animations should still be tolerable (this is mostly a Framer Motion concern, not in scope, but flag if broken).

**Report format:** a short table — viewport × pass/fail × note. Under 250 words.

**Do not:**
- Don't add Vitest / Jest / Playwright config.
- Don't write unit tests for `hero.tsx` — it's near-pure JSX, low value.
- Don't commit anything.

---

---

## Round 2 — zoom / cutoff fix

User reports content is still being clipped when zooming in/out. Root cause: `LampContainer` uses a hard-coded `-translate-y-80` (320px) on the content layer and `min-h-screen` on the outer wrapper. At zoom levels and heights where 320px ≠ a sensible offset, content clips above the visible area or under the lamp glow.

**Expanded scope:** `components/hero/lamp-container.tsx` is now in scope. Treat it as a hero-only component.

**Code-writer tasks (round 2):**
1. Replace the rigid `-translate-y-80` content offset with a layout that doesn't depend on a fixed pixel pull-up. Options (pick the simplest that works):
   - Use flex centering on the outer container and let the lamp visuals position themselves *behind* content via `absolute` instead of pulling content up.
   - Or: keep the translate but make it responsive (e.g. `-translate-y-40 sm:-translate-y-60 lg:-translate-y-80`) and clamped at short heights.
2. Ensure the lamp's fixed-rem widths (`w-[45rem]`, `h-56`, `h-44`, `-translate-y-[12.5rem]`, `-translate-y-[6rem]`, `h-48`) don't cause horizontal overflow at small viewports — they already have `max-w-[55vw]` / `max-w-[60vw]` but verify nothing else escapes.
3. Verify `overflow-hidden` on the outer `LampContainer` div is not clipping legitimate content; if it is, switch to `overflow-x-hidden` or move overflow control to a child.
4. Re-verify hero.tsx — the `[@media(max-height:700px)]:mt-16` patch may become unnecessary once the lamp container is fixed; remove it if so.
5. Re-run lint + build.

**Test agent (round 2):** repeat the viewport sweep AND verify at browser zoom levels 75%, 100%, 125%, 150%, 200% on a 1440×900 viewport. Report any remaining cutoffs.

---

## Handoff order

1. Code-writer agent runs first against `hero.tsx`.
2. Test-writer/runner agent verifies in dev server + lint + build.
3. If test agent reports failures, code-writer iterates. Cap at 2 iterations before escalating to the user.
