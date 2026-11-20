import type { Metadata } from "next";
import { DigitalPage } from "@/components/solutions";
import { loadSettings } from "@/lib/content";
export const metadata: Metadata = { title: "Digitalisation des processus", description: "Ventes, stocks, achats, production et caisse au même endroit, accessibles à distance." };
export default async function Page() { return <DigitalPage settings={await loadSettings()} />; }
