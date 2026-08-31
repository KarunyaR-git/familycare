# FamilyCare Backend

The FamilyCare backend is a RESTful API built with Node.js, Express.js, MongoDB, and Mongoose.

It provides authentication, baby profile management, daily activity tracking, reminders, dashboard data, and reports for the FamilyCare Angular frontend.

## Tech Stack

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication
- bcrypt
- Swagger / OpenAPI

## Backend Features

- User registration and login
- JWT-based authentication for protected APIs
- Password hashing using bcrypt
- Baby profile management
- Feeding activity management
- Sleep and wake-up tracking
- Diaper activity management
- Growth measurement tracking
- Vaccination management
- Reminder management
- Dashboard summary APIs
- Today's activity data
- Reports for Today, Last 7 Days, and Last 30 Days
- Pagination, sorting, and filtering
- Centralized error handling
- Request and business-rule validations
- Swagger API documentation

## Modules

The backend contains APIs for:

- Authentication
- Babies
- Feedings
- Sleep
- Diapers
- Growth
- Vaccinations
- Reminders
- Home Dashboard
- Reports

## Authentication Flow

FamilyCare uses JWT-based authentication.

1. A user registers or logs in using their credentials.
2. Passwords are securely hashed using bcrypt before being stored.
3. After successful authentication, the backend generates a JWT.
4. The Angular frontend sends the JWT with protected API requests.
5. Authentication middleware verifies the token before allowing access to protected routes.
6. The authenticated user's ID is used to ensure users can access only their own data.

## Backend Architecture

The backend follows a route-controller-model structure with middleware and shared utilities.

```text
Request
   ↓
Express Route
   ↓
Authentication Middleware
   ↓
Controller
   ↓
Business Rules / Validation
   ↓
Mongoose Model
   ↓
MongoDB
   ↓
Response
```

## Project Structure

```text
backend/
│
├── src/
│   ├── config/          # Application configuration
│   ├── controllers/     # Request handling and business logic
│   ├── docs/            # Swagger API documentation
│   ├── middleware/      # Authentication and error handling
│   ├── models/          # Mongoose schemas and models
│   ├── routes/          # Express API routes
│   └── utils/           # Shared utility functions
│
├── .env                 # Local environment variables (not committed)
├── .gitignore
├── app.js               # Application entry point
├── package.json
├── package-lock.json
└── README.md
```

## Local Development

### Prerequisites

Before running the backend locally, make sure you have:

- Node.js
- npm
- MongoDB running locally

### Install Dependencies

From the repository root, navigate to the backend directory:

```bash
cd backend
```

Install the required dependencies:

```bash
npm install
```

### Environment Configuration

Create a `.env` file inside the backend directory.

```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/familycare
JWT_SECRET=<your_secret_key>
JWT_EXPIRES_IN=1d
```

Do not commit the `.env` file or real secret values to the repository.

### Start the Backend

Run:

```bash
npm run dev
```

The backend will be available locally at:

```text
http://localhost:3000
```

## API Documentation

Swagger documentation is available for exploring and testing the FamilyCare REST APIs.

### Local

```text
http://localhost:3000/api-docs/
```

### Production

https://familycare-backend-ig8c.onrender.com/api-docs/

## Deployment

The FamilyCare backend is deployed as a Node.js web service on Render.

MongoDB Atlas is used as the production database.

Production environment variables, including the MongoDB connection string and JWT secret, are configured securely through the deployment environment and are not stored in the repository.

### Live Backend

https://familycare-backend-ig8c.onrender.com/

## Production Architecture

```text
Angular Frontend
       ↓
Render Static Site
       ↓
FamilyCare REST API
       ↓
Render Node.js Web Service
       ↓
MongoDB Atlas
```

The backend is configured to allow requests from the deployed FamilyCare frontend through CORS.

## Deployment Note

The backend is currently hosted on Render's free tier. After a period of inactivity, the service may spin down, so the first request can take additional time while the service starts again.