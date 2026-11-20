import type { Metadata } from "next";

export const metadata: Metadata = { title: "Charte des composants" };

export default function CharterPage() {
  return (
    <section className="s">
      <div className="wrap">
        <h1>Composants</h1>
        <p className="sub">États des boutons, champs et cartes. Page de contrôle, absente du menu public.</p>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: 24 }}>
          <button className="btn p" type="button">Primaire</button>
          <button className="btn o" type="button">Secondaire</button>
          <button className="btn n" type="button">Marine</button>
          <button className="btn w" type="button">WhatsApp</button>
          <button className="btn p" type="button" disabled>Inactif</button>
        </div>
        <form className="card" style={{ padding: 24, marginTop: 28, maxWidth: 480 }}>
          <div className="fm">
            <div><label htmlFor="ok">Champ valide</label><input id="ok" className="in" defaultValue="Akouvi" /></div>
            <div><label htmlFor="bad">Champ en erreur</label><input id="bad" className="in er" defaultValue="+228 9" aria-invalid="true" /><div className="err">Numéro trop court.</div></div>
          </div>
        </form>
      </div>
    </section>
  );
}
