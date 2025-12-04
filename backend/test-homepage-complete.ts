import { MongoClient } from 'mongodb'
import * as dotenv from 'dotenv'

dotenv.config()

const DATABASE_URL = process.env.DATABASE_URL || 'mongodb://localhost:27017/mobile-store'

async function testHomepageComplete() {
  const client = new MongoClient(DATABASE_URL)

  try {
    await client.connect()
    console.log('✅ Connected to MongoDB')

    const db = client.db()
    const homepageCollection = db.collection('HomepageConfig')
    const productsCollection = db.collection('Product')

    // 1. Check products
    console.log('\n📦 Checking products...')
    const productsCount = await productsCollection.countDocuments()
    console.log(`   Found ${productsCount} products`)

    if (productsCount === 0) {
      console.log('   ⚠️  No products found! Run: npm run add:products')
      return
    }

    // 2. Check homepage config
    console.log('\n🏠 Checking homepage config...')
    const config = await homepageCollection.findOne({ active: true })

    if (!config) {
      console.log('   ⚠️  No homepage config found! Run: npm run init:homepage')
      return
    }

    console.log(`   Found ${config.sections?.length || 0} sections`)

    // 3. Test each section
    console.log('\n🧪 Testing sections...')

    for (const section of config.sections || []) {
      console.log(`\n   ${section.order}. ${section.title} (${section.type})`)
      console.log(`      Active: ${section.active ? '✅' : '❌'}`)

      switch (section.type) {
        case 'hero':
          const slides = section.content?.slides || []
          console.log(`      Slides: ${slides.length}`)
          slides.forEach((slide: any, i: number) => {
            console.log(`        ${i + 1}. ${slide.title}`)
          })
          break

        case 'categories':
          const categories = section.content?.categories || []
          console.log(`      Categories: ${categories.length}`)
          categories.forEach((cat: any) => {
            console.log(`        - ${cat.icon} ${cat.name}`)
          })
          break

        case 'products':
          const productIds = section.content?.productIds || []
          console.log(`      Product IDs: ${productIds.length}`)

          // Check if products exist
          const existingProducts = await productsCollection
            .find({ _id: { $in: productIds.map((id: string) => id) } })
            .toArray()
          console.log(`      Existing products: ${existingProducts.length}`)

          if (existingProducts.length === 0 && productIds.length > 0) {
            console.log('      ⚠️  Products not found! IDs might be invalid')
          }
          break

        case 'banner':
          console.log(`      Has image: ${section.content?.image ? '✅' : '❌'}`)
          console.log(`      Button: ${section.content?.buttonText || 'N/A'}`)
          break

        case 'text':
          console.log(`      Text length: ${section.content?.text?.length || 0} chars`)
          break

        case 'imageGrid':
          const images = section.content?.images || []
          console.log(`      Images: ${images.length}`)
          break
      }
    }

    // 4. Summary
    console.log('\n📊 Summary:')
    console.log(`   ✅ Products: ${productsCount}`)
    console.log(`   ✅ Sections: ${config.sections?.length || 0}`)
    console.log(`   ✅ Active sections: ${config.sections?.filter((s: any) => s.active).length || 0}`)

    console.log('\n🎉 Test complete!')
    console.log('\n📝 Next steps:')
    console.log('   1. Visit http://localhost:3000 to see the homepage')
    console.log('   2. Visit http://localhost:3000/admin/homepage-builder to manage sections')
  } catch (error) {
    console.error('❌ Error:', error)
  } finally {
    await client.close()
  }
}

testHomepageComplete()
