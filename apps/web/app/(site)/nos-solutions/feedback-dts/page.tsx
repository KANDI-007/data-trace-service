import type { Metadata } from "next";
import { FeedbackPage } from "@/components/solutions";
import { loadSettings } from "@/lib/content";
export const metadata: Metadata = { title: "FeedBack DTS", description: "Avis clients par code QR : note, satisfaction, NPS et alerte en cas d’avis négatif." };
export default async function Page() { return <FeedbackPage settings={await loadSettings()} />; }
