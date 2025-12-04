import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🚀 إنشاء بيانات تجريبية لنظام التوزيع...\n')

  // إنشاء شحنة تجريبية
  const shipment = await prisma.factoryShipment.create({
    data: {
      shipmentCode: 'SH-20251203-001',
      model: 'Note 16',
      color: 'Starry Blue',
      totalQuantity: 30,
      weight: 13.53,
      factoryBoxNo: 'HB20250508DB048',
      notes: 'شحنة تجريبية من المصنع'
    }
  })

  // إنشاء الأجهزة
  const devices = []
  for (let i = 0; i < 30; i++) {
    const device = await prisma.device.create({
      data: {
        shipmentId: shipment.id,
        imei1: `35080912${String(i + 1).padStart(7, '0')}`,
        imei2: `35080913${String(i + 1).padStart(7, '0')}`,
        serialNo: `SN${String(i + 1).padStart(8, '0')}`,
        status: 'IN_STOCK'
      }
    })
    devices.push(device)
  }

  console.log(`✅ تم إنشاء الشحنة: ${shipment.shipmentCode}`)
  console.log(`   - الموديل: ${shipment.model}`)
  console.log(`   - اللون: ${shipment.color}`)
  console.log(`   - الكمية: ${shipment.totalQuantity} جهاز`)
  console.log(`   - الأجهزة: ${devices.length} جهاز\n`)

  // إنشاء مجموعة تجريبية (10 أجهزة)
  const firstTenDevices = devices.slice(0, 10)
  const groupCode = `GRP-${Date.now()}`
  
  const group = await prisma.distributionGroup.create({
    data: {
      groupCode,
      shipmentId: shipment.id,
      clientName: 'محل الجوالات الذهبي',
      clientPhone: '0501234567',
      model: shipment.model,
      color: shipment.color,
      quantity: 10,
      notes: 'مجموعة تجريبية للعميل',
      qrCode: `http://localhost:3000/verify/${groupCode}`
    }
  })

  // تحديث حالة الأجهزة
  await prisma.device.updateMany({
    where: {
      id: { in: firstTenDevices.map(d => d.id) }
    },
    data: {
      status: 'ASSIGNED',
      groupId: group.id
    }
  })

  console.log(`✅ تم إنشاء المجموعة: ${group.groupCode}`)
  console.log(`   - العميل: ${group.clientName}`)
  console.log(`   - الكمية: ${group.quantity} جهاز`)
  console.log(`   - QR: ${group.qrCode}\n`)

  // عرض الإحصائيات
  const stats = {
    totalShipments: await prisma.factoryShipment.count(),
    totalDevices: await prisma.device.count(),
    totalGroups: await prisma.distributionGroup.count(),
    availableDevices: await prisma.device.count({ where: { status: 'IN_STOCK' } })
  }

  console.log('📊 الإحصائيات:')
  console.log(`   - إجمالي الشحنات: ${stats.totalShipments}`)
  console.log(`   - إجمالي الأجهزة: ${stats.totalDevices}`)
  console.log(`   - المجموعات: ${stats.totalGroups}`)
  console.log(`   - الأجهزة المتاحة: ${stats.availableDevices}`)
  console.log(`   - الأجهزة المخصصة: ${stats.totalDevices - stats.availableDevices}\n`)

  console.log('✅ تم إنشاء البيانات التجريبية بنجاح!')
  console.log('\n🔗 الروابط:')
  console.log(`   - لوحة التحكم: http://localhost:3000/admin/distribution`)
  console.log(`   - التحقق من المجموعة: ${group.qrCode}`)
}

main()
  .catch((e) => {
    console.error('❌ خطأ:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
