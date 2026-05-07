"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion, useMotionValue } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { about } from "@/lib/data";
import { ActTitle } from "@/components/about/act-title";
import { ActChapters } from "@/components/about/act-chapters";
import { ActSnapshot } from "@/components/about/act-snapshot";
import { Smear } from "@/components/about/smear";
import { AboutStatic } from "@/components/about/about-static";
import { useIsMobile } from "@/components/about/use-is-mobile";

export function About() {
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);

  const prefersReducedMotion = useReducedMotion();
  const isMobile = useIsMobile();

  // Scroll progress driven from ScrollTrigger's onUpdate — guarantees
  // progress == pin progress (no useScroll / section-height math mismatch).
  const progressMV = useMotionValue(0);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const section = sectionRef.current;
    const stage = stageRef.current;
    if (!section || !stage) return;

    // Canonical pin pattern: section grows to fit GSAP's spacer, stage gets
    // pinned for `end:"+=N%"` of viewport-height of pin travel. onUpdate writes
    // the pin's own 0→1 progress into the MotionValue children read.
    const pinEnd = isMobile ? "+=150%" : "+=200%";

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: section,
        start: "top top",
        end: pinEnd,
        pin: stage,
        onUpdate: (self) => progressMV.set(self.progress),
      });
    }, section);

    return () => ctx.revert();
  }, [isMobile, progressMV]);

  if (prefersReducedMotion) return <AboutStatic />;

  // Cue label split so the leading "01" gets the accent color.
  const [cueIndex, ...cueRest] = about.cue.split(" ");
  const cueTail = cueRest.join(" ");

  return (
    <section
      ref={sectionRef}
      id="about"
      className="relative border-t border-border"
    >
      <div ref={stageRef} className="relative h-screen w-full overflow-hidden">
        {/* Smear wraps all text layers. One GPU transform, not per-element. */}
        <Smear isMobile={isMobile}>
          <ActTitle scrollYProgress={progressMV} />
          <ActChapters scrollYProgress={progressMV} />
          <ActSnapshot scrollYProgress={progressMV} />
        </Smear>

        {/* Cue label — outside Smear so it never skews */}
        <p className="absolute left-6 top-20 font-mono text-xs uppercase tracking-[0.3em] text-muted sm:left-10 sm:top-24">
          <span className="text-accent">{cueIndex}</span> {cueTail}
        </p>
      </div>
    </section>
  );
}
