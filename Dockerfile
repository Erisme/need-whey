FROM node:20-alpine AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package*.json ./
RUN npm ci

FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npx prisma generate
# Compile le seed TS → CJS sans tsx au runtime
RUN npx esbuild prisma/seed.ts \
      --bundle --platform=node --format=cjs \
      --external:@prisma/client \
      --outfile=prisma/seed.cjs
RUN npm run build

FROM node:20-alpine AS runner
# sqlite3 CLI pour init DB + openssl pour Prisma client
RUN apk add --no-cache openssl sqlite
WORKDIR /app
ENV NODE_ENV=production

# Next.js standalone
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
# Fichiers statiques publics (logo, favicon…) — non inclus dans standalone
COPY --from=builder /app/public ./public

# Prisma client (query engine) — pas besoin du CLI ni du schema-engine
COPY --from=builder /app/node_modules/.prisma  ./node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma  ./node_modules/@prisma
# Schema SQL + seed compilé
COPY --from=builder /app/prisma/init.sql       ./prisma/init.sql
COPY --from=builder /app/prisma/seed.cjs       ./prisma/seed.cjs

COPY docker-entrypoint.sh ./
RUN chmod +x docker-entrypoint.sh

EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

CMD ["./docker-entrypoint.sh"]
