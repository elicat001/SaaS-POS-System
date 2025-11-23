from typing import List
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from backend.app.database import SessionLocal
from backend.app import crud

router = APIRouter(prefix="/api/analytics", tags=["analytics"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.get("/sales-summary")
def sales_summary(start_ts: int, end_ts: int, db: Session = Depends(get_db)):
    return crud.sales_summary_daily(db, start_ts, end_ts)

