"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { BrowserMockup } from "./browser-mockup";

type Project = {
  number: string;
  title: string;
  kind: string;
  blurb: string;
  role: string;
  year: string;
  tech: string[];
  accent: string;
  domain: string;
};

export function ProjectCard({
  project,
  index,
  total,
}: {
  project: Project;
  index: number;
  total: number;
}) {
  const ref = useRef<HTMLDivElement>(null);

  // Track this card's scroll position relative to the viewport.
  // While the inner card is sticky-pinned, this progress drives a
  // shrink-and-fade so the next card visually "covers" it.
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  // Each card behind the topmost one shrinks slightly. The earlier the
  // card (higher in the stack), the more it shrinks by the end.
  const cardsAbove = total - 1 - index;
  const targetScale = 1 - cardsAbove * 0.05 - 0.02;

  const scale = useTransform(scrollYProgress, [0, 1], [1, targetScale]);
  const opacity = useTransform(scrollYProgress, [0.5, 1], [1, 0.7]);

  return (
    <div
      ref={ref}
      className="sticky top-0 flex h-screen items-center justify-center px-4 sm:px-8"
      // Each new card starts a touch lower than the last — gives the
      // visible "stack" peek even before the scale kicks in.
      style={{ paddingTop: `${index * 28}px` }}
    >
      <motion.article
        style={{ scale, opacity }}
        className="relative w-full max-w-6xl origin-top overflow-hidden rounded-3xl border border-border bg-background p-5 shadow-xl will-change-transform sm:p-8 md:p-10"
      >
        <div className="grid gap-5 sm:gap-8 md:grid-cols-[1fr_1.4fr] md:items-center">
          {/* left: meta + copy */}
          <div className="flex flex-col gap-4 sm:gap-5">
            <div className="flex items-baseline gap-3">
              <span
                className="font-mono text-sm tracking-widest"
                style={{ color: project.accent }}
              >
                {project.number}
              </span>
              <span className="font-mono text-xs uppercase tracking-[0.25em] text-muted">
                {project.kind}
              </span>
            </div>

            <h3 className="font-display text-2xl font-bold leading-tight tracking-tight sm:text-4xl md:text-5xl">
              {project.title}
            </h3>

            <p className="text-sm text-foreground/80 sm:text-base md:text-lg">
              {project.blurb}
            </p>

            <div className="flex flex-wrap gap-2 pt-2">
              {project.tech.map((t) => (
                <span
                  key={t}
                  className="rounded-full border border-border bg-foreground/[0.03] px-3 py-1 font-mono text-[11px] text-muted"
                >
                  {t}
                </span>
              ))}
            </div>

            <dl className="mt-2 flex gap-8 border-t border-border pt-4 text-sm">
              <div>
                <dt className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted">
                  Role
                </dt>
                <dd className="mt-1">{project.role}</dd>
              </div>
              <div>
                <dt className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted">
                  Year
                </dt>
                <dd className="mt-1">{project.year}</dd>
              </div>
            </dl>
          </div>

          {/* right: stylized preview */}
          <div className="relative">
            <BrowserMockup accent={project.accent} domain={project.domain} />
          </div>
        </div>
      </motion.article>
    </div>
  );
}
