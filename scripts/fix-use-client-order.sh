#!/bin/bash

echo "🔧 Fixing 'use client' directive order..."

# Find all page files with 'use client' and fix the order
find /home/z/my-project/src/app -name "*.tsx" -type f | while read file; do
    if grep -q "use client" "$file"; then
        echo "Processing: $file"
        
        # Create a temporary file with correct order
        temp_file=$(mktemp)
        
        # Add 'use client' first
        echo "'use client'" > "$temp_file"
        echo "" >> "$temp_file"
        
        # Add other directives if they exist
        if grep -q "export const dynamic" "$file"; then
            echo "export const dynamic = 'force-dynamic'" >> "$temp_file"
            echo "export const revalidate = 0" >> "$temp_file"
            echo "export const fetchCache = 'force-no-store'" >> "$temp_file"
            echo "" >> "$temp_file"
        fi
        
        # Add the rest of the file (skipping the 'use client' line and directives)
        sed -e "/use client/d" -e "/export const dynamic/d" -e "/export const revalidate/d" -e "/export const fetchCache/d" -e "/^$/N" "$file" >> "$temp_file"
        
        # Replace the original file
        mv "$temp_file" "$file"
        echo "  ✓ Fixed directive order"
    else
        echo "  ✓ No 'use client' directive found"
    fi
done

echo "✅ All 'use client' directive orders fixed!"
