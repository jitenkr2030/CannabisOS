#!/bin/bash

echo "🔧 Cleaning up 'use client' directives..."

# Find all page files and clean up properly
find /home/z/my-project/src/app -name "*.tsx" -type f | while read file; do
    if grep -q "use client" "$file"; then
        echo "Processing: $file"
        
        # Create a temporary file
        temp_file=$(mktemp)
        
        # Add 'use client' first if it's a client component
        if grep -q "useState\|useEffect\|useRouter" "$file"; then
            echo "'use client'" > "$temp_file"
            echo "" >> "$temp_file"
        fi
        
        # Add dynamic directives if needed
        if grep -q "export const dynamic" "$file" || grep -q "useState\|useEffect\|useRouter" "$file"; then
            echo "export const dynamic = 'force-dynamic'" >> "$temp_file"
            echo "export const revalidate = 0" >> "$temp_file"
            echo "export const fetchCache = 'force-no-store'" >> "$temp_file"
            echo "" >> "$temp_file"
        fi
        
        # Add imports and the rest of the file
        sed -e "/use client/d" -e "/export const dynamic/d" -e "/export const revalidate/d" -e "/export const fetchCache/d" -e "/^$/N" "$file" >> "$temp_file"
        
        # Replace the original file
        mv "$temp_file" "$file"
        echo "  ✓ Cleaned up directives"
    fi
done

echo "✅ All 'use client' directives cleaned up!"
