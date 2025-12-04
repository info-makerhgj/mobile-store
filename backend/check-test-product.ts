import { MongoClient, ObjectId } from 'mongodb'
import dotenv from 'dotenv'

dotenv.config()

const uri = process.env.DATABASE_URL || ''

async function checkTestProduct() {
  const client = new MongoClient(uri)

  try {
    await client.connect()
    const db = client.db()
    const productsCollection = db.collection('Product')

    const product = await productsCollection.findOne({ 
      _id: new ObjectId('69270065115b879f1dd88c15') 
    })

    if (product) {
      console.log('✅ المنتج موجود في قاعدة البيانات')
      console.log('\n📋 البيانات الكاملة:')
      console.log(JSON.stringify(product, null, 2))
    } else {
      console.log('❌ المنتج غير موجود')
    }

  } catch (error) {
    console.error('❌ خطأ:', error)
  } finally {
    await client.close()
  }
}

checkTestProduct()
