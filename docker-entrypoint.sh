#!/bin/sh
set -e

DATA_DIR=$(dirname "$DATABASE_URL" | sed 's|file:||')
mkdir -p "$DATA_DIR"

echo "==> Prisma db push..."
node node_modules/prisma/build/index.js db push --skip-generate

# Seed uniquement si la table Food est vide
FOOD_COUNT=$(node -e "
const { PrismaClient } = require('@prisma/client');
const p = new PrismaClient();
p.food.count().then(n => { console.log(n); p.\$disconnect(); });
")

if [ "$FOOD_COUNT" = "0" ]; then
  echo "==> Seeding..."
  node prisma/seed.cjs
fi

echo "==> Démarrage Next.js..."
exec node server.js
