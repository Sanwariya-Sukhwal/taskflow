## Live Demo

**Frontend:** https://taskflow-seven-pied.vercel.app/

**Backend API:** https://taskflow-c8jm.onrender.com/

**GitHub:** https://github.com/Sanwariya-Sukhwal/taskflow

# TaskFlow

A simple full-stack task board for small teams, inspired by Trello. Create, edit, delete, move, and filter tasks across columns — all data persisted in PostgreSQL.

---

## Tech Stack

**Frontend:** React, JavaScript (JSX), Vite, CSS
**Backend:** Node.js, Express.js, PostgreSQL, raw SQL via `pg`
**Testing:** Jest, Supertest
**API Testing:** Postman

---

## Features

- View a board with multiple columns and tasks
- Create, edit, delete, and move tasks between columns
- Set task priority (Low / Medium / High) and an optional description
- Filter tasks by priority
- Backend + frontend validation (task title required, priority restricted)
- Loading, error, and success states with retry on failure
- All changes persisted — refreshing never loses data

---

## Project Structure

```text
taskflow/
│
├── frontend/
│   ├── public/
│   └── src/
│       ├── assets/
│       │
│       ├── components/
│       │   ├── Board/
│       │   │   ├── Board.jsx
│       │   │   └── Board.css
│       │   │
│       │   ├── Column/
│       │   │   ├── Column.jsx
│       │   │   └── Column.css
│       │   │
│       │   ├── TaskCard/
│       │   │   ├── TaskCard.jsx
│       │   │   └── TaskCard.css
│       │   │
│       │   ├── TaskForm/
│       │   │   ├── TaskForm.jsx
│       │   │   └── TaskForm.css
│       │   │
│       │   └── FilterBar/
│       │       ├── FilterBar.jsx
│       │       └── FilterBar.css
│       │
│       ├── pages/
│       │   └── TaskBoard/
│       │       ├── TaskBoard.jsx
│       │       └── TaskBoard.css
│       │
│       ├── services/
│       │   └── taskApi.js
│       │
│       ├── App.jsx
│       ├── App.css
│       ├── main.jsx
│       └── index.css
│

```

---

## Database

Three tables, linked by foreign keys:

```text
Board → Columns → Tasks
```

| Table | Key Columns |
|---|---|
| `boards` | id, name |
| `columns` | id, board_id (FK), name |
| `tasks` | id, column_id (FK), title, description, priority, created_at |

Uses raw SQL (no ORM) — e.g. `LEFT JOIN` + `GROUP BY` to count tasks per column.

---

## Backend API

Base URL: `https://taskflow-c8jm.onrender.com/api`

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/boards/:id` | Get a board with its columns & tasks |
| POST | `/tasks` | Create a task |
| PUT | `/tasks/:id` | Update a task |
| DELETE | `/tasks/:id` | Delete a task |
| PATCH | `/tasks/:id/move` | Move a task to another column |
| GET | `/tasks/filter?priority=High` | Filter tasks by priority |

Validation: task title is required; priority must be `Low`, `Medium`, or `High`. Invalid requests return `400` with a clear error message.

---

## Local Setup

### Requirements
Node.js, npm, PostgreSQL

### 1. Clone
```bash
git clone <YOUR_GITHUB_REPOSITORY_URL>
cd taskflow
```

### 2. Backend
```bash
cd backend
npm install
```
Create `.env`:
```env
PORT=5000
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=your_postgres_password
DB_NAME=taskflow
```
Make sure a PostgreSQL database named `taskflow` exists, then:
```bash
npm run db:setup   # creates tables + seed data
npm run dev         # runs on http://localhost:5000
```

### 3. Frontend
```bash
cd frontend
npm install
npm run dev   # runs on http://localhost:5173
```

---

## Testing

```bash
cd backend
npm test
```
Covers: creating a task without a title, moving a task, and database query correctness.

```text
Test Suites: 3 passed, 3 total
Tests:       3 passed, 3 total
```

---

## How It Works

- `services/taskApi.js` centralizes all API calls, kept out of UI components
- State is managed with `useState` / `useEffect` — no external state library
- After every create, edit, delete, or move, the board reloads from the backend so the UI always matches the database
- Backend validates independently of the frontend, since frontend checks can be bypassed

---

## Decisions / Assumptions

- PostgreSQL over SQLite/MySQL, for real relational queries
- Raw SQL over an ORM, so joins/aggregation stay explicit and reviewable
- React + JavaScript over TypeScript
- A move-to-column dropdown instead of drag-and-drop, prioritizing reliability
- Single seeded board — auth, teams, and multi-user are out of scope

---

## Out of Scope

User authentication, multiple users, teams, real-time updates, file uploads, role-based permissions.

---

## What I'd Improve With More Time

Drag-and-drop, task search, better loading/error states, optimistic UI updates, pagination, hosted deployment, more comprehensive tests.

---

## Time Spent

Approximately **[UPDATE AFTER COMPLETION]** hours.

---

## Author

**Sanwariya Sukhwal**
Full-Stack Developer Take-Home Assignment — TaskFlow