# maxwell-portfolio

Personal portfolio of **Maxwell Gilbert Gunawan** — frontend developer.

Live site: _coming soon_

## Stack

- **Next.js 16** (App Router) + **React 19** + **TypeScript 5**
- **Tailwind CSS v4** (CSS-first config)
- **Framer Motion** — scroll & micro-animations
- **React Three Fiber + Drei** — lightweight 3D in the hero
- **next-themes** — dark / light mode
- **lucide-react** — icons

## Local development

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Project structure

```
app/                  # Next.js App Router pages
components/
  providers/          # Theme provider (client)
  nav/                # Nav, scroll progress, theme toggle
  hero/               # Hero section + 3D canvas
  about/              # About me
  skills/             # Skill grid
  projects/           # Project case studies
  experience/         # Timeline
  contact/            # Contact footer
  ui/                 # Custom cursor, magnetic button, etc.
lib/
  utils.ts            # cn() class merge helper
  data.ts             # Site copy / content (edit here)
public/               # Images, resume, favicon
```

## Design tokens

Defined in `app/globals.css` via Tailwind v4 `@theme`:

| Token | Tailwind utility |
|---|---|
| Background | `bg-background` |
| Foreground | `text-foreground` |
| Muted | `text-muted` |
| Accent | `text-accent` / `bg-accent` |
| Border | `border-border` |

Fonts: `font-sans` (Geist), `font-mono` (Geist Mono), `font-display` (Bricolage Grotesque).

## Build & deploy

```bash
npm run build   # production build
npm start       # start production server locally
```

Hosting target: **Cloudflare Pages** (configured in a later step).

## License

MIT
