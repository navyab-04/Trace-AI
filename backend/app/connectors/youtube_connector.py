import httpx
from typing import List, Dict, Any
from app.connectors.base import BaseSourceConnector
from app.core.config import settings

class YouTubeConnector(BaseSourceConnector):
    """
    YouTube Source Connector with live Data API v3 & Serper site discovery.
    Works seamlessly with Name, Username, or both.
    """

    @property
    def platform_name(self) -> str:
        return "YouTube"

    def search_candidates(
        self,
        name: str = None,
        username: str = None,
        org: str = None,
        context: str = None
    ) -> List[Dict[str, Any]]:
        results = []
        api_key = settings.youtube_api_key
        serper_key = settings.search_api_key
        query = name or username

        if not query:
            return results

        # 1. Query YouTube Data API v3 if key available
        if api_key:
            try:
                with httpx.Client(timeout=6.0) as client:
                    url = f"https://www.googleapis.com/youtube/v3/search?part=snippet&type=channel&q={query}&key={api_key}&maxResults=2"
                    resp = client.get(url)
                    if resp.status_code == 200:
                        data = resp.json()
                        for item in data.get("items", []):
                            snippet = item.get("snippet", {})
                            ch_title = snippet.get("title", "")
                            ch_id = snippet.get("channelId", "")
                            ch_desc = snippet.get("description", "")
                            profile_url = f"https://www.youtube.com/channel/{ch_id}"

                            results.append({
                                "platform": "YouTube",
                                "username": snippet.get("channelTitle", query),
                                "display_name": ch_title,
                                "profile_url": profile_url,
                                "bio": ch_desc or f"Public YouTube Channel: {ch_title}",
                                "organization": org or "YouTube",
                                "events": [
                                    {
                                        "event_type": "Publication",
                                        "title": f"YouTube Channel: {ch_title}",
                                        "organization": "YouTube",
                                        "date_str": (snippet.get("publishedAt") or "2024")[:4],
                                        "source_url": profile_url
                                    }
                                ],
                                "evidence": [
                                    {
                                        "source_url": profile_url,
                                        "source_type": "YouTube Data API v3",
                                        "claim": f"Verified live YouTube Channel '{ch_title}' retrieved via YouTube API.",
                                        "evidence_text": ch_desc,
                                        "is_conflict": False,
                                        "confidence": 0.92
                                    }
                                ]
                            })
                        if results:
                            return results
            except Exception:
                pass

        # 2. Serper Google YouTube Index lookup
        if serper_key:
            try:
                s_headers = {"X-API-KEY": serper_key, "Content-Type": "application/json"}
                with httpx.Client(timeout=5.0) as client:
                    sr = client.post(
                        "https://google.serper.dev/search",
                        headers=s_headers,
                        json={"q": f"site:youtube.com/channel OR site:youtube.com/@ \"{query}\""}
                    )
                    if sr.status_code == 200:
                        for item in sr.json().get("organic", []):
                            link = item.get("link", "")
                            title = item.get("title", "")
                            snippet = item.get("snippet", "")
                            clean_title = title.split("- YouTube")[0].strip()

                            results.append({
                                "platform": "YouTube",
                                "username": clean_title,
                                "display_name": clean_title,
                                "profile_url": link,
                                "bio": snippet or f"YouTube channel for {clean_title}",
                                "organization": org or "YouTube",
                                "events": [
                                    {
                                        "event_type": "Publication",
                                        "title": f"YouTube Channel: {clean_title}",
                                        "organization": "YouTube",
                                        "date_str": "2024",
                                        "source_url": link
                                    }
                                ],
                                "evidence": [
                                    {
                                        "source_url": link,
                                        "source_type": "Serper Google YouTube Index",
                                        "claim": f"Discovered live YouTube channel '{clean_title}'.",
                                        "evidence_text": snippet,
                                        "is_conflict": False,
                                        "confidence": 0.90
                                    }
                                ]
                            })
                        if results:
                            return results
            except Exception:
                pass

        return results
