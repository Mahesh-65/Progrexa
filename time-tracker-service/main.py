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
sessions = db["sessions"]

class SessionIn(BaseModel):
    user_id: str
    mode: str = "focus"
    duration_minutes: int = 25
    status: str = "active"

@app.get("/")
def health():
    return {"service": "time-tracker-service", "status": "ok"}

@app.post("/sessions")
def create_session(payload: SessionIn):
    doc = payload.model_dump()
    doc["started_at"] = datetime.utcnow()
    result = sessions.insert_one(doc)
    return {"data": serialize(sessions.find_one({"_id": result.inserted_id}))}

@app.get("/sessions/{user_id}")
def list_sessions(user_id: str):
    return {"data": [serialize(x) for x in sessions.find({"user_id": user_id}).sort("started_at", -1)]}

@app.put("/sessions/{session_id}")
def update_session(session_id: str, payload: SessionIn):
    sessions.update_one({"_id": ObjectId(session_id)}, {"$set": payload.model_dump()})
    item = sessions.find_one({"_id": ObjectId(session_id)})
    if not item:
        raise HTTPException(status_code=404, detail="Session not found")
    return {"data": serialize(item)}

@app.delete("/sessions/{session_id}")
def delete_session(session_id: str):
    deleted = sessions.find_one_and_delete({"_id": ObjectId(session_id)})
    if not deleted:
        raise HTTPException(status_code=404, detail="Session not found")
    return {"message": "Session deleted"}
