# TASKS.md — Plan de sessions Claude Code

> Étape 6 du workflow · v2.0 · 2026-10-16
> **Une tâche = une session** (`/clear` entre deux). Cocher `[x]` en fin de tâche.
> 🧭 = commencer en Plan Mode · 👤 = action manuelle d'Andry hors Claude Code
> « Lire » = sections à charger, pas les fichiers entiers.
> **Référence visuelle : `docs/prototype/odyssee-prototype.html`.** S'en inspirer pour le rendu et le mouvement ; le reconstruire proprement en composants React (ne pas copier le fichier tel quel).

---

## Phase 0 — Préparation (hors Claude Code)

- [x] **P0.1** 👤 Projet créé avec `create-next-app` (dossier `odysee`).
- [x] **P0.2** 👤 Kit copié (CLAUDE.md, DESIGN.md, PRODUCT.md à la racine ; docs/ ; docs/prototype/).
- [x] **P0.3** 👤 `bash setup-claude-kit.sh`, puis dans Claude Code : `npx impeccable install`, `/impeccable init` (garder PRODUCT.md et DESIGN.md), `/impeccable hooks on`, `/mcp` (playwright et shadcn connectés).
- [x] **P0.4** 👤 Supabase : projet créé (Europe), inscriptions désactivées, compte admin créé (sinon : script en T04), URL et clés notées.
- [x] **P0.5** 👤 Gmail : validation en 2 étapes + mot de passe d'application (facultatif avant T19).
- [x] **P0.6** 👤 `.env.local` rempli (ARCHITECTURE §10), jamais commité.

## Phase 1 — Fondations

- [x] **T01** Socle projet 🧭 — Lire : ARCHITECTURE §1, §9, §11. Dépendances de la stack, arborescence, scripts `check` et `db:types`, `.env.example`, Prettier. `npm run check` vert.
- [ ] **T01b** Dépendances v2 — `npm uninstall ogl` puis `npm install lenis` (ARCHITECTURE §1 v2). `npm run check` vert.
- [ ] **T02** Tokens et thème Hélios/Nyx — Lire : DESIGN §2, §3, §7. `globals.css` (tokens d'interface + couleurs d'objets + `@theme` Tailwind), polices `next/font`, next-themes, page `/dev/tokens` temporaire.
- [ ] **T03** i18n FR/EN 🧭 — Lire : ARCHITECTURE §3 ; CLAUDE.md « Pièges Next.js 16 ». next-intl v4, `src/proxy.ts`, `[locale]/layout.tsx`, `messages/fr.json` / `en.json` (y mettre narrations et répliques de Charon des rives fixes), sélecteur de langue.
- [ ] **T04** Base Supabase — schéma et RLS 🧭 — Lire : ARCHITECTURE §4 ; PRD §7. Migrations (toutes les tables, RLS, buckets), `supabase link`, `db push`, `db:types`. 👤 Insérer ton `user_id` dans `admins` (ou script ponctuel de création du compte admin).
- [ ] **T05** Clients Supabase et lectures en cache — Lire : ARCHITECTURE §2. `lib/supabase/*`, `lib/data/*` (cache par tags), seed de démo : profil, 4 projets du prototype, 3 escales, 6 technos. **Aucun témoignage inventé** (PRODUCT.md : Delphes reste masquée tant qu'il n'y en a pas).
- [ ] **T06** Layout public et navigation — Lire : DESIGN §4 (pleine largeur), §7. Aucun conteneur centré dans le layout. Navigation à double filet, FR/EN, Hélios/Nyx, lien d'évitement, landmarks, pied de page.

## Phase 2 — Admin

- [ ] **T07** Auth admin 🧭 — Lire : ARCHITECTURE §5. `/admin/login`, session `@supabase/ssr` dans `proxy.ts`, layout protégé côté serveur, `requireAdmin()` dans chaque Server Action, `noindex`, socle shadcn.
- [ ] **T08** Admin : profil, engagement, liens, CV — Lire : PRD F-ADM-03, F-ADM-07, F-ADM-13, F-ADM-14.
- [ ] **T09** Admin : projets 🧭 — Lire : PRD F-ADM-04, F-ADM-08, F-ADM-09, F-ADM-15 ; SEO-09, SEO-10. Champs FR/EN, narration + réplique de Charon, scène (optionnelle), captures et galerie (storage, alt FR/EN), scellé / associatif, statut, ordre, SEO, redirection de slug.
- [ ] **T10** Admin : expériences, technos (arme optionnelle), savoir-faire, témoignages, messages — Lire : PRD F-ADM-05, F-ADM-06, F-ADM-10, F-ADM-14.

## Phase 3 — Le moteur du Styx

- [ ] **T11** Rives et rivière 🧭 — Lire : DESIGN §4 ; prototype (fonction `build`). Composant `Stop` (côté calculé par l'index), composant client `River` qui mesure les rives (ResizeObserver) et dessine lit + tracé d'encre + rides ; **pleine largeur** (pas de conteneur centré, rives collées aux marges, rivière au milieu de l'espace libre) ; aucune coordonnée en dur ; mobile.
- [ ] **T12** La barque, Charon et Andry — Lire : DESIGN §5 ; prototype (SVG `#ferry`, `update`, `say`). Barque qui suit la rivière, inclinaison, retournement, tangage, réaction à la vitesse, clignement, salut ; Lenis + GSAP ticker ; reduced-motion.
- [ ] **T13** Cartouche de Charon et narrateur — Lire : DESIGN §5, §8. Placement sans chevauchement (rives, nav, ponton, barque), fondu, bandeau mobile temporisé ; narrateur mot à mot. Vérif Playwright sur 5 largeurs, dont 1920 (aucun chevauchement).

## Phase 4 — Les rives (une par session : construire → animer → `npm run check` → capture desktop + mobile → `/impeccable critique` → `review-animations`)

- [ ] **T14** Embarcadère — pinax suspendu, nom lettre à lettre, sceau olive, accroche, CTA, ponton.
- [ ] **T15** Le courant + Rive I — narration ; onglets Athéna / Héphaïstos ; agora Rotaract.
- [ ] **T16** Rive II · La forge — scène Héphaïstos animée ; assiettes générées depuis `technologies` (mapping + réserve d'armes, animation par arme) ; cadre ΤΕΧΝΑΙ.
- [ ] **T17** Les épreuves 🧭 — une rive par projet publié ; tesson, scène de bataille (bibliothèque + ordre de repli), emplacement de capture, sceau scellé, « Lire l'épreuve ».
- [ ] **T18** Modale de l'épreuve — cadre à méandres qui se déplie, galerie, sections, défilement interne (`data-lenis-prevent`), focus, Échap. La modale s'ouvre au clic ; garder **aussi** la page `/[locale]/projects/[slug]` (même contenu, rendu serveur) pour le SEO et le partage de lien.
- [ ] **T19** Rive III · Les escales — carte (ports générés, navire au scroll), cartes postales (timbres en boucle, tampon postal).
- [ ] **T20** Rive IV · Delphes — trépied, prophéties depuis `testimonials`, rive masquée si vide.
- [ ] **T21** L'embouchure · Hermès 🧭 — Lire : ARCHITECTURE §6. Lettre dans le cadre à méandres, Server Action `sendContactMessage` (Zod, honeypot, délai, limite par IP hachée, sauvegarde, Nodemailer), sandale qui s'envole.
- [ ] **T22** Épilogue + 404 — Champs Élysées (soleil au scroll, obole), « Remonter le Styx », 404 labyrinthe, message console.

## Phase 5 — SEO, qualité, mise en ligne

- [ ] **T23** SEO complet 🧭 — Lire : PRD §8 bis ; ARCHITECTURE §7. Métadonnées, hreflang, sitemap (projets inclus), robots, OG dynamiques, JSON-LD. Skill `seo`.
- [ ] **T24** Robustesse — `break-ui` : textes longs, EN manquant → FR, 0 / 1 / 10 projets, 0 témoignage, 12 technos : la rivière et le cartouche s'adaptent.
- [ ] **T25** Accessibilité et performance — `/impeccable audit`, `web-quality-audit`, `vercel-react-best-practices`, contrastes clair/sombre, clavier, reduced-motion, Lighthouse mobile.
- [ ] **T26** Déploiement Vercel — 👤 connecter le dépôt, variables, cron `/api/keepalive`. Vérifier en production : email, admin, mise à jour sans redéploiement.
- [ ] **T27** Lancement — 👤 vrais contenus (fiches projet, captures, CV FR/EN, vrais témoignages), Lighthouse final, Search Console + sitemap.

---

## Rituel de fin de session

1. `npm run check` vert
2. Cocher la tâche ici
3. Commit (Conventional Commits) proposé par Claude, validé par Andry
4. `/clear`
