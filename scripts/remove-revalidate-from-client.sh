#!/bin/bash

echo "🔧 Removing revalidate exports from client components..."

# Find all client component files and remove revalidate exports
find /home/z/my-project/src/app -name "*.tsx" -type f | while read file; do
    if grep -q "use client" "$file"; then
        echo "Processing: $file"
        
        # Use sed to remove revalidate and fetchCache exports from client components
        sed -i '/export const revalidate/d' "$file"
        sed -i '/export const fetchCache/d' "$file"
        
        echo "  ✓ Removed revalidate exports from client component"
    fi
done

echo "✅ All revalidate exports removed from client components!"
