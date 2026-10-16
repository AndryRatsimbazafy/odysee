# Guide des prompts Claude Code — L'Odyssée

Oct 16, 2026 · @Andry

## Mode d'emploi

Le projet compte 24 sessions de construction et 4 sessions de revue, de T01b jusqu'au lancement. Je n'ai regroupé que les tâches petites ou très proches : tout le reste reste à une tâche par session, pour que le contexte reste léger.

**Chaque session suit le même rituel :**

1. Tape `/clear`.
2. Colle le prompt de la tâche.
3. Si la tâche porte 🧭, Claude Code propose un plan. Lis-le, corrige-le si besoin, puis valide.
4. Relis le résumé de fin de tâche et fais les actions manuelles qu'il signale.
5. Vérifie que `npm run check` est vert, que la tâche est cochée dans `docs/TASKS.md`, puis valide le commit proposé.

**Regroupements retenus :**

| Session | Tâches | Pourquoi c'est groupé |
| --- | --- | --- |
| S1 | T01b + T02 | T01b, ce sont deux commandes npm |
| S19 | T20 + T22 | Delphes reste masquée (aucun témoignage), donc peu de travail ; l'épilogue et la 404 sont courts |
| S24 | T26 + T27 | Surtout des actions manuelles de ta part |

**À ne jamais grouper :** les tâches 🧭 (T03, T04, T07, T09, T11, T17, T21, T23) et les rives avec capture Playwright. Ce sont elles qui remplissent le contexte.

**Pour les revues de phase :** lance-les dans une session neuve. Elles lisent uniquement les commits et les docs utiles, et repèrent les écarts avant que tu ne construises dessus.

## Phase 1 — Fondations (S1 à S5 + revue)

C'est la phase la plus technique. À la fin, le site affiche une page vide mais correcte, avec le thème, les deux langues, la base de données et la navigation.

### S1 — T01b + T02 · Dépendances et tokens

```
Lis CLAUDE.md puis les tâches T01b et T02 de docs/TASKS.md.
Fais d'abord T01b : désinstalle ogl, installe lenis.
Puis T02 : lis seulement DESIGN.md §2, §3 et §7. Mets en place les tokens d'interface et les couleurs d'objets dans globals.css (avec @theme Tailwind), les trois polices via next/font, next-themes (Hélios / Nyx) et une page /dev/tokens temporaire.
Compare les couleurs avec docs/prototype/odyssee-prototype.html.
Termine par npm run check, coche T01b et T02, et propose un commit par tâche.
```

**À vérifier :** ouvre `/dev/tokens` en clair et en sombre. Les objets (terre cuite, figure noire) doivent garder la même couleur dans les deux modes.

### S2 — T03 · i18n FR/EN 🧭

```
Lis CLAUDE.md (section « Pièges Next.js 16 ») puis la tâche T03 de docs/TASKS.md et ARCHITECTURE.md §3.
Passe en Plan Mode et présente-moi le plan avant de coder.
Points d'attention : le middleware est src/proxy.ts, getRequestConfig renvoie locale, le layout est enveloppé dans NextIntlClientProvider.
Mets les narrations et les répliques de Charon des rives fixes dans messages/fr.json et messages/en.json, à partir de docs/STORYBOARD.md. Traduis les versions EN et signale-moi celles que je dois relire.
```

**À vérifier :** `/fr` et `/en` fonctionnent, `/` redirige vers une langue, le sélecteur garde la page courante.

### S3 — T04 · Schéma Supabase et RLS 🧭

```
Lis CLAUDE.md puis la tâche T04 de docs/TASKS.md, ARCHITECTURE.md §4 et PRD.md §7.
Passe en Plan Mode et présente-moi le schéma complet : tables, colonnes FR/EN, politiques RLS de chaque table et buckets de stockage.
Après validation : écris les migrations (RLS dans la même migration que chaque table), lance supabase link, db push et npm run db:types.
Donne-moi la requête SQL exacte pour m'ajouter dans la table admins, et liste ce que je dois faire à la main dans le dashboard Supabase.
```

👤 **Toi :** exécute la requête d'ajout dans `admins` (SQL Editor de Supabase) avec ton `user_id` (Authentication → Users). `supabase link` te demandera le mot de passe de la base.

### S4 — T05 · Clients Supabase, lectures en cache et seed

```
Lis CLAUDE.md puis la tâche T05 de docs/TASKS.md et ARCHITECTURE.md §2.
Crée les clients Supabase (serveur, navigateur, admin), les fonctions de lecture dans src/lib/data/ avec 'use cache' et cacheTag (vérifie l'API dans la doc embarquée), et un seed de démo : le profil, les 4 projets, 3 escales et 6 technos du prototype.
Aucun témoignage dans le seed.
Explique-moi en quelques lignes comment fonctionne le cache par tags.
```

**À vérifier :** les données apparaissent dans le Table Editor de Supabase.

### S5 — T06 · Layout public et navigation

```
Lis CLAUDE.md puis la tâche T06 de docs/TASKS.md et DESIGN.md §7.
Reproduis la navigation du prototype (docs/prototype/odyssee-prototype.html) : cadre à double filet, liens en mono, ✦ CV, FR/EN, Hélios/Nyx. Ajoute le lien d'évitement, les landmarks et le pied de page.
À la fin : une capture Playwright desktop (1440) et mobile (375), puis /impeccable critique.
```

### R1 — Revue de la phase 1

```
Lis CLAUDE.md, puis git log des commits de la phase 1 et ARCHITECTURE.md §1 à §4.
Vérifie la cohérence entre le code et l'architecture : arborescence, proxy.ts, cache, RLS, clés secrètes jamais côté client.
Donne-moi une liste courte des écarts, classés par gravité. Ne corrige rien sans mon accord.
```

## Phase 2 — Admin (S6 à S9 + revue)

À la fin de cette phase, tu peux saisir tout ton contenu réel depuis `/admin`. Les rives de la phase 4 s'appuieront dessus. L'admin est utilitaire : shadcn/ui, sobre, sans narration.

### S6 — T07 · Authentification admin 🧭

```
Lis CLAUDE.md (section Sécurité) puis la tâche T07 de docs/TASKS.md et ARCHITECTURE.md §5.
Passe en Plan Mode et présente-moi le plan avant de coder.
Attendu : /admin/login (email + mot de passe), rafraîchissement de session @supabase/ssr dans proxy.ts, layout /admin protégé côté serveur, une fonction requireAdmin() appelée dans chaque Server Action, noindex sur tout /admin, socle shadcn via le MCP shadcn.
Explique-moi pourquoi la vérification dans proxy.ts ne suffit pas.
```

**À vérifier :** une fenêtre de navigation privée sur `/admin` doit renvoyer vers le login ; un mauvais mot de passe affiche une erreur claire.

### S7 — T08 · Profil, engagement, liens, CV

```
Lis CLAUDE.md puis la tâche T08 de docs/TASKS.md et PRD.md F-ADM-03, F-ADM-07, F-ADM-13, F-ADM-14.
Crée les écrans admin du profil (champs FR/EN côte à côte), de l'engagement Rotaract, des liens sociaux et de l'upload des CV FR et EN.
Écritures dans src/lib/actions/, schémas Zod dans src/lib/validation/, updateTag après chaque écriture pour que le site se mette à jour sans redéploiement.
Pose un pattern de formulaire réutilisable : je veux le même en T09 et T10.
```

**À vérifier :** modifie ton accroche dans l'admin, recharge la page publique, elle doit avoir changé.

### S8 — T09 · Projets 🧭

```
Lis CLAUDE.md puis la tâche T09 de docs/TASKS.md, PRD.md F-ADM-04, F-ADM-08, F-ADM-09, F-ADM-15 et SEO-09, SEO-10.
Passe en Plan Mode et présente-moi le plan avant de coder.
Réutilise le pattern de formulaire de T08. Champs FR/EN, narration et réplique de Charon, scène de bataille optionnelle, capture principale et galerie (storage, alt FR/EN), projet scellé ou associatif, statut brouillon/publié, ordre, champs SEO, redirection automatique quand le slug change.
```

### S9 — T10 · Expériences, technos, savoir-faire, témoignages, messages

```
Lis CLAUDE.md puis la tâche T10 de docs/TASKS.md et PRD.md F-ADM-05, F-ADM-06, F-ADM-10, F-ADM-14.
Réutilise le pattern de formulaire de T08 pour les expériences (avec message de carte postale), les technologies (arme optionnelle, liste des armes de DESIGN.md), les savoir-faire et les témoignages.
Ajoute la liste des messages de contact en lecture seule (marquer comme lu, supprimer).
```

👤 **Toi :** après cette session, commence à saisir ton vrai contenu (profil, expériences, technos). Les projets peuvent rester ceux du seed jusqu'à T27.

### R2 — Revue de la phase 2

```
Lis CLAUDE.md (section Sécurité), puis git log des commits de la phase 2.
Vérifie chaque Server Action de src/lib/actions/ : requireAdmin() appelé, validation Zod, updateTag correct, aucune clé secrète côté client.
Donne-moi une liste courte des écarts, classés par gravité. Ne corrige rien sans mon accord.
```

## Phase 3 — Le moteur du Styx (S10 à S12 + revue)

C'est le cœur de l'expérience et la partie la plus délicate. À ce stade, les rives sont des blocs simples avec juste un titre : on construit la rivière, la barque et le cartouche sur une structure qui se mesure toute seule, avant d'habiller chaque rive.

### S10 — T11 · Rives et rivière 🧭

```
Lis CLAUDE.md puis la tâche T11 de docs/TASKS.md et DESIGN.md §4.
Dans docs/prototype/odyssee-prototype.html, lis uniquement la fonction build et le CSS des rives.
Passe en Plan Mode et présente-moi le plan avant de coder.
Attendu : un composant Stop (côté gauche/droite calculé depuis l'index), des rives provisoires (titre seul) pour toute la page, un composant client River qui mesure les rives avec ResizeObserver et dessine le lit, le tracé d'encre et les rides. La rivière ne traverse qu'entre les rives. Aucune coordonnée en dur. Comportement mobile.
Utilise les skills gsap-scrolltrigger et gsap-react.
```

**À vérifier :** redimensionne la fenêtre. La rivière doit se redessiner sans jamais couper une rive.

### S11 — T12 · La barque, Charon et Andry

```
Lis CLAUDE.md puis la tâche T12 de docs/TASKS.md et DESIGN.md §5.
Dans docs/prototype/odyssee-prototype.html, lis uniquement le SVG #ferry et les fonctions update et say.
Attendu : la barque suit la rivière au scroll, avec inclinaison selon la pente, retournement au changement de sens, tangage, réaction à la vitesse, clignement des yeux et salut. Lenis branché sur le ticker GSAP. Avec prefers-reduced-motion, la barque est posée sans animation.
Puis lance le skill review-animations sur ce que tu as fait.
```

### S12 — T13 · Cartouche de Charon et narrateur

```
Lis CLAUDE.md puis la tâche T13 de docs/TASKS.md et DESIGN.md §5 et §8.
Attendu : le cartouche de Charon cherche une place libre autour de la barque (sans toucher les rives, la nav, le ponton ni la barque) et s'efface s'il n'en trouve pas. Sur mobile, un bandeau qui s'affiche 4,5 s à chaque nouvelle réplique. Le narrateur allume la phrase mot à mot au scroll.
Vérifie avec un script Playwright sur 4 largeurs (375, 768, 1024, 1440) qu'aucun chevauchement n'existe. Pas de captures, juste le résultat du script.
```

### R3 — Revue du moteur

```
Lis CLAUDE.md, puis le code de src/components/odyssey/.
Lance le skill review-animations sur l'ensemble du moteur, puis vercel-react-best-practices pour la performance (re-renders, écouteurs de scroll, ResizeObserver nettoyés).
Donne-moi une liste courte des problèmes, classés par gravité. Ne corrige rien sans mon accord.
```

## Phase 4 — Les rives (S13 à S20 + revue)

On remplace chaque rive provisoire par la vraie, une session par rive. Chaque prompt finit par la même ligne de clôture : ne la retire pas, c'est elle qui garde la qualité constante.

### S13 — T14 · L'embarcadère

```
Lis CLAUDE.md puis la tâche T14 de docs/TASKS.md, la ligne « L'embarcadère » de docs/STORYBOARD.md et DESIGN.md §6 (objets).
Dans docs/prototype/odyssee-prototype.html, regarde uniquement la section hero et le ponton.
Attendu : pinax suspendu qui se balance, nom qui se compose lettre à lettre, sceau olive « Disponible » (sans chevaucher le nom), accroche, CTA « Embarquer », lien CV, ponton. Titre, spécialité et disponibilité visibles sans scroller, même en 375.
Clôture : npm run check, capture Playwright 1440 + 375, /impeccable critique, review-animations, coche la tâche et propose le commit.
```

### S14 — T15 · Le courant + Rive I

```
Lis CLAUDE.md puis la tâche T15 de docs/TASKS.md et les lignes 2 et 3 de docs/STORYBOARD.md.
Dans le prototype, regarde uniquement la narration et la Rive I.
Attendu : la narration du courant, l'interrupteur Athéna (AMOA) / Héphaïstos (Dev) avec onglets accessibles au clavier, la chouette et le marteau en SVG, l'exploit quand les deux côtés ont été vus, et l'encart « Le soir, à l'agora » pour le Rotaract. Le front reste l'argument principal, l'AMOA est un plus.
Clôture : npm run check, capture Playwright 1440 + 375, /impeccable critique, review-animations, coche la tâche et propose le commit.
```

### S15 — T16 · Rive II, la forge

```
Lis CLAUDE.md puis la tâche T16 de docs/TASKS.md, DESIGN.md §6 (assiettes et mapping des armes) et la ligne « La forge » de docs/STORYBOARD.md.
Dans le prototype, regarde uniquement la section forge.
Attendu : scène d'Héphaïstos animée, une assiette par technologie lue en base, arme selon le mapping ou prise dans la réserve si aucune n'est choisie, animation propre à chaque arme au survol (et au focus clavier), cadre à méandres ΙΕΧΝΑΙ pour les savoir-faire.
Teste avec 3 et avec 12 technologies.
Clôture : npm run check, capture Playwright 1440 + 375, /impeccable critique, review-animations, coche la tâche et propose le commit.
```

### S16 — T17 · Les épreuves 🧭

```
Lis CLAUDE.md puis la tâche T17 de docs/TASKS.md, DESIGN.md §6 (tesson, scènes de bataille) et la ligne « Les épreuves » de docs/STORYBOARD.md.
Passe en Plan Mode et présente-moi le plan avant de coder.
Attendu : une rive par projet publié, dans l'ordre de l'admin, côté alterné. Tesson qui s'échoue, scène de bataille en boucle (celle du projet, sinon la suivante de la bibliothèque), emplacement de capture, sceau pour les projets scellés, réplique de Charon propre au projet, lien « Lire l'épreuve » (pour l'instant vers la page détail). Le texte ne déborde jamais du tesson.
Clôture : npm run check, capture Playwright 1440 + 375, /impeccable critique, review-animations, coche la tâche et propose le commit.
```

### S17 — T18 · La modale de l'épreuve

```
Lis CLAUDE.md puis la tâche T18 de docs/TASKS.md et la section « Modale » de docs/STORYBOARD.md. Utilise le skill vercel-react-view-transitions.
Dans le prototype, regarde uniquement la modale.
Attendu : cadre à méandres qui se déplie depuis le centre, galerie, toutes les sections, zone qui défile seule (data-lenis-prevent et min-height: 0), bouton « Refermer ✕ » sur une ligne, Échap, clic à côté, focus piégé puis rendu au lien.
Garde aussi la page /[locale]/projects/[slug] avec le même contenu en rendu serveur, pour le SEO et le partage de lien.
Clôture : npm run check, capture Playwright 1440 + 375 de la modale ouverte, /impeccable critique, review-animations, coche la tâche et propose le commit.
```

### S18 — T19 · Rive III, les escales

```
Lis CLAUDE.md puis la tâche T19 de docs/TASKS.md, DESIGN.md §6 (carte, cartes postales) et la ligne « Les escales » de docs/STORYBOARD.md.
Dans le prototype, regarde uniquement la section escales.
Attendu : carte de navigation avec un port par expérience généré depuis la base, navire qui avance au scroll, une carte postale par expérience avec timbre (en boucle dans la bibliothèque) et tampon postal.
Teste avec 1 et avec 6 expériences.
Clôture : npm run check, capture Playwright 1440 + 375, /impeccable critique, review-animations, coche la tâche et propose le commit.
```

### S19 — T20 + T22 · Delphes, épilogue et 404

```
Lis CLAUDE.md puis les tâches T20 et T22 de docs/TASKS.md et les lignes « Delphes », « Épilogue » et la section 404 de docs/STORYBOARD.md.
T20 : trépied fumant, une prophétie par témoignage publié, bouton « Consulter à nouveau ». La rive est masquée quand la table est vide, sans trou dans la rivière. Teste-la avec un témoignage temporaire que tu supprimes ensuite.
T22 : Champs Élysées (soleil qui se lève au scroll, obole lancée vers la barque), « Remonter le Styx », page 404 labyrinthe, message console.
Clôture : npm run check, capture Playwright 1440 + 375 de l'épilogue et de la 404, /impeccable critique, review-animations, coche les deux tâches et propose un commit par tâche.
```

### S20 — T21 · L'embouchure, Hermès 🧭

```
Lis CLAUDE.md (section Sécurité) puis la tâche T21 de docs/TASKS.md, ARCHITECTURE.md §6 et la section « Contact » de docs/STORYBOARD.md.
Passe en Plan Mode et présente-moi le plan avant de coder.
Attendu : la lettre dans le cadre à méandres, validation en direct avec les messages du storyboard, Server Action sendContactMessage (Zod, honeypot, délai minimum, limite par IP hachée, sauvegarde en base, envoi Nodemailer), sandale ailée qui s'envole à l'envoi, message d'échec avec l'email en texte.
Explique-moi en quelques lignes comment fonctionne une Server Action.
Clôture : npm run check, capture Playwright 1440 + 375, /impeccable critique, review-animations, coche la tâche et propose le commit.
```

👤 **Toi :** il faut le mot de passe d'application Gmail dans `.env.local` avant de tester l'envoi. Envoie-toi un vrai message pour vérifier.

### R4 — Revue des rives

```
Lis CLAUDE.md et DESIGN.md §10 (anti-patterns).
Lance /impeccable critique sur la page complète, en clair et en sombre, avec une seule capture desktop et une seule mobile.
Cherche ce qui ressemble à un template, les incohérences entre rives et le texte en dur dans les composants.
Donne-moi une liste courte, classée par gravité. Ne corrige rien sans mon accord.
```

## Phase 5 — SEO, qualité, mise en ligne (S21 à S24)

Cette phase n'ajoute rien de visible : elle rend le site trouvable, robuste et rapide, puis le met en ligne.

### S21 — T23 · SEO complet 🧭

```
Lis CLAUDE.md puis la tâche T23 de docs/TASKS.md, PRD.md §8 bis et ARCHITECTURE.md §7. Utilise le skill seo.
Passe en Plan Mode et présente-moi le plan avant de coder.
Attendu : generateMetadata par page et par langue, hreflang FR/EN + x-default, sitemap.xml (projets publiés inclus), robots.txt (/admin exclu), images Open Graph dynamiques aux couleurs du site, JSON-LD Person + WebSite + CreativeWork pour chaque projet. L'URL de base vient d'une variable d'environnement.
Vérifie le HTML rendu d'une page projet avec curl et montre-moi les balises.
```

### S22 — T24 · Robustesse

```
Lis CLAUDE.md puis la tâche T24 de docs/TASKS.md. Utilise le skill break-ui.
Teste ces cas : textes très longs (titre, accroche, nom de projet), champ EN vide (repli sur le FR), 0, 1 et 10 projets, 0 témoignage, 12 technologies, 1 expérience.
Pour chaque cas, la rivière et le cartouche doivent s'adapter sans chevauchement : relance le script Playwright de T13.
Donne-moi un tableau cas → résultat, corrige ce qui casse, puis remets le seed d'origine.
```

### S23 — T25 · Accessibilité et performance

```
Lis CLAUDE.md puis la tâche T25 de docs/TASKS.md.
Lance dans l'ordre /impeccable audit, web-quality-audit puis vercel-react-best-practices.
Vérifie : contrastes AA en clair et en sombre, navigation complète au clavier avec focus visible, lecture complète avec prefers-reduced-motion, éléments décoratifs masqués aux lecteurs d'écran, Lighthouse mobile ≥ 95 sur le build de production.
Donne-moi les scores avant / après.
```

### S24 — T26 + T27 · Déploiement et lancement

```
Lis CLAUDE.md puis les tâches T26 et T27 de docs/TASKS.md et ARCHITECTURE.md §10.
Prépare le déploiement Vercel : vercel.json avec le cron /api/keepalive protégé par CRON_SECRET, et la liste exacte des variables d'environnement à saisir dans Vercel (noms seulement, jamais les valeurs).
Donne-moi ensuite une checklist de lancement étape par étape, que je suivrai moi-même.
```

👤 **Toi :**

- [ ] Connecter le dépôt GitHub à Vercel et saisir les variables d'environnement
- [ ] En production : envoyer un message de contact, te connecter à l'admin, modifier un texte et vérifier qu'il change sans redéploiement
- [ ] Le lendemain, vérifier dans Vercel que le cron keepalive a tourné
- [ ] Saisir les vrais contenus : fiches projet, captures, CV FR et EN
- [ ] Ajouter de vrais témoignages s'il y en a (Delphes apparaît toute seule)
- [ ] Lighthouse final sur l'URL de production
- [ ] Google Search Console : ajouter le site et soumettre le sitemap

## Prompts de secours

Ces prompts servent à tout moment, quand une session ne se passe pas comme prévu.

**Tu approches de ta limite Pro en pleine tâche :**

```
Arrête-toi là. Note dans docs/TASKS.md, sous la tâche en cours, ce qui est fait, ce qui reste et les fichiers touchés. Ne commite pas.
```

**Reprendre après une interruption (nouvelle session) :**

```
Lis CLAUDE.md puis la tâche TXX de docs/TASKS.md et la note de reprise en dessous. Lance git status pour voir l'état, puis termine la tâche.
```

**Le rendu s'éloigne du prototype :**

```
Ce n'est pas le même rendu que docs/prototype/odyssee-prototype.html. Regarde uniquement [la section concernée] dans le prototype, liste les différences, puis corrige-les une par une.
```

**Le plan proposé ne te convient pas :**

```
Non, change le plan : [ce que tu veux à la place]. Représente-moi le plan corrigé sans coder.
```

**npm run check échoue et Claude Code tourne en rond :**

```
Stop. Montre-moi la première erreur exacte, explique sa cause en deux lignes et propose un seul correctif ciblé. Ne touche à aucun autre fichier.
```

**Un bug trouvé plus tard, hors de la tâche en cours :**

```
Lis CLAUDE.md. Bug : [description, page, largeur d'écran, mode clair ou sombre]. Trouve la cause, propose un correctif minimal, et dis-moi si une tâche déjà cochée est concernée.
```

**Changer le design ou le contenu une fois le site fini :**

```
Lis CLAUDE.md et DESIGN.md §[section]. Je veux changer [ce qui change]. Mets d'abord à jour DESIGN.md (ou STORYBOARD.md), montre-moi le diff, puis applique dans le code.
```
