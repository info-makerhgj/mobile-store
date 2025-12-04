import { MongoClient } from 'mongodb'

const client = new MongoClient('mongodb://localhost:27017/abaad_store')

async function finalCheck() {
  try {
    await client.connect()
    const db = client.db()
    
    console.log('🔍 Final System Check\n')
    console.log('='.repeat(50))
    
    // Check Products
    const products = await db.collection('Product').countDocuments()
    console.log(`\n✅ Products: ${products} found`)
    
    // Check Homepage
    const homepage = await db.collection('HomepageConfig').findOne({ active: true })
    if (homepage) {
      console.log(`✅ Homepage: Configured`)
      console.log(`   - Sections: ${homepage.sections.length}`)
      
      const productsSection = homepage.sections.find((s: any) => s.type === 'products')
      if (productsSection) {
        console.log(`   - Products Section: ${productsSection.content.productIds.length} products`)
      }
    } else {
      console.log(`❌ Homepage: Not configured`)
      console.log(`   Run: npx ts-node init-homepage-simple.ts`)
    }
    
    console.log('\n' + '='.repeat(50))
    console.log('\n📍 URLs to test:')
    console.log('   Backend API: http://localhost:4000/api/homepage')
    console.log('   Frontend: http://localhost:3000')
    console.log('   Admin: http://localhost:3000/admin/homepage')
    
    console.log('\n✅ System is ready!')
    
  } catch (error) {
    console.error('❌ Error:', error)
  } finally {
    await client.close()
  }
}

finalCheck()
