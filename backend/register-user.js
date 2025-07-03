import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Get directory name in ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from .env file
dotenv.config({ path: path.resolve(__dirname, '.env') });

const registerUser = async () => {
  try {
    const response = await fetch('http://localhost:5002/api/users/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'test.user@example.com',
        password: 'Test@1234',
        name: 'Test User'
      })
    });
    
    const data = await response.json();
    console.log('Registration Response:');
    console.log('Status:', response.status);
    console.log('Data:', JSON.stringify(data, null, 2));
    
    return data;
  } catch (error) {
    console.error('Error registering user:', error.message);
    throw error;
  }
};

registerUser().catch(console.error);
