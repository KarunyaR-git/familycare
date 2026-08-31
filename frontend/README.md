# FamilyCare Frontend

The frontend for FamilyCare is built with Angular and provides a responsive interface for managing baby profiles, tracking daily care activities, scheduling reminders, and viewing activity reports.

It communicates with the FamilyCare REST API for authentication, data management, dashboard summaries, and reporting.

## Tech Stack

- Angular
- TypeScript
- Angular Material
- RxJS
- Chart.js
- Reactive Forms

## Frontend Features

- Login and registration using reactive forms
- Protected routes using Angular route guards
- JWT attachment to API requests using an HTTP interceptor
- Automatic logout when the authentication token expires
- Baby selection and management from the dashboard
- Quick Actions for adding feeding, sleep, wake-up, diaper, growth, and vaccination records
- Today's activity view with filtering, editing, and deletion
- Reminder creation and management with in-app notifications
- Reports for Today, Last 7 Days, and Last 30 Days
- Feeding, sleep, diaper, and growth insights with Chart.js visualization
- Reusable form and modal components
- Dynamic and form-level validations
- Snackbar notifications for success, error, warning, and reminder messages
- Responsive layouts for desktop and mobile devices

## Frontend Architecture

The frontend is organized using a feature-based structure with shared reusable components and centralized services, models, utilities, and validators.

```text
src/app/
├── core/
│   ├── interceptors/    # HTTP authentication interceptor
│   ├── models/          # Application data models
│   └── services/        # API and application services
│
├── features/
│   ├── auth/            # Login and registration
│   ├── babies/          # Baby management
│   ├── feedings/        # Feeding forms
│   ├── sleeps/          # Sleep and wake-up forms
│   ├── diapers/         # Diaper forms
│   ├── growth/          # Growth tracking
│   ├── vaccinations/    # Vaccination tracking
│   ├── reminders/       # Reminder forms
│   ├── home/            # Dashboard and today's activities
│   └── reports/         # Reports and insights
│
├── shared/
│   ├── components/      # Reusable UI/form components
│   ├── pipes/           # Custom pipes
│   ├── utils/           # Shared utility functions
│   └── validators/      # Custom form validators
│
├── app.routes.ts        # Application routes
└── auth-guard.ts        # Protected route guard
```

## Local Development

### Prerequisites

Before running the frontend locally, make sure you have:

- Node.js
- npm
- Angular CLI
- FamilyCare backend running locally

### Install Dependencies

Navigate to the frontend directory:

```bash
cd frontend
```

Install the required dependencies:

```bash
npm install
```

### Start the Development Server

Run:

```bash
ng serve
```

Open the application in your browser:

```text
http://localhost:4200
```

During local development, the frontend communicates with the locally running FamilyCare backend at:

```text
http://localhost:3000
```

### Production Build

To create a production build, run:

```bash
ng build
```

The generated production files are stored in the `dist/` directory.


## Environment Configuration

FamilyCare uses separate Angular environment configurations for development and production.

### Development

`src/environments/environment.development.ts`

```text
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000'
};
```

This configuration is used when running the application locally with:

```bash
ng serve
```

### Production

`src/environments/environment.ts`

```text
export const environment = {
  production: true,
  apiUrl: 'https://familycare-backend-ig8c.onrender.com'
};
```

This configuration is used for the production build:

```bash
ng build
```

Angular uses the configured file replacement to select the development environment during local development, while production builds use the production environment. 

## Deployment

The FamilyCare frontend is deployed as a static site on Render.

The production deployment process:

1. Render pulls the latest code from the GitHub repository.
2. Frontend dependencies are installed.
3. Angular creates an optimized production build.
4. The generated static files are deployed by Render.
5. The production frontend communicates with the deployed FamilyCare backend API.

### Live Frontend

https://familycare-frontend-8mma.onrender.com

### SPA Routing

The deployment is configured with a rewrite rule that redirects application routes to `index.html`, allowing Angular routing to work correctly when a protected or nested route is refreshed directly in the browser.