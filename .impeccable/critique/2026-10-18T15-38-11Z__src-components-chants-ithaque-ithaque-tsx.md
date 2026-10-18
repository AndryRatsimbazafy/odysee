---
target: Épilogue, pied de page et 404
total_score: 28
max_score: 32
na_heuristics: 7,10
p0_count: 0
p1_count: 0
target_identity: "file:/home/user/odysee/src/components/chants/ithaque/ithaque.tsx"
target_fingerprint: "sha256:abb2e006833bac10bdb34ef45c19ee760e5a7437d0856eac0874cff6fdd1b10e"
target_path: /home/user/odysee/src/components/chants/ithaque/ithaque.tsx
timestamp: 2026-10-18T15-38-11Z
slug: src-components-chants-ithaque-ithaque-tsx
---
⚠️ DEGRADED: single-context (CLAUDE.md du projet interdit les sous-agents en parallèle)

## Design Health Score (mode Experience, 7 et 10 n/a)
| # | Heuristique | Score | Constat |
|---|---|---|---|
| 1 | Visibilité de l'état | 3 | CV absent signalé (bouton en pointillés « CV · PDF à fournir », aria-disabled) |
| 2 | Monde réel | 4 | La côte d'Ithaque et la barque qui rentre ; la boussole affolée de la 404 |
| 3 | Contrôle | 4 | Retour en haut sur toutes les pages ; 404 avec deux sorties (embarcadère, épreuves) |
| 4 | Cohérence | 4 | Pied de page commun (©, liens, retour en haut) ; 404 dans la même chrome que le site |
| 5 | Prévention des erreurs | 3 | Liens sociaux absents → [à fournir] plutôt qu'un lien vide |
| 6 | Reconnaissance | 4 | CTA et liens nommés par leur action |
| 8 | Esthétique minimaliste | 3 | Étiquettes du ciel (BÉLIER, CAPRICORNE) sous la boussole et le titre, à faible contraste (couche globale) |
| 9 | Récupération | 3 | La 404 ramène au récit ; statut HTTP 404 renvoyé en FR et EN |
| **Total** | | **28/32** | Excellent |

## Design Specificity Verdict
Authored : épilogue fidèle au prototype (côte tracée, « votre équipe. » en italique or), 404 « Charybde et Scylla » avec une boussole gravée dont l'aiguille hésite puis reste déroutée. Détecteur CLI : 0 trouvaille. Message console stylé, une fois par session, avec le lien GitHub quand il est saisi.

## Priority Issues
1. [P2] Sur la 404 seulement, en dev, React signale les scripts d'initialisation du layout (gloses, chargeur) rendus côté client : ils ne s'y exécutent pas (préférence Charon et chargeur sans effet sur la 404). Passer par next/script retarderait ces scripts sur tout le site ; à garder tel quel. → /impeccable harden
2. [P3] Étiquettes de constellations sous le contenu à faible contraste (couche globale du ciel). → /impeccable polish

## Minor Observations
- « © 2026 Andry » : année calculée (cache d'un jour), pas codée en dur.
