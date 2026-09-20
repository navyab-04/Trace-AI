def test_full_investigation_lifecycle(client):
    # 1. Create Investigation
    create_res = client.post(
        "/api/v1/investigations",
        json={
            "consent_status": "AUTHORIZED",
            "input_name": "Jordan Lee",
            "input_username": "jlee_dev",
            "input_organization": "OpenAI Guild",
            "input_context": "Machine learning researcher and open-source contributor."
        }
    )
    assert create_res.status_code == 201
    inv_data = create_res.json()
    inv_id = inv_data["id"]
    assert inv_data["status"] == "PENDING"
    assert inv_data["input_name"] == "Jordan Lee"

    # 2. Run Analysis
    analyze_res = client.post(f"/api/v1/investigations/{inv_id}/analyze")
    assert analyze_res.status_code == 200
    assert analyze_res.json()["status"] == "COMPLETED"

    # 3. Get Candidates
    cand_res = client.get(f"/api/v1/investigations/{inv_id}/candidates")
    assert cand_res.status_code == 200
    candidates = cand_res.json()
    assert len(candidates) > 0

    # 4. Get Profiles
    prof_res = client.get(f"/api/v1/investigations/{inv_id}/profiles")
    assert prof_res.status_code == 200
    profiles = prof_res.json()
    assert len(profiles) > 0

    # 5. Get Evidence
    ev_res = client.get(f"/api/v1/investigations/{inv_id}/evidence")
    assert ev_res.status_code == 200
    evidence = ev_res.json()
    assert len(evidence) > 0

    # 6. Get Timeline
    time_res = client.get(f"/api/v1/investigations/{inv_id}/timeline")
    assert time_res.status_code == 200
    timeline = time_res.json()
    assert len(timeline) > 0

    # 7. Get Graph
    graph_res = client.get(f"/api/v1/investigations/{inv_id}/graph")
    assert graph_res.status_code == 200
    graph = graph_res.json()
    assert len(graph["nodes"]) > 0

    # 8. Get Report
    rep_res = client.get(f"/api/v1/investigations/{inv_id}/report")
    assert rep_res.status_code == 200
    report = rep_res.json()
    assert report["top_candidate"] is not None
    assert "Jordan Lee" in report["summary_explanation"]
