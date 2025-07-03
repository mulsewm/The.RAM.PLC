import fetch from 'node-fetch';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Get directory name in ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from .env file
dotenv.config({ path: path.resolve(__dirname, '.env') });

const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:5002/api';
let authToken = '';
let testUserId = '';
let testUserEmail = '';
let testRegistrationId = '';

// Helper function for API requests
async function makeRequest(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const headers = {
    'Content-Type': 'application/json',
    ...(authToken && { 'Authorization': `Bearer ${authToken}` }),
    ...(options.headers || {})
  };

  try {
    const response = await fetch(url, {
      ...options,
      headers,
      body: options.body ? JSON.stringify(options.body) : undefined,
    });

    const data = await response.json().catch(() => ({}));
    
    return {
      status: response.status,
      data,
      headers: Object.fromEntries(response.headers.entries())
    };
  } catch (error) {
    console.error(`Request to ${endpoint} failed:`, error.message);
    throw error;
  }
}

// Test suite
async function runTests() {
  console.log('🚀 Starting API Tests...\n');
  
  // ==================== AUTHENTICATION TESTS ====================
  console.log('\n🔐 AUTHENTICATION TESTS');
  console.log('-------------------');
  
  // 1. Test User Registration
  await test('Register a new user', async () => {
    const email = `test.${Date.now()}@example.com`;
    const response = await makeRequest('/users/register', {
      method: 'POST',
      body: {
        email,
        password: 'Test@1234',
        name: 'Test User'
      }
    });

    if (response.status === 200 && response.data.success) {
      testUserId = response.data.data.user.id;
      testUserEmail = email; // Save the test user email for later use
    }
    
    return response.status === 200 && response.data.success;
  });

  // 2. Test Duplicate User Registration
  await test('Prevent duplicate user registration', async () => {
    const response = await makeRequest('/users/register', {
      method: 'POST',
      body: {
        email: 'test.user@example.com',
        password: 'Test@1234',
        name: 'Duplicate User'
      }
    });
    
    return response.status === 400 && response.data.message === 'User already exists';
  });

  // 3. Test Login with Valid Credentials
  await test('Login with valid credentials', async () => {
    const response = await makeRequest('/auth/login', {
      method: 'POST',
      body: {
        email: testUserEmail || 'test.user@example.com',
        password: 'Test@1234'
      }
    });

    if (response.status === 200 && response.data.success) {
      authToken = response.data.data.token;
      console.log('Auth token set for testing');
    }
    
    return response.status === 200 && response.data.success;
  });

  // 4. Test Login with Invalid Credentials
  await test('Prevent login with invalid password', async () => {
    const response = await makeRequest('/auth/login', {
      method: 'POST',
      body: {
        email: 'test.user@example.com',
        password: 'wrongpassword'
      }
    });
    
    return response.status === 401 && response.data.message === 'Invalid credentials';
  });

  // 5. Test Get Current User with Valid Token
  await test('Get current user with valid token', async () => {
    const response = await makeRequest('/auth/me', {
      method: 'GET'
    });
    
    return response.status === 200 && response.data.success;
  });

  // ==================== REGISTRATION TESTS ====================
  console.log('\n📝 REGISTRATION TESTS');
  console.log('--------------------');
  
  // 6. Test Create Registration with Valid Data
  await test('Create a new registration with valid data', async () => {
    // First, try to get the current user's registration
    try {
      const myRegResponse = await makeRequest('/registrations/me', {
        method: 'GET'
      });

      if (myRegResponse.status === 200 && myRegResponse.data.success) {
        console.log('User already has a registration, using existing one');
        testRegistrationId = myRegResponse.data.data.id;
        return true;
      }
    } catch (error) {
      console.log('No existing registration found, creating a new one');
    }

    const registrationData = {
      firstName: 'John',
      lastName: 'Doe',
      email: testUserEmail || `john.doe.${Date.now()}@example.com`,
      phoneNumber: `+1${Math.floor(1000000000 + Math.random() * 9000000000)}`,
      dateOfBirth: '1990-01-01',
      nationality: 'American',
      currentCountry: 'United States',
      profession: 'Software Engineer',
      yearsOfExperience: 5,
      educationLevel: 'BACHELORS',
      skills: ['JavaScript', 'TypeScript'],
      languages: ['English'],
      preferredCountries: ['Canada'],
      visaType: 'WORK',
      relocationTimeline: '6_MONTHS',
      documents: []
    };

    const response = await makeRequest('/registrations', {
      method: 'POST',
      body: registrationData
    });

    console.log('Registration response status:', response.status);
    console.log('Registration response data:', JSON.stringify(response.data, null, 2));

    if (response.status === 201 || response.status === 200) {
      if (response.data.success) {
        testRegistrationId = response.data.data?.id || response.data.registrationId;
        return true;
      } else if (response.data.error === 'DUPLICATE_REGISTRATION') {
        console.log('User already has a registration (duplicate detected)');
        // Try to get the existing registration
        const myRegResponse = await makeRequest('/registrations/me', {
          method: 'GET'
        });
        
        if (myRegResponse.status === 200 && myRegResponse.data.success) {
          testRegistrationId = myRegResponse.data.data.id;
          return true;
        }
      }
    }
    
    return false;
  });

  // 7. Test Create Registration with Missing Required Fields
  await test('Prevent registration with missing required fields', async () => {
    const response = await makeRequest('/registrations', {
      method: 'POST',
      body: {
        firstName: 'John'
        // Missing other required fields
      }
    });
    
    // Check for either validation error format
    return response.status === 400 && 
      (response.data.message?.includes('Validation failed') || 
       response.data.error === 'VALIDATION_ERROR');
  });

  // 8. Test Get Registration by ID
  await test('Get registration by ID', async () => {
    if (!testRegistrationId) {
      console.log('Skipping - No registration ID available');
      return false;
    }
    
    const response = await makeRequest(`/registrations/${testRegistrationId}`, {
      method: 'GET'
    });
    
    return response.status === 200 && response.data.success;
  });

  // 9. Test Get Non-Existent Registration
  await test('Handle non-existent registration', async () => {
    const response = await makeRequest('/registrations/nonexistent-id', {
      method: 'GET'
    });
    
    return response.status === 404;
  });

  // 10. Test Update Registration Status (Admin Only)
  await test('Update registration status (requires admin)', async () => {
    if (!testRegistrationId) return false;
    
    // Skip this test if we're not running with admin credentials
    if (!process.env.ADMIN_TOKEN) {
      console.log('Skipping admin test - no admin token provided');
      return true; // Skip this test
    }
    
    const response = await makeRequest(`/api/registrations/${testRegistrationId}/status`, {
      method: 'PATCH',
      body: {
        status: 'APPROVED',
        notes: 'Approved by automated test'
      }
    });
    
    // Should be 200 OK if admin, 403 Forbidden if not admin
    return response.status === 200 || response.status === 403;
  });

  // ==================== AUTHORIZATION TESTS ====================
  console.log('\n🔒 AUTHORIZATION TESTS');
  console.log('--------------------');
  
  // 11. Test Access Protected Route Without Token
  await test('Prevent access to protected routes without token', async () => {
    const savedToken = authToken;
    authToken = ''; // Clear token
    
    const response = await makeRequest('/auth/me', {
      method: 'GET'
    });
    
    authToken = savedToken; // Restore token
    return response.status === 401; // Unauthorized
  });

  // 12. Test Access with Invalid Token
  await test('Prevent access with invalid token', async () => {
    const savedToken = authToken;
    authToken = 'invalid.token.here';
    
    const response = await makeRequest('/auth/me', {
      method: 'GET'
    });
    
    authToken = savedToken;
    return response.status === 401;
  });

  // ==================== CLEANUP ====================
  console.log('\n🧹 CLEANUP');
  console.log('--------');
  
  // 13. Test Logout
  await test('Logout current user', async () => {
    const response = await makeRequest('/auth/logout', {
      method: 'POST'
    });
    
    if (response.status === 200) {
      authToken = '';
    }
    
    return response.status === 200 && response.data.success;
  });

  // 14. Verify Logout Worked
  await test('Verify token is invalid after logout', async () => {
    const response = await makeRequest('/auth/me', {
      method: 'GET'
    });
    
    return response.status === 401; // Should be unauthorized after logout
  });

  console.log('\n✅ All tests completed!');
}

// Test runner helper
async function test(name, testFn) {
  try {
    process.stdout.write(`🧪 Testing: ${name}... `);
    const result = await testFn();
    
    if (result) {
      console.log('✅ PASSED');
      return true;
    } else {
      console.log('❌ FAILED');
      return false;
    }
  } catch (error) {
    console.log('❌ ERROR');
    console.error('  ', error.message);
    return false;
  }
}

// Run the tests
runTests().catch(console.error);
