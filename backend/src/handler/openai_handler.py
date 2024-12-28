from flask import Flask, jsonify, request, Blueprint
from backend.src.core.openai import OpenAILibrary
from backend.src.utils.http import make_response, protected_route, FirebaseUser

class OpenAIHandler:
  def __init__(self, app: Flask, router: Blueprint, openAILibrary: OpenAILibrary):
    self.app = app
    self.router = router
    self.openAILibrary = openAILibrary

  def register_routes(self):
    @self.router.get('/names')
    @protected_route
    def get_names():
      user: FirebaseUser = request.user
      current_campaign_id = request.headers.get('CurrentCampaignID')

      desciption = request.args.get("description", '', type=str)

      try:
        names = self.openAILibrary.get_random_names(
          descriptor=desciption,
          current_campaign_id=current_campaign_id,
          userUID=user.get('uid')
        )
        return jsonify(make_response(data=names)), 200
      except Exception as e:
        return jsonify(make_response(error=e)), 500
    
    @self.router.get('/encounters')
    @protected_route
    def get_encounters():
      user: FirebaseUser = request.user
      current_campaign_id = request.headers.get('CurrentCampaignID')

      party_level = request.args.get("party_level", type=int)
      scenario = request.args.get('scenario', type=str)
      num_encounters = request.args.get('num_encounters', 10, type=int)

      try:
        random_encounters = self.openAILibrary.get_random_encounters(
          party_level=party_level,
          scenario=scenario,
          num_encounters=num_encounters,
          current_campaign_id=current_campaign_id,
          userUID=user.get('uid'),
        )
        return jsonify(make_response(data=random_encounters)), 200
      except Exception as e:
        return jsonify(make_response(data=None, error=e)), 500
      
    @self.router.get('/monster')
    @protected_route
    def generate_monster_stablock():
      user: FirebaseUser = request.user
      current_campaign_id = request.headers.get('CurrentCampaignID')

      monster_description = request.args.get('description', type=str)
      challenge_rating = request.args.get('challenge_rating', type=int)
      use_legendary_actions = request.args.get('use_legendary_actions', default=False, type=bool)

      try:
        monster = self.openAILibrary.generate_monster(
          challenge_rating=challenge_rating,
          monster_description=monster_description,
          use_legendary_actions=use_legendary_actions,
          current_campaign_id=current_campaign_id,
          user_uid=user.get('uid')
        )
        return jsonify(make_response(data=monster)), 200
      except Exception as e:
        return jsonify(make_response(data=None, error=str(e))), 500