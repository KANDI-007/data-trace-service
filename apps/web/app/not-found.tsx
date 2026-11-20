import Link from "next/link";
import { PublicChrome } from "@/components/public-chrome";

export default function NotFound() {
  return (
    <PublicChrome>
      <section className="s">
        <div className="wrap" style={{ maxWidth: 680 }}>
          <h1>Cette page n’existe pas.</h1>
          <p className="sub">Le lien est peut-être ancien. Revenez à l’accueil ou écrivez-nous.</p>
          <div style={{ display: "flex", gap: 12, marginTop: 24, flexWrap: "wrap" }}>
            <Link className="btn p" href="/">Retour à l’accueil</Link>
            <Link className="btn o" href="/contact">Contact</Link>
          </div>
        </div>
      </section>
    </PublicChrome>
  );
}
