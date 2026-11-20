import type { Metadata } from "next";
import { MediaAdmin } from "@/components/admin-content";
export const metadata: Metadata = { title: "Médias", robots: { index: false } };
export default function Page() { return <MediaAdmin />; }
