import type { Metadata } from "next";
import { TracePage } from "@/components/solutions";
import { loadSettings } from "@/lib/content";
export const metadata: Metadata = { title: "Traçabilité", description: "Suivez chaque lot de la réception des matières premières à la vente, avec un code QR." };
export default async function Page() { return <TracePage settings={await loadSettings()} />; }
