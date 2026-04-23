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
tasks = db["tasks"]

class TaskIn(BaseModel):
    user_id: str
    title: str
    description: str = ""
    status: str = "todo"
    priority: str = "medium"
    tags: list[str] = []
    due_date: Optional[str] = None

@app.get("/")
def health():
    return {"service": "task-service", "status": "ok"}

@app.post("/tasks")
def create_task(payload: TaskIn):
    doc = payload.model_dump()
    doc["created_at"] = datetime.utcnow()
    result = tasks.insert_one(doc)
    return {"data": serialize(tasks.find_one({"_id": result.inserted_id}))}

@app.get("/tasks/{user_id}")
def list_tasks(user_id: str):
    return {"data": [serialize(x) for x in tasks.find({"user_id": user_id}).sort("created_at", -1)]}

@app.put("/tasks/{task_id}")
def update_task(task_id: str, payload: TaskIn):
    tasks.update_one({"_id": ObjectId(task_id)}, {"$set": payload.model_dump()})
    updated = tasks.find_one({"_id": ObjectId(task_id)})
    if not updated:
        raise HTTPException(status_code=404, detail="Task not found")
    return {"data": serialize(updated)}

@app.delete("/tasks/{task_id}")
def delete_task(task_id: str):
    deleted = tasks.find_one_and_delete({"_id": ObjectId(task_id)})
    if not deleted:
        raise HTTPException(status_code=404, detail="Task not found")
    return {"message": "Task deleted"}
