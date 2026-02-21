FROM node:20-alpine AS base

# --- deps ---
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

# --- build ---
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

ARG NOTION_API_KEY
ARG NOTION_DATA_SOURCE_ID
ARG NOTION_AUTHORS_DATA_SOURCE_ID
ARG NEXT_PUBLIC_GA_ID

ENV NOTION_API_KEY=$NOTION_API_KEY
ENV NOTION_DATA_SOURCE_ID=$NOTION_DATA_SOURCE_ID
ENV NOTION_AUTHORS_DATA_SOURCE_ID=$NOTION_AUTHORS_DATA_SOURCE_ID
ENV NEXT_PUBLIC_GA_ID=$NEXT_PUBLIC_GA_ID

RUN npm run build

# --- runner ---
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]
