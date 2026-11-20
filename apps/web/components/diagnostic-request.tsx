"use client";

import { useEffect, useRef, useState } from "react";
import { DiagnosticForm } from "@/components/forms";
import { Crumb } from "@/components/shell";

const steps = [
  {
    n: "01",
    title: "L’échange",
    text: "Échange avec le responsable pour comprendre son activité et ses difficultés.",
    image: "/media/diagnostic/reunion.jpg",
    alt: "Échange autour d’une table de travail",
  },
  {
    n: "02",
    title: "L’observation",
    text: "Observation de la façon dont vous gérez ventes, stocks, production, clients et flux financiers.",
    image: "/media/diagnostic/ordinateur.jpg",
    alt: "Lecture sur un ordinateur portable",
  },
  {
    n: "03",
    title: "Les points sensibles",
    text: "Identification des pertes de temps, des risques d’erreur et des informations qui vous manquent.",
    image: "/media/diagnostic/equipe.jpg",
    alt: "Trois personnes en entretien",
  },
  {
    n: "04",
    title: "Le compte rendu",
    text: "Remise d’un court compte rendu avec les points à améliorer en priorité.",
    image: "/media/diagnostic/poignee-proche.jpg",
    alt: "Poignée de main en fin d’entretien",
  },
  {
    n: "05",
    title: "Votre décision",
    text: "Sans engagement : vous restez libre de donner suite ou non.",
    image: "/media/diagnostic/mains.jpg",
    alt: "Une équipe qui se retrouve autour d’une table",
  },
] as const;

function useSeen<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const watcher = new IntersectionObserver(([entry]) => {
      if (entry?.isIntersecting) setSeen(true);
    }, { threshold: 0.18 });
    watcher.observe(node);
    return () => watcher.disconnect();
  }, []);
  return { ref, seen };
}

function Typed({ text, run, onDone }: { text: string; run: boolean; onDone?: () => void }) {
  const [count, setCount] = useState(0);
  const doneRef = useRef(onDone);
  doneRef.current = onDone;
  useEffect(() => {
    if (!run) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setCount(text.length);
      return;
    }
    setCount(0);
    let index = 0;
    const timer = window.setInterval(() => {
      index += 1;
      setCount(index);
      if (index >= text.length) window.clearInterval(timer);
    }, 16);
    return () => window.clearInterval(timer);
  }, [run, text]);
  useEffect(() => {
    if (run && count >= text.length) doneRef.current?.();
  }, [run, count, text.length]);
  const done = count >= text.length;
  return (
    <>
      {text.slice(0, count)}
      {run && !done ? <i className="rq-caret" aria-hidden="true" /> : null}
    </>
  );
}

export function DiagnosticRequest({ delay, whatsapp }: { delay: string; whatsapp: string | null }) {
  const hero = useSeen<HTMLElement>();
  const form = useSeen<HTMLElement>();
  const [leadOn, setLeadOn] = useState(false);
  const [formLead, setFormLead] = useState(false);

  return (
    <div className="rq">
      <section className={`rq-hero${hero.seen ? " is-in" : ""}`} ref={hero.ref}>
        <div>
          <Crumb items={["Diagnostic gratuit", "Votre demande"]} />
          <span className="rq-kicker">Votre demande</span>
          <h1>
            <Typed text="Avant de vous proposer quoi que ce soit, nous venons comprendre votre entreprise." run={hero.seen} onDone={() => setLeadOn(true)} />
          </h1>
          <p className="rq-lead">
            <Typed text="Notre diagnostic est gratuit et sans engagement. Nous identifions ce qui vous fait perdre du temps ou de l’argent, et nous vous disons ce qui peut être amélioré par le numérique." run={leadOn} />
          </p>
        </div>
        <figure className="rq-portrait">
          <img src="/media/diagnostic/presentation.jpg" alt="Une personne présente la suite" />
        </figure>
      </section>

      {steps.map((step, index) => <Step key={step.n} step={step} flip={index % 2 === 1} />)}

      <section className={`rq-form${form.seen ? " is-in" : ""}`} id="demande" ref={form.ref}>
        <aside className="rq-side">
          <figure>
            <img src="/media/diagnostic/poignee-table.jpg" alt="Accord autour d’une table" />
          </figure>
          <p>Gratuit et sans engagement. Nous vous répondons sous {delay}.</p>
          <p className="mut">Durée et conditions du diagnostic : <span className="todo">à préciser par la Gérante</span></p>
          {whatsapp ? <a className="btn w" href={whatsapp}>Préférer WhatsApp</a> : <span className="todo">WhatsApp : numéro à compléter</span>}
        </aside>
        <div className="rq-sheet">
          <span className="rq-kicker">Le formulaire</span>
          <h2><Typed text="Demandez votre diagnostic gratuit" run={form.seen} onDone={() => setFormLead(true)} /></h2>
          <p className="rq-lead"><Typed text={`Moins d’une minute. Nous vous répondons sous ${delay}.`} run={formLead} /></p>
          <DiagnosticForm delay={delay} intro={false} />
        </div>
      </section>
    </div>
  );
}

function Step({ step, flip }: { step: (typeof steps)[number]; flip: boolean }) {
  const { ref, seen } = useSeen<HTMLElement>();
  return (
    <section className={`rq-step${flip ? " flip" : ""}${seen ? " is-in" : ""}`} ref={ref}>
      <figure>
        <img src={step.image} alt={step.alt} />
      </figure>
      <div>
        <span className="rq-num">{step.n}</span>
        <h2>{step.title}</h2>
        <p><Typed text={step.text} run={seen} /></p>
      </div>
    </section>
  );
}
