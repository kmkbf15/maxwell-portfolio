"use client";

import { MotionValue, motion, useTransform } from "framer-motion";
import { about } from "@/lib/data";

interface Props {
  scrollYProgress: MotionValue<number>;
}

// Beat 3 — clean 2-column key/value list. No fly-in. No flash. Just appears.
// Fades in 0.78 → 0.84.
export function ActSnapshot({ scrollYProgress }: Props) {
  const opacity = useTransform(scrollYProgress, [0.78, 0.84], [0, 1]);

  return (
    <motion.div
      className="pointer-events-none absolute inset-0 flex items-center justify-center"
      style={{ opacity }}
      aria-hidden
    >
      <div className="grid max-w-xl grid-cols-[auto_1fr] gap-x-12 gap-y-5 sm:gap-x-20 sm:gap-y-7">
        {about.snapshot.map((item) => (
          <div key={item.label} className="contents">
            <p className="font-mono text-xs uppercase tracking-[0.3em] text-muted self-baseline">
              {item.label}
            </p>
            <p className="font-sans text-base text-foreground sm:text-lg self-baseline">
              {item.value}
            </p>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
