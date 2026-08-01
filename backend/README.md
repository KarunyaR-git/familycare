# FamilyCare Backend

A RESTful backend API for managing baby care activities such as feeding, sleeping, diapers, growth tracking, vaccinations, reminders, and reports.

---

## Tech Stack

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication
- Swagger API Documentation

---

## Features

- User Authentication
- Baby Management
- Feeding Records
- Sleep Records
- Diaper Records
- Growth Records
- Vaccination Records
- Reminder Management
- Reports Dashboard
- Pagination
- Sorting
- Filtering
- Swagger Documentation

---

## Getting Started

Clone the FamilyCare repository

```bash
git clone https://github.com/KarunyaR-git/familycare.git
```

Navigate to backend

```bash
cd familycare/familycare-backend
```

Install dependencies

```bash
npm install
```

Create a `.env` file

```env
PORT=3000

MONGODB_URI=mongodb://localhost:27017/familycare

JWT_SECRET=<your_secret_key>

JWT_EXPIRES_IN=1d
```

Start the server

```bash
npm run dev
```

---

## API Documentation

Open the Swagger documentation in your browser.

```text
http://localhost:3000/api-docs
```

---

## Project Structure

```
familycare-backend/
│
├── src/
│   ├── config/
│   ├── controllers/
│   ├── docs/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   └── utils/
│
├── .env
├── .gitignore
├── app.js
├── package.json
├── package-lock.json
└── README.md
```

---

## Modules

- Authentication
- Babies
- Feedings
- Sleeps
- Diapers
- Growth
- Vaccinations
- Reminders
- Reports

---

## Author

Karunya Ramachandran