import os

import psycopg2
from fastapi import FastAPI, status
from pydantic import BaseModel

app = FastAPI(title="TimeFlow Analytics Service", version="1.0.0")


def get_conn():
    return psycopg2.connect(
        host=os.getenv("DB_HOST", "localhost"),
        port=os.getenv("DB_PORT", "5432"),
        dbname=os.getenv("DB_NAME", "progrexa_db"),
        user=os.getenv("DB_USER", "progrexa_user"),
        password=os.getenv("DB_PASSWORD", "progrexa_pass"),
    )


class DailyMetricInput(BaseModel):
    user_id: int
    metric_date: str
    completed_tasks: int = 0
    planned_tasks: int = 0
    tracked_minutes: int = 0


class ProductivityReportInput(BaseModel):
    user_id: int
    week_start: str
    productivity_score: int = 0
    tasks_completed: int = 0
    focus_minutes: int = 0


@app.get("/health")
def health():
    return {"status": "ok", "service": "analytics-service"}


@app.post("/daily-metrics", status_code=status.HTTP_201_CREATED)
def create_daily_metric(payload: DailyMetricInput):
    conn = get_conn()
    cur = conn.cursor()
    try:
        cur.execute(
            """
            INSERT INTO daily_metrics (user_id, metric_date, completed_tasks, planned_tasks, tracked_minutes)
            VALUES (%s, %s, %s, %s, %s)
            RETURNING id, user_id, metric_date, completed_tasks, planned_tasks, tracked_minutes
            """,
            (payload.user_id, payload.metric_date, payload.completed_tasks, payload.planned_tasks, payload.tracked_minutes),
        )
        row = cur.fetchone()
        conn.commit()
        return {"id": row[0], "user_id": row[1], "metric_date": row[2], "completed_tasks": row[3], "planned_tasks": row[4], "tracked_minutes": row[5]}
    finally:
        cur.close()
        conn.close()


@app.get("/daily-metrics/{user_id}")
def list_daily_metrics(user_id: int):
    conn = get_conn()
    cur = conn.cursor()
    try:
        cur.execute(
            "SELECT metric_date, completed_tasks, planned_tasks, tracked_minutes FROM daily_metrics WHERE user_id = %s ORDER BY metric_date DESC LIMIT 30",
            (user_id,),
        )
        rows = cur.fetchall()
        return [{"metric_date": r[0], "completed_tasks": r[1], "planned_tasks": r[2], "tracked_minutes": r[3]} for r in rows]
    finally:
        cur.close()
        conn.close()


@app.post("/reports", status_code=status.HTTP_201_CREATED)
def create_report(payload: ProductivityReportInput):
    conn = get_conn()
    cur = conn.cursor()
    try:
        cur.execute(
            """
            INSERT INTO productivity_reports (user_id, week_start, productivity_score, tasks_completed, focus_minutes)
            VALUES (%s, %s, %s, %s, %s)
            RETURNING id, user_id, week_start, productivity_score, tasks_completed, focus_minutes
            """,
            (payload.user_id, payload.week_start, payload.productivity_score, payload.tasks_completed, payload.focus_minutes),
        )
        row = cur.fetchone()
        conn.commit()
        return {"id": row[0], "user_id": row[1], "week_start": row[2], "productivity_score": row[3], "tasks_completed": row[4], "focus_minutes": row[5]}
    finally:
        cur.close()
        conn.close()


@app.get("/overview/{user_id}")
def overview(user_id: int):
    conn = get_conn()
    cur = conn.cursor()
    try:
        cur.execute("SELECT COALESCE(SUM(completed_tasks), 0), COALESCE(SUM(tracked_minutes), 0) FROM daily_metrics WHERE user_id = %s", (user_id,))
        metrics = cur.fetchone()
        cur.execute(
            "SELECT COALESCE(AVG(productivity_score), 0) FROM productivity_reports WHERE user_id = %s",
            (user_id,),
        )
        score = cur.fetchone()
        return {
            "total_completed_tasks": int(metrics[0]),
            "total_tracked_minutes": int(metrics[1]),
            "average_productivity_score": float(score[0]),
        }
    finally:
        cur.close()
        conn.close()
