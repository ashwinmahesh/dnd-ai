import os
from flask import Flask, jsonify, Blueprint

from backend.src.handler.openai_handler import OpenAIHandler
from backend.src.core.openai import OpenAILibrary
from backend.src.utils.http import make_response

class Server:
  def __init__(
      self,
      openAILibrary: OpenAILibrary,
      port: int
    ):
    self.app = Flask("DND AI Assistant")
    self.router = Blueprint('api_v1', __name__, url_prefix="/api/v1")
    self.openai_library = openAILibrary
    self.port = port

    self._register_routes()

  
  def _register_routes(self):
    openaiHandler = OpenAIHandler(self.app, self.router, self.openai_library)
    openaiHandler.register_routes()

    @self.app.get("/")
    def healthy():
      return 'Healthy', 200

    @self.app.errorhandler(404)
    def not_found(e):
      return jsonify(make_response(None, "Page not Found")), 404

    self.app.register_blueprint(self.router)

  
  def run(self):
    debug = os.getenv("DEBUG", False)
    print(f"Starting server on port {self.port}. Debug mode={debug}")
    self.app.run(port=self.port, host="0.0.0.0", debug=debug)

