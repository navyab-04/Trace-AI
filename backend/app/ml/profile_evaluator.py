from typing import Dict, Any, List
from app.ml.similarity import string_similarity, text_cosine_similarity

class ProfileEvaluator:
    """
    TraceID AI Profile Evaluation Engine.
    Evaluates discovered public profiles and candidate records across:
    1. Completeness Score (fill rate & metadata richness)
    2. Authenticity & Reliability Score (platform trust & DigiLocker verification)
    3. Discrepancy Risk (conflict with target investigation context)
    4. Actionable Intelligence Recommendations
    """

    PLATFORM_TRUST_SCORES = {
        "DigiLocker Verified Identity": 0.98,
        "GitHub": 0.90,
        "LinkedIn": 0.88,
        "Twitter": 0.75,
        "Instagram": 0.70,
        "YouTube": 0.75,
        "PublicWeb": 0.65,
        "SearchAPI": 0.60
    }

    def evaluate_profile(
        self,
        profile_data: Dict[str, Any],
        target_context: Dict[str, Any]
    ) -> Dict[str, Any]:
        platform = profile_data.get("platform", "Web")
        username = profile_data.get("username", "")
        display_name = profile_data.get("display_name", "")
        bio = profile_data.get("bio", "")
        profile_url = profile_data.get("profile_url", "")
        org = profile_data.get("organization", "")

        target_name = target_context.get("name", "")
        target_org = target_context.get("org", "")
        target_bio = target_context.get("context", "")

        # 1. Completeness Score
        filled_fields = 0
        total_fields = 5
        if display_name: filled_fields += 1
        if username: filled_fields += 1
        if bio: filled_fields += 1
        if profile_url: filled_fields += 1
        if org: filled_fields += 1
        completeness_score = round(filled_fields / total_fields, 2)

        # 2. Authenticity / Reliability Score
        base_trust = self.PLATFORM_TRUST_SCORES.get(platform, 0.70)
        is_digilocker = "DigiLocker" in platform
        if is_digilocker:
            authenticity_score = 0.98
        else:
            name_sim = string_similarity(target_name, display_name) if target_name else 0.5
            authenticity_score = round(min(0.99, max(0.20, base_trust * 0.6 + name_sim * 0.4)), 2)

        # 3. Discrepancy Risk & Conflicts
        discrepancies = []
        if target_org and org and string_similarity(target_org, org) < 0.3:
            discrepancies.append(f"Organization mismatch: Target specifies '{target_org}', but profile lists '{org}'.")
        if target_name and display_name and string_similarity(target_name, display_name) < 0.4:
            discrepancies.append(f"Name variance: Target specifies '{target_name}', profile uses '{display_name}'.")

        discrepancy_score = round(min(1.0, len(discrepancies) * 0.35), 2)

        # 4. Actionable Recommendations
        recommendations = []
        if is_digilocker:
            recommendations.append("Official DigiLocker identity verified. High-grade anchor for correlation.")
        if completeness_score < 0.6:
            recommendations.append(f"Profile (@{username}) has missing bio/metadata. Search secondary sources.")
        if discrepancies:
            recommendations.append("Resolve organization/name discrepancies before confirming identity link.")
        if not recommendations:
            recommendations.append("Profile presents consistent identity signals across public endpoints.")

        return {
            "platform": platform,
            "username": username,
            "display_name": display_name,
            "completeness_score": completeness_score,
            "authenticity_score": authenticity_score,
            "discrepancy_score": discrepancy_score,
            "is_digilocker_verified": is_digilocker,
            "discrepancies": discrepancies,
            "recommendations": recommendations
        }

profile_evaluator = ProfileEvaluator()
