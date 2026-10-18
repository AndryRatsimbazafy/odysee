# TASKS.md — Plan de sessions Claude Code

> Étape 6 du workflow · **v3.0 · 2026-10-16 · reprise en direction luxe-4**
> **Une tâche = une session** (`/clear` entre deux). Cocher `[x]` en fin de tâche.
> 🧭 = commencer en Plan Mode · 👤 = action manuelle d'Andry hors Claude Code
> « Lire » = sections à charger, pas les fichiers entiers.
> **Référence visuelle : `docs/prototype/luxe-4.html`.** S'en inspirer pour le rendu et le mouvement ; le reconstruire proprement en composants React (ne pas copier le fichier tel quel). `odyssee-prototype.html` et `luxe-1..3` sont des archives.
> Prompts prêts à coller : `docs/GUIDE.md`.

---

## Phase 0 — Préparation (hors Claude Code)

- [x] **P0.1** 👤 Projet créé avec `create-next-app` (dossier `odysee`).
- [x] **P0.2** 👤 Kit copié (CLAUDE.md, DESIGN.md, PRODUCT.md à la racine ; docs/ ; docs/prototype/).
- [x] **P0.3** 👤 `bash setup-claude-kit.sh`, puis `npx impeccable install`, `/impeccable init`, `/impeccable hooks on`, `/mcp`.
- [x] **P0.4** 👤 Supabase : projet créé, inscriptions désactivées, compte admin, URL et clés notées.
- [x] **P0.5** 👤 Gmail : validation en 2 étapes + mot de passe d'application.
- [x] **P0.6** 👤 `.env.local` rempli (ARCHITECTURE §10), jamais commité.
- [x] **P0.7** 👤 Kit v3 copié : remplacer CLAUDE.md, DESIGN.md, PRODUCT.md, docs/*.md, ajouter `docs/prototype/luxe-4.html`. Puis `/impeccable init` pour relire PRODUCT.md et DESIGN.md (les garder tels quels).

## Phase 1 — Fondations

- [x] **T01** Socle projet — dépendances, arborescence, scripts `check` et `db:types`, `.env.example`, Prettier.
- [x] **T01b** Dépendances v2 — `ogl` retiré, `lenis` ajouté.
- [x] **T02** Tokens et thème (v2, à refaire en T04a).
- [x] **T03** i18n FR/EN — next-intl v4, `src/proxy.ts`, `[locale]/layout.tsx`, sélecteur de langue (textes v2 à remplacer en T04b).
- [x] **T04** Base Supabase — schéma v2 et RLS, buckets, `db:types` (à adapter en T04c).

### Réalignement luxe-4 (les fondations restent, seul le visuel et le schéma changent)

- [x] **T04a** Tokens, polices et thème luxe-4 — Lire : DESIGN §2, §3, §4, §9. Remplacer les tokens de `globals.css` par ceux de DESIGN §2 (sombre par défaut + clair) et les exposer dans `@theme` ; supprimer les anciens tokens d'objets (terre cuite, figure noire…) ; Cormorant Garamond remplace Fraunces dans `fonts.ts` ; next-themes `defaultTheme="dark"` ; utilitaires de base (`.gut`, `.grid` 12 col., `.marg`, `.kicker`, `.display`, `.mono`, `.todo`, `.btn`, `.line`, focus) ; mettre à jour `/dev/tokens` (contrastes affichés). `npm run check`.
- [x] **T04b** Textes d'interface luxe-4 — Lire : STORYBOARD (tout, c'est la source des textes) ; `messages/fr.json` actuel. Remplacer les textes v2 (Styx, rives, Charon pilote) par ceux de luxe-4 en FR et EN : en-tête, chargeur, index des chants, titres / leads / épigraphes / folios des chants, routes, boutons, libellés du dossier (sections, fiche, confidentialité **mot pour mot**), lightbox, arsenal, journal, oracle, formulaire (erreurs incluses), épilogue, 404, console. Clés par chant (`hero.*`, `divinites.*`, `epreuves.*`, `dossier.*`…). Aucun texte de projet ici (ils vont en base).
- [x] **T04c** Migration du schéma v3 🧭 — Lire : ARCHITECTURE §4 (« Migration v3 ») ; PRD §7. Une migration `schema_v3_luxe4` (colonnes ajoutées / supprimées, `project_items`, `project_decisions`, `faq_items`, RLS + policies dans la même migration, checks), `npx supabase db push`, `npm run db:types`. Montrer le SQL à Andry avant le push.

## Phase 2 — Données et coque

- [x] **T05** Clients Supabase, lectures en cache et seed — Lire : ARCHITECTURE §2, §4. `lib/supabase/*`, `lib/data/*` (`'use cache'` + `cacheTag`), fallback EN → FR, types de vue (Project complet avec items, décisions, planches, technos). Seed de démo **depuis luxe-4** : profil, 4 projets (dont 1 scellé), leurs planches **sans fichier** (emplacements), 3 technos, 2 escales, 5 questions de l'oracle, 6 compétences. Les `[…]` du prototype restent `[à fournir]`. **Aucun témoignage.**
- [x] **T06** Layout public et en-tête — Lire : DESIGN §4, §6 (point 5). Pleine largeur, `gut` avec 108 px à gauche ≥ 821 px. En-tête fixe (marque, liens, CV, FR/EN, thème, bouton « Charon » avec `aria-pressed` + mémorisation), opaque après le hero ; lien d'évitement, landmarks, pied de page ; composants `Marg`, `Gloss`, `Folio`, `roman()`.

## Phase 3 — Admin

- [x] **T07** Auth admin 🧭 — Lire : ARCHITECTURE §5. `/admin/login`, session `@supabase/ssr` dans `proxy.ts`, layout protégé côté serveur, `requireAdmin()` dans chaque Server Action, `noindex`, socle shadcn (thème sombre, tokens du site).
- [x] **T08** Admin : profil, engagement, liens, CV — Lire : PRD F-ADM-03, F-ADM-07, F-ADM-13, F-ADM-14 (engagement).
- [x] **T09** Admin : projets 🧭 — Lire : PRD F-ADM-04, F-ADM-08, F-ADM-08b, F-ADM-09, F-ADM-15 ; SEO-09, SEO-10. Formulaire en onglets (Récit · Fiche · Contribution & décisions · Planches · Technos · SEO), FR/EN côte à côte, listes ordonnables (contributions, résultats, décisions), planches (upload vers `projects/{project_id}/{uuid}.{ext}` — ARCHITECTURE §4 Storage —, nature, légende, ratio, alt), layout + emblème, statut, ordre, redirection de slug, `updateTag`.
- [x] **T10** Admin : technos, compétences, escales, oracle, témoignages, messages — Lire : PRD F-ADM-05, F-ADM-06, F-ADM-10, F-ADM-14, F-ADM-16.

## Phase 4 — Le voyage (couches globales)

- [x] **T11** Ciel étoilé et zodiaque — Lire : DESIGN §6 (point 1) ; prototype (bloc JS « Ciel : les douze constellations » + couche `#zodiac`). Îlot client fixe `aria-hidden` : dégradés, étoiles en 3 couches, 12 constellations + Orion (données des tracés dans `engravings/`), flottement idle, parallaxe, scintillement, opacités du prototype, mode clair, reduced-motion, pause onglet caché. Vérifier les contrastes sur le point le plus clair.
- [x] **T12** Chargeur et curseur — Lire : DESIGN §6 (points 2, 3), §9 ; ARCHITECTURE §8. Chargeur 1re visite de session (progression réelle, mini 1.4 s, sécurité CSS 8 s, absent sans JS) ; curseur `pointer:fine` (états via `data-cursor`) ; reduced-motion.
- [x] **T13** Rose des vents, index des chants, routes et révélations — Lire : DESIGN §6 (point 4), §7 (routes), §9 ; prototype (blocs « Rose des vents et index », « Routes entre les chants », « Défilement amorti »). Rose qui suit le chant courant, index en overlay (focus, Échap, `data-lenis-prevent`), Lenis + ticker GSAP, sauts d'ancre avec décalage d'en-tête, routes avec barque scrub, helpers `RevealTitle` (mot à mot) et `Reveal` (stagger).

## Phase 5 — Les chants (une session chacun : construire → animer → `npm run check` → capture 1440 + 375 → `/impeccable critique` → `review-animations`)

- [x] **T14** L'embarcadère — Lire : STORYBOARD §1 ; DESIGN §7. Nom, h1, récit, CTA, médaillon gravé (tracé), bande d'identité (horloge locale en direct dans un petit îlot client).
- [x] **T15** Chant I · Deux divinités — Lire : STORYBOARD §2. Héphaïstos large / Athéna étroite, « & », gravures, compétences par domaine, « Hors du travail ».
- [x] **T16** Chant II · Carte et archives 🧭 — Lire : STORYBOARD §3 ; DESIGN §7 ; prototype (blocs « Aperçus des épreuves » et « Carte de la traversée », fonction `updateVoyage`). Carte collante générée pour N projets (positions calculées, légende compacte si N > 6), aperçus alternés, états `on`/`done`, barque sur la route, saut par point. Test de charge avec 9 projets (seed temporaire).
- [ ] **T17** Le dossier d'archive 🧭 — Lire : DESIGN §8 ; STORYBOARD §4 ; ARCHITECTURE §3 (Dossier) ; PRD F-PRO-04 à F-PRO-10 ; prototype (bloc « Dossier », fonction `renderDossier`). Composant serveur `Dossier` (4 layouts, sections `§ n`), page complète `/[locale]/projects/[slug]` + overlay en route interceptée, `inert`, focus, Échap / retour, message de confidentialité exact, précédent / suivant. Aperçu avant publication (F-ADM-09, reporté de T09) : route draftMode réservée à l'admin qui rend le vrai `Dossier` d'un brouillon, puis activer le bouton « Aperçu » du formulaire projet.
- [ ] **T18** Planches et lightbox — Lire : DESIGN §8 (Planches) ; PRD F-PRO-08. Planches par layout (`next/image`, ratios, emplacements `[à fournir]`), lightbox (flèches, Échap, swipe, compteur, piège de focus), ouverture animée du dossier.
- [ ] **T19** Chant III · L'arsenal — Lire : STORYBOARD §5 ; PRD F-SKI-01, F-SKI-02. Index de livre (points de conduite, renvois calculés, ligne dépliable), sanctuaire de l'arme (gravures + réserve), test avec 12 outils.
- [ ] **T20** Chant IV · Les escales + Chant V · L'oracle — Lire : STORYBOARD §6, §7. Journal de bord (table → blocs empilés en mobile), FAQ `details/summary`, voix de Delphes masquée si vide. Test avec 7 escales.
- [ ] **T21** Chant VI · Écrire à Hermès 🧭 — Lire : ARCHITECTURE §6 ; STORYBOARD §8. Formulaire (Zod, `useActionState`, honeypot, délai, limite par IP hachée, sauvegarde, Nodemailer), états réels, copier l'email.
- [ ] **T22** Ithaque, 404 et console — Lire : STORYBOARD §9, §10. Épilogue, pied de page, 404 « Charybde et Scylla », message console.

## Phase 6 — SEO, qualité, mise en ligne

- [ ] **T23** SEO complet 🧭 — Lire : PRD §8 bis ; ARCHITECTURE §7. Métadonnées, hreflang, sitemap (projets inclus), robots, OG dynamiques (style luxe-4), JSON-LD. Skill `seo`.
- [ ] **T24** Robustesse — `break-ui` : textes longs, EN manquant → FR, 0 / 1 / 9 projets, 12 outils, 7 escales, 0 témoignage, 0 question : carte, index, journal et routes s'adaptent ; aucun débordement à 375–1920.
- [ ] **T25** Accessibilité et performance — `/impeccable audit`, `web-quality-audit`, `vercel-react-best-practices`, contrastes clair/sombre (ciel compris), clavier (dossier, index, lightbox), reduced-motion, effet du chargeur sur le LCP, Lighthouse mobile.
- [ ] **T26** Déploiement Vercel — 👤 connecter le dépôt, variables, cron `/api/keepalive`. Vérifier en production : email, admin, mise à jour sans redéploiement.
- [ ] **T27** Lancement — 👤 vrais contenus (fiches projet, planches, CV FR/EN, dates, liens), retrait des `[à fournir]`, Lighthouse final, Search Console + sitemap.

---

## Rituel de fin de session

1. `npm run check` vert
2. Cocher la tâche ici
3. Commit (Conventional Commits) proposé par Claude, validé par Andry
4. `/clear`
