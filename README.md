# FamilyCare

FamilyCare is a full-stack baby care management application designed to help parents track and manage their baby's daily care activities in one place.

It supports feeding, sleep and wake-up tracking, diaper changes, growth measurements, vaccinations, reminders, daily activity monitoring, and reports with care insights.

## Live Application

- Frontend: https://familycare-frontend-8mma.onrender.com
- Backend API: https://familycare-backend-ig8c.onrender.com/
- API Documentation: https://familycare-backend-ig8c.onrender.com/api-docs/

## Tech Stack

### Frontend
- Angular
- TypeScript
- Angular Material
- Chart.js

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication
- bcrypt

### Deployment
- Render
- MongoDB Atlas

## Key Features

- User registration and login with secure authentication
- Create, update, and manage baby profiles
- Track daily activities including feeding, sleep, wake-up, diaper changes, growth, and vaccinations
- Add, update, and delete activity records
- View today's activities with filtering and activity management
- View the latest activities directly from the dashboard
- Set reminders for upcoming baby care activities
- View care summaries and reports for Today, Last 7 Days, and Last 30 Days
- Analyze feeding, sleep, diaper, and growth information through reports and charts
- Automatic logout when the authentication session expires

## Application Architecture

FamilyCare follows a client-server architecture with an Angular frontend, a Node.js/Express REST API, and MongoDB for data storage.

### Request Flow

1. The user performs an action in the Angular application.
2. Reactive form validations are checked before the API request is sent.
3. Angular services handle HTTP communication with the backend.
4. The authentication interceptor attaches the JWT token to protected requests.
5. Express routes receive the request and authentication middleware validates the token.
6. The appropriate controller handles business rules and request processing.
7. Mongoose models apply schema validations and communicate with MongoDB.
8. The backend returns the response to the Angular application.
9. The frontend updates the displayed data based on the API response.

### High-Level Flow

Angular Frontend → REST API → Authentication Middleware → Controllers → Mongoose → MongoDB

## Project Structure

```text
familycare/
├── frontend/          # Angular frontend application
│   └── README.md      # Frontend setup and documentation
│
├── backend/           # Node.js and Express backend API
│   └── README.md      # Backend setup and API documentation
│
└── README.md          # Overall project documentation
```

## Screenshots

### Login
![FamilyCare Login](screenshots/login.png)

### Dashboard
![FamilyCare Dashboard](screenshots/dashboard.png)

### Today's Activities
![FamilyCare Today's Activities](screenshots/today-activities.png)

### Reports & Insights
![FamilyCare Reports and Insights](screenshots/reports.png)

## Running Locally

Clone the repository:

```bash
git clone https://github.com/KarunyaR-git/familycare.git
cd familycare
```

The application contains separate frontend and backend projects.

For detailed setup instructions, refer to:

- [Frontend Setup](frontend/README.md)
- [Backend Setup](backend/README.md)

## Project Status

FamilyCare V1 is complete and deployed.

The current version includes authentication, baby management, activity tracking, reminders, dashboard summaries, today's activity management, and reports.

### Current Limitations

- Reminder notifications are in-app notifications and require the application to be open.
- The application is hosted on Render's free tier, so the backend may take a short time to respond after a period of inactivity.