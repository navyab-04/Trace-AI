import uuid
from datetime import datetime, timezone
from sqlalchemy import String, Text, Float, DateTime, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.database.database import Base

class Person(Base):
    __tablename__ = "persons"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    investigation_id: Mapped[str] = mapped_column(String(36), ForeignKey("investigations.id", ondelete="CASCADE"))
    display_name: Mapped[str] = mapped_column(String(255))
    classification: Mapped[str] = mapped_column(String(64), default="Possible Match")
    identity_confidence: Mapped[float] = mapped_column(Float, default=0.0)
    summary: Mapped[str] = mapped_column(Text, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=lambda: datetime.now(timezone.utc))

    investigation = relationship("Investigation", back_populates="persons")
    profiles = relationship("Profile", back_populates="person", cascade="all, delete-orphan")
    evidence_items = relationship("Evidence", back_populates="person", cascade="all, delete-orphan")
    events = relationship("Event", back_populates="person", cascade="all, delete-orphan")
