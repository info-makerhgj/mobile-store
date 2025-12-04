# دليل تشغيل المشروع

## المتطلبات
- Node.js 18+
- MongoDB (يفضل MongoDB Compass)
- npm أو yarn

## خطوات التشغيل

### 1. تثبيت MongoDB
تأكد من تشغيل MongoDB على المنفذ الافتراضي 27017

### 2. تثبيت المكتبات

```bash
# في المجلد الرئيسي
npm install

# Frontend
cd frontend
npm install

# Backend
cd ../backend
npm install
```

### 3. إعداد قاعدة البيانات

```bash
cd backend

# إنشاء قاعدة البيانات
npx prisma generate
npx prisma db push
```

### 4. تشغيل المشروع

افتح terminal منفصل لكل واحد:

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```
السيرفر راح يشتغل على: http://localhost:5001

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```
الموقع راح يشتغل على: http://localhost:3001

## المنافذ المستخدمة
- Frontend: 3001 (عشان ما يتعارض مع مشروعك الثاني)
- Backend: 5001 (عشان ما يتعارض مع مشروعك الثاني)
- MongoDB: 27017 (المنفذ الافتراضي)
- قاعدة البيانات: mobile_store

## MongoDB Compass
افتح MongoDB Compass وأضف الاتصال:
```
mongodb://localhost:27017/mobile_store
```

## ملاحظات مهمة
- المشروع يستخدم منافذ مختلفة عن المشروع الثاني
- قاعدة البيانات اسمها mobile_store (مختلفة عن مشروعك)
- كل المنافذ قابلة للتعديل من ملفات .env
