import os
from datetime import datetime
from typing import Optional

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
profiles = db["user_profiles"]

class ProfileIn(BaseModel):
    user_id: str
    bio: str = ""
    timezone: str = "UTC"
    theme: str = "dark"
    daily_goal_minutes: int = 120

@app.get("/")
def health():
    return {"service": "user-service", "status": "ok"}

@app.post("/profiles")
def create_profile(payload: ProfileIn):
    doc = payload.model_dump()
    doc["updated_at"] = datetime.utcnow()
    result = profiles.insert_one(doc)
    return {"data": serialize(profiles.find_one({"_id": result.inserted_id}))}

@app.get("/profiles/{user_id}")
def get_profile(user_id: str):
    profile = profiles.find_one({"user_id": user_id})
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")
    return {"data": serialize(profile)}

@app.put("/profiles/{profile_id}")
def update_profile(profile_id: str, payload: ProfileIn):
    profiles.update_one({"_id": ObjectId(profile_id)}, {"$set": {**payload.model_dump(), "updated_at": datetime.utcnow()}})
    profile = profiles.find_one({"_id": ObjectId(profile_id)})
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")
    return {"data": serialize(profile)}
