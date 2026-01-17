# MCC Task Manager - Backend API

Express.js + PostgreSQL REST API for MCC Task Manager

## 🚀 Quick Start

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Setup Database

```bash
npm run db:migrate
npm run db:seed
```

### 3. Start Development Server

```bash
npm run dev
```

Server will run on `http://localhost:3000`

## 📚 API Endpoints

### Authentication

- `POST /api/auth/login` - Login with credentials
- `GET /api/auth/me` - Get current user (requires token)

### Users (Manager only)

- `GET /api/users` - List all users
- `POST /api/users` - Create new user
- `DELETE /api/users/:id` - Delete user
- `PUT /api/users/:id/password` - Update password

### Tasks (Manager only)

- `GET /api/tasks` - List all tasks
- `POST /api/tasks` - Create task
- `DELETE /api/tasks/:id` - Delete task

### User Tasks

- `GET /api/user-tasks` - Get current user's tasks
- `GET /api/user-tasks/admin/all` - Get all tasks (manager only)
- `POST /api/user-tasks` - Assign task to user (manager only)
- `PUT /api/user-tasks/:id` - Update task progress
- `DELETE /api/user-tasks/:id` - Remove task (manager only)

## 🔐 Authentication

Include JWT token in header:

```
Authorization: Bearer <token>
```

## 📦 Database Schema

### Users

- id (UUID)
- username (unique)
- password_hash
- role (USER | MANAGER)
- created_at, updated_at

### Tasks

- id (UUID)
- designation
- created_at, updated_at

### UserTasks

- id (UUID)
- user_id (FK)
- task_id (FK)
- start_date, end_date
- status (NOT_STARTED | IN_PROGRESS | COMPLETED)
- notes
- updated_at

## 🛠️ Development

Build TypeScript:

```bash
npm run build
```

Start production server:

```bash
npm run start
```

## 📝 Team Credentials

**Manager:**

- Username: `Mohammed Rhazal`
- Password: `MR@MCC26`

**Users:**

- Username: `Naoufal Laamouri` | Password: `NL@MCC26`
- Username: `Houda Fariana` | Password: `HF@MCC26`
- Username: `Wissal` | Password: `WW@MCC26`

## 🔗 Environment Variables

See `.env.example` for required variables
