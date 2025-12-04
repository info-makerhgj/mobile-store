import { MongoClient } from 'mongodb'
import bcrypt from 'bcryptjs'
import dotenv from 'dotenv'

dotenv.config()

const uri = process.env.DATABASE_URL || ''

async function fixAdminRole() {
  const client = new MongoClient(uri)

  try {
    await client.connect()
    const db = client.db()
    const usersCollection = db.collection('User')

    // Update existing admin account
    const hashedPassword = await bcrypt.hash('admin123', 10)
    
    const result = await usersCollection.updateOne(
      { email: 'admin@abaad.sa' },
      {
        $set: {
          role: 'ADMIN',
          name: 'مدير النظام',
          password: hashedPassword,
          updatedAt: new Date(),
        },
      }
    )

    if (result.modifiedCount > 0) {
      console.log('✅ تم تحديث حساب المدير بنجاح!')
    } else {
      console.log('⚠️  لم يتم العثور على الحساب')
    }

    // Verify the update
    const admin = await usersCollection.findOne({ email: 'admin@abaad.sa' })
    console.log('\n📧 بيانات الحساب بعد التحديث:')
    console.log('البريد:', admin?.email)
    console.log('الاسم:', admin?.name)
    console.log('الدور:', admin?.role)
    console.log('\n🔑 بيانات تسجيل الدخول:')
    console.log('البريد الإلكتروني: admin@abaad.sa')
    console.log('كلمة المرور: admin123')
    console.log('🔗 رابط تسجيل الدخول: http://localhost:3000/admin/login')
  } catch (error) {
    console.error('❌ خطأ:', error)
  } finally {
    await client.close()
  }
}

fixAdminRole()
