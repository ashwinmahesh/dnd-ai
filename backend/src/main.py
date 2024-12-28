import os
import logging

from firebase_admin import credentials, initialize_app

from backend.src.core.openai import OpenAILibrary
from backend.src.handler.handler import Server
from backend.src.database.firestore import FirestoreClient

logging.basicConfig(
    level=logging.INFO,
    format='[%(levelname)s] %(asctime)s - %(message)s (%(filename)s Line: %(lineno)d)',
    datefmt='%b %d %I:%M:%S %p'
)


def _get_firestore_creds_path():
  # First try local development path
  current_dir = os.path.dirname(os.path.abspath(__file__))
  local_path = os.path.join(current_dir, "../firebase_creds.json")
  
  # If local path exists, use it
  if os.path.exists(local_path):
      return local_path
      
  # Otherwise, try the build path
  runfiles_path = os.path.join(
      os.path.dirname(os.path.abspath(__file__)),
      "../../runfiles/_main/backend/firebase_creds.json"
  )
  
  if os.path.exists(runfiles_path):
      return runfiles_path
      
  raise FileNotFoundError(f"Could not find firebase_creds.json in either {local_path} or {runfiles_path}")


def main():
  creds = credentials.Certificate(cert=_get_firestore_creds_path())
  firebaseAdmin = initialize_app(creds)

  dbClient = FirestoreClient()

  oai = OpenAILibrary(firestoreClient=dbClient)
  server = Server(openAILibrary=oai, port=int(os.getenv("PORT", 6875)))

  server.run()

if __name__ == "__main__":
  main()