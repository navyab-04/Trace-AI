from typing import Dict, Any, List

class DigitalExposureRadar:
    """
    TraceID AI Threat & Digital Footprint Exposure Radar.
    Analyzes public exposure level, unlinked account risks,
    exposed PII vectors, and impersonation probability.
    """

    def analyze_exposure(
        self,
        target_name: str,
        profiles_count: int,
        evidence_count: int,
        discrepancies_count: int,
        has_digilocker: bool = False
    ) -> Dict[str, Any]:
        
        # Exposure Score Calculation (0 - 100)
        surface_score = min(100, profiles_count * 18 + evidence_count * 5)
        
        if surface_score >= 70:
            exposure_level = "High Exposure"
            risk_badge = "HIGH"
        elif surface_score >= 35:
            exposure_level = "Moderate Exposure"
            risk_badge = "MODERATE"
        else:
            exposure_level = "Low Exposure"
            risk_badge = "LOW"

        vulnerabilities = []
        if profiles_count >= 4:
            vulnerabilities.append("Wide public footprint across multiple social & technical platforms.")
        if discrepancies_count > 0:
            vulnerabilities.append(f"{discrepancies_count} identity discrepancies detected across profiles (Impersonation / Ghost Profile Risk).")
        if not has_digilocker:
            vulnerabilities.append("Unverified digital identity anchor. Consent-based DigiLocker verification recommended.")
        else:
            vulnerabilities.append("DigiLocker verified anchor present - protected against identity spoofing.")

        mitigations = [
            "Enable multi-factor authentication across discovered public handles.",
            "Cross-link official verified profiles to prevent handle squatting.",
            "Monitor public search indexes for unauthorized profile duplication."
        ]

        return {
            "target_name": target_name or "Subject",
            "surface_score": surface_score,
            "exposure_level": exposure_level,
            "risk_badge": risk_badge,
            "profiles_discovered": profiles_count,
            "evidence_claims_count": evidence_count,
            "has_digilocker_anchor": has_digilocker,
            "vulnerability_vectors": vulnerabilities,
            "recommended_mitigations": mitigations
        }

exposure_radar = DigitalExposureRadar()
