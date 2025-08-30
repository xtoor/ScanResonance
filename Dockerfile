# Resonance.ai Breakout Scanner - Docker Image
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Copy package files
COPY package.json package-lock.json* ./
RUN npm ci --only=production && npm cache clean --force

# Build the application
FROM base AS builder
WORKDIR /app
COPY . .
COPY --from=deps /app/node_modules ./node_modules

# Build the application
RUN npm run build

# Production image
FROM base AS runner
WORKDIR /app

# Create non-root user for security
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 scanner

# Copy built application
COPY --from=builder --chown=scanner:nodejs /app/dist ./dist
COPY --from=builder --chown=scanner:nodejs /app/client/dist ./client/dist
COPY --from=deps --chown=scanner:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=scanner:nodejs /app/package.json ./package.json
COPY --from=builder --chown=scanner:nodejs /app/shared ./shared

# Create data directory for SQLite fallback
RUN mkdir -p /app/data && chown scanner:nodejs /app/data

# Switch to non-root user
USER scanner

# Expose port
EXPOSE 5000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
  CMD curl -f http://localhost:5000/api/configurations || exit 1

# Environment variables
ENV NODE_ENV=production
ENV PORT=5000

# Copy and use entrypoint script
COPY --chown=scanner:nodejs docker-entrypoint.sh ./
RUN chmod +x docker-entrypoint.sh

# Start the application
ENTRYPOINT ["./docker-entrypoint.sh"]