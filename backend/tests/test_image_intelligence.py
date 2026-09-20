import os
import tempfile
import pytest
from PIL import Image, ImageDraw
import qrcode
from fastapi.testclient import TestClient

from app.ml.image_intelligence import image_intelligence_service
from app.schemas.image_intelligence import ImageIntelligenceData, IdentitySignalsData


def create_synthetic_badge(tmp_path, with_qr=True):
    # Create an ID badge with 400x600 dimensions (aspect ratio ~0.67)
    img = Image.new("RGB", (400, 600), color=(240, 245, 250))
    draw = ImageDraw.Draw(img)

    # Draw header banner
    draw.rectangle([(0, 0), (400, 80)], fill=(15, 23, 42))

    if with_qr:
        # Generate QR code with vCard payload
        vcard_data = (
            "BEGIN:VCARD\n"
            "VERSION:3.0\n"
            "FN:Dr. Elena Vance\n"
            "ORG:Black Mesa Research\n"
            "TITLE:Lead Quantum Physicist\n"
            "EMAIL:elena.vance@blackmesa.gov\n"
            "TEL:+1-555-019-2834\n"
            "URL:https://github.com/elenavance\n"
            "END:VCARD"
        )
        qr = qrcode.QRCode(box_size=4, border=2)
        qr.add_data(vcard_data)
        qr.make(fit=True)
        qr_img = qr.make_image(fill_color="black", back_color="white").convert("RGB")
        # Paste QR into bottom half of badge
        img.paste(qr_img, (100, 300))

    file_path = os.path.join(tmp_path, "synthetic_badge.png")
    img.save(file_path, format="PNG")
    return file_path


def test_signal_extraction_without_image():
    img_intel, signals = image_intelligence_service.process(
        image_path=None,
        manual_name="Marcus Brody",
        manual_username="mbrody",
        manual_org="Marshall College",
        manual_context="Dean at Marshall College. Expert in Archaeology, History, Python, and Artifact Security."
    )

    assert isinstance(img_intel, ImageIntelligenceData)
    assert isinstance(signals, IdentitySignalsData)
    assert signals.name == "Marcus Brody"
    assert signals.username == "mbrody"
    assert signals.organization == "Marshall College"
    assert "Marshall College" in (signals.college or "")
    assert "Python" in signals.skills
    assert "Cybersecurity" in signals.skills or "Security" in " ".join(signals.skills)
    assert signals.completeness_percentage > 50


def test_qr_detection_and_identity_signals(tmp_path):
    badge_path = create_synthetic_badge(str(tmp_path), with_qr=True)

    img_intel, signals = image_intelligence_service.process(
        image_path=badge_path,
        manual_context="Alumni of MIT University. Building project QuantumBridge."
    )

    # Verify Document Detection
    assert img_intel.document_detection.document_type in ["CONFERENCE_PASS", "ID_BADGE"]
    assert img_intel.document_detection.has_qr is True

    # Verify QR Code parsing
    assert len(img_intel.qr_codes) >= 1
    qr = img_intel.qr_codes[0]
    assert qr.qr_type == "VCARD"
    assert qr.parsed_fields.get("name") == "Dr. Elena Vance"
    assert qr.parsed_fields.get("organization") == "Black Mesa Research"
    assert qr.parsed_fields.get("email") == "elena.vance@blackmesa.gov"
    assert qr.parsed_fields.get("phone") == "+1-555-019-2834"

    # Verify 11 Identity Signals
    assert signals.name == "Dr. Elena Vance"
    assert signals.username == "elenavance"
    assert signals.email == "elena.vance@blackmesa.gov"
    assert signals.phone == "+1-555-019-2834"
    assert signals.organization == "Black Mesa Research"
    assert "MIT" in (signals.college or "")
    assert any("github.com/elenavance" in url for url in signals.social_urls)
    assert "QuantumBridge" in signals.projects
    assert signals.completeness_percentage >= 70


def test_document_classification_types():
    # Test Student ID keyword heuristic
    doc_student = image_intelligence_service._detect_document_type(
        width=400, height=600, has_qr=False,
        text_lines=["Student ID Card", "Roll No: 2024CS01", "Stanford University"],
        cv_img=None
    )
    assert doc_student.document_type == "STUDENT_ID"

    # Test Certificate keyword heuristic
    doc_cert = image_intelligence_service._detect_document_type(
        width=800, height=600, has_qr=False,
        text_lines=["Certificate of Achievement", "Awarded to John Doe"],
        cv_img=None
    )
    assert doc_cert.document_type == "CERTIFICATE"

    # Test Resume Screenshot heuristic
    doc_resume = image_intelligence_service._detect_document_type(
        width=700, height=1000, has_qr=False,
        text_lines=["Curriculum Vitae", "Experience", "Education", "Projects", "Skills"],
        cv_img=None
    )
    assert doc_resume.document_type == "RESUME_SCREENSHOT"


def test_api_image_intelligence_and_signals(client: TestClient, tmp_path):
    badge_path = create_synthetic_badge(str(tmp_path), with_qr=True)

    # 1. Create investigation
    create_res = client.post("/api/v1/investigations", json={
        "consent_status": "AUTHORIZED",
        "input_name": "Dr. Elena Vance",
        "input_context": "Researcher at Black Mesa and MIT University."
    })
    assert create_res.status_code == 201
    inv_id = create_res.json()["id"]

    # 2. Upload image
    with open(badge_path, "rb") as f:
        upload_res = client.post(
            f"/api/v1/investigations/{inv_id}/image",
            files={"file": ("badge.png", f, "image/png")}
        )
    assert upload_res.status_code == 200

    # 3. Analyze investigation
    analyze_res = client.post(f"/api/v1/investigations/{inv_id}/analyze")
    assert analyze_res.status_code == 200
    inv_data = analyze_res.json()
    assert inv_data["status"] == "COMPLETED"
    assert inv_data["image_intelligence"] is not None
    assert inv_data["identity_signals"] is not None

    # 4. Check GET /investigations/{id}/image-intelligence
    intel_res = client.get(f"/api/v1/investigations/{inv_id}/image-intelligence")
    assert intel_res.status_code == 200
    intel_json = intel_res.json()
    assert intel_json["document_detection"]["has_qr"] is True
    assert len(intel_json["qr_codes"]) >= 1

    # 5. Check GET /investigations/{id}/signals
    sig_res = client.get(f"/api/v1/investigations/{inv_id}/signals")
    assert sig_res.status_code == 200
    sig_json = sig_res.json()
    assert sig_json["name"] == "Dr. Elena Vance"
    assert sig_json["email"] == "elena.vance@blackmesa.gov"
    assert sig_json["phone"] == "+1-555-019-2834"
    assert sig_json["organization"] == "Black Mesa Research"

    # 6. Check GET /investigations/{id}/report
    report_res = client.get(f"/api/v1/investigations/{inv_id}/report")
    assert report_res.status_code == 200
    rep_json = report_res.json()
    assert rep_json["image_intelligence"] is not None
    assert rep_json["identity_signals"] is not None
    # Visual evidence should be included
    visual_ev = [e for e in rep_json["supporting_evidence"] if "Image Intelligence" in e["source_type"]]
    assert len(visual_ev) >= 1

    # 7. Check GET /investigations/{id}/graph
    graph_res = client.get(f"/api/v1/investigations/{inv_id}/graph")
    assert graph_res.status_code == 200
    graph_json = graph_res.json()
    assert any(n["type"] in ["Organization", "College"] for n in graph_json["nodes"])


def test_scan_image_prescan(tmp_path, client):
    # Test POST /api/v1/investigations/scan-image instant pre-scan
    badge_path = create_synthetic_badge(tmp_path, with_qr=True)

    with open(badge_path, "rb") as f:
        scan_res = client.post(
            "/api/v1/investigations/scan-image",
            files={"file": ("badge.png", f, "image/png")}
        )

    assert scan_res.status_code == 200
    scan_json = scan_res.json()
    assert "image_path" in scan_json
    assert "image_intelligence" in scan_json
    assert "identity_signals" in scan_json
    assert scan_json["identity_signals"]["name"] == "Dr. Elena Vance"
    assert scan_json["identity_signals"]["organization"] == "Black Mesa Research"

    # Create investigation with pre-scanned image path bound
    create_res = client.post(
        "/api/v1/investigations",
        json={
            "consent_status": "AUTHORIZED",
            "input_name": scan_json["identity_signals"]["name"],
            "input_organization": scan_json["identity_signals"]["organization"],
            "image_path": scan_json["image_path"]
        }
    )
    assert create_res.status_code == 201
    created_inv = create_res.json()
    assert created_inv["image_path"] == scan_json["image_path"]
    assert created_inv["identity_signals"]["name"] == "Dr. Elena Vance"


def test_facial_vector_extraction_and_comparison(tmp_path):
    from app.ml.image_intelligence import compare_facial_vectors, compare_face_hashes
    import numpy as np

    # 1. Test vector comparison identical
    v1 = [0.1] * 128
    sim_identical = compare_facial_vectors(v1, v1)
    assert sim_identical >= 0.99

    # 2. Test vector comparison orthogonal/opposite
    v2 = [-0.1] * 128
    sim_opposite = compare_facial_vectors(v1, v2)
    assert sim_opposite <= 0.05

    # 3. Test face hash Hamming distance
    h1 = "2eb62a9471490ab1"
    h2 = "2eb62a9471490ab1"
    dist_same = compare_face_hashes(h1, h2)
    assert dist_same == 0

    h3 = "ffffffffffffffff"
    dist_diff = compare_face_hashes(h1, h3)
    assert dist_diff > 20
