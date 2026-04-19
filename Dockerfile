FROM node:20-alpine AS base
RUN apk add --no-cache openssl

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Install dependencies based on the preferred package manager
COPY package.json package-lock.json* ./
RUN npm ci --legacy-peer-deps

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Generate Prisma Client
# Provide a dummy default to allow build to pass without DB connection
ARG DATABASE_URL="postgresql://build:build@localhost:5432/build?schema=public"
ENV DATABASE_URL=$DATABASE_URL
RUN npx prisma generate

# Increase memory limit for build
ENV NODE_OPTIONS="--max-old-space-size=4096"

# Build the application
RUN npm run build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Install Prisma CLI globally as nextjs user to ensure permissions
USER nextjs
ENV NPM_CONFIG_PREFIX=/home/nextjs/.npm-global
ENV PATH=$PATH:/home/nextjs/.npm-global/bin
RUN mkdir -p /home/nextjs/.npm-global/lib

COPY --from=builder --chown=nextjs:nodejs /app/public ./public
# Create uploads directory if it doesn't exist
RUN mkdir -p ./public/uploads
COPY --from=builder --chown=nextjs:nodejs /app/prisma ./prisma
# Ensure bcryptjs is available for Prisma admin bootstrap script
COPY --from=deps --chown=nextjs:nodejs /app/node_modules/bcryptjs ./node_modules/bcryptjs

# Automatically leverage output traces to reduce image size
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Install Prisma CLI and tsx globally to ensure they are available in PATH
RUN npm install -g prisma@5.22.0 tsx --legacy-peer-deps

USER nextjs

EXPOSE 3003

ENV PORT=3003
ENV HOSTNAME="0.0.0.0"

# Copy start script
COPY --chown=nextjs:nodejs .github/scripts/start.sh ./start.sh
RUN chmod +x ./start.sh

# Install curl for healthcheck
USER root
RUN apk add --no-cache curl
USER nextjs

HEALTHCHECK --interval=30s --timeout=10s --start-period=30s --retries=3 \
  CMD curl -f http://localhost:3003/api/v1/health || exit 1

CMD ["./start.sh"]
