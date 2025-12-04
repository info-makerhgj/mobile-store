import express from 'express'
import { MongoClient, ObjectId } from 'mongodb'
import { authenticate, authorize } from '../middleware/auth'

const router = express.Router()

// Middleware للأدمن فقط
const requireAdmin = [authenticate, authorize(['ADMIN'])]

// MongoDB Client
const getMongoClient = async () => {
  const client = new MongoClient(process.env.DATABASE_URL || '')
  await client.connect()
  return client
}

// ============================================
// 📦 إدارة الشحنات من المصنع
// ============================================

// جلب جميع الشحنات
router.get('/shipments', ...requireAdmin, async (req, res) => {
  const client = await getMongoClient()
  
  try {
    const db = client.db()
    const shipments = await db.collection('factory_shipments')
      .find({})
      .sort({ createdAt: -1 })
      .toArray()

    // جلب عدد الأجهزة والمجموعات لكل شحنة
    const shipmentsWithCounts = await Promise.all(
      shipments.map(async (shipment) => {
        const devicesCount = await db.collection('devices').countDocuments({ 
          shipmentId: shipment._id.toString() 
        })
        const groupsCount = await db.collection('distribution_groups').countDocuments({ 
          shipmentId: shipment._id.toString() 
        })
        
        return {
          ...shipment,
          id: shipment._id.toString(),
          _count: {
            devices: devicesCount,
            groups: groupsCount
          }
        }
      })
    )

    res.json(shipmentsWithCounts)
  } catch (error) {
    console.error('Error fetching shipments:', error)
    res.status(500).json({ error: 'فشل جلب الشحنات' })
  } finally {
    await client.close()
  }
})

// إضافة شحنة جديدة
router.post('/shipments', ...requireAdmin, async (req, res) => {
  const client = await getMongoClient()
  
  try {
    const { model, color, devices, weight, factoryBoxNo, notes } = req.body

    if (!model || !color || !devices || devices.length === 0) {
      return res.status(400).json({ error: 'البيانات غير مكتملة' })
    }

    const db = client.db()
    const shipmentCode = `SH-${Date.now()}`

    // إنشاء الشحنة
    const shipmentResult = await db.collection('factory_shipments').insertOne({
      shipmentCode,
      model,
      color,
      totalQuantity: devices.length,
      weight: weight ? parseFloat(weight) : null,
      factoryBoxNo: factoryBoxNo || null,
      notes: notes || null,
      receivedDate: new Date(),
      createdAt: new Date(),
      updatedAt: new Date()
    })

    // إنشاء الأجهزة
    const devicesData = devices.map((device: any) => ({
      shipmentId: shipmentResult.insertedId.toString(),
      imei1: device.imei1,
      imei2: device.imei2 || null,
      serialNo: device.serialNo || null,
      status: 'IN_STOCK',
      createdAt: new Date(),
      updatedAt: new Date()
    }))

    await db.collection('devices').insertMany(devicesData)

    // جلب الشحنة مع الأجهزة
    const shipment = await db.collection('factory_shipments').findOne({ _id: shipmentResult.insertedId })
    const createdDevices = await db.collection('devices').find({ 
      shipmentId: shipmentResult.insertedId.toString() 
    }).toArray()

    res.json({
      ...shipment,
      id: shipment?._id.toString(),
      devices: createdDevices.map(d => ({ ...d, id: d._id.toString() }))
    })
  } catch (error: any) {
    console.error('Error creating shipment:', error)
    res.status(500).json({ error: 'فشل إضافة الشحنة' })
  } finally {
    await client.close()
  }
})

// جلب تفاصيل شحنة
router.get('/shipments/:id', ...requireAdmin, async (req, res) => {
  const client = await getMongoClient()
  
  try {
    const db = client.db()
    const shipment = await db.collection('factory_shipments').findOne({ 
      _id: new ObjectId(req.params.id) 
    })

    if (!shipment) {
      return res.status(404).json({ error: 'الشحنة غير موجودة' })
    }

    // جلب الأجهزة
    const devices = await db.collection('devices').find({ 
      shipmentId: shipment._id.toString() 
    }).toArray()

    // جلب المجموعات
    const groups = await db.collection('distribution_groups').find({ 
      shipmentId: shipment._id.toString() 
    }).toArray()

    res.json({
      ...shipment,
      id: shipment._id.toString(),
      devices: devices.map(d => ({ ...d, id: d._id.toString() })),
      groups: groups.map(g => ({ ...g, id: g._id.toString() }))
    })
  } catch (error) {
    console.error('Error fetching shipment:', error)
    res.status(500).json({ error: 'فشل جلب تفاصيل الشحنة' })
  } finally {
    await client.close()
  }
})

// ============================================
// 📋 إدارة مجموعات التوزيع
// ============================================

// جلب جميع المجموعات
router.get('/groups', ...requireAdmin, async (req, res) => {
  const client = await getMongoClient()
  
  try {
    const db = client.db()
    const groups = await db.collection('distribution_groups')
      .find({})
      .sort({ createdAt: -1 })
      .toArray()

    res.json(groups.map(g => ({ ...g, id: g._id.toString() })))
  } catch (error) {
    console.error('Error fetching groups:', error)
    res.status(500).json({ error: 'فشل جلب المجموعات' })
  } finally {
    await client.close()
  }
})

// إنشاء مجموعة توزيع جديدة
router.post('/groups', ...requireAdmin, async (req, res) => {
  const client = await getMongoClient()
  
  try {
    const { shipmentId, clientName, clientPhone, deviceIds, notes } = req.body

    if (!shipmentId || !clientName || !deviceIds || deviceIds.length === 0) {
      return res.status(400).json({ error: 'البيانات غير مكتملة' })
    }

    const db = client.db()

    // التحقق من الشحنة
    const shipment = await db.collection('factory_shipments').findOne({ 
      _id: new ObjectId(shipmentId) 
    })

    if (!shipment) {
      return res.status(404).json({ error: 'الشحنة غير موجودة' })
    }

    // التحقق من الأجهزة
    const devices = await db.collection('devices').find({
      _id: { $in: deviceIds.map((id: string) => new ObjectId(id)) },
      status: 'IN_STOCK'
    }).toArray()

    if (devices.length !== deviceIds.length) {
      return res.status(400).json({ error: 'بعض الأجهزة غير متاحة أو مخصصة مسبقاً' })
    }

    // توليد كود المجموعة
    const groupCode = `GRP-${Date.now()}`

    // إنشاء المجموعة
    const groupResult = await db.collection('distribution_groups').insertOne({
      groupCode,
      shipmentId: shipment._id.toString(),
      clientName,
      clientPhone: clientPhone || null,
      model: shipment.model,
      color: shipment.color,
      quantity: deviceIds.length,
      notes: notes || null,
      qrCode: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/verify/${groupCode}`,
      labelPrinted: false,
      createdAt: new Date(),
      updatedAt: new Date()
    })

    // تحديث حالة الأجهزة
    await db.collection('devices').updateMany(
      { _id: { $in: deviceIds.map((id: string) => new ObjectId(id)) } },
      { 
        $set: { 
          status: 'ASSIGNED',
          groupId: groupResult.insertedId.toString(),
          updatedAt: new Date()
        }
      }
    )

    // جلب الأجهزة المحدثة
    const updatedDevices = await db.collection('devices').find({ 
      groupId: groupResult.insertedId.toString() 
    }).toArray()

    const group = await db.collection('distribution_groups').findOne({ 
      _id: groupResult.insertedId 
    })

    res.json({
      ...group,
      id: group?._id.toString(),
      devices: updatedDevices.map(d => ({ ...d, id: d._id.toString() }))
    })
  } catch (error) {
    console.error('Error creating group:', error)
    res.status(500).json({ error: 'فشل إنشاء المجموعة' })
  } finally {
    await client.close()
  }
})

// جلب تفاصيل مجموعة
router.get('/groups/:id', ...requireAdmin, async (req, res) => {
  const client = await getMongoClient()
  
  try {
    const db = client.db()
    const group = await db.collection('distribution_groups').findOne({ 
      _id: new ObjectId(req.params.id) 
    })

    if (!group) {
      return res.status(404).json({ error: 'المجموعة غير موجودة' })
    }

    // جلب الأجهزة
    const devices = await db.collection('devices').find({ 
      groupId: group._id.toString() 
    }).toArray()

    res.json({
      ...group,
      id: group._id.toString(),
      devices: devices.map(d => ({ ...d, id: d._id.toString() }))
    })
  } catch (error) {
    console.error('Error fetching group:', error)
    res.status(500).json({ error: 'فشل جلب تفاصيل المجموعة' })
  } finally {
    await client.close()
  }
})

// تحديث حالة طباعة الملصق
router.patch('/groups/:id/printed', ...requireAdmin, async (req, res) => {
  const client = await getMongoClient()
  
  try {
    const db = client.db()
    await db.collection('distribution_groups').updateOne(
      { _id: new ObjectId(req.params.id) },
      { $set: { labelPrinted: true, updatedAt: new Date() } }
    )

    const group = await db.collection('distribution_groups').findOne({ 
      _id: new ObjectId(req.params.id) 
    })

    res.json({ ...group, id: group?._id.toString() })
  } catch (error) {
    console.error('Error updating group:', error)
    res.status(500).json({ error: 'فشل تحديث المجموعة' })
  } finally {
    await client.close()
  }
})

// ============================================
// 🔍 التحقق من المجموعة (صفحة عامة)
// ============================================

// التحقق من مجموعة بواسطة الكود (بدون مصادقة)
router.get('/verify/:groupCode', async (req, res) => {
  const client = await getMongoClient()
  
  try {
    const db = client.db()
    const group = await db.collection('distribution_groups').findOne({ 
      groupCode: req.params.groupCode 
    })

    if (!group) {
      return res.status(404).json({ error: 'المجموعة غير موجودة' })
    }

    // جلب الأجهزة
    const devices = await db.collection('devices').find({ 
      groupId: group._id.toString() 
    }).toArray()

    res.json({
      groupCode: group.groupCode,
      model: group.model,
      color: group.color,
      quantity: group.quantity,
      clientName: group.clientName,
      devices: devices.map(d => ({
        imei1: d.imei1,
        imei2: d.imei2,
        serialNo: d.serialNo
      })),
      createdAt: group.createdAt
    })
  } catch (error) {
    console.error('Error verifying group:', error)
    res.status(500).json({ error: 'فشل التحقق من المجموعة' })
  } finally {
    await client.close()
  }
})

// ============================================
// 📊 إحصائيات
// ============================================

router.get('/stats', ...requireAdmin, async (req, res) => {
  const client = await getMongoClient()
  
  try {
    const db = client.db()
    
    const [totalShipments, totalDevices, totalGroups, availableDevices] = await Promise.all([
      db.collection('factory_shipments').countDocuments(),
      db.collection('devices').countDocuments(),
      db.collection('distribution_groups').countDocuments(),
      db.collection('devices').countDocuments({ status: 'IN_STOCK' })
    ])

    res.json({
      totalShipments,
      totalDevices,
      totalGroups,
      availableDevices,
      assignedDevices: totalDevices - availableDevices
    })
  } catch (error) {
    console.error('Error fetching stats:', error)
    res.status(500).json({ error: 'فشل جلب الإحصائيات' })
  } finally {
    await client.close()
  }
})

export default router
