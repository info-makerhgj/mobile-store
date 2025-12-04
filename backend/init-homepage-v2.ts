import { MongoClient } from 'mongodb'
import * as dotenv from 'dotenv'

dotenv.config()

async function initHomepage() {
  const client = new MongoClient(process.env.DATABASE_URL || '')

  try {
    await client.connect()
    console.log('✅ Connected to MongoDB')

    const db = client.db()
    const homepageCollection = db.collection('Homepage')

    // Check if homepage config already exists
    const existing = await homepageCollection.findOne({ active: true })

    if (existing) {
      console.log('⚠️  Homepage config already exists')
      console.log('Do you want to reset it? (This will delete all sections)')
      // For now, we'll just update
      console.log('Updating existing config...')
    }

    const homepageConfig = {
      active: true,
      sections: [
        // Hero Section
        {
          id: '1',
          type: 'hero',
          title: 'مرحباً بك في متجرنا',
          subtitle: 'أفضل الهواتف والإكسسوارات',
          order: 1,
          active: true,
          settings: {
            autoplay: true,
            interval: 5000,
          },
          content: {
            slides: [
              {
                title: 'عروض خاصة',
                subtitle: 'خصم حتى 50%',
                description: 'على جميع الهواتف الذكية',
                image: '🎉',
                buttonText: 'تسوق الآن',
                buttonLink: '/products',
              },
              {
                title: 'أحدث الموديلات',
                subtitle: 'تكنولوجيا متقدمة',
                description: 'اكتشف أحدث الهواتف الذكية',
                image: '📱',
                buttonText: 'اكتشف المزيد',
                buttonLink: '/products',
              },
            ],
          },
        },

        // Categories Section
        {
          id: '2',
          type: 'categories',
          title: 'تسوق حسب الفئة',
          subtitle: 'اختر الفئة المناسبة لك',
          order: 2,
          active: true,
          settings: {
            columns: 4,
            showIcons: true,
          },
          content: {
            items: [
              { name: 'هواتف ذكية', icon: '📱', link: '/products?category=smartphones' },
              { name: 'ساعات ذكية', icon: '⌚', link: '/products?category=smartwatches' },
              { name: 'سماعات', icon: '🎧', link: '/products?category=headphones' },
              { name: 'إكسسوارات', icon: '🔌', link: '/products?category=accessories' },
            ],
          },
        },

        // Products Section (will be filled with actual product IDs)
        {
          id: '3',
          type: 'products',
          title: 'المنتجات المميزة',
          subtitle: 'أفضل المنتجات المختارة لك',
          order: 3,
          active: true,
          settings: {
            displayType: 'grid',
            columns: 4,
            limit: 8,
          },
          content: {
            productIds: [], // Will be filled with actual product IDs
            source: 'manual',
          },
        },

        // Banner Section
        {
          id: '4',
          type: 'banner',
          title: 'عروض الجمعة البيضاء',
          subtitle: 'خصومات تصل إلى 70%',
          order: 4,
          active: true,
          settings: {
            fullWidth: true,
            height: 'medium',
          },
          content: {
            image: '🎁',
            buttonText: 'تسوق العروض',
            buttonLink: '/products',
          },
        },

        // Text Section
        {
          id: '5',
          type: 'text',
          title: 'عن متجرنا',
          subtitle: 'نقدم لك أفضل المنتجات',
          order: 5,
          active: true,
          settings: {
            align: 'center',
            maxWidth: 'lg',
          },
          content: {
            text: 'نحن متجر متخصص في بيع الهواتف الذكية والإكسسوارات. نقدم لك أفضل المنتجات بأسعار تنافسية وجودة عالية.\n\nنسعى دائماً لتوفير أفضل تجربة تسوق لعملائنا من خلال خدمة عملاء متميزة وشحن سريع.',
          },
        },
      ],
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    if (existing) {
      await homepageCollection.updateOne({ active: true }, { $set: homepageConfig })
      console.log('✅ Homepage config updated')
    } else {
      await homepageCollection.insertOne(homepageConfig)
      console.log('✅ Homepage config created')
    }

    console.log('\n📊 Homepage Sections:')
    homepageConfig.sections.forEach((section) => {
      console.log(`  ${section.order}. ${section.type} - ${section.title}`)
    })

    console.log('\n✨ Homepage initialized successfully!')
    console.log('\n📝 Next steps:')
    console.log('1. Go to: http://localhost:3000/admin/homepage')
    console.log('2. Add/Edit/Reorder sections as you like')
    console.log('3. Add product IDs to the Products section')
    console.log('4. View your homepage at: http://localhost:3000')
  } catch (error) {
    console.error('❌ Error:', error)
  } finally {
    await client.close()
  }
}

initHomepage()
