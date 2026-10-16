@AGENTS.md

# CLAUDE.md — Portfolio Andry « L'Odyssée »

Portfolio bilingue FR/EN de Andry, Lead Front-End Developer React/TypeScript (+ AMOA), basé à Madagascar.
Site narratif « L'Odyssée » (mythologie grecque, style vase grec, humour discret) + route `/admin` pour éditer tout le contenu.

## Sources de vérité (lire la section utile, pas tout le fichier)

| Fichier | Contenu |
|---|---|
| `docs/TASKS.md` | Plan de sessions. **Commencer chaque session ici.** |
| `docs/PRD.md` | Exigences (IDs F-*, SEO-*, NF-*) |
| `DESIGN.md` | Tokens, typo, motion, anti-patterns (lu aussi par Impeccable) |
| `PRODUCT.md` | Contexte produit pour Impeccable |
| `docs/STORYBOARD.md` | Contenu, mise en page et animation de chaque rive |
| `docs/ARCHITECTURE.md` | Stack, routage, données, RLS, cache, env |
| `docs/prototype/odyssee-prototype.html` | **Référence visuelle exécutable** (rendu, mouvement, comportements). S'en inspirer, ne pas copier tel quel |

En cas de conflit : ARCHITECTURE > DESIGN > STORYBOARD > PRD. Signaler le conflit à Andry au lieu de trancher seul.

## Stack

Next.js 16 (App Router) · React 19 · TypeScript strict · npm · next-intl v4 · Tailwind v4 · next-themes · Supabase (`@supabase/ssr`, pas d'ORM) · Zod · shadcn/ui (admin uniquement) · GSAP + `@gsap/react` · Lenis · Nodemailer · Vercel.

## Rôle de Claude Code

Claude Code écrit **tout** le code. Andry valide les plans, relit et teste.
- En fin de tâche, résumer en quelques lignes ce qui a été fait et pourquoi, en expliquant brièvement les concepts Next.js / Supabase nouveaux (Server Components, Server Actions, cache/tags, RLS, `proxy.ts`).
- Ne pas réexpliquer JS, React ou TypeScript de base.
- Signaler clairement toute action manuelle nécessaire côté Andry (dashboard Supabase, variables d'environnement, Vercel).

## Règles de travail

- **Une tâche de `docs/TASKS.md` par session.** Plan Mode pour les tâches marquées 🧭.
- **Diffs minimaux et ciblés.** Jamais réécrire un fichier entier sans demande explicite.
- Ne rien installer qui ne soit pas dans ARCHITECTURE.md sans demander.
- Pas de tests automatisés (décision produit). Vérification = `npm run check` + revue visuelle.
- Fin de tâche : `npm run check` (tsc + lint + build) vert, cocher la tâche dans `docs/TASKS.md`, proposer un message de commit (Conventional Commits).

## Pièges Next.js 16 à respecter

- Le middleware s'appelle **`src/proxy.ts`** (fonction `proxy`). next-intl v4 : `getRequestConfig` doit renvoyer `locale` ; layout enveloppé dans `NextIntlClientProvider`.
- `params`, `searchParams`, `cookies()`, `headers()` sont **asynchrones** : toujours `await`.
- Imports de navigation depuis `next/navigation` (ou `@/i18n/navigation`), jamais `next/router`.
- Cache : vérifier l'API actuelle (`'use cache'`, `cacheTag`, `updateTag`/`revalidateTag`) dans la doc Next.js embarquée (voir AGENTS.md) avant de l'utiliser.

## Sécurité

- Clés secrètes (`SUPABASE_SECRET_KEY`, SMTP, `CRON_SECRET`, `IP_HASH_SALT`) : serveur uniquement, jamais dans un Client Component ni préfixées `NEXT_PUBLIC_`.
- Toute écriture admin : vérifier l'utilisateur **dans la Server Action** (pas seulement dans `proxy.ts`).
- RLS activée sur chaque nouvelle table, dans la même migration.
- Ne jamais lire ni afficher `.env.local`.

## Design (résumé — détails dans DESIGN.md)

- La page est le cours du Styx : une barque (Charon narrateur + Andry) descend la rivière ; chaque section est une rive, chaque bloc un **objet de l'univers** (pinax, tesson, assiette, parchemin à méandres, carte postale). Jamais de « card » de site, jamais de style cartoon.
- Beige parchemin + encre + **un seul** accent d'interface terre cuite ; objets peints en figure noire sur terre cuite, couleurs d'objets constantes dans les deux modes.
- Fraunces / Instrument Sans / JetBrains Mono. Pas de dégradés, pas d'ombres, pas de glassmorphism. Anti-patterns : DESIGN.md §10.
- La rivière, la barque et le cartouche de Charon ne chevauchent **jamais** le contenu ; tout est calculé depuis le DOM (aucune coordonnée en dur).
- Animer seulement `transform`, `opacity`, `clip-path`, `stroke-dashoffset`. `prefers-reduced-motion` = état final sans animation.
- Aucune image générée par IA. Illustrations = SVG silhouettes maison.
- Les textes viennent de la base (admin) ou de `messages/*.json`. Jamais de texte en dur dans les composants.

## Skills et outils — quand les utiliser

| Besoin | Outil |
|---|---|
| Composition, typo, critique, polish | `/impeccable` (`critique` à la fin de chaque rive) |
| Construire / revoir une animation | `animate`, `review-animations` (Emil) |
| Scènes de scroll GSAP en React | `gsap-scrolltrigger`, `gsap-react` |
| Transition liste → détail | `vercel-react-view-transitions` |
| Next.js App Router | doc embarquée (AGENTS.md) ; perf : `vercel-react-best-practices` |
| Supabase (SQL, RLS, auth, storage) | `supabase` |
| SEO | `seo` ; audit global : `web-quality-audit` |
| Données extrêmes / textes longs | `break-ui` |
| Admin UI | MCP shadcn |
| Vérif visuelle | MCP Playwright |

## Économie de tokens (Claude Pro)

- `/clear` entre deux tâches ; `/compact` si une tâche s'allonge.
- Lire seulement la section utile des docs (citée dans chaque tâche).
- Playwright : **1 capture desktop (1440) + 1 mobile (375) à la validation d’une rive**, jamais après chaque modification.
- Pas de sous-agents en parallèle. Pas de relecture de fichiers déjà en contexte.

## Commandes

```bash
npm run dev          # serveur local
npm run check        # tsc --noEmit && eslint && next build
npm run db:types     # supabase gen types typescript --linked > src/types/database.ts
npx supabase db push # applique les migrations au projet distant
```

## Conventions

- Code, noms de fichiers et commits en anglais ; échanges avec Andry en français.
- Composants : un dossier par rive dans `src/components/stops/`, objets dans `src/components/objects/`, moteur dans `src/components/odyssey/`. Server Component par défaut, `'use client'` seulement pour l'interactivité.
- Données : lecture dans `src/lib/data/`, écritures dans `src/lib/actions/`, schémas dans `src/lib/validation/`.
