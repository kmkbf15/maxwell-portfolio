"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";

type Side = "top" | "bottom";
type Align = "start" | "center" | "end";

type PopoverContextValue = {
  open: boolean;
  setOpen: (v: boolean) => void;
  triggerRef: React.RefObject<HTMLButtonElement | null>;
};

const PopoverContext = React.createContext<PopoverContextValue | null>(null);

function usePopoverCtx() {
  const ctx = React.useContext(PopoverContext);
  if (!ctx) throw new Error("Popover components must be used inside <Popover>");
  return ctx;
}

export function Popover({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = React.useState(false);
  const triggerRef = React.useRef<HTMLButtonElement | null>(null);

  React.useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <PopoverContext.Provider value={{ open, setOpen, triggerRef }}>
      {children}
    </PopoverContext.Provider>
  );
}

type PopoverTriggerProps = React.ButtonHTMLAttributes<HTMLButtonElement>;

export function PopoverTrigger({ onClick, ...props }: PopoverTriggerProps) {
  const { open, setOpen, triggerRef } = usePopoverCtx();
  return (
    <button
      ref={triggerRef}
      type="button"
      aria-expanded={open}
      aria-haspopup="dialog"
      onClick={(e) => {
        setOpen(!open);
        onClick?.(e);
      }}
      {...props}
    />
  );
}

type PopoverContentProps = {
  side?: Side;
  align?: Align;
  sideOffset?: number;
  className?: string;
  children?: React.ReactNode;
};

type Coords = { top: number; left: number; origin: string; translateX: string; translateY: string };

export function PopoverContent({
  className,
  side = "bottom",
  align = "end",
  sideOffset = 8,
  children,
}: PopoverContentProps) {
  const { open, setOpen, triggerRef } = usePopoverCtx();
  const contentRef = React.useRef<HTMLDivElement | null>(null);
  const [coords, setCoords] = React.useState<Coords | null>(null);
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => setMounted(true), []);

  // Compute fixed-position coords + transform-origin from the trigger's rect.
  // The wrapper handles positioning + alignment translate; the inner motion
  // div animates only scale/opacity so framer's transform doesn't fight ours.
  const compute = React.useCallback(() => {
    if (!triggerRef.current) return;
    const rect = triggerRef.current.getBoundingClientRect();

    const top = side === "bottom" ? rect.bottom + sideOffset : rect.top - sideOffset;
    const originY = side === "bottom" ? "top" : "bottom";
    const translateY = side === "bottom" ? "0%" : "-100%";

    let left: number;
    let originX: string;
    let translateX: string;
    if (align === "end") {
      left = rect.right;
      originX = "right";
      translateX = "-100%";
    } else if (align === "center") {
      left = rect.left + rect.width / 2;
      originX = "center";
      translateX = "-50%";
    } else {
      left = rect.left;
      originX = "left";
      translateX = "0%";
    }

    setCoords({ top, left, origin: `${originY} ${originX}`, translateX, translateY });
  }, [side, align, sideOffset, triggerRef]);

  React.useLayoutEffect(() => {
    if (open) compute();
  }, [open, compute]);

  React.useEffect(() => {
    if (!open) return;
    const onScroll = () => compute();
    window.addEventListener("scroll", onScroll, true);
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll, true);
      window.removeEventListener("resize", onScroll);
    };
  }, [open, compute]);

  React.useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      const target = e.target as Node;
      if (contentRef.current?.contains(target)) return;
      if (triggerRef.current?.contains(target)) return;
      setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [open, setOpen, triggerRef]);

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {open && coords && (
        <div
          style={{
            position: "fixed",
            top: coords.top,
            left: coords.left,
            transform: `translate(${coords.translateX}, ${coords.translateY})`,
            zIndex: 60,
          }}
        >
          <motion.div
            ref={contentRef}
            role="dialog"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
            style={{ transformOrigin: coords.origin }}
            className={cn(
              "w-72 rounded-md border border-border bg-background p-4 text-foreground shadow-lg outline-none",
              className,
            )}
          >
            {children}
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
