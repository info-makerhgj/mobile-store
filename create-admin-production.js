// 🚀 سكريبت لإنشاء مستخدم admin على السيرفر الحقيقي
// استخدمه على السيرفر مباشرة

const { MongoClient } = require('mongodb');
const bcrypt = require('bcryptjs');

// غير هذا إذا كان عندك username/password لـ MongoDB
const mongoUrl = process.env.DATABASE_URL || 'mongodb://localhost:27017/mobile_store';

async function createAdmin() {
  const client = new MongoClient(mongoUrl);
  
  try {
    console.log('🔌 الاتصال بـ MongoDB...');
    console.log('📍 URL:', mongoUrl.replace(/\/\/.*:.*@/, '//***:***@')); // إخفاء الباسورد
    
    await client.connect();
    console.log('✅ متصل بـ MongoDB بنجاح');
    
    const db = client.db();
    const usersCollection = db.collection('User');
    
    // عرض عدد المستخدمين الحاليين
    const userCount = await usersCollection.countDocuments();
    console.log(`\n📊 عدد المستخدمين الحاليين: ${userCount}`);
    
    // التحقق من وجود admin
    const existingAdmin = await usersCollection.findOne({ email: 'admin@ab-tw.com' });
    
    if (existingAdmin) {
      console.log('\n⚠️  مستخدم admin موجود بالفعل!');
      console.log('📧 البريد:', existingAdmin.email);
      console.log('👤 الاسم:', existingAdmin.name);
      console.log('🔑 الصلاحية:', existingAdmin.role);
      
      // تحديث الباسورد إذا أردت
      const readline = require('readline').createInterface({
        input: process.stdin,
        output: process.stdout
      });
      
      readline.question('\n❓ هل تريد إعادة تعيين كلمة المرور؟ (yes/no): ', async (answer) => {
        if (answer.toLowerCase() === 'yes' || answer.toLowerCase() === 'y') {
          const hashedPassword = await bcrypt.hash('123456', 10);
          await usersCollection.updateOne(
            { email: 'admin@ab-tw.com' },
            { $set: { password: hashedPassword, updatedAt: new Date() } }
          );
          console.log('✅ تم إعادة تعيين كلمة المرور إلى: 123456');
        }
        readline.close();
        await client.close();
      });
      
      return;
    }
    
    // إنشاء admin جديد
    console.log('\n👤 إنشاء مستخدم admin جديد...');
    
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
    
    const result = await usersCollection.insertOne(adminUser);
    
    console.log('\n✅ تم إنشاء مستخدم admin بنجاح!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📧 البريد الإلكتروني: admin@ab-tw.com');
    console.log('🔑 كلمة المرور: 123456');
    console.log('👤 الصلاحية: ADMIN');
    console.log('🆔 ID:', result.insertedId.toString());
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('\n⚠️  تذكر: غير كلمة المرور بعد أول تسجيل دخول!');
    
  } catch (error) {
    console.error('\n❌ حدث خطأ:', error.message);
    console.error('\n💡 تأكد من:');
    console.error('   1. MongoDB يعمل: sudo systemctl status mongod');
    console.error('   2. DATABASE_URL صحيح في ملف .env');
    console.error('   3. تم تثبيت bcryptjs: npm install bcryptjs');
  } finally {
    await client.close();
  }
}

console.log('🚀 بدء إنشاء مستخدم Admin...\n');
createAdmin();
