from typing import List
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import SessionLocal
from app import crud
from app.schemas import Category

router = APIRouter(prefix="/api/categories", tags=["categories"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.get("/", response_model=List[Category])
def list_categories(db: Session = Depends(get_db)):
    return crud.list_categories(db)

