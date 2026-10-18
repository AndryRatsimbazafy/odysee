---
target: Chant VI Hermès
total_score: 25
max_score: 32
na_heuristics: 7,10
p0_count: 0
p1_count: 2
target_identity: "file:/home/user/odysee/src/components/chants/hermes/hermes.tsx"
target_fingerprint: "sha256:67f21808d603f50f38dd9ea9a9968fbcdc3cedb03c084a93e6abdb3c2ac028b3"
target_path: /home/user/odysee/src/components/chants/hermes/hermes.tsx
timestamp: 2026-10-18T16-24-33Z
slug: src-components-chants-hermes-hermes-tsx
---
Method: dual-agent (A: design review · B: detector + browser)

## Design Health Score (Experience mode, /32)
| # | Heuristique | Score | Problème clé |
|---|---|---|---|
| 1 | Visibilité de l'état | 3 | Après « Écrire une autre lettre », le focus retombe sur `body`. |
| 2 | Monde réel | 4 | La lettre est claire : À, Objet, Signé, sceau. |
| 3 | Contrôle et liberté | 3 | Valeurs gardées en cas d'erreur ; le succès ne rappelle pas ce qui a été envoyé. |
| 4 | Cohérence | 2 | Les choix d'objet ont le style des libellés (bug CSS) ; erreurs et `[à fournir]` partagent le cuivre. |
| 5 | Prévention des erreurs | 3 | Règle des 20 caractères affichée ; « trop rapide » passe avant la validation (deux refus de suite possibles). |
| 6 | Reconnaissance | 4 | Les trois objets sont visibles. |
| 7 | Flexibilité | n/a | Portfolio. |
| 8 | Minimalisme | 3 | « 48 h » répété trois fois sur desktop. |
| 9 | Récupération après erreur | 3 | Messages précis, focus sur la 1re erreur, autre voie proposée ; seul le cuivre gêne. |
| 10 | Aide | n/a | Portfolio. |
| **Total** | | **25/32** | **Bon (78 %)** |

## Verdict de spécificité
LLM : conçu pour ce produit. La lettre structure le chant (destinataire + heure locale, signature, sceau au caducée) et dépasse le prototype. Point faible : la colonne « Directement », barre latérale de contact classique.
Détecteur : CLI `[]`. En page, 5 à 6 signalements dans #hermes, tous faux positifs ou hors périmètre : `undersized-ui-text` sur « [LinkedIn · GitHub] » (placeholder) et « Note de Charon » (composant Gloss partagé) ; `tiny-text`/`wide-tracking` sur l'indication et l'en-tête mono (style voulu, contrastes ≥ 5,4) ; `heading-rhythm` sur le titre à 375. Le détecteur confirme : contrastes tous ≥ 4,65, erreurs en pointillés 2 px, `aria-invalid` posés, `role=status` toujours présent, focus visible à chaque arrêt, aucun débordement de 375 à 1440, sceau animé et état final en reduced-motion. Il a en plus trouvé le bug de spécificité des choix d'objet, que la revue a aussi vu.

## Priorités
- [P1] Focus perdu après « Écrire une autre lettre » (remontage par `key`). Fix : au remontage, focus sur le premier choix d'objet. → harden.
- [P1] Choix d'objet rendus en mono 11 px capitales : `.field label` l'emporte sur `.choice`. Ils se confondent avec la légende. Fix : `.choices .choice` en texte 17 px, casse normale, ivoire. → typeset.
- [P2] Erreurs et `[à fournir]` en même cuivre, côte à côte dans ce chant. Fix : garder le token, changer la forme de l'erreur (préfixe mono ou italique display). Décision d'Andry (sémantique de `--todo`, DESIGN §2). → clarify.
- [P2] Trop de clins d'œil (marge « décalage horaire compris », Charon, « Hermès s'envole… », « Hermès l'a déposée ») et « 48 h » trois fois. Fix : Charon seul clin d'œil ; libellé d'envoi neutre ; une seule mention de 48 h par écran. → distill.
- [P2] La zone de message ne se lit pas comme un champ : 132 px de vide au-dessus d'une seule réglure. Fix : cadre fin `--filet` ou repères d'angle, ou deux-trois réglures `--regle` (pas de dégradé CSS). → polish.

## Personas
- Jordan : zone de message sans bord ; « Objet » ressemble à un titre avec des étiquettes.
- Sam : focus perdu après « écrire une autre » ; fieldset + radiogroup étiquetés par la même légende = annonce en double.
- Casey (375) : « 48 h » coupé en fin de ligne (espaces insécables manquants) ; l'en-tête destinataire passe sur deux lignes.
- Recruteur RH pressé : pas encore d'email à copier ni de LinkedIn ; 4 champs obligatoires + 20 caractères ; tutoiement possiblement surprenant pour un CDI.

## Observations mineures
Espaces insécables manquants dans « 48 h » et « 5 000 » ; règle `.letter-head b` sans cible ; après un échec d'email, chaque nouvel essai crée une ligne et compte dans la limite de 3/heure ; `maxLength` 5000 tronque un collage en silence, donc l'erreur « trop long » ne peut jamais s'afficher ; le succès ne rappelle ni l'objet ni le début du message.

## Questions
- Le visiteur qui veut juste dire « parlons-en » a-t-il besoin d'un objet obligatoire et de 20 caractères minimum ?
- La lettre scellée devrait-elle rappeler ce qui a été envoyé (objet, première ligne) ?
- Pour le RH de 30 s, copier l'email devrait-il être l'action principale ?
