# STORYBOARD.md — Portfolio Andry · « L'Odyssée »

> Étape 4 du workflow · v1.0 · 2026-10-15
> Décrit chaque chant : objectif, contenu (source admin), mise en page, animation, version mobile et version « mouvement réduit ».
> Claude Code construit **un chant par session**, dans l'ordre ci-dessous, en relisant DESIGN.md.
> Les micro-textes sont des propositions en FR ; la version EN sera rédigée avec Andry. Rien de ce qui est marqué `[À REMPLACER]` ne doit partir en production tel quel.

---

## 0. Éléments globaux

| Élément | Description |
|---|---|
| Navigation | `// prologue · // chants · // travaux · // voyage · // contact` + FR/EN + Hélios ⇄ Nyx. Se masque au scroll vers le bas, réapparaît au scroll vers le haut. |
| Frise | Fil continu qui se dessine sur toute la page (voir DESIGN §5). |
| Amphore | Progression de lecture, bas-droit. Clic = activer / couper les exploits. |
| Curseur divin | Symbole du chant en cours (desktop souris uniquement). |
| Exploits | 1 par chant, toast discret. Textes ci-dessous. |
| Console | `console.log` : « Un dev qui ouvre la console ? Tu es des nôtres. Le code est sur GitHub. » |
| Konami | ↑↑↓↓←→←→BA → éclair de Zeus sur la frise, une fois. Exploit : « Exploit : réveiller Zeus. Il n'était pas content. » |

---

## Prologue — *L'Odyssée d'Andry* (hero)

**Objectif** : en moins de 10 s, le RH sait qui, quoi, disponibilité, CV.

**Contenu (admin : Profile)** : nom, titre, accroche, disponibilité, CTA, lien CV.

**Mise en page** : asymétrique. Nom en `--fs-mega` Fraunces aligné à gauche, débordant légèrement de la grille. À droite, en mono : `18°55′S · 47°31′E — Ithaque, version Antananarivo`. Sous le nom : titre « Lead Front-End Developer — React / TypeScript » et accroche (1 ligne). Tampon rond « DISPONIBLE · REMOTE » posé de travers. CTA : « Voir les travaux » (principal) et « Télécharger le CV » (lien).

**Animation** :
1. Chargement : le nom apparaît par masque (clip-path), lettre à lettre, 600 ms au total.
2. Le tampon frappe la page (ressort, 1 rebond) à 700 ms.
3. WebGL : ondulation légère sous le nom, chargée après coup.
4. Au scroll : la frise part du point de coordonnées et file vers le chant I.

**Mobile** : nom sur 2 lignes, tampon sous le titre, pas de WebGL.
**Mouvement réduit** : tout est affiché d'emblée.

**Accroche proposée** : « Je conçois et je mène des interfaces React solides. Depuis Madagascar, pour des équipes partout. »

---

## Chant I — *Deux divinités tutélaires* (à propos)

**Objectif** : la personne derrière le dev. Le Lead Front d'abord ; l'AMOA comme un plus qui l'aide à comprendre le métier.

**Contenu (admin : Profile + Engagement)** : photo, bio, localisation, langues, liens sociaux, encart Rotaract.

**Mise en page** : photo à gauche dans un cadre de frise (format vertical), texte à droite décalé vers le bas. Au-dessus du texte, l'interrupteur **Athéna ⇄ Héphaïstos** (deux silhouettes) qui réécrit le paragraphe central. **Héphaïstos est actif par défaut** (c'est lui que voit un visiteur pressé) ; Athéna est le bonus qu'on découvre en basculant :
- **Héphaïstos (Dev)** : architecture front, React/TypeScript, qualité de code, lead d'équipe.
- **Athéna (AMOA)** : recueil du besoin, spécifications, dialogue entre métier et technique.

Notes en marge (mono, petit) : langues, fuseau horaire, « remote depuis X ans ».

**Encart « À l'agora »** (bas de chant, discret, `--parchemin-2`) :
> Rotaract Club d'Ivandry · intronisé en 2020.
> Six ans, sept fonctions : responsable effectif, image publique, actions, secrétaire, protocole, **président (2025-2026)**, vice-président (2026-2027).
> Ce que j'y ai appris : animer une équipe de bénévoles, organiser, tenir des délais sans budget.
Lien discret vers les travaux associatifs.

**Animation** : la photo se « développe » (opacité + léger flou → net) en entrant ; le paragraphe change par fondu croisé de 240 ms à la bascule ; la chouette cligne au survol de l'interrupteur.

**Exploit** : « Exploit : a rencontré les deux dieux. Aucun n'a gagné. »

**Mobile** : photo au-dessus, interrupteur pleine largeur.
**Mouvement réduit** : bascule instantanée, photo nette d'emblée.

---

## Chant II — *L'arsenal d'Héphaïstos* (skills & technos)

**Objectif** : la stack en 5 secondes, sans grille de logos.

**Contenu (admin : Technology, Skill)** : technos par catégorie, années d'usage, compétences.

**Mise en page** : une **phrase** en grand Fraunces, sur plusieurs lignes, dont les technos sont des mots interactifs :
> « Je forge des interfaces en *React* et *TypeScript*, je les fais tourner sur *Next.js*, je parle à *Node.js* et *Supabase*, et je garde *Git* sous le coude. »
Au survol / toucher : infobulle mono « 6 ans · usage quotidien ». En dessous, les **compétences** en liste à deux colonnes, chacune précédée d'un petit outil en silhouette (lead technique, architecture front, revue de code, AMOA / spécifications…).
Lien « Voir toute la forge » qui déplie la liste complète par catégorie (Front, Back, Outils, IA).

**Animation** : les mots-technos s'allument (couleur `--terre`) un à un au scroll (scrub) ; étincelles discrètes au survol.

**Exploit** : « Exploit : a inspecté la forge sans se brûler. »

**Mobile** : phrase plus courte, infobulles au toucher.
**Mouvement réduit** : technos déjà en couleur.

---

## Chant III — *Les travaux* (projets)

**Objectif** : convaincre le CTO et le client par des études de cas.

**Contenu (admin : Project)** : 6 à 8 projets, ordre défini dans l'admin.

**Mise en page** : section épinglée (desktop). Les travaux arrivent comme des tablettes posées sur une table, légèrement décalées, numérotées en chiffres romains. Chaque carte : numéro, titre, résumé d'une ligne, technos en mono, visuel. Sous-titre humoristique facultatif par projet (champ admin), ex. « Travail n° III : dompter un formulaire de 40 champs ».
- **Confidentiel** : badge « Scellé par Hadès », visuel flouté, bandeaux de censure sur le nom du client. Survol : « Bien essayé. »
- **Associatif** (Rotaract) : badge « Projet associatif ».

Clic → page détail, transition View Transitions (la carte s'agrandit en en-tête de la page).

**Page détail `/[locale]/projects/[slug]`** : en-tête (titre, rôle, période, stack), puis 5 blocs : Contexte · Mon rôle · Défis · Solutions · Résultats. Galerie. Liens démo/repo. Navigation travail précédent / suivant. Fil d'Ariane.

**Animation** : desktop, les cartes défilent horizontalement pendant que la section est épinglée (scrub).

**Exploit** : « Exploit : a vu tous les travaux. Hercule en a fait douze, mais il ne codait pas. »

**Mobile** : liste verticale, sans épinglage.
**Mouvement réduit** : grille statique à deux colonnes décalées.

---

## Oracles — *Paroles d'oracles* (témoignages)

**Objectif** : preuve sociale pour le RH et le client.

**Contenu (admin : Testimonial)** : citation FR/EN, nom, rôle, entreprise (ou anonymisé), ordre.

**Mise en page** : une citation à la fois, en grand Fraunces italique, gravée entre deux frises ; navigation par flèches et points. Pas de carrousel automatique.

**Contenu de départ `[À REMPLACER]`** (fictif, à remplacer par de vrais retours avant mise en ligne) :
1. « Andry a compris notre besoin avant même qu'on l'ait fini de l'écrire. » — *Responsable produit, client SaaS*
2. « Un lead qui relit le code de l'équipe avec exigence et bienveillance. » — *Développeur, équipe front*
3. « Fiable, carré, et toujours une longueur d'avance sur les délais. » — *Chef de projet, ESN*

**Animation** : changement de citation par fondu 240 ms.
**Mouvement réduit** : citations listées les unes sous les autres.

---

## Chant IV — *Le voyage* (parcours)

**Objectif** : le parcours en un coup d'œil.

**Contenu (admin : Experience)** : entreprise, poste, période, lieu/remote, description, technos.

**Mise en page** : la frise devient une **route de navigation** façon carte antique. Chaque expérience est une escale : port (entreprise), dates en mono, poste, 2 lignes de description, technos. Le petit navire avance sur la route avec le scroll.

**Animation** : desktop, déplacement horizontal épinglé ; le navire suit la progression.

**Exploit** : « Exploit : a fait tout le voyage. Ulysse a mis dix ans, toi deux minutes. »

**Mobile** : route verticale, escales empilées.
**Mouvement réduit** : route statique, navire à l'arrivée.

---

## Épilogue — *Invoquer Hermès* (contact)

**Objectif** : convertir. Formulaire simple et rassurant.

**Contenu (admin : Profile, SocialLink)** : email de contact, liens, rappel de disponibilité.

**Mise en page** : à gauche, le titre « Un message pour moi ? Hermès s'en charge. » et les liens (LinkedIn, GitHub, Malt, CV). À droite, le formulaire en forme de lettre : nom, email, objet (CDI / Freelance / Autre), message, honeypot invisible.

**Comportement** :
- Validation en direct, erreurs en clair (« Il manque une adresse email valide. »).
- Formulaire vide 20 s → Hermès tapote du pied (une fois).
- Envoi réussi : Hermès s'envole avec la lettre, confirmation « Message envoyé. Réponse sous 48 h, décalage horaire compris. »
- Échec : « L'envoi a échoué. Réessayez, ou écrivez-moi directement à [email]. »

**Exploit** : « Exploit : a invoqué Hermès. Il est déjà parti. »

**Mouvement réduit** : confirmation sans envol.

---

## Pied de page

Frise de clôture, mention « Conçu et codé par Andry, avec Next.js et un peu d'ambroisie. », liens, FR/EN.

---

## 404 — *Perdu dans le labyrinthe*

« Cette page s'est perdue dans le labyrinthe. Le Minotaure dément toute implication. » Silhouette de labyrinthe, bouton « Retour au prologue ». Bilingue.

---

## Ordre de construction (Claude Code)

1. Fondations : tokens DESIGN, polices, thème Hélios/Nyx, layout, navigation, i18n
2. Prologue (sans WebGL)
3. Chant I
4. Chant II
5. Chant III + page détail
6. Oracles
7. Chant IV
8. Épilogue + envoi email
9. Frise globale, amphore, exploits, curseur, easter eggs
10. Effet WebGL du prologue
11. 404, SEO, passe finale (Impeccable audit, Lighthouse, `break-ui`)

L'admin est construit en parallèle des chants qui en dépendent (ordre détaillé à l'étape 6).
