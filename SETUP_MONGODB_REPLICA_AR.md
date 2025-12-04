# 🔧 تفعيل MongoDB Replica Set

## المشكلة
Prisma يحتاج MongoDB Replica Set لاستخدام transactions.

## ✅ الحل السريع (Windows)

### 1️⃣ أوقف MongoDB الحالي
```bash
net stop MongoDB
```

### 2️⃣ شغل MongoDB كـ Replica Set
```bash
mongod --replSet rs0 --port 27017 --dbpath "C:\data\db"
```

### 3️⃣ في terminal جديد، شغل mongo shell:
```bash
mongosh
```

### 4️⃣ في mongo shell، فعّل الـ Replica Set:
```javascript
rs.initiate()
```

### 5️⃣ تحقق من الحالة:
```javascript
rs.status()
```

المفروض تشوف: `"ok" : 1`

---

## ✅ الحل البديل (بدون Replica Set)

إذا ما تبغى تفعل Replica Set، يمكنك تعديل الكود ليشتغل بدون transactions.

### تعديل DATABASE_URL في `.env`:
```env
DATABASE_URL="mongodb://localhost:27017/abaad_store?directConnection=true"
```

لكن هذا الحل مؤقت وقد يسبب مشاكل في المستقبل.

---

## 🚀 بعد التفعيل

1. أعد تشغيل Backend:
```bash
cd backend
npm run dev
```

2. جرب إضافة شحنة من الواجهة

---

## 📝 ملاحظة

Replica Set مطلوب فقط للتطوير المحلي. في الإنتاج (MongoDB Atlas)، Replica Set مفعل تلقائياً.
