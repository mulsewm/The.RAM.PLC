import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Get directory name in ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from .env file
dotenv.config({ path: path.resolve(__dirname, '.env') });

// Get the token from environment variables
const token = process.env.JWT_SECRET || process.env.JWT_TOKEN;

if (!token) {
  console.error('No JWT token found in environment variables');
  console.log('Available environment variables:', Object.keys(process.env).join(', '));
  process.exit(1);
}

console.log('JWT token found in environment variables');
console.log('Token length:', token.length);
console.log('First 10 chars:', token.substring(0, 10) + '...');
console.log('Last 10 chars:', '...' + token.substring(token.length - 10));

// Test the token with a simple API call
const testToken = async () => {
  try {
    const response = await fetch('http://localhost:5002/api/auth/me', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    const data = await response.json();
    console.log('\nAPI Response:');
    console.log('Status:', response.status);
    console.log('Data:', JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('Error testing token:', error.message);
  }
};

testToken();
