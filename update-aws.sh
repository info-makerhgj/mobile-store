#!/bin/bash

# 🚀 سكريبت تحديث Backend على AWS

echo "🚀 بدء تحديث Backend..."
echo ""

# 1. إيقاف التطبيق
echo "⏸️  إيقاف التطبيق..."
pm2 stop mobile-store-api

# 2. الذهاب لمجلد المشروع
echo "📁 الانتقال لمجلد المشروع..."
cd ~/mobile-store || exit

# 3. حفظ التعديلات المحلية
echo "💾 حفظ التعديلات المحلية..."
git stash

# 4. سحب التحديثات
echo "⬇️  سحب التحديثات من GitHub..."
git pull origin main

if [ $? -ne 0 ]; then
    echo "❌ فشل سحب التحديثات!"
    exit 1
fi

# 5. تثبيت Dependencies
echo "📦 تثبيت Dependencies..."
cd backend
npm install

if [ $? -ne 0 ]; then
    echo "❌ فشل تثبيت Dependencies!"
    exit 1
fi

# 6. تهيئة قاعدة البيانات
echo "🗄️  تهيئة قاعدة البيانات..."
cd ..
node init-homepage-config.js

# 7. إعادة بناء Backend
echo "🔨 إعادة بناء Backend..."
cd backend
npm run build

if [ $? -ne 0 ]; then
    echo "❌ فشل البناء!"
    exit 1
fi

# 8. إعادة تشغيل التطبيق
echo "▶️  إعادة تشغيل التطبيق..."
pm2 restart mobile-store-api

# 9. عرض الحالة
echo ""
echo "✅ تم التحديث بنجاح!"
echo ""
echo "📊 حالة التطبيق:"
pm2 list

echo ""
echo "📝 آخر 20 سطر من اللوجات:"
pm2 logs mobile-store-api --lines 20 --nostream

echo ""
echo "🧪 اختبار API:"
curl -s http://localhost:4000/api/health | jq .

echo ""
echo "✅ التحديث اكتمل!"
echo "🌐 افتح الموقع: https://mobile-store-frontend-fawn.vercel.app"
