import type { Metadata } from "next";
import Image from "next/image";
import { FinalBand, Crumb } from "@/components/shell";
import { block, identity, loadPage, loadSettings } from "@/lib/content";

export const metadata: Metadata = { title: "Qui sommes-nous", description: "Entreprise togolaise de traçabilité, d’organisation et de digitalisation. Mission, valeurs et gérante." };

const values = [
  ["Simplicité", "Des solutions faciles à prendre en main, même sans être informaticien."],
  ["Transparence", "Un diagnostic gratuit, des propositions claires, des prix annoncés avant de commencer."],
  ["Fiabilité", "Des données justes et tracées, sur lesquelles on peut décider."],
  ["Proximité", "Une équipe locale, qui comprend les réalités des entreprises togolaises et reste disponible après la mise en place."],
  ["Progression", "On commence petit, on ajoute des fonctions au rythme de l’entreprise."],
];

export default async function AboutPage() {
  const [page, settings] = await Promise.all([loadPage("qui-sommes-nous"), loadSettings()]);
  const lead = block(page, "lead", "DATA TRACE SERVICE est une entreprise togolaise spécialisée dans la traçabilité, l’organisation et la digitalisation. Notre mission : accompagner les entreprises pour mieux maîtriser leur activité et améliorer leurs performances.");
  const manager = block(page, "manager", "à compléter");
  return (
    <>
      <section className="ph2">
        <div className="wrap">
          <div>
            <Crumb items={["Qui sommes-nous"]} />
            <h1>{page?.title ?? "Le numérique doit être simple, utile et accessible à tous les chefs d’entreprise."}</h1>
            <p className="lead">{lead} Traçabilité · Organisation · Qualité.</p>
          </div>
          <div className="pic" style={{ height: 400, position: "relative" }}>
            <Image src="/media/openspace.jpg" alt="Espace de travail" fill style={{ objectFit: "cover" }} sizes="50vw" />
          </div>
        </div>
      </section>
      <section className="s">
        <div className="wrap">
          <div className="sec-h"><h2 className="h2">Nos valeurs</h2></div>
          <div className="rows">{values.map(([title, text]) => <div key={title}><h3>{title}</h3><p>{text}</p></div>)}</div>
        </div>
      </section>
      <section className="s alt">
        <div className="wrap" style={{ display: "grid", gridTemplateColumns: "minmax(0,.8fr) minmax(0,1.2fr)", gap: 56 }}>
          <div className="imgph" style={{ aspectRatio: "4/5" }}>Photo de la Gérante<br />à fournir</div>
          <div>
            <h2 className="h2">{identity.manager}</h2>
            <p className="mut" style={{ marginTop: 6, fontWeight: 500 }}>Gérante de DATA TRACE SERVICE</p>
            <p className="sub">{manager === "à compléter" ? <span className="todo">Texte de présentation de la Gérante à fournir</span> : manager}</p>
            <div className="card" style={{ marginTop: 28, padding: "6px 22px" }}>
              <table>
                <tbody>
                  <tr><td className="mut">Forme juridique</td><td><b>{identity.legalForm}</b>, selon les lois en vigueur au Togo</td></tr>
                  <tr><td className="mut">Siège</td><td><b>{identity.address}</b></td></tr>
                  <tr><td className="mut">E-mail</td><td><b>{identity.email}</b></td></tr>
                  <tr><td className="mut">Slogan</td><td><b>{identity.slogan}</b></td></tr>
                  <tr><td className="mut">Zone</td><td><b>{settings.area}</b></td></tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>
      <FinalBand delay={settings.responseDelay} />
    </>
  );
}
