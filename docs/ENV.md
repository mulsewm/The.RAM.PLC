# Environment Variables

This document outlines the required and optional environment variables for the Partner Management System.

## Required Variables

### Database
```
DATABASE_URL=postgresql://user:password@localhost:5432/ram_plc?schema=public
```

### Authentication
```
NEXTAUTH_SECRET=your-secret-key
NEXTAUTH_URL=http://localhost:3000
```

### Email (Required for User Notifications)
```
# SMTP Configuration
EMAIL_HOST=smtp.example.com
EMAIL_PORT=587
EMAIL_USER=your-email@example.com
EMAIL_PASSWORD=your-email-password
EMAIL_FROM=no-reply@theramplc.com
EMAIL_FROM_NAME="RAM Partner Portal"
EMAIL_SECURE=false # Set to true for port 465

# Application URL for email links
NEXTAUTH_URL=http://localhost:3000
```

**Note:** For development, you can leave these unset and emails will be logged to the console instead of being sent.

## Optional Variables

### Application
```
NODE_ENV=development # or production
PORT=3000 # Default: 3000
```

### Rate Limiting
```
RATE_LIMIT_WINDOW_MS=900000 # 15 minutes
RATE_LIMIT_MAX_REQUESTS=100 # per window
```

## Setting Up Locally

1. Copy `.env.example` to `.env`
2. Update the values with your configuration
3. Restart your development server for changes to take effect

## Production Notes

- Never commit your `.env` file to version control
- In production, set environment variables through your hosting provider's dashboard
- Use strong, unique values for all secrets
- Consider using a secret management service for production environments
