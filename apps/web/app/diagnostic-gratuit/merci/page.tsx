import type { Metadata } from "next";
import { PublicChrome } from "@/components/public-chrome";
import { ThanksCard } from "@/components/thanks-card";

export const metadata: Metadata = {
  title: "Demande reçue",
  description: "Votre demande de diagnostic gratuit est enregistrée.",
};

export default function ThanksPage() {
  return (
    <PublicChrome>
      <ThanksCard />
    </PublicChrome>
  );
}
