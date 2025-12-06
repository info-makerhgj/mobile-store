// 🚀 إنشاء مستخدم admin في MongoDB Atlas
const { MongoClient } = require('mongodb');
const bcrypt = require('bcryptjs');

// استخدم الرابط من ملف .env
const mongoUrl = process.env.DATABASE_URL || 'mongodb+srv://atw03817_db_user:jP9AouAfbaifknI4@mobile-store-cluster.cylotee.mongodb.net/mobile_store?retryWrites=true&w=majority&appName=mobile-store-cluster';

async function createAdmin() {
  const client = new MongoClient(mongoUrl);
  
  try {
    console.log('🔌 الاتصال بـ MongoDB Atlas...');
    
    await client.connect();
    console.log('✅ متصل بنجاح!\n');
    
    const db = client.db('mobile_store');
    const usersCollection = db.collection('User');
    
    // التحقق من وجود admin
    const existingAdmin = await usersCollection.findOne({ email: 'admin@ab-tw.com' });
    
    if (existingAdmin) {
      console.log('⚠️  مستخدم admin موجود بالفعل!');
      console.log('📧 البريد:', existingAdmin.email);
      console.log('👤 الاسم:', existingAdmin.name);
      console.log('🔑 الصلاحية:', existingAdmin.role);
      console.log('\n❓ هل تريد إعادة تعيين كلمة المرور؟');
      console.log('   إذا نعم، شغل: node reset-admin-password.js\n');
      return;
    }
    
    // إنشاء admin جديد
    console.log('👤 إنشاء مستخدم admin جديد...\n');
    
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
    
    console.log('✅ تم إنشاء مستخدم admin بنجاح!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📧 البريد الإلكتروني: admin@ab-tw.com');
    console.log('🔑 كلمة المرور: 123456');
    console.log('👤 الصلاحية: ADMIN');
    console.log('🆔 ID:', result.insertedId.toString());
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('\n⚠️  تذكر: غير كلمة المرور بعد أول تسجيل دخول!');
    console.log('\n📝 الخطوة التالية: أعد تشغيل السيرفر');
    console.log('   pm2 restart mobile-store-api\n');
    
  } catch (error) {
    console.error('\n❌ حدث خطأ:', error.message);
    
    if (error.message.includes('authentication')) {
      console.error('\n💡 تأكد من:');
      console.error('   1. اسم المستخدم وكلمة المرور صحيحة في DATABASE_URL');
      console.error('   2. المستخدم له صلاحيات الكتابة على قاعدة البيانات');
    } else if (error.message.includes('network')) {
      console.error('\n💡 تأكد من:');
      console.error('   1. الاتصال بالإنترنت يعمل');
      console.error('   2. IP السيرفر مسموح في MongoDB Atlas Network Access');
    }
    
  } finally {
    await client.close();
  }
}

console.log('🚀 بدء إنشاء مستخدم Admin في Atlas...\n');
createAdmin();
