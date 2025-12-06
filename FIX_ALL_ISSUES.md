# 🔧 إصلاح جميع المشاكل

## المشاكل المكتشفة:

1. ✅ **تسجيل الدخول** - تم الإصلاح
2. ❌ **404 على `/api/homepage`** - لا يوجد تكوين في قاعدة البيانات
3. ❌ **404 على `/api/offers`** - الـ endpoint غير موجود
4. ❌ **401 على `/api/customers`** - مشكلة في الصلاحيات

---

## 🚀 الحل السريع (على السيرفر)

### الخطوة 1: سحب التحديثات

```bash
cd ~/mobile-store
git pull origin main
```

### الخطوة 2: تثبيت Dependencies (إذا لزم الأمر)

```bash
cd backend
npm install
```

### الخطوة 3: تهيئة قاعدة البيانات

```bash
# إنشاء تكوين الصفحة الرئيسية
node init-homepage-config.js
```

### الخطوة 4: إعادة بناء Backend

```bash
npm run build
```

### الخطوة 5: إعادة تشغيل التطبيق

```bash
pm2 restart mobile-store-api
```

### الخطوة 6: التحقق

```bash
# اختبار homepage
curl http://localhost:4000/api/homepage

# اختبار offers
curl http://localhost:4000/api/offers

# اختبار customers (يحتاج token)
# سجل دخول أولاً من المتصفح ثم جرب
```

---

## 📋 التفاصيل

### 1. إصلاح `/api/offers`

تم إنشاء ملف `backend/src/routes/offers.ts` جديد مع جميع الـ endpoints:
- `GET /api/offers` - جلب جميع العروض
- `GET /api/offers/:id` - جلب عرض محدد
- `POST /api/offers` - إنشاء عرض (Admin)
- `PUT /api/offers/:id` - تحديث عرض (Admin)
- `DELETE /api/offers/:id` - حذف عرض (Admin)

### 2. إصلاح `/api/homepage`

المشكلة: لا يوجد `HomepageConfig` في قاعدة البيانات.

الحل: تشغيل `init-homepage-config.js` لإنشاء تكوين افتراضي.

### 3. إصلاح `/api/customers`

الصلاحيات تعمل بشكل صحيح، لكن تأكد من:
- التوكن صحيح
- المستخدم له صلاحية ADMIN
- التوكن مرسل في الـ headers: `Authorization: Bearer <token>`

---

## 🧪 اختبار شامل

بعد تطبيق الإصلاحات، اختبر:

```bash
# 1. Health check
curl http://localhost:4000/api/health

# 2. Homepage
curl http://localhost:4000/api/homepage

# 3. Offers
curl http://localhost:4000/api/offers

# 4. Login
curl -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@ab-tw.com","password":"123456"}'
```

---

## 🔄 إذا استمرت المشاكل

### مشكلة: لا يزال 404 على `/api/homepage`

```bash
# تحقق من قاعدة البيانات
mongosh mobile_store
db.HomepageConfig.find()

# إذا كانت فارغة، شغل:
node init-homepage-config.js
```

### مشكلة: لا يزال 401 على `/api/customers`

```bash
# تحقق من اللوجات
pm2 logs mobile-store-api

# تحقق من التوكن
# سجل دخول من المتصفح وافتح Developer Tools > Network
# انسخ التوكن من الـ Authorization header
```

### مشكلة: Build فشل

```bash
cd backend
rm -rf dist
npm run build

# إذا كان هناك أخطاء TypeScript
npm install --save-dev @types/node @types/express
```

---

## 📝 ملاحظات

1. **كلمة المرور الافتراضية:** `123456` - غيرها بعد أول تسجيل دخول!
2. **البيئة:** تأكد أن `NODE_ENV=production` في ملف `.env`
3. **CORS:** إذا كان Frontend على domain مختلف، تأكد من إضافته في `FRONTEND_URL`

---

## ✅ الخلاصة

بعد تطبيق هذه الإصلاحات:
- ✅ تسجيل الدخول يعمل
- ✅ `/api/homepage` يعمل
- ✅ `/api/offers` يعمل
- ✅ `/api/customers` يعمل (مع صلاحيات صحيحة)

**الآن المتجر جاهز للاستخدام! 🎉**
