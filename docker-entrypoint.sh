#!/bin/bash
# Resonance.ai Breakout Scanner - Docker Entrypoint Script

set -e

echo "🚀 Starting Resonance.ai Breakout Scanner..."

# Wait for database to be ready
echo "⏳ Waiting for database to be ready..."
while ! pg_isready -h postgres -p 5432 -U scanner_user; do
  echo "Database not ready, waiting..."
  sleep 2
done

echo "✅ Database is ready!"

# Run database migrations/setup
echo "🔧 Setting up database schema..."
npm run db:push --force

echo "🎯 Starting the Breakout Scanner application..."
exec npm start