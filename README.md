# HealthTrack — Personal Healthcare Management System

A full-stack MERN application for managing personal health data including appointments, medications, health metrics, and medical records.

🔗 **Live Demo**: [healthcare-client-eta.vercel.app](https://healthcare-client-eta.vercel.app)

## Features

- JWT authentication (register, login, protected routes)
- Dashboard with real-time health summary and weight trend chart
- Appointment scheduling and management
- Medication tracker with morning/afternoon/night dose tracking
- Health metrics logging (weight, sleep, blood pressure) with charts
- Medical records upload with category filters
- Profile page (blood group, allergies, emergency contact)
- Dark mode + search

## Tech Stack

**Frontend**: React, React Router, Axios, Recharts, Context API  
**Backend**: Node.js, Express, MongoDB Atlas, Mongoose, JWT, bcryptjs, Multer  
**Deployment**: Vercel (frontend), Render (backend)

## Project Structure

```text
healthcare-app/
├── client/          # React frontend
└── server/          # Node.js + Express backend
```

## API Routes

| Method | Route | Description |
|--------|-------|-------------|
| POST | /api/auth/register | Register user |
| POST | /api/auth/login | Login user |
| GET/POST/PUT/DELETE | /api/appointments | Manage appointments |
| GET/POST/PATCH/DELETE | /api/medications | Manage medications |
| GET/POST/DELETE | /api/health-metrics | Log health metrics |
| GET/POST/DELETE | /api/medical-records | Upload/manage records |
| GET/POST | /api/profile | User profile |