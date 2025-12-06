# 🚀 رفع المشروع على Vercel - خطوات سريعة

## الطريقة الأسهل (بدون GitHub)

### 1️⃣ تثبيت Vercel CLI
```bash
npm install -g vercel
```

### 2️⃣ تسجيل الدخول
```bash
vercel login
```
راح يفتح لك المتصفح، سجل دخول بحساب Google أو GitHub

### 3️⃣ رفع Frontend
```bash
cd frontend
vercel
```

اتبع الأسئلة:
- Set up and deploy? **Y**
- Which scope? اختر حسابك
- Link to existing project? **N**
- What's your project's name? **mobile-store** (أو أي اسم تبيه)
- In which directory is your code located? **.**
- Want to override the settings? **N**

### 4️⃣ إضافة Environment Variables
```bash
vercel env add NEXT_PUBLIC_API_URL
```
أدخل القيمة: `http://localhost:4000/api` (أو رابط Backend لو عندك)

### 5️⃣ رفع للإنتاج
```bash
vercel --prod
```

---

## الطريقة الثانية (من خلال موقع Vercel)

### 1️⃣ رفع على GitHub أولاً

```bash
# في المجلد الرئيسي للمشروع
git init
git add .
git commit -m "Initial commit"

# روح لـ GitHub وأنشئ repository جديد
# ثم:
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git branch -M main
git push -u origin main
```

### 2️⃣ ربط مع Vercel

1. روح لـ https://vercel.com
2. اضغط **"Add New Project"**
3. اختر الـ repository من GitHub
4. **مهم جداً**: في إعدادات المشروع:
   - **Root Directory**: اختر `frontend`
   - **Framework Preset**: Next.js
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`

5. أضف Environment Variables:
   - Key: `NEXT_PUBLIC_API_URL`
   - Value: `http://localhost:4000/api` (أو رابط Backend)

6. اضغط **Deploy**

---

## ⚙️ إعدادات مهمة

### تحديث ملف next.config.js
تأكد من وجود:

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['localhost'],
    unoptimized: true, // إذا كنت تستخدم صور base64
  },
}

module.exports = nextConfig
```

### تحديث CORS في Backend
في ملف `backend/src/server.ts`، أضف domain Vercel:

```typescript
const allowedOrigins = [
  'http://localhost:3000',
  'https://your-app.vercel.app', // غيره لرابطك
  process.env.FRONTEND_URL
].filter(Boolean)
```

---

## 🧪 اختبار بعد الرفع

1. افتح الرابط اللي أعطاك Vercel
2. تأكد من:
   - ✅ الصفحة الرئيسية تفتح
   - ✅ التصميم يظهر صح
   - ✅ الصور تحمل
   - ⚠️ المنتجات ما راح تظهر إلا لو Backend شغال

---

## 🔄 التحديثات المستقبلية

### لو استخدمت Vercel CLI:
```bash
cd frontend
vercel --prod
```

### لو استخدمت GitHub:
```bash
git add .
git commit -m "تحديث"
git push
```
Vercel راح ينشر تلقائياً!

---

## ⚠️ ملاحظات مهمة

1. **Backend لازم يكون شغال** عشان المنتجات والطلبات تشتغل
2. **الصور الكبيرة** ممكن تبطئ الموقع، استخدم صور مضغوطة
3. **Environment Variables** لازم تضيفها في Vercel Dashboard
4. **Domain مخصص** تقدر تضيفه من إعدادات المشروع

---

## 🆘 مشاكل شائعة

### المشكلة: Build فشل
**الحل:**
```bash
cd frontend
npm install
npm run build
```
إذا اشتغل عندك، معناها المشكلة في Vercel. تأكد من:
- Node version صحيح (18+)
- Dependencies كلها موجودة

### المشكلة: الصفحة بيضاء
**الحل:**
- افتح Console في المتصفح (F12)
- شوف الأخطاء
- غالباً المشكلة في API URL

### المشكلة: المنتجات ما تظهر
**الحل:**
- تأكد Backend شغال
- تأكد CORS مضبوط
- تأكد `NEXT_PUBLIC_API_URL` صحيح

---

## 📞 محتاج مساعدة؟

شوف الملفات:
- `VERCEL_DEPLOYMENT_AR.md` - دليل مفصل
- `AWS_DEPLOYMENT_GUIDE_AR.md` - لرفع Backend
- `DEPLOYMENT_CHECKLIST_AR.md` - قائمة التحقق

---

**بالتوفيق!** 🎉
