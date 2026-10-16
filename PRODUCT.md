# Product

<!-- impeccable:product-schema 1 -->

> Contexte produit lu par Impeccable avant tout travail de design. Détails complets : docs/PRD.md, DESIGN.md, docs/STORYBOARD.md.
> Référence visuelle exécutable : docs/prototype/odyssee-prototype.html (v2, 2026-10-16).

## Platform

web

Mobile d'abord (375 px) jusqu'au grand écran (1440 px). Next.js App Router, bilingue FR/EN, modes clair (Hélios) et sombre (Nyx).

## Users

- **RH / talent acquisition** : 30 s à 1 min. Veulent le poste, la stack, la disponibilité, le CV. Doivent tout trouver sans scroller.
- **CTO / lead technique** : 2 à 5 min. Lisent les études de cas, jugent les choix techniques et la qualité d'exécution du site.
- **Clients freelance** : 1 à 3 min. Cherchent fiabilité, résultats concrets, compréhension du métier, contact facile.

## Product Purpose

Présenter Andry, Lead Front-End Developer React/TypeScript avec une double compétence AMOA, basé à Madagascar et travaillant en remote. Obtenir des prises de contact pour un CDI ou des missions freelance à l'international. Le site est lui-même une preuve de savoir-faire.

Succès : au moins un contact qualifié par mois après la mise en ligne ; titre, spécialité et disponibilité lisibles sans scroll ; Lighthouse ≥ 95 sur mobile (PRD §2).

## Positioning

Un Lead Front-End React/TypeScript : l'expertise front et le lead technique sont l'argument central. La double compétence AMOA est un plus discret : elle l'aide à comprendre un besoin métier et à le traduire en interface, sans jamais passer devant le front. Le remote depuis Madagascar est un fait de contexte, pas le pitch.

## Capabilities and Constraints

- Site public one-page narratif (une rive par section, une rive par projet) ; détail d'un projet en modale au clic, page détail par URL pour le SEO ; CV téléchargeable (PDF FR et EN) ; formulaire de contact (email + sauvegarde en base).
- Tout le contenu est éditable via `/admin` ; saisie manuelle des deux langues, sans traduction automatique.
- Hors V1 : blog, statistiques, domaine personnalisé (V1 sur `*.vercel.app`, URL de base configurable), multi-utilisateurs admin, tests automatisés.
- Admin (`/admin`) : interface utilitaire avec shadcn/ui, sobre, aux couleurs du site mais sans éléments narratifs.

## Brand Commitments

La traversée du Styx : une barque menée par Charon (le narrateur) emmène Andry de rive en rive au fil du scroll. Chaque section est une rive et chaque bloc un objet de l'univers (pinax suspendu, tessons, assiettes d'armes légendaires, parchemins à méandres, cartes postales), peint en figure noire sur terre cuite. Luxueux par la retenue, drôle par les détails (répliques de Charon), jamais « cartoon ». Madagascar = Ithaque. Jamais de marbre ni de colonnes. Aucune image générée par IA.

Voix : celle d'Andry. Précise, chaleureuse, un clin d'œil maximum par section.

## Evidence on Hand

- **Projets Bocasay** : études de cas autorisées par l'employeur ; client et données anonymisés, visuels floutés ou maquettes redessinées.
- **CV** : PDF FR et EN.
- **Engagement Rotaract** : rôle associatif réel, à placer dans le parcours.
- **Absent** : aucun témoignage collecté à ce jour. Ne jamais en inventer ; la section « Paroles d'oracles » reste masquée tant qu'elle est vide (F-TEM-01). Pas de chiffres d'impact, clients nommés ou métriques non fournis par Andry.

## Product Principles

1. L'information d'abord : l'humour et les animations ne retardent ni ne cachent jamais le contenu.
2. Chaque section a sa propre composition ; rien ne doit ressembler à un template.
3. Le texte a la voix d'Andry : précis, chaleureux, un clin d'œil maximum par section.
4. Un seul accent d'interface ; aucun bloc ne ressemble à une card de site web ; la rivière, la barque et le cartouche de Charon ne chevauchent jamais le contenu ; ajouter du contenu dans l'admin redessine la rivière sans code.
5. Performance et accessibilité font partie du design (Lighthouse ≥ 95, WCAG 2.2 AA).

## Accessibility & Inclusion

- Contrastes AA vérifiés dans les deux modes.
- Navigation complète au clavier, focus toujours visible.
- `prefers-reduced-motion` : récit entièrement lisible sans animation.
- Éléments fun décoratifs masqués aux lecteurs d'écran ; exploits annoncés poliment et désactivables.
- Textes longs, champs EN manquants et listes vides gérés sans casse (contenu édité dans l'admin).
