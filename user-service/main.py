import os

import psycopg2
from fastapi import FastAPI, HTTPException, status
from pydantic import BaseModel

app = FastAPI(title="TimeFlow User Service", version="1.0.0")


def get_conn():
    return psycopg2.connect(
        host=os.getenv("DB_HOST", "localhost"),
        port=os.getenv("DB_PORT", "5432"),
        dbname=os.getenv("DB_NAME", "progrexa_db"),
        user=os.getenv("DB_USER", "progrexa_user"),
        password=os.getenv("DB_PASSWORD", "progrexa_pass"),
    )


class UserProfileInput(BaseModel):
    user_id: int
    bio: str | None = None
    avatar_url: str | None = None
    timezone: str = "UTC"


class UserPreferenceInput(BaseModel):
    user_id: int
    theme: str = "light"
    language: str = "en"
    notifications_enabled: bool = True


@app.get("/health")
def health():
    return {"status": "ok", "service": "user-service"}


@app.post("/profiles", status_code=status.HTTP_201_CREATED)
def upsert_profile(payload: UserProfileInput):
    conn = get_conn()
    cur = conn.cursor()
    try:
        cur.execute(
            """
            INSERT INTO user_profiles (user_id, bio, avatar_url, timezone)
            VALUES (%s, %s, %s, %s)
            ON CONFLICT (user_id) DO UPDATE
            SET bio = EXCLUDED.bio, avatar_url = EXCLUDED.avatar_url, timezone = EXCLUDED.timezone
            RETURNING id, user_id, bio, avatar_url, timezone
            """,
            (payload.user_id, payload.bio, payload.avatar_url, payload.timezone),
        )
        row = cur.fetchone()
        conn.commit()
        return {"id": row[0], "user_id": row[1], "bio": row[2], "avatar_url": row[3], "timezone": row[4]}
    finally:
        cur.close()
        conn.close()


@app.get("/profiles/{user_id}")
def get_profile(user_id: int):
    conn = get_conn()
    cur = conn.cursor()
    try:
        cur.execute("SELECT id, user_id, bio, avatar_url, timezone FROM user_profiles WHERE user_id = %s", (user_id,))
        row = cur.fetchone()
        if not row:
            raise HTTPException(status_code=404, detail="Profile not found")
        return {"id": row[0], "user_id": row[1], "bio": row[2], "avatar_url": row[3], "timezone": row[4]}
    finally:
        cur.close()
        conn.close()


@app.post("/preferences", status_code=status.HTTP_201_CREATED)
def upsert_preferences(payload: UserPreferenceInput):
    conn = get_conn()
    cur = conn.cursor()
    try:
        cur.execute(
            """
            INSERT INTO user_preferences (user_id, theme, language, notifications_enabled)
            VALUES (%s, %s, %s, %s)
            ON CONFLICT (user_id) DO UPDATE
            SET theme = EXCLUDED.theme, language = EXCLUDED.language, notifications_enabled = EXCLUDED.notifications_enabled
            RETURNING id, user_id, theme, language, notifications_enabled
            """,
            (payload.user_id, payload.theme, payload.language, payload.notifications_enabled),
        )
        row = cur.fetchone()
        conn.commit()
        return {"id": row[0], "user_id": row[1], "theme": row[2], "language": row[3], "notifications_enabled": row[4]}
    finally:
        cur.close()
        conn.close()


@app.get("/preferences/{user_id}")
def get_preferences(user_id: int):
    conn = get_conn()
    cur = conn.cursor()
    try:
        cur.execute(
            "SELECT id, user_id, theme, language, notifications_enabled FROM user_preferences WHERE user_id = %s",
            (user_id,),
        )
        row = cur.fetchone()
        if not row:
            raise HTTPException(status_code=404, detail="Preferences not found")
        return {"id": row[0], "user_id": row[1], "theme": row[2], "language": row[3], "notifications_enabled": row[4]}
    finally:
        cur.close()
        conn.close()
