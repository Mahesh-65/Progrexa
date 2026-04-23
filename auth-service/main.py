import os
from datetime import datetime
from typing import Literal

from bson import ObjectId
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr, Field
from pymongo import MongoClient

load_dotenv()

MONGODB_URL = os.getenv("MONGODB_URL", "mongodb://localhost:27017")
MONGODB_DB = os.getenv("MONGODB_DB", "prorexa")
PORT = int(os.getenv("SERVICE_PORT", "8000"))

client = MongoClient(MONGODB_URL)
db = client[MONGODB_DB]


def serialize(doc):
    doc["id"] = str(doc.pop("_id"))
    return doc

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
users = db["users"]

class RegisterIn(BaseModel):
    full_name: str
    username: str
    email: EmailStr
    gender: Literal["Male", "Female", "Other"]
    age: int = Field(..., ge=10, le=120)
    password: str = Field(..., min_length=6)
    confirm_password: str = Field(..., min_length=6)

class LoginIn(BaseModel):
    identity: str
    password: str

@app.get("/")
def health():
    return {"service": "auth-service", "status": "ok"}

@app.post("/auth/register")
def register(payload: RegisterIn):
    if payload.password != payload.confirm_password:
        raise HTTPException(status_code=400, detail="Passwords do not match")
    if users.find_one({"$or": [{"username": payload.username}, {"email": payload.email}] }):
        raise HTTPException(status_code=400, detail="Username or email already exists")
    data = payload.model_dump()
    data.pop("confirm_password")
    data["created_at"] = datetime.utcnow()
    result = users.insert_one(data)
    created = users.find_one({"_id": result.inserted_id})
    return {"message": "Registration successful", "data": serialize(created)}

@app.post("/auth/login")
def login(payload: LoginIn):
    user = users.find_one({
        "$or": [{"username": payload.identity}, {"email": payload.identity}],
        "password": payload.password,
    })
    if not user:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    return {"message": "Login successful", "data": serialize(user)}
