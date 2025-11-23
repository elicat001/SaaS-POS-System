from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from backend.app.database import SessionLocal
from backend.app import crud
from backend.app.schemas import Product, ProductCreate

router = APIRouter(prefix="/api/products", tags=["products"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.get("/", response_model=List[Product])
def list_products(db: Session = Depends(get_db)):
    return crud.list_products(db)

@router.get("/{product_id}", response_model=Product)
def get_product(product_id: str, db: Session = Depends(get_db)):
    obj = crud.get_product(db, product_id)
    if not obj:
        raise HTTPException(status_code=404, detail="Not found")
    return obj

@router.post("/", response_model=Product)
def create_product(payload: ProductCreate, db: Session = Depends(get_db)):
    return crud.create_product(db, payload.model_dump())

@router.put("/{product_id}", response_model=Product)
def update_product(product_id: str, payload: ProductCreate, db: Session = Depends(get_db)):
    obj = crud.update_product(db, product_id, payload.model_dump())
    if not obj:
        raise HTTPException(status_code=404, detail="Not found")
    return obj

@router.delete("/{product_id}")
def delete_product(product_id: str, db: Session = Depends(get_db)):
    ok = crud.delete_product(db, product_id)
    if not ok:
        raise HTTPException(status_code=404, detail="Not found")
    return {"ok": True}

