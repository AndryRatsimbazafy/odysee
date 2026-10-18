---
target: Chant III · L arsenal
total_score: 25
max_score: 32
na_heuristics: 7,10
p0_count: 0
p1_count: 2
target_identity: "file:/home/user/odysee/src/components/chants/arsenal/arsenal.tsx"
target_fingerprint: "sha256:fd969847d002ff43db5f8a95addbd735a761f3a220fd8bf6ca1150ac377c5e81"
target_path: /home/user/odysee/src/components/chants/arsenal/arsenal.tsx
timestamp: 2026-10-18T15-18-05Z
slug: src-components-chants-arsenal-arsenal-tsx
---
⚠️ DEGRADED: single-context (CLAUDE.md du projet interdit les sous-agents en parallèle)

## Design Health Score (mode Experience, 7 et 10 n/a)
| # | Heuristique | Score | Constat |
|---|---|---|---|
| 1 | Visibilité de l'état | 3 | Ligne active en or + aria-pressed + sanctuaire ; sur mobile, le sanctuaire était hors écran (corrigé par la bande collante) |
| 2 | Monde réel | 4 | Index de livre authentique : points de conduite, renvois en chiffres romains, folio |
| 3 | Contrôle | 3 | L'ouverture au survol fait bouger la liste sous le curseur |
| 4 | Cohérence | 3 | Marge, titre et entrée alignés sur les chants I–II ; nom accessible du bouton variable selon l'ouverture |
| 5 | Prévention des erreurs | 3 | Reflow au survol = risque de clic sur la mauvaise ligne |
| 6 | Reconnaissance | 3 | « I, IV » ne nomment l'épreuve qu'au survol (title) ou au lecteur d'écran |
| 7 | Flexibilité | n/a | Surface Experience |
| 8 | Esthétique minimaliste | 3 | Rôle + contexte affichés deux fois en desktop (ligne ouverte et sanctuaire) |
| 9 | Récupération | 3 | États vides tenus : aucun outil → [à fournir], aucun renvoi → « — », contexte vide → message |
| 10 | Aide | n/a | Surface Experience |
| **Total** | | **25/32** | Bon |

## Design Specificity Verdict
LLM : authored. L'index de livre relié au médaillon gravé de l'arme est propre au portulan (aucun produit tiers ne l'emploierait tel quel) ; renvois calculés vers les points de la carte du Chant II, réserve d'armes dans l'ordre. Fidèle au prototype luxe-4 sans le copier.
Détecteur : CLI 0 trouvaille sur `chants/arsenal` et `engravings/weapons.tsx`. Injection navigateur réussie (1440 et 375) : 19–23 anti-patterns sur la page entière, aucun dans #arsenal (header CV/liens 9.8px, note de Charon du Chant II, kickers des sections échafaudage IV–Épilogue, étiquettes du ciel). Pas de faux positif à signaler pour ce chant.

## Priority Issues
1. [P1] Ouverture au survol qui fait sauter la liste : la ligne survolée s'ouvre en plus de la ligne active, poussant les suivantes sous le curseur. Fix : une seule ligne ouverte (survolée sinon active), intention de survol ~120 ms. → /impeccable polish
2. [P1] Renvois « I, IV » trop petits au toucher (~8×14 px, sous 24 px WCAG 2.5.8). Fix : zone de clic ≥ 24 px. → /impeccable adapt
3. [P2] Rôle et contexte affichés deux fois en desktop (ligne + sanctuaire). Fix : le sanctuaire garde kicker, arme, nom, ancienneté ; la ligne porte rôle et contexte (comme sur mobile). → /impeccable distill
4. [P2] Nom accessible du bouton qui enfle avec le pli (« Next.js 2026 App Router… »). Fix : sortir le pli du bouton, nom = outil + ancienneté. → /impeccable harden
5. [P2] Bande collante mobile lue comme une card (fond opaque plus étroit que la page, kicker sur 2 lignes). Fix : fond pleine largeur, kicker court. → /impeccable adapt

## Persona Red Flags
- CTO pressé : comprend vite l'index ; doit survoler « I » pour savoir quelle épreuve.
- Mobile distrait : renvois difficiles à toucher ; bande collante OK pour voir l'arme.
- Lecteur d'écran : liste étiquetée, sanctuaire aria-live ; nom de bouton long quand la ligne est ouverte.

## Minor Observations
- Étiquettes du ciel (LION, VIERGE) passent sous l'index à faible contraste (couche globale, hors chant).
- Avec 3 outils, le sanctuaire est plus haut que l'index en desktop.

## Questions
- L'ouverture au survol est-elle indispensable, ou le survol peut-il seulement surligner ?
- Les renvois doivent-ils afficher le titre court de l'épreuve plutôt que le seul chiffre romain ?
