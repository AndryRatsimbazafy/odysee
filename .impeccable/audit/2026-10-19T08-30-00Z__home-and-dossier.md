# Audit T25 — accueil `/fr`, `/en`, dossier `/fr/projects/plateforme-multi-espaces`

Conditions : `next build` + `next start` local (port 3100), Lighthouse 12 mobile simulé
(Moto G, 4G lente, CPU ×4), Chrome 153 headless. Machine partagée (charge 3–7) : ±8 pts
de bruit entre runs, médianes ci-dessous. Vérifs manuelles : Playwright (CPU ×4), axe-core.

## Scores

| | Perf mobile | A11y | BP | SEO | LCP | TBT | CLS | SI |
|---|---|---|---|---|---|---|---|---|
| Avant (`/fr`) | 43 | 97 | 100 | 92 | 5,9 s | 2 790 ms | 0 (0,55 intermittent) | 6,6 s |
| Après (`/fr`) | 59–65 | 100 | 100 | 92* | 4,2 s | 800–1 000 ms | 0 | 4,7 s |
| Après, sans Paint Holding | 70–73 | 100 | 100 | 92* | 3,2 s | 750 ms | 0 | 4,1 s |
| Desktop avant → après | 74 → 96 | 97 → 100 | 100 | 92* | 1,0 → 0,8 s | 470 → 120 ms | 0 | 2,0 → 1,6 s |
| Dossier (mobile) | 64 | 98 → 100 | 100 | 92* | 4,2 s | 870 ms | 0 | 4,3 s |

\* SEO 92 = audit `canonical` : `NEXT_PUBLIC_SITE_URL` vaut localhost:3000, mesure sur 3100.
Artefact local, conforme en production.

Paint Holding : en headless local, Chrome retient le premier rendu ~1,25 s (même sur
`/admin/login`) ; Lighthouse met alors tout le JS sur le chemin du LCP simulé. LCP réel
mesuré (PerformanceObserver, CPU ×4) : 0,44–0,89 s.

## Chargeur et LCP

Build témoin sans chargeur : LCP identique (4,1–4,2 s ; 3,2 s sans Paint Holding).
Le paragraphe LCP est peint sous le chargeur. Effet réel : Speed Index (+1,1 s) et
~5 pts de score. Pas de raccourcissement nécessaire pour le LCP.

## Corrigé

- **P0 perf — ciel** : boucles idle animées *dans* un SVG géant → repaint complet à
  chaque frame (3 000 ms de longues tâches / 3 s). Couches HTML compositées, CSS
  `transform`/`opacity`, champ d'étoiles en masque SVG (≈ 900 → 360 nœuds), injecté
  à l'inactivité avec fondu.
- **P0 CLS** : hero aligné en bas, peint à moitié parsé → décalage jusqu'à 0,55
  (5/6 runs CPU ×4). Grille masquée (`visibility`) jusqu'au 4ᵉ groupe de la bande
  d'identité (`:has`) → 0 sur 8/8 runs.
- **P1 perf — scènes de défilement** : `useScrollScene` (inactivité + IntersectionObserver
  à un écran) ; la garde `inView` évite tout clignotement (vérifié : saut d'ancre et
  défilement complet, aucun contenu bloqué).
- **P1 bundle** : Zod (31 Ko gz) sorti du bundle public (`contact-fields.ts`) ;
  messages next-intl client limités aux namespaces utiles (admin 12 Ko retiré du HTML) ;
  polices préchargées `latin` seul (244 → 149 Ko).
- **P1 a11y** : libellé `.to` des routes à opacité .25 (contraste) → révélé par `clip-path` ;
  FR/EN : nom accessible contenant le texte visible ; dossier page : niveaux de titres
  sans saut (h1 → h2).

## Vérifié sans changement

- Clavier : index des chants (piège, Échap, retour focus, fermé = `visibility:hidden`),
  dossier (arrière-plan `inert`, focus titre, Échap → retour sur « Lire les archives »),
  lightbox (piège, ← →, Échap → retour vignette).
- Reduced motion : aucune animation active, pas de curseur, ciel fixe, chargeur ~0,7 s,
  aucun contenu masqué.
- Contrastes : axe 0 violation, nuit et jour, 1440 et 375. Tokens ≥ 4,5 sur le dégradé
  le plus clair (min 5,2 nuit / 4,7 jour).

## Restant

- **P2** Contraste < 4,5 au cœur ponctuel d'une étoile de constellation (1–6 px) pour
  `--ardoise`, `--or`, `--todo` (3,6 nuit, 3,3 jour). Arbitrage T11 maintenu.
- **P1** Lighthouse mobile ≥ 95 non atteint en local. Le reste est surtout du
  framework : hydratation React (~400 ms ×4), évaluation GSAP (~300 ms ×4), premier
  layout (~240 ms ×4). Pistes : charger GSAP de façon paresseuse (motion en
  amélioration progressive), réduire les îlots client, puis remesurer sur Vercel (T26)
  avec PageSpeed Insights.
- **P3** Dossier : piège via `inert` (Tab passe par le chrome du navigateur), l'index
  cycle en JS. Les deux sont conformes ; comportements différents.

Santé Impeccable : A11y 4 · Perf 2 · Theming 4 · Responsive 3 · Intégrité 4 (détecteur
sans constat) — **17/20, Bon**.

## Suite — GSAP chargé à la demande (même jour)

GSAP + ScrollTrigger (45 Ko gz) sortis du chargement initial : import dynamique
(`loadMotion`) au premier geste du lecteur ou quand une scène approche ; le hero
(Web Animations API + CSS) et le ciel (CSS, parallaxe en scroll-driven animations)
n'en dépendent plus ; Lenis tourne sur sa propre boucle.

| `/fr` mobile | Perf | LCP | TBT | SI |
|---|---|---|---|---|
| Avant (T25) | 59–65 | 4,2 s | ~1 000 ms | 4,7 s |
| Après | 76–77 | 3,8 s | ~420 ms | 3,8 s |
| Après, sans Paint Holding | 79–85 | 2,7 s | 420–630 ms | 3,4 s |
| Desktop | 96 → 98 | 0,8 s | 120 → 30 ms | 1,4 s |

Charge machine plus basse pendant ces runs (1,5 contre 3,6) : comparer surtout le TBT,
dont la baisse est structurelle. Reste : parse + premier layout (~335 ms ×4), hydratation
(~315 ms ×4), LCP simulé gonflé par le Paint Holding en local. À remesurer sur Vercel (T26).
