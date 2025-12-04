import { MongoClient } from 'mongodb'
import bcrypt from 'bcryptjs'

const mongoUrl = 'mongodb+srv://atw03817_db_user:jP9AouAfbaifknI4@mobile-store-cluster.cylotee.mongodb.net/mobile_store?retryWrites=true&w=majority&appName=mobile-store-cluster'

async function setupComplete() {
  const client = new MongoClient(mongoUrl)

  try {
    await client.connect()
    console.log('✅ Connected to MongoDB Atlas')

    const db = client.db()

    // 1. Create Admin User
    console.log('\n📝 Creating Admin User...')
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
      console.log('✅ Admin created: admin@abaad.sa / admin123')
    } else {
      console.log('⚠️  Admin already exists')
    }

    // 2. Create Sample Products
    console.log('\n📱 Creating Sample Products...')
    const productsCollection = db.collection('Product')
    
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
        images: ['https://via.placeholder.com/800x800/1a1a1a/ffffff?text=iPhone+15+Pro'],
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
        createdAt: new Date(),
        updatedAt: new Date()
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
        images: ['https://via.placeholder.com/800x800/000000/ffffff?text=Galaxy+S24+Ultra'],
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
        createdAt: new Date(),
        updatedAt: new Date()
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
        images: ['https://via.placeholder.com/800x800/FF6900/ffffff?text=Xiaomi+14+Pro'],
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
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'OPPO Find X7 Pro',
        nameEn: 'OPPO Find X7 Pro',
        description: 'هاتف أوبو الرائد مع كاميرا Hasselblad',
        price: 3499,
        originalPrice: 3999,
        stock: 20,
        category: 'أوبو',
        brand: 'OPPO',
        images: ['https://via.placeholder.com/800x800/00A862/ffffff?text=OPPO+Find+X7'],
        featured: false,
        onSale: true,
        discount: 13,
        specs: {
          screen: '6.82 بوصة AMOLED',
          processor: 'Snapdragon 8 Gen 3',
          ram: '12 جيجا',
          storage: '256 جيجا',
          camera: '50 ميجابكسل',
          battery: '5000 مللي أمبير'
        },
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Google Pixel 8 Pro',
        nameEn: 'Google Pixel 8 Pro',
        description: 'هاتف جوجل مع أفضل كاميرا وذكاء اصطناعي',
        price: 4299,
        originalPrice: 4799,
        stock: 15,
        category: 'جوجل',
        brand: 'Google',
        images: ['https://via.placeholder.com/800x800/4285F4/ffffff?text=Pixel+8+Pro'],
        featured: true,
        onSale: true,
        discount: 10,
        specs: {
          screen: '6.7 بوصة LTPO OLED',
          processor: 'Google Tensor G3',
          ram: '12 جيجا',
          storage: '256 جيجا',
          camera: '50 ميجابكسل',
          battery: '5050 مللي أمبير'
        },
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'OnePlus 12',
        nameEn: 'OnePlus 12',
        description: 'هاتف ون بلس بشحن سريع 100 واط',
        price: 3299,
        originalPrice: 3799,
        stock: 35,
        category: 'ون بلس',
        brand: 'OnePlus',
        images: ['https://via.placeholder.com/800x800/EB0028/ffffff?text=OnePlus+12'],
        featured: false,
        onSale: true,
        discount: 13,
        specs: {
          screen: '6.82 بوصة AMOLED',
          processor: 'Snapdragon 8 Gen 3',
          ram: '12 جيجا',
          storage: '256 جيجا',
          camera: '50 ميجابكسل',
          battery: '5400 مللي أمبير'
        },
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]

    const existingProducts = await productsCollection.countDocuments()
    if (existingProducts === 0) {
      await productsCollection.insertMany(sampleProducts)
      console.log(`✅ Created ${sampleProducts.length} products`)
    } else {
      console.log(`⚠️  ${existingProducts} products already exist`)
    }

    // 3. Setup Homepage
    console.log('\n🏠 Setting up Homepage...')
    const homepageCollection = db.collection('Homepage')
    
    const homepage = {
      sections: [
        {
          id: 'hero-1',
          type: 'hero',
          title: 'أحدث الجوالات بأفضل الأسعار',
          subtitle: 'اكتشف مجموعتنا الحصرية',
          order: 1,
          active: true,
          settings: {
            showButton: true,
            buttonText: 'تسوق الآن',
            buttonLink: '/products'
          }
        },
        {
          id: 'featured-1',
          type: 'featured-products',
          title: 'المنتجات المميزة',
          subtitle: 'أفضل اختياراتنا لك',
          order: 2,
          active: true,
          settings: {
            limit: 6,
            showPrice: true
          }
        },
        {
          id: 'deals-1',
          type: 'deals',
          title: 'عروض حصرية',
          subtitle: 'خصومات تصل إلى 20%',
          order: 3,
          active: true,
          settings: {
            showTimer: true,
            limit: 4
          }
        }
      ],
      updatedAt: new Date()
    }

    await homepageCollection.updateOne({}, { $set: homepage }, { upsert: true })
    console.log('✅ Homepage configured')

    // 4. Setup Settings
    console.log('\n⚙️  Setting up Store Settings...')
    const settingsCollection = db.collection('Settings')
    
    const settings = [
      {
        key: 'footer',
        value: {
          brandName: 'أبعاد التواصل',
          brandTagline: 'أبعاد جديدة للتواصل التقني',
          brandDescription: 'متجرك الموثوق لأحدث الجوالات والإكسسوارات الأصلية',
          phone: '+966 50 123 4567',
          email: 'info@abaad.sa',
          socialMedia: {
            instagram: 'https://instagram.com/abaad',
            twitter: 'https://twitter.com/abaad',
            facebook: 'https://facebook.com/abaad'
          },
          quickLinks: [
            { title: 'من نحن', url: '/about' },
            { title: 'المنتجات', url: '/products' },
            { title: 'العروض', url: '/offers' },
            { title: 'تواصل معنا', url: '/contact' }
          ],
          supportLinks: [
            { title: 'سياسة الضمان', url: '/warranty' },
            { title: 'سياسة الإرجاع', url: '/return' },
            { title: 'الخصوصية', url: '/privacy' },
            { title: 'الشروط', url: '/terms' }
          ],
          copyright: '© 2025 أبعاد التواصل. جميع الحقوق محفوظة',
          features: [
            { icon: '🇸🇦', text: 'السعودية' },
            { icon: '💳', text: 'دفع آمن' },
            { icon: '🚚', text: 'شحن سريع' }
          ]
        },
        updatedAt: new Date()
      }
    ]

    for (const setting of settings) {
      await settingsCollection.updateOne(
        { key: setting.key },
        { $set: setting },
        { upsert: true }
      )
    }
    console.log('✅ Store settings configured')

    // 5. Setup Payment Settings
    console.log('\n💳 Setting up Payment Settings...')
    const paymentCollection = db.collection('PaymentSettings')
    
    await paymentCollection.updateOne(
      { provider: 'cod' },
      {
        $set: {
          provider: 'cod',
          enabled: true,
          config: {
            fee: 0,
            feeType: 'fixed'
          },
          updatedAt: new Date()
        }
      },
      { upsert: true }
    )
    console.log('✅ Payment settings configured (COD enabled)')

    // 6. Setup Featured Deals
    console.log('\n🎯 Setting up Featured Deals...')
    const dealsCollection = db.collection('FeaturedDealsSettings')
    
    await dealsCollection.updateOne(
      {},
      {
        $set: {
          title: 'عروض حصرية',
          subtitle: 'خصومات تصل إلى 20% على أفضل الأجهزة',
          enabled: true,
          maxDiscount: 20,
          updatedAt: new Date()
        }
      },
      { upsert: true }
    )
    console.log('✅ Featured deals configured')

    console.log('\n' + '='.repeat(50))
    console.log('🎉 Setup Complete!')
    console.log('='.repeat(50))
    console.log('\n📊 Summary:')
    console.log('✅ Admin User: admin@abaad.sa / admin123')
    console.log(`✅ Products: ${sampleProducts.length} items`)
    console.log('✅ Homepage: Configured')
    console.log('✅ Settings: Configured')
    console.log('✅ Payment: COD enabled')
    console.log('✅ Deals: Configured')
    console.log('\n🚀 Ready to deploy!')
    console.log('🌐 Frontend: http://localhost:3000')
    console.log('🔧 Admin: http://localhost:3000/admin')

  } catch (error) {
    console.error('❌ Error:', error)
  } finally {
    await client.close()
  }
}

setupComplete()
