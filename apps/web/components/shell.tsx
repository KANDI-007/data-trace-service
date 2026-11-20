"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Icon } from "@/components/icon";
import { identity, readableDelay, waLink, type Settings } from "@/lib/content";

const links = [
  { href: "/", label: "Accueil" },
  { href: "/qui-sommes-nous", label: "Qui sommes-nous" },
  { href: "/nos-solutions", label: "Nos solutions" },
  { href: "/secteurs", label: "Secteurs" },
  { href: "/actualites", label: "Actualités" },
  { href: "/contact", label: "Contact" },
];

export function Header({ settings: _settings }: { settings: Settings }) {
  const path = usePathname();
  const [open, setOpen] = useState(false);
  void _settings;
  return (
    <header className="hd">
      <div className="wrap">
        <Link href="/" aria-label="Accueil DATA TRACE SERVICE">
          <img src="/media/logo.png" alt="DATA TRACE SERVICE" className="logo" width={210} height={48} />
        </Link>
        <nav className="nav" aria-label="Navigation principale">
          {links.map((link) => (
            <Link key={link.href} href={link.href} className={path === link.href ? "on" : undefined}>
              {link.label}
            </Link>
          ))}
        </nav>
        <a className="tel tel-mail" href="mailto:datatraceservice@gmail.com" aria-label="Écrire à datatraceservice@gmail.com">
          <span className="tel-waves" aria-hidden="true" />
          <span className="tel-handset" aria-hidden="true">
            <svg viewBox="0 0 32 32" width="22" height="22">
              <rect x="10" y="3" width="12" height="26" rx="3" fill="none" stroke="currentColor" strokeWidth="1.8" />
              <path d="M13 7.5h6M16 24.8v.2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            </svg>
          </span>
        </a>
        <Link className="btn p s" href="/diagnostic-gratuit">Diagnostic gratuit</Link>
        <button className="burger" type="button" aria-expanded={open} aria-label={open ? "Fermer le menu" : "Ouvrir le menu"} onClick={() => setOpen((value) => !value)}>
          <Icon name={open ? "x" : "menu"} size={22} />
        </button>
      </div>
      <div className={open ? "nav-panel open" : "nav-panel"}>
        {links.map((link) => (
          <Link key={link.href} href={link.href} onClick={() => setOpen(false)}>{link.label}</Link>
        ))}
        <Link href="/diagnostic-gratuit" onClick={() => setOpen(false)}>Diagnostic gratuit</Link>
      </div>
    </header>
  );
}

export function Footer({ settings }: { settings: Settings }) {
  const socials = [
    ["facebook", "Facebook"],
    ["instagram", "Instagram"],
    ["linkedin", "LinkedIn"],
    ["tiktok", "TikTok"],
  ] as const;
  return (
    <footer className="ft">
      <div className="wrap">
        <div className="g">
          <div>
            <img src="/media/logo-white.png" alt="DATA TRACE SERVICE" width={220} height={54} style={{ height: 54, width: "auto" }} />
            <p style={{ marginTop: 18, maxWidth: 320 }}>{identity.slogan}. Nous accompagnons les entreprises togolaises dans l’organisation et la digitalisation.</p>
            <div className="soc">
              {socials.map(([key, label]) => {
                const href = settings[key];
                const ready = href && href !== "à compléter" && href.startsWith("http");
                return ready ? (
                  <a key={key} href={href} aria-label={label} style={{ width: 40, height: 40, borderRadius: 10, border: "1px solid rgba(255,255,255,.22)", display: "grid", placeItems: "center" }}>{label.slice(0, 1)}</a>
                ) : (
                  <span key={key} className="todo" title={`${label} : à compléter`}>{label.slice(0, 2)}</span>
                );
              })}
            </div>
          </div>
          <div>
            <h5>Le site</h5>
            <ul>
              {links.map((link) => <li key={link.href}><Link href={link.href}>{link.label}</Link></li>)}
            </ul>
          </div>
          <div>
            <h5>Nos solutions</h5>
            <ul>
              <li><Link href="/diagnostic-gratuit">Diagnostic gratuit</Link></li>
              <li><Link href="/nos-solutions/digitalisation">Digitalisation</Link></li>
              <li><Link href="/nos-solutions/tracabilite">Traçabilité</Link></li>
              <li><Link href="/nos-solutions/feedback-dts">FeedBack DTS</Link></li>
              <li><Link href="/nos-solutions/fiabilite-des-donnees">Fiabilité des données</Link></li>
              <li><Link href="/nos-solutions/dts-agro">DTS AGRO</Link></li>
            </ul>
          </div>
          <div>
            <h5>Nous joindre</h5>
            <ul>
              <li style={{ display: "flex", gap: 10 }}><Icon name="pin" size={18} />{settings.address}</li>
              <li style={{ display: "flex", gap: 10 }}><Icon name="phone" size={18} />{settings.phone === "à compléter" ? <span className="todo">numéro à compléter</span> : settings.phone}</li>
              <li style={{ display: "flex", gap: 10 }}><Icon name="mail" size={18} /><a href={`mailto:${settings.email}`}>{settings.email}</a></li>
            </ul>
          </div>
        </div>
        <div className="bot">
          <span>© {new Date().getFullYear()} DATA TRACE SERVICE {identity.legalForm} · RCCM {settings.rccm === "à compléter" ? <span className="todo">à compléter</span> : settings.rccm} · NIF {settings.nif === "à compléter" ? <span className="todo">à compléter</span> : settings.nif}</span>
          <span><Link href="/mentions-legales">Mentions légales</Link> · <Link href="/mentions-legales#confidentialite">Confidentialité</Link> · FR</span>
        </div>
      </div>
    </footer>
  );
}

export function WhatsApp({ settings }: { settings: Settings }) {
  const href = waLink(settings.whatsapp, "Bonjour DATA TRACE SERVICE, je souhaite un diagnostic gratuit.");
  const desktop = href ?? "/contact";
  return (
    <>
      <a className="wa" href={desktop} aria-label={href ? "Écrire sur WhatsApp" : "WhatsApp : numéro à compléter"}>
        <span>WhatsApp</span>
      </a>
      <div className="mbar">
        <Link className="btn p" href="/diagnostic-gratuit">Diagnostic gratuit</Link>
        <a className="btn w" href={desktop} aria-label={href ? "WhatsApp" : "WhatsApp : numéro à compléter"}>WA</a>
      </div>
    </>
  );
}

export function FinalBand({ delay }: { delay: string }) {
  return (
    <section className="s">
      <div className="wrap">
        <div className="band">
          <i className="ring" />
          <i className="ring2" />
          <div style={{ position: "relative" }}>
            <h2>Prêt à y voir plus clair dans votre entreprise ?</h2>
            <p>Demandez votre diagnostic gratuit dès aujourd’hui. Réponse sous {readableDelay(delay)}.</p>
          </div>
          <div className="card" style={{ padding: 24, position: "relative" }}>
            <p style={{ fontWeight: 600, marginBottom: 12 }}>Moins d’une minute, sans engagement.</p>
            <Link className="btn p l" href="/diagnostic-gratuit" style={{ width: "100%" }}>Demander mon diagnostic gratuit</Link>
            <p className="mut" style={{ fontSize: 12.5, textAlign: "center", marginTop: 10 }}>Vos données ne servent qu’à vous répondre.</p>
          </div>
        </div>
      </div>
    </section>
  );
}

export function Crumb({ items }: { items: string[] }) {
  return (
    <div className="crumb">
      <Link href="/">Accueil</Link>
      {items.map((item) => (
        <span key={item}>/ <b>{item}</b></span>
      ))}
    </div>
  );
}
