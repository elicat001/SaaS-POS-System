from typing import List
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from backend.app.database import SessionLocal
from backend.app import crud
from backend.app.schemas import User, UserCreate

router = APIRouter(prefix="/api/users", tags=["users"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.get("/", response_model=List[User])
def list_users(db: Session = Depends(get_db)):
    return crud.list_users(db)

@router.post("/", response_model=User)
def create_user(payload: UserCreate, db: Session = Depends(get_db)):
    return crud.create_user(db, payload.model_dump())

