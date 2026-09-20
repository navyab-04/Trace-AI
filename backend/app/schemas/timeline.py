from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel, ConfigDict

class EventResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    person_id: str
    event_type: str
    title: str
    organization: Optional[str] = None
    date_str: Optional[str] = None
    description: Optional[str] = None
    source_url: Optional[str] = None
    confidence: float
    created_at: datetime

class TimelineResponse(BaseModel):
    person_id: str
    events: List[EventResponse]
