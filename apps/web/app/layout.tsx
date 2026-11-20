import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  title: { default: "DATA TRACE SERVICE", template: "%s · DATA TRACE SERVICE" },
  description: "Diagnostic gratuit, solution simple de digitalisation et gestion à distance pour les entreprises togolaises. Traçabilité, organisation, qualité.",
  keywords: ["traçabilité Togo", "digitalisation entreprise Lomé", "avis clients QR code", "logiciel de gestion entreprise Togo", "gestion à distance"],
  openGraph: {
    title: "DATA TRACE SERVICE",
    description: "Gérez votre entreprise à distance, simplement. Diagnostic gratuit à Lomé et au Togo.",
    locale: "fr_TG",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}
