
from firebase_admin import credentials, firestore, initialize_app
import os
from typing import Tuple, Optional, Dict, Any, List
from datetime import datetime

from backend.src.database.models import Campaign


# firebase_certificate_str = os.getenv('FIREBASE_CREDS')
# print(firebase_certificate_str)
# firebase_cert = json.loads(firebase_certificate_str)

class Collections:
  Campaigns: str = "campaigns"


class FirestoreClient:
  def __init__(self):
    creds = credentials.Certificate(cert=_get_firestore_creds_path())
    initialize_app(creds)

    self.client = firestore.client()

    # campaign: Campaign = {'name': 'Test2', 'owner':'mahesh.ashwin1998@gmail.com', 'major_events': [], 'members': {
    #   'john': 'Loves to adventure'
    # }, 'overview': "Tomb of Annihilation"}

    # # ok, err = self.create_campaign(campaign)
    # # if err is not None:
    # #   print('Error:', err)
    # # else:
    # #   print("created campaign")

    # campaigns, err = self.get_campaigns(owner='mahesh.ashwin1998@gmail.com')
    # if err is not None:
    #   print("Failed to get campaigns:", campaigns)
    # else:
    #   print("Campaigns:", campaigns)



  def create_campaign(self, campaign: Campaign) -> Tuple[bool, Optional[str]]:
    doc_id = f'{campaign["owner"]}_{campaign["name"]}'
    try:
      self.client.collection(Collections.Campaigns).add(document_data=_add_timestamps(campaign), document_id=doc_id)
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
  now = datetime.now().isoformat()
  if not is_update:
    data['created_at'] = now
  data['updated_at'] = now

  return data


def _get_firestore_creds_path():
  # First try local development path
  current_dir = os.path.dirname(os.path.abspath(__file__))
  local_path = os.path.join(current_dir, "../../firebase_creds.json")
  
  # If local path exists, use it
  if os.path.exists(local_path):
      return local_path
      
  # Otherwise, try the build path
  runfiles_path = os.path.join(
      os.path.dirname(os.path.abspath(__file__)),
      "../../../runfiles/_main/backend/firebase_creds.json"
  )
  
  if os.path.exists(runfiles_path):
      return runfiles_path
      
  raise FileNotFoundError(f"Could not find firebase_creds.json in either {local_path} or {runfiles_path}")
