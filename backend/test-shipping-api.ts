import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();

const mongoUrl = process.env.DATABASE_URL || 'mongodb://localhost:27017/abaad_store';

/**
 * اختبار سريع لنظام الشحن
 */
async function testShippingAPI() {
  console.log('🔍 اختبار نظام الشحن...\n');

  const client = new MongoClient(mongoUrl);

  try {
    await client.connect();
    const db = client.db();

    // 1. التحقق من الشركات
    console.log('1️⃣ التحقق من شركات الشحن:');
    const providersCount = await db.collection('shipping_providers').countDocuments();
    console.log(`   عدد الشركات: ${providersCount}`);
    
    if (providersCount === 0) {
      console.log('   ❌ لا توجد شركات شحن!');
      console.log('   💡 شغّل: SETUP_SHIPPING.bat\n');
      return;
    }

    const providers = await db.collection('shipping_providers').find().toArray();
    console.log('   ✅ الشركات الموجودة:');
    providers.forEach((p: any) => {
      console.log(`      - ${p.displayName} (${p.name}) - ${p.enabled ? '✅ مفعل' : '⭕ معطل'}`);
    });
    console.log();

    // 2. التحقق من الأسعار
    console.log('2️⃣ التحقق من أسعار الشحن:');
    const ratesCount = await db.collection('shipping_rates').countDocuments();
    console.log(`   عدد الأسعار: ${ratesCount}`);
    
    if (ratesCount === 0) {
      console.log('   ❌ لا توجد أسعار شحن!');
      console.log('   💡 شغّل: SETUP_SHIPPING.bat\n');
      return;
    }

    // عرض أسعار الرياض كمثال
    const riyadhRates = await db.collection('shipping_rates')
      .find({ city: 'الرياض' })
      .toArray();
    
    console.log('   ✅ أسعار الشحن للرياض:');
    for (const rate of riyadhRates) {
      const provider = providers.find((p: any) => p._id.toString() === rate.providerId.toString());
      if (provider) {
        console.log(`      - ${provider.displayName}: ${rate.price} ريال (${rate.estimatedDays} يوم)`);
      }
    }
    console.log();

    // 3. التحقق من الشركات المفعلة
    console.log('3️⃣ الشركات المفعلة:');
    const enabledProviders = await db.collection('shipping_providers')
      .find({ enabled: true })
      .toArray();
    
    if (enabledProviders.length === 0) {
      console.log('   ⚠️  لا توجد شركات مفعلة!');
      console.log('   💡 فعّل شركة من: http://localhost:3000/admin/settings/shipping\n');
    } else {
      console.log(`   ✅ عدد الشركات المفعلة: ${enabledProviders.length}`);
      enabledProviders.forEach((p: any) => {
        console.log(`      - ${p.displayName} (${p.testMode ? '🧪 تجريبي' : '🚀 حقيقي'})`);
      });
      console.log();
    }

    // 4. اختبار API
    console.log('4️⃣ اختبار API:');
    console.log('   جرب هذه الروابط:');
    console.log('   - http://localhost:4000/api/shipping/providers/enabled');
    console.log('   - http://localhost:4000/api/shipping/rates?city=الرياض');
    console.log();

    // 5. الخلاصة
    console.log('='.repeat(60));
    if (providersCount > 0 && ratesCount > 0) {
      if (enabledProviders.length > 0) {
        console.log('✅ نظام الشحن جاهز تماماً!');
        console.log('   يمكنك الآن إنشاء طلبات مع شحن');
      } else {
        console.log('⚠️  نظام الشحن جاهز لكن لا توجد شركات مفعلة');
        console.log('   فعّل شركة من لوحة التحكم');
      }
    } else {
      console.log('❌ نظام الشحن غير جاهز');
      console.log('   شغّل: SETUP_SHIPPING.bat');
    }
    console.log('='.repeat(60));

  } catch (error) {
    console.error('❌ خطأ:', error);
  } finally {
    await client.close();
  }
}

testShippingAPI();
