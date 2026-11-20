"use client";

import { ScrollFilm } from "@/components/scroll-film";

const accent = "#0A7C75";
const navy = "#1F3A5F";

const config = {
  brand: { name: "DATA TRACE SERVICE", href: "/" },
  cta: { label: "Diagnostic gratuit", href: "/diagnostic-gratuit" },
  hint: "Défiler pour entrer",
  nav: false,
  diveScroll: 1.35,
  connScroll: 0.85,
  sections: [
    {
      id: "accueil",
      label: "Atelier",
      still: "/monde/stills/01-accueil.webp",
      clip: "/monde/vid/01-accueil.mp4",
      accent,
      scroll: 1.65,
      linger: 0.42,
      eyebrow: "Traçabilité · Organisation · Qualité",
      title: "Gérez votre entreprise à distance, simplement.",
      body: "Nous commençons par un diagnostic gratuit, puis une solution de digitalisation simple, adaptée à votre activité.",
      tags: ["Équipe locale à Lomé", "Sans engagement"],
    },
    {
      id: "diagnostic",
      label: "Diagnostic",
      still: "/monde/stills/02-diagnostic.webp",
      clip: "/monde/vid/02-diagnostic.mp4",
      accent: navy,
      scroll: 1.35,
      linger: 0.32,
      eyebrow: "Première étape",
      title: "Un diagnostic gratuit.",
      body: "Nous regardons comment vous travaillez aujourd’hui, et ce qui peut être amélioré.",
      tags: ["Gratuit", "Sans engagement"],
    },
    {
      id: "solution",
      label: "Solution",
      still: "/monde/stills/03-solution.webp",
      clip: "/monde/vid/03-solution.mp4",
      accent,
      scroll: 1.3,
      linger: 0.28,
      eyebrow: "Deuxième étape",
      title: "Une solution simple.",
      body: "Une digitalisation adaptée à votre activité, sans logiciel compliqué.",
      tags: ["Adaptée à votre activité"],
    },
    {
      id: "tracabilite",
      label: "Traçabilité",
      still: "/monde/stills/04-tracabilite.webp",
      clip: "/monde/vid/04-tracabilite.mp4",
      accent: navy,
      scroll: 1.4,
      linger: 0.34,
      eyebrow: "De la réception à la vente",
      title: "L’historique d’un produit.",
      body: "Retrouvez le parcours d’un produit avec un code QR, de la réception des matières premières jusqu’à la vente.",
      tags: ["Code QR"],
    },
    {
      id: "pilotage",
      label: "Pilotage",
      still: "/monde/stills/05-pilotage.webp",
      clip: "/monde/vid/05-pilotage.mp4",
      accent,
      scroll: 1.35,
      linger: 0.3,
      eyebrow: "Troisième étape",
      title: "Gardez le contrôle, même à distance.",
      body: "Production, stocks, ventes et clients restent visibles quand vous n’êtes pas sur place.",
      tags: ["Gestion à distance"],
    },
    {
      id: "commencer",
      label: "Commencer",
      still: "/monde/stills/06-diagnostic-gratuit.webp",
      clip: "/monde/vid/06-diagnostic-gratuit.mp4",
      accent,
      scroll: 1.75,
      linger: 0.48,
      eyebrow: "À Lomé et au Togo",
      title: "Commencez par le diagnostic.",
      body: "Dites-nous votre activité. Nous vous disons ce qui peut être amélioré.",
      tags: ["Prix annoncés avant de commencer"],
      cta: {
        primary: { label: "Demander mon diagnostic gratuit", href: "/diagnostic-gratuit" },
        secondary: { label: "Voir le site", href: "/" },
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

export function MondeWorld() {
  return <ScrollFilm config={config} />;
}
