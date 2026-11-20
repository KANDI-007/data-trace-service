"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { Icon, type IconName } from "@/components/icon";
import { ParcelMap, QrMark } from "@/components/visuals";

const cards = [
  {
    n: "01",
    icon: "bell" as IconName,
    tone: "navy",
    tag: "Notre produit phare",
    title: "FeedBack DTS",
    text: "Vos clients scannent un code QR et répondent en moins d’une minute. Vous voyez la note, la satisfaction et les alertes sur votre téléphone.",
    href: "/nos-solutions/feedback-dts",
    cta: "Découvrir FeedBack DTS",
    spec: "feedback" as const,
    tilt: -6.4,
    lift: 8,
  },
  {
    n: "02",
    icon: "layers" as IconName,
    tone: "",
    title: "Traçabilité",
    text: "De la réception des matières premières à la vente, retrouvez l’historique d’un produit avec un code QR.",
    href: "/nos-solutions/tracabilite",
    cta: "Voir la traçabilité",
    spec: "trace" as const,
    tilt: 4.6,
    lift: 34,
  },
  {
    n: "03",
    icon: "box" as IconName,
    tone: "",
    title: "Digitalisation des processus",
    text: "Ventes, stocks, achats, production et caisse au même endroit.",
    href: "/nos-solutions/digitalisation",
    cta: "En savoir plus",
    spec: "flow" as const,
    tilt: -3.4,
    lift: -16,
  },
  {
    n: "04",
    icon: "shield" as IconName,
    tone: "",
    title: "Fiabilité des données",
    text: "Doublons, fiches incomplètes, coordonnées erronées : nous les repérons et vous remettons des fichiers propres.",
    href: "/nos-solutions/fiabilite-des-donnees",
    cta: "En savoir plus",
    spec: "clean" as const,
    tilt: 5.2,
    lift: 30,
  },
  {
    n: "05",
    icon: "pin" as IconName,
    tone: "",
    title: "DTS AGRO",
    text: "Producteurs, collecte, parcelles, intrants : une plateforme modulaire pour les coopératives.",
    href: "/nos-solutions/dts-agro",
    cta: "Voir les modules",
    spec: "agro" as const,
    tilt: -4.4,
    lift: -10,
  },
  {
    n: "06",
    icon: "phone" as IconName,
    tone: "",
    title: "Applications web et mobiles sur mesure",
    text: "Un besoin précis ? Nous concevons l’application web, mobile ou la solution en abonnement (SaaS) qui lui correspond.",
    href: "/nos-solutions/applications-sur-mesure",
    cta: "Parler de mon projet",
    spec: "apps" as const,
    tilt: 3.4,
    lift: 38,
  },
  {
    n: "07",
    icon: "target" as IconName,
    tone: "tint",
    title: "Pas sûr de ce qu’il vous faut ?",
    text: "Commencez par le diagnostic gratuit. Nous vous disons ce qui peut être amélioré.",
    href: "/diagnostic-gratuit",
    cta: "Diagnostic gratuit",
    spec: "start" as const,
    tilt: -2.4,
    lift: 14,
  },
] as const;

function Specimen({ kind }: { kind: (typeof cards)[number]["spec"] }) {
  if (kind === "feedback") {
    return (
      <div className="rail-spec">
        <div className="rail-spec-h"><span>Exemple</span><b>4,3 / 5</b></div>
        <div className="rail-bars" aria-hidden="true">
          <span><i style={{ width: "86%" }} />Note</span>
          <span><i style={{ width: "74%" }} />Satisfaction</span>
          <span><i className="hot" style={{ width: "28%" }} />Alertes</span>
        </div>
      </div>
    );
  }
  if (kind === "trace") {
    return (
      <div className="rail-spec trace">
        <QrMark size={72} />
        <ol>
          <li><b>01</b>Réception</li>
          <li><b>02</b>Historique</li>
          <li><b>03</b>Vente</li>
        </ol>
      </div>
    );
  }
  if (kind === "flow") {
    return (
      <ul className="rail-flow">
        {["Ventes", "Stocks", "Achats", "Production", "Caisse"].map((item, index) => (
          <li key={item}><b>{String(index + 1).padStart(2, "0")}</b>{item}</li>
        ))}
      </ul>
    );
  }
  if (kind === "clean") {
    return (
      <ul className="rail-clean">
        <li><Icon name="x" size={16} />Doublons</li>
        <li><Icon name="x" size={16} />Fiches incomplètes</li>
        <li><Icon name="x" size={16} />Coordonnées erronées</li>
        <li className="ok"><Icon name="check" size={16} />Fichiers propres</li>
      </ul>
    );
  }
  if (kind === "agro") {
    return (
      <div className="rail-spec agro">
        <ParcelMap />
        <div>
          {["Producteurs", "Collecte", "Parcelles", "Intrants"].map((item) => <span key={item}>{item}</span>)}
        </div>
      </div>
    );
  }
  if (kind === "apps") {
    return (
      <div className="rail-apps">
        <span><Icon name="layers" size={18} />Application web</span>
        <span><Icon name="phone" size={18} />Application mobile</span>
        <span><Icon name="box" size={18} />Solution SaaS</span>
      </div>
    );
  }
  return (
    <div className="rail-start" aria-hidden="true">
      <b>01</b>
      <i />
      <b>02</b>
      <i />
      <b>03</b>
    </div>
  );
}

export function SolutionRail() {
  const root = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const title = useRef<HTMLHeadingElement>(null);
  const bar = useRef<HTMLSpanElement>(null);
  const count = useRef<HTMLElement>(null);

  useEffect(() => {
    const rootEl = root.current;
    const trackEl = track.current;
    const titleEl = title.current;
    const windowEl = trackEl?.parentElement;
    if (!rootEl || !trackEl || !windowEl) return;
    const narrow = window.matchMedia("(max-width: 820px)");
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    const still = () => narrow.matches || reduce.matches;
    const clamp01 = (value: number) => Math.min(1, Math.max(0, value));

    const markMobile = () => {
      const items = [...trackEl.querySelectorAll<HTMLElement>(".rail-card")];
      const box = windowEl.getBoundingClientRect();
      const mid = box.left + box.width / 2;
      let focus = 0;
      let nearest = Number.POSITIVE_INFINITY;
      items.forEach((card, index) => {
        const rect = card.getBoundingClientRect();
        const distance = Math.abs(rect.left + rect.width / 2 - mid);
        if (distance < nearest) {
          nearest = distance;
          focus = index;
        }
      });
      items.forEach((card, index) => card.classList.toggle("is-focus", index === focus));
      if (count.current) count.current.textContent = String(focus + 1).padStart(2, "0");
    };

    const frame = () => {
      const items = [...trackEl.querySelectorAll<HTMLElement>(".rail-card")];
      if (still()) {
        trackEl.style.transform = "";
        if (titleEl) titleEl.style.transform = "";
        items.forEach((card) => {
          card.style.transform = "";
          card.style.zIndex = "";
          card.classList.remove("is-focus");
        });
        if (narrow.matches && !reduce.matches) markMobile();
        return;
      }
      const total = rootEl.offsetHeight - window.innerHeight;
      const passed = Math.min(total, Math.max(0, -rootEl.getBoundingClientRect().top));
      const progress = total <= 0 ? 0 : passed / total;
      const view = windowEl.clientWidth;
      const max = Math.max(0, trackEl.scrollWidth - view);
      trackEl.style.transform = `translate3d(${(-progress * max).toFixed(1)}px,0,0)`;
      if (titleEl) titleEl.style.transform = `translate3d(${(-progress * Math.max(max, view) * 0.46).toFixed(1)}px,-50%,0)`;
      const origin = trackEl.getBoundingClientRect().left;
      const mid = window.innerWidth * 0.34;
      let focus = 0;
      let nearest = Number.POSITIVE_INFINITY;
      const centers = items.map((card) => origin + card.offsetLeft + card.offsetWidth / 2);
      centers.forEach((center, index) => {
        const distance = Math.abs(center - mid);
        if (distance < nearest) {
          nearest = distance;
          focus = index;
        }
      });
      items.forEach((card, index) => {
        const center = centers[index];
        const distance = Math.abs(center - mid);
        const amount = Math.min(1, distance / Math.max(card.offsetWidth * 0.82, 1));
        const fromRight = (center - window.innerWidth * 0.46) / (window.innerWidth * 0.34);
        const enter = clamp01(1 - fromRight);
        const rise = enter * enter * (3 - 2 * enter);
        const pose = cards[index];
        const tilt = pose.tilt * amount + (1 - rise) * 8;
        const y = pose.lift * amount + (1 - rise) * 420;
        const x = (1 - rise) * 160;
        const scale = 0.94 + rise * 0.1 - amount * 0.045;
        card.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0) rotate(${tilt.toFixed(2)}deg) scale(${scale.toFixed(3)})`;
        card.style.zIndex = String(index === focus ? 30 : 6 + index);
        card.classList.toggle("is-focus", index === focus);
      });
      if (bar.current) bar.current.style.transform = `scaleX(${progress})`;
      if (count.current) count.current.textContent = String(focus + 1).padStart(2, "0");
    };
    frame();
    window.addEventListener("scroll", frame, { passive: true });
    window.addEventListener("resize", frame);
    narrow.addEventListener("change", frame);
    reduce.addEventListener("change", frame);
    windowEl.addEventListener("scroll", markMobile, { passive: true });
    return () => {
      window.removeEventListener("scroll", frame);
      window.removeEventListener("resize", frame);
      narrow.removeEventListener("change", frame);
      reduce.removeEventListener("change", frame);
      windowEl.removeEventListener("scroll", markMobile);
    };
  }, []);

  return (
    <section className="rail" ref={root} style={{ ["--steps" as string]: cards.length - 1 }} aria-labelledby="rail-title">
      <div className="rail-sticky">
        <div className="rail-topbar wrap">
          <p className="rail-kicker">Défiler pour les voir passer</p>
          <div className="rail-meta">
            <b ref={count}>01</b>
            <span>/ {String(cards.length).padStart(2, "0")}</span>
            <Link className="lnk" href="/nos-solutions">Toutes nos solutions <Icon name="arrow" size={18} /></Link>
          </div>
        </div>
        <div className="rail-stage">
          <h2 className="rail-title" id="rail-title" ref={title}>
            <span>Des solutions</span>
            <span>concrètes,</span>
            <span>choisies selon</span>
            <span>votre besoin</span>
          </h2>
          <div className="rail-window">
            <div className="rail-track" ref={track}>
              {cards.map((card, index) => (
                <article
                  className={`rail-card bc ${card.tone}`}
                  key={card.href}
                  style={{ ["--tilt" as string]: `${card.tilt}deg`, ["--lift" as string]: `${card.lift}px`, zIndex: index + 1 }}
                >
                  <span className="rail-no" aria-hidden="true">{card.n}</span>
                  <div className="rail-top">
                    <span className="rail-ico"><Icon name={card.icon} size={22} /></span>
                    {"tag" in card ? <span className="tag">{card.tag}</span> : <span className="rail-no-label">{card.n}</span>}
                  </div>
                  <h3>{card.title}</h3>
                  <p>{card.text}</p>
                  <Specimen kind={card.spec} />
                  {card.spec === "start" ? (
                    <Link className="btn n" href={card.href}>{card.cta}</Link>
                  ) : (
                    <Link className="lnk" href={card.href}>{card.cta} <Icon name="arrow" size={18} /></Link>
                  )}
                </article>
              ))}
            </div>
          </div>
        </div>
        <div className="rail-bar wrap" aria-hidden="true"><span ref={bar} /></div>
      </div>
    </section>
  );
}
