import type { Metadata } from "next";
import { PageEditor } from "@/components/admin-pages";
export const metadata: Metadata = { title: "Éditer une page", robots: { index: false } };
export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <PageEditor slug={slug} />;
}
