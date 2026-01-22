from typing import List
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from backend.app.database import SessionLocal
from backend.app import crud
from backend.app.schemas import Supplier
from fastapi import Body

router = APIRouter(prefix="/api/suppliers", tags=["suppliers"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.get("/", response_model=List[Supplier])
def list_suppliers(db: Session = Depends(get_db)):
    return crud.list_suppliers(db)

@router.post("/", response_model=Supplier)
def create_supplier(
    name: str = Body(...),
    contactName: str = Body(...),
    phone: str = Body(...),
    email: str | None = Body(None),
    db: Session = Depends(get_db)
):
    return crud.create_supplier(db, name, contactName, phone, email)
