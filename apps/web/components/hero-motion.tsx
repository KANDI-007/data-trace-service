"use client";

import { useEffect, useRef, useState } from "react";

const MARK = "à distance";

function pace(ch: string) {
  const wobble = ((ch.codePointAt(0) ?? 1) % 5) * 9;
  if (ch === " ") return 120 + wobble;
  if (ch === "," || ch === ";" || ch === ":") return 300;
  if (ch === "." || ch === "!" || ch === "?") return 460;
  if (ch === "’" || ch === "'") return 150;
  if ("aeiouyàâéèêëîïôùûüœ".includes(ch.toLowerCase())) return 58 + wobble;
  return 84 + wobble;
}

function buildTimes(text: string, start: number) {
  const times: number[] = [];
  let cursor = start;
  for (const ch of text) {
    times.push(cursor);
    cursor += pace(ch);
  }
  return { times, end: cursor };
}

function InkRun({ text, count, mark }: { text: string; count: number; mark?: boolean }) {
  const at = mark ? text.indexOf(MARK) : -1;
  const end = at >= 0 ? at + MARK.length : -1;
  const glyphs = (from: number, to: number) => {
    const nodes = [];
    for (let i = from; i < to && i < count; i += 1) {
      nodes.push(
        <span className="ink-ch" key={i}>
          {text[i] === " " ? "\u00a0" : text[i]}
        </span>,
      );
    }
    return nodes;
  };
  if (at < 0) return <>{glyphs(0, text.length)}</>;
  return (
    <>
      {glyphs(0, at)}
      {count > at ? <em>{glyphs(at, end)}</em> : null}
      {glyphs(end, text.length)}
    </>
  );
}

function Nib() {
  return (
    <svg className="ink-pen" viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
      <path d="M16 3.5l4.2 4.2-9.6 12.2c-.5.6-1.4.8-2.1.4l-2.2-1.1c-.6-.3-.8-1-.5-1.6L16 3.5z" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
      <path d="M15.2 6.2l3.1 3.1" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
      <path d="M5.2 19.6c.9 1.4 2.6 1.5 3.6.4" stroke="#0A7C75" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

export function HeroCopy({ title, lead }: { title: string; lead: string }) {
  const heading = useRef<HTMLHeadingElement>(null);
  const [run, setRun] = useState(false);
  const [titleCount, setTitleCount] = useState(0);
  const [leadCount, setLeadCount] = useState(0);
  const [typing, setTyping] = useState<"title" | "lead" | "off">("off");

  useEffect(() => {
    const node = heading.current;
    if (!node) return;
    const watcher = new IntersectionObserver(([entry]) => {
      if (entry?.isIntersecting) setRun(true);
    }, { threshold: 0.35 });
    watcher.observe(node);
    return () => watcher.disconnect();
  }, []);

  useEffect(() => {
    if (!run) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setTitleCount(title.length);
      setLeadCount(lead.length);
      setTyping("off");
      return;
    }
    const titleInk = buildTimes(title, 360);
    const leadInk = buildTimes(lead, titleInk.end + 640);
    let frame = 0;
    let titleSeen = 0;
    let leadSeen = 0;
    const tick = (now: number) => {
      const elapsed = now - started;
      let nextTitle = titleSeen;
      while (nextTitle < titleInk.times.length && titleInk.times[nextTitle] <= elapsed) nextTitle += 1;
      let nextLead = leadSeen;
      while (nextLead < leadInk.times.length && leadInk.times[nextLead] <= elapsed) nextLead += 1;
      if (nextTitle !== titleSeen) {
        titleSeen = nextTitle;
        setTitleCount(nextTitle);
      }
      if (nextLead !== leadSeen) {
        leadSeen = nextLead;
        setLeadCount(nextLead);
        setTyping("lead");
      } else if (nextTitle < title.length) {
        setTyping("title");
      }
      if (nextTitle < title.length || nextLead < lead.length) frame = requestAnimationFrame(tick);
      else setTyping("off");
    };
    const started = performance.now();
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [run, title, lead]);

  return (
    <>
      <h1 ref={heading} aria-label={title}>
        <span className="type-slot" aria-hidden="true">
          <span className="type-ghost"><InkRun text={title} count={title.length} mark /></span>
          <span className="type-live">
            <InkRun text={title} count={titleCount} mark />
            {typing === "title" ? <Nib /> : null}
          </span>
        </span>
      </h1>
      <p className="lead" aria-label={lead}>
        <span className="type-slot" aria-hidden="true">
          <span className="type-ghost"><InkRun text={lead} count={lead.length} /></span>
          <span className="type-live">
            <InkRun text={lead} count={leadCount} />
            {typing === "lead" ? <Nib /> : null}
          </span>
        </span>
      </p>
    </>
  );
}

export function PhoneStatus() {
  const [now, setNow] = useState<{ date: string; time: string } | null>(null);
  useEffect(() => {
    const format = () => {
      const current = new Date();
      setNow({
        date: current.toLocaleDateString("fr-FR", { day: "numeric", month: "short" }).replace(".", ""),
        time: current.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" }),
      });
    };
    format();
    const timer = window.setInterval(format, 30000);
    return () => window.clearInterval(timer);
  }, []);
  return (
    <div className="ios-status">
      <div className="ios-bar">
        <span>{now?.time ?? ""}</span>
        <span className="ios-net" aria-hidden="true">
          <svg viewBox="0 0 18 12" width="16" height="11">
            <rect x="0" y="8" width="3" height="4" rx="0.6" />
            <rect x="5" y="5" width="3" height="7" rx="0.6" />
            <rect x="10" y="2" width="3" height="10" rx="0.6" />
            <rect x="15" y="0" width="3" height="12" rx="0.6" />
          </svg>
          <b>4G</b>
        </span>
      </div>
      <span className="ios-date">{now?.date ?? ""}</span>
    </div>
  );
}
