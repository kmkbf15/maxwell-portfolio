"use client";

import { MotionValue, motion, useTransform } from "framer-motion";
import { about } from "@/lib/data";

interface Props {
  scrollYProgress: MotionValue<number>;
}

// Beat 1 — giant MAXWELL word, centered, perfectly still.
// Opacity only: fades in 0.00→0.05, holds 0.05→0.25, fades out 0.25→0.30.
// No translate. No slide. Just the word.
export function ActTitle({ scrollYProgress }: Props) {
  const opacity = useTransform(
    scrollYProgress,
    [0, 0.05, 0.25, 0.30],
    [0, 1, 1, 0]
  );

  return (
    <motion.div
      className="pointer-events-none absolute inset-0 flex items-center justify-center"
      style={{ opacity }}
      aria-hidden
    >
      <span
        className="whitespace-nowrap font-display font-bold text-foreground"
        style={{
          fontSize: "clamp(7rem, 18vw, 18rem)",
          letterSpacing: "-0.04em",
          lineHeight: 1,
        }}
      >
        {about.displayWord}
      </span>
    </motion.div>
  );
}
