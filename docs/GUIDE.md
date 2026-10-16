# Guide des prompts Claude Code — L'Odyssée (reprise luxe-4)

Oct 16, 2026 · @Andry · v3

## Mode d'emploi

On reprend en direction **luxe-4** (portulan de nuit). Ce qui est fait reste : le socle Next.js, l'i18n, `proxy.ts`, Supabase et ses migrations (T01 à T04). Ce qui change : les tokens et les polices, les textes d'interface, une partie du schéma, et tout le visuel à partir de T05. La référence est désormais `docs/prototype/luxe-4.html`.

Il reste 24 sessions de construction et 4 revues. Je n'ai regroupé que les tâches petites ou proches.

**Chaque session suit le même rituel :**

1. Tape `/clear`.
2. Colle le prompt de la tâche.
3. Si la tâche porte 🧭, Claude Code propose un plan. Lis-le, corrige-le si besoin, puis valide.
4. Relis le résumé de fin de tâche et fais les actions manuelles qu'il signale.
5. Vérifie que `npm run check` est vert, que la tâche est cochée dans `docs/TASKS.md`, puis valide le commit proposé.

**Regroupements retenus :**

| Session | Tâches | Pourquoi c'est groupé |
| --- | --- | --- |
| S19 | T20 + T22 | Le journal, l'oracle, l'épilogue et la 404 sont courts et sans logique serveur |
| S24 | T26 + T27 | Surtout des actions manuelles de ta part |

**À ne jamais grouper :** les tâches 🧭 (T04c, T07, T09, T16, T17, T21, T23) et les chants avec capture Playwright.

**Revues de phase :** dans une session neuve ; elles lisent les commits et les docs utiles et signalent les écarts sans rien corriger.

## Avant de commencer — S0 · Copier le kit v3 👤

1. Dans le dossier `odysee`, remplace `CLAUDE.md`, `DESIGN.md`, `PRODUCT.md` et `docs/*.md` par ceux du kit v3, et ajoute `docs/prototype/luxe-4.html` (garde les anciens prototypes, ce sont des archives).
2. Commit : `docs: switch design direction to luxe-4`.
3. Dans Claude Code : `/impeccable init` en gardant PRODUCT.md et DESIGN.md tels quels.
4. Ouvre `docs/prototype/luxe-4.html` dans ton navigateur : c'est la cible.

## Phase 1 — Réalignement et fondations (S1 à S5 + revue)

### S1 — T04a · Tokens, polices et thème luxe-4

```
Lis CLAUDE.md puis la tâche T04a de docs/TASKS.md. Le projet a changé de direction visuelle : luxe-4 remplace le Styx. Lis seulement DESIGN.md §2, §3, §4 et §9.
Remplace les tokens de src/app/globals.css par ceux de DESIGN §2 (sombre par défaut + clair) et expose-les dans @theme. Supprime les anciens tokens d'objets (terre cuite, figure noire, --on-terre, --peau, --pierre, --grave…).
Dans src/app/fonts.ts, Cormorant Garamond remplace Fraunces. next-themes : defaultTheme "dark".
Ajoute les utilitaires de base (.gut avec 108 px à gauche dès 821 px, .grid 12 colonnes, .marg, .kicker, .display, .mono, .todo, .btn, .line, focus) en reprenant les valeurs de docs/prototype/luxe-4.html (bloc <style> du début).
Mets à jour /dev/tokens pour afficher chaque couleur et son contraste sur --nuit.
Termine par npm run check, coche T04a, propose un commit.
```

**À vérifier :** `/dev/tokens` en sombre et en clair ; les titres sont en Cormorant ; aucun reste de terre cuite.

### S2 — T04b · Textes d'interface luxe-4

```
Lis CLAUDE.md puis la tâche T04b de docs/TASKS.md et docs/STORYBOARD.md en entier (c'est la source des textes).
Remplace les textes v2 de messages/fr.json et messages/en.json par ceux de luxe-4, organisés par chant (hero.*, divinites.*, epreuves.*, dossier.*, arsenal.*, escales.*, oracle.*, hermes.*, ithaque.*, voyage.* pour chargeur / index / routes / Charon, notFound.*, console).
Le message de confidentialité doit être recopié mot pour mot. Aucun texte de projet ici : ils iront en base.
Traduis l'anglais et liste-moi les phrases EN que je dois relire. Supprime les clés v2 qui ne servent plus et adapte les composants existants qui les utilisaient.
Termine par npm run check, coche T04b, propose un commit.
```

### S3 — T04c · Migration du schéma v3 🧭

```
Lis CLAUDE.md puis la tâche T04c de docs/TASKS.md, ARCHITECTURE.md §4 (paragraphe « Migration v3 ») et PRD.md §7.
Passe en Plan Mode : montre-moi le SQL complet de la migration schema_v3_luxe4 (colonnes ajoutées et supprimées, nouvelles tables project_items, project_decisions, faq_items, checks, RLS et policies dans la même migration).
Après validation : npx supabase db push, npm run db:types, puis corrige les erreurs de types éventuelles.
Termine par npm run check, coche T04c, propose un commit.
```

👤 **Toi :** relis surtout les colonnes supprimées (`challenges`, `solutions`, `narration`…) : elles sont vides aujourd'hui, mais c'est irréversible.

### S4 — T05 · Clients Supabase, lectures en cache et seed

```
Lis CLAUDE.md puis la tâche T05 de docs/TASKS.md et ARCHITECTURE.md §2 et §4.
Crée lib/supabase/* (client, server, admin serveur uniquement) et lib/data/* avec 'use cache' + cacheTag (vérifie l'API dans la doc Next.js embarquée), le repli EN → FR et des types de vue complets pour un projet (items, décisions, planches, technos).
Seed de démo à partir des données de docs/prototype/luxe-4.html (bloc « Données ») : profil, 4 projets dont 1 scellé, leurs planches sans fichier, 3 technos, 2 escales, 5 questions de l'oracle, 6 compétences. Garde les [à fournir]. Aucun témoignage.
Explique-moi brièvement 'use cache' et les tags. Termine par npm run check, coche T05, propose un commit.
```

### S5 — T06 · Layout public et en-tête

```
Lis CLAUDE.md puis la tâche T06 de docs/TASKS.md et DESIGN.md §4 et §6 (point 5).
Layout pleine largeur (aucun conteneur centré), en-tête fixe comme dans docs/prototype/luxe-4.html (marque, liens, CV, FR/EN, thème, bouton « Charon » avec aria-pressed et mémorisation), opaque après le hero, lien d'évitement, landmarks, pied de page.
Crée les composants Marg, Gloss, Folio et la fonction roman().
Termine par npm run check, une capture 1440 + 375, coche T06, propose un commit.
```

### R1 — Revue de la phase 1

```
Lis CLAUDE.md, puis git log depuis le commit « switch design direction to luxe-4 », ARCHITECTURE.md §1 à §4 et DESIGN.md §2 à §4.
Vérifie : tokens et polices conformes, aucun reste du Styx dans le code ou les messages, schéma v3 et RLS, clés secrètes jamais côté client, cache par tags.
Liste courte des écarts, classés par gravité. Ne corrige rien sans mon accord.
```

## Phase 2 — Admin (S6 à S9 + revue)

### S6 — T07 · Authentification admin 🧭

```
Lis CLAUDE.md puis la tâche T07 de docs/TASKS.md et ARCHITECTURE.md §5.
Passe en Plan Mode. /admin/login (email + mot de passe), session @supabase/ssr rafraîchie dans proxy.ts, layout /admin protégé côté serveur, requireAdmin() appelé dans chaque Server Action, noindex. Installe le socle shadcn via le MCP shadcn, thème sombre aux tokens du site, sans élément narratif.
Explique-moi en quelques lignes pourquoi proxy.ts ne suffit pas.
```

### S7 — T08 · Profil, engagement, liens, CV

```
Lis CLAUDE.md puis la tâche T08 de docs/TASKS.md et PRD.md F-ADM-03, F-ADM-07, F-ADM-13, F-ADM-14.
Formulaires FR/EN côte à côte (react-hook-form + Zod), indicateur de traduction manquante, upload des CV, updateTag après chaque enregistrement.
```

### S8 — T09 · Projets 🧭

```
Lis CLAUDE.md puis la tâche T09 de docs/TASKS.md, PRD.md F-ADM-04, F-ADM-08, F-ADM-08b, F-ADM-09, F-ADM-15, SEO-09 et SEO-10.
Passe en Plan Mode. Formulaire en onglets : Récit, Fiche, Contribution et décisions, Planches, Technos, SEO. Listes ordonnables (contributions, résultats, décisions), 4 à 5 planches (upload, nature, légende, ratio, alt FR/EN), layout et emblème, statut, ordre, redirection de slug.
Pour un projet confidentiel, propose le layout sealed par défaut et masque les champs de liens.
```

### S9 — T10 · Technos, compétences, escales, oracle, témoignages, messages

```
Lis CLAUDE.md puis la tâche T10 de docs/TASKS.md et PRD.md F-ADM-05, F-ADM-06, F-ADM-10, F-ADM-14, F-ADM-16.
Réutilise les composants de formulaire de T08 et T09. Technos : arme optionnelle (liste fermée), rôle et contexte FR/EN. Compétences : domaine Héphaïstos / Athéna. Oracle : questions ordonnables.
```

### R2 — Revue de la phase 2

```
Lis CLAUDE.md, git log de la phase 2 et ARCHITECTURE.md §4 et §5.
Vérifie que chaque Server Action d'écriture appelle requireAdmin(), que chaque écriture invalide le bon tag, et que la RLS bloque une écriture sans session. Liste courte des écarts. Ne corrige rien sans mon accord.
```

## Phase 3 — Le voyage, couches globales (S10 à S12 + revue)

### S10 — T11 · Ciel étoilé et zodiaque

```
Lis CLAUDE.md puis la tâche T11 de docs/TASKS.md et DESIGN.md §6 (point 1).
Reprends le ciel de docs/prototype/luxe-4.html (bloc « Ciel : les douze constellations » et couche #zodiac) : dégradés, étoiles en 3 couches, 12 constellations + Orion, flottement idle, parallaxe, scintillement, mêmes opacités. Données des tracés dans src/components/engravings/.
Îlot client fixe, aria-hidden, transformations GPU seulement, pause quand l'onglet est caché, reduced-motion, mode clair.
Vérifie le contraste des textes sur le point le plus clair du ciel. Capture 1440 + 375.
```

### S11 — T12 · Chargeur et curseur

```
Lis CLAUDE.md puis la tâche T12 de docs/TASKS.md, DESIGN.md §6 (points 2 et 3) et ARCHITECTURE.md §8.
Chargeur « Embarquement · Antananarivo » comme dans le prototype : 1re visite de la session seulement, progression réelle (fonts + load), mini 1,4 s, sécurité CSS 8 s, jamais affiché sans JS.
Curseur anneau + point, états via data-cursor (link, view, text), pointer:fine seulement, désactivé en reduced-motion.
Dis-moi si le chargeur risque de pénaliser le LCP et comment tu l'as évité.
```

### S12 — T13 · Rose des vents, index, routes et révélations

```
Lis CLAUDE.md puis la tâche T13 de docs/TASKS.md et DESIGN.md §6 (point 4), §7 (routes) et §9.
Reprends du prototype les blocs « Rose des vents et index », « Routes entre les chants » et « Défilement amorti ».
Lenis branché sur le ticker GSAP, sauts d'ancre avec décalage d'en-tête, index en overlay accessible (focus, Échap, data-lenis-prevent), barque des routes en scrub. Crée RevealTitle (mot à mot) et Reveal (stagger) réutilisables.
```

### R3 — Revue du voyage

```
Lis CLAUDE.md, git log de la phase 3 et DESIGN.md §6 et §9.
Avec Playwright : aucune couche ne recouvre un texte, aucun débordement horizontal à 375 / 1440 / 1920, tout est figé en reduced-motion, le contenu reste lisible sans JS. Lance review-animations. Liste courte des écarts.
```

## Phase 4 — Les chants (S13 à S20 + revue)

Rituel de chaque chant : construire, animer, `npm run check`, capture 1440 + 375, `/impeccable critique`, `review-animations`.

### S13 — T14 · L'embarcadère

```
Lis CLAUDE.md puis la tâche T14 de docs/TASKS.md, STORYBOARD.md §1 et DESIGN.md §7.
Hero comme dans docs/prototype/luxe-4.html : nom, h1, récit, CTA, médaillon gravé de la carte (tracé à l'apparition), bande d'identité avec horloge d'Antananarivo en direct (petit îlot client). Le h1 doit être visible au rendu serveur.
Puis la routine du chant.
```

### S14 — T15 · Chant I, Deux divinités

```
Lis CLAUDE.md puis la tâche T15 de docs/TASKS.md et STORYBOARD.md §2.
Héphaïstos en colonne large, Athéna en colonne étroite, le filet « & », les gravures marteau et olivier, les compétences par domaine, « Hors du travail ». Marge annotée avec épigraphe et folio.
Puis la routine du chant.
```

### S15 — T16 · Chant II, carte et archives 🧭

```
Lis CLAUDE.md puis la tâche T16 de docs/TASKS.md, STORYBOARD.md §3 et DESIGN.md §7.
Regarde dans docs/prototype/luxe-4.html les blocs « Aperçus des épreuves » et « Carte de la traversée » (fonction updateVoyage).
Passe en Plan Mode. Explique comment tu calcules les positions des points pour N projets (aucune coordonnée en dur), la légende compacte au-delà de 6, et la barque sur la route.
Après le chant, teste avec 9 projets en seed temporaire, montre-moi la capture, puis retire ce seed.
```

### S16 — T17 · Le dossier d'archive 🧭

```
Lis CLAUDE.md puis la tâche T17 de docs/TASKS.md, DESIGN.md §8, STORYBOARD.md §4, ARCHITECTURE.md §3 (Dossier) et PRD.md F-PRO-04 à F-PRO-10.
Regarde le bloc « Dossier » du prototype (fonction renderDossier).
Passe en Plan Mode. Composant serveur Dossier avec les 4 layouts, page complète /[locale]/projects/[slug] et overlay en route interceptée (@dossier/(.)projects/[slug]). Vérifie l'API dans la doc embarquée ; si elle bloque, dis-le-moi avant de passer au repli.
inert sur la page, focus au titre puis retour au bouton, Échap et retour navigateur ferment. Message de confidentialité mot pour mot.
```

### S17 — T18 · Planches et lightbox

```
Lis CLAUDE.md puis la tâche T18 de docs/TASKS.md, DESIGN.md §8 (Planches) et PRD.md F-PRO-08.
Planches par layout avec next/image et les ratios, emplacements [à fournir] quand il n'y a pas de fichier, lightbox (flèches, Échap, swipe, compteur, piège de focus) et ouverture animée du dossier.
Puis la routine du chant sur un dossier de chaque layout.
```

### S18 — T19 · Chant III, l'arsenal

```
Lis CLAUDE.md puis la tâche T19 de docs/TASKS.md, STORYBOARD.md §5 et PRD.md F-SKI-01 et F-SKI-02.
Index de livre (points de conduite, renvois aux épreuves calculés depuis project_technologies, ligne dépliable au survol, au focus et au clic), sanctuaire de l'arme (gravures + réserve dans l'ordre).
Teste avec 12 outils en seed temporaire, puis retire-le. Puis la routine du chant.
```

### S19 — T20 + T22 · Escales, oracle, Ithaque et 404

```
Lis CLAUDE.md puis les tâches T20 et T22 de docs/TASKS.md et STORYBOARD.md §6, §7, §9 et §10.
Fais d'abord T20 : journal de bord (table, blocs empilés en mobile, test avec 7 escales puis retrait), FAQ en details/summary, voix de Delphes absente tant qu'aucun témoignage n'est publié.
Puis T22 : épilogue, pied de page, 404 « Charybde et Scylla », message console.
Un commit par tâche.
```

### S20 — T21 · Écrire à Hermès 🧭

```
Lis CLAUDE.md puis la tâche T21 de docs/TASKS.md, ARCHITECTURE.md §6 et STORYBOARD.md §8.
Passe en Plan Mode. Server Action sendContactMessage : Zod (messages FR/EN), honeypot, délai de 3 s, limite par IP hachée, sauvegarde en base, Nodemailer. useActionState pour les états réels (envoi, succès, échec). Bouton « Copier » pour l'email.
Liste-moi les variables d'environnement à vérifier.
```

### R4 — Revue des chants

```
Lis CLAUDE.md, git log de la phase 4, DESIGN.md §7, §8 et §10.
Compare chaque chant à docs/prototype/luxe-4.html (captures 1440 + 375). Cherche les anti-patterns, les textes en dur et le contenu inventé. Liste courte des écarts par chant.
```

## Phase 5 — SEO, qualité, mise en ligne (S21 à S24)

### S21 — T23 · SEO complet 🧭

```
Lis CLAUDE.md puis la tâche T23 de docs/TASKS.md, PRD.md §8 bis et ARCHITECTURE.md §7. Utilise la skill seo.
Passe en Plan Mode. Métadonnées par page et par langue, hreflang + x-default, sitemap avec les projets, robots, images OG dynamiques dans le style luxe-4 (nuit, Cormorant, filet or), JSON-LD (Person, ProfilePage, WebSite, BreadcrumbList, CreativeWork).
```

### S22 — T24 · Robustesse

```
Lis CLAUDE.md puis la tâche T24 de docs/TASKS.md. Utilise la skill break-ui.
Teste : textes très longs, EN manquant, 0 / 1 / 9 projets, 12 outils, 7 escales, 0 témoignage, 0 question. Vérifie qu'il n'y a aucun débordement de 375 à 1920. Corrige, puis retire les données de test.
```

### S23 — T25 · Accessibilité et performance

```
Lis CLAUDE.md puis la tâche T25 de docs/TASKS.md. Lance /impeccable audit, web-quality-audit et vercel-react-best-practices.
Vérifie : contrastes en clair et en sombre (ciel compris), clavier dans le dossier, l'index et la lightbox, reduced-motion, effet du chargeur sur le LCP, Lighthouse mobile ≥ 95. Donne-moi les scores avant et après.
```

### S24 — T26 + T27 · Déploiement et lancement

```
Lis CLAUDE.md puis les tâches T26 et T27 de docs/TASKS.md et ARCHITECTURE.md §10 et §12.
Prépare la checklist Vercel (variables, cron /api/keepalive). Après mon déploiement, vérifie en production l'email, l'admin et la mise à jour sans redéploiement. Puis liste tous les [à fournir] restants dans la base et les messages.
```

👤 **Toi :** connecter le dépôt à Vercel, saisir les variables, remplir les vrais contenus (fiches projet de PRD Annexe A, planches, CV, dates, liens), Search Console + sitemap.

## Prompts de secours

**Tu approches de ta limite Pro en pleine tâche :**

```
Arrête-toi là. Note dans docs/TASKS.md, sous la tâche en cours, ce qui est fait, ce qui reste et les fichiers touchés. Ne commite pas.
```

**Reprendre après une interruption (nouvelle session) :**

```
Lis CLAUDE.md puis la tâche TXX de docs/TASKS.md et la note de reprise en dessous. Lance git status pour voir l'état, puis termine la tâche.
```

**Le rendu s'éloigne du prototype :**

```
Ce n'est pas le même rendu que docs/prototype/luxe-4.html. Regarde uniquement [la section concernée] dans le prototype, liste les différences, puis corrige-les une par une.
```

**Claude Code se réfère encore au Styx ou à l'ancien prototype :**

```
Stop. La direction est luxe-4 : seule docs/prototype/luxe-4.html fait référence, odyssee-prototype.html et luxe-1..3 sont des archives. Relis DESIGN.md §1 et reprends.
```

**Le plan proposé ne te convient pas :**

```
Non, change le plan : [ce que tu veux à la place]. Représente-moi le plan corrigé sans coder.
```

**npm run check échoue et Claude Code tourne en rond :**

```
Stop. Montre-moi la première erreur exacte, explique sa cause en deux lignes et propose un seul correctif ciblé. Ne touche à aucun autre fichier.
```

**Un bug trouvé plus tard, hors de la tâche en cours :**

```
Lis CLAUDE.md. Bug : [description, page, largeur d'écran, mode clair ou sombre]. Trouve la cause, propose un correctif minimal, et dis-moi si une tâche déjà cochée est concernée.
```

**Changer le design ou le contenu une fois le site fini :**

```
Lis CLAUDE.md et DESIGN.md §[section]. Je veux changer [ce qui change]. Mets d'abord à jour DESIGN.md (ou STORYBOARD.md), montre-moi le diff, puis applique dans le code.
```
