import { MongoClient } from 'mongodb'
import * as dotenv from 'dotenv'

dotenv.config()

const DATABASE_URL = process.env.DATABASE_URL || 'mongodb://localhost:27017/mobile-store'

async function setupEverything() {
  const client = new MongoClient(DATABASE_URL)

  try {
    console.log('🚀 Starting complete setup...\n')

    await client.connect()
    console.log('✅ Connected to MongoDB\n')

    const db = client.db()

    // 1. Check/Create Admin
    console.log('👤 Checking admin account...')
    const usersCollection = db.collection('User')
    const adminExists = await usersCollection.findOne({ email: 'admin@example.com' })

    if (!adminExists) {
      console.log('   Creating admin account...')
      const bcrypt = require('bcryptjs')
      const hashedPassword = await bcrypt.hash('admin123', 10)

      await usersCollection.insertOne({
        name: 'Admin',
        email: 'admin@example.com',
        password: hashedPassword,
        role: 'ADMIN',
        createdAt: new Date(),
      })
      console.log('   ✅ Admin created: admin@example.com / admin123')
    } else {
      console.log('   ✅ Admin already exists')
    }

    // 2. Check/Add Products
    console.log('\n📦 Checking products...')
    const productsCollection = db.collection('Product')
    const productsCount = await productsCollection.countDocuments()

    if (productsCount === 0) {
      console.log('   Adding sample products...')
      // Add products here (simplified version)
      console.log('   ⚠️  No products found. Run: npm run add:products')
    } else {
      console.log(`   ✅ Found ${productsCount} products`)
    }

    // 3. Setup Homepage
    console.log('\n🏠 Setting up homepage...')
    const homepageCollection = db.collection('HomepageConfig')
    const products = await productsCollection.find({}).limit(12).toArray()
    const productIds = products.map((p) => p._id.toString())

    // Delete existing
    await homepageCollection.deleteMany({})

    // Create new
    const homepageConfig = {
      active: true,
      sections: [
        {
          id: '1',
          type: 'hero',
          title: 'بنر رئيسي',
          subtitle: 'شرائح ترحيبية',
          order: 1,
          active: true,
          settings: {},
          content: {
            slides: [
              {
                title: 'أحدث الجوالات الذكية',
                subtitle: 'تكنولوجيا متقدمة بين يديك',
                description: 'اكتشف أقوى الأجهزة مع أداء استثنائي وتصميم عصري',
                image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=1920&q=80',
                buttonText: 'تسوق الآن',
                buttonLink: '/products',
              },
              {
                title: 'عروض حصرية',
                subtitle: 'خصومات تصل إلى 40%',
                description: 'على مجموعة مختارة من الجوالات والتابلت',
                image: 'https://images.unsplash.com/photo-1592286927505-2fd0f3a1f3b8?w=1920&q=80',
                buttonText: 'اكتشف العروض',
                buttonLink: '/products',
              },
              {
                title: 'إكسسوارات أصلية',
                subtitle: 'أكمل تجربتك',
                description: 'شواحن سريعة، سماعات، وحافظات عالية الجودة',
                image: 'https://images.unsplash.com/photo-1556656793-08538906a9f8?w=1920&q=80',
                buttonText: 'تسوق الإكسسوارات',
                buttonLink: '/products',
              },
            ],
          },
        },
        {
          id: '2',
          type: 'categories',
          title: 'تسوق حسب الفئة',
          subtitle: 'اختر ما يناسبك من منتجاتنا المتنوعة',
          order: 2,
          active: true,
          settings: {},
          content: {
            categories: [
              { name: 'جوالات', icon: '📱', link: '/products' },
              { name: 'تابلت', icon: '📲', link: '/products' },
              { name: 'سماعات', icon: '🎧', link: '/products' },
              { name: 'ساعات ذكية', icon: '⌚', link: '/products' },
              { name: 'شواحن', icon: '🔌', link: '/products' },
              { name: 'حافظات', icon: '📦', link: '/products' },
            ],
          },
        },
        {
          id: '3',
          type: 'products',
          title: 'أحدث المنتجات',
          subtitle: 'اكتشف أحدث الجوالات والتابلت لدينا',
          order: 3,
          active: true,
          settings: {},
          content: {
            productIds: productIds.slice(0, 6),
          },
        },
        {
          id: '4',
          type: 'banner',
          title: 'عروض الموسم',
          subtitle: 'خصومات تصل إلى 40% على جميع المنتجات',
          order: 4,
          active: true,
          settings: {},
          content: {
            image: '',
            buttonText: 'تسوق الآن',
            buttonLink: '/products',
          },
        },
        {
          id: '5',
          type: 'products',
          title: 'الأكثر مبيعاً',
          subtitle: 'المنتجات الأكثر طلباً من عملائنا',
          order: 5,
          active: true,
          settings: {},
          content: {
            productIds: productIds.slice(6, 12),
          },
        },
        {
          id: '6',
          type: 'imageGrid',
          title: 'عروض حصرية',
          subtitle: 'اكتشف أفضل العروض والمنتجات',
          order: 6,
          active: true,
          settings: {},
          content: {
            images: [
              {
                image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&q=80',
                link: '/products',
              },
              {
                image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=800&q=80',
                link: '/products',
              },
              {
                image: 'https://images.unsplash.com/photo-1556656793-08538906a9f8?w=800&q=80',
                link: '/products',
              },
            ],
          },
        },
        {
          id: '7',
          type: 'text',
          title: 'عن متجرنا',
          subtitle: 'نحن نقدم الأفضل',
          order: 7,
          active: true,
          settings: {},
          content: {
            text: 'متجر أبعاد التواصل يقدم أفضل المنتجات الإلكترونية بأسعار تنافسية وجودة عالية.\nنحن نهتم بتوفير تجربة تسوق مميزة لعملائنا مع خدمة عملاء متميزة وشحن سريع.',
          },
        },
      ],
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    await homepageCollection.insertOne(homepageConfig)
    console.log('   ✅ Homepage configured with 7 sections')

    // Summary
    console.log('\n📊 Setup Summary:')
    console.log('   ✅ Admin: admin@example.com / admin123')
    console.log(`   ✅ Products: ${productsCount}`)
    console.log('   ✅ Homepage sections: 7')

    console.log('\n🎉 Setup complete!')
    console.log('\n📝 Next steps:')
    console.log('   1. Make sure backend is running: npm run dev')
    console.log('   2. Visit http://localhost:3000')
    console.log('   3. Login to admin: http://localhost:3000/admin/login')
    console.log('   4. Manage homepage: http://localhost:3000/admin/homepage-builder')

    if (productsCount === 0) {
      console.log('\n⚠️  Warning: No products found!')
      console.log('   Run: npm run add:products')
    }
  } catch (error) {
    console.error('❌ Error:', error)
  } finally {
    await client.close()
  }
}

setupEverything()
