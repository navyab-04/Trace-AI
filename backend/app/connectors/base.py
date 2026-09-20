from abc import ABC, abstractmethod
from typing import List, Dict, Any

class BaseSourceConnector(ABC):
    @property
    @abstractmethod
    def platform_name(self) -> str:
        pass

    @abstractmethod
    def search_candidates(
        self,
        name: str = None,
        username: str = None,
        org: str = None,
        context: str = None
    ) -> List[Dict[str, Any]]:
        """
        Returns normalized candidate dicts:
        {
          "platform": str,
          "username": str,
          "display_name": str,
          "profile_url": str,
          "bio": str,
          "organization": str,
          "events": List[Dict],
          "evidence": List[Dict],
        }
        """
        pass
