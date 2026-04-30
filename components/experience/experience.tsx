"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { Download } from "lucide-react";
import { useRef } from "react";
import { experience, experienceSection, resumeUrl } from "@/lib/data";
import { Magnetic } from "@/components/ui/magnetic";

const reveal = {
  initial: { y: 24, opacity: 0 },
  whileInView: { y: 0, opacity: 1 },
  viewport: { once: true, margin: "-80px" },
};

export function Experience() {
  const lineRef = useRef<HTMLDivElement>(null);

  // Draw the accent line as the user scrolls through the timeline.
  // Range chosen so the line completes just before the last entry exits.
  const { scrollYProgress } = useScroll({
    target: lineRef,
    offset: ["start 75%", "end 60%"],
  });
  const lineScale = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <section
      id="experience"
      className="border-t border-border px-6 py-24 sm:py-32"
    >
      <div className="mx-auto max-w-5xl">
        <motion.p
          {...reveal}
          transition={{ duration: 0.5 }}
          className="font-mono text-xs uppercase tracking-[0.3em] text-muted"
        >
          {experienceSection.eyebrow}
        </motion.p>

        <motion.h2
          {...reveal}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mt-4 font-display text-3xl font-bold tracking-tight sm:text-5xl"
        >
          {experienceSection.heading}
        </motion.h2>

        <div ref={lineRef} className="relative mt-14">
          {/* base track — faded full-height line */}
          <div className="pointer-events-none absolute left-[9px] top-2 bottom-2 w-px bg-border" />
          {/* draw line — scales from 0→1 as you scroll */}
          <motion.div
            aria-hidden
            style={{ scaleY: lineScale, originY: 0 }}
            className="pointer-events-none absolute left-[9px] top-2 bottom-2 w-px bg-accent"
          />

          <ul className="space-y-14">
            {experience.map((item, i) => (
              <motion.li
                key={item.title}
                initial={{ x: 16, opacity: 0 }}
                whileInView={{ x: 0, opacity: 1 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                className="relative pl-10"
              >
                {/* dot */}
                <span
                  aria-hidden
                  className={`absolute left-[9px] top-2 size-3 -translate-x-1/2 rounded-full border-2 ${
                    item.current
                      ? "border-accent bg-accent"
                      : "border-border bg-background"
                  }`}
                />
                {/* pulsing halo for the current role */}
                {item.current && (
                  <motion.span
                    aria-hidden
                    className="absolute left-[9px] top-2 size-3 -translate-x-1/2 rounded-full bg-accent"
                    animate={{ scale: [1, 2.2], opacity: [0.5, 0] }}
                    transition={{
                      duration: 1.6,
                      repeat: Infinity,
                      ease: "easeOut",
                    }}
                  />
                )}

                <p className="font-mono text-xs uppercase tracking-[0.25em] text-muted">
                  {item.period}
                </p>
                <h3 className="mt-2 font-display text-xl font-semibold sm:text-2xl">
                  {item.title}
                </h3>
                <p className="mt-1 text-sm text-muted">{item.org}</p>
                <p className="mt-3 max-w-2xl text-base text-foreground/85">
                  {item.description}
                </p>
              </motion.li>
            ))}
          </ul>
        </div>

        <motion.div
          {...reveal}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-14"
        >
          <Magnetic className="inline-block">
            <a
              href={resumeUrl}
              download
              className="group inline-flex items-center gap-2 rounded-full border border-border bg-background/40 px-6 py-3 text-sm font-medium backdrop-blur-sm transition-colors hover:border-accent hover:bg-foreground/5"
            >
              <Download className="size-4 transition-transform group-hover:-translate-y-0.5" />
              Download Resume
            </a>
          </Magnetic>
        </motion.div>
      </div>
    </section>
  );
}
