import type { Metadata } from "next";
import { SolutionsIndex } from "@/components/solutions";
import { loadSettings } from "@/lib/content";

export const metadata: Metadata = { title: "Nos solutions", description: "Diagnostic, digitalisation, traçabilité, FeedBack DTS, fiabilité des données, DTS AGRO et applications sur mesure." };

export default async function Page() {
  return <SolutionsIndex settings={await loadSettings()} />;
}
