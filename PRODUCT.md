# Product

<!-- impeccable:product-schema 1 -->

> Contexte produit lu par Impeccable avant tout travail de design. Détails complets : docs/PRD.md, DESIGN.md, docs/STORYBOARD.md.
> Référence visuelle exécutable : docs/prototype/luxe-4.html (v3, 2026-10-16). Les prototypes précédents sont archivés.

## Platform

web

Mobile d'abord (375 px) jusqu'au grand écran (1920 px), pleine largeur. Next.js App Router, bilingue FR/EN, mode sombre « nuit » par défaut et mode clair « ivoire ».

## Users

- **RH / talent acquisition** : 30 s à 1 min. Veulent le poste, la stack, la disponibilité, le CV. Tout est dans le hero et la bande d'identité, sans scroller.
- **CTO / lead technique** : 2 à 5 min. Ouvrent les dossiers d'archives (études de cas), jugent les décisions, les compromis et la qualité d'exécution du site.
- **Clients freelance** : 1 à 3 min. Cherchent fiabilité, compréhension du métier (AMOA), contact facile ; l'oracle (FAQ) répond aux questions récurrentes.

## Product Purpose

Présenter Andry, Lead Front-End Developer React/TypeScript avec une double compétence AMOA, basé à Madagascar et travaillant en remote. Obtenir des prises de contact pour un CDI ou des missions freelance à l'international. Le site est lui-même une preuve de savoir-faire.

Succès : au moins un contact qualifié par mois après la mise en ligne ; titre, spécialité et disponibilité lisibles sans scroll ; Lighthouse ≥ 95 sur mobile (PRD §2).

## Positioning

Un Lead Front-End React/TypeScript : l'expertise front et le lead technique sont l'argument central (Héphaïstos, la colonne large). La double compétence AMOA est un plus discret (Athéna, la colonne étroite) : elle l'aide à comprendre un besoin métier et à le traduire en interface, sans jamais passer devant le front. Le remote depuis Madagascar est un fait de contexte (le port d'attache), pas le pitch.

## Capabilities and Constraints

- Site public one-page en chants ; projets en **carte + archives**, chaque projet s'ouvre en **dossier** plein écran au clic, avec une URL propre rendue côté serveur pour le SEO ; CV téléchargeable (PDF FR et EN) ; FAQ éditable ; formulaire de contact (email + sauvegarde en base).
- Tout le contenu est éditable via `/admin` ; saisie manuelle des deux langues, sans traduction automatique. Le site doit tenir avec 8+ projets, 12+ outils, 7+ escales sans changer de code.
- Hors V1 : blog, statistiques, domaine personnalisé (V1 sur `*.vercel.app`, URL de base configurable), multi-utilisateurs admin, tests automatisés.
- Admin (`/admin`) : interface utilitaire avec shadcn/ui, sobre, aux couleurs du site mais sans éléments narratifs.

## Brand Commitments

L'Odyssée comme un **portulan de nuit** : un atlas relié en planches, un ciel étoilé bleu nuit avec les constellations du zodiaque à très faible contraste, des gravures au trait or, une typographie de livre ancien et des annotations en marge. Ulysse part d'Antananarivo (Ithaque de départ) et revient vers « votre équipe ». La mythologie vit dans les textes (Héphaïstos, Athéna, Hadès, Hermès, Tirésias) et dans les notes de Charon, glossateur masquable. Luxueux par la retenue, jamais « cartoon », jamais de marbre ni de colonnes. Aucune image générée par IA.

Voix : celle d'Andry. Précise, chaleureuse, un clin d'œil maximum par section.

## Evidence on Hand

- **Projets Bocasay** : études de cas autorisées par l'employeur ; client et données anonymisés ; le dossier scellé affiche le message de confidentialité exact et un bouton de contact, sans lien public obligatoire.
- **Projets associatifs** : Rotaract Club d'Ivandry (gestion des membres, site du club).
- **CV** : PDF FR et EN (à fournir).
- **Absent à ce jour** : témoignages, captures, chiffres d'impact, dates précises de certaines escales. Ne jamais en inventer : afficher `[à fournir]`, et masquer la voix de Delphes tant qu'aucun témoignage n'est publié.

## Product Principles

1. L'information d'abord : l'humour, le ciel et les animations ne retardent ni ne cachent jamais le contenu.
2. Chaque chant et chaque dossier ont leur propre composition ; rien ne doit ressembler à un template.
3. Le texte a la voix d'Andry : précis, chaleureux, un clin d'œil maximum par section.
4. Un seul accent (or) ; aucun bloc ne ressemble à une card de site web ; tout est généré depuis les données (carte, routes, index, journal).
5. Performance et accessibilité font partie du design (Lighthouse ≥ 95, WCAG 2.2 AA).

## Accessibility & Inclusion

- Contrastes AA vérifiés dans les deux modes, y compris sur le point le plus clair du ciel.
- Navigation complète au clavier, focus toujours visible ; dossier, index des chants et lightbox avec piège de focus, Échap et retour du focus.
- `prefers-reduced-motion` : récit entièrement lisible sans animation, sans curseur personnalisé ni parallaxe.
- Ciel, gravures et curseur décoratifs masqués aux lecteurs d'écran ; gloses de Charon masquables.
- Textes longs, champs EN manquants et listes vides gérés sans casse.
