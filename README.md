# Progrexa (TimeFlow Platform)

Progrexa is a complete full stack productivity web application built with Python FastAPI microservices, PostgreSQL, and React + Tailwind CSS.

## Features

- Daily schedule management
- Tasks with subtasks, labels, priorities, and completion tracking
- Calendar events and planner workflows
- Focus timer and tracked sessions
- Productivity analytics and weekly insights
- Notifications and reminder logs
- User profile and preferences (theme, timezone, settings)

## Tech Stack

- Backend: FastAPI + psycopg2 (raw SQL, no SQLAlchemy)
- Frontend: React + Vite + Tailwind CSS + Recharts
- Database: PostgreSQL
- Containerization: Docker + Docker Compose

## Project Structure

```text
Progrexa/
├── frontend/
├── auth-service/
├── user-service/
├── task-service/
├── schedule-service/
├── time-tracker-service/
├── analytics-service/
├── notification-service/
├── database/
├── docker-compose.yml
└── README.md
```

## Run with Docker

1. Install Docker Desktop.
2. Open terminal in project root (`Progrexa`).
3. Run:

```bash
docker compose up --build
```

## Service URLs

- Frontend: [http://localhost:5173](http://localhost:5173)
- Auth Service: [http://localhost:8001/docs](http://localhost:8001/docs)
- User Service: [http://localhost:8002/docs](http://localhost:8002/docs)
- Task Service: [http://localhost:8003/docs](http://localhost:8003/docs)
- Schedule Service: [http://localhost:8004/docs](http://localhost:8004/docs)
- Time Tracker Service: [http://localhost:8005/docs](http://localhost:8005/docs)
- Analytics Service: [http://localhost:8006/docs](http://localhost:8006/docs)
- Notification Service: [http://localhost:8007/docs](http://localhost:8007/docs)

## Notes

- Authentication is simple email + password (stored as SHA-256 hash).
- No JWT is used in this version.
- Database schema and seed role data are in `database/init.sql`.
- Each microservice has `main.py`, `Dockerfile`, `.env`, and `requirements.txt`.
