import type { Metadata } from "next";
import { ContactForm } from "@/components/forms";
import { Crumb } from "@/components/shell";
import { loadSettings, readableDelay, waLink } from "@/lib/content";

export const metadata: Metadata = { title: "Contact", description: "Écrivez à DATA TRACE SERVICE à Lomé : formulaire, e-mail et WhatsApp." };

export default async function ContactPage() {
  const settings = await loadSettings();
  const wa = waLink(settings.whatsapp, "Bonjour DATA TRACE SERVICE.");
  const map = "https://maps.google.com/maps?q=B%C3%A8%20Kpota%20Lom%C3%A9&z=14&output=embed";
  return (
    <>
      <section className="ph2" style={{ paddingBottom: 36 }}>
        <div className="wrap" style={{ gridTemplateColumns: "minmax(0,1fr)" }}>
          <div>
            <Crumb items={["Contact"]} />
            <h1>Parlons de votre entreprise.</h1>
            <p className="lead">Écrivez-nous, appelez-nous ou passez sur WhatsApp. Nous répondons sous {readableDelay(settings.responseDelay)}.</p>
          </div>
        </div>
      </section>
      <section className="s" style={{ paddingTop: 12 }}>
        <div className="wrap" style={{ display: "grid", gridTemplateColumns: "minmax(0,1.1fr) minmax(0,.9fr)", gap: 40, alignItems: "start" }}>
          <ContactForm />
          <div>
            <ul style={{ listStyle: "none", padding: 0, display: "grid", gap: 12 }}>
              <li><b>Adresse</b><br />{settings.address}</li>
              <li><b>Horaires</b><br />{settings.hours === "à compléter" ? <span className="todo">à compléter</span> : settings.hours}</li>
              <li><b>Téléphone</b><br />{settings.phone === "à compléter" ? <span className="todo">à compléter</span> : settings.phone}</li>
              <li><b>E-mail</b><br /><a href={`mailto:${settings.email}`}>{settings.email}</a></li>
              <li id="whatsapp"><b>WhatsApp</b><br />{wa ? <a href={wa}>Écrire sur WhatsApp</a> : <span className="todo">numéro à compléter</span>}</li>
            </ul>
            <iframe title="Carte du siège, Bè Kpota, Lomé" src={map} style={{ width: "100%", height: 280, border: 0, borderRadius: 16, marginTop: 20 }} loading="lazy" />
          </div>
        </div>
      </section>
    </>
  );
}
