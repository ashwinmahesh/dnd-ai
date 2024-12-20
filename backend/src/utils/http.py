from typing import Any, Dict

def make_response(data: Any = None, error: str = None) -> Dict[str, Any]:
  resp: Dict[str, Any] = {}
  if data is not None:
    resp['data'] = data

  if error is not None:
    resp['error'] = error
    print(f"[ERROR] {error}")

  return resp