"use client";

import { motion } from "framer-motion";

// A stylized "browser" preview: chrome bar + animated abstract gradient panel.
// Stand-in for real screenshots — swap freely later.
export function BrowserMockup({
  accent,
  domain,
}: {
  accent: string;
  domain: string;
}) {
  return (
    <div className="overflow-hidden rounded-xl border border-border bg-background/80 shadow-2xl">
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
        {/* base gradient */}
        <div
          className="absolute inset-0"
          style={{
            background: `radial-gradient(120% 90% at 20% 10%, ${accent}33 0%, transparent 60%), radial-gradient(120% 90% at 90% 90%, ${accent}22 0%, transparent 55%)`,
          }}
        />

        {/* drifting blob 1 */}
        <motion.div
          className="absolute -left-20 -top-20 size-72 rounded-full blur-3xl"
          style={{ backgroundColor: accent, opacity: 0.35 }}
          animate={{ x: [0, 40, 0], y: [0, 30, 0] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* drifting blob 2 */}
        <motion.div
          className="absolute -bottom-24 -right-10 size-80 rounded-full blur-3xl"
          style={{ backgroundColor: accent, opacity: 0.25 }}
          animate={{ x: [0, -30, 0], y: [0, -20, 0] }}
          transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* abstract UI shapes — fake "chart" feel */}
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
                className="h-20 flex-1 rounded-lg border border-border/60 backdrop-blur-sm"
                style={{ backgroundColor: `${accent}22` }}
              />
              <div className="h-20 flex-1 rounded-lg border border-border/60 bg-background/40 backdrop-blur-sm" />
              <div className="h-20 flex-1 rounded-lg border border-border/60 bg-background/40 backdrop-blur-sm" />
            </div>

            {/* fake bar chart */}
            <div className="relative flex flex-1 items-end gap-2 rounded-lg border border-border/60 bg-background/40 p-4 backdrop-blur-sm">
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

        {/* subtle grain overlay */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.04] mix-blend-overlay"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, white 1px, transparent 1px)",
            backgroundSize: "3px 3px",
          }}
        />
      </div>
    </div>
  );
}
