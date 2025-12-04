# ✅ فحص النظام

## خطوات الفحص السريع

### 1. تحقق من MongoDB
```bash
# في terminal
mongosh

# أو
mongo
```

إذا اشتغل، MongoDB شغال ✅

---

### 2. تحقق من Backend
```bash
cd backend
npm run dev
```

**يجب أن تشوف:**
```
✅ Connected to MongoDB
🚀 Server running on port 5000
```

**اختبار في المتصفح:**
```
http://localhost:5000/api/products
```

---

### 3. تحقق من Frontend
```bash
cd frontend
npm run dev
```

**يجب أن تشوف:**
```
✓ Ready in Xms
○ Local: http://localhost:3000
```

---

### 4. تحقق من البيانات
```bash
cd backend
npm run test:homepage
```

**يجب أن تشوف:**
```
✅ Connected to MongoDB
📦 Checking products...
   Found X products
🏠 Checking homepage config...
   Found X sections
```

---

## 🚀 التشغيل الكامل

### الطريقة الصحيحة:

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend  
npm run dev
```

**Terminal 3 - إضافة بيانات (مرة واحدة):**
```bash
cd backend
npm run add:products
npm run init:homepage
```

---

## 📊 النتيجة المتوقعة

### في http://localhost:3000
- ✅ بنر رئيسي (3 شرائح)
- ✅ فئات المنتجات (6 فئات)
- ✅ أحدث المنتجات (6 منتجات)
- ✅ بنر إعلاني
- ✅ الأكثر مبيعاً (6 منتجات)
- ✅ شبكة صور (3 صور)
- ✅ عن متجرنا (نص)

### في http://localhost:3000/admin/homepage-builder
- ✅ قائمة بـ 7 أقسام
- ✅ أزرار التحكم تعمل
- ✅ معاينة مباشرة

---

تم الإنشاء: نوفمبر 2024
