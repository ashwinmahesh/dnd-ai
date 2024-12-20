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
      desciption = request.args.get("description", type=str)
      return jsonify(self.openAILibrary.get_random_names(descriptor=desciption))
    
    @self.router.get('/encounters')
    def get_encounters():
      party_level = request.args.get("party_level", type=int)
      scenario = request.args.get('scenario', type=str)
      num_encounters = request.args.get('num', 10, type=int)

      return jsonify(self.openAILibrary.get_random_encounters(party_level=party_level, scenario=scenario, num_encounters=num_encounters))