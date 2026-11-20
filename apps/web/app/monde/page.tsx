import type { Metadata, Viewport } from "next";
import { MondeWorld } from "@/components/monde-world";

export const metadata: Metadata = {
  title: "Le monde",
  description: "Faites défiler pour traverser l’atelier, le diagnostic, la solution, la traçabilité et le pilotage à distance.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function MondePage() {
  return <MondeWorld />;
}
