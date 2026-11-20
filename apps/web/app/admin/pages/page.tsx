import type { Metadata } from "next";
import { PagesList } from "@/components/admin-pages";
export const metadata: Metadata = { title: "Pages", robots: { index: false } };
export default function Page() { return <PagesList />; }
