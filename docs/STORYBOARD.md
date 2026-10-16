# STORYBOARD.md — « L'Odyssée », portulan de nuit (luxe-4)

> v3.0 · 2026-10-16 · remplace la traversée du Styx (v2).
> Un bloc par section : contenu (source), composition, animation, note de Charon.
> **Référence visuelle : `docs/prototype/luxe-4.html`** (textes FR de départ inclus). Les versions EN sont dans `messages/en.json` ou dans les champs `_en` de l'admin. `[à fournir]` signale un contenu manquant : on ne l'invente jamais.
> Sources : **DB** = table Supabase éditée dans l'admin ; **MSG** = `messages/*.json`.

---

## 0. Éléments globaux

| Élément | Description | Source |
|---|---|---|
| Chargeur | « Embarquement · Antananarivo » : barque au trait qui se dessine, mer, aiguille, citation d'Homère, barre de progression réelle. 1re visite de la session uniquement | MSG |
| Ciel | Étoiles (3 couches), 12 constellations du zodiaque + Orion, flottement idle, parallaxe, scintillement. Décoratif | code |
| Curseur | Anneau + point ; états `link` (agrandi), `view` (« Lire » sur les vignettes), `text` | code |
| En-tête | Marque « Andry » + rôle mono · liens (Épreuves, Arsenal, Escales, Écrire) · CV · FR/EN · thème · bouton « Charon » | MSG + DB (CV) |
| Rose des vents | Bas gauche ; aiguille vers le chant courant ; ouvre l'index des chants (numéro romain + titre + folio, et bouton « Charon » sur mobile) | MSG |
| Routes | Entre deux chants : filet pointillé, barque qui avance (scrub), « Vers le Chant III · L'arsenal » | MSG |
| Notes de Charon | Gloses en marge (`.gloss`, « Note de Charon »), masquables et mémorisées | DB (projets) + MSG |
| Folios | « Folio n » en italique dans la marge, numérotation romaine générée | code |
| Console | « Un dev qui ouvre la console ? Tu es des nôtres. Le code est sur GitHub. » | MSG |

## 1. Départ · L'embarcadère (hero)

- **Contenu** : kicker « Portfolio · Lead Front-End Developer » ; nom « Andry » (display géant, lettres décalées) ; **h1** = accroche (« Je dirige le front-end d'applications *React et TypeScript*. ») ; paragraphe (Bocasay, remote pour des clients français, AMOA) ; CTA « Voir les réalisations » + « Écrire ». Source : DB `profile` (full_name, title, tagline, recit).
- **Médaillon** : gravure de carte (navire, graticule, Antananarivo 18°53′ S 47°30′ E), « Fig. 1 · Point de départ du voyage ».
- **Bande d'identité** (4 colonnes, 2×2 sur mobile) : Fonction · Port d'attache + horloge locale en direct (UTC+3) · Disponibilité (point vert si disponible, date `[à fournir]`) · Contact (Écrire à Hermès, CV, LinkedIn, GitHub). Source : DB `profile`, `social_links`, `resumes`.
- **Animation** : nom lettre à lettre, tracé du médaillon, bande d'identité en stagger. Le h1 est visible au rendu serveur (LCP).

## 2. Chant I · Deux divinités

- **Marge** : « Chant I · Folio 2 », épigraphe d'Homère (Odyssée, I, trad. Leconte de Lisle). MSG.
- **Lead** : « Héphaïstos pour le métier, Athéna pour le conseil. Le premier tient la forge ; la seconde lui dit quoi forger. » MSG.
- **Composition** : Héphaïstos (colonne large, gravure marteau) — « Architecture front-end et lead technique », texte, liste Architecture / Qualité / Équipe ; filet « & » ; Athéna (colonne étroite, rameau d'olivier) — « Comprendre avant de coder », liste Écoute / Écrit / Lien. Source : DB `profile.hephaistos_*`, `profile.athena_*`, `skills` (domaine `hephaistos` | `athena`).
- **Hors du travail** : Rotaract Club d'Ivandry (deux projets bénévoles), source DB `engagements` (+ fonctions si renseignées).
- **Animation** : titre mot à mot, tracé des gravures, listes en stagger.

## 3. Chant II · Les épreuves (carte + archives)

- **Marge** : « Archives · N dossiers. » (N calculé).
- **Carte** (collante sur desktop, au-dessus sur mobile) : graticule, port d'Antananarivo, un point par projet publié **généré** (positions calculées pour N quelconque, pas de coordonnées en dur), segments courbes, nord. Légende cliquable ; **compacte si N > 6**. Le point et le segment de l'épreuve lue s'allument (`on`), les précédents passent `done` ; la barque avance le long de la route au rythme de la lecture.
- **Aperçus** (un par projet, alternés gauche/droite) : vignette 1re image (« Dossier IV · nature », période), tampon « Épreuve IV · type », titre, résumé, technos principales, mention « Dossier scellé par Hadès » si confidentiel, bouton **« Lire les archives »**, note de Charon.
- **Animation** : apparition des aperçus, vignette en `brightness` fromTo, barque scrub. Clic sur un point = saut vers l'aperçu.
- Source : DB `projects` (publiés, `sort_order`), `project_images`, `project_technologies`.

## 4. Le dossier d'archive (ouvert depuis le Chant II)

Voir DESIGN §8 pour la composition. Contenu par projet (DB) :

| Bloc | Champs |
|---|---|
| Ouverture | tampon « Dossier IV · type · scellé », titre, quête (« … »), fiche (Période, Rôle, Équipe, Client) |
| `sealed` | « Pli scellé par Hadès » + message de confidentialité exact + « Me contacter pour en savoir plus » |
| Contexte et problème | context, problem, note de Charon |
| Ma contribution | role_text, liste contributions |
| Décisions et compromis | décision · pourquoi · compromis (×n) |
| Planches | 4–5 images (nature, légende, ratio, alt) ; vides = `[à fournir]` ; lightbox |
| Instruments et résultats | stack (techno + usage dans le projet) ; résultats, sinon « [Résultats documentés à fournir…] » |
| Pied | contact (message de confidentialité si scellé), liens publics s'ils existent, précédent / suivant, retour |

Note de Charon type : « La première est scellée par mon patron, Hadès. Je n'ai rien vu. »

## 5. Chant III · L'arsenal

- **Marge** : « Index des instruments : chacun renvoie aux épreuves où il a servi. Choisis-en un pour voir l'arme que lui a forgée Héphaïstos. »
- **Index de livre** (`.tindex`) : nom de l'outil · points de conduite · « depuis N ans » · renvois « II, IV » (épreuves calculées depuis `project_technologies`) ; au survol/focus/clic, la ligne s'ouvre (rôle + contexte d'usage).
- **Sanctuaire** : médaillon gravé de l'arme de l'outil actif (« La foudre de Zeus » pour React…), `aria-live="polite"`. Réserve si pas d'arme : harpe, arc, marteau, lyre, bouclier, ancre.
- **Compétences** hors outils : déjà au Chant I (pas de doublon).
- Source : DB `technologies` (since/years, weapon, role, context), `project_technologies`.

## 6. Chant IV · Les escales

- **Journal de bord** (table) : Période · Port (+ lieu, remote) · Poste · Entrée du journal ; la ligne en cours porte « en cours ». De la plus récente à la plus ancienne. Mobile : chaque ligne devient un bloc empilé.
- **Animation** : lignes en stagger, filet qui se trace.
- Source : DB `experiences` (+ technologies liées en mono si renseignées).

## 7. Chant V · L'oracle

- **Marge** : « Ulysse a consulté Tirésias. Ici, les réponses aux questions que posent le plus souvent les recruteurs. »
- **FAQ** `details/summary` (ouverture animée, une seule ouverte à la fois facultatif) ; 5 questions de départ (disponibilité, remote France, expertise, travail en équipe, voir du code). Source : DB `faq_items`.
- **Voix de Delphes** : 1 à 5 témoignages publiés, citation + auteur + rôle ; **bloc absent** s'il n'y en a aucun. Source : DB `testimonials`.

## 8. Chant VI · Écrire à Hermès

- **Marge** : « Hermès portait les messages des dieux. Réponse sous 48 h, décalage horaire compris. »
- **Formulaire** : Nom, Email, Objet (CDI / Freelance / Autre), Message ; « Tous les champs sont obligatoires. » ; validation inline ; états envoi / succès / échec **réels** (Server Action). Contact direct : email (bouton Copier), LinkedIn, GitHub.
- Note de Charon : « Moi je rame, lui il vole. Chacun son métier. »

## 9. Épilogue · Le retour à Ithaque

- « Prochaine escale : *votre équipe.* » ; « Ulysse a mis dix ans à rentrer. Pour me joindre, une lettre suffit. » ; CTA « Me contacter » + CV.
- Pied de page : © année, liens, retour en haut.

## 10. Page 404

« Égaré entre Charybde et Scylla. » + gravure de boussole, lien vers l'embarcadère et vers les épreuves. MSG.
