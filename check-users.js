const { MongoClient } = require('mongodb');
const bcrypt = require('bcryptjs');

const mongoUrl = 'mongodb://localhost:27017/mobile_store';

async function checkUsers() {
  const client = new MongoClient(mongoUrl);
  
  try {
    await client.connect();
    console.log('✅ Connected to MongoDB');
    
    const db = client.db();
    const usersCollection = db.collection('User');
    
    const users = await usersCollection.find({}).toArray();
    
    console.log('\n📊 Total users:', users.length);
    console.log('\n👥 Users in database:');
    
    for (const user of users) {
      console.log('\n---');
      console.log('ID:', user._id);
      console.log('Email:', user.email);
      console.log('Name:', user.name);
      console.log('Role:', user.role);
      console.log('Password Hash:', user.password);
      
      // Test password
      const testPassword = '123456';
      const isMatch = await bcrypt.compare(testPassword, user.password);
      console.log(`Password '${testPassword}' matches:`, isMatch);
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await client.close();
  }
}

checkUsers();
