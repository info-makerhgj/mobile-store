import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function initShipping() {
  console.log('🚀 تهيئة نظام الشحن...\n');

  try {
    // حذف البيانات القديمة (بدون transactions)
    try {
      await prisma.shippingRate.deleteMany({});
    } catch (e) {
      console.log('تخطي حذف shippingRate');
    }
    try {
      await prisma.shipment.deleteMany({});
    } catch (e) {
      console.log('تخطي حذف shipment');
    }
    try {
      await prisma.shippingProvider.deleteMany({});
    } catch (e) {
      console.log('تخطي حذف shippingProvider');
    }

    // إنشاء مزودي الشحن
    const smsa = await prisma.shippingProvider.create({
      data: {
        name: 'smsa',
        displayName: 'سمسا',
        enabled: true,
        testMode: true,
        apiKey: '',
        apiSecret: '',
        apiUrl: 'https://track.smsaexpress.com/api',
      },
    });

    const redbox = await prisma.shippingProvider.create({
      data: {
        name: 'redbox',
        displayName: 'ريدبكس',
        enabled: true,
        testMode: true,
        apiKey: '',
        apiSecret: '',
        apiUrl: 'https://api.redboxsa.com/v1',
      },
    });

    const aramex = await prisma.shippingProvider.create({
      data: {
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
      },
    });

    console.log('✅ تم إنشاء مزودي الشحن:\n');
    console.log(`   - سمسا (SMSA): ${smsa.id}`);
    console.log(`   - ريدبكس (Redbox): ${redbox.id}`);
    console.log(`   - أرامكس (Aramex): ${aramex.id}\n`);

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
      await prisma.shippingRate.create({
        data: {
          providerId: smsa.id,
          city: city.name,
          price: city.smsa,
          estimatedDays: city.name === 'الرياض' ? 1 : 2,
        },
      });

      // ريدبكس
      await prisma.shippingRate.create({
        data: {
          providerId: redbox.id,
          city: city.name,
          price: city.redbox,
          estimatedDays: city.name === 'جدة' || city.name === 'مكة' ? 1 : 2,
        },
      });

      // أرامكس
      await prisma.shippingRate.create({
        data: {
          providerId: aramex.id,
          city: city.name,
          price: city.aramex,
          estimatedDays: city.name === 'الدمام' || city.name === 'الخبر' ? 1 : 3,
        },
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
    await prisma.$disconnect();
  }
}

initShipping();
