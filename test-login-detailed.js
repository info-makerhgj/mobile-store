const { MongoClient } = require('mongodb');
const bcrypt = require('bcryptjs');

const mongoUrl = 'mongodb://localhost:27017/mobile_store';

async function testLoginLogic() {
  const client = new MongoClient(mongoUrl);
  
  try {
    const email = 'admin@ab-tw.com';
    const password = '123456';
    
    await client.connect();
    console.log('✅ Connected to MongoDB');
    
    const db = client.db();
    const usersCollection = db.collection('User');
    
    console.log('\n🔍 Looking for user with email:', email);
    const user = await usersCollection.findOne({ email });
    
    if (!user) {
      console.log('❌ User not found!');
      return;
    }
    
    console.log('✅ User found!');
    console.log('User ID:', user._id);
    console.log('User Email:', user.email);
    console.log('User Role:', user.role);
    console.log('Password Hash:', user.password);
    
    console.log('\n🔐 Testing password...');
    console.log('Input password:', password);
    console.log('Stored hash:', user.password);
    
    const isValidPassword = await bcrypt.compare(password, user.password);
    console.log('Password valid:', isValidPassword);
    
    if (isValidPassword) {
      console.log('\n✅ Login should succeed!');
    } else {
      console.log('\n❌ Password mismatch!');
    }
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await client.close();
  }
}

testLoginLogic();
