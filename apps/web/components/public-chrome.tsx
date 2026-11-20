import { VisitBeacon } from "@/components/beacon";
import { Footer, Header, WhatsApp } from "@/components/shell";
import { loadSettings } from "@/lib/content";

export async function PublicChrome({ children }: { children: React.ReactNode }) {
  const settings = await loadSettings();
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: "DATA TRACE SERVICE",
    email: settings.email,
    address: { "@type": "PostalAddress", streetAddress: "Bè Kpota", addressLocality: "Lomé", addressCountry: "TG" },
    description: "Traçabilité, organisation et digitalisation des entreprises au Togo.",
  };
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Header settings={settings} />
      <main>{children}</main>
      <Footer settings={settings} />
      <WhatsApp settings={settings} />
      <VisitBeacon />
    </>
  );
}
