from typing import List
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from backend.app.database import SessionLocal
from backend.app import crud
from backend.app.schemas import Reservation, ReservationCreate

router = APIRouter(prefix="/api/reservations", tags=["reservations"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.get("/", response_model=List[Reservation])
def list_reservations(db: Session = Depends(get_db)):
    return crud.list_reservations(db)

@router.post("/", response_model=Reservation)
def add_reservation(payload: ReservationCreate, db: Session = Depends(get_db)):
    return crud.add_reservation(db, payload.model_dump())

