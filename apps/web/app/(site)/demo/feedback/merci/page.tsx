import type { Metadata } from "next";
import Link from "next/link";
import { Icon } from "@/components/icon";

export const metadata: Metadata = { title: "Merci pour votre avis" };

export default function DemoThanks() {
  return (
    <section className="s">
      <div className="wrap" style={{ maxWidth: 640, textAlign: "center" }}>
        <span style={{ width: 72, height: 72, borderRadius: "50%", background: "var(--teal)", display: "inline-grid", placeItems: "center" }}><Icon name="check" size={32} /></span>
        <h1 style={{ marginTop: 20 }}>Merci, votre avis est enregistré</h1>
        <p className="sub">Dans la démonstration, l’avis reste anonyme. Le responsable verrait une alerte seulement en cas de note basse.</p>
        <p style={{ marginTop: 24 }}><Link className="btn o" href="/nos-solutions/feedback-dts">Retour à FeedBack DTS</Link></p>
      </div>
    </section>
  );
}
