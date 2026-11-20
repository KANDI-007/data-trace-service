import type { Metadata } from "next";
import { SettingsAdmin } from "@/components/admin-content";
export const metadata: Metadata = { title: "Paramètres", robots: { index: false } };
export default function Page() { return <SettingsAdmin />; }
