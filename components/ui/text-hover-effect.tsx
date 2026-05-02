"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

export function TextHoverEffect({
  text,
  duration,
  startDelay = 0,
}: {
  text: string;
  duration?: number;
  startDelay?: number;
}) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [cursor, setCursor] = useState({ x: 0, y: 0 });
  const [hovered, setHovered] = useState(false);
  const [maskPosition, setMaskPosition] = useState({ cx: "50%", cy: "50%" });

  // Track cursor at the window level so the reveal follows the mouse even
  // when it's hovering content that sits on top of the SVG.
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setCursor({ x: e.clientX, y: e.clientY });
      setHovered(true);
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  useEffect(() => {
    if (svgRef.current) {
      const svgRect = svgRef.current.getBoundingClientRect();
      const cxPercentage = ((cursor.x - svgRect.left) / svgRect.width) * 100;
      const cyPercentage = ((cursor.y - svgRect.top) / svgRect.height) * 100;
      setMaskPosition({
        cx: `${cxPercentage}%`,
        cy: `${cyPercentage}%`,
      });
    }
  }, [cursor]);

  return (
    <svg
      ref={svgRef}
      width="100%"
      height="100%"
      viewBox="0 0 300 100"
      preserveAspectRatio="xMidYMid meet"
      xmlns="http://www.w3.org/2000/svg"
      className="select-none"
    >
      <defs>
        <linearGradient
          id="textGradient"
          gradientUnits="userSpaceOnUse"
          cx="50%"
          cy="50%"
          r="25%"
        >
          {hovered && (
            <>
              <stop offset="0%" stopColor="#eab308" />
              <stop offset="25%" stopColor="#ef4444" />
              <stop offset="50%" stopColor="#3b82f6" />
              <stop offset="75%" stopColor="#06b6d4" />
              <stop offset="100%" stopColor="#8b5cf6" />
            </>
          )}
        </linearGradient>

        <motion.radialGradient
          id="revealMask"
          gradientUnits="userSpaceOnUse"
          r="20%"
          initial={{ cx: "50%", cy: "50%" }}
          animate={maskPosition}
          transition={{ duration: duration ?? 0, ease: "easeOut" }}
        >
          <stop offset="0%" stopColor="white" />
          <stop offset="100%" stopColor="black" />
        </motion.radialGradient>
        <mask id="textMask">
          <rect
            x="0"
            y="0"
            width="100%"
            height="100%"
            fill="url(#revealMask)"
          />
        </mask>
      </defs>
      <text
        x="50%"
        y="60%"
        textAnchor="middle"
        dominantBaseline="middle"
        fontSize="130"
        textLength="290"
        lengthAdjust="spacing"
        strokeWidth="0.1"
        className="fill-transparent stroke-neutral-200 font-[helvetica] font-bold dark:stroke-neutral-800"
        style={{ opacity: hovered ? 0.7 : 0 }}
      >
        {text}
      </text>
      <motion.text
        x="50%"
        y="60%"
        textAnchor="middle"
        dominantBaseline="middle"
        fontSize="130"
        textLength="290"
        lengthAdjust="spacing"
        strokeWidth="0.1"
        className="fill-transparent stroke-neutral-200 font-[helvetica] font-bold dark:stroke-neutral-800"
        initial={{ strokeDashoffset: 1000, strokeDasharray: 1000 }}
        animate={{ strokeDashoffset: 0, strokeDasharray: 1000 }}
        transition={{ duration: 5, ease: [0.4, 0, 0.6, 1], delay: startDelay }}
      >
        {text}
      </motion.text>
      {/* Shooting-star comet — stack of 12 stroke layers form a smooth
          fade. All layers share the same head position; longer dasharray
          + lower opacity = tail bleeding further behind the bright tip. */}
      {Array.from({ length: 12 }, (_, i) => {
        const t = i / 11; // 0 = deepest tail, 1 = head
        const round = (n: number) => Math.round(n * 1000) / 1000;
        return {
          len: Math.round(100 - t * 94), // 100 → 6
          width: round(0.3 - t * 0.1), // 0.3 → 0.2
          opacity: round(Math.pow(t, 1.6) * 0.95 + 0.05), // 0.05 → 1
        };
      }).map((layer, i) => (
        <motion.text
          key={i}
          x="50%"
          y="60%"
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize="130"
          textLength="290"
          lengthAdjust="spacing"
          strokeWidth={layer.width}
          strokeLinecap="round"
          strokeDasharray={`${layer.len} 2000`}
          opacity={layer.opacity}
          style={{ stroke: "var(--accent)" }}
          className="fill-transparent font-[helvetica] font-bold"
          initial={{ strokeDashoffset: layer.len }}
          animate={{ strokeDashoffset: layer.len - 1000 }}
          transition={{ duration: 5, ease: [0.4, 0, 0.6, 1], delay: startDelay }}
        >
          {text}
        </motion.text>
      ))}
      <text
        x="50%"
        y="60%"
        textAnchor="middle"
        dominantBaseline="middle"
        fontSize="130"
        textLength="290"
        lengthAdjust="spacing"
        stroke="url(#textGradient)"
        strokeWidth="0.1"
        mask="url(#textMask)"
        className="fill-transparent font-[helvetica] font-bold"
      >
        {text}
      </text>
    </svg>
  );
}
