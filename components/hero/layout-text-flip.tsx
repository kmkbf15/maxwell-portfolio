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

  // Fixed width keeps the rotating word from shifting the surrounding layout.
  // Sized to comfortably fit the longest expected word at each breakpoint.
  return (
    <span className="relative inline-flex w-20 justify-start text-xl font-bold tracking-tight text-accent sm:w-24 sm:text-2xl md:w-28 md:text-4xl">
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
  );
}
