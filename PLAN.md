# Portfolio Plan — Maxwell Gilbert Gunawan

A bold, creative, eye-catching frontend portfolio that showcases Maxwell's
selling point as a frontend developer. Built to feel alive and memorable.

---

## 1. Tech Stack

| Layer | Choice | Why |
|---|---|---|
| Framework | **Next.js 15** (App Router) | Modern React, SEO, great DX |
| Language | **TypeScript** | Type safety, matches work stack |
| Styling | **Tailwind CSS v4** | Fast iteration, utility-first |
| Animations | **Framer Motion** | Best-in-class scroll/micro animations |
| 3D | **React Three Fiber + Drei** | Lightweight Three.js wrapper for hero |
| Icons | **Lucide React** | Clean, consistent icon set |
| Theme | **next-themes** | Dark/light toggle with no flicker |
| Fonts | **next/font** (Geist + a display font) | Performant, no layout shift |
| Hosting | **Cloudflare Pages** | User's choice; via `@cloudflare/next-on-pages` |

---

## 2. Project Structure

```
maxwell-portfolio/
├── app/
│   ├── layout.tsx              # Root layout, theme provider, fonts, cursor
│   ├── page.tsx                # Single-page portfolio (composes sections)
│   ├── globals.css             # Tailwind directives + custom CSS vars
│   └── not-found.tsx           # Fun 404 page
├── components/
│   ├── nav/
│   │   ├── Navbar.tsx          # Sticky nav with scroll progress
│   │   └── ThemeToggle.tsx     # Animated dark/light toggle
│   ├── hero/
│   │   ├── Hero.tsx            # Hero section orchestrator
│   │   ├── HeroCanvas.tsx      # R3F 3D scene (cursor-reactive)
│   │   └── NameReveal.tsx      # Animated name entrance
│   ├── about/
│   │   └── About.tsx           # About me + photo placeholder
│   ├── skills/
│   │   ├── Skills.tsx          # Animated skill grid
│   │   └── SkillCard.tsx       # Individual skill tile w/ hover
│   ├── projects/
│   │   ├── Projects.tsx        # Section wrapper
│   │   └── ProjectCard.tsx     # Card with image, hover, links
│   ├── experience/
│   │   ├── Experience.tsx      # Timeline section
│   │   └── TimelineItem.tsx    # Single experience entry
│   ├── contact/
│   │   └── Contact.tsx         # Footer with social links
│   └── ui/
│       ├── CustomCursor.tsx    # Custom cursor that morphs
│       ├── MagneticButton.tsx  # Buttons that pull toward cursor
│       ├── ScrollProgress.tsx  # Top scroll progress bar
│       ├── Reveal.tsx          # Reusable scroll reveal wrapper
│       └── Marquee.tsx         # Looping text marquee
├── lib/
│   ├── data.ts                 # All content (projects, skills, experience)
│   ├── utils.ts                # cn() helper, etc.
│   └── animations.ts           # Shared variants for Framer Motion
├── public/
│   ├── images/                 # Project screenshots (placeholders)
│   ├── resume.pdf              # (to add later)
│   └── favicon.ico
├── tailwind.config.ts
├── tsconfig.json
├── next.config.ts
├── package.json
└── README.md
```

---

## 3. Sections (in order)

### 3.1 Hero
- Huge animated name reveal: **"Maxwell Gilbert Gunawan"**
- Tagline (rotating words): *"Frontend Developer crafting interfaces that feel alive."*
- Subtle 3D shape (cursor-reactive) on the side
- Two CTAs: "View Work" (scrolls), "Get in Touch"
- Scroll-down indicator

### 3.2 About
- Short bio: junior frontend dev (0–2 yrs), focus on UI craft
- A snapshot list (location, what you do, what you love)
- Photo placeholder (replace later)

### 3.3 Skills
- Animated grid of: **React, Next.js, TypeScript, JavaScript, HTML, CSS, Tailwind**
- Each tile reveals on scroll, hover lifts + glows
- Subtle proficiency dots

### 3.4 Projects (framed from office work)
Three case studies — generic, no client names:

1. **Analytics Dashboard** — internal admin tool. Data tables, charts, filters, role-based access.
2. **Marketing Landing Page** — client-facing site. Pixel-perfect from design, performance optimized, responsive.
3. **SaaS Feature Module** — web app feature. Complex user flows, API integration, state management.

Each card has: title, summary, tech stack chips, "Live"/"Code" links (optional), screenshot placeholder.

### 3.5 Experience
- Vertical timeline
- Current role entry (placeholder details for you to fill)
- Downloadable resume button (PDF added later)

### 3.6 Contact
- Bold "Let's build something" CTA
- Email, LinkedIn, GitHub buttons (you'll provide URLs)
- Footer with copyright

---

## 4. "Wow" Features

| Feature | Detail |
|---|---|
| **Custom cursor** | Morphs/expands on interactive elements |
| **Magnetic buttons** | Subtle pull toward cursor on hover |
| **Scroll reveals** | Text & elements fade/slide on scroll |
| **3D hero canvas** | Rotating geometry, cursor parallax, lightweight |
| **Theme toggle** | Animated icon morph, smooth color transition |
| **Name reveal** | Letters animate in on first load |
| **Scroll progress bar** | Thin bar at top showing page position |
| **Marquee strip** | Looping skills/values band between sections |

---

## 5. Build Order

1. `create-next-app` with TS + Tailwind + App Router
2. Install deps: framer-motion, three, @react-three/fiber, @react-three/drei, next-themes, lucide-react, clsx, tailwind-merge
3. Setup `globals.css`, theme provider, fonts in `layout.tsx`
4. Build `Navbar` + `ScrollProgress` + `ThemeToggle`
5. Build `Hero` (start with text + animations, then add 3D canvas)
6. Build `About` and `Skills`
7. Build `Projects` + `ProjectCard`
8. Build `Experience` timeline
9. Build `Contact` footer
10. Add `CustomCursor` + `MagneticButton` polish layer
11. Polish pass: spacing, typography rhythm, responsive checks
12. Cloudflare Pages config + deploy instructions in README

---

## 6. Content I'll Write For You

Since you don't have personal projects yet, I'll write:
- Hero tagline + about copy (you can edit your tone in)
- Generic but professional descriptions for the 3 office-work projects (no client names, framed as case studies)
- Skills descriptions
- Experience entry placeholders

You will need to provide later:
- Real photo (or skip)
- Resume PDF
- LinkedIn/GitHub/email URLs
- Real screenshots of work (or we keep stylized placeholders)

---

## 7. Future Ideas (post-MVP)

- Blog / writings (MDX)
- Project detail pages (case study deep-dives)
- Spotify "now playing" widget
- Guestbook / view counter (Cloudflare D1)
- Subtle sound effects
- Konami code easter egg
- Working contact form (Cloudflare Workers + Resend)
- View transitions API for nav
- i18n (English / Indonesian)

---

## 8. Deployment (Cloudflare Pages)

- Build with `@cloudflare/next-on-pages`
- Config `next.config.ts` for edge runtime where applicable
- Deploy via Wrangler or Cloudflare dashboard
- Custom domain setup (optional, your own domain)

---

## 9. Definition of Done (MVP)

- [ ] All 6 sections built and content-complete
- [ ] Dark/light mode works without flicker
- [ ] Custom cursor + magnetic buttons live on desktop
- [ ] Fully responsive (mobile, tablet, desktop)
- [ ] Lighthouse: Performance ≥ 90, Accessibility ≥ 95
- [ ] Deploys cleanly to Cloudflare Pages
- [ ] README with run + deploy instructions

---

**Read this through. When you're ready, reply "go" and I'll start from step 1.**
**If anything should change, tell me what to adjust before we begin.**
