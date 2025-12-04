import { MongoClient } from 'mongodb'
import * as dotenv from 'dotenv'

dotenv.config()

async function initProfessionalHomepage() {
  const client = new MongoClient(process.env.DATABASE_URL || '')

  try {
    await client.connect()
    console.log('✅ متصل بقاعدة البيانات')

    const db = client.db()
    const homepageCollection = db.collection('Homepage')

    // حذف التصميم القديم
    await homepageCollection.deleteMany({})
    console.log('🗑️  تم حذف التصميم القديم')

    const homepageConfig = {
      active: true,
      sections: [
        // 1. Hero Slider - سلايدر رئيسي احترافي
        {
          id: 'hero-slider',
          type: 'hero',
          title: 'سلايدر رئيسي',
          subtitle: 'عرض أحدث العروض والمنتجات',
          order: 1,
          active: true,
          settings: {
            autoplay: true,
            interval: 5000,
            height: 'tall',
            showArrows: true,
            showDots: true,
          },
          content: {
            slides: [
              {
                title: 'أحدث الجوالات الذكية',
                subtitle: 'تكنولوجيا متقدمة بين يديك',
                description: 'اكتشف أقوى الأجهزة مع أداء استثنائي وتصميم عصري',
                image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=1920&q=80',
                buttonText: 'تسوق الآن',
                buttonLink: '/products',
                buttonStyle: 'primary',
              },
              {
                title: 'عروض حصرية',
                subtitle: 'خصومات تصل إلى 40%',
                description: 'على مجموعة مختارة من الجوالات والتابلت',
                image: 'https://images.unsplash.com/photo-1592286927505-2fd0f3a1f3b8?w=1920&q=80',
                buttonText: 'اكتشف العروض',
                buttonLink: '/products',
                buttonStyle: 'secondary',
              },
              {
                title: 'تابلت بأداء قوي',
                subtitle: 'للعمل والترفيه',
                description: 'شاشات كبيرة وأداء سريع لتجربة استثنائية',
                image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=1920&q=80',
                buttonText: 'تسوق التابلت',
                buttonLink: '/products?category=tablets',
                buttonStyle: 'primary',
              },
              {
                title: 'إكسسوارات أصلية',
                subtitle: 'أكمل تجربتك',
                description: 'شواحن سريعة، سماعات، وحافظات عالية الجودة',
                image: 'https://images.unsplash.com/photo-1556656793-08538906a9f8?w=1920&q=80',
                buttonText: 'تسوق الإكسسوارات',
                buttonLink: '/products?category=accessories',
                buttonStyle: 'primary',
              },
            ],
          },
        },

        // 2. Categories - فئات المنتجات
        {
          id: 'categories',
          type: 'categories',
          title: 'تسوق حسب الفئة',
          subtitle: 'اختر ما يناسبك من منتجاتنا المتنوعة',
          order: 2,
          active: true,
          settings: {
            columns: 6,
            showIcons: true,
            style: 'gradient',
          },
          content: {
            items: [
              { 
                name: 'جوالات', 
                icon: '📱', 
                link: '/products?category=phones',
                color: 'from-blue-500 to-blue-600',
                count: '25+'
              },
              { 
                name: 'تابلت', 
                icon: '📲', 
                link: '/products?category=tablets',
                color: 'from-purple-500 to-purple-600',
                count: '15+'
              },
              { 
                name: 'سماعات', 
                icon: '🎧', 
                link: '/products?category=headphones',
                color: 'from-pink-500 to-pink-600',
                count: '30+'
              },
              { 
                name: 'ساعات ذكية', 
                icon: '⌚', 
                link: '/products?category=watches',
                color: 'from-green-500 to-green-600',
                count: '20+'
              },
              { 
                name: 'شواحن', 
                icon: '🔌', 
                link: '/products?category=chargers',
                color: 'from-orange-500 to-orange-600',
                count: '40+'
              },
              { 
                name: 'حافظات', 
                icon: '📦', 
                link: '/products?category=cases',
                color: 'from-red-500 to-red-600',
                count: '50+'
              },
            ],
          },
        },

        // 3. Featured Products - منتجات مميزة
        {
          id: 'featured-products',
          type: 'products',
          title: 'أحدث المنتجات',
          subtitle: 'اكتشف أحدث الجوالات والتابلت لدينا',
          order: 3,
          active: true,
          settings: {
            displayType: 'grid',
            columns: 3,
            limit: 6,
            showPrice: true,
            showAddToCart: true,
          },
          content: {
            productIds: [],
            source: 'latest',
          },
        },

        // 4. Banner - بنر إعلاني كبير
        {
          id: 'promo-banner',
          type: 'banner',
          title: 'عروض خاصة',
          subtitle: 'خصومات حصرية لفترة محدودة',
          order: 4,
          active: true,
          settings: {
            fullWidth: true,
            height: 'large',
            style: 'gradient',
          },
          content: {
            image: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1920&q=80',
            title: 'عروض الموسم',
            subtitle: 'خصومات تصل إلى 40%',
            description: 'على جميع الجوالات والتابلت والإكسسوارات',
            buttonText: 'تسوق الآن',
            buttonLink: '/products',
            gradient: 'from-blue-600 via-purple-600 to-pink-600',
          },
        },

        // 5. Best Sellers - الأكثر مبيعاً
        {
          id: 'best-sellers',
          type: 'products',
          title: 'الأكثر مبيعاً',
          subtitle: 'المنتجات الأكثر طلباً من عملائنا',
          order: 5,
          active: true,
          settings: {
            displayType: 'grid',
            columns: 3,
            limit: 6,
            showPrice: true,
            showAddToCart: true,
            showBadge: true,
          },
          content: {
            productIds: [],
            source: 'bestsellers',
          },
        },

        // 6. Promotional Images - صور دعائية
        {
          id: 'promo-images',
          type: 'image-grid',
          title: 'عروض حصرية',
          subtitle: 'اكتشف أفضل العروض والمنتجات',
          order: 6,
          active: true,
          settings: {
            columns: 3,
            gap: 'large',
            rounded: true,
          },
          content: {
            images: [
              {
                title: 'جوالات بأسعار مميزة',
                subtitle: 'خصم 30%',
                image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&q=80',
                link: '/products?category=phones',
                overlay: true,
              },
              {
                title: 'تابلت للعمل والترفيه',
                subtitle: 'عروض خاصة',
                image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=800&q=80',
                link: '/products?category=tablets',
                overlay: true,
              },
              {
                title: 'إكسسوارات أصلية',
                subtitle: 'جودة عالية',
                image: 'https://images.unsplash.com/photo-1556656793-08538906a9f8?w=800&q=80',
                link: '/products?category=accessories',
                overlay: true,
              },
            ],
          },
        },

        // 7. Brands - العلامات التجارية
        {
          id: 'brands',
          type: 'brands',
          title: 'العلامات التجارية',
          subtitle: 'نوفر أفضل العلامات التجارية العالمية',
          order: 7,
          active: true,
          settings: {
            columns: 6,
            showLogos: true,
          },
          content: {
            brands: [
              { name: 'Apple', logo: '🍎', link: '/products?brand=Apple' },
              { name: 'Samsung', logo: '📱', link: '/products?brand=Samsung' },
              { name: 'Xiaomi', logo: '📲', link: '/products?brand=Xiaomi' },
              { name: 'Huawei', logo: '📱', link: '/products?brand=Huawei' },
              { name: 'Oppo', logo: '📲', link: '/products?brand=Oppo' },
              { name: 'Realme', logo: '📱', link: '/products?brand=Realme' },
            ],
          },
        },

        // 8. Features - مميزات المتجر
        {
          id: 'features',
          type: 'features',
          title: 'لماذا تختارنا',
          subtitle: 'نقدم لك أفضل تجربة تسوق',
          order: 8,
          active: true,
          settings: {
            columns: 4,
            style: 'cards',
            background: 'gradient',
          },
          content: {
            features: [
              {
                icon: '🚚',
                title: 'شحن مجاني',
                description: 'على جميع الطلبات فوق 500 ريال',
              },
              {
                icon: '🔒',
                title: 'دفع آمن',
                description: 'جميع طرق الدفع محمية ومؤمنة',
              },
              {
                icon: '↩️',
                title: 'إرجاع مجاني',
                description: 'خلال 14 يوم من تاريخ الشراء',
              },
              {
                icon: '💬',
                title: 'دعم فني',
                description: 'فريق دعم متاح على مدار الساعة',
              },
            ],
          },
        },
      ],
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    await homepageCollection.insertOne(homepageConfig)
    console.log('✅ تم إنشاء التصميم الاحترافي الجديد')

    console.log('\n📊 أقسام الصفحة الرئيسية:')
    homepageConfig.sections.forEach((section) => {
      console.log(`  ${section.order}. ${section.type} - ${section.title}`)
    })

    console.log('\n✨ التصميم الاحترافي جاهز!')
    console.log('\n📝 الخطوات التالية:')
    console.log('1. شاهد الصفحة الرئيسية: http://localhost:3000')
    console.log('2. يمكنك التعديل من: http://localhost:3000/admin/homepage')
    console.log('3. أضف معرفات المنتجات في قسم المنتجات')
  } catch (error) {
    console.error('❌ خطأ:', error)
  } finally {
    await client.close()
  }
}

initProfessionalHomepage()
