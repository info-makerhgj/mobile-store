import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function initStoreSettings() {
  console.log('🔧 تهيئة إعدادات المتجر...\n');

  try {
    // إعدادات الضريبة (15% - ضريبة القيمة المضافة في السعودية)
    await prisma.storeSettings.upsert({
      where: { key: 'tax_rate' },
      update: {
        value: {
          rate: 0.15,
          enabled: true,
        },
      },
      create: {
        key: 'tax_rate',
        value: {
          rate: 0.15,
          enabled: true,
        },
      },
    });
    console.log('✅ تم تفعيل الضريبة: 15%');

    // إعدادات الشحن المجاني
    await prisma.storeSettings.upsert({
      where: { key: 'free_shipping_threshold' },
      update: {
        value: {
          amount: 500,
          enabled: true,
        },
      },
      create: {
        key: 'free_shipping_threshold',
        value: {
          amount: 500,
          enabled: true,
        },
      },
    });
    console.log('✅ تم تفعيل الشحن المجاني: للطلبات أكثر من 500 ريال');

    console.log('\n✅ تم تهيئة إعدادات المتجر بنجاح!\n');
    console.log('📋 الإعدادات الحالية:');
    console.log('   - الضريبة: 15% (مفعلة)');
    console.log('   - الشحن المجاني: 500 ريال وأكثر\n');
    console.log('💡 يمكنك تعديل هذه الإعدادات من:');
    console.log('   http://localhost:3000/admin/settings/general\n');

  } catch (error) {
    console.error('❌ خطأ في تهيئة الإعدادات:', error);
  } finally {
    await prisma.$disconnect();
  }
}

initStoreSettings();
