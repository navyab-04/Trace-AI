import uuid
from sqlalchemy import String, Float, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column
from app.database.database import Base

class Relationship(Base):
    __tablename__ = "relationships"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    investigation_id: Mapped[str] = mapped_column(String(36), ForeignKey("investigations.id", ondelete="CASCADE"))
    source_entity_id: Mapped[str] = mapped_column(String(36))
    target_entity_id: Mapped[str] = mapped_column(String(36))
    source_name: Mapped[str] = mapped_column(String(255))
    target_name: Mapped[str] = mapped_column(String(255))
    relationship_type: Mapped[str] = mapped_column(String(64)) # WORKED_AT, PARTICIPATED_IN, AUTHORED, CREATED, CONTRIBUTED_TO, ASSOCIATED_WITH, PUBLISHED, ATTENDED
    confidence: Mapped[float] = mapped_column(Float, default=0.5)
    evidence_id: Mapped[str] = mapped_column(String(36), nullable=True)
