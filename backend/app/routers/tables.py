from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from backend.app.database import SessionLocal
from backend.app import crud
from backend.app.schemas import Table, TableCreate

router = APIRouter(prefix="/api/tables", tags=["tables"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.get("/", response_model=List[Table])
def list_tables(db: Session = Depends(get_db)):
    return crud.list_tables(db)

@router.post("/", response_model=Table)
def create_table(payload: TableCreate, db: Session = Depends(get_db)):
    return crud.create_table(db, payload.model_dump())

@router.put("/{table_id}", response_model=Table)
def update_table(table_id: str, payload: TableCreate, db: Session = Depends(get_db)):
    obj = crud.update_table(db, table_id, payload.model_dump())
    if not obj:
        raise HTTPException(status_code=404, detail="Not found")
    return obj

