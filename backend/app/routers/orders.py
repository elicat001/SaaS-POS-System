from typing import List, Optional
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from backend.app.database import SessionLocal
from backend.app import crud
from backend.app.schemas import Order, OrderCreate

router = APIRouter(prefix="/api/orders", tags=["orders"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.get("/", response_model=List[Order])
def list_orders(status: Optional[str] = None, db: Session = Depends(get_db)):
    return crud.list_orders(db, status)

@router.post("/", response_model=Order)
def create_order(payload: OrderCreate, db: Session = Depends(get_db)):
    return crud.create_order(db, payload.model_dump())

