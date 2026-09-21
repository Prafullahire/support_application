# Support Team Management System

A centralized multi-branch application for managing support and administrative operations. Employees can raise and track requests, while admins manage assets, inventory, expenses, contracts, and operational records.

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | Next.js 14, React, TypeScript, Tailwind CSS, Zustand |
| Backend | NestJS, Prisma ORM, JWT Authentication |
| Database | MySQL |
| API Docs | Swagger (OpenAPI) |

## Project Structure

```
Support_App/
├── backend/          # NestJS REST API
│   ├── prisma/       # Database schema & seed
│   └── src/          # API modules
├── frontend/         # Next.js web application
│   └── src/          # Pages & components
└── README.md
```

## Prerequisites

- Node.js 18+
- MySQL 8.0+
- npm or yarn

## Quick Start

### 1. Database Setup

Create a MySQL database:

```sql
CREATE DATABASE support_team_db;
```

### 2. Backend Setup

```bash
cd backend
cp .env.example .env
# Edit .env with your MySQL credentials

npm install
npx prisma generate
npx prisma migrate dev --name init
npm run prisma:seed
npm run start:dev
```

API runs at `http://localhost:3001`  
Swagger docs at `http://localhost:3001/api/docs`

### 3. Frontend Setup

```bash
cd frontend
cp .env.example .env.local
npm install
npm run dev
```

App runs at `http://localhost:3000`

## Default Login Credentials

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@support.com | Admin@123 |
| Employee | employee@support.com | Employee@123 |

## Modules

- **Authentication** — Register, login, JWT tokens, role-based access
- **Branches** — Multi-branch support
- **Requests** — Generic request lifecycle management
- **Courier** — Pickup/delivery tracking
- **Assets** — Mobile asset assignment and returns
- **Joining Kit** — New joiner kit inventory and issuance
- **Expenses** — Expense tracking with categories
- **ID Cards** — ID card stock and assignment
- **AMC** — Annual maintenance contracts with expiry alerts
- **Seating** — Daily seating occupancy records
- **Brochures** — Brochure stock management
- **PG Records** — Employee accommodation records
- **Notifications** — In-app notifications
- **Reports** — Dashboard stats and Excel export
- **Data Import** — Bulk import from Excel files
- **Audit Logs** — Activity history tracking

## API Endpoints

All endpoints are prefixed with `/api/v1`. Key routes:

| Module | Endpoints |
|--------|-----------|
| Auth | `POST /auth/login`, `POST /auth/register`, `GET /auth/profile` |
| Dashboard | `GET /dashboard` |
| Branches | `GET/POST/PUT/DELETE /branches` |
| Courier | `GET/POST /courier`, `PATCH /courier/:id/status` |
| Assets | `GET/POST /assets`, `POST /assets/:id/assign` |
| Reports | `GET /reports/dashboard`, `GET /reports/export` |

See Swagger docs for the complete API reference.

## Environment Variables

### Backend (.env)

```
DATABASE_URL=mysql://user:password@localhost:3306/support_team_db
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=15m
JWT_REFRESH_SECRET=your-refresh-secret
JWT_REFRESH_EXPIRES_IN=7d
PORT=3001
FRONTEND_URL=http://localhost:3000
```

### Frontend (.env.local)

```
NEXT_PUBLIC_API_URL=http://localhost:3001/api/v1
```

## Development

```bash
# Backend (watch mode)
cd backend && npm run start:dev

# Frontend (dev server)
cd frontend && npm run dev

# Database migrations
cd backend && npx prisma migrate dev

# Reset database
cd backend && npx prisma migrate reset
```

## License

Private — Internal use only.
