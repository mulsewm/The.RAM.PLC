# the.RAM.plc Backend

This is the backend API for the.RAM.plc, built with Node.js, Express, and TypeScript. It provides a robust API for user authentication, partnership management, and administrative tasks.

## Features

- JWT-based Authentication
- Role-based Authorization
- Partnership Applications Management
- User Management
- Settings Management
- Audit Logging
- Email Notifications
- Database Migrations
- API Documentation

## Tech Stack

- Node.js
- TypeScript
- Express.js
- Prisma ORM
- PostgreSQL
- JWT for authentication
- Jest for testing
- Docker support

## Prerequisites

- Node.js 18.x or later
- npm or yarn
- PostgreSQL 13+ running locally or in Docker
- Docker (optional)

## Getting Started

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Create a `.env` file in the root directory:
   ```env
   # Database
   DATABASE_URL="postgresql://user:password@localhost:5432/the_ram_plc"

   # Authentication
   JWT_SECRET=your-secret-key-change-in-production
   JWT_EXPIRES_IN=7d

   # Email
   SMTP_HOST=smtp.example.com
   SMTP_PORT=587
   SMTP_USER=your-smtp-user
   SMTP_PASS=your-smtp-password
   FROM_EMAIL=noreply@theram.plc

   # Server
   PORT=3001
   NODE_ENV=development
   ```

4. Set up the database:
   ```bash
   # Run migrations
   npx prisma migrate dev

   # Seed the database
   npx prisma db seed
   ```

5. Start the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

The API will be available at `http://localhost:3001`.

## Project Structure

```
backend/
├── prisma/              # Database schema and migrations
├── src/
│   ├── api/            # API routes and controllers
│   ├── config/         # Configuration files
│   ├── middleware/     # Express middleware
│   ├── services/       # Business logic
│   └── utils/          # Utility functions
├── scripts/            # Utility scripts
└── tests/              # Test files
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run test` - Run tests
- `npm run migrate` - Run database migrations
- `npm run seed` - Seed the database
- `npm run lint` - Run ESLint

## API Documentation

### Authentication Endpoints

- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user

### User Management

- `GET /api/users` - List users
- `POST /api/users` - Create user
- `GET /api/users/:id` - Get user
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

### Partnership Management

- `GET /api/partnerships` - List partnerships
- `POST /api/partnerships` - Create partnership
- `GET /api/partnerships/:id` - Get partnership
- `PUT /api/partnerships/:id` - Update partnership
- `DELETE /api/partnerships/:id` - Delete partnership

### Settings Management

- `GET /api/settings` - List settings
- `PUT /api/settings/:key` - Update setting

## Docker Support

Build the Docker image:
```bash
docker build -t the-ram-plc-backend .
```

Run the container:
```bash
docker run -p 3001:3001 -e DATABASE_URL=your-db-url the-ram-plc-backend
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
