import uuid
from datetime import datetime, timezone
from sqlalchemy import String, Text, Float, DateTime, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.database.database import Base

class Profile(Base):
    __tablename__ = "profiles"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    person_id: Mapped[str] = mapped_column(String(36), ForeignKey("persons.id", ondelete="CASCADE"))
    platform: Mapped[str] = mapped_column(String(64))
    username: Mapped[str] = mapped_column(String(255))
    profile_url: Mapped[str] = mapped_column(String(512), nullable=True)
    display_name: Mapped[str] = mapped_column(String(255), nullable=True)
    bio: Mapped[str] = mapped_column(Text, nullable=True)
    profile_confidence: Mapped[float] = mapped_column(Float, default=0.5)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=lambda: datetime.now(timezone.utc))

    person = relationship("Person", back_populates="profiles")
