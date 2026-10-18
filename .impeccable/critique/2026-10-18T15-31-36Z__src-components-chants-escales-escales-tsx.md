---
target: Chants IV et V · Les escales, L oracle
total_score: 28
max_score: 32
na_heuristics: 7,10
p0_count: 0
p1_count: 0
target_identity: "file:/home/user/odysee/src/components/chants/escales/escales.tsx"
target_fingerprint: "sha256:fb558994a5d3cf025f64768265bd204ed9890a7ca97fd233b4f1e4e0185d8552"
target_path: /home/user/odysee/src/components/chants/escales/escales.tsx
timestamp: 2026-10-18T15-31-36Z
slug: src-components-chants-escales-escales-tsx
---
⚠️ DEGRADED: single-context (CLAUDE.md du projet interdit les sous-agents en parallèle)

## Design Health Score (mode Experience, 7 et 10 n/a)
| # | Heuristique | Score | Constat |
|---|---|---|---|
| 1 | Visibilité de l'état | 4 | Port en cours marqué (point or + « en cours ») ; question ouverte signalée par le chevron |
| 2 | Monde réel | 4 | Journal de bord en vraie table (en-têtes de colonnes et de lignes) ; oracle en questions/réponses natives |
| 3 | Contrôle | 4 | details/summary natifs : clic, Entrée, Espace, recherche dans la page |
| 4 | Cohérence | 3 | Marge, titre et entrée communs aux chants (ChantStage) ; l'oracle n'a pas de chapeau (fidèle au prototype) |
| 5 | Prévention des erreurs | 3 | Dates inconnues (2000-01-01 du seed) affichées [à fournir], jamais comme une année |
| 6 | Reconnaissance | 4 | Colonnes nommées, empilement mobile lisible sans en-têtes |
| 8 | Esthétique minimaliste | 3 | Les « [à fournir] » saisis en base s'affichent en grand corps display au lieu du marqueur .todo |
| 9 | Récupération | 3 | États vides : aucune escale / question → [à fournir] ; voix de Delphes absente sans témoignage |
| **Total** | | **28/32** | Excellent |

## Design Specificity Verdict
Authored : le journal de bord en table (période en mono or, port en display, entrée en cendre) prolonge l'atlas ; l'oracle reste sobre, avec une réponse qui s'installe à l'ouverture. Détecteur CLI : 0 trouvaille (escales, oracle, chant-stage). Testé avec 7 escales et un témoignage temporaire (retirés).

## Priority Issues
1. [P2] Les valeurs « [à fournir] » enregistrées en base (seed) s'affichent comme du contenu (titre display « [à fournir] ») et non avec le marqueur `.todo`. Fix : remplacer ces valeurs par des champs vides dans l'admin (le code affiche alors le marqueur), ou convention globale. → /impeccable harden
2. [P3] L'ordre du journal suit `sort_order` avant les dates : il faut l'ordonner dans l'admin pour garder « de la plus récente à la plus ancienne ». → contenu

## Minor Observations
- Étiquettes du ciel (VIERGE, BALANCE) à faible contraste sous le contenu (couche globale).
