#!/bin/bash

echo "🔧 Making all pages dynamic..."

# Find all page files and add dynamic rendering
find /home/z/my-project/src/app -name "page.tsx" -type f | while read file; do
    echo "Processing: $file"
    
    # Check if the file already has dynamic export
    if grep -q "export const dynamic" "$file"; then
        echo "  ✓ Already dynamic"
    else
        # Add dynamic rendering to the top of the file
        temp_file=$(mktemp)
        echo "// Force dynamic rendering" > "$temp_file"
        echo "export const dynamic = 'force-dynamic'" >> "$temp_file"
        echo "export const revalidate = 0" >> "$temp_file"
        echo "" >> "$temp_file"
        cat "$file" >> "$temp_file"
        mv "$temp_file" "$file"
        echo "  ✓ Made dynamic"
    fi
done

echo "✅ All pages are now dynamic!"
