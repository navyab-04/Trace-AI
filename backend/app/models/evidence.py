import uuid
from datetime import datetime, timezone
from sqlalchemy import String, Text, Float, DateTime, ForeignKey, Boolean
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.database.database import Base

class Evidence(Base):
    __tablename__ = "evidence"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    person_id: Mapped[str] = mapped_column(String(36), ForeignKey("persons.id", ondelete="CASCADE"))
    source_url: Mapped[str] = mapped_column(String(512), nullable=True)
    source_type: Mapped[str] = mapped_column(String(64))
    claim: Mapped[str] = mapped_column(Text)
    evidence_text: Mapped[str] = mapped_column(Text, nullable=True)
    is_conflict: Mapped[bool] = mapped_column(Boolean, default=False)
    confidence: Mapped[float] = mapped_column(Float, default=0.5)
    retrieved_at: Mapped[datetime] = mapped_column(DateTime, default=lambda: datetime.now(timezone.utc))

    person = relationship("Person", back_populates="evidence_items")
