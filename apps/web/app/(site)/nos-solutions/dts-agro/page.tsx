import type { Metadata } from "next";
import { AgroPage } from "@/components/solutions";
import { loadSettings } from "@/lib/content";
export const metadata: Metadata = { title: "DTS AGRO", description: "Modules agricoles : AgroID, Collecte, ParcelCheck, Intrants, AgroFactory, HarvestPredict." };
export default async function Page() { return <AgroPage settings={await loadSettings()} />; }
