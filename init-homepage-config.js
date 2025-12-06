// 🏠 إنشاء تكوين الصفحة الرئيسية الافتراضي
const { MongoClient } = require('mongodb');

const mongoUrl = process.env.DATABASE_URL || 'mongodb://localhost:27017/mobile_store';

async function initHomepageConfig() {
  const client = new MongoClient(mongoUrl);
  
  try {
    console.log('🔌 الاتصال بـ MongoDB...');
    await client.connect();
    console.log('✅ متصل بنجاح!\n');
    
    const db = client.db();
    const homepageCollection = db.collection('HomepageConfig');
    
    // التحقق من وجود تكوين
    const existing = await homepageCollection.findOne({ active: true });
    
    if (existing) {
      console.log('⚠️  تكوين الصفحة الرئيسية موجود بالفعل');
      return;
    }
    
    // إنشاء تكوين افتراضي
    const defaultConfig = {
      active: true,
      sections: [
        {
          id: 'hero-banner',
          type: 'hero',
          title: 'مرحباً بك في متجرنا',
          subtitle: 'أفضل العروض والمنتجات',
          isVisible: true,
          order: 1,
        },
        {
          id: 'featured-products',
          type: 'products',
          title: 'المنتجات المميزة',
          isVisible: true,
          order: 2,
        },
        {
          id: 'exclusive-offers',
          type: 'offers',
          title: 'العروض الحصرية',
          isVisible: true,
          order: 3,
        },
      ],
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    await homepageCollection.insertOne(defaultConfig);
    
    console.log('✅ تم إنشاء تكوين الصفحة الرئيسية بنجاح!');
    
  } catch (error) {
    console.error('❌ خطأ:', error.message);
  } finally {
    await client.close();
  }
}

console.log('🚀 تهيئة الصفحة الرئيسية...\n');
initHomepageConfig();
