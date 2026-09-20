from datetime import datetime
from typing import Optional
from pydantic import BaseModel, ConfigDict

class ProfileResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    person_id: str
    platform: str
    username: str
    profile_url: Optional[str] = None
    display_name: Optional[str] = None
    bio: Optional[str] = None
    profile_confidence: float
    created_at: datetime
