# AGENTS.md — Projet site DATA TRACE SERVICE

Lis d'abord PRODUCT.md et DESIGN.md. Références : docs/, maquettes/, prototype/dts.html.

## Pile technique (imposée, pas de WordPress)
Next.js (App Router) + TypeScript + Tailwind (apps/web) · NestJS (apps/api) · Prisma + TiDB · Cloudflare (R2, WAF, Turnstile) · Vercel · Render · Sentry · ExcelJS · e-mails Resend/Brevo. Monorepo : apps/web, apps/api, packages/shared.

## Règles
- Interface en français ; code et commentaires en anglais.
- TypeScript strict, pas de `any`. Validation serveur (class-validator) et client (zod).
- Couleurs et polices uniquement via les variables de DESIGN.md.
- Ne jamais inventer de contenu : utiliser le dossier de présentation ; sinon « à compléter ».
- Images : next/image, WebP, texte alternatif. Poids de page < 1 Mo.
- Aucun secret dans Git. `.env.example` à jour.
- Accessibilité WCAG 2.2 AA, prefers-reduced-motion respecté.
- Un commit par étape, message clair.

## Compétences installées (.cursor/skills)
- ui-ux-pro-max : `python3 .cursor/skills/ui-ux-pro-max/scripts/search.py "<requête>" --design-system -p "DATA TRACE SERVICE"` ; appliquer ses listes UX. Nos couleurs de marque priment sur celles proposées.
- impeccable : passes `critique`, `polish`, `harden` sur chaque page ; respecter ses anti-modèles.
- taste-skill : éviter l'aspect générique, vrais écrans de produit.
- emil-design-eng : règles de mouvement et de finition.
- playwright-cli : captures, tests de bout en bout, vérification mobile.
- fabric-patterns : prompts de relecture et de synthèse (review_design, summarize, create_user_story…).

## Définition de « terminé » pour une étape
lint + typecheck + tests Playwright verts ; captures 1440 px et 390 px comparées à maquettes/ ; aucun défilement horizontal ; Lighthouse mobile ≥ 90 ; passe impeccable sans anti-modèle ; contenu conforme au dossier.
