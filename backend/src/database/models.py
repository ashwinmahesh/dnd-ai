from typing import TypedDict, List, Dict, Optional

class Campaign(TypedDict):
  name: str
  owner: str
  overview: str
  major_events: List[str]
  members: Dict[str,str]
  createdAt: Dict[str, int]
  updated_at: Dict[str, int]
