import { MongoClient } from 'mongodb'
import bcrypt from 'bcryptjs'
import dotenv from 'dotenv'

dotenv.config()

const uri = process.env.DATABASE_URL || ''

async function createAccounts() {
  const client = new MongoClient(uri)

  try {
    await client.connect()
    console.log('✅ متصل بقاعدة البيانات')

    const db = client.db()
    const usersCollection = db.collection('User')

    // Create Admin Account
    const adminEmail = 'admin@abaad.sa'
    const existingAdmin = await usersCollection.findOne({ email: adminEmail })

    if (!existingAdmin) {
      const hashedPassword = await bcrypt.hash('admin123', 10)
      await usersCollection.insertOne({
        email: adminEmail,
        password: hashedPassword,
        name: 'مدير النظام',
        role: 'ADMIN',
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      console.log('\n✅ تم إنشاء حساب المدير بنجاح!')
    } else {
      console.log('\n⚠️  حساب المدير موجود بالفعل')
    }

    console.log('\n📧 بيانات تسجيل دخول المدير:')
    console.log('البريد الإلكتروني: admin@abaad.sa')
    console.log('كلمة المرور: admin123')
    console.log('🔗 رابط تسجيل الدخول: http://localhost:3000/admin/login')

    // Create Customer Account
    const customerEmail = 'customer@example.com'
    const existingCustomer = await usersCollection.findOne({ email: customerEmail })

    if (!existingCustomer) {
      const hashedPassword = await bcrypt.hash('customer123', 10)
      await usersCollection.insertOne({
        email: customerEmail,
        password: hashedPassword,
        name: 'عميل تجريبي',
        phone: '+966501234567',
        role: 'USER',
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      console.log('\n✅ تم إنشاء حساب العميل بنجاح!')
    } else {
      console.log('\n⚠️  حساب العميل موجود بالفعل')
    }

    console.log('\n📧 بيانات تسجيل دخول العميل:')
    console.log('البريد الإلكتروني: customer@example.com')
    console.log('كلمة المرور: customer123')
    console.log('🔗 رابط تسجيل الدخول: http://localhost:3000/login')

    console.log('\n🎉 جاهز للاستخدام!')
  } catch (error) {
    console.error('❌ خطأ:', error)
  } finally {
    await client.close()
  }
}

createAccounts()
