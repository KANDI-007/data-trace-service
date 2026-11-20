import type { Metadata } from "next";
import { RequestsBoard } from "@/components/admin-requests";
export const metadata: Metadata = { title: "Demandes", robots: { index: false } };
export default async function Page({ searchParams }: { searchParams: Promise<{ id?: string }> }) {
  const { id } = await searchParams;
  return <RequestsBoard initialId={id} />;
}
