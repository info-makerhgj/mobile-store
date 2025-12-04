import { MongoClient } from 'mongodb'

const client = new MongoClient(process.env.DATABASE_URL || 'mongodb://localhost:27017/abaad_store')

async function initHomepage() {
  try {
    await client.connect()
    const db = client.db()
    
    console.log('🔍 Checking for products...')
    const products = await db.collection('Product').find({}).toArray()
    console.log(`✅ Found ${products.length} products`)
    
    if (products.length === 0) {
      console.log('❌ No products found! Please add products first.')
      return
    }
    
    // Get first 4 products
    const productIds = products.slice(0, 4).map(p => p._id.toString())
    console.log('📦 Using products:', productIds)
    
    // Check if homepage exists
    const existingHomepage = await db.collection('HomepageConfig').findOne({})
    
    if (existingHomepage) {
      console.log('🔄 Updating existing homepage...')
      await db.collection('HomepageConfig').deleteMany({})
    }
    
    // Create homepage configuration
    const homepage = {
      active: true,
      createdAt: new Date(),
      updatedAt: new Date(),
      sections: [
        {
          id: '1',
          type: 'hero',
          title: 'مرحباً بك في متجرنا',
          subtitle: 'أفضل المنتجات بأفضل الأسعار',
          order: 1,
          active: true,
          settings: { autoplay: true, interval: 5000 },
          content: {
            slides: [
              {
                title: 'عروض خاصة',
                subtitle: 'خصومات تصل إلى 50%',
                image: '🎉',
                buttonText: 'تسوق الآن',
                buttonLink: '/products'
              }
            ]
          }
        },
        {
          id: '2',
          type: 'products',
          title: 'المنتجات المميزة',
          subtitle: 'أفضل المنتجات المختارة لك',
          order: 2,
          active: true,
          settings: { columns: 4 },
          content: {
            productIds: productIds,
            source: 'manual'
          }
        }
      ]
    }
    
    const result = await db.collection('HomepageConfig').insertOne(homepage)
    console.log('✅ Homepage created successfully!')
    console.log('📄 Homepage ID:', result.insertedId)
    
  } catch (error) {
    console.error('❌ Error:', error)
  } finally {
    await client.close()
  }
}

initHomepage()
