from datetime import datetime
from typing import Optional
from pydantic import BaseModel, ConfigDict

class EvidenceResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    person_id: str
    source_url: Optional[str] = None
    source_type: str
    claim: str
    evidence_text: Optional[str] = None
    is_conflict: bool
    confidence: float
    retrieved_at: datetime
