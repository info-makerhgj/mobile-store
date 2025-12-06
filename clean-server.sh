#!/bin/bash

echo "🧹 بدء تنظيف السيرفر..."

# إيقاف جميع عمليات PM2
echo "⏹️ إيقاف PM2..."
pm2 stop all
pm2 delete all
pm2 kill

# حذف المشروع القديم
echo "🗑️ حذف المشروع القديم..."
cd ~
rm -rf backend
rm -rf frontend
rm -rf mobile-store
rm -rf hotw
rm -rf node_modules
rm -rf *.zip

# تنظيف MongoDB
echo "🗄️ تنظيف قاعدة البيانات..."
mongosh --eval "use mobile-store; db.dropDatabase();"
mongosh --eval "use abaad_store; db.dropDatabase();"

# تنظيف Nginx
echo "🌐 تنظيف Nginx..."
sudo rm -f /etc/nginx/sites-enabled/mobile-store
sudo rm -f /etc/nginx/sites-available/mobile-store
sudo systemctl restart nginx

# تنظيف Environment Variables القديمة
echo "🔧 تنظيف المتغيرات..."
rm -f .env
rm -f backend/.env
rm -f frontend/.env

echo "✅ تم التنظيف بنجاح!"
echo ""
echo "📊 المساحة المتوفرة:"
df -h /

echo ""
echo "🎯 السيرفر جاهز للمشروع الجديد!"
