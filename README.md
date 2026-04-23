# Prorexa

Full-stack personal productivity application using FastAPI microservices, MongoDB, React, and Tailwind CSS.

## Services

- `frontend` (React + Tailwind)
- `auth-service` (register/login)
- `user-service` (profile/settings)
- `task-service` (task CRUD)
- `schedule-service` (planner/events)
- `time-tracker-service` (pomodoro/focus sessions)
- `analytics-service` (productivity metrics)
- `notification-service` (alerts/reminders)
- `mongodb`

## Run with Docker

```bash
docker compose up --build
```

## URLs

- Frontend: `http://localhost:5173`
- Auth API docs: `http://localhost:8001/docs`
- User API docs: `http://localhost:8002/docs`
- Task API docs: `http://localhost:8003/docs`
- Schedule API docs: `http://localhost:8004/docs`
- Time Tracker API docs: `http://localhost:8005/docs`
- Analytics API docs: `http://localhost:8006/docs`
- Notifications API docs: `http://localhost:8007/docs`

## Notes

- Authentication flow is session-like client state (no JWT), as requested.
- MongoDB collections used: `users`, `user_profiles`, `tasks`, `schedules`, `sessions`, `analytics`, `notifications`.
