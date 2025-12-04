import { MongoClient } from 'mongodb'
import bcrypt from 'bcryptjs'

const mongoUrl = 'mongodb+srv://atw03817_db_user:jP9AouAfbaifknI4@mobile-store-cluster.cylotee.mongodb.net/mobile_store?retryWrites=true&w=majority&appName=mobile-store-cluster'

async function createAdmin() {
  const client = new MongoClient(mongoUrl)

  try {
    await client.connect()
    console.log('✅ Connected to MongoDB Atlas')

    const db = client.db()
    const usersCollection = db.collection('User')

    // Check if admin exists
    const existingAdmin = await usersCollection.findOne({ email: 'admin@abaad.sa' })
    
    if (existingAdmin) {
      console.log('⚠️  Admin already exists')
      return
    }

    // Create admin
    const hashedPassword = await bcrypt.hash('admin123', 10)
    
    await usersCollection.insertOne({
      name: 'Admin',
      email: 'admin@abaad.sa',
      password: hashedPassword,
      role: 'ADMIN',
      createdAt: new Date(),
      updatedAt: new Date()
    })

    console.log('✅ Admin created successfully!')
    console.log('📧 Email: admin@abaad.sa')
    console.log('🔑 Password: admin123')

  } catch (error) {
    console.error('❌ Error:', error)
  } finally {
    await client.close()
  }
}

createAdmin()
