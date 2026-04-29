"use client";

import { motion } from "framer-motion";
import {
  Atom,
  Braces,
  Code2,
  FileCode2,
  Paintbrush,
  Triangle,
  Wind,
  type LucideIcon,
} from "lucide-react";

// Icon per skill — kept in the component so lib/data.ts stays plain content.
const iconFor: Record<string, LucideIcon> = {
  React: Atom,
  "Next.js": Triangle,
  TypeScript: Braces,
  JavaScript: Code2,
  HTML: FileCode2,
  CSS: Paintbrush,
  Tailwind: Wind,
};

export function SkillCard({
  name,
  level,
  index,
}: {
  name: string;
  level: number;
  index: number;
}) {
  const Icon = iconFor[name] ?? Code2;

  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      whileInView={{ y: 0, opacity: 1 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, delay: index * 0.06 }}
      whileHover={{ y: -4 }}
      className="group relative flex flex-col gap-6 rounded-2xl border border-border bg-background/40 p-5 backdrop-blur-sm transition-colors hover:border-accent/60"
    >
      {/* accent glow on hover */}
      <div className="pointer-events-none absolute inset-0 -z-10 rounded-2xl bg-accent opacity-0 blur-2xl transition-opacity duration-300 group-hover:opacity-25" />

      <Icon className="size-6 text-accent" strokeWidth={1.5} />

      <div className="flex items-end justify-between gap-2">
        <span className="font-display text-lg font-semibold leading-none">
          {name}
        </span>
        <div
          className="flex gap-1"
          role="meter"
          aria-label={`${name} comfort level`}
          aria-valuenow={level}
          aria-valuemin={0}
          aria-valuemax={5}
        >
          {Array.from({ length: 5 }).map((_, i) => (
            <span
              key={i}
              className={`size-1.5 rounded-full ${
                i < level ? "bg-accent" : "bg-foreground/20"
              }`}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
}
