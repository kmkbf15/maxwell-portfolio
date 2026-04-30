"use client";

import { motion } from "framer-motion";

// Stylized browser preview: chrome bar + abstract gradient panel.
// Static / cheap by design — this section sits inside a sticky-stack that
// runs 3 cards at once on screen, so every backdrop-blur or animated blur
// layer here multiplies the per-frame paint cost. Keep it flat.
export function BrowserMockup({
  accent,
  domain,
}: {
  accent: string;
  domain: string;
}) {
  return (
    <div className="overflow-hidden rounded-xl border border-border bg-background/80 shadow-xl">
      {/* chrome bar */}
      <div className="flex items-center gap-2 border-b border-border bg-foreground/[0.03] px-4 py-3">
        <div className="flex gap-1.5">
          <span className="size-2.5 rounded-full bg-foreground/15" />
          <span className="size-2.5 rounded-full bg-foreground/15" />
          <span className="size-2.5 rounded-full bg-foreground/15" />
        </div>
        <div className="ml-3 flex-1 truncate rounded-md bg-foreground/[0.04] px-3 py-1 font-mono text-[11px] text-muted">
          {domain}
        </div>
      </div>

      {/* canvas area */}
      <div className="relative h-[360px] overflow-hidden sm:h-[440px]">
        {/* Static layered radial gradients — gives the "ambient color"
            feel without any backdrop-blur or animated blurred blobs. */}
        <div
          className="absolute inset-0"
          style={{
            background: `radial-gradient(120% 90% at 20% 10%, ${accent}55 0%, transparent 55%), radial-gradient(120% 90% at 90% 90%, ${accent}33 0%, transparent 55%), linear-gradient(180deg, transparent, ${accent}11)`,
          }}
        />

        {/* abstract UI shapes — solid bgs (no backdrop-blur) */}
        <div className="relative grid h-full grid-cols-12 gap-3 p-6">
          {/* sidebar column */}
          <div className="col-span-3 hidden flex-col gap-2 sm:flex">
            <div className="h-3 w-3/4 rounded-full bg-foreground/15" />
            <div className="h-3 w-1/2 rounded-full bg-foreground/10" />
            <div className="mt-4 h-2 w-2/3 rounded-full bg-foreground/10" />
            <div className="h-2 w-3/5 rounded-full bg-foreground/10" />
            <div className="h-2 w-1/2 rounded-full bg-foreground/10" />
          </div>

          {/* main canvas */}
          <div className="col-span-12 flex flex-col gap-3 sm:col-span-9">
            <div className="flex gap-3">
              <div
                className="h-20 flex-1 rounded-lg border border-border/60"
                style={{ backgroundColor: `${accent}33` }}
              />
              <div className="h-20 flex-1 rounded-lg border border-border/60 bg-foreground/[0.04]" />
              <div className="h-20 flex-1 rounded-lg border border-border/60 bg-foreground/[0.04]" />
            </div>

            {/* fake bar chart */}
            <div className="relative flex flex-1 items-end gap-2 rounded-lg border border-border/60 bg-foreground/[0.03] p-4">
              {[0.4, 0.7, 0.55, 0.85, 0.5, 0.95, 0.65].map((h, i) => (
                <motion.div
                  key={i}
                  className="flex-1 rounded-t"
                  style={{ backgroundColor: accent, originY: 1 }}
                  initial={{ scaleY: 0 }}
                  whileInView={{ scaleY: h }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{
                    duration: 0.7,
                    delay: i * 0.08,
                    ease: "easeOut",
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
