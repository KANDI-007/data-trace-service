# Démarrage local

1. À la racine du kit : `npm install`
2. `npm run db:setup` crée la base SQLite locale et le compte Gérante.
3. `npm run dev` lance le site sur http://localhost:3000 et l’API sur http://127.0.0.1:4000.

Compte local (fichier `apps/api/.env`, non versionné) : e-mail `datatraceservice@gmail.com`, mot de passe `ChangeMe-DTS-2026`. Sans service d’e-mail, le code à 6 chiffres s’affiche sur l’écran de connexion.

La base de production prévue est TiDB (URL MySQL dans `DATABASE_URL`). En local, SQLite permet de travailler sans compte cloud. Les textes manquants restent « à compléter ».

# Mode d’emploi Gérante

- Connexion : `/admin/connexion`
- Demandes : filtre, note interne, statut, export Excel
- Pages : modifier le titre et les textes, aperçu, publier
- Actualités : brouillon, publication ou date programmée
- Médias : import converti en WebP
- Paramètres : téléphone, WhatsApp, RCCM, NIF, réseaux, délai de réponse

Avant la mise en ligne, compléter la liste du tableau de bord (numéro, réseaux, RCCM, NIF, domaine, hébergeur, Turnstile, Resend ou Brevo, Sentry). Ne pas inventer ces valeurs dans le code.
