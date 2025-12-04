import { MongoClient, ObjectId } from 'mongodb'
import dotenv from 'dotenv'

dotenv.config()

const uri = process.env.DATABASE_URL || ''

async function fixHotwavData() {
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

    console.log('📱 تحديث منتج:', product.nameAr)
    console.log('🆔 ID:', product._id)

    // Update with correct data
    const updateData = {
      colors: ['أسود', 'برتقالي', 'أخضر'],
      storage: ['128GB', '256GB'],
      quickFeatures: [
        { icon: '⚡', title: 'شحن سريع', value: '33W' },
        { icon: '📸', title: 'كاميرا', value: '64MP' },
        { icon: '🔋', title: 'بطارية', value: '6000mAh' },
        { icon: '🛡️', title: 'مقاومة', value: 'IP68' },
      ],
      features: [
        {
          title: 'متانة عسكرية',
          description: 'مصمم لتحمل أقسى الظروف مع شهادة IP68 و IP69K ومعيار MIL-STD-810H العسكري. مقاوم للماء والغبار والصدمات والحرارة الشديدة.',
          image: '🛡️',
          gradient: 'from-orange-500 to-red-500',
        },
        {
          title: 'بطارية ضخمة 6000mAh',
          description: 'استمتع بأيام من الاستخدام المتواصل مع بطارية 6000mAh وشحن سريع 33W. من 0 إلى 100% في أقل من ساعة.',
          image: '🔋',
          gradient: 'from-green-500 to-emerald-500',
        },
        {
          title: 'كاميرا احترافية 64MP',
          description: 'التقط صوراً مذهلة في أي ظروف مع كاميرا رئيسية 64 ميجابكسل وكاميرا ليلية متقدمة وتصوير فيديو 4K.',
          image: '📸',
          gradient: 'from-purple-500 to-pink-500',
        },
        {
          title: 'شاشة قوية 6.5 بوصة',
          description: 'شاشة IPS LCD بحجم 6.5 بوصة محمية بزجاج Gorilla Glass مع سطوع عالي للاستخدام تحت أشعة الشمس المباشرة.',
          image: '📱',
          gradient: 'from-blue-500 to-cyan-500',
        },
      ],
      updatedAt: new Date(),
    }

    const result = await productsCollection.updateOne(
      { _id: product._id },
      { $set: updateData }
    )

    console.log('\n✅ تم التحديث بنجاح!')
    console.log('عدد المستندات المحدثة:', result.modifiedCount)

    // Verify update
    const updatedProduct = await productsCollection.findOne({ _id: product._id })
    console.log('\n✅ التحقق من التحديث:')
    console.log('الألوان:', updatedProduct?.colors)
    console.log('السعات:', updatedProduct?.storage)
    console.log('الميزات السريعة:', updatedProduct?.quickFeatures?.length || 0)
    console.log('الميزات الاستثنائية:', updatedProduct?.features?.length || 0)

  } catch (error) {
    console.error('❌ خطأ:', error)
  } finally {
    await client.close()
  }
}

fixHotwavData()
