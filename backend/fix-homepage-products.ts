import { MongoClient, ObjectId } from 'mongodb'
import * as dotenv from 'dotenv'

dotenv.config()

const DATABASE_URL = process.env.DATABASE_URL || 'mongodb://localhost:27017/mobile-store'

async function fixHomepageProducts() {
  const client = new MongoClient(DATABASE_URL)

  try {
    await client.connect()
    console.log('✅ Connected to MongoDB')

    const db = client.db()
    const homepageCollection = db.collection('HomepageConfig')
    const productsCollection = db.collection('Product')

    // Get products
    const products = await productsCollection.find({}).limit(12).toArray()
    console.log(`📦 Found ${products.length} products`)

    if (products.length === 0) {
      console.log('⚠️  No products found! Run: npm run add:products')
      return
    }

    // Get homepage config
    const config = await homepageCollection.findOne({ active: true })
    if (!config) {
      console.log('⚠️  No homepage config found!')
      return
    }

    // Update product IDs in sections
    const productIds = products.map((p) => p._id.toString())

    config.sections.forEach((section: any) => {
      if (section.type === 'products') {
        if (section.order === 3) {
          // First products section
          section.content.productIds = productIds.slice(0, 6)
        } else if (section.order === 5) {
          // Second products section
          section.content.productIds = productIds.slice(6, 12)
        }
      }
    })

    // Update in database
    await homepageCollection.updateOne(
      { active: true },
      { $set: { sections: config.sections, updatedAt: new Date() } }
    )

    console.log('✅ Product IDs updated successfully!')
    console.log(`   Section 3: ${config.sections[2].content.productIds.length} products`)
    console.log(`   Section 5: ${config.sections[4].content.productIds.length} products`)
  } catch (error) {
    console.error('❌ Error:', error)
  } finally {
    await client.close()
  }
}

fixHomepageProducts()
