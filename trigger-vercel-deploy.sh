#!/bin/bash
echo "🚀 TRIGGERING VERCEL DEPLOYMENT MANUALLY"

# Method 1: Using Vercel CLI (if available)
if command -v vercel &> /dev/null; then
    echo "📦 Using Vercel CLI..."
    vercel --prod --force
else
    echo "⚠️  Vercel CLI not found, trying alternative methods..."
    
    # Method 2: Using Vercel API (requires token)
    if [ -n "$VERCEL_TOKEN" ]; then
        echo "🔌 Using Vercel API..."
        curl -X POST "https://api.vercel.com/v1/deployments" \
            -H "Authorization: Bearer $VERCEL_TOKEN" \
            -H "Content-Type: application/json" \
            -d '{
                "project": "cannabis-os",
                "target": "production",
                "gitCommit": {
                    "repo": "jitenkr2030/CannabisOS",
                    "branch": "master",
                    "commit": "'$(git rev-parse HEAD)'"
                }
            }'
    else
        echo "❌ No Vercel token found"
        echo "📝 Please trigger deployment manually in Vercel dashboard"
    fi
fi

echo "✅ Deployment trigger completed"
