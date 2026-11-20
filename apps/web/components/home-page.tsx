import Image from "next/image";
import Link from "next/link";
import { HeroCopy, PhoneStatus } from "@/components/hero-motion";
import { Icon } from "@/components/icon";
import { MethodFlight } from "@/components/method-flight";
import { ProblemFlight } from "@/components/problem-flight";
import { SolutionRail } from "@/components/solution-rail";
import { ParcelMap } from "@/components/visuals";
import { block, type PageBlock } from "@/lib/content";

const why = [
  ["Diagnostic gratuit", "Vous ne prenez aucun risque pour commencer."],
  ["Solutions simples", "Vous n’avez pas besoin d’être informaticien."],
  ["Gestion à distance", "Vous gardez le contrôle même quand vous n’êtes pas sur place."],
  ["Vue globale", "Production, ventes, stocks, flux financiers et clients au même endroit."],
  ["Pensé pour le terrain", "Des outils qui fonctionnent avec une connexion faible et des équipes peu à l’aise avec l’informatique."],
  ["Accompagnement", "Installation, formation et suivi, pas seulement un logiciel."],
  ["Évolutif", "On commence par un besoin, on ajoute le reste plus tard."],
  ["Données fiables et tracées", "Vous décidez avec des chiffres exacts."],
] as const;

export function HomePage({ page }: { page: { title: string; blocks: PageBlock[] } | null }) {
  const title = page?.title ?? "Gérez votre entreprise à distance, simplement.";
  const lead = block(page, "lead", "Nous commençons par un diagnostic gratuit, puis nous vous proposons une solution de digitalisation simple, adaptée à votre activité.");
  return (
    <>
      <section className="hero">
        <div className="wrap">
          <div>
            <HeroCopy title={title} lead={lead} />
            <div className="cta">
              <Link className="btn p l" href="/diagnostic-gratuit">Demander mon diagnostic gratuit</Link>
              <Link className="btn o l" href="/nos-solutions">Découvrir nos solutions</Link>
            </div>
            <div className="assure">
              <span><Icon name="check" size={18} /> Gratuit et sans engagement</span>
              <span><Icon name="check" size={18} /> Prix annoncés avant de commencer</span>
              <span><Icon name="check" size={18} /> Équipe locale à Lomé</span>
            </div>
          </div>
          <div className="stage">
            <div className="ph">
              <Image src="/media/couple.jpg" alt="Deux personnes consultent une tablette" fill style={{ objectFit: "cover", objectPosition: "50% 8%" }} sizes="(max-width: 820px) 100vw, 50vw" priority />
            </div>
            <div className="iphone" aria-hidden="true">
              <i className="iphone-key action" />
              <i className="iphone-key vol" />
              <i className="iphone-key power" />
              <i className="iphone-key shutter" />
              <div className="iphone-body">
                <div className="iphone-glass">
                  <span className="island"><i /></span>
                  <PhoneStatus />
                  <div className="fin">
                    <h2>Ventes</h2>
                    <b className="sum">184 500 F</b>
                    <svg className="chart" viewBox="0 0 160 64" aria-hidden="true">
                      <defs>
                        <linearGradient id="dts-phone-area" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#19C3B1" stopOpacity="0.5" />
                          <stop offset="100%" stopColor="#19C3B1" stopOpacity="0" />
                        </linearGradient>
                      </defs>
                      <path className="grid" d="M2 20 H158 M2 40 H158" />
                      <path className="area" d="M2 48 C 22 44, 34 30, 52 28 S 84 14, 104 18 S 132 8, 158 5 V 62 H 2 Z" />
                      <path className="glow" d="M2 48 C 22 44, 34 30, 52 28 S 84 14, 104 18 S 132 8, 158 5" />
                      <path className="line" d="M2 48 C 22 44, 34 30, 52 28 S 84 14, 104 18 S 132 8, 158 5" />
                      <circle className="dot" r="3.2" />
                    </svg>
                    <div className="kpi">
                      <div><small>Encaissé</small><b>152 000 F</b></div>
                      <div><small>Stock</small><b>42 réf.</b></div>
                      <div><small>Avis</small><b>4,3 / 5</b></div>
                    </div>
                    <div className="alrt a"><Icon name="alert" size={14} /><span>Stock bas : sucre (8 kg)</span></div>
                  </div>
                </div>
              </div>
            </div>
            <div className="inbox">
              <div className="inbox-mail"><Icon name="mail" size={26} /></div>
              <div className="inbox-card"><i><Icon name="bell" size={18} /></i><span>Un problème survient ? Vous êtes prévenu sur votre téléphone.</span></div>
            </div>
          </div>
        </div>
      </section>
      <ProblemFlight />
      <MethodFlight />
      <SolutionRail />
      <section className="s alt">
        <div className="wrap">
          <div className="sec-h"><h2 className="h2">Pourquoi choisir DATA TRACE SERVICE</h2></div>
          <div className="why">
            {why.map(([title, text]) => (
              <div key={title}><Icon name="shield" size={28} /><div style={{ padding: 0, border: 0 }}><h3 style={{ fontSize: 18 }}>{title}</h3><p>{text}</p></div></div>
            ))}
          </div>
        </div>
      </section>
      <section className="s">
        <div className="wrap">
          <div className="sec-h"><h2 className="h2">Des secteurs où la traçabilité change tout</h2><Link className="lnk" href="/secteurs">Tous les secteurs <Icon name="arrow" size={18} /></Link></div>
          <div className="mos">
            <Link className="tile t5 wide" href="/secteurs"><Image src="/media/chef.jpg" alt="" fill style={{ objectFit: "cover" }} sizes="40vw" /><div><h3>Restauration et commerce</h3><p>Ventes, stocks, avis par QR code, flux du jour</p></div></Link>
            <Link className="tile t4" href="/secteurs"><Image src="/media/tech.jpg" alt="" fill style={{ objectFit: "cover" }} sizes="30vw" /><div><h3>Production et agroalimentaire</h3><p>Lots, matières premières, pertes</p></div></Link>
            <Link className="tile t3 map" href="/secteurs" style={{ padding: 0 }}><div style={{ width: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between" }}><div style={{ padding: "16px 18px 0" }}><ParcelMap /></div><div style={{ padding: "0 20px 18px" }}><h3>Agriculture</h3><p>Producteurs, collecte, parcelles</p></div></div></Link>
            <Link className="tile t4" href="/secteurs"><Image src="/media/spray.jpg" alt="" fill style={{ objectFit: "cover" }} sizes="30vw" /><div><h3>Santé</h3><p>Avis anonymes des patients, qualité de l’accueil</p></div></Link>
            <Link className="tile t4" href="/secteurs"><Image src="/media/pw-form.jpg" alt="" fill style={{ objectFit: "cover" }} sizes="30vw" /><div><h3>Éducation</h3><p>Avis des étudiants et des parents</p></div></Link>
            <Link className="tile t4" href="/secteurs"><Image src="/media/speaker.jpg" alt="" fill style={{ objectFit: "cover" }} sizes="30vw" /><div><h3>Événements</h3><p>Avis des participants, rapport final</p></div></Link>
          </div>
        </div>
      </section>
    </>
  );
}
