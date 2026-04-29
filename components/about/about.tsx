"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { about } from "@/lib/data";

const reveal = {
  initial: { y: 24, opacity: 0 },
  whileInView: { y: 0, opacity: 1 },
  viewport: { once: true, margin: "-80px" },
};

export function About() {
  const ref = useRef<HTMLElement>(null);

  // Parallax: bio column and snapshot column drift at slightly different
  // speeds as the section passes through the viewport. Adds depth.
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const bioY = useTransform(scrollYProgress, [0, 1], ["0%", "-12%"]);
  const snapshotY = useTransform(scrollYProgress, [0, 1], ["0%", "-28%"]);

  return (
    <section
      ref={ref}
      id="about"
      className="border-t border-border px-6 py-24 sm:py-32"
    >
      <div className="mx-auto max-w-5xl">
        <motion.p
          {...reveal}
          transition={{ duration: 0.5 }}
          className="font-mono text-xs uppercase tracking-[0.3em] text-muted"
        >
          {about.eyebrow}
        </motion.p>

        <motion.h2
          {...reveal}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mt-4 max-w-3xl font-display text-3xl font-bold tracking-tight sm:text-5xl"
        >
          {about.heading}
        </motion.h2>

        <div className="mt-12 grid gap-12 md:grid-cols-[1.5fr_1fr]">
          <motion.div style={{ y: bioY }} className="space-y-5">
            {about.bio.map((paragraph, i) => (
              <motion.p
                key={i}
                {...reveal}
                transition={{ duration: 0.6, delay: 0.2 + i * 0.08 }}
                className="text-lg text-foreground/90 sm:text-xl"
              >
                {paragraph}
              </motion.p>
            ))}
          </motion.div>

          <motion.dl
            style={{ y: snapshotY }}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, delay: 0.35 }}
            className="space-y-5"
          >
            {about.snapshot.map((item) => (
              <div key={item.label} className="border-l border-border pl-4">
                <dt className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted">
                  {item.label}
                </dt>
                <dd className="mt-1 text-base text-foreground">{item.value}</dd>
              </div>
            ))}
          </motion.dl>
        </div>
      </div>
    </section>
  );
}
