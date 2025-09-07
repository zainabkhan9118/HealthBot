# HealthBot Authentication Backend

A Node.js authentication backend with JWT for the HealthBot application.

## Features

- User registration and login
- JWT authentication
- Password hashing
- MongoDB Atlas integration
- Express API

## Getting Started

1. Install dependencies:
   ```
   npm install
   ```

2. Update the .env file with your MongoDB Atlas credentials and JWT secret:
   ```
   PORT=5000
   MONGODB_URI=mongodb+srv://your_username:your_password@cluster0.mongodb.net/healthbot
   JWT_SECRET=your_jwt_secret_key_here
   JWT_EXPIRE=30d
   ```

3. Start the server:
   ```
   npm run dev
   ```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (protected)

### Users
- `GET /api/users` - Get all users (protected)
- `GET /api/users/:id` - Get user by ID (protected)
- `PUT /api/users/:id` - Update user (protected)
- `DELETE /api/users/:id` - Delete user (protected)
