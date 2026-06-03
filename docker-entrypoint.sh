#!/bin/sh
set -e

# Créer le dossier de données si absent
mkdir -p /app/data

echo "==> Prisma db push..."
node node_modules/prisma/build/index.js db push --skip-generate

echo "==> Seed (upsert, idempotent)..."
node prisma/seed.cjs

echo "==> Démarrage Next.js..."
exec node server.js
