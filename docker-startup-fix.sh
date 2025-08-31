#!/bin/sh
# Docker startup script to fix Node.js 18 compatibility issues

echo "🔧 Fixing Node.js 18 compatibility issues..."

# Fix vite.config.ts for Node.js 18 compatibility
if [ -f vite.config.ts ]; then
    echo "Patching vite.config.ts for Node.js 18..."
    
    # Replace import.meta.dirname with process.cwd() for Docker compatibility
    sed -i 's/import\.meta\.dirname/process.cwd()/g' vite.config.ts
    
    echo "✅ vite.config.ts patched successfully"
else
    echo "❌ vite.config.ts not found"
fi

# Fix server/vite.ts for Node.js 18 compatibility
if [ -f server/vite.ts ]; then
    echo "Patching server/vite.ts for Node.js 18..."
    
    # Replace import.meta.dirname with path.join(process.cwd(), "server") to maintain correct path
    sed -i 's/import\.meta\.dirname/path.join(process.cwd(), "server")/g' server/vite.ts
    
    echo "✅ server/vite.ts patched successfully"
else
    echo "❌ server/vite.ts not found"
fi

echo "🎯 Starting application..."
exec "$@"