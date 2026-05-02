"use client";

import * as React from "react";

export const PALETTES = [
  { id: "default", label: "Sunset", light: "#ff4d2e", dark: "#ff5b3c" },
  { id: "ocean", label: "Ocean", light: "#0ea5e9", dark: "#38bdf8" },
  { id: "forest", label: "Forest", light: "#16a34a", dark: "#22c55e" },
  { id: "royal", label: "Royal", light: "#8b5cf6", dark: "#a78bfa" },
  { id: "rose", label: "Rose", light: "#e11d48", dark: "#f43f5e" },
] as const;

export type PaletteId = (typeof PALETTES)[number]["id"] | "custom";

type PaletteContextValue = {
  palette: PaletteId;
  setPalette: (id: PaletteId) => void;
  customAccent: string;
  setCustomAccent: (hex: string) => void;
};

const PaletteContext = React.createContext<PaletteContextValue | null>(null);

const STORAGE_PALETTE = "portfolio-palette";
const STORAGE_CUSTOM = "portfolio-custom-accent";

export function PaletteProvider({ children }: { children: React.ReactNode }) {
  // Read synchronously so the apply-effect below runs once with the correct
  // value — avoids a default → saved palette flash on mount. The pre-paint
  // script in app/layout.tsx already mirrors this onto the DOM.
  const [palette, setPaletteState] = React.useState<PaletteId>(() => {
    if (typeof window === "undefined") return "default";
    return (localStorage.getItem(STORAGE_PALETTE) as PaletteId | null) ?? "default";
  });
  const [customAccent, setCustomAccentState] = React.useState<string>(() => {
    if (typeof window === "undefined") return "#ff4d2e";
    return localStorage.getItem(STORAGE_CUSTOM) ?? "#ff4d2e";
  });

  React.useEffect(() => {
    const html = document.documentElement;
    if (palette === "custom") {
      html.removeAttribute("data-palette");
      html.style.setProperty("--accent", customAccent);
      html.style.setProperty("--accent-foreground", readableForeground(customAccent));
    } else if (palette === "default") {
      html.removeAttribute("data-palette");
      html.style.removeProperty("--accent");
      html.style.removeProperty("--accent-foreground");
    } else {
      html.setAttribute("data-palette", palette);
      html.style.removeProperty("--accent");
      html.style.removeProperty("--accent-foreground");
    }
  }, [palette, customAccent]);

  const setPalette = React.useCallback((id: PaletteId) => {
    setPaletteState(id);
    localStorage.setItem(STORAGE_PALETTE, id);
  }, []);

  const setCustomAccent = React.useCallback((hex: string) => {
    setCustomAccentState(hex);
    localStorage.setItem(STORAGE_CUSTOM, hex);
  }, []);

  return (
    <PaletteContext.Provider value={{ palette, setPalette, customAccent, setCustomAccent }}>
      {children}
    </PaletteContext.Provider>
  );
}

export function usePalette() {
  const ctx = React.useContext(PaletteContext);
  if (!ctx) throw new Error("usePalette must be used within <PaletteProvider>");
  return ctx;
}

// Pick a foreground color (white or near-black) that reads on top of the
// given accent. Uses a simple sRGB luminance approximation.
function readableForeground(hex: string): string {
  const h = hex.replace("#", "");
  if (h.length !== 6) return "#ffffff";
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  const lum = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
  return lum > 0.6 ? "#0a0a0a" : "#ffffff";
}
