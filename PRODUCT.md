# PRODUCT.md

> Contexte produit lu par Impeccable avant tout travail de design. Détails complets : docs/PRD.md, docs/DESIGN.md, docs/STORYBOARD.md.

## Register

Brand / persuade. Un portfolio personnel qui doit convaincre et donner envie de contacter.

## Platform

Web, mobile d'abord (375 px) jusqu'au grand écran (1440 px). Next.js App Router, bilingue FR/EN, modes clair (Hélios) et sombre (Nyx).

## Product purpose

Présenter Andry, Lead Front-End Developer React/TypeScript avec une double compétence AMOA, basé à Madagascar et travaillant en remote. Obtenir des prises de contact pour un CDI ou des missions freelance à l'international. Le site est lui-même une preuve de savoir-faire.

## Users

- **RH / talent acquisition** : 30 s à 1 min. Veulent le poste, la stack, la disponibilité, le CV. Doivent tout trouver sans scroller.
- **CTO / lead technique** : 2 à 5 min. Lisent les études de cas, jugent les choix techniques et la qualité d'exécution du site.
- **Clients freelance** : 1 à 3 min. Cherchent fiabilité, résultats concrets, compréhension du métier, contact facile.

## Brand

Une Odyssée racontée sur un vase grec, avec le sourire. Luxueux par la retenue, drôle par les détails, authentique (Madagascar = Ithaque). Beige parchemin, encre, accent terre cuite. Mythologie grecque traitée en silhouettes de céramique, jamais en marbre ni en colonnes.

## Principles

1. L'information d'abord : l'humour et les animations ne retardent ni ne cachent jamais le contenu.
2. Chaque section a sa propre composition ; rien ne doit ressembler à un template.
3. Le texte a la voix d'Andry : précis, chaleureux, un clin d'œil maximum par section.
4. Un seul accent de couleur, une seule frise signature, un seul effet WebGL.
5. Performance et accessibilité font partie du design (Lighthouse ≥ 95, WCAG 2.2 AA).

## Accessibility and inclusion

- Contrastes AA vérifiés dans les deux modes.
- Navigation complète au clavier, focus toujours visible.
- `prefers-reduced-motion` : récit entièrement lisible sans animation.
- Éléments fun décoratifs masqués aux lecteurs d'écran ; exploits annoncés poliment et désactivables.
- Textes longs, champs EN manquants et listes vides gérés sans casse (contenu édité dans l'admin).

## Out of scope

Admin (`/admin`) : interface utilitaire avec shadcn/ui, sobre, aux couleurs du site mais sans éléments mythologiques ni animations narratives.
