"use client";

import { motion, useMotionValue, useSpring } from "framer-motion";
import { useEffect, useState } from "react";

// Two-layer cursor: a small dot that tracks the pointer 1:1, and a larger
// ring that lags via spring. Ring scales up when hovering an interactive
// element. Disabled on touch devices and on small screens.
export function CustomCursor() {
  const [isTouch, setIsTouch] = useState(false);
  const [hovering, setHovering] = useState(false);

  // Off-screen until the first pointermove arrives.
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const ringX = useSpring(x, { stiffness: 200, damping: 22, mass: 0.5 });
  const ringY = useSpring(y, { stiffness: 200, damping: 22, mass: 0.5 });

  useEffect(() => {
    // First touch event flips the device into "touch" mode permanently —
    // no point showing a follow cursor on a phone.
    const onTouch = () => setIsTouch(true);
    window.addEventListener("touchstart", onTouch, { once: true });

    const onMove = (e: PointerEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      const target = e.target as Element | null;
      const interactive = target?.closest(
        "a, button, [data-cursor='link']",
      );
      setHovering(!!interactive);
    };

    window.addEventListener("pointermove", onMove);

    // Hide the native cursor while ours is active.
    document.documentElement.classList.add("custom-cursor-active");

    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("touchstart", onTouch);
      document.documentElement.classList.remove("custom-cursor-active");
    };
  }, [x, y]);

  if (isTouch) return null;

  return (
    <>
      {/* dot — 1:1 with the actual cursor */}
      <motion.div
        aria-hidden
        style={{ x, y }}
        className="pointer-events-none fixed left-0 top-0 z-[100] hidden size-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent md:block"
      />
      {/* ring — spring-lagged, scales up on hover */}
      <motion.div
        aria-hidden
        style={{ x: ringX, y: ringY }}
        animate={{ scale: hovering ? 1.6 : 1 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
        className="pointer-events-none fixed left-0 top-0 z-[100] hidden size-9 -translate-x-1/2 -translate-y-1/2 rounded-full border border-accent/60 md:block"
      />
    </>
  );
}
