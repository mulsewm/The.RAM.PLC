import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

// This is a simplified version of your auth logic to generate a test token
// In a real scenario, you would use your actual login endpoint

// Admin credentials from your seed
const adminUser = {
  id: 1,
  email: 'admin@example.com',
  password: 'admin123',
  role: 'ADMIN',
  name: 'Admin User'
};

// Simulate login to get token
async function getAuthToken() {
  // In a real app, you would verify the password against the hashed password in the database
  const token = jwt.sign(
    { id: adminUser.id, email: adminUser.email, role: adminUser.role, name: adminUser.name },
    process.env.JWT_SECRET || 'your_jwt_secret',
    { expiresIn: '1h' }
  );
  
  console.log('Auth Token:', token);
  return token;
}

getAuthToken().catch(console.error);
