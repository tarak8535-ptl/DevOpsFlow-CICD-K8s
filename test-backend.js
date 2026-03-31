const axios = require('axios');

async function testBackend() {
  try {
    console.log('Testing backend health...');
    const healthResponse = await axios.get('http://localhost:5000/health');
    console.log('Health check:', healthResponse.data);
    
    console.log('Testing debug services...');
    const debugResponse = await axios.get('http://localhost:5000/debug/services');
    console.log('Debug services:', debugResponse.data);
    
  } catch (error) {
    console.error('Backend test failed:', error.message);
    if (error.code === 'ECONNREFUSED') {
      console.error('Backend server is not running on port 5000');
    }
  }
}

testBackend();