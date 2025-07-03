import jwt from 'jsonwebtoken';

// This should match the secret in your .env file
const JWT_SECRET = 'your_jwt_secret_here';

// Create a test token for the admin user
const token = jwt.sign(
  {
    id: 1,
    email: 'admin@example.com',
    role: 'ADMIN',
    name: 'Admin User'
  },
  JWT_SECRET,
  { expiresIn: '1h' }
);

console.log('Test JWT Token:'); 
console.log(token);
