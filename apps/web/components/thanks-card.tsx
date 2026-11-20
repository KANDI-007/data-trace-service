"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Icon } from "@/components/icon";

interface Recap { fullName: string; company: string; sector: string; city: string; confirmation?: string }

export function ThanksCard() {
  const [recap, setRecap] = useState<Recap | null>(null);
  useEffect(() => {
    const raw = sessionStorage.getItem("dts-demande");
    if (!raw) return;
    setRecap(JSON.parse(raw) as Recap);
  }, []);
  return (
    <section className="s" style={{ padding: "80px 0 100px" }}>
      <div className="wrap" style={{ maxWidth: 760 }}>
        <div className="card" style={{ padding: 48, textAlign: "center" }}>
          <span style={{ width: 72, height: 72, borderRadius: "50%", background: "var(--teal)", color: "var(--navy-d)", display: "inline-grid", placeItems: "center" }}><Icon name="check" size={36} /></span>
          <h1 style={{ fontSize: 36, marginTop: 24 }}>Merci, votre demande est bien reçue</h1>
          <p className="sub" style={{ margin: "14px auto 0" }}>
            {recap?.confirmation === "sent"
              ? "Un e-mail de confirmation vient de vous être envoyé."
              : "Votre demande est enregistrée. L’e-mail de confirmation part dès que l’envoi est configuré (service d’e-mail : à compléter si rien n’est branché)."}
          </p>
          {recap ? (
            <div className="card" style={{ margin: "32px 0", padding: "6px 22px", textAlign: "left", background: "var(--canvas)" }}>
              <table>
                <tbody>
                  <tr><td className="mut">Nom</td><td><b>{recap.fullName}</b></td></tr>
                  <tr><td className="mut">Entreprise</td><td><b>{recap.company}</b></td></tr>
                  <tr><td className="mut">Secteur</td><td><b>{recap.sector} · {recap.city}</b></td></tr>
                </tbody>
              </table>
            </div>
          ) : null}
          <Link className="btn o" href="/">Retour à l’accueil</Link>
        </div>
      </div>
    </section>
  );
}
