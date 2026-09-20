from typing import List, Optional
from pydantic import BaseModel
from app.schemas.person import CandidateResponse
from app.schemas.profile import ProfileResponse
from app.schemas.evidence import EvidenceResponse
from app.schemas.timeline import EventResponse
from app.schemas.image_intelligence import ImageIntelligenceData, IdentitySignalsData

class InvestigationReportResponse(BaseModel):
    investigation_id: str
    status: str
    consent_status: str
    image_path: Optional[str] = None
    image_intelligence: Optional[ImageIntelligenceData] = None
    identity_signals: Optional[IdentitySignalsData] = None
    top_candidate: Optional[CandidateResponse] = None
    all_candidates: List[CandidateResponse] = []
    discovered_profiles: List[ProfileResponse] = []
    supporting_evidence: List[EvidenceResponse] = []
    conflicting_evidence: List[EvidenceResponse] = []
    timeline: List[EventResponse] = []
    summary_explanation: str

