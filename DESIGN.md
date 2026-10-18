# DESIGN.md — Portfolio Andry « L'Odyssée » (direction luxe-4)

> v3.0 · 2026-10-16 · remplace la direction « Styx / vase grec » (v2).
> **Référence visuelle exécutable : `docs/prototype/luxe-4.html`.** S'en inspirer pour le rendu, le mouvement et les comportements ; le reconstruire proprement en composants React (ne jamais copier le fichier tel quel). Les anciens prototypes (`odyssee-prototype.html`, `luxe-1..3.html`) sont des archives : ne plus s'en servir.
> Lu par Claude Code et par Impeccable. Les textes viennent de la base ou de `messages/*.json`.

---

## 1. Concept

**Un portulan de nuit.** Le site est un atlas relié en planches : chaque section est un **chant** de l'Odyssée, la page se lit comme un voyage d'Ulysse d'Antananarivo (Ithaque de départ) jusqu'au retour (« Prochaine escale : votre équipe »). Ciel étoilé bleu nuit, gravures au trait or, typographie de livre ancien, annotations en marge.

- **Luxueux par la retenue** : fines lignes or, beaucoup de typographie, très peu d'ornements, aucune illustration « cartoon ».
- **Mythologie dans les textes** (Héphaïstos, Athéna, Hadès, Hermès, Tirésias, Charon en glossateur), pas dans des décors chargés.
- **Pas « vibe codé »** : une grille éditoriale stricte, des compositions différentes par chant et par dossier, des animations qui servent la lecture.
- Humour discret : les **notes de Charon** (gloses en marge, masquables), un clin d'œil maximum par section.

## 2. Couleurs (tokens)

Sombre par défaut (nuit) ; clair (ivoire) en alternative. Les noms de tokens sont ceux du prototype ; les reprendre tels quels dans `globals.css` et dans `@theme` Tailwind.

| Token | Sombre | Clair | Usage |
|---|---|---|---|
| `--nuit` | `#101723` | `#EAE2D2` | Fond de page |
| `--nuit-2` | `#151E2C` | `#E2D8C5` | Surfaces légères (dossier, table) |
| `--nuit-3` | `#1B2534` | `#D9CDB6` | Emplacements d'image, survols |
| `--regle` | `#1D2737` | `#DCD1BC` | Réglures de fond, lignes très faibles |
| `--filet` | `#2B3647` | `#C3B497` | Filets, bordures, séparateurs |
| `--ivoire` | `#EAE2D2` | `#131A26` | Texte principal, titres |
| `--cendre` | `#B7BEC9` | `#434D5C` | Texte secondaire, paragraphes longs |
| `--ardoise` | `#949FB0` | `#4F5A6A` | Annotations, légendes, mono |
| `--or` | `#B79A65` | `#7A5F2E` | **Seul accent** : gravures, kicker, boutons |
| `--or-clair` | `#D2B985` | `#6A5226` | Survol, focus, mots en exergue |
| `--todo` | `#C99872` | `#8E4F2A` | Marqueur `[à fournir]` (visible en dev/admin et sur le site tant que le contenu manque) |

- **Contrastes vérifiés** sur le pire fond du ciel (`#1a2b4e`) : ivoire 10.8, cendre 7.5, ardoise 5.2, or 5.2, or-clair 7.3, todo 5.4. Ne jamais éclaircir le ciel ni assombrir ces tokens sans recalculer (AA = 4.5).
- Ciel (sombre) : dégradés radiaux bleus **uniquement sur la couche de ciel fixe** (§6), jamais sur le contenu. En clair, le ciel devient très pâle (encre à faible opacité).
- Les anciens tokens v2 (terre cuite, figure noire, `--on-terre`, `--peau`, `--pierre`, `--grave`, parchemin d'objet, sceau, lingot) sont **supprimés**.

## 3. Typographie

| Rôle | Police | Réglages |
|---|---|---|
| Display (titres, nom, chiffres romains) | **Cormorant Garamond** 500/600, italique 400 | `line-height:.95`, `letter-spacing:-.005em`, `text-wrap:balance` |
| Texte | **Instrument Sans** 400/600 | 17 px, `line-height:1.65` |
| Annotations, kicker, légendes | **JetBrains Mono** 400 | 11–12 px, `letter-spacing:.04–.14em`, kicker en capitales |

- Chargées via `next/font/google` (`latin`, `latin-ext`, `display:swap`). Fraunces est retirée.
- Échelle display : nom du hero `clamp(64px, 11vw, 168px)` ; titres de chant `clamp(44px, 6vw, 92px)` ; titres de dossier `clamp(40px, 5.5vw, 84px)`.
- Mots en exergue : italique display + `--or-clair`. Folios et numéros : chiffres romains (générateur `roman(n)`, jamais une liste en dur).

## 4. Mise en page

- **Pleine largeur, aucun conteneur centré.** Gouttière `.gut` : `clamp(16px, 5vw, 88px)` ; à gauche **≥ 108 px dès 821 px** pour laisser la rose des vents. `env(safe-area-inset-*)` respecté.
- **Grille de 12 colonnes** (`column-gap: clamp(16px, 2vw, 32px)`). Chaque chant : **marge annotée** `.marg` (colonnes 1–3 : numéro de chant, folio en italique, épigraphe, note) + **composition** colonnes 4–12. Sous 820 px, la marge passe au-dessus.
- Espacement vertical serré (pas de grands vides) : `padding-block: clamp(72px, 9vw, 128px)` par chant, routes incluses.
- Pas de cards : les blocs sont des **planches** (filets fins, légendes « Fig. n »), des **tables** (journal de bord), des **index de livre** (points de conduite), des **fiches d'archive**.
- Breakpoints de vérification : 375, 768, 1024, 1440, 1920. Aucun débordement horizontal (`overflow-x:hidden` sur `body` n'excuse pas un débordement : le corriger).

## 5. Gravures (illustrations)

- **SVG au trait faits main**, `stroke: var(--or)`, `stroke-width:1.2` (`.fine` = .6), bouts ronds, pas de remplissage sauf points. Aucune image générée par IA, aucun clipart, aucun emoji.
- Bibliothèque `src/components/engravings/` : médaillon de carte (navire, graticule, Antananarivo 18°53′ S 47°30′ E), marteau, rameau d'olivier, emblèmes de projet (`maze`, `hydra`, `herald`, `boat`, + réserve), armes de l'arsenal (`foudre`, `egide`, `trident`, `fil`, `caducee`, `casque`, `harpe`, `arc`, `marteau`, `lyre`, `bouclier`, `ancre`), barque, rose des vents, sceau d'Hadès.
- Attribution : par champ (`emblem`, `weapon`) ; sinon **la suivante de la réserve** dans l'ordre (jamais aléatoire, jamais deux fois la même à la suite).
- Tracé : `pathLength="1"` + `stroke-dashoffset` 1 → 0 à l'apparition.

## 6. Couches globales

1. **Ciel** (fixe, derrière tout, `aria-hidden`, `pointer-events:none`) : dégradés radiaux bleus ; champ d'étoiles (~820 points en 3 couches) ; **12 constellations du zodiaque + Orion** à grande échelle (×4) avec halos, lignes à faible contraste, noms en capitales espacées. Mouvement : flottement idle lent, parallaxe au scroll par couche, scintillement de quelques étoiles. Le ciel ne doit **jamais** gêner la lecture (opacités du prototype, sauf halos des constellations à .15 au lieu de .28 et zodiaque clair à .4 au lieu de .55, pour le contraste — T11).
2. **Chargeur** (« Embarquement · Antananarivo ») : barque qui se dessine, mer qui défile, aiguille de boussole, citation d'Homère, barre de progression réelle (fonts + load). Durée mini 1.4 s (400 ms en reduced-motion), sécurité CSS à 8 s. **Seulement à la première visite de la session** et uniquement si JS est actif (sans JS : jamais affiché). Ne doit pas dégrader le LCP (vérifier en T25 ; raccourcir si besoin).
3. **Curseur** (anneau + point, états `link` / `view` / `text`) : uniquement `pointer:fine`, désactivé en reduced-motion ; le curseur natif reste disponible pour l'accessibilité (pas de `cursor:none` sur les champs).
4. **Rose des vents** (bas gauche, ≥ 821 px ; dans l'en-tête sur mobile) : l'aiguille pointe le chant courant ; au clic, ouvre l'**index des chants** (overlay plein écran, liste numérotée, piège de focus, Échap).
5. **En-tête** fixe : marque, liens, CV, FR/EN, thème, bouton **« Charon »** (affiche/masque les gloses, `aria-pressed`, mémorisé). Devient opaque (`--nuit` + filet) après le hero.

## 7. Composition par section (détail : docs/STORYBOARD.md)

| Section | Composition |
|---|---|
| Embarcadère (hero) | Nom en display géant, rôle, pitch (h1), CTA ; médaillon gravé de la carte ; **bande d'identité** (Fonction · Port d'attache + horloge locale en direct · Disponibilité · Contact) |
| Chant I · Deux divinités | Héphaïstos (large, le métier) & Athéna (étroite, le conseil), filet « & » ; gravures marteau / olivier ; « Hors du travail » (Rotaract) |
| Chant II · Les épreuves | **Carte** collante (points générés, route, barque qui avance) + **aperçus d'archives** alternés ; « Lire les archives » ouvre le **dossier** |
| Chant III · L'arsenal | **Index de livre** (points de conduite, renvois aux épreuves) + **médaillon-sanctuaire** de l'arme de l'outil survolé/actif |
| Chant IV · Les escales | **Journal de bord** (table : quand, port, lieu, poste, ce que j'y ai fait ; « en cours ») |
| Chant V · L'oracle | FAQ recruteurs en `details/summary` ; voix de Delphes (témoignages) seulement s'il y en a |
| Chant VI · Écrire à Hermès | Formulaire honnête + contact direct (copier l'email, liens) |
| Ithaque (épilogue) | « Prochaine escale : votre équipe. », CTA contact + CV |

**Routes entre chants** : un filet pointillé avec une petite barque qui avance au scroll (scrub), le nom du chant suivant (`.to`, retour à la ligne ≤ 600 px).

## 8. Le dossier d'archive (étude de cas)

- S'ouvre en **plein écran** par-dessus la page (fond `--nuit`, en-tête du dossier : fil d'Ariane « Archives · Dossier IV sur N », fermer). Le reste de la page est `inert` ; le focus va au titre ; à la fermeture, il revient au bouton d'origine. URL propre (`/[locale]/projects/[slug]`) ; Échap et le bouton retour ferment.
- **Composition d'ouverture selon `layout`** :
  - `sealed` : texte + fiche, **« Pli scellé par Hadès »** (sceau gravé + message de confidentialité + bouton) ;
  - `split` : avant / après côte à côte ;
  - `gallery` : grande image d'ouverture ;
  - `process` : « Les choix, d'abord » (les décisions avant tout).
- Sections numérotées `§ n` : Contexte et problème (+ note de Charon) · Ma contribution · Décisions et compromis (sauf `process`) · Planches (« Ce qui peut être montré » si scellé) · Instruments et résultats. Ordre variable selon le layout (prototype `renderDossier`).
- **Planches** : 4 à 5 images, ratios propres (`16/10`, `1/1`, `4/5`, `21/9`, `3/4`, `16/9`), légende « Fig. n · nature — légende ». Emplacement vide = cadre `--nuit-3` + libellé `[à fournir]`. **Lightbox** : flèches, Échap, swipe, piège de focus, compteur.
- Pied : contact (message de confidentialité exact pour un projet scellé, voir PRD F-PRO-05), liens publics seulement s'ils existent, dossier précédent / suivant, « Retour aux archives ».
- Le **message de confidentialité** est toujours ce texte exact (FR) : « Certains projets ne peuvent être présentés publiquement pour des raisons de confidentialité. Pour en savoir davantage sur mon rôle, les choix techniques ou les problématiques rencontrées, n’hésite pas à me contacter. » + bouton « Me contacter pour en savoir plus ».

## 9. Mouvement

- Courbe unique `--ease: cubic-bezier(.16,1,.3,1)`. Durées : 0.5–0.9 s pour les apparitions, 1.2–1.8 s pour les tracés.
- Animer **uniquement** `transform`, `opacity`, `clip-path`, `stroke-dashoffset` (exception tolérée : `filter: brightness` sur les vignettes, en `fromTo` depuis 1).
- Catalogue : titres **mot à mot** (masque + translation), apparitions décalées (stagger 60–90 ms), tracés de gravures, carte qui s'allume (points `on`/`done`, segments tracés), barque sur la route (scrub), parallaxe du ciel, survol des lignes d'index, ouverture du dossier (voile + montée), lightbox (fondu + échelle).
- **Lenis** pour le défilement ; `data-lenis-prevent` dans le dossier et l'index. Les sauts d'ancre utilisent `window.scrollTo({behavior:'smooth'})` (ou `lenis.scrollTo`) avec décalage d'en-tête.
- **`prefers-reduced-motion`** : état final immédiat, pas de Lenis, pas de curseur, pas de parallaxe, chargeur réduit à un fondu court.
- Les animations ne cachent jamais le contenu au premier rendu côté serveur (le texte est visible sans JS).

## 10. Anti-patterns (refusés)

- Cards de site (ombre, coins arrondis, fond blanc), grilles de vignettes identiques, badges de compétences, barres de niveau en %.
- Dégradés sur le contenu, ombres portées, glassmorphism, néon, glow sur le texte.
- Illustrations « cartoon », personnages, clipart, emoji décoratifs, images IA, marbre, colonnes.
- Plus d'un accent de couleur ; or utilisé en aplat sur de grandes surfaces.
- Texte en dur dans les composants ; contenu inventé (projets, chiffres, témoignages, captures).
- Coordonnées en dur pour la carte, les routes ou les points (tout est généré depuis les données et le DOM).
- Animations qui retardent l'accès à l'information ; défilement détourné (scroll-jacking) ; carrousels automatiques.

## 11. Admin

shadcn/ui, sobre, mêmes tokens de couleur et polices (mode sombre par défaut), **aucun** élément narratif (pas de ciel, de curseur, de gravure).
