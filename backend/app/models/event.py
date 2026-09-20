import uuid
from datetime import datetime, timezone
from sqlalchemy import String, Text, Float, DateTime, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.database.database import Base

class Event(Base):
    __tablename__ = "events"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    person_id: Mapped[str] = mapped_column(String(36), ForeignKey("persons.id", ondelete="CASCADE"))
    event_type: Mapped[str] = mapped_column(String(64)) # Education, Employment, Project, Hackathon, Conference, Publication, Workshop
    title: Mapped[str] = mapped_column(String(255))
    organization: Mapped[str] = mapped_column(String(255), nullable=True)
    date_str: Mapped[str] = mapped_column(String(64), nullable=True)
    description: Mapped[str] = mapped_column(Text, nullable=True)
    source_url: Mapped[str] = mapped_column(String(512), nullable=True)
    confidence: Mapped[float] = mapped_column(Float, default=0.5)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=lambda: datetime.now(timezone.utc))

    person = relationship("Person", back_populates="events")
