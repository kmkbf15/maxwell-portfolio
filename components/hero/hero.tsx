"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight } from "lucide-react";
import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { hero, site } from "@/lib/data";
import { Magnetic } from "@/components/ui/magnetic";
import { NameReveal } from "./name-reveal";
import { RotatingText } from "./rotating-text";

// Lazy-load the R3F canvas so three.js + drei stay out of the initial JS
// bundle — keeps LCP fast on first paint. The hero text renders immediately;
// the blob fades in once the chunk is ready.
const HeroCanvas = dynamic(
  () => import("./hero-canvas").then((m) => m.HeroCanvas),
  { ssr: false, loading: () => null },
);

const fadeUp = {
  initial: { y: 16, opacity: 0 },
  animate: { y: 0, opacity: 1 },
};

export function Hero() {
  const ref = useRef<HTMLElement>(null);

  // Hold the canvas mount until after first paint so Lighthouse can record
  // LCP without competing with the WebGL boot. requestIdleCallback yields
  // until the browser is idle; setTimeout is the Safari fallback.
  const [canvasReady, setCanvasReady] = useState(false);
  useEffect(() => {
    type IdleWindow = Window & {
      requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number;
      cancelIdleCallback?: (id: number) => void;
    };
    const w = window as IdleWindow;
    const schedule = w.requestIdleCallback ?? ((cb: () => void) => window.setTimeout(cb, 600));
    const cancel = w.cancelIdleCallback ?? window.clearTimeout;
    const id = schedule(() => setCanvasReady(true), { timeout: 1500 });
    return () => cancel(id as number);
  }, []);

  // Pause the WebGL render loop when the hero leaves the viewport. Without
  // this, the canvas (incl. bloom postprocessing) keeps eating GPU at 60fps
  // while the user is reading other sections — that's what causes the
  // hitch right at section handoffs.
  const [inView, setInView] = useState(true);
  useEffect(() => {
    if (!ref.current) return;
    const obs = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0 },
    );
    obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  // Parallax: as the user scrolls past the hero, the 3D blob drifts
  // downward and fades. Foreground text drifts up slightly for depth.
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const blobY = useTransform(scrollYProgress, [0, 1], ["0%", "40%"]);
  const blobOpacity = useTransform(scrollYProgress, [0, 0.8], [0.9, 0]);
  const contentY = useTransform(scrollYProgress, [0, 1], ["0%", "-15%"]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0.2]);

  return (
    <section
      ref={ref}
      className="relative flex min-h-screen items-center justify-center overflow-hidden px-6 pt-16"
    >
      {/* 3D blob — sits behind the text, parallax-drifts on scroll */}
      <motion.div
        style={{ y: blobY, opacity: blobOpacity }}
        className="absolute inset-0 [mask-image:radial-gradient(ellipse_at_center,black_55%,transparent_95%)]"
      >
        {canvasReady && <HeroCanvas active={inView} />}
      </motion.div>

      <motion.div
        style={{ y: contentY, opacity: contentOpacity }}
        className="relative z-10 mx-auto max-w-5xl text-center"
      >
        <motion.p
          {...fadeUp}
          transition={{ duration: 0.4 }}
          className="font-mono text-xs uppercase tracking-[0.3em] text-muted"
        >
          {site.role}
        </motion.p>

        <div className="mt-8">
          <NameReveal name={site.name} />
        </div>

        <motion.p
          {...fadeUp}
          transition={{ duration: 0.5, delay: 0.25 }}
          className="mt-8 text-lg text-muted sm:text-xl"
        >
          {hero.taglineLead}{" "}
          <RotatingText words={hero.rotatingWords} />
        </motion.p>

        <motion.div
          {...fadeUp}
          transition={{ duration: 0.5, delay: 0.35 }}
          className="mt-12 flex flex-col items-center justify-center gap-3 sm:flex-row"
        >
          <Magnetic className="inline-block">
            <a
              href={hero.primaryCta.href}
              className="group inline-flex items-center gap-2 rounded-full bg-foreground px-6 py-3 text-sm font-medium text-background transition-transform hover:scale-[1.03]"
            >
              {hero.primaryCta.label}
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
            </a>
          </Magnetic>
          <Magnetic className="inline-block">
            <a
              href={hero.secondaryCta.href}
              className="inline-flex items-center gap-2 rounded-full border border-border bg-background/40 px-6 py-3 text-sm font-medium backdrop-blur-sm transition-colors hover:bg-foreground/5"
            >
              {hero.secondaryCta.label}
            </a>
          </Magnetic>
        </motion.div>
      </motion.div>
    </section>
  );
}
