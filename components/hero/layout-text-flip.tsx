"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

export function LayoutTextFlip({
  words,
  duration = 3000,
}: {
  words: string[];
  duration?: number;
}) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % words.length);
    }, duration);

    return () => clearInterval(interval);
  }, [duration, words.length]);

  // Stack every word in the same grid cell so the container auto-sizes to
  // the longest one at the current font size — no per-breakpoint width
  // tuning needed. The visible word sits on top; the rest are invisible
  // sizers.
  return (
    <span className="relative inline-grid text-xl font-bold tracking-tight text-accent sm:text-2xl md:text-4xl">
      {words.map((word) => (
        <span
          key={word}
          aria-hidden
          className="invisible col-start-1 row-start-1 whitespace-nowrap"
        >
          {word}
        </span>
      ))}
      <span className="col-start-1 row-start-1">
        <AnimatePresence mode="popLayout">
          <motion.span
            key={currentIndex}
            initial={{ y: -30, filter: "blur(15px)", opacity: 0 }}
            animate={{ y: 0, filter: "blur(0px)", opacity: 1 }}
            exit={{ y: 50, filter: "blur(15px)", opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-block whitespace-nowrap"
          >
            {words[currentIndex]}
          </motion.span>
        </AnimatePresence>
      </span>
    </span>
  );
}
