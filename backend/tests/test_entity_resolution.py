from app.ml.similarity import string_similarity, username_similarity, text_cosine_similarity
from app.ml.candidate_ranker import ranker

def test_string_similarity():
    assert string_similarity("John Doe", "John Doe") == 1.0
    assert string_similarity("John Doe", "John D.") > 0.6
    assert string_similarity("John Doe", "Alice Smith") < 0.3

def test_username_similarity():
    assert username_similarity("johndoe", "johndoe") == 1.0
    assert username_similarity("johndoe", "johndoe123") == 0.85
    assert username_similarity("johndoe", "alice99") < 0.4

def test_candidate_ranking():
    conf, classification, supporting, conflicting = ranker.score_candidate(
        input_name="Alex Rivera",
        input_username="arivera",
        input_org="TraceTech",
        input_context="Senior Software Engineer working on security AI",
        candidate_name="Alex Rivera",
        candidate_username="arivera",
        candidate_org="TraceTech",
        candidate_bio="Staff Engineer at TraceTech specializing in security and machine learning.",
        sources_count=2
    )

    assert conf >= 0.85
    assert classification in ["Very Strong Match", "Strong Match"]
    assert len(supporting) >= 2
