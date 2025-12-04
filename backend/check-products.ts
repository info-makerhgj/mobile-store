import { MongoClient } from 'mongodb'
import dotenv from 'dotenv'

dotenv.config()

const uri = process.env.DATABASE_URL || ''

async function checkProducts() {
  const client = new MongoClient(uri)

  try {
    await client.connect()
    const db = client.db()
    const productsCollection = db.collection('Product')

    const products = await productsCollection.find({}).limit(2).toArray()
    
    console.log('📦 عدد المنتجات:', await productsCollection.countDocuments())
    console.log('\n📱 مثال على منتج:')
    console.log(JSON.stringify(products[0], null, 2))
  } catch (error) {
    console.error('❌ خطأ:', error)
  } finally {
    await client.close()
  }
}

checkProducts()
