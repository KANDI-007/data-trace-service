import { z } from "zod";

export const SECTORS = [
  "restauration",
  "commerce",
  "production",
  "agriculture",
  "sante",
  "education",
  "evenement",
  "autre",
] as const;

export type Sector = (typeof SECTORS)[number];

export const SECTOR_LABELS: Record<Sector, string> = {
  restauration: "Restauration",
  commerce: "Commerce",
  production: "Production et agroalimentaire",
  agriculture: "Agriculture",
  sante: "Santé",
  education: "Éducation",
  evenement: "Événement",
  autre: "Autre",
};

export const REQUEST_STATUSES = ["nouveau", "en_cours", "rappel", "gagne", "sans_suite"] as const;
export type RequestStatus = (typeof REQUEST_STATUSES)[number];

export const STATUS_LABELS: Record<RequestStatus, string> = {
  nouveau: "Nouvelle",
  en_cours: "En cours",
  rappel: "À rappeler",
  gagne: "Aboutie",
  sans_suite: "Sans suite",
};

const optionalEmail = z
  .string()
  .trim()
  .refine((value) => value === "" || z.string().email().safeParse(value).success, {
    message: "Adresse e-mail invalide.",
  });

export const diagnosticSchema = z.object({
  fullName: z.string().trim().min(2, "Indiquez votre nom et prénoms."),
  company: z.string().trim().min(2, "Indiquez le nom de votre entreprise."),
  phone: z.string().trim().min(8, "Numéro trop court."),
  email: optionalEmail.optional(),
  sector: z.enum(SECTORS, { errorMap: () => ({ message: "Choisissez un secteur." }) }),
  city: z.string().trim().min(2, "Indiquez votre ville."),
  concern: z.string().trim().max(2000).optional(),
  consent: z.literal(true, {
    errorMap: () => ({ message: "Le consentement est nécessaire pour vous répondre." }),
  }),
  source: z.enum(["page", "accueil"]).optional(),
  turnstileToken: z.string().optional(),
});

export const contactSchema = z.object({
  fullName: z.string().trim().min(2, "Indiquez votre nom et prénoms."),
  phone: z.string().trim().min(8, "Numéro trop court."),
  email: optionalEmail.optional(),
  message: z.string().trim().min(10, "Écrivez un message un peu plus précis."),
  consent: z.literal(true, {
    errorMap: () => ({ message: "Le consentement est nécessaire pour vous répondre." }),
  }),
  turnstileToken: z.string().optional(),
});

export const feedbackSchema = z.object({
  rating: z.number().int().min(1).max(5),
  speed: z.enum(["rapide", "correcte", "lente"]),
  nps: z.number().int().min(0).max(10),
  comment: z.string().trim().max(1000).optional(),
});

export type DiagnosticInput = z.infer<typeof diagnosticSchema>;
export type ContactInput = z.infer<typeof contactSchema>;
export type FeedbackInput = z.infer<typeof feedbackSchema>;

export const PLACEHOLDER = "à compléter";

export const KNOWN_IDENTITY = {
  name: "DATA TRACE SERVICE",
  legalForm: "SARL U",
  manager: "TINDJO N'tchièbini",
  slogan: "Traçabilité · Organisation · Qualité",
  email: "datatraceservice@gmail.com",
  address: "Bè Kpota, Lomé, Togo",
  area: "Lomé et l'ensemble du Togo",
} as const;
