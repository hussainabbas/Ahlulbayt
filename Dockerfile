# Monorepo root — Railway builds from repo root; API source is in api/
# If Railway Root Directory is set to "api", use api/Dockerfile instead.

FROM node:22-alpine AS builder

WORKDIR /app

COPY api/package.json api/package-lock.json ./
RUN npm ci

COPY api/ .
RUN npm run build

FROM node:22-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

COPY api/package.json api/package-lock.json ./
RUN npm ci --omit=dev && npm cache clean --force

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/scripts ./scripts
COPY --from=builder /app/drizzle ./drizzle

EXPOSE 3000

CMD ["node", "scripts/start-production.mjs"]
