"use client";

import { useLayoutEffect, useRef } from "react";
import { Icon } from "@/components/icon";

const title = "Notre méthode en trois étapes";

const steps = [
  {
    n: "1",
    tone: "free",
    title: "Diagnostic gratuit",
    text: "Nous venons comprendre votre entreprise, sans que cela vous coûte quoi que ce soit.",
    items: ["Échange avec le responsable", "Observation des ventes, stocks, clients et flux", "Court compte rendu des priorités"],
    tag: "Sans engagement",
  },
  {
    n: "2",
    tone: "navy",
    title: "Une solution simple",
    text: "La solution la plus simple qui résout vos vrais problèmes, au prix annoncé avant de commencer.",
    items: ["Proposition claire : quoi, quand, combien", "Démarrage petit, puis extension", "Installation et formation de vos équipes"],
    tag: "",
  },
  {
    n: "3",
    tone: "ink",
    title: "Gestion à distance",
    text: "Vous pilotez votre entreprise où que vous soyez, depuis votre téléphone ou votre ordinateur.",
    items: ["Tableau de bord et alertes", "Rapports prêts à lire", "Suivi et support après la mise en place"],
    tag: "",
  },
] as const;

function ease(progress: number, start: number, end: number) {
  const raw = (progress - start) / (end - start);
  const x = Math.min(1, Math.max(0, raw));
  return x * x * (3 - 2 * x);
}

export function MethodFlight() {
  const root = useRef<HTMLElement>(null);
  const head = useRef<HTMLDivElement>(null);
  const runner = useRef<HTMLDivElement>(null);
  const wedge = useRef<HTMLSpanElement>(null);
  const sub = useRef<HTMLParagraphElement>(null);
  const books = useRef<Array<HTMLElement | null>>([]);

  useLayoutEffect(() => {
    const rootEl = root.current;
    if (!rootEl) return;
    const media = window.matchMedia("(max-width: 820px), (prefers-reduced-motion: reduce)");
    const narrow = window.matchMedia("(max-width: 820px)");
    const watcher = new IntersectionObserver(([entry]) => {
      rootEl.classList.toggle("is-seen", Boolean(entry?.isIntersecting));
    }, { threshold: 0.22 });
    watcher.observe(rootEl);

    const fulls = [320, 320, 320];
    let measuredFor = 0;

    const paint = () => {
      const letters = [...rootEl.querySelectorAll<HTMLElement>(".meth-ch")];
      const bookEls = books.current.filter((node): node is HTMLElement => Boolean(node));
      const clear = (node: HTMLElement | null) => {
        if (!node) return;
        node.style.opacity = "";
        node.style.transform = "";
        node.style.width = "";
        node.style.height = "";
        node.style.removeProperty("--open");
        node.style.removeProperty("--ink");
      };

      if (media.matches) {
        rootEl.classList.remove("meth-run");
        clear(runner.current);
        clear(sub.current);
        letters.forEach((node) => clear(node));
        bookEls.forEach((book) => {
          clear(book);
          book.querySelectorAll<HTMLElement>(".book-num, .book-page li, .book-page h3, .book-page p").forEach((node) => clear(node));
        });
        if (!narrow.matches) rootEl.classList.add("is-seen");
        return;
      }

      rootEl.classList.add("meth-run");
      const rect = rootEl.getBoundingClientRect();
      const vh = window.innerHeight;
      const leadIn = vh * 0.5;
      const travel = Math.max(0, rootEl.offsetHeight - vh);
      const passed = Math.min(leadIn + travel, Math.max(0, leadIn - rect.top));
      const progress = leadIn + travel <= 0 ? 1 : passed / (leadIn + travel);

      const headEl = head.current;
      const runEl = runner.current;
      if (headEl && runEl) {
        const push = ease(progress, 0.02, 0.34);
        const start = -36;
        const end = Math.max(start + 40, headEl.clientWidth - runEl.offsetWidth * 0.35);
        const bob = Math.sin(push * Math.PI * 6) * 5;
        runEl.style.transform = `translate3d(${(start + (end - start) * push).toFixed(1)}px, ${bob.toFixed(1)}px, 0)`;
        if (wedge.current) wedge.current.style.transform = `rotate(${(Math.sin(push * Math.PI * 8) * 7).toFixed(1)}deg)`;
        const pen = runEl.getBoundingClientRect().right - 6;
        letters.forEach((ch) => {
          const left = ch.getBoundingClientRect().left;
          const t = ease((pen - left) / 42, 0, 1);
          ch.style.opacity = t.toFixed(3);
          ch.style.transform = `translateY(${((1 - t) * 12).toFixed(1)}px)`;
          ch.style.filter = t > 0.98 ? "none" : `blur(${((1 - t) * 3).toFixed(2)}px)`;
        });
      }

      if (sub.current) {
        const t = ease(progress, 0.28, 0.4);
        sub.current.style.opacity = t.toFixed(3);
        sub.current.style.transform = `translateY(${((1 - t) * 14).toFixed(1)}px)`;
      }

      const widthKey = headEl?.clientWidth ?? 0;
      if (widthKey !== measuredFor) {
        bookEls.forEach((book, index) => {
          const prevH = book.style.height;
          const prevW = book.style.width;
          book.style.height = "auto";
          book.style.width = "100%";
          fulls[index] = book.offsetHeight;
          book.style.height = prevH;
          book.style.width = prevW;
        });
        measuredFor = widthKey;
      }

      bookEls.forEach((book, index) => {
        const start = 0.38 + index * 0.18;
        const open = ease(progress, start, start + 0.14);
        const grid = book.parentElement;
        const col = grid ? (grid.clientWidth - 44) / 3 : 300;
        const closed = 124;
        book.style.width = `${(closed + (col - closed) * open).toFixed(1)}px`;
        book.style.height = `${(closed + (Math.max(fulls[index], 220) - closed) * open).toFixed(1)}px`;
        book.style.setProperty("--open", open.toFixed(3));
        const ink = ease(progress, start + 0.09, start + 0.2);
        book.style.setProperty("--ink", ink.toFixed(3));
        const num = book.querySelector<HTMLElement>(".book-num");
        if (num) {
          const shown = ease(progress, start + 0.08, start + 0.15);
          num.style.opacity = shown.toFixed(3);
          num.style.transform = `scale(${(0.6 + shown * 0.4).toFixed(3)})`;
        }
        book.querySelectorAll<HTMLElement>(".book-page li").forEach((item, itemIndex) => {
          const shown = ease(progress, start + 0.12 + itemIndex * 0.02, start + 0.2 + itemIndex * 0.02);
          item.style.opacity = shown.toFixed(3);
          item.style.transform = `translateY(${((1 - shown) * 10).toFixed(1)}px)`;
        });
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
    <section className="meth-flight" ref={root} aria-labelledby="meth-title">
      <div className="meth-pin">
        <div className="meth-head" ref={head}>
          <h2 className="meth-title" id="meth-title">
            {Array.from(title).map((char, index) => (
              <span className="meth-ch" key={`${char}-${index}`}>{char === " " ? "\u00a0" : char}</span>
            ))}
          </h2>
          <p className="meth-sub" ref={sub}>Du diagnostic au pilotage à distance, sans logiciel compliqué.</p>
          <div className="meth-runner" ref={runner}>
            <img className="meth-avatar" src="/media/avatar-marche.png" alt="" />
            <span className="meth-wedge" ref={wedge} aria-hidden="true" />
          </div>
        </div>
        <div className="meth-books">
          {steps.map((step, index) => (
            <article
              className={`book tone-${step.tone}`}
              key={step.n}
              ref={(node) => {
                books.current[index] = node;
              }}
            >
              <div className="book-page">
                <b className="book-num">{step.n}</b>
                <h3>{step.title}</h3>
                <p>{step.text}</p>
                <ul>
                  {step.items.map((item) => (
                    <li key={item}><Icon name="check" size={16} />{item}</li>
                  ))}
                </ul>
                {step.tag ? <span className="tag">{step.tag}</span> : null}
              </div>
              <div className="book-cover" aria-hidden="true" />
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
