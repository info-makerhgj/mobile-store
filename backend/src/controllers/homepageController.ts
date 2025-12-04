import { Request, Response } from 'express'
import { MongoClient, ObjectId } from 'mongodb'

// Get homepage configuration
export const getHomepageConfig = async (req: Request, res: Response) => {
  try {
    const client = new MongoClient(process.env.DATABASE_URL || '')

    await client.connect()
    const db = client.db()
    const homepageCollection = db.collection('HomepageConfig')

    const config = await homepageCollection.findOne({ active: true })

    await client.close()

    if (!config) {
      return res.status(404).json({ success: false, message: 'Homepage config not found' })
    }

    res.json(config)
  } catch (error) {
    console.error('Error fetching homepage config:', error)
    res.status(500).json({ success: false, message: 'Server error' })
  }
}

// Update entire homepage configuration
export const updateHomepageConfig = async (req: Request, res: Response) => {
  try {
    const client = new MongoClient(process.env.DATABASE_URL || '')

    await client.connect()
    const db = client.db()
    const homepageCollection = db.collection('HomepageConfig')

    const updateData = {
      ...req.body,
      updatedAt: new Date(),
    }

    const result = await homepageCollection.updateOne({ active: true }, { $set: updateData })

    const config = await homepageCollection.findOne({ active: true })

    await client.close()

    console.log('✅ Homepage config updated')

    res.json(config)
  } catch (error) {
    console.error('Error updating homepage config:', error)
    res.status(500).json({ success: false, message: 'Server error' })
  }
}

// ============= SECTIONS MANAGEMENT =============

// Add new section
export const addSection = async (req: Request, res: Response) => {
  try {
    const client = new MongoClient(process.env.DATABASE_URL || '')

    await client.connect()
    const db = client.db()
    const homepageCollection = db.collection('HomepageConfig')

    const config = await homepageCollection.findOne({ active: true })
    const currentSections = config?.sections || []

    const newSection = {
      id: new ObjectId().toString(),
      type: req.body.type,
      title: req.body.title || '',
      subtitle: req.body.subtitle || '',
      order: req.body.order || currentSections.length + 1,
      active: true,
      settings: req.body.settings || {},
      content: req.body.content || {},
    }

    await homepageCollection.updateOne(
      { active: true },
      {
        $push: { sections: newSection },
        $set: { updatedAt: new Date() },
      } as any
    )

    const updatedConfig = await homepageCollection.findOne({ active: true })

    await client.close()

    res.json(updatedConfig)
  } catch (error) {
    console.error('Error adding section:', error)
    res.status(500).json({ success: false, message: 'Server error' })
  }
}

// Update section
export const updateSection = async (req: Request, res: Response) => {
  try {
    const { sectionId } = req.params
    const client = new MongoClient(process.env.DATABASE_URL || '')

    await client.connect()
    const db = client.db()
    const homepageCollection = db.collection('HomepageConfig')

    const config = await homepageCollection.findOne({ active: true })

    if (config && config.sections) {
      const sectionIndex = config.sections.findIndex((s: any) => s.id === sectionId)

      if (sectionIndex !== -1) {
        config.sections[sectionIndex] = {
          ...config.sections[sectionIndex],
          ...req.body,
        }

        await homepageCollection.updateOne(
          { active: true },
          {
            $set: {
              sections: config.sections,
              updatedAt: new Date(),
            },
          }
        )
      }
    }

    const updatedConfig = await homepageCollection.findOne({ active: true })

    await client.close()

    res.json(updatedConfig)
  } catch (error) {
    console.error('Error updating section:', error)
    res.status(500).json({ success: false, message: 'Server error' })
  }
}

// Delete section
export const deleteSection = async (req: Request, res: Response) => {
  try {
    const { sectionId } = req.params
    const client = new MongoClient(process.env.DATABASE_URL || '')

    await client.connect()
    const db = client.db()
    const homepageCollection = db.collection('HomepageConfig')

    await homepageCollection.updateOne(
      { active: true },
      {
        $pull: { sections: { id: sectionId } },
        $set: { updatedAt: new Date() },
      } as any
    )

    const config = await homepageCollection.findOne({ active: true })

    await client.close()

    res.json(config)
  } catch (error) {
    console.error('Error deleting section:', error)
    res.status(500).json({ success: false, message: 'Server error' })
  }
}

// Reorder sections
export const reorderSections = async (req: Request, res: Response) => {
  try {
    const { sections } = req.body
    const client = new MongoClient(process.env.DATABASE_URL || '')

    await client.connect()
    const db = client.db()
    const homepageCollection = db.collection('HomepageConfig')

    // Update order for each section
    const updatedSections = sections.map((section: any, index: number) => ({
      ...section,
      order: index + 1,
    }))

    await homepageCollection.updateOne(
      { active: true },
      {
        $set: {
          sections: updatedSections,
          updatedAt: new Date(),
        },
      }
    )

    const config = await homepageCollection.findOne({ active: true })

    await client.close()

    res.json(config)
  } catch (error) {
    console.error('Error reordering sections:', error)
    res.status(500).json({ success: false, message: 'Server error' })
  }
}

// Duplicate section
export const duplicateSection = async (req: Request, res: Response) => {
  try {
    const { sectionId } = req.params
    const client = new MongoClient(process.env.DATABASE_URL || '')

    await client.connect()
    const db = client.db()
    const homepageCollection = db.collection('HomepageConfig')

    const config = await homepageCollection.findOne({ active: true })

    if (config && config.sections) {
      const sectionIndex = config.sections.findIndex((s: any) => s.id === sectionId)

      if (sectionIndex !== -1) {
        const originalSection = config.sections[sectionIndex]
        const duplicatedSection = {
          ...originalSection,
          id: new ObjectId().toString(),
          title: `${originalSection.title} (نسخة)`,
          order: originalSection.order + 1,
        }

        config.sections.splice(sectionIndex + 1, 0, duplicatedSection)

        // Update orders
        config.sections.forEach((section: any, idx: number) => {
          section.order = idx + 1
        })

        await homepageCollection.updateOne(
          { active: true },
          {
            $set: {
              sections: config.sections,
              updatedAt: new Date(),
            },
          }
        )
      }
    }

    const updatedConfig = await homepageCollection.findOne({ active: true })

    await client.close()

    res.json(updatedConfig)
  } catch (error) {
    console.error('Error duplicating section:', error)
    res.status(500).json({ success: false, message: 'Server error' })
  }
}

// Toggle section visibility
export const toggleSection = async (req: Request, res: Response) => {
  try {
    const { sectionId } = req.params
    const client = new MongoClient(process.env.DATABASE_URL || '')

    await client.connect()
    const db = client.db()
    const homepageCollection = db.collection('HomepageConfig')

    const config = await homepageCollection.findOne({ active: true })

    if (config && config.sections) {
      const sectionIndex = config.sections.findIndex((s: any) => s.id === sectionId)

      if (sectionIndex !== -1) {
        config.sections[sectionIndex].active = !config.sections[sectionIndex].active

        await homepageCollection.updateOne(
          { active: true },
          {
            $set: {
              sections: config.sections,
              updatedAt: new Date(),
            },
          }
        )
      }
    }

    const updatedConfig = await homepageCollection.findOne({ active: true })

    await client.close()

    res.json(updatedConfig)
  } catch (error) {
    console.error('Error toggling section:', error)
    res.status(500).json({ success: false, message: 'Server error' })
  }
}

// ============= FEATURED DEALS SETTINGS =============

// Get featured deals settings
export const getFeaturedDealsSettings = async (req: Request, res: Response) => {
  try {
    const client = new MongoClient(process.env.DATABASE_URL || '')

    await client.connect()
    const db = client.db()
    const settingsCollection = db.collection('FeaturedDealsSettings')

    let settings = await settingsCollection.findOne({})

    // إذا ما في إعدادات، نرجع القيم الافتراضية
    if (!settings) {
      const defaultSettings = {
        enabled: true,
        title: 'عروض حصرية',
        subtitle: 'خصومات تصل إلى {maxDiscount}% على أفضل الأجهزة',
        bannerTitle: 'عروض لفترة محدودة',
        bannerSubtitle: 'لا تفوت الفرصة - العروض تنتهي قريباً',
        productsCount: 6,
        ctaText: 'اكتشف جميع العروض',
      }
      
      await client.close()
      return res.json(defaultSettings)
    }

    await client.close()

    res.json(settings)
  } catch (error) {
    console.error('Error fetching featured deals settings:', error)
    res.status(500).json({ success: false, message: 'Server error' })
  }
}

// Update featured deals settings
export const updateFeaturedDealsSettings = async (req: Request, res: Response) => {
  try {
    const client = new MongoClient(process.env.DATABASE_URL || '')

    await client.connect()
    const db = client.db()
    const settingsCollection = db.collection('FeaturedDealsSettings')

    const updateData = {
      enabled: req.body.enabled !== undefined ? req.body.enabled : true,
      title: req.body.title,
      subtitle: req.body.subtitle,
      bannerTitle: req.body.bannerTitle,
      bannerSubtitle: req.body.bannerSubtitle,
      productsCount: req.body.productsCount,
      ctaText: req.body.ctaText,
      updatedAt: new Date(),
    }

    await settingsCollection.updateOne({}, { $set: updateData }, { upsert: true })

    const settings = await settingsCollection.findOne({})

    await client.close()

    console.log('✅ Featured deals settings updated')

    res.json(settings)
  } catch (error) {
    console.error('Error updating featured deals settings:', error)
    res.status(500).json({ success: false, message: 'Server error' })
  }
}


// Get exclusive offers settings
export const getExclusiveOffersSettings = async (req: Request, res: Response) => {
  try {
    const client = new MongoClient(process.env.DATABASE_URL || '')

    await client.connect()
    const db = client.db()
    const settingsCollection = db.collection('ExclusiveOffersSettings')

    let settings = await settingsCollection.findOne({})

    // إذا ما في إعدادات، نرجع القيم الافتراضية
    if (!settings) {
      const defaultSettings = {
        enabled: true,
        offer1: {
          title: 'عرض الجمعة البيضاء',
          titleEn: 'Black Friday Deal',
          discount: '50%',
          description: 'خصم يصل إلى 50% على أجهزة مختارة',
          descriptionEn: 'Up to 50% off on selected devices',
          link: '/deals?category=black-friday',
        },
        offer2: {
          title: 'هدية مجانية',
          titleEn: 'Free Gift',
          discount: 'هدية',
          description: 'احصل على سماعات لاسلكية مع كل جهاز',
          descriptionEn: 'Get free wireless earbuds with every device',
          link: '/deals?category=free-gift',
        },
        offer3: {
          title: 'عرض محدود',
          titleEn: 'Limited Offer',
          discount: '30%',
          description: 'خصم 30% على الأجهزة الصلبة',
          descriptionEn: '30% off on rugged devices',
          link: '/deals?category=rugged',
        },
      }
      
      await client.close()
      return res.json(defaultSettings)
    }

    await client.close()

    res.json(settings)
  } catch (error) {
    console.error('Error fetching exclusive offers settings:', error)
    res.status(500).json({ success: false, message: 'Server error' })
  }
}

// Update exclusive offers settings
export const updateExclusiveOffersSettings = async (req: Request, res: Response) => {
  try {
    const client = new MongoClient(process.env.DATABASE_URL || '')

    await client.connect()
    const db = client.db()
    const settingsCollection = db.collection('ExclusiveOffersSettings')

    const updateData = {
      enabled: req.body.enabled !== undefined ? req.body.enabled : true,
      offer1: req.body.offer1,
      offer2: req.body.offer2,
      offer3: req.body.offer3,
      updatedAt: new Date(),
    }

    await settingsCollection.updateOne({}, { $set: updateData }, { upsert: true })

    const settings = await settingsCollection.findOne({})

    await client.close()

    console.log('✅ Exclusive offers settings updated')

    res.json(settings)
  } catch (error) {
    console.error('Error updating exclusive offers settings:', error)
    res.status(500).json({ success: false, message: 'Server error' })
  }
}
