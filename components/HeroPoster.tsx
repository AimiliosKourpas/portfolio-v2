"use client";

import { useEffect, useRef } from "react";

/**
 * The hero as one composition: flat geometric shapes sit behind and beside the
 * node headline. A fine pointer nudges each shape by its own depth, then it
 * settles. Touch and reduced-motion get the still composition.
 */
export function HeroPoster({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const move = (e: PointerEvent) => {
      if (reduced.matches || e.pointerType === "touch") return;
      const b = el.getBoundingClientRect();
      el.style.setProperty("--mx", String(((e.clientX - b.left) / b.width - 0.5) * 2));
      el.style.setProperty("--my", String(((e.clientY - b.top) / b.height - 0.5) * 2));
    };
    const leave = () => {
      el.style.setProperty("--mx", "0");
      el.style.setProperty("--my", "0");
    };
    el.addEventListener("pointermove", move);
    el.addEventListener("pointerleave", leave);
    return () => {
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerleave", leave);
    };
  }, []);

  return (
    <div ref={ref} className="poster">
      <div aria-hidden="true" className="poster-art">
        <span className="shape s-dome" />
        <span className="shape s-sun" />
        <span className="shape s-quarter" />
        <span className="shape s-arch" />
        <span className="shape s-dot" />
        <span className="shape s-bar" />
      </div>
      {children}
    </div>
  );
}
