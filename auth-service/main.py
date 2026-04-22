import hashlib
import os
from typing import Optional

import psycopg2
from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr, Field

app = FastAPI(title="TimeFlow Auth Service", version="1.0.0")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def get_conn():
    return psycopg2.connect(
        host=os.getenv("DB_HOST", "localhost"),
        port=os.getenv("DB_PORT", "5432"),
        dbname=os.getenv("DB_NAME", "progrexa_db"),
        user=os.getenv("DB_USER", "progrexa_user"),
        password=os.getenv("DB_PASSWORD", "progrexa_pass"),
    )


def hash_password(password: str) -> str:
    return hashlib.sha256(password.encode("utf-8")).hexdigest()


class RegisterInput(BaseModel):
    email: EmailStr
    password: str = Field(min_length=6)
    full_name: str = Field(min_length=2, max_length=120)


class LoginInput(BaseModel):
    email: EmailStr
    password: str


class PasswordCheckInput(BaseModel):
    user_id: int
    password: str


@app.get("/health")
def health():
    return {"status": "ok", "service": "auth-service"}


@app.post("/register", status_code=status.HTTP_201_CREATED)
def register(payload: RegisterInput):
    try:
        conn = get_conn()
        cur = conn.cursor()
    except Exception:
        raise HTTPException(status_code=500, detail="Database connection failed")
    try:
        cur.execute("SELECT id FROM users WHERE email = %s", (payload.email,))
        if cur.fetchone():
            raise HTTPException(status_code=400, detail="Email already registered")

        cur.execute(
            """
            INSERT INTO users (email, password_hash, full_name)
            VALUES (%s, %s, %s)
            RETURNING id, email, full_name
            """,
            (payload.email, hash_password(payload.password), payload.full_name),
        )
        user = cur.fetchone()
        conn.commit()
        return {"id": user[0], "email": user[1], "full_name": user[2]}
    finally:
        cur.close()
        conn.close()


@app.post("/login")
def login(payload: LoginInput):
    try:
        conn = get_conn()
        cur = conn.cursor()
    except Exception:
        raise HTTPException(status_code=500, detail="Database connection failed")
    try:
        cur.execute(
            "SELECT id, email, full_name, password_hash FROM users WHERE email = %s",
            (payload.email,),
        )
        user = cur.fetchone()
        if not user or user[3] != hash_password(payload.password):
            raise HTTPException(status_code=401, detail="Invalid email or password")
        return {"id": user[0], "email": user[1], "full_name": user[2], "message": "Login successful"}
    finally:
        cur.close()
        conn.close()


@app.post("/logout")
def logout(user_id: Optional[int] = None):
    return {"message": "Logout successful", "user_id": user_id}


@app.post("/password-check")
def password_check(payload: PasswordCheckInput):
    conn = get_conn()
    cur = conn.cursor()
    try:
        cur.execute("SELECT password_hash FROM users WHERE id = %s", (payload.user_id,))
        record = cur.fetchone()
        if not record:
            raise HTTPException(status_code=404, detail="User not found")
        return {"is_valid": record[0] == hash_password(payload.password)}
    finally:
        cur.close()
        conn.close()
