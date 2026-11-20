"use client";

import { ScrollFilm } from "@/components/scroll-film";

const accent = "#0A7C75";
const navy = "#1F3A5F";

const config = {
  brand: { name: "DATA TRACE SERVICE", href: "/" },
  cta: { label: "Écrire ma demande", href: "/diagnostic-gratuit/demande" },
  hint: "Défiler pour avancer",
  nav: false,
  diveScroll: 1.4,
  connScroll: 0.9,
  sections: [
    {
      id: "entrer",
      label: "Entrer",
      still: "/monde/stills/01-accueil.webp",
      clip: "/monde/vid/01-accueil.mp4",
      accent,
      scroll: 1.7,
      linger: 0.4,
      eyebrow: "Diagnostic gratuit",
      title: "Avant toute proposition.",
      body: "Avant de vous proposer quoi que ce soit, nous venons comprendre votre entreprise. Le diagnostic est gratuit et sans engagement.",
      tags: ["Gratuit", "Sans engagement"],
    },
    {
      id: "echange",
      label: "Échange",
      still: "/monde/stills/02-diagnostic.webp",
      clip: "/monde/vid/02-diagnostic.mp4",
      accent: navy,
      scroll: 1.35,
      linger: 0.32,
      eyebrow: "Étape 1",
      title: "L’échange.",
      body: "Échange avec le responsable pour comprendre son activité et ses difficultés.",
      tags: ["Votre activité"],
    },
    {
      id: "observation",
      label: "Observation",
      still: "/monde/stills/03-solution.webp",
      clip: "/monde/vid/03-solution.mp4",
      accent,
      scroll: 1.3,
      linger: 0.28,
      eyebrow: "Étape 2",
      title: "L’observation.",
      body: "Observation de la façon dont vous gérez ventes, stocks, production, clients et flux financiers.",
      tags: ["Ventes, stocks, clients"],
    },
    {
      id: "points",
      label: "Points sensibles",
      still: "/monde/stills/04-tracabilite.webp",
      clip: "/monde/vid/04-tracabilite.mp4",
      accent: navy,
      scroll: 1.35,
      linger: 0.3,
      eyebrow: "Étape 3",
      title: "Les points sensibles.",
      body: "Identification des pertes de temps, des risques d’erreur et des informations qui vous manquent.",
      tags: ["Pertes de temps", "Risques d’erreur"],
    },
    {
      id: "compte-rendu",
      label: "Compte rendu",
      still: "/monde/stills/05-pilotage.webp",
      clip: "/monde/vid/05-pilotage.mp4",
      accent,
      scroll: 1.35,
      linger: 0.3,
      eyebrow: "Étape 4",
      title: "Le compte rendu.",
      body: "Remise d’un court compte rendu avec les points à améliorer en priorité.",
      tags: ["Les priorités"],
    },
    {
      id: "commencer",
      label: "Commencer",
      still: "/monde/stills/06-diagnostic-gratuit.webp",
      clip: "/monde/vid/06-diagnostic-gratuit.mp4",
      accent,
      scroll: 1.85,
      linger: 0.5,
      eyebrow: "Étape 5",
      title: "Commencer.",
      body: "Sans engagement. Pour lancer le diagnostic, écrivez-nous.",
      tags: ["Moins d’une minute"],
      cta: {
        primary: { label: "Écrire ma demande", href: "/diagnostic-gratuit/demande" },
        secondary: { label: "Retour à l’accueil", href: "/" },
      },
    },
  ],
  connectors: [
    "/monde/vid/01-02.mp4",
    "/monde/vid/02-03.mp4",
    "/monde/vid/03-04.mp4",
    "/monde/vid/04-05.mp4",
    "/monde/vid/05-06.mp4",
  ],
};

export function DiagnosticFilm() {
  return <ScrollFilm config={config} />;
}
