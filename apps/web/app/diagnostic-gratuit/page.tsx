import type { Metadata, Viewport } from "next";
import { VisitBeacon } from "@/components/beacon";
import { DiagnosticFilm } from "@/components/diagnostic-film";
import { Header } from "@/components/shell";
import { loadSettings } from "@/lib/content";

export const metadata: Metadata = {
  title: "Diagnostic gratuit",
  description: "Faites défiler le diagnostic : l’échange, l’observation, les points sensibles et le compte rendu, avant d’écrire votre demande.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default async function DiagnosticFilmPage() {
  const settings = await loadSettings();
  return (
    <div className="film-shell">
      <Header settings={settings} />
      <DiagnosticFilm />
      <VisitBeacon />
    </div>
  );
}
