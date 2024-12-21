from flask import Flask, jsonify, request, Blueprint
from backend.src.core.openai import OpenAILibrary
from backend.src.utils.http import make_response

class OpenAIHandler:
  def __init__(self, app: Flask, router: Blueprint, openAILibrary: OpenAILibrary):
    self.app = app
    self.router = router
    self.openAILibrary = openAILibrary

  def register_routes(self):
    @self.router.get('/names') # add query param
    def get_names():
      desciption = request.args.get("description", '', type=str)

      try:
        names = self.openAILibrary.get_random_names(descriptor=desciption)
        return jsonify(make_response(data=names)), 200
      except Exception as e:
        return jsonify(make_response(error=e)), 500
    
    @self.router.get('/encounters')
    def get_encounters():
      party_level = request.args.get("party_level", type=int)
      scenario = request.args.get('scenario', type=str)
      num_encounters = request.args.get('num_encounters', 10, type=int)

      try:
        random_encounters = self.openAILibrary.get_random_encounters(party_level=party_level, scenario=scenario, num_encounters=num_encounters)
        return jsonify(make_response(data=random_encounters)), 200
      except Exception as e:
        print("Catching error")
        return jsonify(make_response(data=None, error=e)), 500