"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowUpRight, Mail } from "lucide-react";
import { useRef, type ComponentType, type SVGProps } from "react";
import { contactLinks, contactSection, site } from "@/lib/data";
import { Magnetic } from "@/components/ui/magnetic";
import { ParallaxMarquee } from "./parallax-marquee";

// Lucide v1 dropped brand glyphs, so GitHub/LinkedIn are inline SVGs.
function GithubIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden
      {...props}
    >
      <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.1.79-.25.79-.55 0-.27-.01-1.18-.02-2.14-3.2.7-3.87-1.36-3.87-1.36-.52-1.34-1.28-1.69-1.28-1.69-1.05-.72.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.73-1.55-2.55-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.29 1.18-3.1-.12-.29-.51-1.46.11-3.05 0 0 .97-.31 3.18 1.18a11 11 0 0 1 5.79 0c2.21-1.49 3.18-1.18 3.18-1.18.62 1.59.23 2.76.11 3.05.74.81 1.18 1.84 1.18 3.1 0 4.42-2.69 5.39-5.26 5.68.41.36.78 1.06.78 2.13 0 1.54-.01 2.78-.01 3.16 0 .3.21.66.8.55C20.21 21.39 23.5 17.08 23.5 12 23.5 5.65 18.35.5 12 .5Z" />
    </svg>
  );
}

function LinkedinIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden
      {...props}
    >
      <path d="M20.45 20.45h-3.55v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.13 1.45-2.13 2.94v5.67H9.36V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28ZM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12Zm1.78 13.02H3.56V9h3.56v11.45ZM22.22 0H1.77C.79 0 0 .77 0 1.72v20.56C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.72V1.72C24 .77 23.2 0 22.22 0Z" />
    </svg>
  );
}

const iconFor: Record<string, ComponentType<SVGProps<SVGSVGElement>>> = {
  email: Mail,
  github: GithubIcon,
  linkedin: LinkedinIcon,
};

const reveal = {
  initial: { y: 24, opacity: 0 },
  whileInView: { y: 0, opacity: 1 },
  viewport: { once: true, margin: "-80px" },
};

export function Contact() {
  const ref = useRef<HTMLElement>(null);

  // Headline drifts up slightly as the section passes through.
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const headlineY = useTransform(scrollYProgress, [0, 1], ["20%", "-15%"]);

  return (
    <section
      ref={ref}
      id="contact"
      className="relative overflow-hidden border-t border-border"
    >
      {/* Two opposing parallax marquee rows */}
      <div className="relative space-y-1 py-12 sm:py-16">
        <ParallaxMarquee
          text={contactSection.marqueeText}
          direction={1}
          speed={28}
          sectionRef={ref}
        />
        <ParallaxMarquee
          text={contactSection.marqueeText}
          direction={-1}
          speed={36}
          accent
          sectionRef={ref}
        />
      </div>

      {/* Headline + copy + links */}
      <div className="px-6 pb-24 pt-8 sm:pb-32">
        <motion.div
          style={{ y: headlineY }}
          className="mx-auto max-w-3xl text-center"
        >
          <motion.p
            {...reveal}
            transition={{ duration: 0.5 }}
            className="font-mono text-xs uppercase tracking-[0.3em] text-muted"
          >
            {contactSection.eyebrow}
          </motion.p>

          <motion.h2
            {...reveal}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mt-4 font-display text-4xl font-bold tracking-tight sm:text-6xl"
          >
            {contactSection.headline}
          </motion.h2>

          <motion.p
            {...reveal}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mx-auto mt-5 max-w-xl text-base text-muted sm:text-lg"
          >
            {contactSection.copy}
          </motion.p>
        </motion.div>

        <motion.div
          {...reveal}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mx-auto mt-12 grid max-w-3xl gap-4 sm:grid-cols-3"
        >
          {contactLinks.map((link) => {
            const Icon = iconFor[link.kind];
            const disabled = !link.href;

            const inner = (
              <>
                <div className="flex items-center justify-between">
                  <Icon className="size-5" strokeWidth={1.5} />
                  {!disabled && (
                    <ArrowUpRight className="size-4 text-muted transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent" />
                  )}
                </div>
                <div className="mt-6">
                  <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted">
                    {link.label}
                  </p>
                  <p className="mt-1 truncate text-sm font-medium text-foreground">
                    {link.handle}
                  </p>
                </div>
              </>
            );

            if (disabled) {
              return (
                <div
                  key={link.kind}
                  aria-disabled
                  className="flex flex-col rounded-2xl border border-dashed border-border bg-background/30 p-5 opacity-60"
                >
                  {inner}
                </div>
              );
            }

            return (
              <Magnetic key={link.kind} strength={0.25} className="block">
                <a
                  href={link.href}
                  target={link.external ? "_blank" : undefined}
                  rel={link.external ? "noopener noreferrer" : undefined}
                  className="group flex h-full flex-col rounded-2xl border border-border bg-background/40 p-5 backdrop-blur-sm transition-colors hover:border-accent/60 hover:bg-foreground/[0.03]"
                >
                  {inner}
                </a>
              </Magnetic>
            );
          })}
        </motion.div>
      </div>

      {/* Footer */}
      <footer className="border-t border-border px-6 py-8">
        <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-3 text-xs text-muted sm:flex-row">
          <span>© 2026 {site.name}. All rights reserved.</span>
          <span className="font-mono">
            Built with Next.js · Tailwind · Framer Motion
          </span>
        </div>
      </footer>
    </section>
  );
}
