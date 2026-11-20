import type { Metadata } from "next";
import { LoginForm } from "@/components/admin-ui";

export const metadata: Metadata = { title: "Connexion", robots: { index: false, follow: false } };

export default function Page() {
  return <LoginForm />;
}
