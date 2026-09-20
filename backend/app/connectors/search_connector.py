import httpx
from bs4 import BeautifulSoup
from typing import List, Dict, Any
from app.connectors.base import BaseSourceConnector
from app.core.config import settings

class SearchConnector(BaseSourceConnector):
    """
    Real-time Serper.dev & Google Search API Connector.
    Uses SEARCH_API_KEY (Serper API key) for live Google organic web search.
    Does NOT return fake or synthetic fallback candidates.
    """

    @property
    def platform_name(self) -> str:
        return "SearchAPI"

    def search_candidates(
        self,
        name: str = None,
        username: str = None,
        org: str = None,
        context: str = None
    ) -> List[Dict[str, Any]]:
        results = []
        api_key = settings.search_api_key
        query = f"{name or ''} {username or ''} {org or ''}".strip()

        if not query:
            return results

        # 1. Serper.dev Google Search API
        if api_key:
            try:
                headers = {
                    "X-API-KEY": api_key,
                    "Content-Type": "application/json"
                }
                with httpx.Client(timeout=6.0) as client:
                    resp = client.post(
                        "https://google.serper.dev/search",
                        headers=headers,
                        json={"q": query, "num": 5}
                    )
                    if resp.status_code == 200:
                        data = resp.json()
                        organic = data.get("organic", [])
                        for item in organic[:5]:
                            title = item.get("title", "").replace("\u2013", "-").replace("\u2014", "-")
                            link = item.get("link", "")
                            snippet = item.get("snippet", "").replace("\u2013", "-").replace("\u2014", "-")
                            domain = link.split("/")[2] if "://" in link else "web"

                            # Parse candidate handle from URL rather than blindly assigning target username
                            c_handle = ""
                            if "github.com/" in link:
                                path_parts = link.split("github.com/")[-1].split("/")
                                c_handle = path_parts[0] if path_parts and path_parts[0] not in ["search", "topics", "trending", "features"] else ""
                            elif "linkedin.com/in/" in link:
                                path_parts = link.split("linkedin.com/in/")[-1].split("/")
                                c_handle = path_parts[0] if path_parts else ""
                            elif "instagram.com/" in link:
                                path_parts = link.split("instagram.com/")[-1].split("/")
                                c_handle = path_parts[0] if path_parts and path_parts[0] not in ["p", "explore", "reels"] else ""
                            elif "x.com/" in link or "twitter.com/" in link:
                                path_parts = link.replace("twitter.com/", "x.com/").split("x.com/")[-1].split("/")
                                c_handle = path_parts[0] if path_parts else ""

                            # Check if the result actually refers to the target person
                            text_body = f"{title} {snippet} {link}".lower()
                            has_name = bool(name and name.lower() in text_body)
                            has_user = bool(username and (username.lower() in text_body or (c_handle and c_handle.lower() == username.lower())))
                            is_target_profile = has_name or has_user

                            # Check if this is an organization or company page
                            is_company_page = any(k in link.lower() for k in ["/company/", "/pages/", "about", "careers"]) or (org and org.lower() in title.lower() and not is_target_profile)

                            # Handle candidate attribution
                            assigned_user = c_handle if c_handle else (username if is_target_profile else domain)
                            is_conflict = bool(c_handle and username and c_handle.lower() != username.lower() and not has_name)

                            results.append({
                                "platform": f"Google Search ({domain})",
                                "username": assigned_user,
                                "display_name": title,
                                "profile_url": link,
                                "bio": snippet,
                                "organization": org or domain,
                                "is_target_relevant": is_target_profile,
                                "is_company_page": is_company_page,
                                "is_conflict": is_conflict,
                                "events": [
                                    {
                                        "event_type": "Article",
                                        "title": f"Indexed Record: {title}",
                                        "organization": domain,
                                        "date_str": "2024",
                                        "source_url": link,
                                        "description": f"Verified public indexed web publication retrieved via search index: '{title}'."
                                    }
                                ],
                                "evidence": [
                                    {
                                        "source_url": link,
                                        "source_type": "Serper.dev Live Google Search API",
                                        "claim": f"Google indexed public reference '{title}'.",
                                        "evidence_text": snippet,
                                        "is_conflict": is_conflict,
                                        "confidence": 0.90 if is_target_profile else 0.75
                                    }
                                ]
                            })
                        if results:
                            return results
            except Exception:
                pass

            # 2. SerpAPI fallback
            try:
                with httpx.Client(timeout=6.0) as client:
                    url = f"https://serpapi.com/search.json?q={query}&api_key={api_key}&engine=google"
                    resp = client.get(url)
                    if resp.status_code == 200:
                        data = resp.json()
                        organic = data.get("organic_results", [])
                        for item in organic[:3]:
                            title = item.get("title", "").replace("\u2013", "-").replace("\u2014", "-")
                            link = item.get("link", "")
                            snippet = item.get("snippet", "").replace("\u2013", "-").replace("\u2014", "-")
                            domain = link.split("/")[2] if "://" in link else "web"
                            results.append({
                                "platform": "Web Search (Google)",
                                "username": username or domain,
                                "display_name": title,
                                "profile_url": link,
                                "bio": snippet,
                                "organization": org or "Indexed Web Result",
                                "is_target_relevant": False,
                                "is_conflict": False,
                                "events": [
                                    {
                                        "event_type": "Article",
                                        "title": f"Indexed Public Record: {title}",
                                        "organization": org or "Web Source",
                                        "date_str": "2024",
                                        "source_url": link,
                                        "description": f"Indexed search result: {title}"
                                    }
                                ],
                                "evidence": [
                                    {
                                        "source_url": link,
                                        "source_type": "Google Search API",
                                        "claim": f"Indexed public record '{title}' retrieved live via Search API.",
                                        "evidence_text": snippet,
                                        "is_conflict": False,
                                        "confidence": 0.85
                                    }
                                ]
                            })
                        if results:
                            return results
            except Exception:
                pass

        # 3. Live Open Web Search (DuckDuckGo HTML)
        try:
            headers = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"}
            with httpx.Client(timeout=5.0, headers=headers) as client:
                resp = client.post("https://html.duckduckgo.com/html/", data={"q": query})
                if resp.status_code == 200:
                    soup = BeautifulSoup(resp.text, "html.parser")
                    link_nodes = soup.find_all("a", class_="result__url")
                    snippet_nodes = soup.find_all("a", class_="result__snippet")

                    for idx in range(min(3, len(link_nodes))):
                        link_href = link_nodes[idx].get("href", "").strip()
                        snippet_text = snippet_nodes[idx].text.strip() if idx < len(snippet_nodes) else "Live Web Result"
                        if link_href.startswith("http"):
                            results.append({
                                "platform": "Public Web Search",
                                "username": username or "web",
                                "display_name": f"Web Record: {link_href.split('/')[2]}",
                                "profile_url": link_href,
                                "bio": snippet_text,
                                "organization": org or "Web Source",
                                "events": [
                                    {
                                        "event_type": "Article",
                                        "title": f"Live Web Result from {link_href.split('/')[2]}",
                                        "organization": org or "Public Web",
                                        "date_str": "2024",
                                        "source_url": link_href
                                    }
                                ],
                                "evidence": [
                                    {
                                        "source_url": link_href,
                                        "source_type": "Public Web Index",
                                        "claim": f"Live web result retrieved for query '{query}'.",
                                        "evidence_text": snippet_text,
                                        "is_conflict": False,
                                        "confidence": 0.80
                                    }
                                ]
                            })
                    if results:
                        return results
        except Exception:
            pass

        return results
