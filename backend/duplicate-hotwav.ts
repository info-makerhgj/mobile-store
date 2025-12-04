import { MongoClient } from 'mongodb'
import dotenv from 'dotenv'

dotenv.config()

const uri = process.env.DATABASE_URL || ''

async function duplicateHotwav() {
  const client = new MongoClient(uri)

  try {
    await client.connect()
    const db = client.db()
    const productsCollection = db.collection('Product')

    // Get original HOTWAV product
    const original = await productsCollection.findOne({ brand: 'HOTWAV' })
    
    if (!original) {
      console.log('❌ لم يتم العثور على منتج HOTWAV')
      return
    }

    console.log('📱 المنتج الأصلي:', original.nameAr)

    const variants = [
      { name: 'HOTWAV Hyper 7S - أسود', price: 1250, originalPrice: 1500, color: 'أسود' },
      { name: 'HOTWAV Hyper 7S - برتقالي', price: 1250, originalPrice: 1500, color: 'برتقالي' },
      { name: 'HOTWAV Hyper 7S - أخضر', price: 1250, originalPrice: 1500, color: 'أخضر' },
      { name: 'HOTWAV Cyber 13 Pro', price: 1899, originalPrice: 2299, color: 'أسود' },
      { name: 'HOTWAV W11 Rugged', price: 999, originalPrice: 1199, color: 'أزرق' },
      { name: 'HOTWAV T7 Ultra', price: 1599, originalPrice: 1899, color: 'رمادي' },
      { name: 'HOTWAV Note 13 Pro', price: 899, originalPrice: 1099, color: 'أبيض' },
      { name: 'HOTWAV Cyber 15', price: 2199, originalPrice: 2599, color: 'أسود' },
      { name: 'HOTWAV W10 Pro', price: 1399, originalPrice: 1699, color: 'برتقالي' },
      { name: 'HOTWAV T5 Lite', price: 699, originalPrice: 899, color: 'أخضر' },
      { name: 'HOTWAV Cyber 11', price: 1699, originalPrice: 1999, color: 'أحمر' },
      { name: 'HOTWAV W12 Max', price: 1799, originalPrice: 2099, color: 'أسود' },
    ]

    let count = 0
    for (const variant of variants) {
      const newProduct = {
        ...original,
        _id: undefined, // Remove old ID to create new one
        nameAr: variant.name,
        nameEn: variant.name,
        price: variant.price,
        originalPrice: variant.originalPrice,
        colors: [variant.color, 'أسود', 'أبيض'],
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      await productsCollection.insertOne(newProduct)
      count++
      console.log(`✅ ${count}. تم إضافة: ${variant.name}`)
    }

    console.log(`\n🎉 تم تكرار المنتج ${count} مرة بنجاح!`)

  } catch (error) {
    console.error('❌ خطأ:', error)
  } finally {
    await client.close()
  }
}

duplicateHotwav()
