import { MongoClient, ObjectId } from 'mongodb'

const mongoUrl = process.env.DATABASE_URL || 'mongodb://localhost:27017/abaad_store'

async function fixExistingOrders() {
  const client = new MongoClient(mongoUrl)

  try {
    await client.connect()
    console.log('✅ Connected to MongoDB')

    const db = client.db()

    // Get all orders
    const orders = await db.collection('Order').find({}).toArray()
    console.log(`📦 Found ${orders.length} orders`)

    let updated = 0

    for (let i = 0; i < orders.length; i++) {
      const order = orders[i]
      
      // Skip if already has orderNumber
      if (order.orderNumber) {
        continue
      }

      // Generate order number
      const orderNumber = `#${(10001 + i).toString()}`

      // Get user info if not present
      let customerName = order.customerName
      let customerEmail = order.customerEmail
      let customerPhone = order.customerPhone

      if (!customerName && order.userId) {
        const user = await db.collection('User').findOne({ _id: new ObjectId(order.userId) })
        if (user) {
          customerName = user.name
          customerEmail = user.email
          customerPhone = user.phone
        }
      }

      // Update order
      await db.collection('Order').updateOne(
        { _id: order._id },
        {
          $set: {
            orderNumber,
            customerName: customerName || order.shippingAddress?.name || 'عميل',
            customerEmail: customerEmail || order.shippingAddress?.email || '',
            customerPhone: customerPhone || order.shippingAddress?.phone || '',
            status: order.status || 'pending',
            updatedAt: new Date(),
          },
        }
      )

      updated++
      console.log(`✅ Updated order ${orderNumber}`)
    }

    console.log(`\n✅ Updated ${updated} orders successfully!`)

    // Show sample orders
    const sampleOrders = await db.collection('Order')
      .find({})
      .sort({ createdAt: -1 })
      .limit(5)
      .toArray()

    console.log('\n📋 Sample Orders:')
    sampleOrders.forEach((order: any) => {
      console.log(`  ${order.orderNumber} - ${order.customerName} - ${order.total} ر.س`)
    })

  } catch (error) {
    console.error('❌ Error:', error)
  } finally {
    await client.close()
  }
}

fixExistingOrders()
