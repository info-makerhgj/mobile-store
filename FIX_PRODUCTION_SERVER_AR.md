# 🔧 إصلاح مشكلة تسجيل الدخول على السيرفر الحقيقي

## المشكلة
اسم قاعدة البيانات في `.env` كان `mobile-store` (بشرطة) لكن المستخدمين موجودين في `mobile_store` (بـ underscore)

---

## ✅ الحل - خطوة بخطوة

### الخطوة 1: الاتصال بالسيرفر

```bash
ssh -i "your-key.pem" ubuntu@your-server-ip
```

### الخطوة 2: الذهاب لمجلد Backend

```bash
cd ~/backend
# أو المسار الصحيح حسب تنصيبك
```

### الخطوة 3: تعديل ملف .env

```bash
nano .env
```

**ابحث عن السطر:**
```env
DATABASE_URL="mongodb://localhost:27017/mobile-store"
```

**غيره إلى:**
```env
DATABASE_URL="mongodb://localhost:27017/mobile_store"
```

**احفظ:** اضغط `Ctrl+X` ثم `Y` ثم `Enter`

### الخطوة 4: إنشاء مستخدم Admin

```bash
node << 'EOF'
const { MongoClient } = require('mongodb');
const bcrypt = require('bcryptjs');

const mongoUrl = 'mongodb://localhost:27017/mobile_store';

async function createAdmin() {
  const client = new MongoClient(mongoUrl);
  
  try {
    await client.connect();
    console.log('✅ متصل بـ MongoDB');
    
    const db = client.db();
    const usersCollection = db.collection('User');
    
    const existingAdmin = await usersCollection.findOne({ email: 'admin@ab-tw.com' });
    
    if (existingAdmin) {
      console.log('⚠️  المستخدم موجود بالفعل');
      await client.close();
      return;
    }
    
    const hashedPassword = await bcrypt.hash('123456', 10);
    
    const adminUser = {
      email: 'admin@ab-tw.com',
      password: hashedPassword,
      name: 'المدير',
      phone: null,
      role: 'ADMIN',
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    await usersCollection.insertOne(adminUser);
    
    console.log('✅ تم إنشاء مستخدم admin بنجاح!');
    console.log('📧 البريد: admin@ab-tw.com');
    console.log('🔑 الباسورد: 123456');
    
  } catch (error) {
    console.error('❌ خطأ:', error.message);
  } finally {
    await client.close();
  }
}

createAdmin();
EOF
```

### الخطوة 5: إعادة تشغيل التطبيق

```bash
pm2 restart mobile-store-api
```

أو إذا كنت تستخدم طريقة أخرى:
```bash
# إذا كنت تستخدم systemd
sudo systemctl restart mobile-store

# إذا كنت تستخدم npm مباشرة
# أوقف العملية الحالية ثم
npm start
```

### الخطوة 6: التحقق من الإصلاح

```bash
# اختبار API
curl -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@ab-tw.com","password":"123456"}'
```

يجب أن ترى:
```json
{
  "token": "eyJhbGc...",
  "user": {
    "id": "...",
    "email": "admin@ab-tw.com",
    "name": "المدير",
    "role": "ADMIN"
  }
}
```

---

## 🔍 التحقق من قاعدة البيانات

إذا أردت التأكد من المستخدمين الموجودين:

```bash
mongosh mobile_store
```

ثم:
```javascript
db.User.find({})
```

---

## 📝 ملاحظات مهمة

### 1. تغيير كلمة المرور الافتراضية

**مهم جداً:** بعد تسجيل الدخول، غير كلمة المرور من `123456` إلى شيء أقوى!

### 2. إذا كان عندك مستخدمين في mobile-store

إذا كان عندك مستخدمين موجودين في قاعدة بيانات `mobile-store` (بشرطة)، انقلهم:

```bash
mongosh
```

```javascript
// الاتصال بقاعدة البيانات القديمة
use mobile-store

// تصدير المستخدمين
var users = db.User.find().toArray()

// الاتصال بقاعدة البيانات الجديدة
use mobile_store

// استيراد المستخدمين
db.User.insertMany(users)
```

### 3. تحديث Frontend

تأكد أن Frontend يتصل بالـ API الصحيح:

في Vercel، تأكد من Environment Variable:
```
NEXT_PUBLIC_API_URL=http://your-server-ip:4000
```

أو إذا كنت تستخدم domain:
```
NEXT_PUBLIC_API_URL=https://api.yourdomain.com
```

---

## 🚨 استكشاف الأخطاء

### المشكلة: لا يزال تسجيل الدخول لا يعمل

```bash
# 1. تحقق من اللوجات
pm2 logs mobile-store-api

# 2. تحقق من MongoDB
sudo systemctl status mongod

# 3. تحقق من ملف .env
cat .env | grep DATABASE_URL

# 4. اختبر الاتصال بقاعدة البيانات
node -e "const {MongoClient} = require('mongodb'); const client = new MongoClient('mongodb://localhost:27017/mobile_store'); client.connect().then(() => {console.log('✅ متصل'); client.close();}).catch(err => console.error('❌', err.message));"
```

### المشكلة: Cannot find module 'bcryptjs'

```bash
cd ~/backend
npm install
pm2 restart mobile-store-api
```

---

## 📋 بيانات الدخول النهائية

بعد تطبيق الإصلاح:

- **📧 البريد الإلكتروني:** `admin@ab-tw.com`
- **🔑 كلمة المرور:** `123456`
- **👤 الصلاحية:** ADMIN

**⚠️ تذكر:** غير كلمة المرور بعد أول تسجيل دخول!

---

## ✅ الخلاصة

المشكلة كانت بسيطة - فقط اختلاف في اسم قاعدة البيانات:
- ❌ `mobile-store` (خطأ)
- ✅ `mobile_store` (صحيح)

بعد التعديل وإعادة التشغيل، كل شيء يجب أن يعمل بشكل صحيح.
