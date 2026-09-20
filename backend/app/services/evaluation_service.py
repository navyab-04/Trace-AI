from typing import Optional
from sqlalchemy.orm import Session
from app.models.investigation import Investigation
from app.models.person import Person
from app.models.profile import Profile
from app.models.evidence import Evidence
from app.schemas.evaluation import (
    InvestigationEvaluationResponse,
    ProfileEvaluationDetail,
    FaceMatchResult,
    DigiLockerVerificationStatus,
    DigitalExposureResponse
)
from app.ml.profile_evaluator import profile_evaluator
from app.ml.face_verifier import face_verifier
from app.ml.exposure_radar import exposure_radar

class EvaluationService:

    def get_investigation_evaluation(self, db: Session, investigation_id: str) -> Optional[InvestigationEvaluationResponse]:
        inv = db.query(Investigation).filter(Investigation.id == investigation_id).first()
        if not inv:
            return None

        persons = db.query(Person).filter(Person.investigation_id == investigation_id).all()
        person_ids = [p.id for p in persons]
        profiles = db.query(Profile).filter(Profile.person_id.in_(person_ids)).all() if person_ids else []

        evaluations = []
        has_digilocker = False
        digilocker_id = None
        total_auth = 0.0
        total_comp = 0.0

        target_context = {
            "name": inv.input_name or "",
            "org": inv.input_organization or "",
            "context": inv.input_context or ""
        }

        for prof in profiles:
            p_dict = {
                "platform": prof.platform,
                "username": prof.username,
                "display_name": prof.display_name,
                "bio": prof.bio,
                "profile_url": prof.profile_url,
                "organization": inv.input_organization
            }
            eval_res = profile_evaluator.evaluate_profile(p_dict, target_context)
            if eval_res["is_digilocker_verified"]:
                has_digilocker = True
                digilocker_id = prof.username

            evaluations.append(ProfileEvaluationDetail(**eval_res))
            total_auth += eval_res["authenticity_score"]
            total_comp += eval_res["completeness_score"]

        n = len(evaluations) or 1
        avg_auth = round(total_auth / n, 2)
        avg_comp = round(total_comp / n, 2)

        # Face matching against top profile
        face_res = face_verifier.compare_faces(
            target_image_path=inv.image_path,
            candidate_name=inv.input_name or "Target Subject",
            candidate_platform="DigiLocker / Public Web",
            is_digilocker_verified=has_digilocker
        )

        digi_status = DigiLockerVerificationStatus(
            is_verified=has_digilocker,
            digilocker_id=digilocker_id or (f"DL-{inv.id[:8].upper()}" if has_digilocker else None),
            ekyc_photo_verified=has_digilocker,
            verified_credentials_count=4 if has_digilocker else 0,
            trust_score=0.98 if has_digilocker else 0.0
        )

        return InvestigationEvaluationResponse(
            investigation_id=inv.id,
            overall_authenticity_score=avg_auth,
            overall_completeness_score=avg_comp,
            face_match=FaceMatchResult(**face_res),
            digilocker_status=digi_status,
            evaluations=evaluations
        )

    def get_digital_exposure(self, db: Session, investigation_id: str) -> Optional[DigitalExposureResponse]:
        inv = db.query(Investigation).filter(Investigation.id == investigation_id).first()
        if not inv:
            return None

        persons = db.query(Person).filter(Person.investigation_id == investigation_id).all()
        person_ids = [p.id for p in persons]
        profiles = db.query(Profile).filter(Profile.person_id.in_(person_ids)).all() if person_ids else []
        evidence = db.query(Evidence).filter(Evidence.person_id.in_(person_ids)).all() if person_ids else []

        has_digilocker = any("DigiLocker" in p.platform for p in profiles)
        discrepancies_count = len([e for e in evidence if e.is_conflict])

        exp_dict = exposure_radar.analyze_exposure(
            target_name=inv.input_name or "Subject",
            profiles_count=len(profiles),
            evidence_count=len(evidence),
            discrepancies_count=discrepancies_count,
            has_digilocker=has_digilocker
        )

        return DigitalExposureResponse(
            investigation_id=inv.id,
            **exp_dict
        )

evaluation_service = EvaluationService()
