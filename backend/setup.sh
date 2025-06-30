#!/bin/bash

# Install dependencies
npm install express cors morgan dotenv bcryptjs jsonwebtoken
npm install --save-dev typescript @types/express @types/cors @types/morgan @types/node @types/bcryptjs @types/jsonwebtoken ts-node nodemon

# Initialize TypeScript
npx tsc --init

# Create necessary directories
mkdir -p src/{api/{auth,users,partnerships,settings},config,middleware,services,utils}

# Set execute permission for the script
chmod +x setup.sh

echo "Backend setup complete. Run 'npm run dev' to start the development server."
