import type { Metadata } from "next";
import { Crumb } from "@/components/shell";
import { identity, loadSettings } from "@/lib/content";

export const metadata: Metadata = { title: "Mentions légales et confidentialité", description: "Éditeur, hébergement, protection des données et droits des personnes." };

export default async function LegalPage() {
  const settings = await loadSettings();
  const mark = (value: string) => value === "à compléter" ? <span className="todo">à compléter</span> : value;
  return (
    <>
      <section className="ph2" style={{ paddingBottom: 32 }}>
        <div className="wrap" style={{ gridTemplateColumns: "minmax(0,1fr)" }}>
          <div>
            <Crumb items={["Mentions légales et confidentialité"]} />
            <h1>Mentions légales et confidentialité.</h1>
          </div>
        </div>
      </section>
      <section className="s" style={{ paddingTop: 12 }}>
        <div className="wrap" style={{ display: "grid", gap: 28, maxWidth: 800 }}>
          <div>
            <h2>Éditeur du site</h2>
            <p className="mut" style={{ marginTop: 10 }}>{identity.name}, société {identity.legalForm} constituée selon les lois en vigueur au Togo. Siège : {identity.address}. Gérante : {identity.manager}. E-mail : {identity.email}. RCCM : {mark(settings.rccm)}. NIF : {mark(settings.nif)}. Téléphone : {mark(settings.phone)}.</p>
          </div>
          <div>
            <h2>Hébergement</h2>
            <p className="mut" style={{ marginTop: 10 }}>Nom de l’hébergeur, adresse et contact : <span className="todo">à compléter</span> au moment de la mise en ligne (site et API).</p>
          </div>
          <div id="confidentialite">
            <h2>Protection des données</h2>
            <p className="mut" style={{ marginTop: 10 }}>Les formulaires recueillent le nom, l’entreprise, le téléphone, parfois l’e-mail, le secteur, la ville et le message, uniquement pour répondre à une demande de diagnostic ou de contact. Responsable du traitement : {identity.name}. Durée de conservation : <span className="todo">à compléter</span>.</p>
          </div>
          <div>
            <h2>Formulaires et consentement</h2>
            <p className="mut" style={{ marginTop: 10 }}>Aucune demande n’est enregistrée sans la case de consentement. Vous pouvez écrire à {identity.email} pour accéder à vos informations, les faire corriger ou demander leur suppression.</p>
          </div>
          <div>
            <h2>Cookies et statistiques</h2>
            <p className="mut" style={{ marginTop: 10 }}>Le site compte les pages visitées pour comprendre ce qui est lu. Aucun bandeau publicitaire. Outil de mesure externe : <span className="todo">à compléter</span>.</p>
          </div>
          <div>
            <h2>Vos droits</h2>
            <p className="mut" style={{ marginTop: 10 }}>Pour exercer vos droits, écrivez à {identity.email} en précisant votre nom et le formulaire concerné. Langue du site : français. L’anglais est prévu plus tard, la structure des textes est déjà séparée du code.</p>
          </div>
        </div>
      </section>
    </>
  );
}
