# TASKS.md — Plan de sessions Claude Code

> Étape 6 du workflow · v1.0 · 2026-10-15
> **Une tâche = une session** (`/clear` entre deux). Cocher `[x]` en fin de tâche.
> 🧭 = commencer en Plan Mode · **[Andry]** = partie à coder par Andry (mode Learning) · 👤 = action manuelle hors Claude Code
> « Lire » = sections à charger, pas les fichiers entiers.

---

## Phase 0 — Préparation (hors Claude Code, ~1 h)

- [x] **P0.1** 👤 Créer le dépôt : `npx create-next-app@latest portfolio --ts --eslint --tailwind --app --src-dir --turbopack --import-alias "@/*"` puis `cd portfolio && git init` (si besoin).
- [x] **P0.2** 👤 Copier dans le dépôt : `CLAUDE.md` et `DESIGN.md` et `PRODUCT.md` à la racine ; `PRD.md`, `STORYBOARD.md`, `ARCHITECTURE.md`, `TASKS.md` dans `docs/`.
- [x] **P0.3** 👤 Lancer `bash setup-claude-kit.sh` (skills, MCP Playwright et shadcn). Puis dans Claude Code : installer Impeccable (`npx impeccable install`), `/impeccable init` (il doit détecter PRODUCT.md et DESIGN.md existants : les garder), `/impeccable hooks on`, puis activer le style **Learning** (`/output-style`).
- [x] **P0.4** 👤 Supabase : créer le projet (région Europe), désactiver les inscriptions (Auth → Sign In / Providers → décocher « Allow new users to sign up »), créer ton compte admin à la main (Auth → Users → Add user), noter l'URL et les clés.
- [x] **P0.5** 👤 Google : activer la validation en 2 étapes, créer un **mot de passe d'application** pour Gmail.
- [x] **P0.6** 👤 Créer `.env.local` à partir de la liste d'ARCHITECTURE §10 (ne jamais le commiter).

---

## Phase 1 — Fondations

- [ ] **T01** Socle projet 🧭
  Lire : ARCHITECTURE §1, §9, §11. Installer les dépendances de la stack, créer l'arborescence, scripts `check` et `db:types`, `.env.example`, Prettier. Vérifier `npm run check`.
- [ ] **T02** Tokens et thème Hélios/Nyx
  Lire : DESIGN §2, §3, §4, §7. `globals.css` (tokens + `@theme` Tailwind), polices `next/font`, next-themes. Page `/dev/tokens` temporaire pour voir couleurs et typos dans les deux modes. **[Andry]** : brancher next-themes dans le layout.
- [ ] **T03** i18n FR/EN 🧭
  Lire : ARCHITECTURE §3 ; CLAUDE.md « Pièges Next.js 16 ». next-intl v4, `src/proxy.ts`, `[locale]/layout.tsx`, `messages/fr.json` / `en.json`, sélecteur de langue qui conserve la page. **[Andry]** : écrire `i18n/routing.ts`.
- [ ] **T04** Base Supabase — schéma et RLS 🧭
  Lire : ARCHITECTURE §4. Migrations SQL (toutes les tables, RLS, buckets storage, table `admins`), `supabase link`, `db push`, `db:types`. 👤 Insérer ton `user_id` dans `admins`. **[Andry]** : écrire les policies RLS de `projects` (lecture publiée / écriture admin).
- [ ] **T05** Clients Supabase et lectures en cache
  Lire : ARCHITECTURE §2. `lib/supabase/{client,server,admin}.ts`, `lib/data/*` avec cache par tags, données de démo (seed : profil, 3 travaux factices, 3 expériences, technos, témoignages `[À REMPLACER]`). **[Andry]** : écrire `getPublishedProjects()`.
- [ ] **T06** Layout public et navigation
  Lire : DESIGN §10 ; STORYBOARD §0. Navigation `// …`, bascule Hélios/Nyx (silhouettes soleil/lune), sélecteur FR/EN, pied de page, squelette des sections avec ancres. Landmarks et lien d'évitement.

## Phase 2 — Admin (prérequis aux chants)

- [ ] **T07** Auth admin 🧭
  Lire : ARCHITECTURE §5. `/admin/login` (email + mot de passe), session `@supabase/ssr` dans `proxy.ts`, layout `/admin` protégé côté serveur, `noindex`, déconnexion. Installer le socle shadcn. **[Andry]** : la vérification `requireAdmin()` utilisée par toutes les Server Actions.
- [ ] **T08** Admin : profil, engagement, liens, CV
  Lire : PRD F-ADM-03, F-ADM-07, F-ADM-13, F-ADM-14. Formulaires FR/EN côte à côte, upload photo et PDF (storage), indicateur de traduction manquante, invalidation des tags.
- [ ] **T09** Admin : travaux 🧭
  Lire : PRD F-ADM-04, F-ADM-08, F-ADM-09 ; SEO-09, SEO-10. CRUD, galerie avec alt FR/EN, statut brouillon/publié, ordre, confidentiel/associatif, sous-titre fun, champs SEO, redirection si le slug change, aperçu. **[Andry]** : la Server Action `updateProject` (Zod + invalidation).
- [ ] **T10** Admin : expériences, technos, compétences, témoignages, messages
  Lire : PRD F-ADM-05, F-ADM-06, F-ADM-10, F-ADM-14. Réutiliser les composants de T08/T09.

## Phase 3 — Les chants (un par session, sans animation de scroll complexe d'abord)

Pour chaque chant : construire → animer (`animate` + skills GSAP) → `npm run check` → capture Playwright desktop + mobile → `/impeccable critique` → `review-animations` → corriger → cocher.

- [ ] **T11** Prologue — Lire : STORYBOARD « Prologue » ; DESIGN §5, §7, §11. Nom en SplitText, tampon, CTA, CV. Pas encore de WebGL.
- [ ] **T12** Frise signature — Lire : DESIGN §5. SVG méandre + DrawSVG/ScrollTrigger, départ du prologue, version reduced-motion. **[Andry]** : le hook `usePrefersReducedMotion`.
- [ ] **T13** Chant I — Deux divinités + « À l'agora » — Lire : STORYBOARD « Chant I ».
- [ ] **T14** Chant II — L'arsenal — Lire : STORYBOARD « Chant II ».
- [ ] **T15** Chant III — Les travaux (liste) 🧭 — Lire : STORYBOARD « Chant III ». Section épinglée desktop, liste mobile, badges Hadès/associatif.
- [ ] **T16** Page détail d'un travail + View Transitions — Lire : STORYBOARD « Chant III » (détail) ; PRD F-PRO-04 à F-PRO-07.
- [ ] **T17** Oracles — Lire : STORYBOARD « Oracles ».
- [ ] **T18** Chant IV — Le voyage — Lire : STORYBOARD « Chant IV ».
- [ ] **T19** Épilogue — formulaire de contact 🧭 — Lire : STORYBOARD « Épilogue » ; ARCHITECTURE §6. Server Action, Zod FR/EN, honeypot, délai, limite par IP hachée, sauvegarde, Nodemailer, Hermès. **[Andry]** : la Server Action `sendContactMessage`.
- [ ] **T20** 404 « labyrinthe » + pied de page final.

## Phase 4 — Le fun et l'effet signature

- [ ] **T21** Amphore, exploits, curseur divin, personnages, Konami, message console — Lire : DESIGN §9 ; STORYBOARD §0.
- [ ] **T22** Effet WebGL du prologue (OGL, chargé en différé, repli statique) — Lire : DESIGN §8. Vérifier que le LCP ne bouge pas.

## Phase 5 — SEO, qualité, mise en ligne

- [ ] **T23** SEO complet 🧭 — Lire : PRD §8 bis ; ARCHITECTURE §7. Métadonnées, hreflang, sitemap, robots, OG dynamiques, JSON-LD. Skill `seo`.
- [ ] **T24** Passe robustesse — `break-ui` sur tous les chants (textes longs, EN manquant → repli FR, listes vides).
- [ ] **T25** Passe accessibilité et perf — `/impeccable audit`, `web-quality-audit`, `vercel-react-best-practices`, contrastes clair/sombre, clavier, reduced-motion.
- [ ] **T26** Déploiement Vercel — 👤 connecter le dépôt, saisir les variables d'environnement, cron `/api/keepalive`. Vérifier en production : envoi d'email, admin, mise à jour sans redéploiement.
- [ ] **T27** Lancement — 👤 remplacer les témoignages `[À REMPLACER]`, saisir les vrais travaux (fiches projet, PRD annexe A), CV FR/EN, Lighthouse mobile final, Google Search Console + sitemap.

---

## Rituel de fin de session

1. `npm run check` vert
2. Cocher la tâche ici
3. Commit (Conventional Commits) proposé par Claude, validé par Andry
4. `/clear`
