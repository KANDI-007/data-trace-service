# DESIGN.md — DATA TRACE SERVICE

Format inspiré de awesome-design-md. Référence visuelle : `maquettes/` et `prototype/dts.html`.

## Atmosphère
Sobre, précis, rassurant. Un cabinet de confiance qui rend la gestion simple. Beaucoup d'air, marine profond, un seul accent turquoise, vrais écrans de produit et vraies photos.

## Couleurs (variables CSS / Tailwind)
| Rôle | Valeur |
|---|---|
| --navy (principal) | #1F3A5F |
| --ink (texte) | #12253D |
| --canvas (fond) | #F4F7FA |
| --white | #FFFFFF |
| --accent (fonds, boutons, repères) | #19C3B1 |
| --accent-text (texte turquoise) | #0A7C75 |
| --whatsapp | #0F7A40 |
| --line | #D9E1EA |
Règle : le turquoise sert aux actions et repères, jamais en grandes surfaces. Texte sur fond turquoise : encre #12253D.

## Typographie
Poppins (400, 500, 600, 700), auto-hébergée (woff2), font-display: swap. Titres 600/700, interligne 1.15. Corps 16–18 px, interligne 1.6. Minimum 11 px.

## Composants
Boutons : primaire turquoise/encre, secondaire contour marine, WhatsApp vert. Hauteur 48 px, rayon 12 px, focus visible 3 px. Champs : étiquette au-dessus, erreur en clair sous le champ. Cartes : fond blanc, bordure --line, rayon 16 px, sans ombre lourde.

## Mise en page
Mobile d'abord (360 px). Conteneur 1200 px. Rythme varié : pas de grille de cartes identiques ; alterner texte/image, grandes respirations (96 px entre sections).

## Mouvement
150–300 ms, ease-out. Apparitions légères au défilement. Tout désactivé sous prefers-reduced-motion.

## À éviter (anti-modèles impeccable / taste-skill)
Texte en dégradé ; petit sur-titre répété au-dessus de chaque titre ; grilles de trois cartes à icônes identiques ; photos de banque d'images génériques sans lien avec le Togo ; ombres et lueurs décoratives ; textes gris pâles ; bandeaux de cookies inutiles.

## Accessibilité
WCAG 2.2 AA : contraste 4,5:1, clavier complet, focus visible, textes alternatifs, zones tactiles 44 px, formulaires étiquetés.
