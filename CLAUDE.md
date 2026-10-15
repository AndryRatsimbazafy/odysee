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
| `docs/STORYBOARD.md` | Contenu, mise en page et animation de chaque chant |
| `docs/ARCHITECTURE.md` | Stack, routage, données, RLS, cache, env |

En cas de conflit : ARCHITECTURE > DESIGN > STORYBOARD > PRD. Signaler le conflit à Andry au lieu de trancher seul.

## Stack

Next.js 16 (App Router) · React 19 · TypeScript strict · npm · next-intl v4 · Tailwind v4 · next-themes · Supabase (`@supabase/ssr`, pas d'ORM) · Zod · shadcn/ui (admin uniquement) · GSAP + `@gsap/react` · OGL · Nodemailer · Vercel.

## Mode d'apprentissage

Andry apprend Next.js et Supabase. Le style de sortie **Learning** est actif :
- Expliquer brièvement le *pourquoi* des concepts nouveaux (Server Components, Server Actions, cache/tags, RLS, `proxy.ts`).
- Laisser Andry écrire lui-même les parties marquées **[Andry]** dans `docs/TASKS.md` (TODO guidés, puis relecture).
- Ne pas réexpliquer JS, React ou TypeScript de base.

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

- Beige parchemin + encre + **un seul** accent terre cuite ; or = ornement seulement.
- Fraunces / Instrument Sans / JetBrains Mono. Rayons 0. Pas de dégradés, pas d'ombres, pas de glassmorphism.
- Chaque chant a sa propre composition. Respecter la liste d'anti-patterns de DESIGN.md §11.
- Animer seulement `transform`, `opacity`, `clip-path`, `stroke-dashoffset`. `prefers-reduced-motion` = état final sans animation.
- Aucune image générée par IA. Illustrations = SVG silhouettes maison.
- Les textes viennent de la base (admin) ou de `messages/*.json`. Jamais de texte en dur dans les composants.

## Skills et outils — quand les utiliser

| Besoin | Outil |
|---|---|
| Composition, typo, critique, polish | `/impeccable` (`critique` à la fin de chaque chant) |
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
- Playwright : **1 capture desktop (1440) + 1 mobile (375) à la validation d'un chant**, jamais après chaque modification.
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
- Composants : un dossier par chant dans `src/components/chants/`. Server Component par défaut, `'use client'` seulement pour l'interactivité.
- Données : lecture dans `src/lib/data/`, écritures dans `src/lib/actions/`, schémas dans `src/lib/validation/`.