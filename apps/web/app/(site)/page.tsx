import type { Metadata } from "next";
import { HomePage } from "@/components/home-page";
import { FinalBand } from "@/components/shell";
import { loadPage, loadSettings } from "@/lib/content";

export const metadata: Metadata = {
  title: "Gérez votre entreprise à distance",
  description: "Diagnostic gratuit, puis une solution de digitalisation simple pour piloter ventes, stocks et clients depuis votre téléphone. Lomé, Togo.",
};

export default async function Page() {
  const [page, settings] = await Promise.all([loadPage("accueil"), loadSettings()]);
  return (
    <>
      <HomePage page={page} />
      <FinalBand delay={settings.responseDelay} />
    </>
  );
}
