import uuid
from datetime import datetime, timezone
from sqlalchemy import String, Text, DateTime, JSON, Enum as SQLEnum
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.database.database import Base
import enum

class InvestigationStatus(str, enum.Enum):
    PENDING = "PENDING"
    RUNNING = "RUNNING"
    COMPLETED = "COMPLETED"
    FAILED = "FAILED"

class Investigation(Base):
    __tablename__ = "investigations"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    status: Mapped[str] = mapped_column(String(32), default=InvestigationStatus.PENDING.value)
    consent_status: Mapped[str] = mapped_column(String(64), default="AUTHORIZED")
    input_name: Mapped[str] = mapped_column(String(255), nullable=True)
    input_username: Mapped[str] = mapped_column(String(255), nullable=True)
    input_organization: Mapped[str] = mapped_column(String(255), nullable=True)
    input_context: Mapped[str] = mapped_column(Text, nullable=True)
    input_college: Mapped[str] = mapped_column(String(255), nullable=True)
    input_location: Mapped[str] = mapped_column(String(255), nullable=True)
    input_email: Mapped[str] = mapped_column(String(255), nullable=True)
    input_phone: Mapped[str] = mapped_column(String(64), nullable=True)
    input_website: Mapped[str] = mapped_column(String(512), nullable=True)
    input_skills: Mapped[str] = mapped_column(Text, nullable=True)
    input_projects: Mapped[str] = mapped_column(Text, nullable=True)
    image_path: Mapped[str] = mapped_column(String(512), nullable=True)
    image_intelligence: Mapped[dict] = mapped_column(JSON, nullable=True)
    identity_signals: Mapped[dict] = mapped_column(JSON, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=lambda: datetime.now(timezone.utc))

    persons = relationship("Person", back_populates="investigation", cascade="all, delete-orphan")

