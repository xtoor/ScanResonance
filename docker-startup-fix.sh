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

# Fix server/vite.ts for Node.js 18 compatibility (Python replacement)
if [ -f server/vite.ts ]; then
    echo "Patching server/vite.ts for Node.js 18..."
    
    # Show current content for debugging
    echo "Current problematic path.resolve calls:"
    grep -A6 -B1 "path\.resolve" server/vite.ts || true
    
    # Use Python for precise multiline replacement
    python3 << 'EOF'
import re

# Read the file
with open('server/vite.ts', 'r') as f:
    content = f.read()

# Replace the multiline clientTemplate path.resolve
clientTemplate_pattern = r'const clientTemplate = path\.resolve\(\s*[^,]+,\s*"\.\."\s*,\s*"client"\s*,\s*"index\.html"\s*,?\s*\);'
content = re.sub(clientTemplate_pattern, 'const clientTemplate = "/app/client/index.html";', content, flags=re.MULTILINE | re.DOTALL)

# Replace the distPath path.resolve  
distPath_pattern = r'const distPath = path\.resolve\([^,]+,\s*"public"\s*\);'
content = re.sub(distPath_pattern, 'const distPath = "/app/dist/public";', content, flags=re.MULTILINE | re.DOTALL)

# Replace any remaining import.meta.dirname references
content = re.sub(r'import\.meta\.dirname', '"/app/server"', content)

# Replace path.resolve(distPath, "index.html") 
content = re.sub(r'path\.resolve\(distPath,\s*"index\.html"\)', '"/app/dist/public/index.html"', content)

# Write the file back
with open('server/vite.ts', 'w') as f:
    f.write(content)

print("✅ Python replacement completed")
EOF
    
    echo "After patching - checking for remaining issues:"
    grep -A6 -B1 "path\.resolve\|import\.meta\.dirname" server/vite.ts || echo "✅ No problematic patterns found"
    
    echo "✅ server/vite.ts fixed with Python multiline replacement"
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