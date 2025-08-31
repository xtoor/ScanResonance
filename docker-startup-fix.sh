#!/bin/sh
# Docker startup script to fix Node.js 18 compatibility issues

echo "🔧 Fixing Node.js 18 compatibility issues..."

# Fix vite.config.ts for Node.js 18 compatibility (5 occurrences)
if [ -f vite.config.ts ]; then
    echo "Patching vite.config.ts for Node.js 18..."
    
    # Replace all import.meta.dirname with process.cwd() for Docker compatibility
    sed -i 's/import\.meta\.dirname/process.cwd()/g' vite.config.ts
    
    echo "✅ vite.config.ts patched successfully (5 occurrences)"
else
    echo "❌ vite.config.ts not found"
fi

# Fix server/vite.ts for Node.js 18 compatibility (2 occurrences)
if [ -f server/vite.ts ]; then
    echo "Patching server/vite.ts for Node.js 18..."
    
    # Replace with direct hardcoded paths for Docker environment
    # First occurrence: client template path
    sed -i 's|path\.resolve(\s*import\.meta\.dirname,\s*"\.\.",\s*"client",\s*"index\.html"\s*)|"/app/client/index.html"|g' server/vite.ts
    
    # Second occurrence: static dist path  
    sed -i 's|path\.resolve(import\.meta\.dirname,\s*"public")|"/app/dist/public"|g' server/vite.ts
    
    # If direct replacements didn't work, fall back to simple replacement
    sed -i 's/import\.meta\.dirname/"\/app\/server"/g' server/vite.ts
    
    echo "✅ server/vite.ts patched with direct paths"
else
    echo "❌ server/vite.ts not found"
fi

# Verify patches were applied correctly
echo "🔍 Verifying patches..."
if grep -q "import\.meta\.dirname" vite.config.ts server/vite.ts 2>/dev/null; then
    echo "❌ WARNING: Some import.meta.dirname references may not have been patched!"
    echo "Remaining references:"
    grep -n "import\.meta\.dirname" vite.config.ts server/vite.ts 2>/dev/null || true
else
    echo "✅ All import.meta.dirname references successfully patched"
fi

echo "🎯 Starting application..."
exec "$@"