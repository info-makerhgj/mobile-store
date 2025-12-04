import { MongoClient } from 'mongodb'
import dotenv from 'dotenv'

dotenv.config()

const uri = process.env.DATABASE_URL || ''

async function addHotwavProduct() {
  const client = new MongoClient(uri)

  try {
    await client.connect()
    const db = client.db()
    const productsCollection = db.collection('Product')

    const product = {
      nameAr: 'HOTWAV Hyper 7S هاتف متين',
      nameEn: 'HOTWAV Hyper 7S Rugged Phone',
      tagline: 'قوة لا تُقهر. متانة استثنائية.',
      brand: 'HOTWAV',
      category: 'smartphones',
      price: 1250,
      originalPrice: 1500,
      stock: 15,
      warranty: 'سنة واحدة - ضمان الوكيل',
      condition: 'NEW',
      descriptionAr: 'هاتف متين بمواصفات قوية ومقاومة عالية للصدمات والماء',
      descriptionEn: 'Rugged phone with powerful specs and high resistance to shocks and water',
      
      // الصور
      images: [
        'https://www.hotwav.com/cdn/shop/files/1_d0e0e0e0-0e0e-0e0e-0e0e-0e0e0e0e0e0e.jpg?v=1234',
        'https://www.hotwav.com/cdn/shop/files/2_d0e0e0e0-0e0e-0e0e-0e0e-0e0e0e0e0e0e.jpg?v=1234',
        '📱',
        '🔋',
        '📸',
        '🛡️',
      ],
      
      // الألوان
      colors: ['أسود', 'برتقالي', 'أخضر'],
      
      // السعات
      storage: ['128GB', '256GB'],
      
      // المميزات السريعة
      quickFeatures: [
        { icon: '⚡', title: 'شحن سريع', value: '33W' },
        { icon: '📸', title: 'كاميرا', value: '64MP' },
        { icon: '🔋', title: 'بطارية', value: '6000mAh' },
        { icon: '🛡️', title: 'مقاومة', value: 'IP68' },
      ],
      
      // المميزات الاستثنائية
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
      
      // المواصفات التقنية
      specifications: {
        screen: [
          { label: 'الحجم', value: '6.5 بوصة' },
          { label: 'النوع', value: 'IPS LCD' },
          { label: 'الدقة', value: '1080 × 2400' },
          { label: 'معدل التحديث', value: '90Hz' },
        ],
        performance: [
          { label: 'المعالج', value: 'MediaTek Helio G99' },
          { label: 'الرام', value: '8 جيجابايت' },
          { label: 'التخزين', value: '128 جيجابايت' },
          { label: 'نظام التشغيل', value: 'Android 13' },
        ],
        camera: [
          { label: 'الخلفية الرئيسية', value: '64MP' },
          { label: 'الخلفية الواسعة', value: '8MP' },
          { label: 'الأمامية', value: '16MP' },
          { label: 'الفيديو', value: '4K@30fps' },
        ],
        battery: [
          { label: 'السعة', value: '6000mAh' },
          { label: 'الشحن السلكي', value: '33W' },
          { label: 'الشحن اللاسلكي', value: 'غير مدعوم' },
          { label: 'الشحن العكسي', value: 'غير مدعوم' },
        ],
        connectivity: [
          { label: '5G', value: 'مدعوم' },
          { label: 'WiFi', value: 'WiFi 6' },
          { label: 'Bluetooth', value: '5.2' },
          { label: 'NFC', value: 'مدعوم' },
        ],
        design: [
          { label: 'الأبعاد', value: '168 × 79 × 14 mm' },
          { label: 'الوزن', value: '320 جرام' },
          { label: 'المواد', value: 'بلاستيك مقوى + معدن' },
          { label: 'مقاومة الماء', value: 'IP68 / IP69K' },
        ],
      },
      
      rating: 0,
      reviewsCount: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const result = await productsCollection.insertOne(product)
    console.log('✅ تم إضافة منتج HOTWAV Hyper 7S بنجاح!')
    console.log('ID:', result.insertedId)
    console.log('\n🔗 شاهد المنتج على: http://localhost:3000/products/' + result.insertedId)
  } catch (error) {
    console.error('❌ خطأ:', error)
  } finally {
    await client.close()
  }
}

addHotwavProduct()
