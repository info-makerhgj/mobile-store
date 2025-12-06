import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();

const MONGODB_URI = process.env.DATABASE_URL || 'mongodb://localhost:27017/mobile_store';

// الفئات
const categories = [
  {
    name: 'هواتف ذكية',
    nameEn: 'Smartphones',
    slug: 'smartphones',
    description: 'أحدث الهواتف الذكية بأفضل الأسعار',
    icon: '📱',
    active: true,
    order: 1,
    createdAt: new Date(),
  },
  {
    name: 'أجهزة لوحية',
    nameEn: 'Tablets',
    slug: 'tablets',
    description: 'أجهزة لوحية للعمل والترفيه',
    icon: '📲',
    active: true,
    order: 2,
    createdAt: new Date(),
  },
  {
    name: 'إكسسوارات',
    nameEn: 'Accessories',
    slug: 'accessories',
    description: 'إكسسوارات عالية الجودة',
    icon: '🎧',
    active: true,
    order: 3,
    createdAt: new Date(),
  },
  {
    name: 'ساعات ذكية',
    nameEn: 'Smart Watches',
    slug: 'smartwatches',
    description: 'ساعات ذكية متطورة',
    icon: '⌚',
    active: true,
    order: 4,
    createdAt: new Date(),
  },
  {
    name: 'سماعات',
    nameEn: 'Headphones',
    slug: 'headphones',
    description: 'سماعات بجودة صوت عالية',
    icon: '🎵',
    active: true,
    order: 5,
    createdAt: new Date(),
  },
];

// المنتجات
const products = [
  {
    name: 'iPhone 15 Pro Max',
    nameEn: 'iPhone 15 Pro Max',
    slug: 'iphone-15-pro-max',
    description: 'أحدث هاتف من آبل بمعالج A17 Pro وكاميرا 48 ميجابكسل',
    descriptionEn: 'Latest iPhone with A17 Pro chip and 48MP camera',
    category: 'smartphones',
    price: 4999,
    originalPrice: 5499,
    stock: 25,
    images: [
      'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=500',
      'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=500',
    ],
    specifications: {
      'المعالج': 'Apple A17 Pro',
      'الذاكرة': '256GB',
      'الرام': '8GB',
      'الشاشة': '6.7 بوصة Super Retina XDR',
      'الكاميرا': '48MP + 12MP + 12MP',
      'البطارية': '4422 mAh',
    },
    features: [
      'معالج A17 Pro الأقوى',
      'كاميرا 48 ميجابكسل',
      'شاشة ProMotion 120Hz',
      'مقاومة للماء IP68',
      'شحن سريع 27W',
    ],
    colors: ['أسود تيتانيوم', 'أبيض تيتانيوم', 'أزرق تيتانيوم', 'طبيعي تيتانيوم'],
    warranty: 'سنة واحدة',
    brand: 'Apple',
    rating: 4.9,
    reviewsCount: 156,
    isFeatured: true,
    isNew: true,
    tags: ['آيفون', 'آبل', 'جديد', 'مميز'],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    name: 'Samsung Galaxy S24 Ultra',
    nameEn: 'Samsung Galaxy S24 Ultra',
    slug: 'samsung-s24-ultra',
    description: 'هاتف سامسونج الرائد بقلم S Pen وكاميرا 200 ميجابكسل',
    descriptionEn: 'Samsung flagship with S Pen and 200MP camera',
    category: 'smartphones',
    price: 4499,
    originalPrice: 4999,
    stock: 30,
    images: [
      'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=500',
      'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=500',
    ],
    specifications: {
      'المعالج': 'Snapdragon 8 Gen 3',
      'الذاكرة': '512GB',
      'الرام': '12GB',
      'الشاشة': '6.8 بوصة Dynamic AMOLED',
      'الكاميرا': '200MP + 50MP + 12MP + 10MP',
      'البطارية': '5000 mAh',
    },
    features: [
      'كاميرا 200 ميجابكسل',
      'قلم S Pen مدمج',
      'شاشة 120Hz',
      'شحن سريع 45W',
      'مقاومة للماء IP68',
    ],
    colors: ['أسود', 'رمادي', 'بنفسجي', 'أصفر'],
    warranty: 'سنة واحدة',
    brand: 'Samsung',
    rating: 4.8,
    reviewsCount: 203,
    isFeatured: true,
    isNew: true,
    tags: ['سامسونج', 'جالاكسي', 'جديد'],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    name: 'iPad Pro 12.9',
    nameEn: 'iPad Pro 12.9',
    slug: 'ipad-pro-12-9',
    description: 'جهاز لوحي احترافي بمعالج M2 وشاشة Liquid Retina XDR',
    descriptionEn: 'Professional tablet with M2 chip and Liquid Retina XDR display',
    category: 'tablets',
    price: 3999,
    originalPrice: 4499,
    stock: 15,
    images: [
      'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=500',
      'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=500',
    ],
    specifications: {
      'المعالج': 'Apple M2',
      'الذاكرة': '256GB',
      'الرام': '8GB',
      'الشاشة': '12.9 بوصة Liquid Retina XDR',
      'الكاميرا': '12MP + 10MP',
      'البطارية': '10758 mAh',
    },
    features: [
      'معالج M2 القوي',
      'شاشة mini-LED',
      'دعم Apple Pencil',
      'Face ID',
      'مكبرات صوت رباعية',
    ],
    colors: ['فضي', 'رمادي فلكي'],
    warranty: 'سنة واحدة',
    brand: 'Apple',
    rating: 4.9,
    reviewsCount: 89,
    isFeatured: true,
    isNew: false,
    tags: ['آيباد', 'آبل', 'تابلت'],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    name: 'AirPods Pro 2',
    nameEn: 'AirPods Pro 2',
    slug: 'airpods-pro-2',
    description: 'سماعات لاسلكية بإلغاء ضوضاء نشط وصوت مكاني',
    descriptionEn: 'Wireless earbuds with active noise cancellation and spatial audio',
    category: 'headphones',
    price: 899,
    originalPrice: 999,
    stock: 50,
    images: [
      'https://images.unsplash.com/photo-1606841837239-c5a1a4a07af7?w=500',
      'https://images.unsplash.com/photo-1606841837239-c5a1a4a07af7?w=500',
    ],
    specifications: {
      'النوع': 'سماعات لاسلكية داخل الأذن',
      'البلوتوث': '5.3',
      'البطارية': '6 ساعات (30 ساعة مع العلبة)',
      'الشحن': 'لاسلكي + Lightning',
      'المقاومة': 'IPX4',
    },
    features: [
      'إلغاء ضوضاء نشط',
      'صوت مكاني',
      'شريحة H2',
      'شحن لاسلكي',
      'مقاومة للعرق',
    ],
    colors: ['أبيض'],
    warranty: 'سنة واحدة',
    brand: 'Apple',
    rating: 4.7,
    reviewsCount: 312,
    isFeatured: true,
    isNew: false,
    tags: ['سماعات', 'آبل', 'لاسلكي'],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    name: 'Apple Watch Series 9',
    nameEn: 'Apple Watch Series 9',
    slug: 'apple-watch-series-9',
    description: 'ساعة ذكية بشريحة S9 وشاشة أكثر سطوعاً',
    descriptionEn: 'Smart watch with S9 chip and brighter display',
    category: 'smartwatches',
    price: 1699,
    originalPrice: 1899,
    stock: 40,
    images: [
      'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=500',
      'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=500',
    ],
    specifications: {
      'المعالج': 'Apple S9',
      'الشاشة': 'Always-On Retina LTPO OLED',
      'الحجم': '45mm',
      'البطارية': '18 ساعة',
      'المقاومة': 'WR50 (50 متر)',
      'الاتصال': 'GPS + Cellular',
    },
    features: [
      'شريحة S9 الجديدة',
      'شاشة أكثر سطوعاً',
      'مستشعر صحي متقدم',
      'تتبع النوم',
      'مقاومة للماء',
    ],
    colors: ['أسود', 'فضي', 'ذهبي', 'أحمر'],
    warranty: 'سنة واحدة',
    brand: 'Apple',
    rating: 4.8,
    reviewsCount: 178,
    isFeatured: true,
    isNew: true,
    tags: ['ساعة', 'آبل', 'ذكية'],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

async function addProductsAndCategories() {
  const client = new MongoClient(MONGODB_URI);

  try {
    console.log('🔄 الاتصال بقاعدة البيانات...\n');
    await client.connect();
    const db = client.db();

    // إضافة الفئات
    console.log('📂 إضافة الفئات...\n');
    for (const category of categories) {
      const existing = await db.collection('Category').findOne({ slug: category.slug });
      
      if (existing) {
        console.log(`⏭️  الفئة "${category.name}" موجودة بالفعل`);
      } else {
        await db.collection('Category').insertOne(category);
        console.log(`✅ تم إضافة فئة: ${category.name} ${category.icon}`);
      }
    }

    console.log('\n📦 إضافة المنتجات...\n');
    // إضافة المنتجات
    for (const product of products) {
      const existing = await db.collection('Product').findOne({ slug: product.slug });
      
      if (existing) {
        console.log(`⏭️  المنتج "${product.name}" موجود بالفعل`);
      } else {
        await db.collection('Product').insertOne(product);
        console.log(`✅ تم إضافة منتج: ${product.name} - ${product.price} ريال`);
      }
    }

    console.log('\n✅ تم إضافة جميع الفئات والمنتجات بنجاح!');
    console.log('\n📊 الإحصائيات:');
    
    const categoriesCount = await db.collection('Category').countDocuments();
    const productsCount = await db.collection('Product').countDocuments();
    
    console.log(`   - عدد الفئات: ${categoriesCount}`);
    console.log(`   - عدد المنتجات: ${productsCount}`);
    
    console.log('\n🌐 يمكنك الآن زيارة:');
    console.log('   - الموقع: http://localhost:3000');
    console.log('   - المنتجات: http://localhost:3000/products');
    console.log('   - لوحة التحكم: http://localhost:3000/admin/products');

  } catch (error) {
    console.error('❌ خطأ:', error);
  } finally {
    await client.close();
  }
}

addProductsAndCategories();
