# STORYBOARD.md — « L'Odyssée, la traversée du Styx »

> Étape 4 du workflow · v2.0 · 2026-10-16
> Une ligne par rive : contenu (source), objet, animation, réplique de Charon.
> **Référence visuelle : `docs/prototype/odyssee-prototype.html`.** Les textes sont des propositions (FR) ; les versions EN sont dans `messages/en.json` ou dans les champs `_en` de l'admin. `[À REMPLACER]` ne part jamais en production.

---

## 0. Éléments globaux

| Élément | Description |
|---|---|
| Navigation | Cadre à double filet, mono : embarcadère · rives · épreuves · écrire · ✦ CV · FR/EN · Hélios/Nyx |
| Rivière | Calculée depuis les rives (DESIGN §4) ; tracé d'encre qui se dessine derrière la barque |
| Barque | Charon + Andry (DESIGN §5) |
| Cartouche de Charon | Réplique de la rive courante (champ `data-line`) |
| Narrateur | Une phrase en italique au début de chaque rive, mots allumés au scroll |
| Console | « Un dev qui ouvre la console ? Tu es des nôtres. Le code est sur GitHub. » |

## Rives (dans l'ordre)

| # | Rive | Contenu (source) | Objet / animation | Réplique de Charon |
|---|---|---|---|---|
| 1 | **L'embarcadère** (accueil) | Nom, titre, accroche, disponibilité, CTA « Embarquer », lien CV (`profile`) | Pinax suspendu qui se balance, nom qui se compose lettre à lettre, sceau olive « Disponible », ponton | « Bienvenue à bord. Le passage coûte une obole… on règlera ça à l'arrivée. » |
| 2 | **Le courant se lève** | Phrase de narration (`profile.recit_fr/en`) | Narration seule | « Notre voyageur vient d'une île rouge. Il code, il écoute, et il n'a pas le mal de mer. Enfin, presque. » |
| 3 | **Rive I · Deux divinités** | Interrupteur Athéna (AMOA) / Héphaïstos (Dev), faits clés, encart « Le soir, à l'agora » (Rotaract) | Onglets, illustration chouette / marteau, exploit quand les deux sont vus | « Première rive. Deux divinités se disputent son talent. Choisis ton camp, je ne dirai rien. » |
| 4 | **Rive II · La forge** | Technologies (`technologies`), savoir-faire (`skills`) | Forge en figure noire animée ; assiettes d'armes légendaires ; cadre ΤΕΧΝΑΙ | « La forge d'Héphaïstos. Ne touche à rien, tout est encore chaud. Survole les assiettes : les armes se réveillent. » |
| 5…n | **Les épreuves · I, II, III…** | Un projet publié par rive (`projects`, ordre admin) | Tesson qui s'échoue, scène de bataille en boucle, emplacement de capture, lien « Lire l'épreuve » → modale | Réplique propre au projet (`projects.replique_fr/en`) |
| n+1 | **Rive III · Les escales** | Expériences (`experiences`) | Carte de navigation (navire au scroll) + cartes postales | « Les ports où il a jeté l'ancre. J'ai les tickets de chaque traversée, si besoin. » |
| n+2 | **Rive IV · Delphes** | Témoignages publiés (`testimonials`) | Trépied fumant, « Consulter à nouveau » ; **rive masquée tant qu'aucun vrai témoignage n'existe** (jamais d'exemple inventé en production) | « Delphes. L'oracle ne parle qu'à ceux qui ont lu jusqu'ici. » |
| n+3 | **L'embouchure · Hermès** | Formulaire de contact + liens sociaux | Lettre dans un cadre à méandres, sceau de cire, sandale ailée qui s'envole | « Pour lui écrire, Hermès prend le relais. Moi je rame, lui il vole. Chacun son métier. » |
| n+4 | **Épilogue · Les Champs Élysées** | Narration finale, obole, « Remonter le Styx » | Soleil qui se lève au scroll ; pièce lancée vers la barque | « Terminus : les Champs Élysées. Bon, tu me dois une obole. Je plaisante. À moitié. » |

Narration de l'épilogue : « Et c'est ainsi que le voyageur trouva sa prochaine équipe. Peut-être la vôtre. »

## Modale « Lire l'épreuve »

Cadre à méandres qui se déplie depuis le centre. Contenu : numéro, titre, quête, scène animée (petite, sans fond), **galerie d'images** (3 emplacements, floutés si scellé), méta (période, rôle, équipe, client ou ███████), Contexte · Mon rôle · Défis · Solutions · Résultats, stack, liens. Fermeture : bouton « Refermer ✕ », Échap, clic à côté ; le focus revient au lien. Zone de contenu qui défile seule (`data-lenis-prevent`). Réplique : « Tu lis un parchemin scellé… » (projet scellé) ou « Prends ton temps, la barque attend. Le compteur d'oboles, lui, tourne. »

## Contact (comportement)

Validation en direct, erreurs en clair (« Il manque une adresse email valide. », « Le message est vide : Hermès refuse de voler à vide. »). Envoi réussi : « Lettre confiée à Hermès. Réponse sous 48 h, décalage horaire compris. » + réplique de Charon. Échec : message clair + email affiché en texte.

## 404

« Cette page s'est perdue dans le labyrinthe. Le Minotaure dément toute implication. » + bouton « Retour à l'embarcadère ».

## Ajouts de contenu (doit marcher sans toucher au code)

- Nouveau projet → nouvelle rive d'épreuve, côté alterné, scène suivante, rivière redessinée.
- Nouvelle techno → nouvelle assiette, arme de la réserve si non précisée.
- Nouvelle expérience → nouveau port sur la carte, nouvelle carte postale, timbre suivant.
- Nouveau témoignage → nouvelle prophétie.

## Ordre de construction

Voir `docs/TASKS.md`.
