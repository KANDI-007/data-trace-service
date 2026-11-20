import type { MetadataRoute } from "next";

const routes = [
  "",
  "/qui-sommes-nous",
  "/diagnostic-gratuit",
  "/diagnostic-gratuit/demande",
  "/nos-solutions",
  "/nos-solutions/digitalisation",
  "/nos-solutions/tracabilite",
  "/nos-solutions/feedback-dts",
  "/nos-solutions/fiabilite-des-donnees",
  "/nos-solutions/dts-agro",
  "/nos-solutions/applications-sur-mesure",
  "/secteurs",
  "/actualites",
  "/contact",
  "/mentions-legales",
  "/demo/feedback",
  "/monde",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  return routes.map((route) => ({ url: `${base}${route || "/"}`, changeFrequency: "weekly", priority: route === "" ? 1 : 0.7 }));
}
