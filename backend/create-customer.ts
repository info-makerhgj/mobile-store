import { PrismaClient, Role } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function createCustomer() {
  try {
    // Check if customer already exists
    const existingCustomer = await prisma.user.findUnique({
      where: { email: 'customer@example.com' },
    })

    if (existingCustomer) {
      console.log('⚠️  الحساب موجود بالفعل!')
      console.log('\n📧 بيانات تسجيل الدخول:')
      console.log('البريد الإلكتروني: customer@example.com')
      console.log('كلمة المرور: customer123')
      console.log('\n🔗 رابط تسجيل الدخول: http://localhost:3000/login')
      console.log('🔗 رابط حساب العميل: http://localhost:3000/account')
      return
    }

    const hashedPassword = await bcrypt.hash('customer123', 10)
    
    const customer = await prisma.user.create({
      data: {
        email: 'customer@example.com',
        password: hashedPassword,
        name: 'عميل تجريبي',
        phone: '+966501234567',
        role: Role.USER,
      },
    })

    console.log('✅ تم إنشاء حساب العميل بنجاح!')
    console.log('\n📧 بيانات تسجيل الدخول:')
    console.log('البريد الإلكتروني: customer@example.com')
    console.log('كلمة المرور: customer123')
    console.log('\n🔗 رابط تسجيل الدخول: http://localhost:3000/login')
    console.log('🔗 رابط حساب العميل: http://localhost:3000/account')
  } catch (error: any) {
    console.error('❌ خطأ:', error.message || error)
  } finally {
    await prisma.$disconnect()
  }
}

createCustomer()
