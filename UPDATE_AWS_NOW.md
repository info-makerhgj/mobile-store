# 🚨 تحديث Backend على AWS - عاجل!

## المشكلة:
الموقع معطل بالكامل لأن Backend على AWS قديم ومو محدّث

---

## ✅ الحل (خطوة بخطوة):

### 1️⃣ اتصل بالسيرفر:

```bash
ssh -i "your-key.pem" ubuntu@your-server-ip
```

---

### 2️⃣ أوقف التطبيق مؤقتاً:

```bash
pm2 stop mobile-store-api
```

---

### 3️⃣ اذهب لمجلد المشروع:

```bash
cd ~/mobile-store
```

---

### 4️⃣ احفظ التعديلات المحلية (إن وجدت):

```bash
git stash
```

---

### 5️⃣ اسحب آخر تحديثات:

```bash
git pull origin main
```

**يجب أن ترى:**
```
Updating xxx...xxx
Fast-forward
 backend/src/routes/offers.ts | ...
 backend/src/server.ts | ...
 ...
```

---

### 6️⃣ تثبيت Dependencies:

```bash
cd backend
npm install
```

---

### 7️⃣ تهيئة قاعدة البيانات:

```bash
cd ..
node init-homepage-config.js
```

**يجب أن ترى:**
```
✅ تم إنشاء تكوين الصفحة الرئيسية بنجاح!
```

---

### 8️⃣ إعادة بناء Backend:

```bash
cd backend
npm run build
```

**انتظر حتى يخلص البناء...**

---

### 9️⃣ إعادة تشغيل التطبيق:

```bash
pm2 restart mobile-store-api
```

---

### 🔟 تحقق من اللوجات:

```bash
pm2 logs mobile-store-api --lines 50
```

**يجب أن ترى:**
```
✅ Mobile Store Server running on:
   - Local:   http://localhost:4000
   - Network: http://0.0.0.0:4000
```

---

## 🧪 اختبار:

بعد التحديث، اختبر:

```bash
curl http://localhost:4000/api/health
```

**يجب أن ترى:**
```json
{"status":"ok","message":"API is running","timestamp":"..."}
```

---

## ⚠️ إذا واجهت مشاكل:

### مشكلة: MongoDB مو شغال

```bash
sudo systemctl status mongod
sudo systemctl start mongod
```

### مشكلة: Port 4000 مستخدم

```bash
pm2 delete mobile-store-api
pm2 start dist/server.js --name mobile-store-api
```

### مشكلة: Build فشل

```bash
rm -rf dist node_modules
npm install
npm run build
```

---

## 📋 بعد التحديث:

1. ✅ افتح الموقع: https://mobile-store-frontend-fawn.vercel.app
2. ✅ سجل دخول: admin@ab-tw.com / 123456
3. ✅ جرب إضافة قسم في لوحة الإدارة

**المفروض كل شي يشتغل الحين! 🎉**

---

## 🆘 إذا لسه في مشاكل:

شغل هذا الأمر وأرسل لي النتيجة:

```bash
pm2 logs mobile-store-api --lines 100 --nostream
```
