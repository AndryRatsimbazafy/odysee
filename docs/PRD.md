# PRD — Portfolio Andry (v1.2)

> Statut : validé · Étapes 3–4 du workflow · Date : 2026-10-15
> v1.1 : clair/sombre confirmé, positionnement AMOA, accord Bocasay, exigences SEO renforcées, aucun test automatisé
> v1.2 : direction « L'Odyssée », témoignages, engagement Rotaract, éléments fun
> v2.0 (2026-10-16) : traversée du Styx (barque, Charon narrateur, rives-objets), modale projet, images projets, assiettes d'armes, cartes postales, contenu extensible. Référence : docs/prototype/odyssee-prototype.html
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

### 5.2 Hero
| ID | Exigence | Prio |
|---|---|---|
| F-HER-01 | Nom, titre (ex. « Lead Front-End Developer — React / TypeScript ») et accroche courte | M |
| F-HER-02 | Indicateur de disponibilité (CDI / freelance / remote), éditable | M |
| F-HER-03 | 2 CTA : « Embarquer » (vers les épreuves) et « Dérouler le CV » | M |
| F-HER-04 | Nom peint sur un pinax suspendu, sceau « Disponible », ponton de départ de la barque | M |

### 5.3 À propos
| ID | Exigence | Prio |
|---|---|---|
| F-ABO-01 | Bio courte, photo, localisation, langues parlées | M |
| F-ABO-02 | Liens sociaux (GitHub, LinkedIn, Malt…) | M |
| F-ABO-03 | Mise en avant de la double compétence **Lead Front + AMOA** (recueil du besoin, spécifications, lien métier ↔ technique) comme différenciant — interrupteur Athéna ⇄ Héphaïstos | M |
| F-ABO-04 | Encart discret « À l'agora » : engagement au Rotaract Club d'Ivandry (intronisé en 2020, fonctions successives, président 2025-2026, vice-président 2026-2027), éditable | M |

### 5.3 bis Témoignages
| ID | Exigence | Prio |
|---|---|---|
| F-TEM-01 | Section « Paroles d'oracles » : 2 à 5 citations FR/EN (auteur, rôle, entreprise ou anonymisé), éditables, sans défilement automatique ; section masquée si aucune | S |

### 5.4 Projets
| ID | Exigence | Prio |
|---|---|---|
| F-PRO-01 | Liste de 6 à 8 projets, triés selon un ordre défini dans l'admin | M |
| F-PRO-02 | Une rive par projet : tesson avec scène de bataille, **emplacement de capture**, titre, quête, technos, sceau « Scellé par Hadès » si confidentiel | M |
| F-PRO-03 | Filtre par technologie | C |
| F-PRO-04 | Page détail `/[locale]/projects/[slug]` : contexte, mon rôle, défis, solutions, résultats, stack, galerie, liens démo/repo | M |
| F-PRO-05 | Projet confidentiel : client anonymisé, pas de lien repo, visuels floutés ou maquettes | M |
| F-PRO-06 | Navigation projet précédent / suivant | S |
| F-PRO-07 | « Lire l'épreuve » ouvre une modale (parchemin à méandres) avec galerie d'images ; la page détail reste accessible par URL | M |
| F-PRO-08 | Badge « Projet associatif » et sous-titre humoristique facultatif par projet (champs admin) | S |

### 5.4 bis Éléments fun (globaux)
| ID | Exigence | Prio |
|---|---|---|
| F-FUN-01 | Rivière du Styx générée depuis les rives, barque (Charon + Andry) qui la descend au scroll, cartouche de Charon qui ne chevauche jamais le contenu | M |
| F-FUN-02 | Narrateur mot à mot, répliques de Charon par rive, exploit Athéna/Héphaïstos, obole en épilogue, message console, 404 labyrinthe (DESIGN §9) | S |
| F-FUN-03 | Ajouter un projet, une techno, une expérience ou un témoignage crée la rive / l'objet correspondant et redessine la rivière, sans code | M |

### 5.5 Parcours / expériences
| ID | Exigence | Prio |
|---|---|---|
| F-EXP-01 | Escales : carte de navigation (navire au scroll) + une carte postale par expérience (entreprise, poste, période, lieu, message) | M |
| F-EXP-02 | Lien optionnel entre une expérience et ses projets | C |

### 5.6 Skills & technologies
| ID | Exigence | Prio |
|---|---|---|
| F-SKI-01 | **Technologies** : une assiette décorative par techno, avec une arme légendaire (mapping ou réserve automatique) et les années d'usage | M |
| F-SKI-02 | **Compétences** (lead technique, architecture front, revue de code, AMOA / spécifications…) distinctes des technos | M |
| F-SKI-03 | Pas de barres de niveau en % (anti-pattern) : indication par années d'usage ou mise en avant | M |

### 5.7 CV
| ID | Exigence | Prio |
|---|---|---|
| F-CV-01 | Bouton de téléchargement du CV dans la langue courante (PDF FR / EN) | M |

### 5.8 Contact
| ID | Exigence | Prio |
|---|---|---|
| F-CON-01 | Formulaire : nom, email, objet (CDI / Freelance / Autre), message | M |
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
| F-ADM-04 | CRUD projets : champs FR/EN côte à côte, capture principale + galerie (alt FR/EN), narration et réplique de Charon, scène (optionnelle), statut, ordre | M |
| F-ADM-15 | Aperçu de l'ordre des rives (les projets publiés apparaissent dans l'ordre choisi) | C |
| F-ADM-05 | CRUD expériences | M |
| F-ADM-06 | CRUD technologies (arme légendaire optionnelle) et savoir-faire | M |
| F-ADM-14 | CRUD témoignages et édition de l'encart d'engagement (Rotaract) | S |
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
| **Profile** (unique) | nom, titre_fr/en, accroche_fr/en, bio_fr/en, photo, localisation, langues, disponibilité (CDI / freelance / remote + texte_fr/en), seo_titre_fr/en, seo_description_fr/en, image_og |
| **Project** | slug, scène (optionnelle : maze, hydra, herald, boat), narration_fr/en, réplique_charon_fr/en, quête_fr/en, capture (+ alt), sous_titre_fun_fr/en, associatif, titre_fr/en, résumé_fr/en, contexte_fr/en, rôle_fr/en, défis_fr/en, solutions_fr/en, résultats_fr/en, image de couverture (+ alt_fr/en), galerie, technologies[], lien_démo, lien_repo, confidentiel, client_affiché, statut, ordre, mis_en_avant, seo_titre_fr/en, seo_description_fr/en, date de mise à jour |
| **Experience** | entreprise, poste_fr/en, date_début, date_fin, lieu, remote, message_fr/en (texte de la carte postale), technologies[], ordre |
| **Technology** | nom, catégorie, années d'usage, libellé_durée_fr/en, arme (optionnelle : foudre, egide, trident, fil, caducee, casque, harpe, arc, marteau), ordre |
| **Skill** | libellé_fr/en, description_fr/en, ordre |
| **SocialLink** | plateforme, url, ordre |
| **Testimonial** | citation_fr/en, auteur, rôle_fr/en, entreprise, anonymisé, ordre, publié |
| **Engagement** | organisation, depuis, texte_fr/en, fonctions[] (libellé_fr/en, période), lien |
| **Resume** | langue, fichier PDF, date de mise à jour |
| **ContactMessage** | nom, email, objet, message, date, statut (lu / non lu) |

## 8. Exigences non fonctionnelles

| ID | Exigence |
|---|---|
| NF-01 | **Performance** : Lighthouse mobile ≥ 95 ; LCP < 2,5 s ; images optimisées (`next/image`) |
| NF-02 | **Accessibilité** : WCAG 2.2 AA (contrastes clair et sombre, navigation clavier, focus visible, textes alternatifs) |
| NF-03 | **SEO** : exigences détaillées en section 8 bis — objectif Lighthouse SEO = 100 |
| NF-04 | **Responsive** : 375, 768, 1024, 1440, 1920 px ; mise en page **pleine largeur** (aucun conteneur centré) |
| NF-05 | **Sécurité** : Row Level Security Supabase (lecture publique du contenu publié, écriture admin uniquement) ; secrets (SMTP, clé service) jamais exposés au navigateur |
| NF-06 | **Résilience du contenu** : l'interface supporte textes longs, listes vides, champs EN manquants (fallback FR) — validé avec `break-ui` |
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
- ✅ Chaque page projet contient contexte, rôle, défis, solutions, résultats et stack
- ✅ Un projet confidentiel reste informatif sans révéler le client

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
### [Nom du projet]
- Type : pro / perso / associatif · Période :
- Confidentiel : oui/non · Nom client affiché :
- Contexte (le problème, pour qui) :
- Mon rôle (lead, dev, AMOA…) · Taille de l'équipe :
- Défis techniques (2–3) :
- Solutions apportées :
- Résultats / impact (chiffrés si possible) :
- Stack :
- Liens (démo / repo) :
- Visuels disponibles (captures, maquettes) :
```
