from typing import List, Dict, Any, Optional
from pydantic import BaseModel, Field

class ImageMetadata(BaseModel):
    format: Optional[str] = None
    width: Optional[int] = None
    height: Optional[int] = None
    megapixels: Optional[float] = None
    color_mode: Optional[str] = None
    date_time: Optional[str] = None
    camera_make: Optional[str] = None
    camera_model: Optional[str] = None
    software: Optional[str] = None
    gps_coordinates: Optional[Dict[str, float]] = None

class DocumentDetectionResult(BaseModel):
    document_type: str = Field(description="ID_BADGE, CONFERENCE_PASS, STUDENT_ID, CERTIFICATE, RESUME_SCREENSHOT, or PORTRAIT_PHOTO")
    confidence: float
    rationale: str
    aspect_ratio: float
    has_qr: bool
    text_density: str

class QRCodeData(BaseModel):
    data: str
    qr_type: str = Field(description="URL, VCARD, EMAIL, TEXT, or SOCIAL_PROFILE")
    parsed_fields: Dict[str, Any] = Field(default_factory=dict)

class FaceSignals(BaseModel):
    face_detected: bool = False
    face_count: int = 0
    bounding_box: Optional[Dict[str, int]] = None  # x, y, width, height
    confidence: float = 0.0
    portrait_type: str = "UNKNOWN"  # HEADSHOT, ID_PHOTO, BADGE_PORTRAIT, AVATAR, DOCUMENT_NO_FACE
    clarity_score: float = 0.0
    lighting_balance: str = "BALANCED"  # BALANCED, HIGH_EXPOSURE, LOW_LIGHT
    liveness_indication: str = "VERIFIED_GENUINE_BIOMETRIC"  # VERIFIED_GENUINE_BIOMETRIC, HIGH_QUALITY_PORTRAIT, PLAUSIBLE_BIOMETRIC
    facial_landmarks: List[str] = Field(default_factory=list)
    face_hash: Optional[str] = None
    facial_vector: Optional[List[float]] = None  # 128-D L2-normalized biometric embedding
    facial_vector_dimension: int = 128
    rationale: str = ""

class ImageIntelligenceData(BaseModel):
    image_path: Optional[str] = None
    document_detection: DocumentDetectionResult
    face_signals: FaceSignals = Field(default_factory=FaceSignals)
    metadata: ImageMetadata
    qr_codes: List[QRCodeData] = Field(default_factory=list)
    detected_urls: List[str] = Field(default_factory=list)
    ocr_raw_text: str = ""
    extracted_lines: List[str] = Field(default_factory=list)

class IdentitySignalsData(BaseModel):
    name: Optional[str] = None
    username: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None
    organization: Optional[str] = None
    college: Optional[str] = None
    location: Optional[str] = None
    website: Optional[str] = None
    social_urls: List[str] = Field(default_factory=list)
    skills: List[str] = Field(default_factory=list)
    projects: List[str] = Field(default_factory=list)
    face_detected: bool = False
    face_hash: Optional[str] = None
    facial_vector: Optional[List[float]] = None
    face_quality: Optional[str] = None
    biometric_status: Optional[str] = None
    biometric_similarity: Optional[float] = None
    signal_sources: Dict[str, str] = Field(default_factory=dict)
    completeness_percentage: int = 0
