# ARCHITECTURE.md — Portfolio Andry

> Étape 5 du workflow · v1.0 (validée) · 2026-10-15
> v2.0 (2026-10-16) : direction « traversée du Styx » — Lenis ajouté, WebGL/OGL retiré, rives générées depuis les données. Référence visuelle : `docs/prototype/odyssee-prototype.html`.
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
| Thème | **next-themes** (attribut `data-theme`) | Hélios/Nyx sans flash au chargement |
| Données | **Supabase** (Postgres, Auth, Storage) via `@supabase/supabase-js` + `@supabase/ssr` | Pas d'ORM : une couche de moins, RLS natif, apprentissage direct de Supabase |
| Types BDD | `supabase gen types` → `src/types/database.ts` | Typage de bout en bout sans ORM |
| Validation | **Zod** | Partagée client/serveur (formulaires, Server Actions) |
| Formulaires admin | **react-hook-form** + composants **shadcn/ui** | Formulaires bilingues longs |
| Formulaire contact | Server Action + `useActionState` (React 19) | Léger, fonctionne sans JS côté client |
| Email | **Nodemailer** + Gmail SMTP (mot de passe d'application) | F-CON-03, gratuit |
| Animations | **GSAP** + `@gsap/react` (ScrollTrigger) | Barque, rivière, narrateur, scènes, assiettes |
| Scroll fluide | **Lenis** (branché sur le ticker GSAP, `data-lenis-prevent` sur les zones qui défilent seules) | Traversée fluide ; désactivé en reduced-motion |
| Transitions | API View Transitions de React | F-PRO-07 |
| Icônes UI | lucide-react | DESIGN §6 |
| Hébergement | **Vercel** (Hobby) | Gratuit, intégré à Next.js |

## 2. Rendu et mise à jour du contenu

- **Tout le site public est en Server Components**, rendu statique par langue et par projet (`generateStaticParams`). Les Client Components sont réservés aux îlots interactifs : rivière, barque et cartouche de Charon, animations de rive, onglets Athéna/Héphaïstos, modale, formulaire, bascule de thème.
- **Rives générées depuis les données** : la page serveur rend une rive par section fixe et une rive par projet publié ; l'ordre détermine le côté (gauche/droite). Le composant client `River` mesure les rives (ResizeObserver) et calcule le tracé ; ajouter du contenu dans l'admin redessine la rivière sans code.
- **Bibliothèques d'illustrations** (`src/components/odyssey/library/`) : armes légendaires, scènes de bataille, timbres ; chaque élément de contenu reçoit une illustration par mapping, sinon la suivante de la réserve.
- **Lecture des données** dans `src/lib/data/*` : fonctions serveur mises en cache (Cache Components : `'use cache'` + `cacheTag('projects')`, `cacheTag('profile')`, etc.).
- **Mise à jour sans redéploiement (F-ADM-11)** : chaque Server Action de l'admin invalide le tag concerné (`updateTag` / `revalidateTag`). Le site public se régénère à la visite suivante.
- **Repli** si l'API de cache diffère au moment de l'implémentation : ISR + `revalidatePath`. Le principe ne change pas.
- Le client Supabase du site public utilise la **clé publique** (lecture seule via RLS). La clé `service_role` n'est jamais utilisée côté public.

## 3. Routage

```
/                      → redirige vers /fr ou /en (langue du navigateur)
/[locale]              → page one-page (prologue → épilogue)
/[locale]/projects/[slug] → détail d'un travail
/admin                 → admin (FR uniquement, hors i18n, noindex)
/admin/login           → connexion
/api/keepalive         → ping Supabase (cron Vercel)
sitemap.xml, robots.txt, opengraph-image → générés (SEO)
```

- `src/proxy.ts` (ex-middleware, renommé en Next.js 16) : gère la langue sur le site public et rafraîchit la session Supabase sur `/admin`.
- Le `proxy` n'est **pas** la seule protection : le layout `/admin` et **chaque** Server Action vérifient l'utilisateur côté serveur (F-ADM-02).

## 4. Modèle de données (Supabase)

Tables (colonnes bilingues suffixées `_fr` / `_en`) :

| Table | Rôle |
|---|---|
| `profile` | Ligne unique : identité, hero, bio, disponibilité, SEO accueil, photo |
| `projects` | Travaux (slug, textes FR/EN, statut `draft`/`published`, ordre, confidentiel, associatif, SEO, `updated_at`) |
| `project_images` | Galerie (chemin storage, alt FR/EN, ordre) |
| `technologies` | Nom, catégorie, années d'usage, mis en avant |
| `project_technologies` / `experience_technologies` | Liaisons |
| `skills` | Compétences FR/EN, ordre |
| `experiences` | Parcours |
| `testimonials` | Oracles (publié, ordre) |
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
- GSAP et Lenis chargés uniquement côté client, après le premier rendu ; animations de rive démarrées seulement quand la rive est visible (pause hors écran).
- Le nom sur le pinax (texte HTML) est l'élément LCP ; aucune animation ne le cache au premier rendu.
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
    │   │   ├── projects/[slug]/page.tsx
    │   │   └── not-found.tsx             labyrinthe
    │   ├── admin/                        layout protégé, pages CRUD
    │   ├── api/keepalive/route.ts
    │   ├── sitemap.ts · robots.ts
    │   └── globals.css                   tokens DESIGN.md + Tailwind
    ├── components/
    │   ├── stops/            une rive par dossier : embarcadere/, courant/, rive-dieux/, forge/, epreuve/, escales/, delphes/, hermes/, elysee/
    │   ├── odyssey/          river/, ferry/ (barque + Charon + Andry), charon-caption/, narrator/
    │   ├── objects/          pinax, shard (tesson), plate (assiette), meander-frame, postcard, wax-seal, dock
    │   ├── odyssey/library/  weapons.tsx, scenes.tsx, stamps.tsx (SVG figure noire + animations)
    │   ├── ui/               composants publics réutilisables
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
- Revue visuelle : Playwright MCP, une capture desktop + une mobile par rive validée ; comparer au prototype.
- Chevauchements : script Playwright qui fait défiler la page par pas de 60 px à 1920 / 1440 / 1280 / 1000 / 920 px et vérifie que le cartouche de Charon ne touche ni rive, ni navigation, ni barque.
- Revue design : `/impeccable critique` par rive, `/impeccable audit` en fin de projet ; hook de détection actif.
- Animations : `review-animations` (Emil) par rive animée.
- Robustesse : `break-ui` sur les rives alimentées par l'admin.
- Audit final : Lighthouse mobile (≥ 95 partout, SEO = 100), Rich Results Test, contrastes clair et sombre.

## 12. Déploiement

- Dépôt GitHub → Vercel (déploiements de prévisualisation par branche, production sur `main`).
- Variables d'environnement saisies dans Vercel.
- Cron Vercel quotidien pour `/api/keepalive`.
- À la mise en ligne : Google Search Console + envoi du sitemap (SEO-14).
