# PRD — Portfolio Andry (v3.0)

> Statut : validé · Étapes 3–4 du workflow · Date : 2026-10-15
> v1.1 : clair/sombre confirmé, positionnement AMOA, accord Bocasay, exigences SEO renforcées, aucun test automatisé
> v1.2 : direction « L'Odyssée », témoignages, engagement Rotaract, éléments fun
> v2.0 (2026-10-16) : traversée du Styx (abandonnée).
> **v3.0 (2026-10-16) : direction luxe-4, portulan de nuit** — chants, bande d'identité, carte + archives, dossiers par layout, arsenal en index, journal des escales, oracle (FAQ), ciel zodiacal, chargeur, curseur, rose des vents, notes de Charon masquables, contenu extensible (8+ projets). Référence : `docs/prototype/luxe-4.html`.
> Source de vérité produit. Sert d'entrée à `PRODUCT.md` (Impeccable) et au plan de tâches Claude Code.

---

## 1. Vision

Un portfolio bilingue FR/EN au design unique, qui capte l'attention d'un recruteur en moins de 10 secondes et le convainc en moins de 2 minutes que je suis le bon développeur front-end pour un poste remote.

Le site est lui-même une preuve de compétence. Sa qualité d'exécution (design, animations, performance, accessibilité) fait partie du pitch.

## 2. Objectifs

| # | Objectif | Indicateur de succès |
|---|---|---|
| O1 | Obtenir des prises de contact qualifiées (CDI, freelance) | ≥ 1 message de contact pertinent / mois après mise en ligne |
| O2 | Faire comprendre mon profil instantanément | Titre + spécialité + disponibilité lisibles sans scroll (above the fold) |
| O3 | Prouver l'expertise front par le site lui-même | Lighthouse ≥ 95 (Perf, A11y, Best Practices, SEO) sur mobile |
| O4 | Contenu à jour sans toucher au code | 100 % du contenu éditable via `/admin` |
| O5 | Découvrir Next.js (App Router) et Supabase | Comprendre les choix techniques grâce aux explications de Claude Code à chaque session |

## 3. Cibles (personas)

| Persona | Ce qu'il cherche | Temps accordé | Ce qui le convainc |
|---|---|---|---|
| **RH / Talent acquisition** | Poste, années d'XP, stack, langues, disponibilité, remote OK, CV | 30 s – 1 min | Clarté, CV téléchargeable, mots-clés de la stack visibles |
| **CTO / Lead technique** | Profondeur technique, qualité du code, choix d'architecture, rôle réel dans les projets | 2 – 5 min | Études de cas détaillées (contexte → défis → solutions → résultats), lien repo quand possible |
| **Client (freelance)** | Fiabilité, résultats concrets, capacité à comprendre un besoin métier | 1 – 3 min | Résultats et impact, parcours, facilité de contact |

## 4. Périmètre

### V1 (dans le périmètre)
- Site public one-page + pages de détail projet
- Bilingue FR/EN (saisie manuelle des deux langues)
- Mode clair / sombre
- Formulaire de contact avec envoi d'email (Gmail SMTP)
- Route `/admin` protégée pour éditer tout le contenu
- Téléchargement du CV (PDF FR et EN)

### Hors périmètre V1
- Blog / notes techniques
- Statistiques de visite
- Nom de domaine personnalisé (domaine `*.vercel.app` en V1)
- Multi-utilisateurs admin, rôles
- Traduction automatique
- **Tests automatisés** (unitaires, intégration, e2e) : la qualité est vérifiée par revue visuelle (Playwright MCP, captures), audits Impeccable et audits Lighthouse

## 5. Exigences fonctionnelles — site public

Priorités : **M** = Must, **S** = Should, **C** = Could.

### 5.1 Navigation & globaux
| ID | Exigence | Prio |
|---|---|---|
| F-GLO-01 | Navigation vers les sections (ancres) + retour depuis une page projet | M |
| F-GLO-02 | Sélecteur de langue FR/EN, conserve la page courante | M |
| F-GLO-03 | URL localisées (`/fr/...`, `/en/...`) ; langue par défaut détectée via le navigateur | M |
| F-GLO-04 | Bascule clair/sombre, respecte la préférence système par défaut, choix mémorisé | M |
| F-GLO-05 | Animations respectant `prefers-reduced-motion` | M |
| F-GLO-06 | Page 404 soignée et bilingue | S |

### 5.2 Hero (L'embarcadère)
| ID | Exigence | Prio |
|---|---|---|
| F-HER-01 | Nom (display), rôle, accroche en `h1` et paragraphe de présentation | M |
| F-HER-02 | Indicateur de disponibilité (CDI / freelance / remote + date), éditable | M |
| F-HER-03 | 2 CTA : « Voir les réalisations » (Chant II) et « Écrire » (Chant VI) ; CV dans l'en-tête et la bande d'identité | M |
| F-HER-04 | Médaillon gravé de la carte (Antananarivo, 18°53′ S 47°30′ E) | M |
| F-HER-05 | **Bande d'identité** : Fonction · Port d'attache + horloge locale en direct · Disponibilité · Contact (Hermès, CV, LinkedIn, GitHub) | M |

### 5.3 Chant I · Deux divinités (à propos)
| ID | Exigence | Prio |
|---|---|---|
| F-ABO-01 | Bio courte, localisation, langues parlées (photo facultative) | M |
| F-ABO-02 | Liens sociaux (GitHub, LinkedIn, Malt…) | M |
| F-ABO-03 | Double compétence : **Héphaïstos** (colonne large : architecture front, qualité, équipe) & **Athéna** (colonne étroite : écoute, écrit, lien métier) ; items issus des compétences | M |
| F-ABO-04 | « Hors du travail » : engagement au Rotaract Club d'Ivandry (fonctions éditables), discret | S |

### 5.3 bis Chant V · L'oracle (FAQ + témoignages)
| ID | Exigence | Prio |
|---|---|---|
| F-FAQ-01 | FAQ recruteurs : questions / réponses FR/EN éditables, ordonnées, en `details/summary` accessibles | M |
| F-TEM-01 | « Voix de Delphes » : 1 à 5 témoignages FR/EN (auteur, rôle, entreprise ou anonymisé), sans défilement automatique ; **bloc absent si aucun témoignage publié** ; jamais de témoignage inventé | S |

### 5.4 Chant II · Les épreuves (projets)
| ID | Exigence | Prio |
|---|---|---|
| F-PRO-01 | Projets publiés triés selon l'ordre de l'admin ; **doit tenir avec 8+ projets** | M |
| F-PRO-02 | **Carte** générée : un point par projet (positions calculées), route depuis Antananarivo, légende cliquable (compacte si N > 6), point et segment courants allumés, barque qui avance à la lecture | M |
| F-PRO-03 | **Aperçu d'archive** par projet : vignette (1re image ou emplacement), tampon (n° romain + type), titre, résumé, technos principales, mention scellée, bouton « Lire les archives », note de Charon | M |
| F-PRO-04 | **Dossier** (étude de cas) : ouverture selon `layout` (`sealed`, `split`, `gallery`, `process`) ; quête ; fiche (période, rôle, équipe, client) ; contexte et problème ; ma contribution ; décisions et compromis ; planches ; instruments (techno + usage) et résultats | M |
| F-PRO-05 | Projet confidentiel : client anonymisé, **aucun lien public obligatoire**, visuels autorisés seulement (logo, schéma, maquette redessinée, détail flouté), et ce message exact : « Certains projets ne peuvent être présentés publiquement pour des raisons de confidentialité. Pour en savoir davantage sur mon rôle, les choix techniques ou les problématiques rencontrées, n'hésite pas à me contacter. » + bouton « Me contacter pour en savoir plus » | M |
| F-PRO-06 | Navigation dossier précédent / suivant + « Retour aux archives » | M |
| F-PRO-07 | Le dossier s'ouvre en plein écran au clic (page `inert` derrière, focus au titre puis retour, Échap) avec une URL `/[locale]/projects/[slug]` ; la même URL chargée directement rend le dossier en page complète côté serveur (SEO, partage) | M |
| F-PRO-08 | **Planches** : 4 à 5 images par projet (nature, légende, ratio, alt FR/EN), emplacement `[à fournir]` si vide ; **lightbox** (flèches, Échap, swipe, compteur, piège de focus) | M |
| F-PRO-09 | Liens (démo, dépôt, article) optionnels, affichés seulement s'ils sont publics et autorisés | M |
| F-PRO-10 | Résultats : affichés seulement s'ils sont fournis ; sinon mention « à fournir » (jamais de chiffre inventé) | M |
| F-PRO-11 | Filtre par technologie | C |

### 5.4 bis Voyage (éléments globaux)
| ID | Exigence | Prio |
|---|---|---|
| F-VOY-01 | **Ciel** fixe : champ d'étoiles, 12 constellations du zodiaque + Orion, faible contraste, flottement idle et parallaxe ; ne gêne jamais la lecture | M |
| F-VOY-02 | **Chargeur de voyage** à la 1re visite de la session (barque, mer, boussole, citation, progression réelle) ; absent sans JS ; sans impact LCP notable | S |
| F-VOY-03 | **Curseur** personnalisé (anneau + point, états lien / vue / texte), `pointer:fine` uniquement, désactivé en reduced-motion | S |
| F-VOY-04 | **Rose des vents** : aiguille vers le chant courant, ouvre l'index des chants (overlay accessible) ; dans l'en-tête sur mobile | M |
| F-VOY-05 | **Routes** entre chants avec barque au scroll | S |
| F-VOY-06 | **Notes de Charon** masquables (bouton « Charon », mémorisé) | M |
| F-VOY-07 | Titres mot à mot, apparitions décalées, tracés de gravures ; message console ; 404 « Charybde et Scylla » | S |
| F-VOY-08 | Ajouter un projet, un outil, une escale ou une question dans l'admin met à jour carte, index, journal et routes **sans code** | M |

### 5.5 Chant IV · Les escales (parcours)
| ID | Exigence | Prio |
|---|---|---|
| F-EXP-01 | **Journal de bord** (table) : période, port (entreprise), lieu / remote, poste, entrée du journal, « en cours » ; du plus récent au plus ancien ; doit tenir avec 7+ escales ; empilé sur mobile | M |
| F-EXP-02 | Technologies liées à une escale (mono, facultatif) | C |

### 5.6 Chant III · L'arsenal (technologies)
| ID | Exigence | Prio |
|---|---|---|
| F-SKI-01 | **Index de livre** des technologies : nom, points de conduite, ancienneté, **renvois aux épreuves** où elle a servi (calculés) ; ligne dépliable (rôle, contexte d'usage) ; doit tenir avec 12+ outils | M |
| F-SKI-02 | **Sanctuaire** : gravure de l'arme légendaire de l'outil actif (champ `weapon`, sinon réserve dans l'ordre) | M |
| F-SKI-03 | **Compétences** (lead technique, architecture, revue de code, AMOA…) distinctes des technos, affichées au Chant I | M |
| F-SKI-04 | Pas de barres de niveau en % ni de badges (anti-pattern) | M |

### 5.7 CV
| ID | Exigence | Prio |
|---|---|---|
| F-CV-01 | Bouton de téléchargement du CV dans la langue courante (PDF FR / EN) | M |

### 5.8 Contact
| ID | Exigence | Prio |
|---|---|---|
| F-CON-01 | Formulaire « Écrire à Hermès » : nom, email, objet (CDI / Freelance / Autre), message ; contact direct (copier l'email, LinkedIn, GitHub) | M |
| F-CON-02 | Validation côté client et serveur, messages d'erreur bilingues | M |
| F-CON-03 | Envoi d'un email vers ma boîte Gmail via SMTP | M |
| F-CON-04 | Anti-spam : honeypot + limitation de débit (+ captcha invisible si besoin) | M |
| F-CON-05 | Confirmation visuelle d'envoi, gestion de l'échec | M |
| F-CON-06 | Sauvegarde du message en base (filet de sécurité si l'email échoue), lisible dans l'admin | S |

## 6. Exigences fonctionnelles — admin (`/admin`)

| ID | Exigence | Prio |
|---|---|---|
| F-ADM-01 | Accès réservé à moi seul (authentification Supabase par email), inscription désactivée | M |
| F-ADM-02 | Toutes les routes `/admin` et toutes les écritures protégées côté serveur, pas seulement côté interface | M |
| F-ADM-03 | Édition du profil (hero, bio, photo, disponibilité, liens) | M |
| F-ADM-04 | CRUD projets : champs FR/EN côte à côte ; titre court (carte), type, layout (`sealed`/`split`/`gallery`/`process`), emblème, quête, note de Charon, résumé, fiche (période, rôle, équipe, client), contexte, problème, rôle détaillé, contributions (liste), décisions (titre · pourquoi · compromis), technos + usage, résultats (liste), liens, confidentiel, associatif, statut, ordre | M |
| F-ADM-08b | Planches : 4 à 5 images par projet (upload storage, nature, légende, ratio, alt FR/EN, ordre) | M |
| F-ADM-15 | Aperçu de l'ordre des épreuves (ordre de la carte) | C |
| F-ADM-05 | CRUD escales (expériences) | M |
| F-ADM-06 | CRUD technologies (ancienneté, arme optionnelle, rôle et contexte FR/EN) et compétences (domaine Héphaïstos / Athéna) | M |
| F-ADM-14 | CRUD témoignages et édition de l'engagement (Rotaract) | S |
| F-ADM-16 | CRUD questions de l'oracle (FAQ FR/EN, ordre, publiée) | M |
| F-ADM-07 | Upload / remplacement des CV PDF FR et EN | M |
| F-ADM-08 | Indicateur de traduction manquante (champ EN vide alors que FR rempli) | S |
| F-ADM-09 | Aperçu d'un projet avant publication | S |
| F-ADM-10 | Liste des messages de contact reçus (si F-CON-06) | S |
| F-ADM-11 | Le site public se met à jour après enregistrement, sans redéploiement | M |
| F-ADM-12 | L'admin n'est pas indexé par les moteurs de recherche | M |
| F-ADM-13 | Champs SEO éditables par projet et pour la page d'accueil : titre SEO et meta description FR/EN, image de partage (fallback automatique si vide) | M |

## 7. Modèle de contenu (indicatif)

Champs `*_fr` / `*_en` = texte bilingue saisi manuellement.

| Entité | Champs principaux |
|---|---|
| **Profile** (unique) | nom, titre_fr/en, accroche_fr/en (h1), récit_fr/en, bio_fr/en, hephaistos_fr/en, athena_fr/en, photo (facultative), localisation, langues, disponibilité (modes + texte_fr/en + date), email public, seo_titre_fr/en, seo_description_fr/en, image_og |
| **Project** | slug, ordre, statut, titre_fr/en, titre_court_fr/en, type (`client`/`associative`/`personal`) + libellé_fr/en, layout, emblème, quête_fr/en, note_charon_fr/en, résumé_fr/en, période_fr/en, rôle (court)_fr/en, équipe_fr/en, client (+ affiché), contexte_fr/en, problème_fr/en, rôle_détaillé_fr/en, confidentiel, associatif, lien_démo, lien_repo, seo_titre_fr/en, seo_description_fr/en, image_og, date de mise à jour |
| **ProjectItem** | projet, genre (`contribution` / `result`), texte_fr/en, ordre |
| **ProjectDecision** | projet, titre_fr/en, pourquoi_fr/en, compromis_fr/en, ordre |
| **ProjectImage** | projet, chemin storage (vide = à fournir), nature_fr/en, légende_fr/en, ratio, alt_fr/en, ordre |
| **ProjectTechnology** | projet, technologie, usage_fr/en, ordre |
| **Experience** | entreprise (port), poste_fr/en, date_début, date_fin (vide = en cours), lieu, remote, message_fr/en (entrée du journal), technologies[], ordre |
| **Technology** | nom, catégorie, années d'usage, libellé_durée_fr/en, arme (optionnelle : foudre, egide, trident, fil, caducee, casque, harpe, arc, marteau, lyre, bouclier, ancre), rôle_fr/en, contexte_fr/en, ordre |
| **Skill** | domaine (`hephaistos` / `athena`), libellé_fr/en, description_fr/en, ordre |
| **FaqItem** | question_fr/en, réponse_fr/en, ordre, publiée |
| **SocialLink** | plateforme, url, ordre |
| **Testimonial** | citation_fr/en, auteur, rôle_fr/en, entreprise, anonymisé, ordre, publié (affiché dans l'oracle) |
| **Engagement** | organisation, depuis, texte_fr/en, fonctions[] (libellé_fr/en, période), lien |
| **Resume** | langue, fichier PDF, date de mise à jour |
| **ContactMessage** | nom, email, objet, message, date, statut (lu / non lu) |

## 8. Exigences non fonctionnelles

| ID | Exigence |
|---|---|
| NF-01 | **Performance** : Lighthouse mobile ≥ 95 ; LCP < 2,5 s ; images optimisées (`next/image`) |
| NF-02 | **Accessibilité** : WCAG 2.2 AA (contrastes clair et sombre, navigation clavier, focus visible, textes alternatifs) |
| NF-03 | **SEO** : exigences détaillées en section 8 bis — objectif Lighthouse SEO = 100 |
| NF-04 | **Responsive** : 375, 768, 1024, 1440, 1920 px ; mise en page **pleine largeur** (aucun conteneur centré), aucun débordement horizontal |
| NF-05 | **Sécurité** : Row Level Security Supabase (lecture publique du contenu publié, écriture admin uniquement) ; secrets (SMTP, clé service) jamais exposés au navigateur |
| NF-06 | **Résilience du contenu** : textes longs, listes vides, champs EN manquants (fallback FR), 0 / 1 / 9 projets, 12 outils, 7 escales — validé avec `break-ui` |
| NF-07 | **Coût** : 0 € (offres gratuites Vercel + Supabase + Gmail) |
| NF-08 | **Maintenabilité** : TypeScript strict, composants documentés, diffs ciblés |

## 8 bis. Exigences SEO (renforcées)

| ID | Exigence | Prio |
|---|---|---|
| SEO-01 | **Rendu serveur** de tout le contenu public (pages statiques régénérées après modification dans l'admin) : aucun contenu indexable chargé uniquement côté client | M |
| SEO-02 | Métadonnées uniques par page et par langue : `title`, `meta description`, `canonical` (via l'API Metadata de Next.js) | M |
| SEO-03 | `hreflang` FR / EN + `x-default` sur toutes les pages, cohérents avec le sitemap | M |
| SEO-04 | `sitemap.xml` dynamique multilingue incluant chaque projet publié, avec date de dernière modification | M |
| SEO-05 | `robots.txt` : site public indexable, `/admin` et routes techniques exclues | M |
| SEO-06 | Données structurées JSON-LD : `Person` + `ProfilePage` (accueil), `WebSite`, `BreadcrumbList` et `CreativeWork` (pages projet) ; valides au Rich Results Test | M |
| SEO-07 | Images Open Graph / Twitter générées dynamiquement par page et par langue (titre + visuel), avec fallback | M |
| SEO-08 | HTML sémantique : un seul `h1` par page, hiérarchie de titres sans saut, landmarks, liens descriptifs | M |
| SEO-09 | Attribut `alt` saisi dans l'admin pour chaque image (FR/EN) ; images au format moderne, dimensionnées, chargement différé hors écran | M |
| SEO-10 | Slugs lisibles et stables ; redirection si un slug change | S |
| SEO-11 | Core Web Vitals « bons » : LCP < 2,5 s, INP < 200 ms, CLS < 0,1 | M |
| SEO-12 | Attribut `lang` correct par page ; pas de contenu dupliqué entre langues (canonical par langue) | M |
| SEO-13 | Mots-clés cibles intégrés naturellement (ex. « développeur front-end React freelance », « Lead Front-End Developer remote ») — liste à définir à l'étape 4 | S |
| SEO-14 | Déclaration du site dans Google Search Console + envoi du sitemap à la mise en ligne | M |

## 9. Contraintes techniques (validées)

- Next.js (App Router) + TypeScript — objectif d'apprentissage
- Supabase : base de données, authentification admin, stockage (images, CV)
- Déploiement Vercel
- Email : Gmail SMTP (mot de passe d'application, nécessite la validation en 2 étapes sur le compte Google)
- Détails (librairie i18n, ORM, styles) → étape 5 (Architecture)

## 10. Parcours clés (critères d'acceptation)

**US-01 — RH pressé**
> En tant que RH, je veux savoir en 30 s qui est Andry, son poste, sa stack et sa disponibilité, et récupérer son CV.
- ✅ Titre, stack principale et disponibilité visibles sans scroll sur mobile et desktop
- ✅ CV téléchargeable en ≤ 2 clics, dans la langue de la page

**US-02 — CTO qui creuse**
> En tant que CTO, je veux comprendre le rôle réel d'Andry et ses choix techniques sur un projet.
- ✅ Chaque dossier contient contexte, problème, contribution, décisions et compromis, planches, stack et résultats (ou « à fournir »)
- ✅ Un projet confidentiel reste informatif sans révéler le client, avec le message de confidentialité et le bouton de contact

**US-03 — Client freelance**
> En tant que client, je veux contacter Andry facilement pour une mission.
- ✅ Formulaire accessible depuis le hero et la navigation
- ✅ Je reçois une confirmation ; Andry reçoit l'email avec l'objet « Freelance »

**US-04 — Andry met à jour son contenu**
> En tant qu'Andry, je veux ajouter un projet en FR et EN sans toucher au code.
- ✅ Création, upload d'images, publication depuis `/admin`
- ✅ Visible sur le site public en moins d'une minute, sans redéploiement
- ✅ Une traduction manquante est signalée

## 11. Risques & points d'attention

| Risque | Mitigation |
|---|---|
| Confidentialité des projets Bocasay | Accord de l'employeur obtenu ; anonymiser client et données ; visuels floutés ou maquettes redessinées |
| SEO limité par le sous-domaine `*.vercel.app` (autorité faible, image moins pro) | V1 sur `*.vercel.app` ; URL de base en variable d'environnement (canonical, sitemap, OG) pour migrer vers un domaine personnalisé sans refonte |
| Gmail SMTP bloqué ou limité | Mot de passe d'application ; sauvegarde en base (F-CON-06) ; volume faible attendu |
| Spam sur le formulaire | Honeypot + limitation de débit + captcha invisible si nécessaire |
| Dérive de périmètre (trop d'effets visuels) | Le design sert la lisibilité ; revue `/impeccable critique` à chaque section |
| Courbe d'apprentissage Next.js / Supabase | Claude Code code et explique brièvement chaque concept nouveau ; sessions courtes, une fonctionnalité par session |

## 12. Questions ouvertes

Aucune.

Résolues (v1.1) : bascule clair/sombre ✔ · double compétence AMOA mise en avant ✔ · accord Bocasay obtenu ✔ · aucun test automatisé ✔ · V1 sur `*.vercel.app`, migration vers un domaine personnalisé envisagée plus tard (prévoir une URL de base configurable par variable d'environnement pour la faciliter) ✔

---

## Annexe A — Fiche projet à remplir (1 par projet)

Le contenu des projets sera saisi dans l'admin. Remplir ces fiches en amont évite de faire lire des codebases entières à Claude Code.

```markdown
### [Nom du projet]  ·  titre court (carte) :
- Type : client / associatif / perso · Période : · Confidentiel : oui/non · Client affiché :
- Layout du dossier : sealed (confidentiel) / split (avant-après) / gallery (visuel fort) / process (choix d'abord)
- Quête (une phrase mythologique) :
- Note de Charon (un clin d'œil) :
- Résumé (2 lignes) :
- Rôle (court) · Équipe :
- Contexte :
- Problème (2 phrases) :
- Mon rôle détaillé :
- Contributions (3–5 puces) :
- Décisions (2–3) : décision · pourquoi · compromis accepté
- Stack : techno · usage dans ce projet
- Résultats vérifiables (sinon laisser vide) :
- Liens publics autorisés (démo / repo / article) :
- Planches (4–5) : nature · légende · ratio (16/10, 1/1, 4/5, 21/9, 3/4, 16/9) · fichier disponible ?
```
