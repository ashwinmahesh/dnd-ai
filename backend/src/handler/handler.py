from flask import Flask, jsonify, request, Blueprint
from backend.src.handler.openai_handler import OpenAIHandler
from backend.src.core.openai import OpenAILibrary

class Server:
  def __init__(
      self,
      openAILibrary: OpenAILibrary,
      port: int = 6875
    ):
    self.app = Flask(__name__)
    self.router = Blueprint('api_v1', __name__, url_prefix="/api/v1")
    self.openai_library = openAILibrary
    self.port = port

    self._register_routes()

  
  def _register_routes(self):
    openaiHandler = OpenAIHandler(self.app, self.router, self.openai_library)
    openaiHandler.register_routes()

    @self.app.get("/")
    def healthy():
      return 'Healthy'

    self.app.register_blueprint(self.router)

  
  def run(self):
    self.app.run(port=self.port, host="0.0.0.0")
