import { MongoClient, ObjectId } from 'mongodb'
import dotenv from 'dotenv'

dotenv.config()

const uri = process.env.DATABASE_URL || ''

async function checkHotwav() {
  const client = new MongoClient(uri)

  try {
    await client.connect()
    const db = client.db()
    const productsCollection = db.collection('Product')

    const product = await productsCollection.findOne({ nameEn: 'HOTWAV Hyper 7S Rugged Phone' })
    
    if (product) {
      console.log('✅ المنتج موجود:')
      console.log('الاسم:', product.nameAr)
      console.log('الألوان:', product.colors)
      console.log('السعات:', product.storage)
      console.log('المميزات السريعة:', product.quickFeatures)
      console.log('المميزات:', product.features?.length || 0)
      console.log('\nالبيانات الكاملة:')
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

checkHotwav()
