import jwt from 'jsonwebtoken';

// This should match the secret in your .env file
const JWT_SECRET = 'your_jwt_secret_here';

// Create a test token for the admin user with the correct ID
const token = jwt.sign(
  {
    id: 'cmckl636f0000xs22c06wo5bd', // The actual ID from the database
    email: 'admin@example.com',
    role: 'ADMIN',
    name: 'Admin User'
  },
  JWT_SECRET,
  { expiresIn: '1h' }
);

console.log('Admin JWT Token:'); 
console.log(token);
