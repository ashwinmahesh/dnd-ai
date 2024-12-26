
from firebase_admin import credentials, firestore, initialize_app
import os
import json
from typing import Tuple, Optional

from backend.src.database.models import Campaign


# firebase_certificate_str = os.getenv('FIREBASE_CREDS')
# print(firebase_certificate_str)
# firebase_cert = json.loads(firebase_certificate_str)


class FirestoreClient:
  def __init__(self):
    creds = credentials.Certificate(cert=_get_firestore_creds_path())
    initialize_app(creds)

    self.client = firestore.client()

    campaign: Campaign = {'name': 'Test', 'owner':'mahesh.ashwin1998@gmail.com', 'major_events': [], 'members': {
      'john': 'Loves to adventure'
    }, 'overview': "Tomb of Annihilation"}

    # ok, err = self.create_campaign(campaign)
    # if err is not None:
    #   print('Error:', err)
    # else:
    #   print("created campaign")



  def create_campaign(self, campaign: Campaign) -> Tuple[bool, Optional[str]]:
    doc_id = f'{campaign["owner"]}_{campaign["name"]}'
    try:
      self.client.collection('campaigns').add(document_data=campaign, document_id=doc_id)
      return True, None
    except Exception as e:
      return False, str(e)


def _get_firestore_creds_path():
  runfiles_dir = (
          os.environ.get("RUNFILES_DIR") or 
          os.environ.get("RUNFILES") or
          os.environ.get("TEST_SRCDIR")
      )

  workspace = "dnd_ai"
  if runfiles_dir:
    return os.path.join(runfiles_dir, workspace, "firebase_creds.json")
  
  current_dir = os.path.dirname(os.path.abspath(__file__))
  return os.path.join(current_dir, "../../firebase_creds.json")
