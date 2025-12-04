# 🚀 دليل نشر Frontend على Vercel

## الخطوة 1: تحضير المشروع

### 1. تحديث ملف next.config.js
تأكد من وجود الإعدادات التالية:

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['localhost', 'your-backend-domain.com'],
  },
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  },
}

module.exports = nextConfig
```

### 2. إنشاء ملف .env.production
```bash
NEXT_PUBLIC_API_URL=https://your-backend-url.com
```

## الخطوة 2: رفع على GitHub

```bash
# إذا لم يكن لديك Git repository
cd frontend
git init
git add .
git commit -m "Initial commit"

# إنشاء repository على GitHub ثم:
git remote add origin https://github.com/your-username/your-repo.git
git branch -M main
git push -u origin main
```

## الخطوة 3: النشر على Vercel

### الطريقة 1: من خلال موقع Vercel

1. اذهب إلى [vercel.com](https://vercel.com)
2. سجل دخول بحساب GitHub
3. اضغط "New Project"
4. اختر الـ repository الخاص بك
5. اختر مجلد `frontend` كـ Root Directory
6. أضف Environment Variables:
   - `NEXT_PUBLIC_API_URL` = رابط الـ Backend على AWS

7. اضغط "Deploy"

### الطريقة 2: من خلال Vercel CLI

```bash
# تثبيت Vercel CLI
npm i -g vercel

# تسجيل الدخول
vercel login

# النشر
cd frontend
vercel

# للنشر على Production
vercel --prod
```

## الخطوة 4: إعدادات Vercel

### Environment Variables المطلوبة:
```
NEXT_PUBLIC_API_URL=https://your-backend-url.com
```

### إعدادات Build:
- **Framework Preset**: Next.js
- **Build Command**: `npm run build`
- **Output Directory**: `.next`
- **Install Command**: `npm install`
- **Root Directory**: `frontend` (إذا كان المشروع في مجلد فرعي)

## الخطوة 5: ربط Domain مخصص (اختياري)

1. اذهب إلى Project Settings
2. اختر "Domains"
3. أضف الدومين الخاص بك
4. اتبع التعليمات لتحديث DNS

## الخطوة 6: تحديث API URLs

بعد رفع Backend على AWS، قم بتحديث:

### في Vercel Dashboard:
1. اذهب إلى Project Settings
2. Environment Variables
3. عدل `NEXT_PUBLIC_API_URL` إلى رابط Backend الجديد
4. Redeploy المشروع

### في الكود (إذا كنت تستخدم hardcoded URLs):
ابحث عن جميع `http://localhost:4000` واستبدلها بـ:
```javascript
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'
```

## الخطوة 7: اختبار النشر

بعد النشر، تحقق من:
- ✅ الصفحة الرئيسية تعمل
- ✅ المنتجات تظهر (بعد ربط Backend)
- ✅ الصور تحمل بشكل صحيح
- ✅ لوحة المدير تعمل
- ✅ نظام الطلبات يعمل

## مشاكل شائعة وحلولها

### 1. خطأ في Build
```bash
# تأكد من أن جميع dependencies موجودة
npm install

# جرب Build محلياً
npm run build
```

### 2. API لا يعمل
- تأكد من `NEXT_PUBLIC_API_URL` صحيح
- تأكد من Backend يسمح بـ CORS من domain Vercel
- تحقق من أن Backend يعمل

### 3. الصور لا تظهر
- أضف domain Backend في `next.config.js` تحت `images.domains`

## نصائح مهمة

1. **استخدم Environment Variables** لجميع الإعدادات الحساسة
2. **فعّل Analytics** في Vercel لمراقبة الأداء
3. **استخدم Edge Functions** للأداء الأفضل
4. **فعّل Automatic Deployments** من GitHub

## التحديثات المستقبلية

بعد كل تحديث في الكود:
```bash
git add .
git commit -m "وصف التحديث"
git push
```

Vercel سيقوم بالنشر تلقائياً! 🎉

---

**ملاحظة**: تأكد من رفع Backend على AWS أولاً وتحديث `NEXT_PUBLIC_API_URL`
