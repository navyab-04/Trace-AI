from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database.database import engine, Base
from app.api.v1 import api_v1_router
from app.core.config import settings

# Create database tables automatically on startup if using SQLite/Postgres
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title=settings.app_name,
    description="Public Profile & Digital Footprint Intelligence API",
    version=settings.app_version,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_v1_router)

@app.get("/health", tags=["health"])
def health_check():
    return {
        "status": "healthy",
        "service": settings.app_name,
        "version": settings.app_version,
        "environment": settings.environment,
    }