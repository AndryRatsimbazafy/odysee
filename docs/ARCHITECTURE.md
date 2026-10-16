# ARCHITECTURE.md — Portfolio Andry

> Étape 5 du workflow · v1.0 (validée) · 2026-10-15
> v2.0 (2026-10-16) : direction « traversée du Styx » — Lenis ajouté, WebGL/OGL retiré.
> **v3.0 (2026-10-16) : direction luxe-4 (portulan de nuit)** — chants, carte + archives, dossier en route interceptée, schéma v3 (FAQ, décisions, planches), couches globales (ciel, chargeur, curseur, rose des vents). Référence visuelle : `docs/prototype/luxe-4.html`.
> Décisions validées : connexion admin email + mot de passe · un seul projet Supabase · skills GSAP officielles ajoutées au kit
> Choix techniques et structure. Lu par Claude Code avec PRD.md, DESIGN.md et STORYBOARD.md.
> Les API Next.js évoluent vite : avant d'implémenter une fonctionnalité de cache ou de routage, vérifier la doc officielle (skill `nextjs`).

---

## 1. Stack

| Domaine | Choix | Pourquoi |
|---|---|---|
| Framework | **Next.js 16.x** (App Router, Turbopack), React 19 | Objectif d'apprentissage, rendu serveur pour le SEO |
| Langage | **TypeScript strict** | NF-08 |
| Paquets | **npm** | Déjà maîtrisé, une chose de moins à apprendre |
| i18n | **next-intl v4** (`proxy.ts`) | Standard de fait pour App Router, URL `/fr` `/en` |
| Styles | **Tailwind CSS v4** + tokens CSS de DESIGN.md | Requis par shadcn (admin) ; tokens partagés public/admin |
| Thème | **next-themes** (attribut `data-theme`, `dark` par défaut, `light`, `system`) | Nuit / ivoire sans flash au chargement |
| Données | **Supabase** (Postgres, Auth, Storage) via `@supabase/supabase-js` + `@supabase/ssr` | Pas d'ORM : une couche de moins, RLS natif, apprentissage direct de Supabase |
| Types BDD | `supabase gen types` → `src/types/database.ts` | Typage de bout en bout sans ORM |
| Validation | **Zod** | Partagée client/serveur (formulaires, Server Actions) |
| Formulaires admin | **react-hook-form** + composants **shadcn/ui** | Formulaires bilingues longs |
| Formulaire contact | Server Action + `useActionState` (React 19) | Léger, fonctionne sans JS côté client |
| Email | **Nodemailer** + Gmail SMTP (mot de passe d'application) | F-CON-03, gratuit |
| Animations | **GSAP** + `@gsap/react` (ScrollTrigger) | Titres, tracés, carte, routes, parallaxe du ciel, dossier |
| Scroll fluide | **Lenis** (branché sur le ticker GSAP, `data-lenis-prevent` sur les zones qui défilent seules) | Traversée fluide ; désactivé en reduced-motion |
| Transitions | API View Transitions de React (si stable), sinon GSAP | Ouverture du dossier (F-PRO-07) |
| Icônes UI | lucide-react | DESIGN §6 |
| Hébergement | **Vercel** (Hobby) | Gratuit, intégré à Next.js |

## 2. Rendu et mise à jour du contenu

- **Tout le site public est en Server Components**, rendu statique par langue et par projet (`generateStaticParams`). Les Client Components sont réservés aux îlots interactifs : ciel, chargeur, curseur, rose des vents + index, bouton Charon, routes, révélations de titres, carte du Chant II, index de l'arsenal, dossier (overlay) et lightbox, formulaire, bascule de thème. Le contenu (textes, listes, tables) est rendu par le serveur et passé en props : il reste lisible sans JS.
- **Tout est généré depuis les données** : numéros romains, folios, points et route de la carte (positions calculées pour N projets), légende compacte si N > 6, renvois de l'arsenal (depuis `project_technologies`), journal des escales, index des chants. Ajouter du contenu dans l'admin met tout à jour sans code.
- **Bibliothèque de gravures** (`src/components/engravings/`) : SVG au trait (médaillon de carte, marteau, olivier, emblèmes de projet, armes, barque, rose, sceau). Mapping par champ (`emblem`, `weapon`), sinon la suivante de la réserve, dans l'ordre.
- **Lecture des données** dans `src/lib/data/*` : fonctions serveur mises en cache (Cache Components : `'use cache'` + `cacheTag('projects')`, `cacheTag('profile')`, etc.).
- **Mise à jour sans redéploiement (F-ADM-11)** : chaque Server Action de l'admin invalide le tag concerné (`updateTag` / `revalidateTag`). Le site public se régénère à la visite suivante.
- **Repli** si l'API de cache diffère au moment de l'implémentation : ISR + `revalidatePath`. Le principe ne change pas.
- Le client Supabase du site public utilise la **clé publique** (lecture seule via RLS). La clé `service_role` n'est jamais utilisée côté public.

## 3. Routage

```
/                      → redirige vers /fr ou /en (langue du navigateur)
/[locale]              → page one-page (prologue → épilogue)
/[locale]/projects/[slug] → dossier d'archive en page complète (accès direct, SEO, partage)
   + @dossier/(.)projects/[slug] → même dossier en overlay plein écran quand on clique depuis la page (route interceptée)
/admin                 → admin (FR uniquement, hors i18n, noindex)
/admin/login           → connexion
/api/keepalive         → ping Supabase (cron Vercel)
sitemap.xml, robots.txt, opengraph-image → générés (SEO)
```

- **Dossier** : routes parallèles + interceptées (`app/[locale]/@dossier/(.)projects/[slug]/page.tsx` + `@dossier/default.tsx`). Le clic sur « Lire les archives » est un `<Link>` : l'URL devient `/fr/projects/slug` et le dossier s'affiche en overlay sans quitter la page (retour navigateur = fermeture). Un chargement direct de l'URL rend la page complète. Les deux utilisent le même composant serveur `Dossier`. Vérifier l'API dans la doc embarquée avant d'implémenter ; en cas de blocage, repli : overlay client + `history.pushState` vers la même URL, page complète conservée.
- `src/proxy.ts` (ex-middleware, renommé en Next.js 16) : gère la langue sur le site public et rafraîchit la session Supabase sur `/admin`.
- Le `proxy` n'est **pas** la seule protection : le layout `/admin` et **chaque** Server Action vérifient l'utilisateur côté serveur (F-ADM-02).

## 4. Modèle de données (Supabase)

Tables (colonnes bilingues suffixées `_fr` / `_en`) :

| Table | Rôle |
|---|---|
| `profile` | Ligne unique : identité, hero (titre, accroche, récit), Héphaïstos / Athéna, disponibilité, email public, SEO accueil, photo |
| `projects` | Épreuves (slug, textes FR/EN, `kind`, `layout`, `emblem`, quête, note de Charon, fiche, contexte, problème, statut, ordre, confidentiel, associatif, liens, SEO, `updated_at`) |
| `project_items` | Contributions et résultats (genre, texte FR/EN, ordre) |
| `project_decisions` | Décision · pourquoi · compromis (FR/EN, ordre) |
| `project_images` | Planches (chemin storage, nature, légende, ratio, alt FR/EN, ordre) |
| `technologies` | Nom, catégorie, années d'usage, arme, rôle et contexte FR/EN, mis en avant |
| `project_technologies` / `experience_technologies` | Liaisons (`usage_fr/en` sur `project_technologies`) |
| `skills` | Compétences FR/EN, domaine `hephaistos` / `athena`, ordre |
| `faq_items` | Questions de l'oracle (FR/EN, ordre, publiée) |
| `experiences` | Parcours |
| `testimonials` | Voix de Delphes, affichées dans l'oracle seulement si publiées |
| `engagements` + `engagement_roles` | Rotaract : organisation, depuis, fonctions et périodes |
| `social_links` | Liens |
| `resumes` | CV FR/EN (chemin storage, date) |
| `contact_messages` | Messages reçus, statut lu/non lu, empreinte d'IP hachée (anti-spam) |
| `slug_redirects` | Ancien slug → nouveau (SEO-10) |
| `admins` | `user_id` autorisés (un seul : Andry) |

**Row Level Security (NF-05)** — activée sur toutes les tables :
- Lecture publique : uniquement le contenu publié (`status = 'published'` pour les projets, `published = true` pour les témoignages).
- Écriture : uniquement si `auth.uid()` est dans `admins`.
- `contact_messages` : insertion publique via la Server Action seulement (clé serveur), lecture admin uniquement.

**Migration v3** (après T04, voir TASKS T04c) : une seule migration `schema_v3_luxe4` qui, sur `projects`, ajoute `short_title_fr/en`, `kind` (check `client|associative|personal`), `kind_label_fr/en`, `layout` (check `sealed|split|gallery|process`, défaut `split`), `emblem` (renommage de `scene`, enum `project_emblem`), `problem_fr/en`, `role_label_fr/en` et supprime `fun_subtitle_*`, `narration_*`, `challenges_*`, `solutions_*`, `results_*` (aucune donnée encore) ; crée `project_items`, `project_decisions`, `faq_items` (RLS + policies dans la même migration) ; ajoute `kind_fr/en`, `caption_fr/en`, `ratio` (check des 6 ratios) à `project_images` et rend `path` nullable (emplacement à fournir) ; `usage_fr/en` à `project_technologies` ; `role_fr/en`, `context_fr/en` à `technologies` (+ `lyre`, `bouclier`, `ancre` dans l'enum `weapon`) ; `domain` (check `hephaistos|athena`) à `skills` ; `available_from`, `public_email` à `profile`. Puis `db push` et `db:types`.

**Storage** : bucket `media` (images, lecture publique), bucket `resumes` (PDF, lecture publique) ; écriture réservée aux admins.

**Migrations** : fichiers SQL versionnés dans `supabase/migrations/`, appliqués au projet distant avec la CLI Supabase (`supabase db push`). **Pas de Supabase local** (évite Docker).

**Mise en veille** : les projets Supabase gratuits se mettent en pause après une semaine sans activité. Un **cron Vercel** quotidien appelle `/api/keepalive` (lecture légère) pour l'éviter.

## 5. Authentification admin

- Supabase Auth, **email + mot de passe**, inscriptions désactivées dans le tableau de bord.
- Compte unique créé à la main, son `user_id` ajouté à `admins`.
- Session en cookies via `@supabase/ssr`, rafraîchie par `proxy.ts`.
- `/admin` en `noindex`, exclu du sitemap et de `robots.txt`.

## 6. Formulaire de contact

1. Server Action : validation Zod (messages FR/EN).
2. Anti-spam : champ honeypot, délai minimal de 3 s avant envoi, limite de 3 messages par heure par empreinte d'IP (comptée dans `contact_messages`). Cloudflare Turnstile ajouté seulement si du spam passe.
3. Enregistrement en base (F-CON-06), puis envoi via Nodemailer.
4. Si l'email échoue, le message reste en base et l'utilisateur voit le message d'échec prévu.

## 7. SEO (PRD §8 bis)

- `generateMetadata` par page et par langue (title, description, canonical, `alternates.languages` pour hreflang + `x-default`).
- `src/app/sitemap.ts` et `robots.ts` dynamiques.
- `opengraph-image.tsx` par page et par langue avec `next/og`.
- Composant `JsonLd` : `Person`, `ProfilePage`, `WebSite`, `BreadcrumbList`, `CreativeWork`.
- **`NEXT_PUBLIC_SITE_URL`** : seule source de l'URL de base (canonical, sitemap, OG) pour migrer vers un domaine personnalisé.

## 8. Performance (NF-01, SEO-11)

- Polices via `next/font`, images via `next/image` (formats modernes, `sizes`, lazy hors écran).
- GSAP et Lenis chargés uniquement côté client, après le premier rendu ; animations de chant démarrées seulement quand le chant est visible (pause hors écran).
- Le nom et le `h1` du hero (texte HTML) sont l'élément LCP ; aucune animation ne les cache au premier rendu serveur.
- Le **chargeur** est un îlot client affiché seulement si JS est actif et à la 1re visite de la session (`sessionStorage` en try/catch) ; il disparaît dès `document.fonts.ready` + `load` (mini 1.4 s, sécurité CSS 8 s). Mesurer son effet en T25 et le raccourcir si le LCP en souffre.
- **Ciel** : un seul SVG (constellations) + étoiles générées une fois (canvas ou SVG), transformations GPU uniquement, parallaxe via un seul ScrollTrigger ; pause quand l'onglet est caché.
- Budget JS du site public : viser < 150 Ko gzippés au premier chargement.

## 9. Structure des dossiers

```
.
├── CLAUDE.md
├── docs/                     PRD, DESIGN, STORYBOARD, PRODUCT, ARCHITECTURE, TASKS
├── messages/                 fr.json, en.json (textes d'interface)
├── supabase/migrations/      SQL versionné
├── public/                   favicons, SVG statiques
└── src/
    ├── proxy.ts
    ├── i18n/                 routing.ts, request.ts, navigation.ts
    ├── app/
    │   ├── [locale]/
    │   │   ├── layout.tsx
    │   │   ├── page.tsx                  la one-page
    │   │   ├── projects/[slug]/page.tsx      dossier en page complète
    │   │   ├── @dossier/(.)projects/[slug]/page.tsx   dossier en overlay (interception)
    │   │   ├── @dossier/default.tsx
    │   │   └── not-found.tsx             Charybde et Scylla
    │   ├── admin/                        layout protégé, pages CRUD
    │   ├── api/keepalive/route.ts
    │   ├── sitemap.ts · robots.ts
    │   └── globals.css                   tokens DESIGN.md + Tailwind
    ├── components/
    │   ├── chants/           un dossier par section : embarcadere/, divinites/, epreuves/ (carte + aperçus), arsenal/, escales/, oracle/, hermes/, ithaque/
    │   ├── archives/         dossier (Dossier serveur + overlay client), layouts (sealed, split, gallery, process), plates (planches), lightbox
    │   ├── voyage/           sky/, loader/, cursor/, compass/ (rose + index des chants), route/ (barque entre chants), gloss-toggle, reveal (titres mot à mot)
    │   ├── engravings/       SVG au trait : chart-medallion, hammer, olive, emblems.tsx, weapons.tsx, boat, compass-rose, seal
    │   ├── ui/               composants publics réutilisables (btn, kicker, marg, gloss, folio)
    │   └── admin/            composants shadcn de l'admin
    ├── lib/
    │   ├── supabase/         client.ts, server.ts, admin.ts (service_role, serveur uniquement)
    │   ├── data/             lectures mises en cache
    │   ├── actions/          Server Actions (admin, contact)
    │   ├── validation/       schémas Zod
    │   ├── seo/              métadonnées, JSON-LD
    │   └── motion/           helpers GSAP, détection reduced-motion
    └── types/database.ts     généré par Supabase
```

## 10. Variables d'environnement

| Variable | Exposée au navigateur | Usage |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | oui | URL de base |
| `NEXT_PUBLIC_SUPABASE_URL` | oui | Client Supabase |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | oui | Lecture publique (RLS) |
| `SUPABASE_SECRET_KEY` | **non** | Insertion des messages de contact, serveur uniquement |
| `SMTP_USER` / `SMTP_APP_PASSWORD` | **non** | Gmail |
| `CONTACT_TO_EMAIL` | **non** | Destinataire |
| `CRON_SECRET` | **non** | Protège `/api/keepalive` |
| `IP_HASH_SALT` | **non** | Hachage des IP (anti-spam) |

`.env.local` jamais commité ; `.env.example` commité sans valeurs.

## 11. Qualité (sans tests automatisés)

- `tsc --noEmit`, ESLint et `next build` doivent passer avant chaque commit de fin de session.
- Revue visuelle : Playwright MCP, une capture desktop + une mobile par chant validé ; comparer à `docs/prototype/luxe-4.html`.
- Débordements : script Playwright qui vérifie `scrollWidth <= innerWidth` à 375 / 768 / 1024 / 1440 / 1920 px, et que la rose des vents ne recouvre aucun texte (gouttière ≥ 108 px).
- Montée en charge : seed temporaire 9 projets / 12 outils / 7 escales (carte, légende compacte, index, journal) — à retirer après vérification.
- Revue design : `/impeccable critique` par chant, `/impeccable audit` en fin de projet ; hook de détection actif.
- Animations : `review-animations` (Emil) par chant animé.
- Robustesse : `break-ui` sur les chants alimentés par l'admin.
- Audit final : Lighthouse mobile (≥ 95 partout, SEO = 100), Rich Results Test, contrastes clair et sombre.

## 12. Déploiement

- Dépôt GitHub → Vercel (déploiements de prévisualisation par branche, production sur `main`).
- Variables d'environnement saisies dans Vercel.
- Cron Vercel quotidien pour `/api/keepalive`.
- À la mise en ligne : Google Search Console + envoi du sitemap (SEO-14).
