from pathlib import Path
from sqlalchemy import create_engine
from sqlalchemy.orm import DeclarativeBase, sessionmaker
from app.core.config import settings

PROJECT_ROOT = Path(__file__).resolve().parents[3]

effective_db_url = settings.get_effective_database_url()

engine_kwargs = {"pool_pre_ping": True}
if effective_db_url.startswith("sqlite"):
    engine_kwargs = {"connect_args": {"check_same_thread": False}}

engine = create_engine(
    effective_db_url,
    **engine_kwargs
)

SessionLocal = sessionmaker(
    bind=engine,
    autocommit=False,
    autoflush=False,
)


class Base(DeclarativeBase):
    pass


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()