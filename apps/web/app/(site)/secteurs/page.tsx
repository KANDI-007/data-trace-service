import type { Metadata } from "next";
import Image from "next/image";
import { Crumb } from "@/components/shell";

export const metadata: Metadata = { title: "Secteurs", description: "Restauration, commerce, production, agriculture, santé, éducation et événements au Togo." };

const sectors = [
  ["Restauration et commerce", "Suivi des ventes et des stocks, avis clients par QR code, flux financiers du jour.", "/media/chef.jpg", ""],
  ["Production et agroalimentaire", "Suivi des lots, des matières premières et des pertes, du site de production jusqu’à la vente.", "/media/tech.jpg", ""],
  ["Agriculture", "Identification des producteurs, collecte, contrôle des parcelles, distribution d’intrants.", "/media/market.jpg", ""],
  ["Santé", "Avis des patients (anonymes), qualité de l’accueil, suivi de l’organisation.", "/media/office.jpg", ""],
  ["Éducation", "Avis des étudiants et des parents, qualité des enseignements et de l’administration.", "/media/pw-form.jpg", ""],
  ["Événements", "Avis des participants, rapport final pour les organisateurs.", "/media/speaker.jpg", ""],
];

export default function SectorsPage() {
  return (
    <>
      <section className="ph2" style={{ paddingBottom: 40 }}>
        <div className="wrap" style={{ gridTemplateColumns: "minmax(0,1fr)" }}>
          <div>
            <Crumb items={["Secteurs"]} />
            <h1>Des secteurs où la traçabilité change tout.</h1>
            <p className="lead">Le même principe partout : voir clair, décider avec des chiffres, garder le contrôle même à distance.</p>
          </div>
        </div>
      </section>
      <section className="s" style={{ paddingTop: 12 }}>
        <div className="wrap">
          <div className="rows">
            {sectors.map(([title, text, src, alt]) => (
              <div key={title}>
                <div className="pic" style={{ height: 180, position: "relative", marginBottom: 12 }}>
                  <Image src={src} alt={alt} fill style={{ objectFit: "cover" }} sizes="280px" />
                </div>
                <h3>{title}</h3>
                <p>{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
