import { MongoClient, ObjectId } from 'mongodb'
import dotenv from 'dotenv'

dotenv.config()

const uri = process.env.DATABASE_URL || ''

async function reduceImageSize() {
  const client = new MongoClient(uri)

  try {
    await client.connect()
    const db = client.db()
    const productsCollection = db.collection('Product')

    // Find HOTWAV product
    const product = await productsCollection.findOne({ brand: 'HOTWAV' })
    
    if (!product) {
      console.log('❌ لم يتم العثور على منتج HOTWAV')
      return
    }

    console.log('📱 المنتج:', product.nameAr)
    console.log('📸 عدد الصور الحالية:', product.images?.length || 0)

    // Calculate current size
    const currentSize = JSON.stringify(product).length
    console.log('📦 الحجم الحالي:', (currentSize / 1024 / 1024).toFixed(2), 'MB')

    // Replace base64 images with emojis temporarily
    const newImages = [
      'https://www.hotwav.com/cdn/shop/files/Hyper_7S_Black_1.jpg',
      'https://www.hotwav.com/cdn/shop/files/Hyper_7S_Orange_1.jpg',
      '📱',
      '🔋',
      '📸',
    ]

    const result = await productsCollection.updateOne(
      { _id: product._id },
      { $set: { images: newImages, updatedAt: new Date() } }
    )

    console.log('\n✅ تم التحديث!')
    console.log('عدد المستندات المحدثة:', result.modifiedCount)

    // Check new size
    const updatedProduct = await productsCollection.findOne({ _id: product._id })
    const newSize = JSON.stringify(updatedProduct).length
    console.log('📦 الحجم الجديد:', (newSize / 1024 / 1024).toFixed(2), 'MB')
    console.log('💾 تم توفير:', ((currentSize - newSize) / 1024 / 1024).toFixed(2), 'MB')

  } catch (error) {
    console.error('❌ خطأ:', error)
  } finally {
    await client.close()
  }
}

reduceImageSize()
