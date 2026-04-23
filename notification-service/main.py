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
notifications = db["notifications"]

class NotificationIn(BaseModel):
    user_id: str
    title: str
    message: str
    type: str = "reminder"
    is_read: bool = False

@app.get("/")
def health():
    return {"service": "notification-service", "status": "ok"}

@app.post("/notifications")
def create_notification(payload: NotificationIn):
    doc = payload.model_dump()
    doc["created_at"] = datetime.utcnow()
    result = notifications.insert_one(doc)
    return {"data": serialize(notifications.find_one({"_id": result.inserted_id}))}

@app.get("/notifications/{user_id}")
def list_notifications(user_id: str):
    return {"data": [serialize(x) for x in notifications.find({"user_id": user_id}).sort("created_at", -1)]}

@app.put("/notifications/{notification_id}")
def update_notification(notification_id: str, payload: NotificationIn):
    notifications.update_one({"_id": ObjectId(notification_id)}, {"$set": payload.model_dump()})
    item = notifications.find_one({"_id": ObjectId(notification_id)})
    if not item:
        raise HTTPException(status_code=404, detail="Notification not found")
    return {"data": serialize(item)}

@app.delete("/notifications/{notification_id}")
def delete_notification(notification_id: str):
    deleted = notifications.find_one_and_delete({"_id": ObjectId(notification_id)})
    if not deleted:
        raise HTTPException(status_code=404, detail="Notification not found")
    return {"message": "Notification deleted"}
