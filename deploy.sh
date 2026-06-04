#!/bin/bash
set -e

if [ -f .env.deploy ]; then
  export $(grep -v '^#' .env.deploy | xargs)
fi

if [ -z "$NAS_USER" ] || [ -z "$NAS_HOST" ] || [ -z "$NAS_PORT" ] || [ -z "$NAS_DIR" ]; then
  echo "❌ Erreur : Variables NAS_USER, NAS_HOST, NAS_PORT ou NAS_DIR non définies."
  echo "Créez un fichier .env.deploy (voir .env.deploy.example)."
  exit 1
fi

NAS="$NAS_USER@$NAS_HOST"
DOCKER="/var/packages/ContainerManager/target/usr/bin/docker"

echo "==> Build du front React..."
npm run build

echo "==> Création de l'archive..."
tar --exclude=.git --exclude=node_modules \
  -czf /tmp/need-whey.tar.gz -C .. need-whey

echo "==> Envoi sur le NAS..."
scp -O -P $NAS_PORT /tmp/need-whey.tar.gz $NAS:~/need-whey.tar.gz

echo "==> Déploiement sur le NAS..."
ssh -p $NAS_PORT $NAS "
  cd ~ &&
  tar -xzf need-whey.tar.gz &&
  mkdir -p $NAS_DIR &&
  cp -r need-whey/* $NAS_DIR/ &&
  rm -rf need-whey need-whey.tar.gz &&
  cd $NAS_DIR &&
  $DOCKER compose up -d --build --no-deps app &&
  $DOCKER image prune -f
"

rm /tmp/need-whey.tar.gz
echo ""
echo "✅ Déploiement terminé → http://$NAS_HOST:8003"
