from flask import Flask, jsonify, request, Blueprint
from backend.src.core.openai import OpenAILibrary

class OpenAIHandler:
  def __init__(self, app: Flask, router: Blueprint, openAILibrary: OpenAILibrary):
    self.app = app
    self.router = router
    self.openAILibrary = openAILibrary

  def register_routes(self):
    @self.router.get('/names') # add query param
    def get_names():
      return jsonify(self.openAILibrary.get_random_names())
    
    @self.router.get('/encounters')
    def get_encounters():
      return jsonify(self.openAILibrary.get_random_encounters(6, ''))