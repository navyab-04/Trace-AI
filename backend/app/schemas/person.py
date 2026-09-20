from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel, ConfigDict

class PersonResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    investigation_id: str
    display_name: str
    classification: str
    identity_confidence: float
    summary: Optional[str] = None
    created_at: datetime

class CandidateResponse(BaseModel):
    person_id: str
    display_name: str
    classification: str
    confidence: float
    supporting_signals: List[str]
    conflicting_signals: List[str]
    profiles_count: int
    summary: Optional[str] = None
