import os

import psycopg2
from fastapi import FastAPI, HTTPException, status
from pydantic import BaseModel

app = FastAPI(title="TimeFlow Schedule Service", version="1.0.0")


def get_conn():
    return psycopg2.connect(
        host=os.getenv("DB_HOST", "localhost"),
        port=os.getenv("DB_PORT", "5432"),
        dbname=os.getenv("DB_NAME", "progrexa_db"),
        user=os.getenv("DB_USER", "progrexa_user"),
        password=os.getenv("DB_PASSWORD", "progrexa_pass"),
    )


class CalendarInput(BaseModel):
    user_id: int
    name: str
    color: str = "#6366F1"


class EventInput(BaseModel):
    calendar_id: int
    title: str
    description: str | None = None
    start_time: str
    end_time: str
    event_type: str = "event"


@app.get("/health")
def health():
    return {"status": "ok", "service": "schedule-service"}


@app.post("/calendars", status_code=status.HTTP_201_CREATED)
def create_calendar(payload: CalendarInput):
    conn = get_conn()
    cur = conn.cursor()
    try:
        cur.execute(
            "INSERT INTO calendars (user_id, name, color) VALUES (%s, %s, %s) RETURNING id, user_id, name, color",
            (payload.user_id, payload.name, payload.color),
        )
        row = cur.fetchone()
        conn.commit()
        return {"id": row[0], "user_id": row[1], "name": row[2], "color": row[3]}
    finally:
        cur.close()
        conn.close()


@app.get("/calendars/{user_id}")
def list_calendars(user_id: int):
    conn = get_conn()
    cur = conn.cursor()
    try:
        cur.execute("SELECT id, name, color FROM calendars WHERE user_id = %s", (user_id,))
        rows = cur.fetchall()
        return [{"id": r[0], "name": r[1], "color": r[2]} for r in rows]
    finally:
        cur.close()
        conn.close()


@app.post("/events", status_code=status.HTTP_201_CREATED)
def create_event(payload: EventInput):
    conn = get_conn()
    cur = conn.cursor()
    try:
        cur.execute(
            """
            INSERT INTO schedule_events (calendar_id, title, description, start_time, end_time, event_type)
            VALUES (%s, %s, %s, %s, %s, %s)
            RETURNING id, calendar_id, title, start_time, end_time, event_type
            """,
            (payload.calendar_id, payload.title, payload.description, payload.start_time, payload.end_time, payload.event_type),
        )
        row = cur.fetchone()
        conn.commit()
        return {"id": row[0], "calendar_id": row[1], "title": row[2], "start_time": row[3], "end_time": row[4], "event_type": row[5]}
    finally:
        cur.close()
        conn.close()


@app.get("/events/{calendar_id}")
def list_events(calendar_id: int):
    conn = get_conn()
    cur = conn.cursor()
    try:
        cur.execute(
            "SELECT id, title, description, start_time, end_time, event_type FROM schedule_events WHERE calendar_id = %s ORDER BY start_time",
            (calendar_id,),
        )
        rows = cur.fetchall()
        return [{"id": r[0], "title": r[1], "description": r[2], "start_time": r[3], "end_time": r[4], "event_type": r[5]} for r in rows]
    finally:
        cur.close()
        conn.close()


@app.delete("/events/{event_id}")
def delete_event(event_id: int):
    conn = get_conn()
    cur = conn.cursor()
    try:
        cur.execute("DELETE FROM schedule_events WHERE id = %s RETURNING id", (event_id,))
        row = cur.fetchone()
        if not row:
            raise HTTPException(status_code=404, detail="Event not found")
        conn.commit()
        return {"message": "Event deleted", "event_id": row[0]}
    finally:
        cur.close()
        conn.close()
