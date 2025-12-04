import { MongoClient } from 'mongodb'

const client = new MongoClient('mongodb://localhost:27017/abaad_store')

async function testAPI() {
  try {
    await client.connect()
    const db = client.db()
    
    console.log('🔍 Testing API data...\n')
    
    // Test Homepage
    console.log('📄 Homepage Config:')
    const homepage = await db.collection('HomepageConfig').findOne({ active: true })
    if (homepage) {
      console.log('✅ Homepage found')
      console.log('   Sections:', homepage.sections.length)
      homepage.sections.forEach((section: any) => {
        console.log(`   - ${section.type}: ${section.title} (${section.active ? 'Active' : 'Inactive'})`)
        if (section.type === 'products') {
          console.log(`     Products: ${section.content.productIds.length}`)
        }
      })
    } else {
      console.log('❌ No homepage found')
    }
    
    console.log('\n📦 Products:')
    const products = await db.collection('Product').find({}).toArray()
    console.log(`✅ Found ${products.length} products`)
    products.slice(0, 3).forEach((p: any) => {
      console.log(`   - ${p.nameAr} (${p._id})`)
    })
    
    console.log('\n🌐 API URL should be: http://localhost:4000/api')
    console.log('📍 Test: curl http://localhost:4000/api/homepage')
    
  } catch (error) {
    console.error('❌ Error:', error)
  } finally {
    await client.close()
  }
}

testAPI()
