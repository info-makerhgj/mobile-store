// 📄 إنشاء الصفحات الأساسية
const { MongoClient } = require('mongodb');

const mongoUrl = process.env.DATABASE_URL || 'mongodb+srv://atw03817_db_user:jP9AouAfbaifknI4@mobile-store-cluster.cylotee.mongodb.net/mobile_store?retryWrites=true&w=majority&appName=mobile-store-cluster';

const defaultPages = [
  {
    slug: 'about',
    title: 'من نحن',
    content: `
      <h2>مرحباً بكم في متجر أبعاد التواصل</h2>
      <p>نحن متجر متخصص في بيع الجوالات والإكسسوارات الأصلية.</p>
      <h3>رؤيتنا</h3>
      <p>أن نكون الخيار الأول للعملاء في المملكة.</p>
    `,
    isPublished: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    slug: 'terms',
    title: 'الشروط والأحكام',
    content: `
      <h2>الشروط والأحكام</h2>
      <p>مرحباً بك في متجرنا. باستخدامك لهذا الموقع، فإنك توافق على الشروط التالية:</p>
      <h3>1. استخدام الموقع</h3>
      <p>يجب استخدام الموقع للأغراض القانونية فقط.</p>
      <h3>2. المنتجات والأسعار</h3>
      <p>جميع المنتجات أصلية ومضمونة.</p>
    `,
    isPublished: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    slug: 'privacy',
    title: 'سياسة الخصوصية',
    content: `
      <h2>سياسة الخصوصية</h2>
      <p>نحن نحترم خصوصيتك ونلتزم بحماية بياناتك الشخصية.</p>
      <h3>المعلومات التي نجمعها</h3>
      <p>نجمع المعلومات الضرورية لإتمام طلبك فقط.</p>
    `,
    isPublished: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    slug: 'return',
    title: 'سياسة الاسترجاع',
    content: `
      <h2>سياسة الاسترجاع والاستبدال</h2>
      <p>يمكنك استرجاع أو استبدال المنتج خلال 7 أيام من تاريخ الاستلام.</p>
      <h3>الشروط</h3>
      <ul>
        <li>المنتج في حالته الأصلية</li>
        <li>لم يتم استخدامه</li>
        <li>مع العلبة والملحقات</li>
      </ul>
    `,
    isPublished: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    slug: 'warranty',
    title: 'الضمان',
    content: `
      <h2>سياسة الضمان</h2>
      <p>جميع منتجاتنا تأتي مع ضمان الوكيل المعتمد.</p>
      <h3>مدة الضمان</h3>
      <p>تختلف حسب نوع المنتج (عادة سنة واحدة).</p>
    `,
    isPublished: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

async function createPages() {
  const client = new MongoClient(mongoUrl);
  
  try {
    console.log('🔌 الاتصال بـ MongoDB Atlas...');
    await client.connect();
    console.log('✅ متصل بنجاح!\n');
    
    const db = client.db();
    const pagesCollection = db.collection('Page');
    
    for (const page of defaultPages) {
      const existing = await pagesCollection.findOne({ slug: page.slug });
      
      if (existing) {
        console.log(`⏭️  ${page.title} موجودة بالفعل`);
      } else {
        await pagesCollection.insertOne(page);
        console.log(`✅ تم إنشاء صفحة: ${page.title}`);
      }
    }
    
    console.log('\n🎉 تم إنشاء جميع الصفحات الأساسية!');
    
  } catch (error) {
    console.error('❌ خطأ:', error.message);
  } finally {
    await client.close();
  }
}

console.log('📄 إنشاء الصفحات الأساسية...\n');
createPages();
