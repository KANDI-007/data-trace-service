import { KNOWN_IDENTITY, PLACEHOLDER, SECTOR_LABELS, SECTORS } from "@dts/shared";

export const identity = KNOWN_IDENTITY;
export const placeholder = PLACEHOLDER;
export const sectors = SECTORS.map((id) => ({ id, label: SECTOR_LABELS[id] }));

export type Settings = Record<string, string>;

export const fallbackSettings: Settings = {
  phone: placeholder,
  whatsapp: placeholder,
  email: identity.email,
  address: identity.address,
  hours: placeholder,
  responseDelay: placeholder,
  facebook: placeholder,
  instagram: placeholder,
  linkedin: placeholder,
  tiktok: placeholder,
  rccm: placeholder,
  nif: placeholder,
  area: identity.area,
  pricing: "sur devis",
  locale: "fr",
  domain: placeholder,
  agroModules: "à confirmer",
  testimonials: placeholder,
};

export function readableDelay(value: string | undefined): string {
  if (!value || value.trim().toLowerCase() === placeholder) return "à compléter";
  return value;
}

export function waLink(number: string | undefined, text: string): string | null {
  const digits = (number ?? "").replace(/\D/g, "");
  if (digits.length < 8) return null;
  return `https://wa.me/${digits}?text=${encodeURIComponent(text)}`;
}

export interface ArticleCard {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  image: string | null;
  publishedAt: string | null;
  seoTitle?: string | null;
  body?: string;
}

export const fallbackArticles: ArticleCard[] = [
  {
    slug: "participation-foire-togo-2000",
    title: "Participation à la Foire Togo 2000",
    excerpt: "DATA TRACE SERVICE était présente à la Foire Togo 2000. Le compte rendu détaillé est à compléter.",
    category: "evenement",
    image: "/media/market.jpg",
    publishedAt: null,
    body: "DATA TRACE SERVICE a participé à la Foire Togo 2000.\n\nLe récit du stand, les photos et les échanges avec les chefs d’entreprise sont à compléter par la Gérante.",
  },
];

export const categoryLabels: Record<string, string> = {
  actualite: "Actualités",
  conseil: "Conseils",
  evenement: "Événements",
};

async function fetchApi<T>(path: string): Promise<T | null> {
  const base = process.env.API_URL?.trim();
  if (!base) return null;
  try {
    const response = await fetch(`${base.replace(/\/$/, "")}${path}`, {
      cache: "no-store",
      signal: AbortSignal.timeout(1500),
    });
    if (!response.ok) return null;
    return (await response.json()) as T;
  } catch {
    return null;
  }
}

export async function loadSettings(): Promise<Settings> {
  const data = await fetchApi<Settings>("/settings");
  return data ? { ...fallbackSettings, ...data } : fallbackSettings;
}

export async function loadArticles(): Promise<ArticleCard[]> {
  const data = await fetchApi<ArticleCard[]>("/articles");
  return data && data.length > 0 ? data : fallbackArticles;
}

export async function loadArticle(slug: string): Promise<ArticleCard | null> {
  const data = await fetchApi<ArticleCard & { error?: string }>(`/articles/${slug}`);
  if (!data || data.error) return fallbackArticles.find((item) => item.slug === slug) ?? null;
  return data;
}

export interface PageBlock {
  key: string;
  label: string;
  value: string;
}

export async function loadPage(slug: string): Promise<{ title: string; blocks: PageBlock[] } | null> {
  const data = await fetchApi<{ title?: string; blocks?: PageBlock[]; error?: string }>(`/pages/${slug}`);
  if (!data || data.error || !data.title || !data.blocks) return null;
  return { title: data.title, blocks: data.blocks };
}

export function block(page: { blocks: PageBlock[] } | null, key: string, fallback: string): string {
  return page?.blocks.find((item) => item.key === key)?.value || fallback;
}
