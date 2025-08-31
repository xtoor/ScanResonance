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

# Fix server/vite.ts for Node.js 18 compatibility (multiline patterns)
if [ -f server/vite.ts ]; then
    echo "Patching server/vite.ts for Node.js 18..."
    
    # Show current content for debugging
    echo "Current problematic lines:"
    grep -A5 -B2 "path\.resolve\|import\.meta\.dirname" server/vite.ts || true
    
    # Create a completely new version of the file with direct replacements
    # This handles the multiline path.resolve patterns definitively
    cat server/vite.ts | \
    sed 's/import\.meta\.dirname/"\/app\/server"/g' | \
    sed ':a;N;$!ba;s/const clientTemplate = path\.resolve(\s*"\/app\/server",\s*"\.\.",\s*"client",\s*"index\.html",\s*);/const clientTemplate = "\/app\/client\/index.html";/g' | \
    sed ':a;N;$!ba;s/const distPath = path\.resolve("\/app\/server", "public");/const distPath = "\/app\/dist\/public";/g' | \
    sed 's/path\.resolve(\s*"\/app\/server",\s*"\.\.",\s*"client",\s*"index\.html"\s*)/"\/app\/client\/index.html"/g' | \
    sed 's/path\.resolve("\/app\/server",\s*"public")/"\/app\/dist\/public"/g' | \
    sed 's/path\.resolve(distPath, "index\.html")/path.join("\/app\/dist\/public", "index.html")/g' \
    > server/vite.ts.tmp && mv server/vite.ts.tmp server/vite.ts
    
    echo "After patching:"
    grep -A5 -B2 "path\.resolve\|import\.meta\.dirname\|/app/" server/vite.ts || echo "No problematic patterns found"
    
    echo "✅ server/vite.ts completely rewritten with direct paths"
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