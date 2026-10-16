# DESIGN.md — Portfolio Andry · « L'Odyssée, la traversée du Styx »

> Étape 4 du workflow · v2.0 · 2026-10-16
> Source de vérité visuelle. Lue par Impeccable avant tout travail UI.
> **Référence visuelle exécutable : `docs/prototype/odyssee-prototype.html`** (ouvrir dans un navigateur). En cas de doute, le prototype fait foi pour le rendu et le mouvement ; ce document fait foi pour les règles.

---

## 1. Direction artistique

**La page est le cours du Styx.** Une barque, menée par Charon (le passeur, narrateur) et transportant Andry (le héros), descend la rivière au rythme du scroll. Chaque section est une **rive** où la barque fait escale. Chaque rive est un **objet de l'univers** (plaque, tesson, assiette, parchemin, carte postale), jamais une « card » de site web.

- **Inspiration** : céramique grecque à figures noires (silhouettes noires sur terre cuite), frises de méandres. Pas de marbre, pas de colonnes, pas de bustes.
- **Ton** : luxueux par la retenue, narratif, drôle par les détails (répliques de Charon, easter eggs). L'humour ne gêne jamais la lecture.
- **Équilibre** : un vrai site (navigation, CV, contact, contenu lisible sans animation) porté par un récit. Pas de plein écran, pas de son.

## 2. Couleurs

Une couleur principale : **le beige parchemin**. Un seul accent d'interface : **la terre cuite**. Les objets de l'univers ont leurs propres couleurs, **constantes dans les deux modes** (ce sont des objets peints).

### Tokens d'interface (s'inversent entre les modes)

| Token | Hélios (clair) | Nyx (sombre) | Usage |
|---|---|---|---|
| `--parchemin` | `#EFE4CF` | `#16120F` | Fond de page |
| `--parchemin-2` | `#E4D3B4` | `#241D17` | Surfaces secondaires |
| `--encre` | `#1B1612` | `#EFE4CF` | Texte, silhouettes de la barque et de la forge |
| `--encre-2` | `#4A4036` | `#C2B49B` | Texte secondaire |
| `--terre` | `#9A4320` | `#D9784A` | Accent : boutons, liens, états actifs |
| `--or` | `#9C7A33` | `#C9A55A` | Filets, soulignés, ornements fins |
| `--lueur` | `#E2B655` | `#F2C76A` | Lanterne, yeux de Charon, métal rougi |
| `--eau` | `#1B1612` | `#C4643A` | Rivière (lit à 9 % d'opacité, tracé d'encre 3 px) |
| `--bois` | `#6B4A2E` | `#8A6644` | Corde du pinax |
| `--on-terre` | `#EFE4CF` | `#16120F` | Texte posé sur `--terre` (bouton principal) |
| `--peau` | `#D9A877` | `#C99467` | Visages et mains de Charon et d'Andry |
| `--pierre` | `#D9CDB8` | `#3A322A` | Stèle, bornes de la carte |
| `--grave` | `#3D342B` | `#E6D9C2` | Texte gravé dans la pierre |
| `--pierre-hl` | `rgba(255,255,255,.6)` | `rgba(0,0,0,.55)` | Relief de gravure (`text-shadow` 1 px, pas une ombre portée) |

### Couleurs d'objets (constantes)

| Nom | Valeur | Usage |
|---|---|---|
| Terre cuite d'objet | `#C9703F` | Pinax, tessons, assiettes, timbres |
| Figure noire | `#1B1612` | Figures et méandres peints sur la terre cuite |
| Parchemin d'objet | `#E8D2A2` / encre `#2A1A0C` / méandre `#5A3A1E` | Cadres à méandres (ΤΕΧΝΑΙ, lettre, modale) |
| Parchemin d'objet (suite) | surface `#DEC48E`, terre `#8A3A18`, or `#8A6A2A`, image scellée `#B89A68`, placeholder `#8A6E4E` | Tokens surchargés dans les cadres (mode clair forcé), galerie, champs de la lettre |
| Carte postale | fond `#F2E6CC`, encre `#2A2018`, filet `#CDB78F`, mono `#7A5A30` | Escales |
| Cire rouge | `#7E2416` | Sceaux « Scellé par Hadès », bouton d'envoi |
| Olive | `#4E5A2E` | Sceau « Disponible » |
| Texte de sceau | `#F3E8D2` | Inscriptions sur cire rouge et olive |
| Lingot chauffé | `#FFF0C9` → `--lueur` | Forge : départ de l'animation du métal |

Règles : contrastes texte ≥ 4.5:1 vérifiés ; texte figure noire sur terre cuite uniquement sur `#C9703F` (5:1) ; aucun dégradé, aucun glassmorphism, aucune ombre portée décorative.

## 3. Typographie

| Rôle | Police | Notes |
|---|---|---|
| Display, narration, titres, boutons | **Fraunces** (variable, `SOFT`, `WONK`) | Narrateur en italique 320 |
| Texte courant | **Instrument Sans** | |
| Métadonnées, chapitres, navigation, inscriptions | **JetBrains Mono** | |

Échelle (fluide) : nom 60 → 176 px (17vw sous 900 px) · narrateur 26 → 40 px · titre de rive 34 → 58 px · corps 18 px (interligne 1.6) · mono 11–13 px. `next/font`, `display: swap`.

## 4. Mise en page : la rivière et les rives

- **Pleine largeur** : aucun conteneur centré ni `max-width` sur la page ; le monde occupe toute la largeur de l'écran, avec une marge latérale `clamp(16px, 5vw, 112px)`. Seuls les textes longs gardent une largeur de lecture (≈ 32–40 em) à l'intérieur de leur rive. Les rives alternent **gauche / droite** automatiquement selon leur ordre (`index % 2`).
- Rive : largeur `clamp(320px, 42%, 760px)`, collée à la marge de son côté, marge basse `22vh` (16vh mobile).
- **La rivière se calcule depuis le DOM** : pour chaque rive, deux points (haut et bas de la rive) côté opposé, **au milieu de l'espace libre** entre le bord de la rive et le bord de l'écran (calculé depuis `getBoundingClientRect`), reliés par des courbes de Bézier verticales. Elle longe chaque rive sur toute sa hauteur et **ne traverse que dans les espaces vides**. Ajouter une rive (projet, section) redessine la rivière : aucune coordonnée en dur.
- Mobile (< 900 px) : rivière droite à 30 px du bord, lit 36 px, contenu décalé de 78 px, barque 74 px.

## 5. La barque, Charon et Andry

- **SVG en ligne** (voir prototype) : Charon encapuchonné (yeux qui luisent, lanterne, perche), Andry (tête ronde, casque à plumet, portable lumineux), coque à œil peint.
- Position : la barque suit la rivière au point correspondant au milieu de l'écran ; elle s'incline selon la pente et **se retourne** quand la rivière change de direction.
- Vie : tangage continu lent, plumet / tête / perche réagissent à la vitesse du scroll, clignement aléatoire, salut de la main et bouche qui parle à chaque nouvelle réplique.
- **Cartouche de Charon** (la narration) : cadre droit à double filet, texte Fraunces italique, en-tête « CHARON, PASSEUR » en mono. Il cherche une place libre autour de la barque (au-dessus à droite, au-dessus à gauche, à droite, à gauche) **sans jamais chevaucher une rive, la navigation, le ponton ou la barque** ; sinon il s'efface. Trait de rappel vers la barque uniquement en position au-dessus. Mobile : bandeau bas, masqué sur l'accueil, affiché 4,5 s à chaque réplique.

## 6. Bibliothèque d'objets (composants de l'univers)

| Objet | Où | Règles |
|---|---|---|
| **Pinax** (plaque votive suspendue) | Accueil (nom) | Terre cuite, bord noir 7 px, frises de méandres haut et bas, deux trous, corde vers un clou ; se balance à l'arrivée |
| **Sceau de cire** | « Disponible » (olive), « Scellé par Hadès » (rouge) | Forme légèrement irrégulière, texte mono capitales |
| **Ponton** | Départ de la rivière | Silhouettes noires, pancarte noire gravée « Départs pour l'Hadès · toutes les 5 minutes » côté rive |
| **Tesson** (ostrakon) | Épreuves (projets) | Bords cassés (`clip-path`), padding ≥ 8 % pour que le texte reste dans la forme, scène de bataille + **emplacement de capture** |
| **Assiette décorative** | Arsenal (skills) | Bord noir, anneau de méandres, centre terre cuite, petit pied ; une **arme légendaire** par techno |
| **Cadre à méandres** (parchemin) | ΤΕΧΝΑΙ, lettre de contact, modale projet | Fond `#E8D2A2`, frises de méandres tracées à la main (filtre SVG de rugosité) en haut et en bas |
| **Carte postale** | Escales (expériences) | Message signé à gauche, timbre illustré + tampon postal + adresse à droite ; inclinaison alternée |
| **Carte de navigation** | Escales | Route pointillée entre ports (petites stèles numérotées), navire qui avance au scroll |
| **Trépied de Delphes** | Oracles | Fumée qui respire, nouvelle prophétie au clic |

### Armes légendaires (assiettes)

React → la foudre de Zeus · TypeScript → l'égide d'Athéna · Node.js → le trident de Poséidon · Git → le fil d'Ariane · Next.js → le caducée d'Hermès · Supabase → le casque d'Hadès. **Réserve pour toute techno ajoutée** : harpè de Persée, arc d'Artémis, marteau d'Héphaïstos, puis on recycle. Le champ `arme` est optionnel en base ; sans valeur, on prend la suivante de la réserve.

### Scènes de bataille (tessons)

Labyrinthe + fil d'Ariane + Minotaure · Hydre dont une tête est tranchée puis repousse · Héraut qui sonne la trompe devant la foule · Barque construite au marteau qui prend la mer. Un projet sans scène définie reçoit la suivante dans cet ordre.

### Timbres (cartes postales)

Navire, chouette, amphore, soleil levant, en boucle.

## 7. Boutons et contrôles

- **Bouton principal** : plaque terre cuite à **coins taillés** (`clip-path` octogonal 9 px), Fraunces 18 px, aucune rotation, survol = fond encre.
- **Bouton secondaire / lien d'action** : texte Fraunces souligné d'or 1.5 px, survol = terre cuite.
- **« Lire l'épreuve »** : Fraunces italique 20 px, petit méandre fléché, souligné d'or ; le méandre glisse au survol.
- **Onglets** (Athéna / Héphaïstos) : texte souligné, actif = terre cuite italique.
- **Navigation** : cadre droit à double filet (bordure encre + filet or intérieur), liens mono.
- Interdits : contours « à la main », rotations, rebonds, baguettes de bois, formes bulle de BD.

## 8. Motion

| Token | Valeur |
|---|---|
| `--dur-micro` | 160–250 ms (survols, onglets) |
| `--dur-reveal` | 600–900 ms (apparitions) |
| `--ease-out` | `cubic-bezier(.16,1,.3,1)` |
| Boucles d'ambiance | `sine.inOut`, 1–2,5 s |

- **GSAP + ScrollTrigger** pour tout ce qui suit le scroll ; **Lenis** pour un scroll fluide (désactivé sous `prefers-reduced-motion`, `data-lenis-prevent` sur toute zone qui défile seule, comme la modale).
- Narrateur : mots qui s'allument un à un (`scrub`).
- Animations **sobres** : pas de rebond élastique sur le contenu, pas d'animation qui cache l'information. Scènes jouées seulement quand elles sont visibles (pause hors écran).
- Forge : Héphaïstos lève le marteau, frappe, quelques étincelles, le four rougeoie. Assiettes : rotation douce à l'arrivée, animation propre à chaque arme au survol / focus.
- Escales : cartes postales qui arrivent alternativement de gauche et de droite, tampon postal qui frappe.
- `prefers-reduced-motion` : aucun scrub, aucune boucle ; tout est affiché dans son état final ; la barque reste positionnée sur la rivière.

## 9. Fun (discret)

Répliques de Charon (une par rive, plus des répliques contextuelles : lecture d'un projet scellé, envoi de la lettre, oboles) · exploit Athéna/Héphaïstos · « Bien essayé » au survol d'un projet scellé · obole lancée à Charon en épilogue (compteur local) · message dans la console · 404 « labyrinthe ». Jamais de son, jamais de pop-up.

## 10. Anti-patterns interdits

Hero centré avec badge ; grilles de cartes identiques ; grilles de logos ; barres de niveau ; tuiles d'icônes ; dégradés ; glassmorphism ; ombres larges ; bordures arrondies génériques ; boutons ou bulles « cartoon » ; marbre / colonnes / Cinzel ; textes génériques (« passionné », « solutions innovantes ») ; **toute image générée par IA**.

## 11. Responsive

Points de contrôle : 375, 390, 768, 920, 1000, 1280, 1440, 1920 px (le site s'étire jusqu'au bord à toutes les largeurs). Aucun défilement horizontal. Sous 560 px : cartes postales empilées, galerie en 2 colonnes, sceau « Disponible » au-dessus de l'accroche. Sous 520 px : assiettes en 2 colonnes, ΤΕΧΝΑΙ en 1 colonne. Vérifier à chaque rive : la rivière, la barque et le cartouche ne chevauchent jamais le contenu.
