import { MongoClient } from 'mongodb'
import dotenv from 'dotenv'

dotenv.config()

const uri = process.env.DATABASE_URL || ''

async function resetProducts() {
  const client = new MongoClient(uri)

  try {
    await client.connect()
    const db = client.db()
    const productsCollection = db.collection('Product')

    // Delete all products
    await productsCollection.deleteMany({})
    console.log('✅ تم حذف جميع المنتجات القديمة')
  } catch (error) {
    console.error('❌ خطأ:', error)
  } finally {
    await client.close()
  }
}

resetProducts()
