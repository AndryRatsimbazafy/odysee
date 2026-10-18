---
target: le dossier d archive (4 layouts)
total_score: 25
max_score: 32
na_heuristics: 7,10
p0_count: 0
p1_count: 2
target_identity: "file:/home/user/odysee/src/components/archives/dossier.tsx"
target_fingerprint: "sha256:204918048fe1da44b2deb3001fafdafd4898306c94b9f98a38ff555b78f3e2de"
target_path: /home/user/odysee/src/components/archives/dossier.tsx
timestamp: 2026-10-18T14-28-51Z
slug: src-components-archives-dossier-tsx
---
⚠️ DEGRADED: single-context (CLAUDE.md du projet interdit les sous-agents en parallèle)

## Design Health Score (mode Experience, 7 et 10 n/a)
| # | Heuristique | Score | Constat |
|---|---|---|---|
| 1 | Visibilité de l'état | 3 | Fil « Dossier II sur 4 », compteur « Fig. 3 / 5 » ; aucun repère de position pendant le défilement long |
| 2 | Monde réel | 4 | Métaphore d'archive tenue : pli scellé, § n, Fig. n, planches |
| 3 | Contrôle | 4 | Échap, retour, bouton, préc./suiv. en boucle, Échap de la visionneuse prioritaire |
| 4 | Cohérence | 3 | La page complète garde la rose « Départ · L'embarcadère » et les étiquettes du ciel ; l'overlay non |
| 5 | Prévention d'erreurs | 3 | Rien d'irréversible ; slug inconnu → 404 / redirection |
| 6 | Reconnaissance | 3 | Le zoom ne se signale que par le curseur ; rien au toucher |
| 7 | Flexibilité | n/a | Portfolio (Experience) |
| 8 | Esthétique minimaliste | 2 | Empilements de [à fournir] ; planches portrait démesurées (gallery Fig. 4, 3:4 sur 8 colonnes ≈ 1100 px) |
| 9 | Récupération d'erreurs | 3 | 404 par défaut (vraie page en T22) |
| 10 | Aide | n/a | Portfolio |
| **Total** | | **25/32** | **Solide** |

## Verdict de spécificité
Spécifique au produit : quatre ouvertures réellement différentes (pli scellé avec sceau gravé, avant/après, grande planche, « Les choix, d'abord »), numérotation § n, légendes « Fig. n · nature — légende », emplacements vides avec l'emblème du projet en filigrane. Détecteur : 0 constat sur src/components/archives. Pas d'overlay navigateur (pas d'outil navigateur natif).

## Points forts
- Les ouvertures par layout donnent à chaque dossier sa composition ; `process` sert le CTO en posant les décisions d'abord.
- Les planches gardent leur ratio et l'emplacement vide reste honnête et typé (« Image 3 · Fiche membre · à fournir · Format 4:5 »).
- Visionneuse sobre et complète au clavier, fond nuit, rien qui ressemble à une card.

## Problèmes prioritaires
1. [P1] Bruit des contenus vides : « [à fournir] » en double dans Contexte (paragraphe + grand texte) et en triple par décision vide. Fix : un seul marqueur par bloc vide (décision, contexte/problème). → /impeccable harden
2. [P1] Planches portrait démesurées : le placement par rang ignore le ratio (gallery Fig. 4 en 3:4 sur 8 colonnes, sealed Fig. 4 en 4:5 sur 6). Fix : plafonner la largeur des ratios portrait (3:4, 4:5) à 4–5 colonnes, garder les rangs pour les paysages. → /impeccable layout
3. [P2] Page complète : la rose indique « Départ · L'embarcadère » et le ciel (étiquette ORION) passe derrière l'ouverture ; le dossier ne se lit pas comme une archive séparée. Fix : fond nuit plein sous l'ouverture en mode page, rose sur « Archives » ou masquée. → /impeccable polish
4. [P2] Mobile : le fil d'Ariane passe sur 3 lignes à côté du bouton ; dans la visionneuse, les flèches sont loin de l'image et la légende colle « Fig. 3·Fiche ». Fix : fil abrégé (« II / 4 ») sous 600 px, flèches sous l'image, espaces autour du point. → /impeccable adapt

## Personas
- CTO pressé : pas de raccourci clavier pour passer au dossier suivant ; doit descendre en bas du dossier.
- Lecteur d'écran : dialogue étiqueté, page inert, focus rendu ; l'emplacement vide est un role=img dans un bouton déjà étiqueté (redondant mais sans conflit).
- Mobile distrait : swipe OK ; flèches 150 px sous l'image.

## Observations mineures
- Sur un dossier vide, « § 6 Instruments et résultats » affiche deux mentions à fournir de styles différents (sans-serif et mono).
- Le zoom au survol (scale 1.01) est imperceptible sur les cadres vides.

## Questions
- Et si les planches vides se regroupaient en une seule « planche d'attente » tant qu'aucune image n'est fournie ?
- Le dossier en page complète doit-il garder le ciel, ou devenir la nuit nue de l'overlay ?
