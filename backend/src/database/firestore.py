
from firebase_admin import firestore
import os
from typing import Tuple, Optional, Dict, Any, List
from datetime import datetime
import math

from backend.src.database.models import Campaign

class Collections:
  Campaigns: str = "campaigns"


class FirestoreClient:
  def __init__(self):
    self.client = firestore.client()

  def create_campaign(self, campaign: Campaign) -> Tuple[bool, Optional[str]]:
    try:
      self.client.collection(Collections.Campaigns).add(document_data=_add_timestamps(campaign))
      return True, None
    except Exception as e:
      return False, str(e)
    
  def get_campaigns(self, owner: str) -> Tuple[List[Dict[str, Any]], Optional[str]]:
    try:
      docs = self.client.collection(Collections.Campaigns).where("owner", '==', owner).stream()
      return [doc.to_dict() for doc in docs], None
    except Exception as e:
      None, str(e)


def _add_timestamps(data: Dict[str, Any], is_update: bool=False) -> Dict[str, Any]:
  now = math.ceil(datetime.now().timestamp())
  if not is_update:
    data['createdAt'] = {'seconds': now}
  data['updatedAt'] = {'seconds': now}

  return data
