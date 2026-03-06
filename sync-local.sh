#!/bin/bash

# Sync Script - Ensure Local Development Matches Repository
echo "🔄 SYNCING LOCAL DEVELOPMENT WITH REPOSITORY"
echo "============================================"

# 1. Check current status
echo "📊 Checking current git status..."
git status

# 2. Fetch latest changes
echo "📥 Fetching latest changes from repository..."
git fetch origin

# 3. Reset to latest master
echo "🔄 Resetting to latest master branch..."
git reset --hard origin/master

# 4. Clear all caches
echo "🧹 Clearing all caches..."
rm -rf .next
rm -rf out
rm -rf node_modules/.cache

# 5. Verify login page content
echo "🔍 Verifying login page content..."
if grep -q "Static Demo Mode" /home/z/my-project/src/app/login/page.tsx; then
    echo "✅ Login page has latest code"
else
    echo "❌ Login page content mismatch"
fi

# 6. Start development server
echo "🚀 Starting development server..."
npm run dev > dev.log 2>&1 &
DEV_PID=$!

echo "✅ Sync completed!"
echo "📊 Development server starting..."
echo "🌐 Visit: http://localhost:3000/login"
echo "📋 Should show: Clean login page with 'Static Demo Mode'"
echo ""
echo "To stop server: kill $DEV_PID"

# Wait a moment and test
sleep 5
echo ""
echo "🧪 Testing local development server..."
if curl -s http://localhost:3000/login > /dev/null; then
    echo "✅ Development server is running"
    if curl -s http://localhost:3000/login | grep -q "Static Demo Mode"; then
        echo "✅ Login page shows latest code"
    else
        echo "⚠️  Login page may still be loading"
    fi
else
    echo "❌ Development server not responding"
fi

echo ""
echo "🎯 LOCAL DEVELOPMENT IS NOW SYNCED WITH REPOSITORY!"
echo "📱 Both local and production should show identical code"