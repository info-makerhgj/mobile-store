# حل مشكلة عدم ظهور المنتجات

## المشكلة
الصفحة الرئيسية لا تعرض المنتجات رغم وجودها في قاعدة البيانات.

## الحل

### 1. تأكد من تشغيل الـ Backend
```bash
cd backend
npm run dev
```
يجب أن ترى: `✅ Mobile Store Server running on http://localhost:4000`

### 2. تأكد من تشغيل الـ Frontend
```bash
cd frontend
npm run dev
```
يجب أن ترى: `✓ Ready in X ms`

### 3. اختبر الـ API مباشرة
افتح المتصفح واذهب إلى:
```
http://localhost:4000/api/homepage
```

يجب أن ترى JSON يحتوي على:
```json
{
  "_id": "...",
  "active": true,
  "sections": [
    {
      "type": "hero",
      "title": "مرحباً بك في متجرنا"
    },
    {
      "type": "products",
      "title": "المنتجات المميزة",
      "content": {
        "productIds": ["..."]
      }
    }
  ]
}
```

### 4. تحقق من الـ Console في المتصفح
1. افتح الصفحة الرئيسية: `http://localhost:3000`
2. اضغط F12 لفتح Developer Tools
3. اذهب إلى تبويب Console
4. ابحث عن أي أخطاء (باللون الأحمر)

### 5. تحقق من Network في المتصفح
1. في Developer Tools، اذهب إلى تبويب Network
2. حدث الصفحة (F5)
3. ابحث عن طلب `homepage`
4. تحقق من:
   - Status: يجب أن يكون 200
   - Response: يجب أن يحتوي على البيانات

## الأخطاء الشائعة

### خطأ 404 Not Found
**السبب**: الـ Backend غير مشغل أو الـ URL خاطئ
**الحل**: 
1. تأكد من تشغيل Backend على port 4000
2. تحقق من ملف `frontend/.env.local`:
   ```
   NEXT_PUBLIC_API_URL=http://localhost:4000/api
   ```

### خطأ CORS
**السبب**: مشكلة في إعدادات CORS
**الحل**: تأكد من أن Backend يحتوي على:
```typescript
app.use(cors())
```

### الصفحة فارغة
**السبب**: لا توجد إعدادات للصفحة الرئيسية
**الحل**: شغل:
```bash
cd backend
npx ts-node init-homepage-simple.ts
```

## التحقق من البيانات

### تحقق من المنتجات
```bash
cd backend
npx ts-node check-products.ts
```

### تحقق من إعدادات الصفحة الرئيسية
```bash
cd backend
npx ts-node test-api.ts
```

## إعادة تهيئة الصفحة الرئيسية

إذا كانت المشكلة مستمرة، أعد تهيئة الصفحة الرئيسية:

```bash
cd backend
npx ts-node init-homepage-simple.ts
```

ثم حدث الصفحة في المتصفح (Ctrl+Shift+R للتحديث الكامل).

## الدعم

إذا استمرت المشكلة:
1. تحقق من logs الـ Backend في Terminal
2. تحقق من Console في المتصفح
3. تحقق من Network في المتصفح
4. أرسل screenshot للأخطاء
