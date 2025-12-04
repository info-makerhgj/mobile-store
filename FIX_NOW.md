# 🔧 اصلح المشكلة الآن

## المشكلة
```
ERR_CONNECTION_REFUSED
Error fetching config: TypeError: Failed to fetch
```

## السبب
**الـ Backend مو شغال!**

---

## ✅ الحل (خطوتين فقط)

### 1. شغل Backend
```bash
cd backend
npm run dev
```

**انتظر حتى تشوف:**
```
✅ Connected to MongoDB
🚀 Server running on port 5000
```

### 2. أعد تحميل الصفحة
اضغط F5 في المتصفح

---

## ❌ إذا Backend ما اشتغل

### السبب: MongoDB مو شغال

**الحل:**
1. افتح MongoDB Compass
2. أو شغل `mongod` في terminal

---

## 🎯 بعد ما يشتغل Backend

### أضف بيانات (مرة واحدة):
```bash
cd backend
npm run add:products
npm run init:homepage
```

### أعد تحميل الصفحة:
```
http://localhost:3000
```

---

**هذا كل شيء!** 🎉
