import { Router } from 'express'
import { MongoClient } from 'mongodb'
import bcrypt from 'bcryptjs'

const router = Router()
const mongoUrl = process.env.DATABASE_URL || ''

router.post('/reset', async (req, res) => {
  const client = new MongoClient(mongoUrl)

  try {
    await client.connect()
    const db = client.db()

    // مسح كل البيانات القديمة
    await db.collection('User').deleteMany({})
    await db.collection('Product').deleteMany({})
    await db.collection('Settings').deleteMany({})
    await db.collection('PaymentSettings').deleteMany({})
    await db.collection('HomepageConfig').deleteMany({})
    await db.collection('FeaturedDealsSettings').deleteMany({})

    await client.close()
    res.json({ success: true, message: 'Database cleared!' })
  } catch (error: any) {
    await client.close()
    res.status(500).json({ success: false, error: error.message })
  }
})

router.post('/initialize', async (req, res) => {
  const client = new MongoClient(mongoUrl)

  try {
    await client.connect()
    const db = client.db()

    // 1. Create Admin
    const usersCollection = db.collection('User')
    const existingAdmin = await usersCollection.findOne({ email: 'admin@abaad.sa' })
    
    if (!existingAdmin) {
      const hashedPassword = await bcrypt.hash('admin123', 10)
      await usersCollection.insertOne({
        name: 'مدير المتجر',
        email: 'admin@abaad.sa',
        password: hashedPassword,
        role: 'ADMIN',
        createdAt: new Date(),
        updatedAt: new Date()
      })
    }

    // 2. Create Products
    const productsCollection = db.collection('Product')
    const existingProducts = await productsCollection.countDocuments()
    
    if (existingProducts === 0) {
      const sampleProducts = [
        {
          name: 'iPhone 15 Pro Max',
          nameEn: 'iPhone 15 Pro Max',
          description: 'أحدث إصدار من آيفون مع شريحة A17 Pro وكاميرا 48 ميجابكسل',
          price: 5499,
          originalPrice: 5999,
          stock: 25,
          category: 'آيفون',
          brand: 'Apple',
          images: ['https://placehold.co/800x800/1a1a1a/ffffff/png?text=iPhone+15+Pro'],
          featured: true,
          onSale: true,
          discount: 8,
          specs: {
            screen: '6.7 بوصة Super Retina XDR',
            processor: 'A17 Pro',
            ram: '8 جيجا',
            storage: '256 جيجا',
            camera: '48 ميجابكسل',
            battery: '4422 مللي أمبير'
          },
          createdAt: new Date()
        },
        {
          name: 'Samsung Galaxy S24 Ultra',
          nameEn: 'Samsung Galaxy S24 Ultra',
          description: 'هاتف سامسونج الرائد مع قلم S Pen وكاميرا 200 ميجابكسل',
          price: 4799,
          originalPrice: 5299,
          stock: 30,
          category: 'سامسونج',
          brand: 'Samsung',
          images: ['https://placehold.co/800x800/000000/ffffff/png?text=Galaxy+S24+Ultra'],
          featured: true,
          onSale: true,
          discount: 9,
          specs: {
            screen: '6.8 بوصة Dynamic AMOLED',
            processor: 'Snapdragon 8 Gen 3',
            ram: '12 جيجا',
            storage: '256 جيجا',
            camera: '200 ميجابكسل',
            battery: '5000 مللي أمبير'
          },
          createdAt: new Date()
        },
        {
          name: 'Xiaomi 14 Pro',
          nameEn: 'Xiaomi 14 Pro',
          description: 'هاتف شاومي الرائد بسعر منافس وأداء قوي',
          price: 2999,
          originalPrice: 3499,
          stock: 40,
          category: 'شاومي',
          brand: 'Xiaomi',
          images: ['https://placehold.co/800x800/FF6900/ffffff/png?text=Xiaomi+14+Pro'],
          featured: true,
          onSale: true,
          discount: 14,
          specs: {
            screen: '6.73 بوصة AMOLED',
            processor: 'Snapdragon 8 Gen 3',
            ram: '12 جيجا',
            storage: '256 جيجا',
            camera: '50 ميجابكسل',
            battery: '4880 مللي أمبير'
          },
          createdAt: new Date()
        }
      ]
      
      await productsCollection.insertMany(sampleProducts)
    }

    // 3. Setup Homepage
    const homepageCollection = db.collection('HomepageConfig')
    await homepageCollection.updateOne(
      {},
      {
        $set: {
          active: true,
          sections: [
            {
              id: 'hero-1',
              type: 'hero',
              title: 'أحدث الجوالات بأفضل الأسعار',
              subtitle: 'اكتشف مجموعتنا الحصرية',
              order: 1,
              active: true,
              settings: {},
              content: {
                slides: [
                  {
                    title: 'أحدث الجوالات',
                    subtitle: 'بأفضل الأسعار',
                    description: 'اكتشف مجموعتنا الحصرية من أحدث الهواتف الذكية',
                    image: 'https://placehold.co/1920x600/6366f1/ffffff/png?text=أحدث+الجوالات',
                    buttonText: 'تسوق الآن',
                    buttonLink: '/products'
                  }
                ]
              }
            },
            {
              id: 'featured-1',
              type: 'featured-products',
              title: 'المنتجات المميزة',
              subtitle: 'أفضل اختياراتنا لك',
              order: 2,
              active: true,
              settings: {},
              content: {}
            }
          ],
          updatedAt: new Date()
        }
      },
      { upsert: true }
    )

    // 4. Setup Settings
    const settingsCollection = db.collection('Settings')
    await settingsCollection.updateOne(
      { key: 'footer' },
      {
        $set: {
          key: 'footer',
          value: {
            brandName: 'أبعاد التواصل',
            brandTagline: 'أبعاد جديدة للتواصل التقني',
            brandDescription: 'متجرك الموثوق لأحدث الجوالات',
            phone: '+966 50 123 4567',
            email: 'info@abaad.sa',
            socialMedia: {
              instagram: '#',
              twitter: '#',
              facebook: '#'
            },
            quickLinks: [
              { title: 'من نحن', url: '/about' },
              { title: 'المنتجات', url: '/products' }
            ],
            supportLinks: [
              { title: 'سياسة الضمان', url: '/warranty' },
              { title: 'الخصوصية', url: '/privacy' }
            ],
            copyright: '© 2025 أبعاد التواصل',
            features: [
              { icon: '🇸🇦', text: 'السعودية' },
              { icon: '💳', text: 'دفع آمن' }
            ]
          }
        }
      },
      { upsert: true }
    )

    // 5. Payment Settings
    const paymentCollection = db.collection('PaymentSettings')
    await paymentCollection.updateOne(
      { provider: 'cod' },
      {
        $set: {
          provider: 'cod',
          enabled: true,
          config: { fee: 0, feeType: 'fixed' }
        }
      },
      { upsert: true }
    )

    await client.close()

    res.json({
      success: true,
      message: 'Database initialized successfully!',
      data: {
        admin: 'admin@abaad.sa / admin123',
        products: existingProducts === 0 ? 3 : existingProducts,
        settings: 'configured'
      }
    })

  } catch (error: any) {
    await client.close()
    res.status(500).json({ success: false, error: error.message })
  }
})

export default router
