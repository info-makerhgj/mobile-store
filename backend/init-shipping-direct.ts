import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();

const mongoUrl = process.env.DATABASE_URL || 'mongodb://localhost:27017/abaad_store';

async function initShipping() {
  console.log('🚀 تهيئة نظام الشحن...\n');

  const client = new MongoClient(mongoUrl);

  try {
    await client.connect();
    const db = client.db();

    // حذف البيانات القديمة
    await db.collection('shipping_rates').deleteMany({});
    await db.collection('shipments').deleteMany({});
    await db.collection('shipping_providers').deleteMany({});

    // إنشاء مزودي الشحن
    const smsa = await db.collection('shipping_providers').insertOne({
      name: 'smsa',
      displayName: 'سمسا',
      enabled: true,
      testMode: true,
      apiKey: '',
      apiSecret: '',
      apiUrl: 'https://track.smsaexpress.com/api',
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const redbox = await db.collection('shipping_providers').insertOne({
      name: 'redbox',
      displayName: 'ريدبكس',
      enabled: true,
      testMode: true,
      apiKey: '',
      apiSecret: '',
      apiUrl: 'https://api.redboxsa.com/v1',
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const aramex = await db.collection('shipping_providers').insertOne({
      name: 'aramex',
      displayName: 'أرامكس',
      enabled: true,
      testMode: true,
      apiKey: '',
      apiSecret: '',
      apiUrl: 'https://ws.aramex.net/ShippingAPI.V2/Shipping/Service_1_0.svc/json',
      settings: {
        accountNumber: '',
      },
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    console.log('✅ تم إنشاء مزودي الشحن:\n');
    console.log(`   - سمسا (SMSA): ${smsa.insertedId}`);
    console.log(`   - ريدبكس (Redbox): ${redbox.insertedId}`);
    console.log(`   - أرامكس (Aramex): ${aramex.insertedId}\n`);

    // إنشاء أسعار الشحن للمدن الرئيسية
    const cities = [
      { name: 'الرياض', smsa: 15, redbox: 18, aramex: 20 },
      { name: 'جدة', smsa: 20, redbox: 15, aramex: 25 },
      { name: 'الدمام', smsa: 20, redbox: 22, aramex: 18 },
      { name: 'مكة', smsa: 20, redbox: 15, aramex: 25 },
      { name: 'المدينة', smsa: 25, redbox: 20, aramex: 28 },
      { name: 'الخبر', smsa: 20, redbox: 22, aramex: 18 },
      { name: 'الطائف', smsa: 22, redbox: 18, aramex: 26 },
      { name: 'تبوك', smsa: 30, redbox: 28, aramex: 32 },
      { name: 'أبها', smsa: 28, redbox: 26, aramex: 30 },
      { name: 'حائل', smsa: 28, redbox: 26, aramex: 30 },
    ];

    console.log('✅ إنشاء أسعار الشحن للمدن:\n');

    for (const city of cities) {
      // سمسا
      await db.collection('shipping_rates').insertOne({
        providerId: smsa.insertedId,
        city: city.name,
        price: city.smsa,
        estimatedDays: city.name === 'الرياض' ? 1 : 2,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      // ريدبكس
      await db.collection('shipping_rates').insertOne({
        providerId: redbox.insertedId,
        city: city.name,
        price: city.redbox,
        estimatedDays: city.name === 'جدة' || city.name === 'مكة' ? 1 : 2,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      // أرامكس
      await db.collection('shipping_rates').insertOne({
        providerId: aramex.insertedId,
        city: city.name,
        price: city.aramex,
        estimatedDays: city.name === 'الدمام' || city.name === 'الخبر' ? 1 : 3,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      console.log(`   ✓ ${city.name}: سمسا ${city.smsa} ريال | ريدبكس ${city.redbox} ريال | أرامكس ${city.aramex} ريال`);
    }

    console.log('\n✅ تم تهيئة نظام الشحن بنجاح!\n');
    console.log('📋 الخطوات التالية:\n');
    console.log('1. افتح لوحة الإدارة: http://localhost:3000/admin/settings/shipping');
    console.log('2. فعّل شركات الشحن المطلوبة');
    console.log('3. أدخل مفاتيح API الحقيقية (أو استخدم الوضع التجريبي)');
    console.log('4. اختبر الشحن من صفحة الطلبات\n');

  } catch (error) {
    console.error('❌ خطأ في تهيئة نظام الشحن:', error);
  } finally {
    await client.close();
  }
}

initShipping();
