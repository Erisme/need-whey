# Changelog

Toutes les modifications notables apportées à ce projet seront documentées dans ce fichier.

## [Non publié]
- Ajout : Page d'explications sur le calcul des calories et des protéines (`/explications`).
- Ajout : Lien vers la page d'explications depuis le tableau de bord.

## Historique Git

- **2026-06-04** - feat: enrichissement serving_quantity OFF pour les aliments locaux (b932a07)
- **2026-06-04** - feat(ux): poids estimé visible dans les résultats de recherche (3b160d9)
- **2026-06-04** - feat: logo et favicon — shaker protéine SVG (46f9521)
- **2026-06-04** - fix: migration poidsUnitaire sur DB prod existante au démarrage du conteneur (bc24624)
- **2026-06-04** - feat: recherche dynamique Open Food Facts + suppression matin/midi/soir (d47a92c)
- **2026-06-04** - fix(ui): menu navigation responsive sur mobile (df33deb)
- **2026-06-03** - fix: init DB via sqlite3 CLI — supprime dépendance Prisma schema-engine (eb62d92)
- **2026-06-03** - fix: remplacer prisma db push par sqlite3 CLI + init.sql (b638031)
- **2026-06-03** - fix: binaryTargets Alpine — binaires Prisma inclus dans l'image Docker (73df34b)
- **2026-06-03** - fix: binaryTargets Alpine pour inclure les binaires Prisma dans l'image (4550a09)
- **2026-06-03** - fix: container crash — OpenSSL + entrypoint (f21d766)
- **2026-06-03** - fix: OpenSSL Alpine + entrypoint simplifié (seed idempotent, pas d'async) (8ebf875)
- **2026-06-03** - fix: DOCKER_CONFIG vide pour pull GHCR (7748301)
- **2026-06-03** - fix: DOCKER_CONFIG vide pour pull anonyme (bypass credential cache Synology) (56dbb23)
- **2026-06-03** - fix: docker logout avant pull GHCR (7409f3b)
- **2026-06-03** - fix: docker logout ghcr.io avant pull (credentials expirés bloquaient le pull public) (3c0fdac)
- **2026-06-03** - fix: package GHCR public, pas de login requis (143783e)
- **2026-06-03** - fix: supprimer login GHCR — package doit être public (71c152c)
- **2026-06-03** - fix: GHCR login NAS + nettoyage workflow (30202b8)
- **2026-06-03** - fix: login GHCR sur NAS + suppression double DOCKER + AUTH_SECRET injecté (2389740)
- **2026-06-03** - fix: deploy via SSH heredoc sans scp-action (e92a745)
- **2026-06-03** - fix: remplacer scp-action par heredoc SSH (plus fiable sur Synology) (07ba1fa)
- **2026-06-03** - fix: mkdir NAS avant scp (d42a0a1)
- **2026-06-03** - fix: créer le dossier NAS via SSH avant le SCP (6d36027)
- **2026-06-03** - fix: Dockerfile Next.js standalone (36b9775)
- **2026-06-03** - fix: Dockerfile Next.js standalone + entrypoint avec seed + compose corrigé (f8c29a9)
- **2026-06-03** - fix: workflow CI robuste (6d6b82d)
- **2026-06-03** - fix: workflow CI robuste sans dépendance externe (663fc25)
- **2026-06-03** - fix: workflow CI autoportant (build-push-deploy) (0d3c819)
- **2026-06-03** - fix: remplacer le workflow réutilisable inexistant par un workflow autoportant (61235a7)
- **2026-06-03** - chore: merge develop → main — première version déployable (528dc45)
- **2026-06-03** - feat: scaffold complet de l'application Need Whey (45ed4c6)
- **2026-06-03** - docs: ajout du plan de l'application coach nutrition et sport (f4ae06c)
- **2026-06-03** - Initial commit (d036c60)