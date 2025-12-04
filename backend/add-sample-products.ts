import { MongoClient } from 'mongodb'
import dotenv from 'dotenv'

dotenv.config()

const uri = process.env.DATABASE_URL || ''

async function addSampleProducts() {
  const client = new MongoClient(uri)

  try {
    await client.connect()
    const db = client.db()
    const productsCollection = db.collection('Product')

    const products = [
      {
        nameAr: 'آيفون 15 برو ماكس',
        nameEn: 'iPhone 15 Pro Max',
        tagline: 'التيتانيوم. قوي جداً. خفيف جداً. برو جداً.',
        descriptionAr: 'أحدث هاتف من آبل بمعالج A17 Pro وكاميرا 48 ميجابكسل وشاشة Super Retina XDR مقاس 6.7 بوصة. تصميم من التيتانيوم الفاخر مع زر الإجراء الجديد وجزيرة Dynamic Island.',
        descriptionEn: 'Latest iPhone with A17 Pro chip, 48MP camera and 6.7-inch Super Retina XDR display. Premium titanium design with new Action button and Dynamic Island.',
        price: 5499,
        originalPrice: 5999,
        brand: 'Apple',
        category: 'smartphones',
        images: [
          'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800',
          'https://images.unsplash.com/photo-1695048133082-1a20484d2569?w=800',
          'https://images.unsplash.com/photo-1695048133122-1a20484d2569?w=800',
        ],
        colors: ['تيتانيوم طبيعي', 'تيتانيوم أزرق', 'تيتانيوم أبيض', 'تيتانيوم أسود'],
        storage: ['256GB', '512GB', '1TB'],
        quickFeatures: [
          { icon: '⚡', title: 'شحن سريع', value: '27W' },
          { icon: '📸', title: 'كاميرا', value: '48MP' },
          { icon: '🔋', title: 'بطارية', value: '4422mAh' },
          { icon: '🛡️', title: 'ضمان', value: 'سنة واحدة' },
        ],
        specifications: {
          screen: {
            size: '6.7 بوصة',
            type: 'Super Retina XDR OLED',
            resolution: '2796 × 1290',
            refresh: '120Hz ProMotion',
          },
          processor: {
            name: 'Apple A17 Pro',
            cores: '6 نوى',
            gpu: 'GPU 6 نوى',
          },
          memory: {
            ram: '8 جيجابايت',
            storage: '256 جيجابايت',
          },
          camera: {
            main: '48 ميجابكسل',
            ultrawide: '12 ميجابكسل',
            telephoto: '12 ميجابكسل (5x)',
            front: '12 ميجابكسل',
            features: ['تسجيل فيديو 4K', 'وضع السينما', 'ProRAW', 'Night mode'],
          },
          battery: {
            capacity: '4422 mAh',
            charging: 'شحن سريع 27W',
            wireless: 'MagSafe 15W',
          },
          connectivity: ['5G', 'WiFi 6E', 'Bluetooth 5.3', 'NFC', 'USB-C'],
          dimensions: {
            height: '159.9 مم',
            width: '76.7 مم',
            depth: '8.25 مم',
            weight: '221 جرام',
          },
        },
        stock: 15,
        condition: 'NEW',
        warranty: 'سنة واحدة - ضمان الوكيل',
        rating: 4.8,
        reviewsCount: 127,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        nameAr: 'سامسونج جالاكسي S24 ألترا',
        nameEn: 'Samsung Galaxy S24 Ultra',
        tagline: 'ذكاء اصطناعي. قوة خارقة. إبداع لا محدود.',
        descriptionAr: 'هاتف سامسونج الرائد بمعالج Snapdragon 8 Gen 3 وكاميرا 200 ميجابكسل وشاشة Dynamic AMOLED 2X مقاس 6.8 بوصة. يأتي مع قلم S Pen المدمج وذكاء اصطناعي متقدم.',
        descriptionEn: 'Samsung flagship with Snapdragon 8 Gen 3, 200MP camera and 6.8-inch Dynamic AMOLED 2X display. Comes with built-in S Pen and advanced AI features.',
        price: 4799,
        originalPrice: 5299,
        brand: 'Samsung',
        category: 'smartphones',
        images: [
          'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=800',
          'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=800',
          'https://images.unsplash.com/photo-1610945264803-c22b62d2a7b3?w=800',
        ],
        colors: ['تيتانيوم رمادي', 'تيتانيوم أسود', 'تيتانيوم بنفسجي', 'تيتانيوم أصفر'],
        storage: ['256GB', '512GB', '1TB'],
        quickFeatures: [
          { icon: '⚡', title: 'شحن سريع', value: '45W' },
          { icon: '📸', title: 'كاميرا', value: '200MP' },
          { icon: '🔋', title: 'بطارية', value: '5000mAh' },
          { icon: '✏️', title: 'S Pen', value: 'مدمج' },
        ],
        specifications: {
          screen: {
            size: '6.8 بوصة',
            type: 'Dynamic AMOLED 2X',
            resolution: '3120 × 1440',
            refresh: '120Hz',
          },
          processor: {
            name: 'Snapdragon 8 Gen 3',
            cores: '8 نوى',
            gpu: 'Adreno 750',
          },
          memory: {
            ram: '12 جيجابايت',
            storage: '256 جيجابايت',
          },
          camera: {
            main: '200 ميجابكسل',
            ultrawide: '12 ميجابكسل',
            telephoto: '50 ميجابكسل (5x) + 10 ميجابكسل (3x)',
            front: '12 ميجابكسل',
            features: ['تسجيل فيديو 8K', 'Space Zoom 100x', 'Night mode', 'AI Photo Editor'],
          },
          battery: {
            capacity: '5000 mAh',
            charging: 'شحن سريع 45W',
            wireless: 'شحن لاسلكي 15W',
          },
          connectivity: ['5G', 'WiFi 7', 'Bluetooth 5.3', 'NFC', 'USB-C'],
          dimensions: {
            height: '162.3 مم',
            width: '79 مم',
            depth: '8.6 مم',
            weight: '232 جرام',
          },
          extras: ['قلم S Pen مدمج', 'مقاومة الماء IP68', 'شاشة Gorilla Armor'],
        },
        stock: 22,
        condition: 'NEW',
        warranty: 'سنتان - ضمان الوكيل',
        rating: 4.7,
        reviewsCount: 89,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        nameAr: 'آيفون 14 برو',
        nameEn: 'iPhone 14 Pro',
        descriptionAr: 'آيفون 14 برو بمعالج A16 Bionic وكاميرا 48 ميجابكسل وشاشة ProMotion. يتميز بجزيرة Dynamic Island الثورية وشاشة Always-On.',
        descriptionEn: 'iPhone 14 Pro with A16 Bionic chip, 48MP camera and ProMotion display. Features revolutionary Dynamic Island and Always-On display.',
        price: 3999,
        originalPrice: 4499,
        brand: 'Apple',
        category: 'smartphones',
        images: [
          'https://images.unsplash.com/photo-1678652197831-2d180705cd2c?w=800',
          'https://images.unsplash.com/photo-1678652197950-2d180705cd2c?w=800',
        ],
        colors: ['أسود', 'فضي', 'ذهبي', 'بنفسجي داكن'],
        storage: ['128GB', '256GB', '512GB'],
        specifications: {
          screen: {
            size: '6.1 بوصة',
            type: 'Super Retina XDR OLED',
            resolution: '2556 × 1179',
            refresh: '120Hz ProMotion',
          },
          processor: {
            name: 'Apple A16 Bionic',
            cores: '6 نوى',
            gpu: 'GPU 5 نوى',
          },
          memory: {
            ram: '6 جيجابايت',
            storage: '128 جيجابايت',
          },
          camera: {
            main: '48 ميجابكسل',
            ultrawide: '12 ميجابكسل',
            telephoto: '12 ميجابكسل (3x)',
            front: '12 ميجابكسل',
            features: ['تسجيل فيديو 4K', 'وضع السينما', 'ProRAW', 'Photonic Engine'],
          },
          battery: {
            capacity: '3200 mAh',
            charging: 'شحن سريع 20W',
            wireless: 'MagSafe 15W',
          },
          connectivity: ['5G', 'WiFi 6', 'Bluetooth 5.3', 'NFC'],
          dimensions: {
            height: '147.5 مم',
            width: '71.5 مم',
            depth: '7.85 مم',
            weight: '206 جرام',
          },
        },
        stock: 8,
        condition: 'NEW',
        warranty: 'سنة واحدة - ضمان الوكيل',
        rating: 4.6,
        reviewsCount: 203,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        nameAr: 'آبل ووتش سيريز 9',
        nameEn: 'Apple Watch Series 9',
        descriptionAr: 'ساعة ذكية متطورة بمعالج S9 وشاشة Retina دائمة التشغيل. تتميز بمستشعرات صحية متقدمة وإيماءة النقر المزدوج الجديدة.',
        descriptionEn: 'Advanced smartwatch with S9 chip and Always-On Retina display. Features advanced health sensors and new Double Tap gesture.',
        price: 1899,
        originalPrice: 2199,
        brand: 'Apple',
        category: 'smartwatches',
        images: [
          'https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=800',
          'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=800',
        ],
        colors: ['ألمنيوم منتصف الليل', 'ألمنيوم فضي', 'ألمنيوم وردي'],
        storage: ['GPS', 'GPS + Cellular'],
        specifications: {
          screen: {
            size: '45 مم',
            type: 'LTPO OLED Retina',
            resolution: '396 × 484',
            brightness: '2000 شمعة',
          },
          processor: {
            name: 'Apple S9',
            cores: 'ثنائي النواة',
          },
          sensors: [
            'مستشعر نبضات القلب',
            'مستشعر الأكسجين',
            'مستشعر تخطيط القلب',
            'مستشعر الحرارة',
            'جيروسكوب',
            'بوصلة',
            'مقياس الارتفاع',
          ],
          battery: {
            life: 'حتى 18 ساعة',
            charging: 'شحن سريع USB-C',
          },
          connectivity: ['WiFi', 'Bluetooth 5.3', 'GPS', 'NFC'],
          waterproof: 'مقاومة للماء حتى 50 متر',
          features: [
            'إيماءة النقر المزدوج',
            'Always-On Display',
            'كشف السقوط',
            'كشف الحوادث',
            'تتبع النوم',
            'تتبع الدورة الشهرية',
          ],
        },
        stock: 35,
        condition: 'NEW',
        warranty: 'سنة واحدة - ضمان الوكيل',
        rating: 4.9,
        reviewsCount: 156,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        nameAr: 'إيربودز برو 2',
        nameEn: 'AirPods Pro 2',
        descriptionAr: 'سماعات لاسلكية بإلغاء ضوضاء نشط محسّن وصوت تكيفي. تأتي مع علبة شحن USB-C ومكبر صوت مدمج.',
        descriptionEn: 'Wireless earbuds with enhanced Active Noise Cancellation and Adaptive Audio. Comes with USB-C charging case and built-in speaker.',
        price: 999,
        originalPrice: 1199,
        brand: 'Apple',
        category: 'headphones',
        images: [
          'https://images.unsplash.com/photo-1606841837239-c5a1a4a07af7?w=800',
          'https://images.unsplash.com/photo-1606841837315-c5a1a4a07af7?w=800',
        ],
        colors: ['أبيض'],
        storage: [],
        specifications: {
          chip: 'Apple H2',
          audio: {
            drivers: 'مكبر صوت ديناميكي مخصص',
            microphones: '4 ميكروفونات',
            features: [
              'إلغاء الضوضاء النشط',
              'الصوت التكيفي',
              'الوضع الشفاف',
              'الصوت المكاني',
              'تتبع الرأس الديناميكي',
            ],
          },
          battery: {
            earbuds: 'حتى 6 ساعات',
            withCase: 'حتى 30 ساعة',
            charging: 'USB-C / MagSafe / Qi',
          },
          controls: [
            'التحكم باللمس',
            'التحكم بالحجم بالسحب',
            'كشف الأذن',
          ],
          connectivity: ['Bluetooth 5.3'],
          waterproof: 'مقاومة للماء والعرق IPX4',
          sizes: ['4 أحجام من سدادات السيليكون'],
        },
        stock: 67,
        condition: 'NEW',
        warranty: 'سنة واحدة - ضمان الوكيل',
        rating: 4.8,
        reviewsCount: 234,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        nameAr: 'آيباد برو 12.9 M2',
        nameEn: 'iPad Pro 12.9 M2',
        descriptionAr: 'جهاز لوحي احترافي بمعالج M2 وشاشة Liquid Retina XDR. مثالي للمبدعين والمحترفين مع دعم Apple Pencil وMagic Keyboard.',
        descriptionEn: 'Professional tablet with M2 chip and Liquid Retina XDR display. Perfect for creators and professionals with Apple Pencil and Magic Keyboard support.',
        price: 5299,
        originalPrice: 5799,
        brand: 'Apple',
        category: 'tablets',
        images: [
          'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=800',
          'https://images.unsplash.com/photo-1561154464-82e9adf32764?w=800',
        ],
        colors: ['فضي', 'رمادي فلكي'],
        storage: ['256GB', '512GB', '1TB', '2TB'],
        specifications: {
          screen: {
            size: '12.9 بوصة',
            type: 'Liquid Retina XDR',
            resolution: '2732 × 2048',
            refresh: '120Hz ProMotion',
            brightness: '1000 شمعة (1600 HDR)',
          },
          processor: {
            name: 'Apple M2',
            cores: '8 نوى',
            gpu: 'GPU 10 نوى',
          },
          memory: {
            ram: '8 جيجابايت',
            storage: '256 جيجابايت',
          },
          camera: {
            main: '12 ميجابكسل',
            ultrawide: '10 ميجابكسل',
            front: '12 ميجابكسل TrueDepth',
            features: ['تسجيل فيديو 4K', 'ProRes', 'Center Stage'],
          },
          battery: {
            life: 'حتى 10 ساعات',
            charging: 'USB-C شحن سريع',
          },
          connectivity: ['WiFi 6E', 'Bluetooth 5.3', 'USB-C Thunderbolt'],
          accessories: ['Apple Pencil 2', 'Magic Keyboard', 'Smart Folio'],
          dimensions: {
            height: '280.6 مم',
            width: '214.9 مم',
            depth: '6.4 مم',
            weight: '682 جرام',
          },
        },
        stock: 12,
        condition: 'NEW',
        warranty: 'سنة واحدة - ضمان الوكيل',
        rating: 4.9,
        reviewsCount: 78,
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

addSampleProducts()
