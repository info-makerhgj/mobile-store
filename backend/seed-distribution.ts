import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 إضافة بيانات تجريبية لنظام التوزيع...\n')

  try {
    console.log('📝 ملاحظة: سيتم إضافة البيانات الجديدة بجانب البيانات الموجودة\n')

    // إنشاء 3 شحنات
    const shipments = []
    
    // شحنة 1: Note 16 - Starry Blue
    console.log('📦 إنشاء شحنة 1: Note 16 - Starry Blue')
    const shipment1 = await prisma.factoryShipment.create({
      data: {
        shipmentCode: `SH-${Date.now()}-001`,
        model: 'Note 16',
        color: 'Starry Blue',
        totalQuantity: 30,
        weight: 13.53,
        factoryBoxNo: 'HB20250508DB048',
        notes: 'شحنة من المصنع - دفعة ديسمبر 2025'
      }
    })
    shipments.push(shipment1)
    
    // إنشاء 30 جهاز للشحنة 1
    for (let i = 1; i <= 30; i++) {
      await prisma.device.create({
        data: {
          shipmentId: shipment1.id,
          imei1: `35080912${String(i).padStart(7, '0')}`,
          imei2: `35080913${String(i).padStart(7, '0')}`,
          serialNo: `SN001${String(i).padStart(5, '0')}`,
          status: 'IN_STOCK'
        }
      })
    }
    console.log(`✅ تم إنشاء 30 جهاز للشحنة 1\n`)

    // شحنة 2: Note 16 - Midnight Black
    console.log('📦 إنشاء شحنة 2: Note 16 - Midnight Black')
    const shipment2 = await prisma.factoryShipment.create({
      data: {
        shipmentCode: `SH-${Date.now()}-002`,
        model: 'Note 16',
        color: 'Midnight Black',
        totalQuantity: 25,
        weight: 13.50,
        factoryBoxNo: 'HB20250508DB049',
        notes: 'شحنة من المصنع - دفعة ديسمبر 2025'
      }
    })
    shipments.push(shipment2)
    
    // إنشاء 25 جهاز للشحنة 2
    for (let i = 1; i <= 25; i++) {
      await prisma.device.create({
        data: {
          shipmentId: shipment2.id,
          imei1: `35080914${String(i).padStart(7, '0')}`,
          imei2: `35080915${String(i).padStart(7, '0')}`,
          serialNo: `SN002${String(i).padStart(5, '0')}`,
          status: 'IN_STOCK'
        }
      })
    }
    console.log(`✅ تم إنشاء 25 جهاز للشحنة 2\n`)

    // شحنة 3: Note 16 Pro - Aurora Green
    console.log('📦 إنشاء شحنة 3: Note 16 Pro - Aurora Green')
    const shipment3 = await prisma.factoryShipment.create({
      data: {
        shipmentCode: `SH-${Date.now()}-003`,
        model: 'Note 16 Pro',
        color: 'Aurora Green',
        totalQuantity: 20,
        weight: 14.20,
        factoryBoxNo: 'HB20250508DB050',
        notes: 'شحنة من المصنع - نسخة Pro'
      }
    })
    shipments.push(shipment3)
    
    // إنشاء 20 جهاز للشحنة 3
    for (let i = 1; i <= 20; i++) {
      await prisma.device.create({
        data: {
          shipmentId: shipment3.id,
          imei1: `35080916${String(i).padStart(7, '0')}`,
          imei2: `35080917${String(i).padStart(7, '0')}`,
          serialNo: `SN003${String(i).padStart(5, '0')}`,
          status: 'IN_STOCK'
        }
      })
    }
    console.log(`✅ تم إنشاء 20 جهاز للشحنة 3\n`)

    // إنشاء مجموعتين تجريبيتين
    console.log('👥 إنشاء مجموعات العملاء...')
    
    // مجموعة 1: 10 أجهزة من الشحنة 1
    const devices1 = await prisma.device.findMany({
      where: { shipmentId: shipment1.id, status: 'IN_STOCK' },
      take: 10
    })
    
    const groupCode1 = `GRP-${Date.now()}-001`
    const group1 = await prisma.distributionGroup.create({
      data: {
        groupCode: groupCode1,
        shipmentId: shipment1.id,
        clientName: 'محل الجوالات الذهبي',
        clientPhone: '0501234567',
        model: shipment1.model,
        color: shipment1.color,
        quantity: 10,
        notes: 'طلب العميل الأول',
        qrCode: `http://localhost:3000/verify/${groupCode1}`
      }
    })
    
    await prisma.device.updateMany({
      where: { id: { in: devices1.map(d => d.id) } },
      data: { status: 'ASSIGNED', groupId: group1.id }
    })
    console.log(`✅ مجموعة 1: ${group1.clientName} - ${group1.quantity} جهاز`)

    // مجموعة 2: 15 جهاز من الشحنة 2
    const devices2 = await prisma.device.findMany({
      where: { shipmentId: shipment2.id, status: 'IN_STOCK' },
      take: 15
    })
    
    const groupCode2 = `GRP-${Date.now()}-002`
    const group2 = await prisma.distributionGroup.create({
      data: {
        groupCode: groupCode2,
        shipmentId: shipment2.id,
        clientName: 'متجر التقنية الحديثة',
        clientPhone: '0559876543',
        model: shipment2.model,
        color: shipment2.color,
        quantity: 15,
        notes: 'طلب العميل الثاني',
        qrCode: `http://localhost:3000/verify/${groupCode2}`
      }
    })
    
    await prisma.device.updateMany({
      where: { id: { in: devices2.map(d => d.id) } },
      data: { status: 'ASSIGNED', groupId: group2.id }
    })
    console.log(`✅ مجموعة 2: ${group2.clientName} - ${group2.quantity} جهاز\n`)

    // عرض الإحصائيات
    const stats = {
      totalShipments: await prisma.factoryShipment.count(),
      totalDevices: await prisma.device.count(),
      totalGroups: await prisma.distributionGroup.count(),
      availableDevices: await prisma.device.count({ where: { status: 'IN_STOCK' } }),
      assignedDevices: await prisma.device.count({ where: { status: 'ASSIGNED' } })
    }

    console.log('📊 الإحصائيات النهائية:')
    console.log(`   ✅ إجمالي الشحنات: ${stats.totalShipments}`)
    console.log(`   ✅ إجمالي الأجهزة: ${stats.totalDevices}`)
    console.log(`   ✅ المجموعات: ${stats.totalGroups}`)
    console.log(`   ✅ الأجهزة المتاحة: ${stats.availableDevices}`)
    console.log(`   ✅ الأجهزة المخصصة: ${stats.assignedDevices}\n`)

    console.log('🎉 تم إنشاء البيانات التجريبية بنجاح!')
    console.log('\n🔗 الروابط:')
    console.log(`   - لوحة التحكم: http://localhost:3000/admin/distribution`)
    console.log(`   - التحقق من المجموعة 1: ${group1.qrCode}`)
    console.log(`   - التحقق من المجموعة 2: ${group2.qrCode}`)
  } catch (error: any) {
    console.error('❌ خطأ:', error.message)
    throw error
  }
}

main()
  .catch((e) => {
    console.error('❌ فشل:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
