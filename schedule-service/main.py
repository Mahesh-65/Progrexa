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
schedules = db["schedules"]

class ScheduleIn(BaseModel):
    user_id: str
    title: str
    start_time: str
    end_time: str
    category: str = "general"
    notes: str = ""

@app.get("/")
def health():
    return {"service": "schedule-service", "status": "ok"}

@app.post("/schedules")
def create_schedule(payload: ScheduleIn):
    doc = payload.model_dump()
    doc["created_at"] = datetime.utcnow()
    result = schedules.insert_one(doc)
    return {"data": serialize(schedules.find_one({"_id": result.inserted_id}))}

@app.get("/schedules/{user_id}")
def list_schedule(user_id: str):
    return {"data": [serialize(x) for x in schedules.find({"user_id": user_id})]}

@app.put("/schedules/{schedule_id}")
def update_schedule(schedule_id: str, payload: ScheduleIn):
    schedules.update_one({"_id": ObjectId(schedule_id)}, {"$set": payload.model_dump()})
    item = schedules.find_one({"_id": ObjectId(schedule_id)})
    if not item:
        raise HTTPException(status_code=404, detail="Schedule not found")
    return {"data": serialize(item)}

@app.delete("/schedules/{schedule_id}")
def delete_schedule(schedule_id: str):
    deleted = schedules.find_one_and_delete({"_id": ObjectId(schedule_id)})
    if not deleted:
        raise HTTPException(status_code=404, detail="Schedule not found")
    return {"message": "Schedule deleted"}
