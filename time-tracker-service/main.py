import os

import psycopg2
from fastapi import FastAPI, HTTPException, status
from pydantic import BaseModel

app = FastAPI(title="TimeFlow Time Tracker Service", version="1.0.0")


def get_conn():
    return psycopg2.connect(
        host=os.getenv("DB_HOST", "localhost"),
        port=os.getenv("DB_PORT", "5432"),
        dbname=os.getenv("DB_NAME", "progrexa_db"),
        user=os.getenv("DB_USER", "progrexa_user"),
        password=os.getenv("DB_PASSWORD", "progrexa_pass"),
    )


class FocusSessionInput(BaseModel):
    user_id: int
    mode: str = "pomodoro"
    planned_minutes: int


class TrackedSessionInput(BaseModel):
    user_id: int
    task_id: int | None = None
    start_time: str
    end_time: str | None = None
    duration_minutes: int = 0
    notes: str | None = None


@app.get("/health")
def health():
    return {"status": "ok", "service": "time-tracker-service"}


@app.post("/focus/start", status_code=status.HTTP_201_CREATED)
def start_focus(payload: FocusSessionInput):
    conn = get_conn()
    cur = conn.cursor()
    try:
        cur.execute(
            """
            INSERT INTO focus_sessions (user_id, mode, planned_minutes)
            VALUES (%s, %s, %s)
            RETURNING id, user_id, mode, planned_minutes, started_at
            """,
            (payload.user_id, payload.mode, payload.planned_minutes),
        )
        row = cur.fetchone()
        conn.commit()
        return {"id": row[0], "user_id": row[1], "mode": row[2], "planned_minutes": row[3], "started_at": row[4]}
    finally:
        cur.close()
        conn.close()


@app.patch("/focus/{session_id}/stop")
def stop_focus(session_id: int):
    conn = get_conn()
    cur = conn.cursor()
    try:
        cur.execute("UPDATE focus_sessions SET ended_at = NOW() WHERE id = %s RETURNING id, ended_at", (session_id,))
        row = cur.fetchone()
        if not row:
            raise HTTPException(status_code=404, detail="Focus session not found")
        conn.commit()
        return {"id": row[0], "ended_at": row[1]}
    finally:
        cur.close()
        conn.close()


@app.post("/tracked", status_code=status.HTTP_201_CREATED)
def create_tracked(payload: TrackedSessionInput):
    conn = get_conn()
    cur = conn.cursor()
    try:
        cur.execute(
            """
            INSERT INTO tracked_sessions (user_id, task_id, start_time, end_time, duration_minutes, notes)
            VALUES (%s, %s, %s, %s, %s, %s)
            RETURNING id, user_id, task_id, start_time, end_time, duration_minutes, notes
            """,
            (payload.user_id, payload.task_id, payload.start_time, payload.end_time, payload.duration_minutes, payload.notes),
        )
        row = cur.fetchone()
        conn.commit()
        return {"id": row[0], "user_id": row[1], "task_id": row[2], "start_time": row[3], "end_time": row[4], "duration_minutes": row[5], "notes": row[6]}
    finally:
        cur.close()
        conn.close()


@app.get("/tracked/{user_id}")
def list_tracked(user_id: int):
    conn = get_conn()
    cur = conn.cursor()
    try:
        cur.execute(
            "SELECT id, task_id, start_time, end_time, duration_minutes, notes FROM tracked_sessions WHERE user_id = %s ORDER BY start_time DESC",
            (user_id,),
        )
        rows = cur.fetchall()
        return [{"id": r[0], "task_id": r[1], "start_time": r[2], "end_time": r[3], "duration_minutes": r[4], "notes": r[5]} for r in rows]
    finally:
        cur.close()
        conn.close()
