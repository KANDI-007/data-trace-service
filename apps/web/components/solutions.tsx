import Link from "next/link";
import { CheckList, Icon } from "@/components/icon";
import { Crumb, FinalBand } from "@/components/shell";
import { ParcelMap, QrMark } from "@/components/visuals";
import type { Settings } from "@/lib/content";

const catalog = [
  ["Diagnostic gratuit", "/diagnostic-gratuit", "Pour tout responsable qui veut y voir plus clair. Nous analysons votre fonctionnement et vous disons ce qui peut être amélioré par le numérique.", "Vous gagnez une vision claire de vos priorités, sans risque."],
  ["Digitalisation des processus", "/nos-solutions/digitalisation", "Des outils simples qui remplacent les cahiers et réunissent ventes, stocks, achats, production et caisse au même endroit.", "Gain de temps, moins d’erreurs, informations disponibles à distance."],
  ["Traçabilité", "/nos-solutions/tracabilite", "Suivi de chaque lot, de la réception des matières premières à la vente, avec l’historique d’un produit par code QR.", "Qualité maîtrisée, pertes réduites, confiance des clients."],
  ["FeedBack DTS", "/nos-solutions/feedback-dts", "Vos clients scannent un code QR et répondent en moins d’une minute. Note moyenne, satisfaction, NPS et alertes sur votre tableau de bord.", "Connaître ses clients, réagir vite, améliorer son service avec des faits."],
  ["Fiabilité des données", "/nos-solutions/fiabilite-des-donnees", "Contrôle automatique de vos fichiers, rapport Excel des anomalies avec priorités et corrections proposées, puis fichiers propres.", "Des données fiables pour les rapports, les paiements et les audits."],
  ["DTS AGRO", "/nos-solutions/dts-agro", "Plateforme modulaire pour coopératives, exportateurs et transformateurs : AgroID, Collecte, ParcelCheck, Intrants, AgroFactory, HarvestPredict.", "On commence par un module et on ajoute les autres selon le besoin."],
  ["Applications sur mesure", "/nos-solutions/applications-sur-mesure", "Applications web, mobiles et solutions en abonnement (SaaS) pour répondre à un besoin précis de l’entreprise.", "Un outil qui correspond à votre façon de travailler."],
] as const;

export function SolutionsIndex({ settings }: { settings: Settings }) {
  return (
    <>
      <section className="ph2" style={{ paddingBottom: 48 }}>
        <div className="wrap" style={{ gridTemplateColumns: "minmax(0,1fr)" }}>
          <div>
            <Crumb items={["Nos solutions"]} />
            <h1 style={{ maxWidth: 860 }}>Des solutions simples pour piloter votre entreprise.</h1>
            <p className="lead">Chaque solution peut démarrer seule, puis s’ajouter aux autres au rythme de votre activité. Tarifs : {settings.pricing || "sur devis"}.</p>
          </div>
        </div>
      </section>
      <section className="s" style={{ paddingTop: 24 }}>
        <div className="wrap">
          <div className="rows">
            {catalog.map(([title, href, text, gain]) => (
              <div key={href}>
                <h3>{title}</h3>
                <div>
                  <p>{text}</p>
                  <p style={{ marginTop: 10, color: "var(--navy-d)", fontWeight: 500 }}>{gain}</p>
                  <Link className="lnk" href={href} style={{ marginTop: 14 }}>Voir la solution <Icon name="arrow" size={18} /></Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <FinalBand delay={settings.responseDelay} />
    </>
  );
}

function Hero({ crumb, title, lead, visual }: { crumb: string; title: string; lead: string; visual: React.ReactNode }) {
  return (
    <section className="ph2">
      <div className="wrap">
        <div>
          <div className="crumb"><Link href="/">Accueil</Link> / <Link href="/nos-solutions">Nos solutions</Link> / <b>{crumb}</b></div>
          <h1>{title}</h1>
          <p className="lead">{lead}</p>
          <div style={{ marginTop: 30 }}><Link className="btn p l" href="/diagnostic-gratuit">Demander mon diagnostic gratuit</Link></div>
        </div>
        <div>{visual}</div>
      </div>
    </section>
  );
}

export function DigitalPage({ settings }: { settings: Settings }) {
  return (
    <>
      <Hero crumb="Digitalisation" title="Remplacez les cahiers par un outil qui réunit tout." lead="Ventes, stocks, achats, production et caisse sont encore gérés sur papier ou dans des fichiers dispersés ? Nous les rassemblons au même endroit, accessibles à distance." visual={<div className="card" style={{ padding: 22 }}><div className="two"><div><div className="tag a">Avant</div><p className="mut" style={{ marginTop: 12 }}>Cahier, totaux incertains, stock à vérifier.</p></div><div><div className="tag g">Après</div><p style={{ marginTop: 12 }}>Ventes, caisse, achats et stock au même endroit. Exemple de démonstration.</p></div></div></div>} />
      <section className="s"><div className="wrap"><div className="rows">
        <div><h3>Ce que nous mettons en place</h3><CheckList items={["Suivi des ventes et de la caisse, jour après jour", "Gestion des stocks et des achats", "Suivi de la production et des pertes", "Un tableau de bord sur téléphone ou ordinateur"]} /></div>
        <div><h3>Comment ça se passe</h3><p>Nous démarrons petit, par exemple le suivi des ventes et des stocks, puis la solution s’agrandit. Installation, configuration et formation de vos équipes sont comprises dans la proposition.</p></div>
        <div><h3>Ce que vous gagnez</h3><CheckList items={["Du temps : plus de recopie ni de calculs à la main", "Moins d’erreurs et de pertes", "L’information disponible même quand vous n’êtes pas sur place"]} /></div>
      </div></div></section>
      <FinalBand delay={settings.responseDelay} />
    </>
  );
}

export function TracePage({ settings }: { settings: Settings }) {
  const steps = [["Réception", "Matières premières contrôlées"], ["Fabrication", "Lot créé, recette suivie"], ["Stock", "Quantités et dates"], ["Vente", "Client et paiement"]];
  return (
    <>
      <Hero crumb="Traçabilité" title="Sachez d’où vient chaque produit, et où il est allé." lead="Suivi de chaque lot, de la réception des matières premières à la vente, avec l’historique d’un produit grâce à un code QR." visual={<div className="card" style={{ padding: 22, textAlign: "center" }}><p style={{ fontWeight: 600, marginBottom: 12 }}>Lot d’exemple · Jus de bissap</p><QrMark size={140} label="Code QR d’exemple pour l’historique d’un lot" /><p className="mut" style={{ marginTop: 8 }}>Exemple de démonstration</p></div>} />
      <section className="s alt"><div className="wrap"><h2 className="h2">Le parcours d’un lot</h2><div className="lot" style={{ marginTop: 28 }}>{steps.map(([title, text], index) => <div key={title}><span className="nd">{index + 1}</span>{index < 3 ? <i className="ln" /> : null}<div><b>{title}</b><small>{text}</small></div></div>)}</div></div></section>
      <section className="s"><div className="wrap"><div className="rows"><div><h3>Ce que vous gagnez</h3><CheckList items={["Qualité maîtrisée : retrouver l’origine d’un problème en quelques secondes", "Pertes réduites, écarts repérés tôt", "Confiance des clients : l’historique est consultable par QR code", "Vue globale sur les flux et les flux financiers"]} /></div></div></div></section>
      <FinalBand delay={settings.responseDelay} />
    </>
  );
}

export function FeedbackPage({ settings }: { settings: Settings }) {
  return (
    <>
      <Hero crumb="FeedBack DTS" title="Vos clients vous disent ce qu’ils pensent. Vous le savez tout de suite." lead="Le client scanne un code QR, répond à quelques questions en moins d’une minute, et vous voyez les résultats sur votre tableau de bord." visual={<div className="dash"><div className="bar"><span>Exemple de démonstration</span></div><div className="bd"><div className="k4"><div><small>Note moyenne</small><b>4,3</b></div><div><small>Satisfaction</small><b>86 %</b></div><div><small>NPS</small><b>+42</b></div><div><small>Avis négatifs</small><b>3</b></div></div></div></div>} />
      <section className="s alt"><div className="wrap"><h2 className="h2">Comment ça marche</h2><div className="rows"><div><h3>1. Le client scanne</h3><p>Le code QR est posé sur la table, au comptoir ou à l’accueil.</p></div><div><h3>2. Il répond</h3><p>Quelques questions, moins d’une minute, sans créer de compte.</p></div><div><h3>3. Vous agissez</h3><p>Note moyenne, satisfaction, NPS et alerte immédiate sur un avis négatif.</p></div></div><p style={{ marginTop: 28 }}><Link className="btn n l" href="/demo/feedback">Voir la démonstration</Link></p></div></section>
      <section className="s"><div className="wrap"><h2 className="h2">Pour qui ?</h2><div className="chips" style={{ marginTop: 20 }}>{["Restaurants", "Commerces", "Centres de santé", "Écoles et universités", "Événements"].map((item) => <span key={item}>{item}</span>)}</div></div></section>
      <FinalBand delay={settings.responseDelay} />
    </>
  );
}

export function DataPage({ settings }: { settings: Settings }) {
  const rows = [["Doublon", "2 fiches", "Haute", "Fusionner"], ["Téléphone manquant", "Fiche incomplète", "Moyenne", "Compléter"], ["Coordonnées GPS", "Parcelle", "Moyenne", "Revérifier"]];
  return (
    <>
      <Hero crumb="Fiabilité des données" title="Des bases de producteurs ou de clients enfin propres." lead="Doublons, fiches incomplètes, coordonnées erronées : nous contrôlons vos fichiers, vous remettons un rapport Excel des anomalies, puis des fichiers prêts à réutiliser." visual={<div className="dash"><div className="bar"><span>Rapport d’anomalies · exemple</span></div><div className="bd" style={{ padding: 0 }}><table><thead><tr><th>Anomalie</th><th>Fiche</th><th>Priorité</th><th>Piste</th></tr></thead><tbody>{rows.map((row) => <tr key={row[0]}>{row.map((cell) => <td key={cell}>{cell}</td>)}</tr>)}</tbody></table></div></div>} />
      <section className="s"><div className="wrap"><div className="rows"><div><h3>Pour qui</h3><p>Coopératives, exportateurs, programmes et entreprises dont les bases de producteurs ou de clients contiennent des doublons, des fiches incomplètes ou des coordonnées erronées.</p></div><div><h3>Ce que vous gagnez</h3><CheckList items={["Données fiables pour les rapports, les paiements et les audits", "Un rapport Excel facile à partager", "Des fichiers propres, sans changer d’outil"]} /></div></div></div></section>
      <FinalBand delay={settings.responseDelay} />
    </>
  );
}

const modules = [
  ["AgroID", "Identifie chaque producteur de façon unique : carte avec QR code, parcelles, historique, détection des doublons."],
  ["Collecte", "Enregistre chaque livraison et rapproche automatiquement achats, stocks et paiements."],
  ["ParcelCheck", "Contrôle les parcelles : coordonnées GPS suspectes, parcelles qui se chevauchent."],
  ["Intrants", "Suit la distribution des semences et engrais aux producteurs."],
  ["AgroFactory", "Digitalise les unités de transformation et retrace chaque lot jusqu’au produit fini."],
  ["HarvestPredict", "Aide à prévoir les récoltes et à planifier les approvisionnements."],
];

export function AgroPage({ settings }: { settings: Settings }) {
  return (
    <>
      <Hero crumb="DTS AGRO" title="Traçabilité et gestion agricole, module après module." lead="Une plateforme modulaire pour les coopératives, exportateurs et transformateurs. Chaque client commence avec un module et ajoute les autres selon ses besoins." visual={<div className="card" style={{ padding: 18 }}><ParcelMap /><p className="mut" style={{ marginTop: 8 }}>ParcelCheck · exemple de démonstration</p></div>} />
      <section className="s alt"><div className="wrap"><h2 className="h2">Six modules, à la carte</h2><p className="sub">Offre en cours de déploiement : <span className="todo">{settings.agroModules || "modules disponibles à confirmer par la Gérante"}</span></p><div className="rows" style={{ marginTop: 24 }}>{modules.map(([title, text]) => <div key={title}><h3>{title}</h3><p>{text}</p></div>)}</div></div></section>
      <FinalBand delay={settings.responseDelay} />
    </>
  );
}

export function CustomPage({ settings }: { settings: Settings }) {
  const steps = [["Besoin", "Échange et cadrage"], ["Maquettes", "Validation avant de coder"], ["Développement", "Livraisons régulières"], ["Mise en ligne", "Formation et suivi"]];
  return (
    <>
      <Hero crumb="Sur mesure" title="Un besoin précis ? Nous construisons l’outil qui lui correspond." lead="Conception d’applications web, mobiles et de solutions en abonnement (SaaS) pour répondre à un besoin précis de votre entreprise." visual={<div className="card" style={{ padding: 22 }}><p>Application web, application mobile (Android et iPhone) et solution en abonnement. Exemple de démonstration, chiffres non contractuels.</p></div>} />
      <section className="s"><div className="wrap"><h2 className="h2">Comment nous travaillons</h2><div className="lot" style={{ marginTop: 28 }}>{steps.map(([title, text], index) => <div key={title}><span className="nd">{index + 1}</span>{index < 3 ? <i className="ln" /> : null}<div><b>{title}</b><small>{text}</small></div></div>)}</div></div></section>
      <FinalBand delay={settings.responseDelay} />
    </>
  );
}
