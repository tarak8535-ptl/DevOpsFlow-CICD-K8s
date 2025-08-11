const axios = require('axios');

async function testServices() {
  try {
    // Test login first
    console.log('Testing login...');
    const loginResponse = await axios.post('http://localhost:5000/api/auth/login', {
      username: 'admin',
      password: 'password'
    });
    
    const token = loginResponse.data.token;
    console.log('Login successful, token:', token);
    
    // Test services endpoint
    console.log('Testing services endpoint...');
    const servicesResponse = await axios.get('http://localhost:5000/api/terraform/services', {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    console.log('Services response:', JSON.stringify(servicesResponse.data, null, 2));
    
  } catch (error) {
    console.error('Error:', error.response?.data || error.message);
  }
}

testServices();