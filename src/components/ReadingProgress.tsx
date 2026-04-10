"use client";

import { useEffect, useState } from "react";

export default function ReadingProgress() {
  const [pct, setPct] = useState(0);

  useEffect(() => {
    const update = () => {
      const scrolled = window.scrollY;
      const total = document.documentElement.scrollHeight - window.innerHeight;
      setPct(total > 0 ? Math.min(100, (scrolled / total) * 100) : 0);
    };
    window.addEventListener("scroll", update, { passive: true });
    update();
    return () => window.removeEventListener("scroll", update);
  }, []);

  return (
    <div
      aria-hidden
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: `${pct}%`,
        height: "1.5px",
        background: "var(--accent)",
        zIndex: 9998,
        transition: "width 0.08s linear",
        pointerEvents: "none",
      }}
    />
  );
}
