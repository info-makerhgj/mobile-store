const axios = require('axios');

async function testLogin() {
  try {
    console.log('🔍 Testing login to http://localhost:4000/api/auth/login');
    
    const response = await axios.post('http://localhost:4000/api/auth/login', {
      email: 'admin@ab-tw.com',
      password: '123456'
    });
    
    console.log('✅ Login successful!');
    console.log('Response:', JSON.stringify(response.data, null, 2));
    
  } catch (error) {
    console.error('❌ Login failed!');
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
    } else {
      console.error('Error:', error.message);
    }
  }
}

testLogin();
