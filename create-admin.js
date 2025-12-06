const { MongoClient } = require('mongodb');
const bcrypt = require('bcryptjs');

const mongoUrl = 'mongodb://localhost:27017/mobile_store';

async function createAdmin() {
  const client = new MongoClient(mongoUrl);
  
  try {
    await client.connect();
    console.log('✅ Connected to MongoDB');
    
    const db = client.db();
    const usersCollection = db.collection('User');
    
    // Check if admin exists
    const existingAdmin = await usersCollection.findOne({ email: 'admin@ab-tw.com' });
    
    if (existingAdmin) {
      console.log('⚠️  Admin user already exists');
      return;
    }
    
    // Create admin user
    const hashedPassword = await bcrypt.hash('123456', 10);
    
    const adminUser = {
      email: 'admin@ab-tw.com',
      password: hashedPassword,
      name: 'المدير',
      phone: null,
      role: 'ADMIN',
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    const result = await usersCollection.insertOne(adminUser);
    
    console.log('✅ Admin user created successfully!');
    console.log('📧 Email: admin@ab-tw.com');
    console.log('🔑 Password: 123456');
    console.log('👤 Role: ADMIN');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await client.close();
  }
}

createAdmin();
