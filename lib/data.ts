// Central place for all portfolio content.
// Edit here to update the site — components read from this file.

export const site = {
  name: "Maxwell Gilbert Gunawan",
  shortName: "Maxwell",
  role: "Frontend Developer",
  tagline: "Crafting interfaces that feel alive.",
  location: "Jakarta, Indonesia",
  email: "maxmaxwellgilbert@gmail.com",
  social: {
    github: "https://github.com/kmkbf15",
    // Add your LinkedIn URL when ready — the contact card will switch from
    // disabled to active automatically.
    linkedin: "",
  },
};

export const navLinks = [
  { href: "#about", label: "About" },
  { href: "#skills", label: "Skills" },
  { href: "#projects", label: "Work" },
  { href: "#experience", label: "Experience" },
  { href: "#contact", label: "Contact" },
];

export const hero = {
  taglineLead: "Building interfaces that feel",
  rotatingWords: ["alive", "fast", "bold", "fluid"],
  primaryCta: { label: "View Work", href: "#projects" },
  secondaryCta: { label: "Get in Touch", href: "#contact" },
};

export const about = {
  eyebrow: "About",
  heading: "A few things about me.",
  bio: [
    "I'm Maxwell — a frontend developer based in Jakarta, focused on building interfaces that feel responsive, clean, and a little bit alive.",
    "Most of my work happens in React and Next.js. I care about the small details: animation timing, type rhythm, the way a button settles after a click — the stuff people don't notice until it's wrong.",
    "Early in my career and learning fast. Every ship is a chance to tighten the craft.",
  ],
  snapshot: [
    { label: "Based in", value: "Jakarta, Indonesia" },
    { label: "Role", value: "Frontend Developer" },
    { label: "Daily stack", value: "React · Next.js · TypeScript" },
    { label: "Into", value: "Motion, type, clean UI" },
  ],
};

export const skillsSection = {
  eyebrow: "Skills",
  heading: "The toolkit.",
};

// Level is a self-rated comfort score 1–5 — adjust freely.
export const skills = [
  { name: "React", level: 4 },
  { name: "Next.js", level: 4 },
  { name: "TypeScript", level: 3 },
  { name: "JavaScript", level: 4 },
  { name: "HTML", level: 5 },
  { name: "CSS", level: 4 },
  { name: "Tailwind", level: 5 },
];

export const experienceSection = {
  eyebrow: "Experience",
  heading: "The road so far.",
};

// Edit dates / titles / orgs in this list — the timeline reads from here.
export const experience = [
  {
    period: "2025 — Now",
    title: "Frontend Developer",
    org: "Current role",
    description:
      "Working across internal dashboards and client-facing sites. Day-to-day in React, Next.js, and TypeScript — shipping features, polishing UI, and learning the parts of the stack I haven't touched yet.",
    current: true,
  },
  {
    period: "2024 — 2025",
    title: "Junior Frontend Developer",
    org: "First role",
    description:
      "Cut my teeth on production frontend work — component libraries, responsive layouts, and the discipline of code review. Got comfortable with TypeScript and the Next.js App Router.",
    current: false,
  },
  {
    period: "2021 — 2024",
    title: "Computer Science",
    org: "University",
    description:
      "Bachelor's degree. Focused on web technologies and software engineering, with a steady stream of side projects on the side.",
    current: false,
  },
];

// Drop a real resume.pdf into /public to make the button work.
export const resumeUrl = "/resume.pdf";

export const contactSection = {
  eyebrow: "Contact",
  marqueeText: "Let's build something",
  headline: "Got an idea? Drop me a line.",
  copy: "Always up for a good problem to work on. Side projects, freelance, or just a chat about frontend craft — my inbox is open.",
};

// Built off `site` so editing email / social URLs in one place updates here.
export const contactLinks = [
  {
    kind: "email" as const,
    label: "Email",
    handle: site.email || "Add your email",
    href: site.email ? `mailto:${site.email}` : "",
    external: false,
  },
  {
    kind: "github" as const,
    label: "GitHub",
    handle: "@kmkbf15",
    href: site.social.github,
    external: true,
  },
  {
    kind: "linkedin" as const,
    label: "LinkedIn",
    handle: "Coming soon",
    href: site.social.linkedin,
    external: true,
  },
];

export const projectsSection = {
  eyebrow: "Selected Work",
  heading: "Things I've shipped.",
  intro:
    "Three case studies pulled from real day-job work. Client names withheld — focus is on the craft.",
};

// Each project has its own accent color so the gradient previews feel distinct.
export const projects = [
  {
    slug: "analytics-dashboard",
    number: "01",
    title: "Analytics Dashboard",
    kind: "Internal admin tool",
    blurb:
      "A data-dense dashboard for an internal team — filterable tables, charts, role-based views. Built for speed on slow networks.",
    role: "Frontend lead",
    year: "2025",
    tech: ["React", "TypeScript", "Tailwind", "Recharts"],
    accent: "#ff5b3c",
    domain: "dashboard.internal",
  },
  {
    slug: "marketing-landing",
    number: "02",
    title: "Marketing Landing Page",
    kind: "Client-facing site",
    blurb:
      "Pixel-perfect handoff from design — responsive, animated, optimized for Lighthouse. The kind of page that converts on a phone.",
    role: "Frontend developer",
    year: "2025",
    tech: ["Next.js", "Tailwind", "Framer Motion"],
    accent: "#7c5cff",
    domain: "launch.example.com",
  },
  {
    slug: "saas-feature",
    number: "03",
    title: "SaaS Feature Module",
    kind: "Product feature",
    blurb:
      "A multi-step flow inside a larger SaaS product — async state, optimistic updates, careful empty/error states. Shipped behind a flag.",
    role: "Frontend developer",
    year: "2024",
    tech: ["React", "Next.js", "TypeScript", "REST"],
    accent: "#2ecf8a",
    domain: "app.example.com",
  },
];
