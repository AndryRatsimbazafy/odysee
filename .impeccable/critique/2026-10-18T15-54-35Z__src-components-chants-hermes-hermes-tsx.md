---
target: Chant VI Hermès
total_score: 21
max_score: 32
na_heuristics: 7,10
p0_count: 0
p1_count: 2
target_identity: "file:/home/user/odysee/src/components/chants/hermes/hermes.tsx"
target_fingerprint: "sha256:e19f7347dc0e82688276eb5300fbf127136812a93593f09ebdcbe4a0fa92c19d"
target_path: /home/user/odysee/src/components/chants/hermes/hermes.tsx
timestamp: 2026-10-18T15-54-35Z
slug: src-components-chants-hermes-hermes-tsx
---
Method: dual-agent (A: design review · B: detector + browser)

## Design Health Score (Experience mode, /32)
| # | Heuristique | Score | Problème clé |
|---|---|---|---|
| 1 | Visibilité de l'état | 2 | Focus perdu (BODY) à l'envoi : bouton `disabled`. Succès = ligne de 15 px sous un formulaire vidé. |
| 2 | Correspondance au monde réel | 3 | La « lettre » n'existe que dans le titre. |
| 3 | Contrôle et liberté | 3 | Valeurs gardées en cas d'erreur ; le succès ne rappelle pas l'email de réponse. |
| 4 | Cohérence et standards | 2 | `--todo` = « à fournir » et « ton erreur » ; focus des champs en bordure 1 px alors que le reste du site utilise un outline ; flèche native du select. |
| 5 | Prévention des erreurs | 2 | Minimum de 20 caractères découvert en échouant ; pas de `required`/`aria-required` ; tout passe par un aller-retour serveur. |
| 6 | Reconnaissance plutôt que rappel | 3 | Select vide une fois fermé : les 3 objets sont cachés. |
| 7 | Flexibilité | n/a | Portfolio. |
| 8 | Esthétique et minimalisme | 3 | Sobre, dans la palette ; ~125 px par champ (ligne d'erreur réservée). |
| 9 | Récupération après erreur | 3 | Erreurs précises par champ ; l'échec renvoie à « l'adresse ci-contre », qui est `[à fournir]` et, sur mobile, en dessous. |
| 10 | Aide | n/a | Portfolio. |
| **Total** | | **21/32** | **Acceptable (66 %)** |

## Verdict de spécificité
LLM : la voix (Hermès, Charon), la marge annotée et le filet de colonne sont propres au site ; le formulaire, lui, est un formulaire SaaS sombre générique (cases remplies + bouton or). Chaque autre chant a une idée de composition (carte, index de livre, journal de bord) ; Hermès n'en a pas : c'est le bloc le plus « template » du site (contraire au principe 2 de PRODUCT). Le prototype avait la même faiblesse.
Détecteur : CLI `[]` (0 finding) sur `src/components/chants/hermes`. En page, 2 signalements dans #hermes : `undersized-ui-text` sur « [LinkedIn · GitHub] » (9,84 px) et le kicker « Note de Charon » (10 px) — composants partagés, et placeholders pour le premier. Faux positifs : occlusion « Libra » (ciel décoratif), `heading-rhythm` (kicker volontairement serré). Les deux évaluations s'accordent sur le focus : bordure seule, sans outline, pour les champs.

## Priorités
- [P1] Champs presque invisibles : bordure/fond 1,37:1 (sombre), 1,44:1 (clair), fond du champ/page 1,07:1 → échec WCAG 1.4.11. Fix : réglure basse `--ardoise` (≥ 3:1) sur fond transparent, plus d'encadré. → harden, puis polish.
- [P1] Focus et annonces cassés à l'envoi : bouton `disabled` qui éjecte le focus ; 4 `aria-live` simultanés ; `.notice` `role=status` + `hidden` basculé avec le texte (souvent muet). Fix : `aria-disabled` pendant l'envoi ; focus sur le 1er champ invalide ; région de statut toujours présente ; retirer `aria-live` des `.err` ; `aria-required` ; focus sur le message de succès. → harden.
- [P2] Le formulaire ne ressemble pas à une lettre. Fix : champs réglés sans cases, en-tête mono « À : Andry · Antananarivo · heure locale » (horloge du hero), objet en 3 choix visibles (radios), nom en ligne de signature ; succès = lettre scellée (trait or tracé en stroke-dashoffset, « réponse à <email> sous 48 h »). → shape, puis animate.
- [P2] Erreurs en `--todo` : cuivre/or 1,05:1, l'erreur ressemble à un accent ou à un « à fournir ». Fix : garder le token (contraste vérifié) mais ajouter un signal non coloré (préfixe mono, filet gauche 2 px). Pas de nouveau token sans Andry. → colorize (consultation).
- [P2] Textes : ~6 clins d'œil contre 1 par chant (3 blagues dans les erreurs, au moment de frustration) ; contrainte de 20 caractères invisible ; « ci-contre » faux sur mobile ou sans email ; « Réponse sous 48 h » loin du bouton. → clarify.

## Personas
- Jordan : select vide qui semble cassé ; minimum de 20 caractères appris en échouant ; succès sans relief.
- Sam : contours de champs à 1,4:1 ; focus des champs = changement de bordure 1 px en fondu 0,5 s ; focus perdu à l'envoi ; statut parfois muet.
- Casey (375) : email/LinkedIn sous ~900 px de formulaire ; « ci-contre » ; « Copier » à 24 px de haut.
- Recruteur RH pressé : veut l'email ou LinkedIn en un geste, ils arrivent en dernier sur mobile ; 20 caractères minimum = friction ; le tutoiement à confirmer comme choix global.

## Observations mineures
Liens externes sans indication d'onglet ; objet du mail avec la clé brute (`[Hermès] cdi`) ; pas de compteur près de 5000 ; transition `border-color` hors des propriétés animables du DESIGN §9 ; vide en bas à droite à 1440 ; contraste `.err` et bouton en clair justes au-dessus de 4,5 (4,94 et 4,65).

## Questions
- Si Hermès porte des lettres, pourquoi un formulaire web plutôt qu'une lettre (en-tête, signature, sceau à l'envoi) ?
- Pour le RH de 30 s, « Directement » ne devrait-il pas passer avant le formulaire sur mobile ?
- Une blague dans un message d'erreur est-elle « luxe par la retenue » ?
