import type { Metadata } from "next";
import { CustomPage } from "@/components/solutions";
import { loadSettings } from "@/lib/content";
export const metadata: Metadata = { title: "Applications sur mesure", description: "Applications web, mobiles et solutions en abonnement adaptées à un besoin précis." };
export default async function Page() { return <CustomPage settings={await loadSettings()} />; }
