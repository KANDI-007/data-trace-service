import type { Metadata } from "next";
import { ArticlesAdmin } from "@/components/admin-content";
export const metadata: Metadata = { title: "Actualités", robots: { index: false } };
export default function Page() { return <ArticlesAdmin />; }
