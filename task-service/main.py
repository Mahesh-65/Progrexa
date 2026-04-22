import os

import psycopg2
from fastapi import FastAPI, HTTPException, status
from pydantic import BaseModel

app = FastAPI(title="TimeFlow Task Service", version="1.0.0")


def get_conn():
    return psycopg2.connect(
        host=os.getenv("DB_HOST", "localhost"),
        port=os.getenv("DB_PORT", "5432"),
        dbname=os.getenv("DB_NAME", "progrexa_db"),
        user=os.getenv("DB_USER", "progrexa_user"),
        password=os.getenv("DB_PASSWORD", "progrexa_pass"),
    )


class TaskInput(BaseModel):
    user_id: int
    title: str
    description: str | None = None
    priority: str = "medium"
    due_date: str | None = None


class SubtaskInput(BaseModel):
    title: str


class LabelInput(BaseModel):
    label: str


@app.get("/health")
def health():
    return {"status": "ok", "service": "task-service"}


@app.post("/tasks", status_code=status.HTTP_201_CREATED)
def create_task(payload: TaskInput):
    conn = get_conn()
    cur = conn.cursor()
    try:
        cur.execute(
            """
            INSERT INTO tasks (user_id, title, description, priority, due_date)
            VALUES (%s, %s, %s, %s, %s)
            RETURNING id, user_id, title, description, priority, due_date, is_completed
            """,
            (payload.user_id, payload.title, payload.description, payload.priority, payload.due_date),
        )
        row = cur.fetchone()
        conn.commit()
        return {"id": row[0], "user_id": row[1], "title": row[2], "description": row[3], "priority": row[4], "due_date": row[5], "is_completed": row[6]}
    finally:
        cur.close()
        conn.close()


@app.get("/tasks/{user_id}")
def list_tasks(user_id: int):
    conn = get_conn()
    cur = conn.cursor()
    try:
        cur.execute(
            "SELECT id, title, priority, due_date, is_completed FROM tasks WHERE user_id = %s ORDER BY created_at DESC",
            (user_id,),
        )
        rows = cur.fetchall()
        return [{"id": r[0], "title": r[1], "priority": r[2], "due_date": r[3], "is_completed": r[4]} for r in rows]
    finally:
        cur.close()
        conn.close()


@app.put("/tasks/{task_id}")
def update_task(task_id: int, payload: TaskInput):
    conn = get_conn()
    cur = conn.cursor()
    try:
        cur.execute(
            """
            UPDATE tasks
            SET title = %s, description = %s, priority = %s, due_date = %s
            WHERE id = %s
            RETURNING id, title, description, priority, due_date, is_completed
            """,
            (payload.title, payload.description, payload.priority, payload.due_date, task_id),
        )
        row = cur.fetchone()
        if not row:
            raise HTTPException(status_code=404, detail="Task not found")
        conn.commit()
        return {"id": row[0], "title": row[1], "description": row[2], "priority": row[3], "due_date": row[4], "is_completed": row[5]}
    finally:
        cur.close()
        conn.close()


@app.patch("/tasks/{task_id}/complete")
def complete_task(task_id: int):
    conn = get_conn()
    cur = conn.cursor()
    try:
        cur.execute("UPDATE tasks SET is_completed = TRUE, status = 'done' WHERE id = %s RETURNING id", (task_id,))
        row = cur.fetchone()
        if not row:
            raise HTTPException(status_code=404, detail="Task not found")
        conn.commit()
        return {"message": "Task marked complete", "task_id": row[0]}
    finally:
        cur.close()
        conn.close()


@app.delete("/tasks/{task_id}")
def delete_task(task_id: int):
    conn = get_conn()
    cur = conn.cursor()
    try:
        cur.execute("DELETE FROM tasks WHERE id = %s RETURNING id", (task_id,))
        row = cur.fetchone()
        if not row:
            raise HTTPException(status_code=404, detail="Task not found")
        conn.commit()
        return {"message": "Task deleted", "task_id": row[0]}
    finally:
        cur.close()
        conn.close()


@app.post("/tasks/{task_id}/subtasks", status_code=status.HTTP_201_CREATED)
def add_subtask(task_id: int, payload: SubtaskInput):
    conn = get_conn()
    cur = conn.cursor()
    try:
        cur.execute(
            "INSERT INTO task_subtasks (task_id, title) VALUES (%s, %s) RETURNING id, task_id, title, is_completed",
            (task_id, payload.title),
        )
        row = cur.fetchone()
        conn.commit()
        return {"id": row[0], "task_id": row[1], "title": row[2], "is_completed": row[3]}
    finally:
        cur.close()
        conn.close()


@app.post("/tasks/{task_id}/labels", status_code=status.HTTP_201_CREATED)
def add_label(task_id: int, payload: LabelInput):
    conn = get_conn()
    cur = conn.cursor()
    try:
        cur.execute("INSERT INTO task_labels (task_id, label) VALUES (%s, %s) RETURNING id, task_id, label", (task_id, payload.label))
        row = cur.fetchone()
        conn.commit()
        return {"id": row[0], "task_id": row[1], "label": row[2]}
    finally:
        cur.close()
        conn.close()
