# from google.cloud.firestore import Client, f
from firebase_admin import credentials, firestore, initialize_app
import os
import json

firebase_certificate_str = os.getenv('FIREBASE_CREDS')
print(firebase_certificate_str)
firebase_cert = json.loads(firebase_certificate_str)

class FirestoreClient:
  def __init__(self):
    creds = credentials.Certificate(firebase_cert)
    initialize_app(creds)

    self.client = firestore.client()
