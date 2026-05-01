"use client";

import { Check, Moon, Palette, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Magnetic } from "@/components/ui/magnetic";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  PALETTES,
  usePalette,
} from "@/components/providers/palette-provider";
import { cn } from "@/lib/utils";

export function ThemeSwitcher() {
  const { resolvedTheme, setTheme } = useTheme();
  const { palette, setPalette, customAccent, setCustomAccent } = usePalette();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);
  const isDark = mounted && resolvedTheme === "dark";

  return (
    <Popover>
      <Magnetic className="inline-block" strength={0.5}>
        <PopoverTrigger
          aria-label="Theme settings"
          className="grid size-9 place-items-center rounded-full border border-border text-foreground transition-colors hover:bg-foreground/5"
        >
          <Palette className="size-4" />
        </PopoverTrigger>
      </Magnetic>

      <PopoverContent align="end" sideOffset={10} className="w-72">
        <div className="space-y-5">
          <div>
            <p className="mb-2 text-xs font-medium uppercase tracking-wider text-muted">
              Mode
            </p>
            <div className="grid grid-cols-2 gap-2">
              <ModeButton
                active={mounted && !isDark}
                onClick={() => setTheme("light")}
                icon={<Sun className="size-4" />}
                label="Light"
              />
              <ModeButton
                active={isDark}
                onClick={() => setTheme("dark")}
                icon={<Moon className="size-4" />}
                label="Dark"
              />
            </div>
          </div>

          <div>
            <p className="mb-2 text-xs font-medium uppercase tracking-wider text-muted">
              Palette
            </p>
            <div className="flex flex-wrap gap-2">
              {PALETTES.map((p) => {
                const swatch = isDark ? p.dark : p.light;
                const active = palette === p.id;
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setPalette(p.id)}
                    aria-label={p.label}
                    title={p.label}
                    className={cn(
                      "relative grid size-8 place-items-center rounded-full transition-transform",
                      active
                        ? "ring-2 ring-foreground ring-offset-2 ring-offset-background"
                        : "hover:scale-110",
                    )}
                    style={{ backgroundColor: swatch }}
                  >
                    {active && (
                      <Check className="size-3.5 text-white mix-blend-difference" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <p className="mb-2 text-xs font-medium uppercase tracking-wider text-muted">
              Custom accent
            </p>
            <label className="flex items-center gap-3">
              <span
                className="size-8 shrink-0 rounded-full border border-border"
                style={{ backgroundColor: customAccent }}
              />
              <input
                type="color"
                value={customAccent}
                onChange={(e) => {
                  setCustomAccent(e.target.value);
                  setPalette("custom");
                }}
                className="h-8 w-full cursor-pointer rounded-md border border-border bg-transparent"
                aria-label="Pick custom accent color"
              />
            </label>
            {palette === "custom" && (
              <p className="mt-2 font-mono text-xs text-muted">
                Active: {customAccent.toUpperCase()}
              </p>
            )}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}

function ModeButton({
  active,
  onClick,
  icon,
  label,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex items-center justify-center gap-2 rounded-md border py-2 text-sm transition-colors",
        active
          ? "border-accent text-accent"
          : "border-border hover:bg-foreground/5",
      )}
    >
      {icon} {label}
    </button>
  );
}
