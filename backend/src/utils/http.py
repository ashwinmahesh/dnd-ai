from typing import Any, Dict
from functools import wraps
from flask import request, jsonify
import os

expected_auth_token = os.getenv("API_TOKEN", "2n7x9p4k6m8v3b1q5w7t9h4j6d8s3f5")

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

    if not auth_header:
      return jsonify(make_response(None, "Missing Authorization header")), 401
    
    if auth_header != f'Bearer {expected_auth_token}':
      print(f"Got: {auth_header}, Expected: {expected_auth_token}")
      return jsonify(make_response(None, "Invalid authorization")), 401
    
    return f(*args, **kwargs)
  
  return decorated_fn
