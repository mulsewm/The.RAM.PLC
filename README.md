# the.RAM.plc Frontend

This is the frontend application for the.RAM.plc, built with Next.js 13+ and TypeScript. It provides a modern, responsive interface for managing partnerships, user authentication, and administrative tasks.

## Features

- User Authentication (Login/Logout)
- Admin Dashboard
- Partnership Management
- User Management
- Settings Management
- Audit Logs
- Responsive Design
- Dark Mode Support

## Tech Stack

- Next.js 13+
- TypeScript
- Tailwind CSS
- Shadcn UI Components
- Axios for API calls
- React Query for data fetching
- Context API for state management
- JWT for authentication

## Prerequisites

- Node.js 18.x or later
- npm or yarn
- Backend API running (see backend README)

## Getting Started

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Create a `.env.local` file in the root directory:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:3001/api
   NEXT_PUBLIC_SITE_URL=http://localhost:3000
   JWT_SECRET=your-secret-key-change-in-production
   ```

4. Run the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
frontend/
├── app/                    # Next.js 13+ app directory
│   ├── (auth)/            # Authentication routes
│   ├── (dashboard)/       # Dashboard routes
│   ├── admin/             # Admin routes
│   └── api/               # API routes
├── components/            # Reusable components
├── contexts/              # React contexts
├── hooks/                # Custom hooks
├── lib/                  # Utility functions
├── public/              # Static assets
├── styles/              # Global styles
└── types/               # TypeScript type definitions
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint
- `npm run test` - Run tests
- `npm run test:e2e` - Run end-to-end tests

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
