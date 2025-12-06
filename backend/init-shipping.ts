import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();

const MONGODB_URI = process.env.DATABASE_URL || 'mongodb://localhost:27017/mobile_store';

// شركات الشحن
const shippingProviders = [
  {
    name: 'smsa',
    nameAr: 'سمسا',
    nameEn: 'SMSA',
    enabled: true,
    defaultPrice: 25,
    defaultDays: 3,
    logo: '🚚',
    description: 'شحن سريع وموثوق',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    name: 'aramex',
    nameAr: 'أرامكس',
    nameEn: 'Aramex',
    enabled: true,
    defaultPrice: 30,
    defaultDays: 4,
    logo: '📦',
    description: 'شحن دولي ومحلي',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    name: 'redbox',
    nameAr: 'ريدبوكس',
    nameEn: 'Redbox',
    enabled: true,
    defaultPrice: 20,
    defaultDays: 2,
    logo: '🎁',
    description: 'توصيل سريع',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

// المدن السعودية
const saudiCities = [
  'الرياض',
  'جدة',
  'مكة المكرمة',
  'المدينة المنورة',
  'الدمام',
  'الخبر',
  'الظهران',
  'الطائف',
  'تبوك',
  'بريدة',
  'خميس مشيط',
  'حائل',
  'نجران',
  'جازان',
  'ينبع',
  'الأحساء',
  'القطيف',
  'الجبيل',
  'أبها',
  'عرعر',
];

async function initShipping() {
  const client = new MongoClient(MONGODB_URI);

  try {
    console.log('🔄 الاتصال بقاعدة البيانات...\n');
    await client.connect();
    const db = client.db();

    // إضافة شركات الشحن
    console.log('🚚 إضافة شركات الشحن...\n');
    
    for (const provider of shippingProviders) {
      const existing = await db.collection('shipping_providers').findOne({ name: provider.name });
      
      if (existing) {
        console.log(`⏭️  شركة "${provider.nameAr}" موجودة بالفعل`);
      } else {
        const result = await db.collection('shipping_providers').insertOne(provider);
        console.log(`✅ تم إضافة شركة: ${provider.nameAr} - ${provider.defaultPrice} ريال`);
        
        // إضافة أسعار الشحن لكل مدينة
        const rates = saudiCities.map(city => ({
          providerId: result.insertedId,
          providerName: provider.name,
          city,
          price: provider.defaultPrice,
          estimatedDays: provider.defaultDays,
          enabled: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        }));
        
        await db.collection('shipping_rates').insertMany(rates);
        console.log(`   ✅ تم إضافة ${rates.length} سعر شحن لجميع المدن`);
      }
    }

    console.log('\n✅ تم تفعيل نظام الشحن بنجاح!');
    
    // عرض الإحصائيات
    const providersCount = await db.collection('shipping_providers').countDocuments();
    const ratesCount = await db.collection('shipping_rates').countDocuments();
    
    console.log('\n📊 الإحصائيات:');
    console.log(`   - عدد شركات الشحن: ${providersCount}`);
    console.log(`   - عدد أسعار الشحن: ${ratesCount}`);
    console.log(`   - عدد المدن المدعومة: ${saudiCities.length}`);
    
    console.log('\n🌐 يمكنك الآن:');
    console.log('   - إتمام الطلبات مع اختيار شركة الشحن');
    console.log('   - إدارة شركات الشحن من: http://localhost:3000/admin/settings/shipping');
    console.log('   - اختبار API: http://localhost:5000/api/shipping/providers/enabled');

  } catch (error) {
    console.error('❌ خطأ:', error);
  } finally {
    await client.close();
  }
}

initShipping();
