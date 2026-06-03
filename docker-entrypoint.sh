#!/bin/sh
set -e

mkdir -p /app/data

echo "==> Initialisation base SQLite..."
sqlite3 /app/data/prod.db < /app/prisma/init.sql

echo "==> Seed (idempotent)..."
node /app/prisma/seed.cjs

echo "==> Démarrage Next.js..."
exec node /app/server.js
