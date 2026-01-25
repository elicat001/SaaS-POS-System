from typing import List
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import SessionLocal
from app import crud
from app.schemas import StockLog, StockLogCreate

router = APIRouter(prefix="/api/inventory", tags=["inventory"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.get("/logs", response_model=List[StockLog])
def list_logs(db: Session = Depends(get_db)):
    return crud.list_stock_logs(db)

@router.post("/logs", response_model=StockLog)
def create_log(payload: StockLogCreate, db: Session = Depends(get_db)):
    return crud.create_stock_log(db, payload.model_dump())

