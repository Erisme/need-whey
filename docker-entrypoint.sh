#!/bin/sh
set -e

mkdir -p /app/data

echo "==> Initialisation base SQLite..."
sqlite3 /app/data/prod.db < /app/prisma/init.sql

echo "==> Migrations..."
# Idempotent : échoue silencieusement si la colonne existe déjà
sqlite3 /app/data/prod.db "ALTER TABLE Food ADD COLUMN poidsUnitaire REAL NOT NULL DEFAULT 100;" 2>/dev/null || true

echo "==> Seed (idempotent)..."
node /app/prisma/seed.cjs

echo "==> Démarrage Next.js..."
exec node /app/server.js
