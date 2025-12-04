import mongoose from 'mongoose'
import dotenv from 'dotenv'

dotenv.config()

const HomepageSchema = new mongoose.Schema({
  active: { type: Boolean, default: true },
  sections: [{
    id: String,
    type: String,
    title: String,
    subtitle: String,
    order: Number,
    active: Boolean,
    settings: mongoose.Schema.Types.Mixed,
    content: mongoose.Schema.Types.Mixed,
  }],
})

const Homepage = mongoose.model('Homepage', HomepageSchema)

async function addDefaultSections() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/mobile-store')
    console.log('✅ متصل بقاعدة البيانات')

    // البحث عن الصفحة الرئيسية
    let homepage = await Homepage.findOne()

    if (!homepage) {
      console.log('📝 إنشاء صفحة رئيسية جديدة...')
      homepage = new Homepage({
        active: true,
        sections: [],
      })
    }

    // التحقق من وجود الأقسام
    const hasExclusiveOffers = homepage.sections.some((s: any) => s.type === 'exclusiveOffers')
    const hasDeals = homepage.sections.some((s: any) => s.type === 'deals')

    let added = false

    // إضافة قسم العروض الحصرية إذا لم يكن موجوداً
    if (!hasExclusiveOffers) {
      console.log('➕ إضافة قسم العروض الحصرية...')
      homepage.sections.push({
        id: `section-${Date.now()}-1`,
        type: 'exclusiveOffers',
        title: 'عروض حصرية',
        subtitle: 'عروض لفترة محدودة - لا تفوت الفرصة',
        order: homepage.sections.length + 1,
        active: true,
        settings: {},
        content: {},
      })
      added = true
    }

    // إضافة قسم العروض الأسبوعية إذا لم يكن موجوداً
    if (!hasDeals) {
      console.log('➕ إضافة قسم العروض الأسبوعية...')
      homepage.sections.push({
        id: `section-${Date.now()}-2`,
        type: 'deals',
        title: 'العروض الأسبوعية',
        subtitle: 'أفضل العروض لهذا الأسبوع',
        order: homepage.sections.length + 1,
        active: true,
        settings: {},
        content: {},
      })
      added = true
    }

    if (added) {
      await homepage.save()
      console.log('✅ تم إضافة الأقسام بنجاح!')
      console.log(`📊 إجمالي الأقسام: ${homepage.sections.length}`)
    } else {
      console.log('ℹ️ الأقسام موجودة بالفعل')
    }

    // عرض جميع الأقسام
    console.log('\n📋 الأقسام الحالية:')
    homepage.sections.forEach((section: any, index: number) => {
      console.log(`${index + 1}. ${section.title} (${section.type}) - ${section.active ? '✅ نشط' : '❌ مخفي'}`)
    })

    await mongoose.disconnect()
    console.log('\n✅ تم الانتهاء!')
  } catch (error) {
    console.error('❌ خطأ:', error)
    process.exit(1)
  }
}

addDefaultSections()
