import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const settings: Record<string, string> = {
  phone: "à compléter",
  whatsapp: "à compléter",
  email: "datatraceservice@gmail.com",
  address: "Bè Kpota, Lomé, Togo",
  hours: "à compléter",
  responseDelay: "à compléter",
  facebook: "à compléter",
  instagram: "à compléter",
  linkedin: "à compléter",
  tiktok: "à compléter",
  rccm: "à compléter",
  nif: "à compléter",
  area: "Lomé et l'ensemble du Togo",
  pricing: "sur devis",
  locale: "fr",
  domain: "à compléter",
  agroModules: "à confirmer",
  testimonials: "à compléter",
};

const pages = [
  {
    slug: "accueil",
    title: "Gérez votre entreprise à distance, simplement.",
    blocks: [
      { key: "lead", label: "Sous-titre", value: "Nous commençons par un diagnostic gratuit, puis nous vous proposons une solution de digitalisation simple, adaptée à votre activité." },
      { key: "cta", label: "Bouton principal", value: "Demander mon diagnostic gratuit" },
    ],
  },
  {
    slug: "qui-sommes-nous",
    title: "Le numérique doit être simple, utile et accessible à tous les chefs d’entreprise.",
    blocks: [
      { key: "lead", label: "Introduction", value: "DATA TRACE SERVICE est une entreprise togolaise spécialisée dans la traçabilité, l’organisation et la digitalisation." },
      { key: "manager", label: "Présentation de la Gérante", value: "à compléter" },
    ],
  },
];

async function main(): Promise<void> {
  const email = (process.env.SEED_ADMIN_EMAIL ?? "datatraceservice@gmail.com").toLowerCase();
  const password = process.env.SEED_ADMIN_PASSWORD ?? "ChangeMe-DTS-2026";
  const name = process.env.SEED_ADMIN_NAME ?? "TINDJO N'tchièbini";
  const passwordHash = await bcrypt.hash(password, 10);
  await prisma.adminUser.upsert({
    where: { email },
    update: { passwordHash, name },
    create: { email, name, passwordHash },
  });

  for (const [key, value] of Object.entries(settings)) {
    await prisma.setting.upsert({ where: { key }, update: {}, create: { key, value } });
  }

  for (const page of pages) {
    const blocks = JSON.stringify(page.blocks);
    await prisma.page.upsert({
      where: { slug: page.slug },
      update: {},
      create: { slug: page.slug, title: page.title, blocks, status: "published" },
    });
  }

  await prisma.article.upsert({
    where: { slug: "participation-foire-togo-2000" },
    update: {},
    create: {
      slug: "participation-foire-togo-2000",
      title: "Participation à la Foire Togo 2000",
      excerpt: "DATA TRACE SERVICE était présente à la Foire Togo 2000. Le compte rendu détaillé est à compléter.",
      body: "DATA TRACE SERVICE a participé à la Foire Togo 2000.\n\nLe récit du stand, les photos et les échanges avec les chefs d’entreprise sont à compléter par la Gérante.",
      category: "evenement",
      image: "/media/market.jpg",
      seoTitle: "Foire Togo 2000 — DATA TRACE SERVICE",
      status: "published",
      publishedAt: null,
    },
  });

  const existing = await prisma.diagnosticRequest.findFirst({ where: { company: "Exemple (jeu de données)" } });
  if (!existing) {
    await prisma.diagnosticRequest.create({
      data: {
        fullName: "Demande d’essai",
        company: "Exemple (jeu de données)",
        phone: "00000000",
        sector: "commerce",
        city: "Lomé",
        concern: "Jeu de données local, à supprimer.",
        consent: true,
        source: "page",
        events: { create: { action: "créée", detail: "Jeu de données" } },
      },
    });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error: unknown) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
