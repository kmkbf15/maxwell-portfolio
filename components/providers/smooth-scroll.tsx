"use client";

import Lenis from "lenis";
import { useEffect } from "react";

// Lenis hijacks the wheel/touch input and animates `window.scrollY` toward the
// target — which keeps framer-motion's `useScroll` working unchanged because
// it still reads from the real scroll position.
export function SmoothScroll() {
  useEffect(() => {
    // Respect users who've asked the OS to reduce motion.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const lenis = new Lenis({
      duration: 1.1,
      // easeOutExpo — quick start, gentle settle. Feels responsive, not floaty.
      easing: (t) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 1.4,
    });

    let rafId = 0;
    const raf = (time: number) => {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    };
    rafId = requestAnimationFrame(raf);

    // Make in-page anchor clicks (#about, #contact, etc.) honor smooth scroll.
    const onAnchorClick = (e: MouseEvent) => {
      const link = (e.target as Element | null)?.closest(
        "a[href^='#']",
      ) as HTMLAnchorElement | null;
      if (!link) return;
      const id = link.getAttribute("href");
      if (!id || id === "#") return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      lenis.scrollTo(target as HTMLElement, { offset: 0 });
    };
    document.addEventListener("click", onAnchorClick);

    return () => {
      cancelAnimationFrame(rafId);
      document.removeEventListener("click", onAnchorClick);
      lenis.destroy();
    };
  }, []);

  return null;
}
