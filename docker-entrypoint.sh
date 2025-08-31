#!/bin/bash
# Resonance.ai Breakout Scanner - Docker Entrypoint Script

set -e

echo "🚀 Starting Resonance.ai Breakout Scanner..."

# Build DATABASE_URL from individual components if not already set
if [ -z "$DATABASE_URL" ] && [ -n "$DB_PASSWORD" ]; then
    DB_HOST=${DB_HOST:-postgres}
    DB_PORT=${DB_PORT:-5432}
    DB_NAME=${DB_NAME:-resonance_scanner}
    DB_USER=${DB_USER:-scanner_user}
    
    echo "🔧 Building DATABASE_URL from individual components..."
    export DATABASE_URL="postgresql://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}"
fi

# Wait for database to be ready
echo "⏳ Waiting for database to be ready..."
DB_HOST_FOR_CHECK=${DB_HOST:-postgres}
while ! pg_isready -h "$DB_HOST_FOR_CHECK" -p 5432 -U scanner_user; do
  echo "Database not ready, waiting..."
  sleep 2
done

echo "✅ Database is ready!"

# Run database migrations/setup
echo "🔧 Setting up database schema..."
npm run db:push --force

echo "🎯 Starting the Breakout Scanner application..."
exec npm start