import pytest
from app.connectors.digilocker_connector import DigiLockerConnector
from app.ml.face_verifier import face_verifier
from app.ml.profile_evaluator import profile_evaluator
from app.ml.exposure_radar import exposure_radar

def test_digilocker_connector():
    connector = DigiLockerConnector()
    assert connector.platform_name == "DigiLocker (Official Govt Verified)"
    
    results = connector.search_candidates(name="Aarav Sharma", org="IIT Delhi")
    assert len(results) == 1
    item = results[0]
    assert item["platform"] == "DigiLocker Verified Identity"
    assert "DL-" in item["digilocker_id"]
    assert len(item["verified_credentials"]) >= 3
    assert item["evidence"][0]["confidence"] == 0.98

def test_face_verifier():
    res_ekyc = face_verifier.compare_faces(
        target_image_path="data/uploads/sample.jpg",
        candidate_name="Aarav Sharma",
        candidate_platform="DigiLocker",
        is_digilocker_verified=True
    )
    assert res_ekyc["match_confidence"] == 0.96
    assert res_ekyc["status"] == "VERIFIED_MATCH"
    assert res_ekyc["ekyc_verified"] is True

def test_profile_evaluator():
    p_data = {
        "platform": "GitHub",
        "username": "aarav_s",
        "display_name": "Aarav Sharma",
        "bio": "AI Researcher at IIT Delhi",
        "profile_url": "https://github.com/aarav_s",
        "organization": "IIT Delhi"
    }
    target = {"name": "Aarav Sharma", "org": "IIT Delhi", "context": "AI Researcher"}
    eval_res = profile_evaluator.evaluate_profile(p_data, target)
    
    assert eval_res["completeness_score"] == 1.0
    assert eval_res["authenticity_score"] > 0.8
    assert eval_res["discrepancy_score"] == 0.0
    assert len(eval_res["recommendations"]) > 0

def test_exposure_radar():
    radar_res = exposure_radar.analyze_exposure(
        target_name="Aarav Sharma",
        profiles_count=4,
        evidence_count=8,
        discrepancies_count=1,
        has_digilocker=True
    )
    assert radar_res["exposure_level"] in ["High Exposure", "Moderate Exposure", "Low Exposure"]
    assert radar_res["has_digilocker_anchor"] is True
    assert len(radar_res["vulnerability_vectors"]) > 0

def test_investigation_evaluation_api(client):
    # 1. Create Investigation
    c_res = client.post(
        "/api/v1/investigations",
        json={
            "consent_status": "AUTHORIZED",
            "input_name": "Priya Patel",
            "input_username": "ppatel_dev",
            "input_organization": "TechCorp",
            "input_context": "Software engineer and security researcher."
        }
    )
    assert c_res.status_code == 201
    inv_id = c_res.json()["id"]

    # 2. Analyze
    a_res = client.post(f"/api/v1/investigations/{inv_id}/analyze")
    assert a_res.status_code == 200

    # 3. Verify DigiLocker Consent Endpoint
    d_res = client.post(f"/api/v1/investigations/{inv_id}/digilocker/verify")
    assert d_res.status_code == 200
    assert d_res.json()["consent_status"] == "DIGILOCKER_VERIFIED"

    # 4. Get Evaluation Endpoint
    e_res = client.get(f"/api/v1/investigations/{inv_id}/evaluation")
    assert e_res.status_code == 200
    e_data = e_res.json()
    assert e_data["investigation_id"] == inv_id
    assert e_data["digilocker_status"]["is_verified"] is True
    assert len(e_data["evaluations"]) > 0

    # 5. Get Exposure Endpoint
    exp_res = client.get(f"/api/v1/investigations/{inv_id}/exposure")
    assert exp_res.status_code == 200
    exp_data = exp_res.json()
    assert exp_data["has_digilocker_anchor"] is True
