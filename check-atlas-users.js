// 🔍 فحص المستخدمين في MongoDB Atlas
const { MongoClient } = require('mongodb');
const bcrypt = require('bcryptjs');

// استخدم الرابط من ملف .env
const mongoUrl = process.env.DATABASE_URL || 'mongodb+srv://atw03817_db_user:jP9AouAfbaifknI4@mobile-store-cluster.cylotee.mongodb.net/mobile_store?retryWrites=true&w=majority&appName=mobile-store-cluster';

async function checkUsers() {
  const client = new MongoClient(mongoUrl);
  
  try {
    console.log('🔌 الاتصال بـ MongoDB Atlas...');
    
    await client.connect();
    console.log('✅ متصل بنجاح!\n');
    
    const db = client.db('mobile_store');
    const usersCollection = db.collection('User');
    
    // عرض عدد المستخدمين
    const userCount = await usersCollection.countDocuments();
    console.log(`📊 عدد المستخدمين: ${userCount}\n`);
    
    if (userCount === 0) {
      console.log('⚠️  لا يوجد مستخدمين في قاعدة البيانات!');
      console.log('💡 نحتاج إنشاء مستخدم admin\n');
      return { needsAdmin: true, users: [] };
    }
    
    // عرض جميع المستخدمين
    const users = await usersCollection.find({}).toArray();
    
    console.log('👥 المستخدمين الموجودين:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    
    for (const user of users) {
      console.log(`\n📧 البريد: ${user.email}`);
      console.log(`👤 الاسم: ${user.name}`);
      console.log(`🔑 الصلاحية: ${user.role}`);
      console.log(`🆔 ID: ${user._id}`);
      
      // اختبار الباسورد
      if (user.email === 'admin@ab-tw.com') {
        const testPasswords = ['123456', 'admin123', 'Admin123'];
        console.log('🔐 اختبار كلمات المرور الشائعة...');
        
        for (const pwd of testPasswords) {
          const isMatch = await bcrypt.compare(pwd, user.password);
          if (isMatch) {
            console.log(`   ✅ الباسورد الصحيح: ${pwd}`);
            break;
          }
        }
      }
    }
    
    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    
    // البحث عن admin
    const adminUser = users.find(u => u.email === 'admin@ab-tw.com');
    
    if (!adminUser) {
      console.log('\n⚠️  لا يوجد مستخدم admin@ab-tw.com');
      console.log('💡 نحتاج إنشاء مستخدم admin\n');
      return { needsAdmin: true, users };
    }
    
    return { needsAdmin: false, users };
    
  } catch (error) {
    console.error('\n❌ خطأ في الاتصال:', error.message);
    
    if (error.message.includes('authentication')) {
      console.error('\n💡 مشكلة في اسم المستخدم أو كلمة المرور لـ MongoDB Atlas');
    } else if (error.message.includes('network')) {
      console.error('\n💡 مشكلة في الاتصال بالإنترنت أو IP غير مسموح');
    }
    
    return { error: error.message };
    
  } finally {
    await client.close();
  }
}

console.log('🚀 فحص قاعدة البيانات...\n');
checkUsers().then(result => {
  if (result.needsAdmin) {
    console.log('📝 الخطوة التالية: تشغيل create-admin-atlas.js');
  }
});
