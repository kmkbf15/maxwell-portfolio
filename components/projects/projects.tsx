"use client";

import { motion } from "framer-motion";
import { projects, projectsSection } from "@/lib/data";
import { ProjectCard } from "./project-card";

const reveal = {
  initial: { y: 24, opacity: 0 },
  whileInView: { y: 0, opacity: 1 },
  viewport: { once: true, margin: "-80px" },
};

export function Projects() {
  return (
    <section id="projects" className="relative border-t border-border">
      {/* Section header */}
      <div className="px-6 pb-12 pt-24 sm:pb-16 sm:pt-32">
        <div className="mx-auto max-w-5xl">
          <motion.p
            {...reveal}
            transition={{ duration: 0.5 }}
            className="font-mono text-xs uppercase tracking-[0.3em] text-muted"
          >
            {projectsSection.eyebrow}
          </motion.p>

          <motion.h2
            {...reveal}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mt-4 font-display text-3xl font-bold tracking-tight sm:text-5xl"
          >
            {projectsSection.heading}
          </motion.h2>

          <motion.p
            {...reveal}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-4 max-w-xl text-muted"
          >
            {projectsSection.intro}
          </motion.p>
        </div>
      </div>

      {/* Sticky stack — each card pins, scales, hands off to the next */}
      <div>
        {projects.map((project, i) => (
          <ProjectCard
            key={project.slug}
            project={project}
            index={i}
            total={projects.length}
          />
        ))}
      </div>

      {/* spacer so the last card has room to scroll past before the next section */}
      <div className="h-[20vh]" />
    </section>
  );
}
