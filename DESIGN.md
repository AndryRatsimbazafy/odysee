# DESIGN.md — Portfolio Andry · « L'Odyssée »

> Étape 4 du workflow · v1.0 · 2026-10-15
> Source de vérité visuelle. Lue par Impeccable avant tout travail UI. Toute exception doit être justifiée ici.

---

## 1. Direction artistique

**Une Odyssée racontée sur un vase grec, avec le sourire.**

- **Inspiration** : la céramique grecque à figures noires et à figures rouges. Silhouettes, frises, aplats. Pas de marbre, pas de colonnes, pas de bustes.
- **Récit** : le site est un voyage en chants. Madagascar est Ithaque ; chaque section est une étape.
- **Ton** : luxueux par la retenue (beaucoup d'espace, peu de couleurs, typographie soignée), drôle par les détails (micro-textes, micro-interactions, easter eggs). L'humour ne gêne jamais la lecture.
- **Mots-clés** : luxueux · audacieux · drôle (discret) · créatif · narratif · authentique.

## 2. Couleurs

Une couleur principale : **le beige « parchemin »**. Une seule couleur d'accent : **la terre cuite**. L'or reste un ornement (traits fins), jamais une surface.

### Mode clair « Hélios » (figures noires)

| Token | Valeur | Usage |
|---|---|---|
| `--parchemin` | `#EFE4CF` | Fond principal |
| `--parchemin-2` | `#E6D7BB` | Surfaces secondaires, cartes, encarts |
| `--encre` | `#1B1612` | Texte, silhouettes, frises |
| `--encre-2` | `#4A4036` | Texte secondaire |
| `--terre` | `#9A4320` | Accent : CTA, liens, états actifs (texte et fonds) |
| `--terre-deco` | `#B4532A` | Accent décoratif uniquement (≥ 24 px ou non textuel) |
| `--or` | `#B8913F` | Filets, frise, ornements fins. Jamais pour du texte courant |

### Mode sombre « Nyx » (figures rouges)

| Token | Valeur | Usage |
|---|---|---|
| `--parchemin` | `#16120F` | Fond principal (le noir du vase) |
| `--parchemin-2` | `#221C17` | Surfaces secondaires |
| `--encre` | `#EFE4CF` | Texte, silhouettes |
| `--encre-2` | `#C2B49B` | Texte secondaire |
| `--terre` | `#D9784A` | Accent textes, liens, CTA |
| `--terre-deco` | `#C4643A` | Figures rouges décoratives |
| `--or` | `#C9A55A` | Ornements |

### Règles
- Contrastes vérifiés : encre/parchemin > 12:1 ; `--terre` sur parchemin ≈ 5,2:1 (clair) et ≈ 5,9:1 (sombre). `--terre-deco` et `--or` ne portent **jamais** de texte de moins de 24 px.
- Les chapitres ne changent **pas** de teinte : seule la frise et l'ornement changent. Variation tolérée : ±3 % de luminosité du parchemin entre chants, pour le rythme.
- Bouton principal : fond `--terre`, texte `--parchemin` (clair) / fond `--terre`, texte `#16120F` (sombre).
- Interdits : dégradés, verre dépoli, ombres portées colorées, néons, violet.

## 3. Typographie

| Rôle | Police | Notes |
|---|---|---|
| Display / titres | **Fraunces** (variable, axes `opsz`, `SOFT`, `WONK`) | Serif expressive. `WONK` activé sur les grands titres pour la touche ludique. |
| Texte courant | **Instrument Sans** | Lisible, sobre, ne concurrence pas Fraunces. |
| Code, navigation, métadonnées | **JetBrains Mono** | Navigation en commentaires de code (`// travaux`), coordonnées, dates. |

Chargement via `next/font` (auto-hébergé, `display: swap`, sous-ensembles `latin` + `latin-ext`).

### Échelle (fluide, `clamp`)
| Token | Mobile → Desktop | Usage |
|---|---|---|
| `--fs-mega` | 56 → 144 px | Nom dans le prologue |
| `--fs-h1` | 40 → 88 px | Titre de chant |
| `--fs-h2` | 28 → 48 px | Sous-titres |
| `--fs-h3` | 20 → 28 px | Titres de cartes |
| `--fs-body` | 17 → 19 px | Texte (interligne 1,6) |
| `--fs-small` | 14 → 15 px | Notes, légendes |
| `--fs-mono` | 12 → 13 px | Navigation, métadonnées (majuscules interdites sauf tampons) |

Longueur de ligne : 60–72 caractères. Un seul `h1` par page.

## 4. Espace et grille

- Unité de base 8 px. Échelle : 4, 8, 12, 16, 24, 32, 48, 64, 96, 128, 192.
- Grille 12 colonnes, marges latérales 16 px (mobile) → 64 px (desktop), largeur max du contenu 1280 px.
- **Asymétrie volontaire** : aucun chant n'utilise la même composition que le précédent (voir STORYBOARD.md).
- Rayons : 0 par défaut (esthétique céramique, aplats). Exception : pastilles et tampons ronds.

## 5. Élément signature : la frise

- Une **frise méandre** (grecque) en SVG, trait `--encre` ou `--or`, épaisseur 1,5 px.
- Elle se dessine au scroll (`stroke-dashoffset` lié à la progression) et **relie les chants** : départ des coordonnées 18°55′S dans le prologue, cadre des travaux, route du voyage, envol d'Hermès dans l'épilogue.
- Sous `prefers-reduced-motion` : frise affichée entière, sans animation.

## 6. Illustrations et iconographie

- **SVG géométriques maison**, style silhouette de vase : aplats `--encre` (clair) ou `--terre-deco` (sombre), détails par réserves (traits vides), aucune texture photo.
- Bibliothèque limitée et cohérente : chouette (Athéna), marteau et enclume (Héphaïstos), massue (Hercule), caducée et sandale ailée (Hermès), amphore, navire, labyrinthe, éclair (Zeus).
- Silhouettes simplifiées, épaisseur de trait unique, même angle de vue de profil — comme sur les vases.
- Icônes d'interface : Lucide (trait 1,5 px) uniquement pour les actions utilitaires (télécharger, lien externe, menu). Jamais d'emoji.
- **Aucune image générée par IA.**

## 7. Motion

Principes (skills Emil `animate` et `review-animations`) :

| Token | Valeur | Usage |
|---|---|---|
| `--dur-micro` | 160 ms | Survol, focus, petits changements d'état |
| `--dur-ui` | 240 ms | Ouvertures, bascules (Athéna ⇄ Héphaïstos, Hélios ⇄ Nyx) |
| `--dur-reveal` | 600 ms | Apparition d'un élément de récit |
| `--ease-out` | `cubic-bezier(0.16, 1, 0.3, 1)` | Entrées, réponses à l'utilisateur |
| `--ease-in-out` | `cubic-bezier(0.65, 0, 0.35, 1)` | Déplacements à l'écran |
| `--ease-spring` | ressort léger, 1 rebond max | Tampon « Disponible », exploits |

- **Scènes de scroll** : GSAP + ScrollTrigger, en `scrub` (liées au scroll, jamais à durée fixe). Pas de lissage du scroll natif.
- **Interactions** : CSS d'abord ; GSAP seulement si séquencement nécessaire.
- Animer uniquement `transform`, `opacity`, `clip-path` et `stroke-dashoffset`.
- Chaque chant initialise ses animations quand il entre dans le viewport et les détruit en sortant.
- **`prefers-reduced-motion`** : aucun pinning, aucun scrub, aucun parallaxe ; chaque chant s'affiche dans son état final ; les micro-interactions deviennent de simples fondus de 160 ms.
- Interdits : fondu par le bas répété sur chaque bloc, animations à l'entrée de page de plus de 800 ms, `ease-in` sur une réponse à l'utilisateur, rebonds multiples.

## 8. L'effet WebGL (un seul)

- **Où** : derrière le nom, dans le prologue uniquement.
- **Quoi** : une ondulation légère de la frise et du grain du parchemin qui suit le curseur, « la mer Égée sous le vase ».
- **Comment** : librairie **OGL** (légère), chargée en différé après le premier rendu, `<canvas>` décoratif `aria-hidden`.
- **Désactivé** si : `prefers-reduced-motion`, `saveData`, appareil modeste (≤ 4 cœurs), écran tactile sans survol, ou WebGL indisponible. Repli : SVG statique identique visuellement.
- Ne doit pas dégrader le LCP : le nom (texte HTML) est l'élément LCP, le canvas arrive après.

## 9. Les éléments fun (discrets)

Règle d'or : **l'humour ne bloque, ne masque et n'interrompt jamais rien.**

| Élément | Règle |
|---|---|
| Curseur divin | Desktop avec souris uniquement. Le symbole du chant accompagne le curseur système (jamais caché). Désactivé sous reduced-motion. |
| Amphore de progression | Petite (≤ 32 px), coin bas-droit, se remplit au scroll. Purement décorative (`aria-hidden`). |
| Exploits débloqués | Un par chant maximum, toast discret 3 s, sans son, région `aria-live="polite"`. Un clic sur l'amphore les désactive (choix mémorisé). |
| Personnages qui réagissent | Chouette qui cligne (survol de l'interrupteur), Hermès qui tapote du pied (formulaire vide 20 s). Animations ≤ 1 s, jamais en boucle infinie. |
| Easter eggs | Code Konami → éclair de Zeus (1 fois). Message dans la console du navigateur. Invisibles pour qui ne les cherche pas. |
| Micro-textes | Un clin d'œil par section au plus, dans les états vides, la 404, les confirmations. Jamais dans les titres principaux. |

## 10. Composants clés (aperçu)

- **Navigation** : barre fine en haut, `JetBrains Mono` : `// prologue`, `// chants`, `// travaux`, `// voyage`, `// contact`. Sélecteur FR/EN et bascule Hélios ⇄ Nyx (soleil / lune en silhouette).
- **Bouton principal** : rectangle sans arrondi, fond `--terre`, frise fine au survol.
- **Lien** : soulignement `--or` qui se dessine au survol.
- **Carte « travail »** : numéro en chiffres romains, titre Fraunces, résumé, technos en mono, cadre de frise. Variante « Scellé par Hadès » (confidentiel) et badge « Projet associatif ».
- **Tampon** : cercle `--terre`, texte mono en majuscules, légère rotation.
- **Focus** : contour 2 px `--terre` + décalage 3 px, toujours visible.

## 11. Anti-patterns interdits (garde-fous anti « vibe codé »)

- Hero centré avec badge au-dessus du titre ; « Hi, I'm Andry 👋 ».
- Grilles de 3 ou 4 cartes identiques ; tuiles d'icônes ; cartes dans des cartes.
- Grille de logos de technos ; barres ou cercles de niveau en %.
- Dégradés violets ou bleus, glassmorphism, ombres larges, bordures fines grises sur cartes blanches.
- Titres en italique serif « IA » par défaut, eyebrows en majuscules au-dessus de chaque titre, sections numérotées 01/02/03 génériques.
- Marbre, colonnes, bustes, police Cinzel, esthétique vaporwave.
- Textes génériques : « passionné », « solutions innovantes », « je transforme les idées en réalité », « n'hésitez pas à me contacter ».
- Toute image générée par IA.

## 12. Responsive

Points de contrôle : 375, 768, 1024, 1440 px. Sur mobile : pas de pinning long (scènes raccourcies ou converties en défilement vertical simple), curseur divin absent, WebGL absent, frise simplifiée.
