import { PrismaClient, Role } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function createAdmin() {
  try {
    // Check if admin already exists
    const existingAdmin = await prisma.user.findUnique({
      where: { email: 'admin@abaad.sa' },
    })

    if (existingAdmin) {
      console.log('⚠️  الحساب موجود بالفعل!')
      console.log('\n📧 بيانات تسجيل الدخول:')
      console.log('البريد الإلكتروني: admin@abaad.sa')
      console.log('كلمة المرور: admin123')
      console.log('\n🔗 رابط تسجيل دخول المدير: http://localhost:3000/admin/login')
      console.log('🔗 رابط لوحة الإدارة: http://localhost:3000/admin')
      return
    }

    const hashedPassword = await bcrypt.hash('admin123', 10)
    
    const admin = await prisma.user.create({
      data: {
        email: 'admin@abaad.sa',
        password: hashedPassword,
        name: 'مدير النظام',
        role: Role.ADMIN,
      },
    })

    console.log('✅ تم إنشاء حساب الأدمن بنجاح!')
    console.log('\n📧 بيانات تسجيل الدخول:')
    console.log('البريد الإلكتروني: admin@abaad.sa')
    console.log('كلمة المرور: admin123')
    console.log('\n🔗 رابط تسجيل دخول المدير: http://localhost:3000/admin/login')
    console.log('🔗 رابط لوحة الإدارة: http://localhost:3000/admin')
  } catch (error: any) {
    console.error('❌ خطأ:', error.message || error)
  } finally {
    await prisma.$disconnect()
  }
}

createAdmin()
