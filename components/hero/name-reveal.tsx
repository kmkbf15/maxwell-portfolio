"use client";

import { motion } from "framer-motion";

const ease = [0.22, 1, 0.36, 1] as const;

export function NameReveal({ name }: { name: string }) {
  const words = name.split(" ");

  return (
    <h1 className="font-display text-5xl font-bold leading-[0.95] tracking-tight sm:text-7xl md:text-8xl">
      {words.map((word, i) => (
        <span key={i} className="inline-block overflow-hidden align-bottom">
          <motion.span
            initial={{ y: "110%" }}
            animate={{ y: 0 }}
            transition={{ duration: 0.45, delay: i * 0.06, ease }}
            className="inline-block"
          >
            {word}
            {i < words.length - 1 ? "\u00A0" : ""}
          </motion.span>
        </span>
      ))}
    </h1>
  );
}
