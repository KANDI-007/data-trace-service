"use client";

import { useEffect, useRef } from "react";

type Mount = (el: HTMLElement, config: Record<string, unknown>) => void;

declare global {
  interface Window {
    mountScrollWorld?: Mount;
  }
}

const accent = "#0A7C75";

export function ScrollFilm({ config }: { config: Record<string, unknown> }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    let cancelled = false;
    const start = () => {
      if (cancelled || !window.mountScrollWorld) return;
      window.mountScrollWorld(node, config);
    };
    if (window.mountScrollWorld) start();
    else {
      const script = document.createElement("script");
      script.src = "/monde/scrub-engine.js?v=4";
      script.onload = start;
      document.body.appendChild(script);
    }
    return () => {
      cancelled = true;
      node.replaceChildren();
      node.className = "";
    };
  }, [config]);

  return (
    <div
      ref={ref}
      style={{
        ["--sw-bg" as string]: "#F4F7FA",
        ["--sw-ink" as string]: "#12253D",
        ["--sw-ink-soft" as string]: "#3E5168",
        ["--sw-accent" as string]: accent,
        ["--sw-font-display" as string]: "Poppins, system-ui, sans-serif",
        ["--sw-font-body" as string]: "Poppins, system-ui, sans-serif",
      }}
    />
  );
}
