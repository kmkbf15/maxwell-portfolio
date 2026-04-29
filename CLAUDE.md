# CLAUDE.md

Guidance for Claude when working in this repository.

## Project

Personal portfolio for **Maxwell Gilbert Gunawan** — junior frontend developer (0–2 yrs).
Goal: bold, creative, eye-catching site that showcases frontend craft.

## Stack

- Next.js 16.2 (App Router) + React 19 + TypeScript 5
- Tailwind CSS v4 (CSS-first config, `@theme` in `app/globals.css`)
- Framer Motion 12 (scroll/micro-animations)
- React Three Fiber 9 + Drei 10 (lightweight 3D in hero)
- next-themes 0.4 (dark/light, attribute=`class`, default `dark`)
- lucide-react (icons)
- `clsx` + `tailwind-merge` via `cn()` in `lib/utils.ts`
- Hosting: Cloudflare Pages (`@cloudflare/next-on-pages` — added in Step 11)

## How to work in this repo

1. **Read `PLAN.md`** for the full vision and section breakdown.
2. **Update `PROGRESS.md`** every time a step is completed. The user uses this
   as a checkpoint and reads it between steps.
3. **Build incrementally.** The user wants to review after each meaningful
   step. Do not chain steps without confirmation. Stop after each numbered
   build step in `PLAN.md` § "Build Order" and wait.
4. **Start small.** Prefer minimal, working code over feature-rich first
   drafts. We add polish in later steps (cursor, magnetic, 3D, etc.).
5. **Style direction:** bold, creative, memorable. Strong typography, lively
   motion, dark-by-default with light variant. Avoid generic "card grid"
   look — this site needs personality.

## Content rules

- Owner has no personal projects yet — projects section is framed from
  generic office work (Analytics Dashboard, Marketing Landing Page, SaaS
  Feature Module). Never invent client names.
- Owner is **Junior dev (0–2 yrs)**. Tone copy as confident-but-honest, not
  exaggerated seniority.
- Skills owner actually uses: React, Next.js, TypeScript, JavaScript, HTML,
  CSS, Tailwind. Don't add languages they didn't list.

## File conventions

- Components live in `components/<feature>/<component-name>.tsx` (kebab-case file names).
- Shared UI primitives in `components/ui/`.
- Providers in `components/providers/` (use `"use client"`).
- All copy/data in `lib/data.ts` so the user can edit content in one place.
- Use `cn()` helper from `lib/utils.ts` for class merging.
- Path alias `@/*` is configured — import as `@/components/...` or `@/lib/...`.

## Code style

- **Tidy, readable, NOT over-engineered.** User is a junior dev who wants to
  understand and edit the code themselves. No premature abstractions, DI
  patterns, or generic helpers without real reuse.
- One component per file. File order: imports → types → component → exports.
- Tailwind classes inline. No CSS modules, no styled-components.
- TypeScript types kept lightweight — avoid clever generics when a plain
  type or `ComponentProps<typeof X>` works.
- Comments only for non-obvious *why*. Never restate the code.

## Design tokens (Tailwind v4 via `app/globals.css`)

Colors and fonts are CSS variables wired into Tailwind via `@theme inline`.
The `.dark` class swap is registered with `@custom-variant dark`.

| Token | Light | Dark |
|---|---|---|
| `--background` | `#fafaf7` | `#0a0a0a` |
| `--foreground` | `#0a0a0a` | `#fafaf7` |
| `--muted` | `#6b6b6b` | `#a1a1a1` |
| `--border` | `#e7e7e1` | `#1f1f1f` |
| `--accent` | `#ff4d2e` | `#ff5b3c` |
| `--accent-foreground` | `#ffffff` | `#0a0a0a` |

Available Tailwind utilities: `bg-background`, `text-foreground`, `text-muted`,
`border-border`, `bg-accent`, `text-accent`, `text-accent-foreground`.

Fonts: `font-sans` (Geist), `font-mono` (Geist Mono), `font-display`
(Bricolage Grotesque — use for big headlines).

## Commands (once scaffolded)

```bash
npm run dev      # local dev server
npm run build    # production build
npm run lint     # lint
```

## Deployment

Cloudflare Pages via `@cloudflare/next-on-pages`. Don't add Vercel-only
features without an edge-compatible fallback.

## Things to avoid

- No backend / database in MVP (contact form is links-only for now).
- No invented client names, fake testimonials, or fabricated metrics.
- No heavy libraries when CSS/Tailwind can do the job.
- No comments that just restate the code.
