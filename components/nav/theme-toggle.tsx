"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // next-themes resolves the theme on the client, so we wait until mount
  // to render the icon and avoid a hydration mismatch.
  useEffect(() => setMounted(true), []);

  // Until mounted, resolvedTheme is undefined on the client and would differ
  // from the server render — so we only flip aria-label/onClick after mount.
  const isDark = mounted && resolvedTheme === "dark";

  return (
    <button
      type="button"
      aria-label={mounted ? `Switch to ${isDark ? "light" : "dark"} mode` : "Toggle theme"}
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="grid size-9 place-items-center rounded-full border border-border text-foreground transition-colors hover:bg-foreground/5"
    >
      {mounted &&
        (isDark ? <Sun className="size-4" /> : <Moon className="size-4" />)}
    </button>
  );
}
