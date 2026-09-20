from typing import Dict, Any, List, Tuple, Optional
from app.ml.similarity import string_similarity, username_similarity, text_cosine_similarity

class CandidateRanker:
    """
    TraceID AI Multi-Signal Candidate Ranking & Entity Resolution Engine.
    Formula:
    Identity Confidence =
        W_name * Name_Sim +
        W_user * Username_Sim +
        W_org  * Org_Sim +
        W_bio  * Bio_Sim +
        W_source * Cross_Source_Agreement +
        Biometric_Vector_Boost
    """

    W_NAME = 0.35
    W_USER = 0.25
    W_ORG = 0.20
    W_BIO = 0.20

    def score_candidate(
        self,
        input_name: str,
        input_username: str,
        input_org: str,
        input_context: str,
        candidate_name: str,
        candidate_username: str,
        candidate_org: str,
        candidate_bio: str,
        sources_count: int = 1,
        biometric_similarity: Optional[float] = None,
        face_hash_match: Optional[bool] = None
    ) -> Tuple[float, str, List[str], List[str]]:
        supporting = []
        conflicting = []

        # 1. Name Similarity
        name_sim = string_similarity(input_name, candidate_name) if input_name and candidate_name else 0.0
        if name_sim >= 0.85:
            supporting.append(f"Strong name similarity ({int(name_sim*100)}%) with '{candidate_name}'")
        elif name_sim > 0.0 and name_sim < 0.4:
            conflicting.append(f"Discrepancy in display name ('{input_name}' vs '{candidate_name}')")

        # 2. Username Similarity
        user_sim = username_similarity(input_username, candidate_username) if input_username and candidate_username else 0.0
        if user_sim >= 0.85:
            supporting.append(f"Username match signal ({int(user_sim*100)}%) with '@{candidate_username}'")
        elif input_username and candidate_username and user_sim < 0.3:
            conflicting.append(f"Different primary username (@{input_username} vs @{candidate_username})")

        # 3. Organization Match
        org_sim = string_similarity(input_org, candidate_org) if input_org and candidate_org else 0.0
        if org_sim >= 0.8:
            supporting.append(f"Organization alignment ({candidate_org})")
        elif input_org and candidate_org and org_sim < 0.3:
            conflicting.append(f"Organization mismatch ({input_org} vs {candidate_org})")

        # 4. Context / Bio Similarity
        bio_sim = text_cosine_similarity(input_context, candidate_bio) if input_context and candidate_bio else 0.0
        if bio_sim >= 0.3:
            supporting.append(f"Contextual bio similarity ({int(bio_sim*100)}%)")

        # 5. Biometric Facial Matching Signal
        biometric_boost = 0.0
        if biometric_similarity is not None:
            if biometric_similarity >= 0.70 or face_hash_match is True:
                pct = int(biometric_similarity * 100) if biometric_similarity else 95
                supporting.append(f"Biometric Facial Vector & Hash Match ({pct}% similarity)")
                biometric_boost = 0.10
            elif biometric_similarity < 0.40 and face_hash_match is False:
                pct = int(biometric_similarity * 100)
                conflicting.append(f"Biometric Facial Discrepancy (Face vector similarity only {pct}%)")
                biometric_boost = -0.20

        # Source agreement boost
        source_boost = min(0.1, (sources_count - 1) * 0.05) if sources_count > 1 else 0.0
        if sources_count > 1:
            supporting.append(f"Corroborated across {sources_count} independent public sources")

        # Weighted calculation
        active_weights = 0.0
        weighted_score = 0.0

        if input_name:
            weighted_score += self.W_NAME * name_sim
            active_weights += self.W_NAME
        if input_username:
            weighted_score += self.W_USER * user_sim
            active_weights += self.W_USER
        if input_org:
            weighted_score += self.W_ORG * org_sim
            active_weights += self.W_ORG
        if input_context:
            weighted_score += self.W_BIO * bio_sim
            active_weights += self.W_BIO

        base_confidence = (weighted_score / active_weights) if active_weights > 0 else 0.5
        final_confidence = min(0.99, max(0.05, base_confidence + source_boost + biometric_boost))

        # Classification
        if final_confidence >= 0.85:
            classification = "Very Strong Match"
        elif final_confidence >= 0.70:
            classification = "Strong Match"
        elif final_confidence >= 0.45:
            classification = "Possible Match"
        else:
            classification = "Uncertain"

        return round(final_confidence, 2), classification, supporting, conflicting

ranker = CandidateRanker()
