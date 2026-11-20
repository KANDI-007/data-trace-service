import type { Metadata } from "next";
import { DiagnosticRequest } from "@/components/diagnostic-request";
import { PublicChrome } from "@/components/public-chrome";
import { loadSettings, readableDelay, waLink } from "@/lib/content";

export const metadata: Metadata = {
  title: "Écrire ma demande",
  description: "Écrivez votre demande de diagnostic gratuit. Moins d’une minute, sans engagement.",
};

export default async function DiagnosticRequestPage() {
  const settings = await loadSettings();
  const whatsapp = waLink(settings.whatsapp, "Bonjour, je souhaite un diagnostic gratuit.");
  return (
    <PublicChrome>
      <DiagnosticRequest delay={readableDelay(settings.responseDelay)} whatsapp={whatsapp} />
    </PublicChrome>
  );
}
