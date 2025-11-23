from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.app.database import Base, engine
from backend.app.routers import products, categories, suppliers, tables, users, orders, reservations, inventory, analytics

app = FastAPI(title="SaaS POS API", version="0.1.0")

origins = ["http://localhost:3000"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

Base.metadata.create_all(bind=engine)

app.include_router(categories.router)
app.include_router(suppliers.router)
app.include_router(products.router)
app.include_router(tables.router)
app.include_router(users.router)
app.include_router(orders.router)
app.include_router(reservations.router)
app.include_router(inventory.router)
app.include_router(analytics.router)

