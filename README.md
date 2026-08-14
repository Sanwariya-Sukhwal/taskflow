# TaskFlow

TaskFlow is a simple full-stack task board for small teams, inspired by lightweight tools like Trello.

Users can create, edit, delete, filter, and move tasks between columns. All task data is persisted in PostgreSQL through a Node.js REST API.

---

## Tech Stack

### Frontend
- React
- JavaScript (JSX)
- Vite
- CSS

### Backend
- Node.js
- Express.js
- PostgreSQL
- Raw SQL using `pg`

### Testing
- Jest
- Supertest

### API Testing
- Postman

---

## Features

### Board
- View a board with multiple columns
- View tasks inside each column

### Tasks
- Create a new task
- Edit an existing task
- Delete a task
- Move a task between columns
- Set task priority:
  - Low
  - Medium
  - High
- Add an optional description
- Automatically store the task creation date

### Filtering
- Filter tasks by priority

### Validation
- Task title is required
- Empty task titles are rejected by the backend
- Priority values are validated
- Invalid task requests return appropriate error responses

### Persistence
All changes are saved to PostgreSQL.
Refreshing the application does not lose task data.

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
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   ├── db.js
│   │   │   └── setupDatabase.js
│   │   │
│   │   ├── controllers/
│   │   │   ├── boardController.js
│   │   │   └── taskController.js
│   │   │
│   │   ├── routes/
│   │   │   ├── boardRoutes.js
│   │   │   └── taskRoutes.js
│   │   │
│   │   ├── services/
│   │   │   ├── boardService.js
│   │   │   └── taskService.js
│   │   │
│   │   ├── middleware/
│   │   │   ├── errorHandler.js
│   │   │   └── validateTask.js
│   │   │
│   │   ├── app.js
│   │   └── server.js
│   │
│   ├── tests/
│   │   ├── task.test.js
│   │   ├── taskMove.test.js
│   │   └── database.test.js
│   │
│   ├── .env.example
│   └── package.json
│
├── database/
│   ├── schema.sql
│   └── seed.sql
│
├── .gitignore
└── README.md
```

---

## Database Design

TaskFlow uses PostgreSQL as its relational database.

The database contains three main tables:

```text
Board
  |
  └── Columns
        |
        └── Tasks
```

- A board can contain multiple columns.
- Each column belongs to exactly one board.
- Each task belongs to exactly one column.
- The relationships are enforced using foreign keys.

### Boards — `boards`
| Column | Notes |
|--------|-------|
| id     | Primary key |
| name   | Required |

### Columns — `columns`
| Column   | Notes |
|----------|-------|
| id       | Primary key |
| board_id | Foreign key referencing `boards(id)` |
| name     | Required |

### Tasks — `tasks`
| Column      | Notes |
|-------------|-------|
| id          | Primary key |
| column_id   | Foreign key referencing `columns(id)` |
| title       | Required |
| description | Optional |
| priority    | Required |
| created_at  | Stores the task creation date |

The database schema is available in `database/schema.sql`.
Initial seed data is available in `database/seed.sql`.

---

## Database Queries

The backend uses raw SQL through the PostgreSQL `pg` package instead of relying on an ORM.

### 1. Tasks by Priority

Retrieves tasks with a specific priority directly from the database and sorts them by newest first:

```sql
SELECT
    id,
    column_id,
    title,
    description,
    priority,
    created_at
FROM tasks
WHERE priority = $1
ORDER BY created_at DESC;
```

Filtering is performed by PostgreSQL instead of fetching all tasks and filtering them in JavaScript.

### 2. Task Count Per Column

Calculates the number of tasks in each column using SQL:

```sql
SELECT
    c.id,
    c.name,
    COUNT(t.id) AS task_count
FROM columns c
LEFT JOIN tasks t
    ON t.column_id = c.id
WHERE c.board_id = $1
GROUP BY c.id, c.name
ORDER BY c.id;
```

`LEFT JOIN` is used so that columns with zero tasks are still included in the result.

---

## Backend API

Base URL:

```text
http://localhost:5000/api
```

### Get Board
```
GET /boards/:id
```
Example:
```
GET http://localhost:5000/api/boards/1
```

### Create Task
```
POST /tasks
```
Example request:
```json
{
  "columnId": 1,
  "title": "Learn React",
  "description": "Practice React components",
  "priority": "High"
}
```

### Update Task
```
PUT /tasks/:id
```
Example request:
```json
{
  "title": "Learn React Advanced",
  "description": "Practice React and Hooks",
  "priority": "High"
}
```

### Delete Task
```
DELETE /tasks/:id
```
Example:
```
DELETE http://localhost:5000/api/tasks/8
```

### Move Task
```
PATCH /tasks/:id/move
```
Example request:
```json
{
  "columnId": 2
}
```
This updates the task's `column_id` and therefore moves the task to another column.

### Filter Tasks by Priority
```
GET /tasks/filter?priority=High
```
Supported priority values: `Low`, `Medium`, `High`

---

## Validation

Backend validation is used so that invalid data cannot be inserted into the database even if the frontend validation is bypassed.

### Empty Task Title

Creating a task without a title is rejected.

Example:
```json
{
  "columnId": 1,
  "description": "Task without title",
  "priority": "High"
}
```

Response:
```json
{
  "success": false,
  "message": "Task title is required"
}
```

### Priority Validation

Only the following values are accepted: `Low`, `Medium`, `High`.
An invalid priority returns a `400 Bad Request` response.

---

## Error Handling

The backend uses error-handling middleware to return structured responses for failed requests.

For example, requesting a task that does not exist returns:
```json
{
  "success": false,
  "message": "Task not found"
}
```

The frontend can display these messages instead of showing a blank screen or raw server error.

---

## Testing

The backend uses Jest and Supertest.

The assignment-required scenarios are covered by the following tests:

1. **Create Task Without Title** — Verifies that creating a task without a title fails with a validation error.
2. **Move Task** — Verifies that moving a task updates its column correctly.
3. **Database Layer** — Verifies that the database query returns the expected rows for known seed data.

Run all backend tests:
```bash
npm test
```

Expected result:
```text
Test Suites: 3 passed, 3 total
Tests:       3 passed, 3 total
```

---

## Local Setup

### Requirements

Install the following before running the project:
- Node.js
- npm
- PostgreSQL

### 1. Clone the Repository
```bash
git clone <YOUR_GITHUB_REPOSITORY_URL>
cd taskflow
```

### 2. Backend Setup

Open the backend directory:
```bash
cd backend
```

Install dependencies:
```bash
npm install
```

Create a `.env` file inside the backend directory:
```env
PORT=5000
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=your_postgres_password
DB_NAME=taskflow
```

Make sure a PostgreSQL database named `taskflow` exists.

Then run:
```bash
npm run db:setup
```
This command creates the database tables and inserts the seed data.

Start the backend:
```bash
npm run dev
```
The backend will run on `http://localhost:5000`.

### 3. Frontend Setup

The frontend is built using React and JavaScript.

Open a new terminal and go to:
```bash
cd frontend
```

Install dependencies:
```bash
npm install
```

Start the React development server:
```bash
npm run dev
```
The frontend will normally run on `http://localhost:5173`.

---

## Environment Variables

The backend uses environment variables for PostgreSQL configuration.

The `.env` file should not be committed to Git.

A sample configuration is provided as `backend/.env.example`:
```env
PORT=5000
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=your_postgres_password
DB_NAME=taskflow
```

---

## Decisions / Assumptions

- I chose PostgreSQL as the relational database. The assignment allows SQLite, PostgreSQL, or MySQL, and I chose PostgreSQL to work with a real relational database and explicit SQL queries.
- I used Node.js with Express.js for the backend and the `pg` package for PostgreSQL database access.
- I used raw SQL instead of an ORM so that database operations such as filtering, joins, grouping, and aggregation are explicit and easy to review.
- I used React with JavaScript (JSX) instead of TypeScript because the assignment supports both JavaScript and TypeScript, and I am more comfortable with JavaScript.
- Each board can have multiple columns, and each column belongs to exactly one board through a foreign key.
- Each task belongs to exactly one column through the `column_id` foreign key. Moving a task updates its `column_id`.
- I used a column control/dropdown for moving tasks instead of drag-and-drop. The assignment explicitly allows this approach, and I prioritized reliability and functionality over visual complexity.
- The application currently uses a single seeded board, since user accounts, multiple teams, and multiple users are outside the scope of this assignment.
- Task priority is limited to Low, Medium, and High and is validated by the backend.
- The task title is required and is validated on the backend as well as on the frontend.
- Seed data is provided so that a fresh database is not empty when the application is first started.

> **Note:** If you implement drag-and-drop or text search once the frontend is complete, update the Decisions, Features, and "What I Would Improve" sections accordingly.

---

## What I Would Improve With More Time

If I had more time, I would add:
- Drag-and-drop task movement
- Text search by task title
- Task counts in column headers
- More comprehensive API and integration tests
- Better loading states
- Better error and success notifications
- Optimistic UI updates
- Pagination for larger boards
- Deployment with a hosted PostgreSQL database
- More detailed API documentation

I would prioritize drag-and-drop and text search first because they would improve the usability of the board while keeping the existing backend structure relatively simple.

---

## Time Spent

Approximately **[UPDATE AFTER COMPLETION]** hours.

This includes:
- Database design and setup
- PostgreSQL schema and seed data
- REST API development
- Validation and error handling
- Backend testing
- React frontend development
- Documentation

---

## Something I Learned

One interesting part of this project was working with raw SQL instead of relying on an ORM.

I learned more about using `JOIN`, `LEFT JOIN`, `GROUP BY`, and `ORDER BY` directly in PostgreSQL.

For example, calculating task counts using SQL allows the database to perform the aggregation instead of fetching all tasks and calculating the result in JavaScript.

I also found it useful to separate controllers, services, routes, and database configuration. This keeps HTTP request handling separate from database operations and makes the backend easier to understand and test.

---

## Out of Scope

The following features were intentionally not implemented because they are outside the assignment scope:
- User authentication
- Multiple users
- Teams
- Real-time updates
- File uploads
- Role-based permissions

The focus was kept on building a reliable task board with persistent data, validation, SQL queries, and tests.

---

## Future Improvements

Possible future versions could include:

```text
Drag & Drop
     ↓
Task Search
     ↓
Multiple Boards
     ↓
Authentication
     ↓
Multiple Users
     ↓
Real-time Updates
```

These features were intentionally left out of the initial implementation so that the core assignment requirements could be completed reliably.

---

## Author

** Sanwariya Sukhwal **
Full-Stack Developer Take-Home Assignment — TaskFlow

---
