import { MongoClient } from 'mongodb'
import * as dotenv from 'dotenv'

dotenv.config()

const DATABASE_URL = process.env.DATABASE_URL || 'mongodb://localhost:27017/mobile-store'

async function initHomepageDemo() {
  const client = new MongoClient(DATABASE_URL)

  try {
    await client.connect()
    console.log('✅ Connected to MongoDB')

    const db = client.db()
    const homepageCollection = db.collection('HomepageConfig')
    const productsCollection = db.collection('Product')

    // Get some products for the products sections
    const products = await productsCollection.find({}).limit(12).toArray()
    const productIds = products.map((p) => p._id.toString())

    // Delete existing config
    await homepageCollection.deleteMany({})
    console.log('🗑️  Cleared existing homepage config')

    // Create demo homepage config
    const homepageConfig = {
      active: true,
      sections: [
        // 1. Hero Slider
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

        // 2. Categories
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
              { name: 'جوالات', icon: '📱', link: '/products?category=phones' },
              { name: 'تابلت', icon: '📲', link: '/products?category=tablets' },
              { name: 'سماعات', icon: '🎧', link: '/products?category=headphones' },
              { name: 'ساعات ذكية', icon: '⌚', link: '/products?category=watches' },
              { name: 'شواحن', icon: '🔌', link: '/products?category=chargers' },
              { name: 'حافظات', icon: '📦', link: '/products?category=cases' },
            ],
          },
        },

        // 3. Featured Products
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

        // 4. Banner
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

        // 5. Best Sellers
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

        // 6. Image Grid
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
                link: '/products?category=phones',
              },
              {
                image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=800&q=80',
                link: '/products?category=tablets',
              },
              {
                image: 'https://images.unsplash.com/photo-1556656793-08538906a9f8?w=800&q=80',
                link: '/products?category=accessories',
              },
            ],
          },
        },

        // 7. Text Section
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
    console.log('✅ Homepage demo config created successfully!')

    console.log('\n📊 Summary:')
    console.log(`- Total sections: ${homepageConfig.sections.length}`)
    console.log(`- Hero slides: ${homepageConfig.sections[0]?.content?.slides?.length || 0}`)
    console.log(`- Categories: ${homepageConfig.sections[1]?.content?.categories?.length || 0}`)
    console.log(`- Products in section 1: ${homepageConfig.sections[2]?.content?.productIds?.length || 0}`)
    console.log(`- Products in section 2: ${homepageConfig.sections[4]?.content?.productIds?.length || 0}`)

    console.log('\n🎉 Done! You can now:')
    console.log('1. Visit http://localhost:3000 to see the dynamic homepage')
    console.log('2. Visit http://localhost:3000/admin/homepage-builder to manage sections')
  } catch (error) {
    console.error('❌ Error:', error)
  } finally {
    await client.close()
  }
}

initHomepageDemo()
