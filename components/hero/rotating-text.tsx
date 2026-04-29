"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

export function RotatingText({ words }: { words: string[] }) {
  const [index, setIndex] = useState(0);
  // Longest word reserves the box width so the rotating word doesn't shift
  // surrounding text. Both placeholder and animated word share a single
  // inline-grid cell, which keeps them on the same baseline as the sentence.
  const longest = words.reduce((a, b) => (a.length >= b.length ? a : b));

  useEffect(() => {
    const id = setInterval(
      () => setIndex((v) => (v + 1) % words.length),
      2200,
    );
    return () => clearInterval(id);
  }, [words.length]);

  return (
    <span className="relative inline-grid overflow-hidden align-baseline">
      <span
        aria-hidden
        className="invisible col-start-1 row-start-1 font-bold"
      >
        {longest}
      </span>

      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={words[index]}
          initial={{ y: "100%", opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: "-100%", opacity: 0 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          className="col-start-1 row-start-1 font-bold text-accent"
        >
          {words[index]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}
