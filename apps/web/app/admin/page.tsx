import type { Metadata } from "next";
import { Dashboard } from "@/components/admin-dashboard";
export const metadata: Metadata = { title: "Tableau de bord", robots: { index: false } };
export default function Page() { return <Dashboard />; }
