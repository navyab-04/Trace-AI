from datetime import datetime
from typing import Optional, Dict, Any
from pydantic import BaseModel, Field, ConfigDict
from app.schemas.image_intelligence import ImageIntelligenceData, IdentitySignalsData

class InvestigationCreate(BaseModel):
    consent_status: str = Field(default="AUTHORIZED", description="Authorization or consent confirmation state")
    input_name: Optional[str] = Field(default=None, description="Optional known candidate name")
    input_username: Optional[str] = Field(default=None, description="Optional known username")
    input_organization: Optional[str] = Field(default=None, description="Optional known organization")
    input_college: Optional[str] = Field(default=None, description="Optional known college or university")
    input_location: Optional[str] = Field(default=None, description="Optional known location or city")
    input_email: Optional[str] = Field(default=None, description="Optional known email address")
    input_phone: Optional[str] = Field(default=None, description="Optional known phone number")
    input_website: Optional[str] = Field(default=None, description="Optional personal website or portfolio")
    input_skills: Optional[str] = Field(default=None, description="Optional technical skills (comma-separated)")
    input_projects: Optional[str] = Field(default=None, description="Optional known projects or repositories (comma-separated)")
    input_context: Optional[str] = Field(default=None, description="Context, biography hints, or target description")
    image_path: Optional[str] = Field(default=None, description="Pre-scanned image path")


class InvestigationResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    status: str
    consent_status: str
    input_name: Optional[str] = None
    input_username: Optional[str] = None
    input_organization: Optional[str] = None
    input_context: Optional[str] = None
    input_college: Optional[str] = None
    input_location: Optional[str] = None
    input_email: Optional[str] = None
    input_phone: Optional[str] = None
    input_website: Optional[str] = None
    input_skills: Optional[str] = None
    input_projects: Optional[str] = None
    image_path: Optional[str] = None
    image_intelligence: Optional[ImageIntelligenceData] = None
    identity_signals: Optional[IdentitySignalsData] = None
    created_at: datetime

