from typing import Any, Dict, TypedDict, Optional
from functools import wraps
from flask import request, jsonify
import os
from firebase_admin import auth

api_token = os.getenv("API_TOKEN", "2n7x9p4k6m8v3b1q5w7t9h4j6d8s3f5")

class FirebaseUser(TypedDict):
    uid: str
    email: Optional[str]

def make_response(data: Any = None, error: str = None) -> Dict[str, Any]:
  resp: Dict[str, Any] = {}
  if data is not None:
    resp['data'] = data

  if error is not None:
    resp['error'] = error
    print(f"[ERROR] {error}")

  return resp


def protected_route(f):
  @wraps(f)
  def decorated_fn(*args, **kwargs):
    auth_header = request.headers.get('Authorization')

    if not auth_header or not auth_header.startswith("Bearer"):
      return jsonify(make_response(None, "Missing Authorization header")), 401
    
    token = auth_header.split('Bearer ')[1]
    if token == api_token:
      return f(*args, **kwargs)
    
    # Verify Firebase
    try:
      decoded_token: FirebaseUser = auth.verify_id_token(token, check_revoked=True)
      request.user = decoded_token
      return f(*args, **kwargs)
    except auth.InvalidIdTokenError:
      return jsonify(make_response(None, "Invalid authorization")), 401
    except Exception as e:
      return jsonify(make_response(None, str(e))), 500
  
  return decorated_fn
