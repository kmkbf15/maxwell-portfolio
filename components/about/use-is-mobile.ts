"use client";

import { useEffect, useState } from "react";

// Returns true when the viewport is narrower than the md breakpoint (768px).
// Defaults to false during SSR so the server always renders the desktop shell.
export function useIsMobile(): boolean {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener("change", handler);
    // Sync initial value after mount — same pattern as other mounted-state hooks
    // in this codebase (theme-switcher, popover). Suppressed per project convention.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsMobile(mq.matches);
    return () => mq.removeEventListener("change", handler);
  }, []);

  return isMobile;
}
