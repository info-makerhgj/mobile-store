const { MongoClient } = require('mongodb');

const url = 'mongodb://localhost:27017';
const dbName = 'abaad_store';

async function main() {
  console.log('🌱 إضافة بيانات تجريبية مباشرة...\n');

  const client = new MongoClient(url);

  try {
    await client.connect();
    console.log('✅ متصل بـ MongoDB\n');

    const db = client.db(dbName);

    // إنشاء شحنة 1
    console.log('📦 إنشاء شحنة 1: Note 16 - Starry Blue');
    const shipment1 = await db.collection('factory_shipments').insertOne({
      shipmentCode: `SH-${Date.now()}-001`,
      model: 'Note 16',
      color: 'Starry Blue',
      totalQuantity: 30,
      weight: 13.53,
      factoryBoxNo: 'HB20250508DB048',
      notes: 'شحنة من المصنع - دفعة ديسمبر 2025',
      receivedDate: new Date(),
      createdAt: new Date(),
      updatedAt: new Date()
    });
    console.log(`✅ تم إنشاء الشحنة: ${shipment1.insertedId}\n`);

    // إنشاء 30 جهاز
    console.log('📱 إنشاء 30 جهاز...');
    const devices1 = [];
    for (let i = 1; i <= 30; i++) {
      devices1.push({
        shipmentId: shipment1.insertedId.toString(),
        imei1: `35080912${String(i).padStart(7, '0')}`,
        imei2: `35080913${String(i).padStart(7, '0')}`,
        serialNo: `SN001${String(i).padStart(5, '0')}`,
        status: 'IN_STOCK',
        createdAt: new Date(),
        updatedAt: new Date()
      });
    }
    await db.collection('devices').insertMany(devices1);
    console.log('✅ تم إنشاء 30 جهاز\n');

    // إنشاء شحنة 2
    console.log('📦 إنشاء شحنة 2: Note 16 - Midnight Black');
    const shipment2 = await db.collection('factory_shipments').insertOne({
      shipmentCode: `SH-${Date.now()}-002`,
      model: 'Note 16',
      color: 'Midnight Black',
      totalQuantity: 25,
      weight: 13.50,
      factoryBoxNo: 'HB20250508DB049',
      notes: 'شحنة من المصنع - دفعة ديسمبر 2025',
      receivedDate: new Date(),
      createdAt: new Date(),
      updatedAt: new Date()
    });
    console.log(`✅ تم إنشاء الشحنة: ${shipment2.insertedId}\n`);

    // إنشاء 25 جهاز
    console.log('📱 إنشاء 25 جهاز...');
    const devices2 = [];
    for (let i = 1; i <= 25; i++) {
      devices2.push({
        shipmentId: shipment2.insertedId.toString(),
        imei1: `35080914${String(i).padStart(7, '0')}`,
        imei2: `35080915${String(i).padStart(7, '0')}`,
        serialNo: `SN002${String(i).padStart(5, '0')}`,
        status: 'IN_STOCK',
        createdAt: new Date(),
        updatedAt: new Date()
      });
    }
    await db.collection('devices').insertMany(devices2);
    console.log('✅ تم إنشاء 25 جهاز\n');

    // إنشاء مجموعة 1
    console.log('👥 إنشاء مجموعة 1...');
    const groupCode1 = `GRP-${Date.now()}-001`;
    const group1 = await db.collection('distribution_groups').insertOne({
      groupCode: groupCode1,
      shipmentId: shipment1.insertedId.toString(),
      clientName: 'محل الجوالات الذهبي',
      clientPhone: '0501234567',
      model: 'Note 16',
      color: 'Starry Blue',
      quantity: 10,
      qrCode: `http://localhost:3000/verify/${groupCode1}`,
      labelPrinted: false,
      notes: 'طلب العميل الأول',
      createdAt: new Date(),
      updatedAt: new Date()
    });

    // تحديث 10 أجهزة للمجموعة 1
    await db.collection('devices').updateMany(
      { 
        shipmentId: shipment1.insertedId.toString(),
        status: 'IN_STOCK'
      },
      { 
        $set: { 
          status: 'ASSIGNED',
          groupId: group1.insertedId.toString(),
          updatedAt: new Date()
        }
      },
      { limit: 10 }
    );
    console.log(`✅ مجموعة 1: محل الجوالات الذهبي - 10 أجهزة\n`);

    // الإحصائيات
    const stats = {
      shipments: await db.collection('factory_shipments').countDocuments(),
      devices: await db.collection('devices').countDocuments(),
      groups: await db.collection('distribution_groups').countDocuments(),
      available: await db.collection('devices').countDocuments({ status: 'IN_STOCK' }),
      assigned: await db.collection('devices').countDocuments({ status: 'ASSIGNED' })
    };

    console.log('📊 الإحصائيات:');
    console.log(`   ✅ الشحنات: ${stats.shipments}`);
    console.log(`   ✅ الأجهزة: ${stats.devices}`);
    console.log(`   ✅ المجموعات: ${stats.groups}`);
    console.log(`   ✅ المتاح: ${stats.available}`);
    console.log(`   ✅ المخصص: ${stats.assigned}\n`);

    console.log('🎉 تم إنشاء البيانات بنجاح!');
    console.log('\n🔗 افتح: http://localhost:3000/admin/distribution');

  } catch (error) {
    console.error('❌ خطأ:', error);
  } finally {
    await client.close();
  }
}

main();
