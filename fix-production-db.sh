#!/bin/bash

# 🔧 سكريبت لإصلاح مشكلة قاعدة البيانات على السيرفر الحقيقي

echo "🔧 إصلاح مشكلة قاعدة البيانات..."

# 1. تعديل ملف .env
echo "📝 تعديل ملف .env..."
cd ~/backend  # أو المسار الصحيح للـ backend

# استبدال mobile-store بـ mobile_store في DATABASE_URL
sed -i 's/mobile-store/mobile_store/g' .env

echo "✅ تم تعديل ملف .env"

# 2. إنشاء مستخدم admin في قاعدة البيانات الصحيحة
echo "👤 إنشاء مستخدم admin..."

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
    
    // التحقق من وجود admin
    const existingAdmin = await usersCollection.findOne({ email: 'admin@ab-tw.com' });
    
    if (existingAdmin) {
      console.log('⚠️  المستخدم موجود بالفعل');
      return;
    }
    
    // إنشاء admin
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

# 3. إعادة تشغيل التطبيق
echo "🔄 إعادة تشغيل التطبيق..."
pm2 restart mobile-store-api

echo "✅ تم الإصلاح بنجاح!"
echo ""
echo "📋 بيانات الدخول:"
echo "   📧 البريد: admin@ab-tw.com"
echo "   🔑 الباسورد: 123456"
