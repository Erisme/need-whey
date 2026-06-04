# Changelog

Toutes les modifications notables sont documentées ici.
Format : [Keep a Changelog](https://keepachangelog.com/fr/1.0.0/)

---

## [Non publié]

---

## [0.4.0] — 2026-06-04

### Ajouté

- 131 aliments en base de données (vs 49) : fruits, légumes complets, 5 yaourts, 12 fromages, volailles, poissons, oléagineux, boissons végétales — couvre la majorité des recherches sans passer par l'API externe
- Cache navigateur forcé à chaque déploiement : `no-store` sur toutes les pages HTML + identifiant de build unique (`BUILD_ID`) injecté dans les URLs du logo et favicon

### Modifié

- Performances de recherche : requêtes courtes courantes (`ya`, `fr`, `ch`, `ca`, `la`…) retournent ≥ 5 résultats locaux en ~57 ms au lieu de ~2 s via l'API externe
- Cache mémoire des réponses Open Food Facts (TTL 6 h) — les aliments inconnus ne consultent l'API qu'une fois par redémarrage

---

## [0.3.0] — 2026-06-04

### Ajouté

- Recherche dynamique d'aliments via Open Food Facts : combobox avec debounce 400 ms, badge « OFF » pour les aliments issus de l'API
- Poids de portion estimé visible dans chaque résultat du dropdown (`~150 g`) avant de cliquer — auto-remplissage à la sélection, bouton « Modifier » pour saisie libre
- Aperçu des macros calculées en temps réel selon la quantité (protéines, kcal, glucides, lipides)
- Aliments Open Food Facts sauvegardés automatiquement en base locale à la validation
- Logo (shaker protéine + texte Need / Whey) et favicon SVG vectoriels
- Champ `poidsUnitaire` sur le modèle `Food` : poids moyen d'une portion typique en grammes

### Modifié

- Suppression du découpage matin / midi / soir / collation : les aliments sont listés à plat sur la journée
- Le formulaire d'ajout ne demande plus le « moment » — valeur `'jour'` stockée pour compatibilité

### Corrigé

- Logo absent sur iPhone : `public/` non copié dans l'image Docker standalone (`COPY public ./public`)
- Erreur Docker push `unknown blob` sur GHCR : ajout de `provenance: false`
- Erreur 500 au démarrage de la prod : colonne `poidsUnitaire` manquante sur DB existante — `ALTER TABLE` idempotent ajouté dans `docker-entrypoint.sh`

---

## [0.2.0] — 2026-06-03

### Ajouté

- Page `/explications` : détail du calcul Harris-Benedict et des objectifs protéiques
- Lien vers `/explications` depuis le tableau de bord
- Nettoyage des anciennes images Docker après déploiement (`docker image prune -f`)

### Corrigé

- Menu de navigation responsive sur mobile (hamburger, fermeture Échap / clic extérieur)
- Init SQLite via CLI — suppression de la dépendance Prisma schema-engine (incompatible Alpine)
- Binaires Prisma Alpine (`linux-musl-openssl-3.0.x`) inclus dans l'image Docker

### Sécurité

- Mise à jour Next.js `15.1.0` → `16.2.7` (CVE-2025-66478, vulnérabilité critique)

---

## [0.1.0] — 2026-06-03

### Ajouté

- Scaffold complet Need Whey : auth JWT cookie, profil, journal, calcul Harris-Benedict
- 49 aliments pré-chargés (viandes, poissons, laitiers, légumineuses, céréales, fruits, suppléments)
- Barres de progression calories / protéines avec indicateurs colorés
- Recommandations d'aliments pour atteindre l'objectif protéique
- Déploiement automatisé GitHub Actions → Docker GHCR → Synology NAS
