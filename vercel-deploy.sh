#!/bin/bash
# Force Vercel to rebuild without cache
echo "Triggering Vercel deployment without cache..."
vercel --prod --no-cache
