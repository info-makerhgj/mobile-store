import { MongoClient } from 'mongodb'
import dotenv from 'dotenv'

dotenv.config()

const uri = process.env.DATABASE_URL || ''

async function initHomepage() {
  const client = new MongoClient(uri)

  try {
    await client.connect()
    const db = client.db()
    const homepageCollection = db.collection('Homepage')

    // Check if homepage config exists
    const existing = await homepageCollection.findOne({ active: true })
    
    if (existing) {
      console.log('✅ إعدادات الصفحة الرئيسية موجودة بالفعل')
      return
    }

    // Create default homepage configuration
    const defaultConfig = {
      active: true,
      createdAt: new Date(),
      updatedAt: new Date(),
      
      // Hero Banners
      heroBanners: [
        {
          id: '1',
          title: 'عروض خاصة',
          subtitle: 'خصومات تصل إلى 30%',
          description: 'على جميع منتجات الهواتف الذكية',
          image: '🎉',
          buttonText: 'تسوق الآن',
          buttonLink: '/products',
          order: 1,
          active: true,
        },
        {
          id: '2',
          title: 'أحدث الإصدارات',
          subtitle: 'تكنولوجيا متقدمة',
          description: 'اكتشف أحدث الهواتف الذكية',
          image: '📱',
          buttonText: 'اكتشف المزيد',
          buttonLink: '/products',
          order: 2,
          active: true,
        },
      ],
      
      // Categories
      categories: [
        { id: '1', name: 'جوالات', nameEn: 'Smartphones', icon: '📱', link: '/products?category=smartphones', order: 1, active: true },
        { id: '2', name: 'ساعات ذكية', nameEn: 'Smartwatches', icon: '⌚', link: '/products?category=smartwatches', order: 2, active: true },
        { id: '3', name: 'سماعات', nameEn: 'Headphones', icon: '🎧', link: '/products?category=headphones', order: 3, active: true },
        { id: '4', name: 'إكسسوارات', nameEn: 'Accessories', icon: '🔌', link: '/products?category=accessories', order: 4, active: true },
      ],
      
      // Featured Products Section
      featuredProducts: {
        title: 'المنتجات المميزة',
        subtitle: 'أفضل اختياراتنا لك',
        productIds: [], // Will be populated with actual product IDs
        displayType: 'grid',
        limit: 8,
        active: true,
      },
      
      // Special Offers Section
      specialOffers: {
        title: 'عروض خاصة',
        subtitle: 'لفترة محدودة',
        productIds: [], // Will be populated with actual product IDs
        badge: 'خصم 30%',
        active: true,
      },
      
      // Custom Sections
      customSections: [],
    }

    await homepageCollection.insertOne(defaultConfig)
    console.log('✅ تم إنشاء إعدادات الصفحة الرئيسية بنجاح!')

  } catch (error) {
    console.error('❌ خطأ:', error)
  } finally {
    await client.close()
  }
}

initHomepage()
