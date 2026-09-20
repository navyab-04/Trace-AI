import httpx
from typing import List, Dict, Any
from app.connectors.base import BaseSourceConnector
from app.core.config import settings

class TwitterConnector(BaseSourceConnector):
    """
    Twitter (X) Source Connector with live X API v2 and Serper site discovery.
    Works seamlessly with Name, Username, or both.
    """

    @property
    def platform_name(self) -> str:
        return "Twitter (X)"

    def search_candidates(
        self,
        name: str = None,
        username: str = None,
        org: str = None,
        context: str = None
    ) -> List[Dict[str, Any]]:
        results = []
        bearer_token = settings.twitter_bearer_token
        serper_key = settings.search_api_key

        target_handle = username.strip() if username else None
        target_name = name.strip() if name else None

        handles_to_check = set()
        if target_handle:
            handles_to_check.add(target_handle)

        # 1. Use Serper API site:x.com query to discover Twitter handle from Name
        if serper_key and target_name:
            try:
                s_headers = {"X-API-KEY": serper_key, "Content-Type": "application/json"}
                with httpx.Client(timeout=5.0) as client:
                    sr = client.post(
                        "https://google.serper.dev/search",
                        headers=s_headers,
                        json={"q": f"site:x.com \"{target_name}\""}
                    )
                    if sr.status_code == 200:
                        for item in sr.json().get("organic", []):
                            link = item.get("link", "")
                            title = item.get("title", "")
                            snippet = item.get("snippet", "")
                            if "x.com/" in link or "twitter.com/" in link:
                                handle_part = link.replace("https://x.com/", "").replace("https://twitter.com/", "").split("/")[0].split("?")[0]
                                if handle_part and handle_part not in ["search", "explore", "home", "i", "privacy", "tos"]:
                                    clean_title = title.split("(")[0].split("on X")[0].split("on Twitter")[0].strip()
                                    profile_url = f"https://x.com/{handle_part}"

                                    results.append({
                                        "platform": "Twitter (X)",
                                        "username": handle_part,
                                        "display_name": clean_title or target_name,
                                        "profile_url": profile_url,
                                        "bio": snippet or f"X Profile for {clean_title}",
                                        "organization": org or "X Platform",
                                        "events": [
                                            {
                                                "event_type": "Publication",
                                                "title": f"X Profile (@{handle_part})",
                                                "organization": "Twitter (X)",
                                                "date_str": "2024",
                                                "source_url": profile_url
                                            }
                                        ],
                                        "evidence": [
                                            {
                                                "source_url": profile_url,
                                                "source_type": "Serper Google X Index",
                                                "claim": f"Discovered live X profile '@{handle_part}' for '{clean_title}'.",
                                                "evidence_text": snippet,
                                                "is_conflict": False,
                                                "confidence": 0.91
                                            }
                                        ]
                                    })
                                    handles_to_check.add(handle_part)
            except Exception:
                pass

        # 2. Query Twitter API v2 if bearer token present
        if bearer_token:
            headers = {"Authorization": f"Bearer {bearer_token}"}
            with httpx.Client(timeout=6.0) as client:
                for handle in list(handles_to_check)[:2]:
                    try:
                        url = f"https://api.twitter.com/2/users/by/username/{handle}?user.fields=description,created_at,location,public_metrics"
                        resp = client.get(url, headers=headers)
                        if resp.status_code == 200:
                            user_data = resp.json().get("data", {})
                            if user_data:
                                c_handle = user_data.get("username", handle)
                                disp_name = user_data.get("name") or c_handle
                                bio = user_data.get("description") or f"Public Twitter Account (@{c_handle})"
                                location = user_data.get("location") or ""
                                metrics = user_data.get("public_metrics", {})
                                followers = metrics.get("followers_count", 0)
                                profile_url = f"https://x.com/{c_handle}"
                                created_year = (user_data.get("created_at") or "2024")[:4]

                                results.append({
                                    "platform": "Twitter (X)",
                                    "username": c_handle,
                                    "display_name": disp_name,
                                    "profile_url": profile_url,
                                    "bio": f"{bio} {f'| {location}' if location else ''}".strip(),
                                    "organization": org or "X Platform",
                                    "events": [
                                        {
                                            "event_type": "Publication",
                                            "title": f"Account Created on X (@{c_handle})",
                                            "organization": "Twitter (X)",
                                            "date_str": created_year,
                                            "source_url": profile_url
                                        }
                                    ],
                                    "evidence": [
                                        {
                                            "source_url": profile_url,
                                            "source_type": "Twitter API v2",
                                            "claim": f"Verified X handle '@{c_handle}' retrieved live via X API v2.",
                                            "evidence_text": f"Bio: '{bio}'. Followers: {followers}. Location: '{location}'.",
                                            "is_conflict": False,
                                            "confidence": 0.95
                                        }
                                    ]
                                })
                    except Exception:
                        continue

        return results
