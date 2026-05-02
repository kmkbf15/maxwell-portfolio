"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { type RefObject } from "react";

// The infinite loop runs as a pure CSS keyframe (GPU-composited, smooth
// even on low-end devices). Framer Motion only handles the scroll-driven
// extra x-offset on the outer wrapper — that's the parallax.
export function ParallaxMarquee({
  text,
  direction = 1,
  speed = 30,
  accent = false,
  sectionRef,
}: {
  text: string;
  direction?: 1 | -1;
  speed?: number;
  accent?: boolean;
  sectionRef: RefObject<HTMLElement | null>;
}) {
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const extraX = useTransform(
    scrollYProgress,
    [0, 1],
    direction === 1 ? ["0%", "-25%"] : ["0%", "25%"],
  );

  // Two identical sets side-by-side. The CSS animation shifts the track
  // by exactly -50% (one full set), so the loop is seamless.
  const set = (
    <div className="flex shrink-0 items-center">
      {Array.from({ length: 4 }).map((_, i) => (
        <span key={i} className="inline-flex items-center">
          <span
            className={`px-6 font-display text-4xl font-bold uppercase tracking-tight sm:px-8 sm:text-6xl md:text-8xl ${
              accent ? "text-accent" : "text-foreground"
            }`}
          >
            {text}
          </span>
          <span
            className={`text-3xl sm:text-5xl ${
              accent ? "text-foreground/40" : "text-accent"
            }`}
          >
            ●
          </span>
        </span>
      ))}
    </div>
  );

  return (
    <div className="overflow-hidden">
      <motion.div style={{ x: extraX }}>
        <div
          className={`marquee-track inline-flex whitespace-nowrap ${
            direction === -1 ? "marquee-reverse" : ""
          }`}
          style={{ animationDuration: `${speed}s` }}
        >
          {set}
          {set}
        </div>
      </motion.div>
    </div>
  );
}
