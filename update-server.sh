#!/bin/bash

echo "🔄 تحديث المشروع على السيرفر..."
echo ""

# الانتقال لمجلد المشروع
cd ~/mobile-store

# جلب آخر التحديثات
echo "📥 جلب التحديثات من GitHub..."
git pull

# تحديث Backend
echo ""
echo "🔧 تحديث Backend..."
cd backend
npm install
npm run build

# إعادة تشغيل PM2
echo ""
echo "♻️ إعادة تشغيل Backend..."
pm2 restart mobile-store-api

# عرض الحالة
echo ""
echo "📊 حالة التطبيق:"
pm2 list

echo ""
echo "✅ تم التحديث بنجاح!"
echo ""
echo "🔍 للتحقق من اللوجات:"
echo "   pm2 logs mobile-store-api"
