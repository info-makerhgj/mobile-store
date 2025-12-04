import { PrismaClient, Condition, OrderStatus, Role } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 بدء إضافة البيانات التجريبية...')

  // Create admin user
  const hashedPassword = await bcrypt.hash('admin123', 10)
  const admin = await prisma.user.create({
    data: {
      email: 'admin@abaad.sa',
      password: hashedPassword,
      name: 'مدير النظام',
      role: Role.ADMIN,
    },
  })
  console.log('✅ تم إنشاء حساب المدير')

  // Create test user
  const userPassword = await bcrypt.hash('user123', 10)
  const user = await prisma.user.create({
    data: {
      email: 'user@example.com',
      password: userPassword,
      name: 'أحمد محمد',
      role: Role.USER,
    },
  })
  console.log('✅ تم إنشاء حساب مستخدم تجريبي')

  // Create products
  const products = [
    {
      nameAr: 'أبعاد X برو',
      nameEn: 'Abaad X Pro',
      descriptionAr: 'هاتف ذكي متطور بمواصفات عالية وتصميم أنيق',
      descriptionEn: 'Advanced smartphone with high specs and elegant design',
      price: 2999,
      brand: 'Abaad',
      category: 'smartphones',
      stock: 45,
      condition: Condition.NEW,
      warranty: 'سنتان',
      images: ['📱'],
      specifications: {},
    },
    {
      nameAr: 'أبعاد X لايت',
      nameEn: 'Abaad X Lite',
      descriptionAr: 'هاتف ذكي بسعر مناسب وأداء ممتاز',
      descriptionEn: 'Affordable smartphone with excellent performance',
      price: 1799,
      brand: 'Abaad',
      category: 'smartphones',
      stock: 32,
      condition: Condition.NEW,
      warranty: 'سنتان',
      images: ['📱'],
      specifications: {},
    },
    {
      nameAr: 'أبعاد واتش إيليت',
      nameEn: 'Abaad Watch Elite',
      descriptionAr: 'ساعة ذكية بمميزات صحية ورياضية متقدمة',
      descriptionEn: 'Smartwatch with advanced health and fitness features',
      price: 899,
      brand: 'Abaad',
      category: 'smartwatches',
      stock: 67,
      condition: Condition.NEW,
      warranty: 'سنة واحدة',
      images: ['⌚'],
      specifications: {},
    },
    {
      nameAr: 'أبعاد بودز برو',
      nameEn: 'Abaad Buds Pro',
      descriptionAr: 'سماعات لاسلكية بجودة صوت عالية وإلغاء ضوضاء نشط',
      descriptionEn: 'Wireless earbuds with high quality sound and active noise cancellation',
      price: 499,
      brand: 'Abaad',
      category: 'headphones',
      stock: 120,
      condition: Condition.NEW,
      warranty: 'سنة واحدة',
      images: ['🎧'],
      specifications: {},
    },
    {
      nameAr: 'أبعاد تاب برو',
      nameEn: 'Abaad Tab Pro',
      descriptionAr: 'جهاز لوحي بشاشة كبيرة مثالي للعمل والترفيه',
      descriptionEn: 'Tablet with large screen perfect for work and entertainment',
      price: 2299,
      brand: 'Abaad',
      category: 'tablets',
      stock: 18,
      condition: Condition.NEW,
      warranty: 'سنتان',
      images: ['📲'],
      specifications: {},
    },
    {
      nameAr: 'أبعاد X ميني',
      nameEn: 'Abaad X Mini',
      descriptionAr: 'هاتف صغير الحجم بمواصفات قوية',
      descriptionEn: 'Compact phone with powerful specs',
      price: 1299,
      brand: 'Abaad',
      category: 'smartphones',
      stock: 25,
      condition: Condition.REFURBISHED,
      warranty: 'سنة واحدة',
      images: ['📱'],
      specifications: {},
    },
  ]

  const createdProducts = []
  for (const product of products) {
    const created = await prisma.product.create({
      data: product,
    })
    createdProducts.push(created)
  }
  console.log('✅ تم إضافة المنتجات')

  // Create sample orders
  const order1 = await prisma.order.create({
    data: {
      userId: user.id,
      total: 2999,
      status: OrderStatus.DELIVERED,
      shippingAddress: {
        fullName: 'أحمد محمد',
        phone: '+966501234567',
        city: 'الرياض',
        district: 'العليا',
        street: 'شارع الملك فهد',
        building: '123',
      },
      paymentMethod: 'credit_card',
      items: {
        create: [
          {
            productId: createdProducts[0].id,
            quantity: 1,
            price: 2999,
          },
        ],
      },
    },
  })

  const order2 = await prisma.order.create({
    data: {
      userId: user.id,
      total: 1398,
      status: OrderStatus.PROCESSING,
      shippingAddress: {
        fullName: 'أحمد محمد',
        phone: '+966501234567',
        city: 'الرياض',
        district: 'العليا',
        street: 'شارع الملك فهد',
        building: '123',
      },
      paymentMethod: 'cash_on_delivery',
      items: {
        create: [
          {
            productId: createdProducts[2].id,
            quantity: 1,
            price: 899,
          },
          {
            productId: createdProducts[3].id,
            quantity: 1,
            price: 499,
          },
        ],
      },
    },
  })

  console.log('✅ تم إضافة الطلبات التجريبية')

  console.log('\n🎉 تم إضافة جميع البيانات التجريبية بنجاح!')
  console.log('\n📧 بيانات تسجيل الدخول:')
  console.log('المدير: admin@abaad.sa / admin123')
  console.log('المستخدم: user@example.com / user123')
}

main()
  .catch((e) => {
    console.error('❌ خطأ في إضافة البيانات:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
