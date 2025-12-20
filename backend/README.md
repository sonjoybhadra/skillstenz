# TechTooTalk Backend

Backend API for the AI-Powered Education & Career Platform.

## Features

- User authentication with JWT
- Role-based access control
- Membership management
- Technology and content management
- AI assistant with usage limits
- Resume builder
- Payment integration with Stripe
- Admin dashboard

## Tech Stack

- Node.js
- Express.js
- MongoDB with Mongoose
- JWT for authentication
- Stripe for payments
- OpenAI API for AI features

## Installation

1. Clone the repository
2. Navigate to backend directory
3. Install dependencies:
   ```bash
   npm install
   ```
4. Create .env file with required environment variables
5. Start the server:
   ```bash
   npm run dev
   ```

## API Endpoints

### Authentication
- POST /api/auth/register
- POST /api/auth/login
- POST /api/auth/refresh
- POST /api/auth/logout

### Users
- GET /api/users/profile
- PUT /api/users/profile

### Profiles
- GET /api/profiles
- POST /api/profiles
- GET /api/profiles/versions

### Memberships
- GET /api/memberships
- POST /api/memberships/upgrade

### Technologies
- GET /api/technologies
- POST /api/technologies (Admin)

### Content
- GET /api/content/search
- POST /api/content (Authenticated)

### AI
- POST /api/ai/query
- GET /api/ai/usage

### Resume
- GET /api/resume
- POST /api/resume
- GET /api/resume/export/pdf

### Payments
- POST /api/payments/create-intent
- POST /api/payments/confirm

### Admin
- GET /api/admin/dashboard
- GET /api/admin/users

## Environment Variables

See .env file for required environment variables.

## Database Models

- User
- Profile
- Membership
- Technology
- Topic
- Content
- Resume
- Payment
- AILog

## Security

- Password hashing with bcrypt
- JWT token authentication
- Rate limiting
- Input validation
- CORS configuration
- Helmet for security headers