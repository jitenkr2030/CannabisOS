#!/bin/bash

echo "🚀 CannabisOS Production Setup Script"
echo "======================================"
echo ""
echo "⚠️  SECURITY WARNING: This script helps you set up production environment securely"
echo ""

# Create .env from template if it doesn't exist
if [ ! -f ".env" ]; then
    echo "📝 Creating .env from template..."
    cp .env.production.template .env
    echo "✅ Created .env file from template"
else
    echo "⚠️  .env file already exists"
fi

echo ""
echo "📋 NEXT STEPS:"
echo "1. Edit .env file with your actual values"
echo "2. Add the same values to Vercel Environment Variables"
echo "3. Test locally: bun run dev"
echo "4. Deploy to Vercel"
echo "5. Delete .env file after successful deployment"
echo ""

echo "🔐 SECURITY REMINDERS:"
echo "- NEVER commit .env with real credentials to GitHub"
echo "- ALWAYS use Vercel Environment Variables for production"
echo "- DELETE .env file after deployment"
echo "- Keep your credentials secure and private"
echo ""

echo "🚀 Ready to configure your production environment!"
