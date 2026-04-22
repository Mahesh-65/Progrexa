import os

import psycopg2
from fastapi import FastAPI, HTTPException, status
from pydantic import BaseModel

app = FastAPI(title="TimeFlow Notification Service", version="1.0.0")


def get_conn():
    return psycopg2.connect(
        host=os.getenv("DB_HOST", "localhost"),
        port=os.getenv("DB_PORT", "5432"),
        dbname=os.getenv("DB_NAME", "progrexa_db"),
        user=os.getenv("DB_USER", "progrexa_user"),
        password=os.getenv("DB_PASSWORD", "progrexa_pass"),
    )


class NotificationInput(BaseModel):
    user_id: int
    title: str
    message: str


class ReminderInput(BaseModel):
    reminder_time: str


@app.get("/health")
def health():
    return {"status": "ok", "service": "notification-service"}


@app.post("/notifications", status_code=status.HTTP_201_CREATED)
def create_notification(payload: NotificationInput):
    conn = get_conn()
    cur = conn.cursor()
    try:
        cur.execute(
            """
            INSERT INTO notifications (user_id, title, message)
            VALUES (%s, %s, %s)
            RETURNING id, user_id, title, message, is_read, created_at
            """,
            (payload.user_id, payload.title, payload.message),
        )
        row = cur.fetchone()
        conn.commit()
        return {"id": row[0], "user_id": row[1], "title": row[2], "message": row[3], "is_read": row[4], "created_at": row[5]}
    finally:
        cur.close()
        conn.close()


@app.get("/notifications/{user_id}")
def list_notifications(user_id: int):
    conn = get_conn()
    cur = conn.cursor()
    try:
        cur.execute(
            "SELECT id, title, message, is_read, created_at FROM notifications WHERE user_id = %s ORDER BY created_at DESC",
            (user_id,),
        )
        rows = cur.fetchall()
        return [{"id": r[0], "title": r[1], "message": r[2], "is_read": r[3], "created_at": r[4]} for r in rows]
    finally:
        cur.close()
        conn.close()


@app.patch("/notifications/{notification_id}/read")
def mark_read(notification_id: int):
    conn = get_conn()
    cur = conn.cursor()
    try:
        cur.execute("UPDATE notifications SET is_read = TRUE WHERE id = %s RETURNING id", (notification_id,))
        row = cur.fetchone()
        if not row:
            raise HTTPException(status_code=404, detail="Notification not found")
        conn.commit()
        return {"message": "Notification marked as read", "notification_id": row[0]}
    finally:
        cur.close()
        conn.close()


@app.post("/notifications/{notification_id}/reminders", status_code=status.HTTP_201_CREATED)
def create_reminder(notification_id: int, payload: ReminderInput):
    conn = get_conn()
    cur = conn.cursor()
    try:
        cur.execute(
            "INSERT INTO reminder_logs (notification_id, reminder_time) VALUES (%s, %s) RETURNING id, notification_id, reminder_time, sent_at",
            (notification_id, payload.reminder_time),
        )
        row = cur.fetchone()
        conn.commit()
        return {"id": row[0], "notification_id": row[1], "reminder_time": row[2], "sent_at": row[3]}
    finally:
        cur.close()
        conn.close()
