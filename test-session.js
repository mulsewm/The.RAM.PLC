const axios = require('axios');
const https = require('https');

// Disable SSL verification (only for testing)
const agent = new https.Agent({  
  rejectUnauthorized: false
});

const AUTH_TOKEN = process.argv[2];

if (!AUTH_TOKEN) {
  console.error('Please provide an auth token');
  process.exit(1);
}

async function testSession() {
  try {
    // Test with auth token in cookie
    console.log('Testing with auth token in cookie...');
    const response = await axios.get('http://localhost:3000/api/auth/session', {
      httpsAgent: agent,
      headers: {
        'Accept': 'application/json',
        'Cookie': `auth_token=${AUTH_TOKEN}`
      },
      // Enable following redirects
      maxRedirects: 5,
      // Don't throw on non-2xx status
      validateStatus: () => true
    });

    console.log('Status:', response.status);
    console.log('Headers:', JSON.stringify(response.headers, null, 2));
    console.log('Data:', JSON.stringify(response.data, null, 2));

  } catch (error) {
    console.error('Error:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
  }
}

testSession();
