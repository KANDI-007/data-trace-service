"use client";

import { useLayoutEffect, useRef } from "react";
import { Icon } from "@/components/icon";

const problems = [
  "Pas de vue d’ensemble sur la production, les stocks, les ventes et l’argent.",
  "Des erreurs et des pertes découvertes trop tard.",
  "Des clients mal connus, dont les avis ne sont jamais recueillis.",
  "Des décisions prises sans chiffres fiables.",
  "Un dirigeant qui ne peut pas s’absenter sans perdre le contrôle.",
];

function ease(progress: number, start: number, end: number) {
  const raw = (progress - start) / (end - start);
  const x = Math.min(1, Math.max(0, raw));
  return x * x * (3 - 2 * x);
}

function place(node: HTMLElement | null, t: number, x: number, y: number) {
  if (!node) return;
  node.style.opacity = t.toFixed(3);
  node.style.transform = `translate3d(${(1 - t) * x}px, ${(1 - t) * y}px, 0)`;
}

export function ProblemFlight() {
  const root = useRef<HTMLElement>(null);
  const lineA = useRef<HTMLSpanElement>(null);
  const lineB = useRef<HTMLSpanElement>(null);
  const sub = useRef<HTMLParagraphElement>(null);
  const items = useRef<Array<HTMLLIElement | null>>([]);

  useLayoutEffect(() => {
    const rootEl = root.current;
    if (!rootEl) return;
    const media = window.matchMedia("(max-width: 820px), (prefers-reduced-motion: reduce)");
    const narrow = window.matchMedia("(max-width: 820px)");
    const watcher = new IntersectionObserver(([entry]) => {
      rootEl.classList.toggle("is-seen", Boolean(entry?.isIntersecting));
    }, { threshold: 0.28 });
    watcher.observe(rootEl);

    const paint = () => {
      const rows = items.current.filter((node): node is HTMLLIElement => Boolean(node));
      if (media.matches) {
        rootEl.classList.remove("glide-run");
        rootEl.style.removeProperty("--glow");
        [lineA.current, lineB.current, sub.current, ...rows].forEach((node) => {
          if (!node) return;
          node.style.opacity = "";
          node.style.transform = "";
          node.style.filter = "";
        });
        if (!narrow.matches) rootEl.classList.add("is-seen");
        return;
      }

      rootEl.classList.add("glide-run");
      const rect = rootEl.getBoundingClientRect();
      const vh = window.innerHeight;
      const leadIn = vh * 0.72;
      const travel = Math.max(0, rootEl.offsetHeight - vh);
      const passed = Math.min(leadIn + travel, Math.max(0, leadIn - rect.top));
      const progress = leadIn + travel <= 0 ? 1 : passed / (leadIn + travel);

      const title = ease(progress, 0, 0.2);
      place(lineA.current, title, 0, -78);
      place(lineB.current, ease(progress, 0.05, 0.26), 0, -52);
      place(sub.current, ease(progress, 0.1, 0.3), 0, 32);
      rootEl.style.setProperty("--glow", title.toFixed(3));

      rows.forEach((node, index) => {
        const start = index === 0 ? 0 : 0.26 + (index - 1) * 0.16;
        const end = start + (index === 0 ? 0.28 : 0.18);
        const t = ease(progress, start, end);
        const dir = index % 2 === 0 ? -1 : 1;
        node.style.opacity = Math.min(1, t * 1.25).toFixed(3);
        node.style.transform = `translate3d(${((1 - t) * dir * 78).toFixed(2)}vw, ${((1 - t) * 28).toFixed(1)}px, 0)`;
        node.style.filter = t > 0.98 ? "none" : `blur(${((1 - t) * 4).toFixed(2)}px)`;
      });
    };

    paint();
    window.addEventListener("scroll", paint, { passive: true });
    window.addEventListener("resize", paint);
    media.addEventListener("change", paint);
    return () => {
      watcher.disconnect();
      window.removeEventListener("scroll", paint);
      window.removeEventListener("resize", paint);
      media.removeEventListener("change", paint);
    };
  }, []);

  return (
    <section className="glide" ref={root} aria-labelledby="glide-title">
      <div className="glide-pin">
        <div className="glide-stage">
          <h2 className="glide-title" id="glide-title">
            <span ref={lineA}>Vous devez être sur place</span>{" "}
            <span ref={lineB}>pour savoir ce qui se passe ?</span>
          </h2>
          <p className="glide-sub" ref={sub}>
            Beaucoup de dirigeants gèrent encore leur entreprise avec des cahiers, des fichiers dispersés et leur mémoire. Les conséquences sont les mêmes partout.
          </p>
          <ul className="glide-list">
            {problems.map((item, index) => (
              <li
                key={item}
                ref={(node) => {
                  items.current[index] = node;
                }}
              >
                <Icon name="x" size={26} />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
