import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Get directory name in ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from .env file
dotenv.config({ path: path.resolve(__dirname, '.env') });

const API_BASE_URL = 'http://localhost:5002/api';

// Helper function for API requests
async function makeRequest(url, options = {}) {
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {})
    }
  });
  
  const data = await response.json().catch(() => ({}));
  
  return {
    status: response.status,
    data,
    headers: Object.fromEntries(response.headers.entries())
  };
}

// 1. Register a new user
async function registerUser() {
  console.log('\n=== Registering a new user ===');
  const { status, data } = await makeRequest(`${API_BASE_URL}/users/register`, {
    method: 'POST',
    body: JSON.stringify({
      email: `test.${Date.now()}@example.com`,
      password: 'Test@1234',
      name: 'Test User'
    })
  });
  
  console.log('Status:', status);
  console.log('Response:', JSON.stringify(data, null, 2));
  
  return data;
}

// 2. Login to get token
async function loginUser(email, password) {
  console.log('\n=== Logging in ===');
  const { status, data } = await makeRequest(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    body: JSON.stringify({ email, password })
  });
  
  console.log('Status:', status);
  console.log('Response:', JSON.stringify(data, null, 2));
  
  if (!data.success || !data.data?.token) {
    throw new Error('Login failed');
  }
  
  return data.data.token;
}

// 3. Create a new registration
async function createRegistration(token, registrationData) {
  console.log('\n=== Creating registration ===');
  const { status, data } = await makeRequest(`${API_BASE_URL}/registrations`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(registrationData)
  });
  
  console.log('Status:', status);
  console.log('Response:', JSON.stringify(data, null, 2));
  
  return data.data;
}

// 4. List all registrations
async function listRegistrations(token) {
  console.log('\n=== Listing registrations ===');
  const { status, data } = await makeRequest(`${API_BASE_URL}/registrations`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  
  console.log('Status:', status);
  console.log('Response:', JSON.stringify(data, null, 2));
  
  return data.data;
}

// Main function to run the test flow
async function testRegistrationFlow() {
  try {
    // 1. Register
    const registerResponse = await registerUser();
    const user = registerResponse.data?.user;
    
    if (!user) {
      throw new Error('Failed to register user');
    }
    
    console.log('Registered user email:', user.email);
    
    // 2. Login
    const token = await loginUser(user.email, 'Test@1234');
    
    if (!token) {
      throw new Error('Failed to get authentication token');
    }
    
    // 3. Create registration
    const registrationData = {
      firstName: 'John',
      lastName: 'Doe',
      email: `john.doe.${Date.now()}@example.com`,
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
      relocationTimeline: '6_MONTHS'
    };
    
    await createRegistration(token, registrationData);
    
    // 4. List registrations
    await listRegistrations(token);
    
    console.log('\n✅ Test completed successfully!');
  } catch (error) {
    console.error('\n❌ Test failed:', error.message);
    process.exit(1);
  }
}

// Run the test
testRegistrationFlow();
