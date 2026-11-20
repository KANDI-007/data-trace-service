import type { Metadata } from "next";
import { DataPage } from "@/components/solutions";
import { loadSettings } from "@/lib/content";
export const metadata: Metadata = { title: "Fiabilité des données", description: "Contrôle des fichiers, rapport d’anomalies et bases de producteurs ou de clients nettoyées." };
export default async function Page() { return <DataPage settings={await loadSettings()} />; }
