# 🔧 حل مشكلة ERR_CONNECTION_REFUSED

## المشكلة
```
GET http://localhost:5000/api/products net::ERR_CONNECTION_REFUSED
GET http://localhost:5000/api/homepage net::ERR_CONNECTION_REFUSED
```

## السبب
الـ Backend مو شغال على port 5000

---

## ✅ الحل

### 1. شغل Backend أولاً
```bash
cd backend
npm run dev
```

**يجب أن تشوف:**
```
[nodemon] starting `ts-node src/server.ts`
✅ Connected to MongoDB
🚀 Server running on port 5000
```

### 2. تأكد من MongoDB شغال
إذا ما شفت "Connected to MongoDB"، شغل MongoDB:

**Windows:**
```bash
# افتح terminal جديد
mongod
```

**أو استخدم MongoDB Compass**

### 3. بعد ما يشتغل Backend، شغل Frontend
```bash
# في terminal جديد
cd frontend
npm run dev
```

### 4. افتح المتصفح
```
http://localhost:3000
```

---

## 🧪 اختبار الاتصال

### تأكد من Backend شغال:
افتح في المتصفح:
```
http://localhost:5000/api/products
```

يجب أن تشوف JSON response

---

## 📝 الترتيب الصحيح

1. ✅ شغل MongoDB
2. ✅ شغل Backend (port 5000)
3. ✅ شغل Frontend (port 3000)
4. ✅ افتح المتصفح

---

## 🎯 خطوات كاملة من البداية

```bash
# Terminal 1 - Backend
cd backend
npm run dev

# انتظر حتى تشوف: "Server running on port 5000"

# Terminal 2 - Frontend
cd frontend
npm run dev

# Terminal 3 - إضافة بيانات (مرة واحدة فقط)
cd backend
npm run add:products
npm run init:homepage
```

---

تم الإنشاء: نوفمبر 2024
