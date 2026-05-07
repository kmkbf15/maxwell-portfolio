"use client";

import { useReducedMotion, useScroll, useVelocity, useSpring, useMotionValue } from "framer-motion";

// Returns a gel-spring-smoothed MotionValue<number> of scroll velocity (px/sec).
// Under reduced motion, returns a constant zero MotionValue so consumers don't
// need to branch — hooks stay unconditional on the calling side.
export function useScrollVelocity() {
  const prefersReducedMotion = useReducedMotion();
  const { scrollY } = useScroll();
  const rawVelocity = useVelocity(scrollY);

  // Gel-spring feel: quick to respond, settles without jitter.
  const smoothVelocity = useSpring(rawVelocity, {
    damping: 50,
    stiffness: 400,
    mass: 0.5,
  });

  // Constant zero for reduced-motion — safe to always call, never conditional.
  const zero = useMotionValue(0);

  return prefersReducedMotion ? zero : smoothVelocity;
}
