"use client";

import { motion } from "framer-motion";
import { skills, skillsSection } from "@/lib/data";
import { SkillCard } from "./skill-card";

const reveal = {
  initial: { y: 24, opacity: 0 },
  whileInView: { y: 0, opacity: 1 },
  viewport: { once: true, margin: "-80px" },
};

export function Skills() {
  return (
    <section
      id="skills"
      className="border-t border-border px-6 py-24 sm:py-32"
    >
      <div className="mx-auto max-w-5xl">
        <motion.p
          {...reveal}
          transition={{ duration: 0.5 }}
          className="font-mono text-xs uppercase tracking-[0.3em] text-muted"
        >
          {skillsSection.eyebrow}
        </motion.p>

        <motion.h2
          {...reveal}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mt-4 font-display text-3xl font-bold tracking-tight sm:text-5xl"
        >
          {skillsSection.heading}
        </motion.h2>

        <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {skills.map((skill, i) => (
            <SkillCard key={skill.name} {...skill} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
