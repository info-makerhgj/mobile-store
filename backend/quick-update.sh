#!/bin/bash

echo "================================"
echo "🚀 Quick Backend Update"
echo "================================"
echo ""

# Build the project
echo "📦 Building TypeScript..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build failed!"
    exit 1
fi

echo "✅ Build successful!"
echo ""

# Restart PM2
echo "🔄 Restarting backend..."
pm2 restart backend

if [ $? -ne 0 ]; then
    echo "⚠️  PM2 restart failed, trying to start..."
    pm2 start dist/server.js --name backend
    pm2 save
fi

echo "✅ Backend restarted!"
echo ""

# Show logs
echo "📋 Recent logs:"
pm2 logs backend --lines 10 --nostream

echo ""
echo "================================"
echo "✅ Update Complete!"
echo "================================"
echo ""
echo "Test the API:"
echo "  curl http://localhost:4000/api/health"
echo ""
