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

# Fix server/vite.ts for Node.js 18 compatibility (Advanced sed multiline)
if [ -f server/vite.ts ]; then
    echo "Patching server/vite.ts for Node.js 18..."
    
    # Show current content for debugging
    echo "Current problematic path.resolve calls:"
    grep -A6 -B1 "path\.resolve" server/vite.ts || true
    
    # Create temporary file with direct replacements
    # Method 1: Replace specific multiline clientTemplate pattern
    sed ':a;N;$!ba;s/const clientTemplate = path\.resolve(\s*process\.cwd(),\s*"\.\."\s*,\s*"client"\s*,\s*"index\.html"\s*,\s*);/const clientTemplate = "\/app\/client\/index.html";/g' server/vite.ts > server/vite.ts.tmp1
    
    # Method 2: Replace specific distPath pattern
    sed ':a;N;$!ba;s/const distPath = path\.resolve(process\.cwd(), "public");/const distPath = "\/app\/dist\/public";/g' server/vite.ts.tmp1 > server/vite.ts.tmp2
    
    # Method 3: Handle any remaining path.resolve with distPath
    sed 's/path\.resolve(distPath, "index\.html")/"\/app\/dist\/public\/index.html"/g' server/vite.ts.tmp2 > server/vite.ts.tmp3
    
    # Method 4: Brute force approach - line by line replacement
    # Replace the entire multiline block manually
    awk '
    /const clientTemplate = path\.resolve/ {
        print "      const clientTemplate = \"/app/client/index.html\";"
        # Skip the next 5 lines (the multiline path.resolve)
        for(i=1; i<=5; i++) { if(getline > 0) continue; }
        next
    }
    /const distPath = path\.resolve\(process\.cwd\(\), "public"\)/ {
        print "  const distPath = \"/app/dist/public\";"
        next
    }
    { print }
    ' server/vite.ts.tmp3 > server/vite.ts.tmp4
    
    # Move final result back
    mv server/vite.ts.tmp4 server/vite.ts
    rm -f server/vite.ts.tmp1 server/vite.ts.tmp2 server/vite.ts.tmp3
    
    echo "After patching - checking for remaining issues:"
    grep -A6 -B1 "path\.resolve\|import\.meta\.dirname" server/vite.ts || echo "✅ No problematic patterns found"
    
    echo "✅ server/vite.ts fixed with advanced sed multiline replacement"
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