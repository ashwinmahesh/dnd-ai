from typing import TypedDict, List, Dict, Optional

class Campaign(TypedDict):
  name: str
  owner: str
  overview: str
  major_events: Optional[List[str]]
  members: Optional[Dict[str,str]]