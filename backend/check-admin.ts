import { MongoClient } from 'mongodb'
import dotenv from 'dotenv'

dotenv.config()

const uri = process.env.DATABASE_URL || ''

async function checkAdmin() {
  const client = new MongoClient(uri)

  try {
    await client.connect()
    const db = client.db()
    const usersCollection = db.collection('User')

    const admin = await usersCollection.findOne({ email: 'admin@abaad.sa' })
    
    if (admin) {
      console.log('✅ حساب المدير موجود:')
      console.log('البريد:', admin.email)
      console.log('الاسم:', admin.name)
      console.log('الدور:', admin.role)
      console.log('ID:', admin._id)
    } else {
      console.log('❌ حساب المدير غير موجود')
    }
  } catch (error) {
    console.error('❌ خطأ:', error)
  } finally {
    await client.close()
  }
}

checkAdmin()
