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
analytics = db["analytics"]

class AnalyticsIn(BaseModel):
    user_id: str
    date: str
    completed_tasks: int = 0
    focus_minutes: int = 0
    productivity_score: int = 0

@app.get("/")
def health():
    return {"service": "analytics-service", "status": "ok"}

@app.post("/analytics")
def create_analytics(payload: AnalyticsIn):
    doc = payload.model_dump()
    result = analytics.insert_one(doc)
    return {"data": serialize(analytics.find_one({"_id": result.inserted_id}))}

@app.get("/analytics/{user_id}")
def list_analytics(user_id: str):
    return {"data": [serialize(x) for x in analytics.find({"user_id": user_id})]}

@app.put("/analytics/{analytics_id}")
def update_analytics(analytics_id: str, payload: AnalyticsIn):
    analytics.update_one({"_id": ObjectId(analytics_id)}, {"$set": payload.model_dump()})
    item = analytics.find_one({"_id": ObjectId(analytics_id)})
    if not item:
        raise HTTPException(status_code=404, detail="Analytics not found")
    return {"data": serialize(item)}

@app.delete("/analytics/{analytics_id}")
def delete_analytics(analytics_id: str):
    deleted = analytics.find_one_and_delete({"_id": ObjectId(analytics_id)})
    if not deleted:
        raise HTTPException(status_code=404, detail="Analytics not found")
    return {"message": "Analytics deleted"}
