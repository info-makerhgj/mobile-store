import { MongoClient } from 'mongodb'
import dotenv from 'dotenv'

dotenv.config()

const uri = process.env.DATABASE_URL || ''

async function addSimpleProducts() {
  const client = new MongoClient(uri)

  try {
    await client.connect()
    const db = client.db()
    const productsCollection = db.collection('Product')

    const products = [
      {
        nameAr: 'أبعاد X برو',
        nameEn: 'Abaad X Pro',
        descriptionAr: 'هاتف ذكي متطور بمواصفات عالية وتصميم أنيق',
        descriptionEn: 'Advanced smartphone with high specs and elegant design',
        price: 2999,
        brand: 'Abaad',
        category: 'smartphones',
        stock: 45,
        condition: 'NEW',
        warranty: 'سنتان',
        images: ['📱'],
        colors: [],
        storage: [],
        specifications: {},
        rating: 0,
        reviewsCount: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        nameAr: 'أبعاد X لايت',
        nameEn: 'Abaad X Lite',
        descriptionAr: 'هاتف ذكي بسعر مناسب وأداء ممتاز',
        descriptionEn: 'Affordable smartphone with excellent performance',
        price: 1799,
        brand: 'Abaad',
        category: 'smartphones',
        stock: 32,
        condition: 'NEW',
        warranty: 'سنتان',
        images: ['📱'],
        colors: [],
        storage: [],
        specifications: {},
        rating: 0,
        reviewsCount: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        nameAr: 'أبعاد واتش إيليت',
        nameEn: 'Abaad Watch Elite',
        descriptionAr: 'ساعة ذكية بمميزات صحية ورياضية متقدمة',
        descriptionEn: 'Smartwatch with advanced health and fitness features',
        price: 899,
        brand: 'Abaad',
        category: 'smartwatches',
        stock: 67,
        condition: 'NEW',
        warranty: 'سنة واحدة',
        images: ['⌚'],
        colors: [],
        storage: [],
        specifications: {},
        rating: 0,
        reviewsCount: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        nameAr: 'أبعاد بودز برو',
        nameEn: 'Abaad Buds Pro',
        descriptionAr: 'سماعات لاسلكية بجودة صوت عالية وإلغاء ضوضاء نشط',
        descriptionEn: 'Wireless earbuds with high quality sound and active noise cancellation',
        price: 499,
        brand: 'Abaad',
        category: 'headphones',
        stock: 120,
        condition: 'NEW',
        warranty: 'سنة واحدة',
        images: ['🎧'],
        colors: [],
        storage: [],
        specifications: {},
        rating: 0,
        reviewsCount: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        nameAr: 'أبعاد تاب برو',
        nameEn: 'Abaad Tab Pro',
        descriptionAr: 'جهاز لوحي بشاشة كبيرة مثالي للعمل والترفيه',
        descriptionEn: 'Tablet with large screen perfect for work and entertainment',
        price: 2299,
        brand: 'Abaad',
        category: 'tablets',
        stock: 18,
        condition: 'NEW',
        warranty: 'سنتان',
        images: ['📲'],
        colors: [],
        storage: [],
        specifications: {},
        rating: 0,
        reviewsCount: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        nameAr: 'أبعاد X ميني',
        nameEn: 'Abaad X Mini',
        descriptionAr: 'هاتف صغير الحجم بمواصفات قوية',
        descriptionEn: 'Compact phone with powerful specs',
        price: 1299,
        brand: 'Abaad',
        category: 'smartphones',
        stock: 25,
        condition: 'REFURBISHED',
        warranty: 'سنة واحدة',
        images: ['📱'],
        colors: [],
        storage: [],
        specifications: {},
        rating: 0,
        reviewsCount: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]

    const result = await productsCollection.insertMany(products)
    console.log(`✅ تم إضافة ${result.insertedCount} منتج بنجاح!`)
    
    console.log('\n📦 المنتجات المضافة:')
    products.forEach((p, i) => {
      console.log(`${i + 1}. ${p.nameAr} - ${p.price} ر.س`)
    })
  } catch (error) {
    console.error('❌ خطأ:', error)
  } finally {
    await client.close()
  }
}

addSimpleProducts()
