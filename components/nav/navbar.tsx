"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { navLinks, site } from "@/lib/data";
import { ThemeSwitcher } from "./theme-switcher";

export function Navbar() {
  const [hovered, setHovered] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  // Close mobile menu when viewport grows past md breakpoint
  // so the menu doesn't get stuck open after a rotation/resize.
  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 768) setMobileOpen(false);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-border/60 bg-background/70 backdrop-blur-md">
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 sm:px-6">
        <a
          href="#top"
          className="font-display text-lg font-bold tracking-tight"
        >
          {site.shortName}
          <span className="text-accent">.</span>
        </a>

        <ul
          className="hidden items-center gap-8 md:flex"
          onMouseLeave={() => setHovered(null)}
        >
          {navLinks.map((link) => (
            <li key={link.href} className="relative">
              <a
                href={link.href}
                onMouseEnter={() => setHovered(link.href)}
                className="block py-1 text-sm text-muted transition-colors hover:text-foreground"
              >
                {link.label}
              </a>
              <AnimatePresence>
                {hovered === link.href && (
                  <motion.span
                    layoutId="nav-underline"
                    className="absolute inset-x-0 -bottom-0.5 h-0.5 rounded-full bg-accent"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{
                      layout: { type: "spring", stiffness: 400, damping: 32 },
                      opacity: { duration: 0.15 },
                    }}
                  />
                )}
              </AnimatePresence>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-1">
          <ThemeSwitcher />
          <button
            type="button"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
            className="-mr-2 inline-flex size-10 items-center justify-center rounded-full text-muted transition-colors hover:bg-foreground/5 hover:text-foreground md:hidden"
          >
            {mobileOpen ? (
              <X className="size-5" />
            ) : (
              <Menu className="size-5" />
            )}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden border-t border-border/60 bg-background/95 backdrop-blur-md md:hidden"
          >
            <ul className="mx-auto flex max-w-6xl flex-col gap-1 px-5 py-3 sm:px-6">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className="block rounded-md px-3 py-3 text-base text-foreground/80 transition-colors hover:bg-foreground/5 hover:text-foreground"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
