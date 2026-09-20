from typing import List, Optional
from pydantic import BaseModel

class ProfileEvaluationDetail(BaseModel):
    platform: str
    username: str
    display_name: str
    completeness_score: float
    authenticity_score: float
    discrepancy_score: float
    is_digilocker_verified: bool
    discrepancies: List[str]
    recommendations: List[str]

class FaceMatchResult(BaseModel):
    match_confidence: float
    status: str
    details: str
    ekyc_verified: bool

class DigiLockerVerificationStatus(BaseModel):
    is_verified: bool
    digilocker_id: Optional[str] = None
    ekyc_photo_verified: bool = False
    verified_credentials_count: int = 0
    trust_score: float = 0.0

class InvestigationEvaluationResponse(BaseModel):
    investigation_id: str
    overall_authenticity_score: float
    overall_completeness_score: float
    face_match: FaceMatchResult
    digilocker_status: DigiLockerVerificationStatus
    evaluations: List[ProfileEvaluationDetail]

class DigitalExposureResponse(BaseModel):
    investigation_id: str
    target_name: str
    surface_score: int
    exposure_level: str
    risk_badge: str
    profiles_discovered: int
    evidence_claims_count: int
    has_digilocker_anchor: bool
    vulnerability_vectors: List[str]
    recommended_mitigations: List[str]
