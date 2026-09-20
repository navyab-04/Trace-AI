from typing import List
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form, status
from sqlalchemy.orm import Session
from app.database.database import get_db
from app.models.investigation import Investigation
from app.schemas.investigation import InvestigationCreate, InvestigationResponse
from app.schemas.person import CandidateResponse
from app.schemas.profile import ProfileResponse
from app.schemas.evidence import EvidenceResponse
from app.schemas.timeline import EventResponse
from app.schemas.graph import RelationshipGraphResponse
from app.schemas.report import InvestigationReportResponse
from app.schemas.image_intelligence import ImageIntelligenceData, IdentitySignalsData
from app.services.investigation_service import investigation_service
from app.ml.image_intelligence import image_intelligence_service
from pydantic import BaseModel


class ImageScanResponse(BaseModel):
    image_path: str
    image_intelligence: ImageIntelligenceData
    identity_signals: IdentitySignalsData


router = APIRouter(prefix="/investigations", tags=["investigations"])

@router.post("/scan-image", response_model=ImageScanResponse)
async def scan_image(
    file: UploadFile = File(...)
):
    from pathlib import Path
    import uuid
    upload_dir = Path("data/uploads")
    upload_dir.mkdir(parents=True, exist_ok=True)
    ext = Path(file.filename or "image.png").suffix or ".png"
    target_path = upload_dir / f"scan_{uuid.uuid4().hex[:8]}{ext}"
    content = await file.read()
    with open(target_path, "wb") as f:
        f.write(content)

    img_intel, signals = image_intelligence_service.process(image_path=str(target_path))
    return ImageScanResponse(
        image_path=str(target_path),
        image_intelligence=img_intel,
        identity_signals=signals
    )

@router.post("", response_model=InvestigationResponse, status_code=status.HTTP_201_CREATED)
def create_investigation(
    payload: InvestigationCreate,
    db: Session = Depends(get_db)
):
    inv = investigation_service.create_investigation(db, payload)
    return inv

@router.get("/{id}", response_model=InvestigationResponse)
def get_investigation(
    id: str,
    db: Session = Depends(get_db)
):
    inv = db.query(Investigation).filter(Investigation.id == id).first()
    if not inv:
        raise HTTPException(status_code=404, detail="Investigation not found")
    return inv

@router.post("/{id}/image", response_model=InvestigationResponse)
async def upload_investigation_image(
    id: str,
    file: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    inv = db.query(Investigation).filter(Investigation.id == id).first()
    if not inv:
        raise HTTPException(status_code=404, detail="Investigation not found")

    from pathlib import Path
    upload_dir = Path("data/uploads")
    upload_dir.mkdir(parents=True, exist_ok=True)
    target_path = upload_dir / f"{id}_{file.filename}"
    content = await file.read()
    with open(target_path, "wb") as f:
        f.write(content)

    updated_inv = investigation_service.update_image(db, id, str(target_path))
    return updated_inv


@router.post("/{id}/analyze", response_model=InvestigationResponse)
def analyze_investigation(
    id: str,
    db: Session = Depends(get_db)
):
    inv = db.query(Investigation).filter(Investigation.id == id).first()
    if not inv:
        raise HTTPException(status_code=404, detail="Investigation not found")

    analyzed_inv = investigation_service.run_analysis(db, id)
    return analyzed_inv

@router.get("/{id}/candidates", response_model=List[CandidateResponse])
def get_candidates(
    id: str,
    db: Session = Depends(get_db)
):
    inv = db.query(Investigation).filter(Investigation.id == id).first()
    if not inv:
        raise HTTPException(status_code=404, detail="Investigation not found")
    return investigation_service.get_candidates(db, id)

@router.get("/{id}/profiles", response_model=List[ProfileResponse])
def get_profiles(
    id: str,
    db: Session = Depends(get_db)
):
    inv = db.query(Investigation).filter(Investigation.id == id).first()
    if not inv:
        raise HTTPException(status_code=404, detail="Investigation not found")
    return investigation_service.get_profiles(db, id)

@router.get("/{id}/evidence", response_model=List[EvidenceResponse])
def get_evidence(
    id: str,
    db: Session = Depends(get_db)
):
    inv = db.query(Investigation).filter(Investigation.id == id).first()
    if not inv:
        raise HTTPException(status_code=404, detail="Investigation not found")
    return investigation_service.get_evidence(db, id)

@router.get("/{id}/timeline", response_model=List[EventResponse])
def get_timeline(
    id: str,
    db: Session = Depends(get_db)
):
    inv = db.query(Investigation).filter(Investigation.id == id).first()
    if not inv:
        raise HTTPException(status_code=404, detail="Investigation not found")
    return investigation_service.get_timeline(db, id)

@router.get("/{id}/graph", response_model=RelationshipGraphResponse)
def get_graph(
    id: str,
    db: Session = Depends(get_db)
):
    inv = db.query(Investigation).filter(Investigation.id == id).first()
    if not inv:
        raise HTTPException(status_code=404, detail="Investigation not found")
    return investigation_service.get_graph(db, id)

from app.schemas.evaluation import InvestigationEvaluationResponse, DigitalExposureResponse
from app.services.evaluation_service import evaluation_service

@router.get("/{id}/report", response_model=InvestigationReportResponse)
def get_report(
    id: str,
    db: Session = Depends(get_db)
):
    report = investigation_service.get_report(db, id)
    if not report:
        raise HTTPException(status_code=404, detail="Investigation report not found")
    return report

@router.post("/{id}/digilocker/verify", response_model=InvestigationResponse)
def verify_digilocker(
    id: str,
    db: Session = Depends(get_db)
):
    inv = db.query(Investigation).filter(Investigation.id == id).first()
    if not inv:
        raise HTTPException(status_code=404, detail="Investigation not found")
    inv.consent_status = "DIGILOCKER_VERIFIED"
    db.commit()
    db.refresh(inv)
    # Re-run analysis to incorporate DigiLocker verified identity
    return investigation_service.run_analysis(db, id)

@router.get("/{id}/evaluation", response_model=InvestigationEvaluationResponse)
def get_evaluation(
    id: str,
    db: Session = Depends(get_db)
):
    res = evaluation_service.get_investigation_evaluation(db, id)
    if not res:
        raise HTTPException(status_code=404, detail="Evaluation not found")
    return res

@router.get("/{id}/exposure", response_model=DigitalExposureResponse)
def get_exposure(
    id: str,
    db: Session = Depends(get_db)
):
    res = evaluation_service.get_digital_exposure(db, id)
    if not res:
        raise HTTPException(status_code=404, detail="Exposure analytics not found")
    return res

@router.get("/{id}/image-intelligence", response_model=ImageIntelligenceData)
def get_image_intelligence(
    id: str,
    db: Session = Depends(get_db)
):
    inv = db.query(Investigation).filter(Investigation.id == id).first()
    if not inv:
        raise HTTPException(status_code=404, detail="Investigation not found")
    data = investigation_service.get_image_intelligence(db, id)
    if not data:
        raise HTTPException(status_code=404, detail="Image intelligence data not found")
    return data

@router.get("/{id}/signals", response_model=IdentitySignalsData)
def get_identity_signals(
    id: str,
    db: Session = Depends(get_db)
):
    inv = db.query(Investigation).filter(Investigation.id == id).first()
    if not inv:
        raise HTTPException(status_code=404, detail="Investigation not found")
    data = investigation_service.get_identity_signals(db, id)
    if not data:
        raise HTTPException(status_code=404, detail="Identity signals not found")
    return data


