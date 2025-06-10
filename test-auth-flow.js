const axios = require('axios');
const https = require('https');

// Configuration
const BASE_URL = 'http://localhost:3000';
const TEST_EMAIL = 'test@example.com';
const TEST_PASSWORD = 'password123';

// Disable SSL verification (only for testing)
const agent = new https.Agent({  
  rejectUnauthorized: false
});

// Helper function to log headers
function logHeaders(headers, title) {
  console.log(`\n=== ${title} ===`);
  console.log(JSON.stringify(headers, null, 2));
}

// Helper function to log response
function logResponse(response, title) {
  console.log(`\n=== ${title} ===`);
  console.log(`Status: ${response.status} ${response.statusText}`);
  logHeaders(response.headers, 'Response Headers');
  
  try {
    const data = response.data;
    console.log('\nResponse Data:');
    console.log(JSON.stringify(data, null, 2));
  } catch (e) {
    console.log('Response Data: (non-JSON response)');
    console.log(response.data);
  }
}

async function testLogin() {
  console.log('\n1. Testing login with valid credentials...');
  
  try {
    const loginResponse = await axios.post(
      `${BASE_URL}/api/auth/login`,
      {
        email: TEST_EMAIL,
        password: TEST_PASSWORD
      },
      {
        httpsAgent: agent,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Origin': BASE_URL
        },
        withCredentials: true,
        validateStatus: () => true // Don't throw on non-2xx status
      }
    );

    logResponse(loginResponse, 'Login Response');
    
    if (loginResponse.status !== 200) {
      throw new Error(`Login failed with status ${loginResponse.status}`);
    }

    // Extract the auth token from cookies
    const cookies = loginResponse.headers['set-cookie'] || [];
    console.log('\nSet-Cookies:', cookies);
    
    const authCookie = cookies.find(cookie => cookie.includes('auth_token='));
    
    if (!authCookie) {
      throw new Error('No auth_token cookie found in login response');
    }
    
    console.log('\nFound auth cookie:', authCookie.split(';')[0]);
    
    return authCookie.split(';')[0];
    
  } catch (error) {
    console.error('Login test failed:');
    if (error.response) {
      logResponse(error.response, 'Error Response');
    }
    throw error;
  }
}

async function testSession(authCookie) {
  console.log('\n2. Testing session endpoint with auth token...');
  
  try {
    const sessionResponse = await axios.get(
      `${BASE_URL}/api/auth/session`,
      {
        httpsAgent: agent,
        headers: {
          'Accept': 'application/json',
          'Cookie': authCookie,
          'Origin': BASE_URL
        },
        withCredentials: true,
        validateStatus: () => true // Don't throw on non-2xx status
      }
    );
    
    logResponse(sessionResponse, 'Session Response');
    return sessionResponse;
    
  } catch (error) {
    console.error('Session test failed:');
    if (error.response) {
      logResponse(error.response, 'Error Response');
    }
    throw error;
  }
}

async function testSessionWithoutAuth() {
  console.log('\n3. Testing session endpoint without auth token...');
  
  try {
    const response = await axios.get(
      `${BASE_URL}/api/auth/session`,
      {
        httpsAgent: agent,
        headers: {
          'Accept': 'application/json',
          'Origin': BASE_URL
        },
        withCredentials: true,
        validateStatus: () => true // Don't throw on non-2xx status
      }
    );
    
    logResponse(response, 'No-Auth Session Response');
    return response;
    
  } catch (error) {
    console.error('No-auth session test failed:');
    if (error.response) {
      logResponse(error.response, 'Error Response');
    }
    throw error;
  }
}

async function runTests() {
  try {
    // Test 1: Login
    const authCookie = await testLogin();
    
    // Test 2: Session with auth
    await testSession(authCookie);
    
    // Test 3: Session without auth (should fail)
    await testSessionWithoutAuth();
    
    console.log('\n✅ All tests completed successfully!');
    
  } catch (error) {
    console.error('\n❌ Test failed:', error.message);
    process.exit(1);
  }
}

// Run the tests
runTests();
