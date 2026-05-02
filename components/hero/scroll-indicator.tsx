"use client";

import { motion } from "framer-motion";

export function ScrollIndicator() {
  return (
    <div className="flex flex-col items-center gap-2 text-foreground/60">
      <div className="flex h-9 w-5 items-start justify-center rounded-full border-2 border-current p-1">
        <motion.span
          className="block h-1.5 w-1.5 rounded-full bg-current"
          animate={{ y: [0, 12, 0], opacity: [0.2, 1, 0.2] }}
          transition={{ duration: 1.8, ease: "easeInOut", repeat: Infinity }}
        />
      </div>
      <span className="font-mono text-[10px] uppercase tracking-[0.3em]">
        Scroll
      </span>
    </div>
  );
}
