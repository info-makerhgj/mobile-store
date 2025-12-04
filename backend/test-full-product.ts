import { MongoClient } from 'mongodb'
import dotenv from 'dotenv'

dotenv.config()

const uri = process.env.DATABASE_URL || ''

async function testFullProduct() {
  const client = new MongoClient(uri)

  try {
    await client.connect()
    const db = client.db()
    const productsCollection = db.collection('Product')

    // Delete existing test product
    await productsCollection.deleteMany({ nameAr: 'منتج تجريبي كامل' })

    const testProduct = {
      nameAr: 'منتج تجريبي كامل',
      nameEn: 'Full Test Product',
      tagline: 'منتج للاختبار',
      brand: 'TEST',
      category: 'smartphones',
      price: 999,
      originalPrice: 1299,
      stock: 50,
      warranty: 'سنة واحدة',
      condition: 'NEW',
      descriptionAr: 'منتج تجريبي',
      descriptionEn: 'Test product',
      
      images: ['📱', '🔋', '📸'],
      
      colors: ['أحمر', 'أزرق', 'أخضر'],
      
      storage: ['64GB', '128GB', '256GB'],
      
      quickFeatures: [
        { icon: '⚡', title: 'شحن', value: '25W' },
        { icon: '📸', title: 'كاميرا', value: '48MP' },
        { icon: '🔋', title: 'بطارية', value: '4500mAh' },
        { icon: '🛡️', title: 'حماية', value: 'IP67' },
      ],
      
      features: [
        {
          title: 'شاشة رائعة',
          description: 'شاشة AMOLED بحجم 6.5 بوصة',
          image: '📱',
          gradient: 'from-blue-500 to-cyan-500',
        },
        {
          title: 'أداء قوي',
          description: 'معالج ثماني النواة',
          image: '⚡',
          gradient: 'from-purple-500 to-pink-500',
        },
      ],
      
      specifications: {
        screen: [
          { label: 'الحجم', value: '6.5 بوصة' },
          { label: 'النوع', value: 'AMOLED' },
          { label: 'الدقة', value: 'FHD+' },
          { label: 'معدل التحديث', value: '90Hz' },
        ],
        performance: [
          { label: 'المعالج', value: 'Snapdragon 750G' },
          { label: 'الرام', value: '8GB' },
          { label: 'التخزين', value: '128GB' },
          { label: 'نظام التشغيل', value: 'Android 13' },
        ],
        camera: [
          { label: 'الخلفية الرئيسية', value: '48MP' },
          { label: 'الخلفية الواسعة', value: '8MP' },
          { label: 'الأمامية', value: '16MP' },
          { label: 'الفيديو', value: '4K@30fps' },
        ],
        battery: [
          { label: 'السعة', value: '4500mAh' },
          { label: 'الشحن السلكي', value: '25W' },
          { label: 'الشحن اللاسلكي', value: 'غير مدعوم' },
          { label: 'الشحن العكسي', value: 'غير مدعوم' },
        ],
        connectivity: [
          { label: '5G', value: 'مدعوم' },
          { label: 'WiFi', value: 'WiFi 6' },
          { label: 'Bluetooth', value: '5.1' },
          { label: 'NFC', value: 'مدعوم' },
        ],
        design: [
          { label: 'الأبعاد', value: '160 × 75 × 8 mm' },
          { label: 'الوزن', value: '180g' },
          { label: 'المواد', value: 'زجاج + بلاستيك' },
          { label: 'مقاومة الماء', value: 'IP67' },
        ],
      },
      
      rating: 0,
      reviewsCount: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const result = await productsCollection.insertOne(testProduct)
    console.log('✅ تم إضافة منتج تجريبي!')
    console.log('🆔 ID:', result.insertedId)
    console.log('\n📋 البيانات:')
    console.log('  - الألوان:', testProduct.colors)
    console.log('  - السعات:', testProduct.storage)
    console.log('  - الميزات السريعة:', testProduct.quickFeatures.length)
    console.log('  - الميزات الاستثنائية:', testProduct.features.length)
    console.log('\n🔗 رابط التعديل:')
    console.log(`http://localhost:3000/admin/products/edit/${result.insertedId}`)

  } catch (error) {
    console.error('❌ خطأ:', error)
  } finally {
    await client.close()
  }
}

testFullProduct()
