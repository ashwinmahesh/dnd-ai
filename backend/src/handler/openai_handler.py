from flask import Flask, jsonify, request, Blueprint
from typing import List

from backend.src.core.openai import OpenAILibrary
from backend.src.utils.http import make_response, protected_route, FirebaseUser, RateLimiter

class OpenAIHandler:
  def __init__(self, app: Flask, router: Blueprint, openAILibrary: OpenAILibrary, rate_limiter: RateLimiter):
    self.app = app
    self.router = router
    self.openAILibrary = openAILibrary
    self.rate_limiter = rate_limiter

  def register_routes(self):
    @self.router.get('/names')
    @protected_route
    @self.rate_limiter.limiter.limit(self.rate_limiter.default_global_limit, per_method=True, exempt_when=self.rate_limiter.exemption_func)
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
        print("USING THIS EXCEPTION")
        return jsonify(make_response(error=e)), 500
    
    @self.router.get('/encounters')
    @protected_route
    @self.rate_limiter.limiter.limit(self.rate_limiter.default_global_limit, per_method=True, exempt_when=self.rate_limiter.exemption_func)
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
    @self.rate_limiter.limiter.limit(self.rate_limiter.default_global_limit, per_method=True, exempt_when=self.rate_limiter.exemption_func)
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
      
    
    @self.router.get('/loot_table')
    @protected_route
    @self.rate_limiter.limiter.limit(self.rate_limiter.default_global_limit, per_method=True, exempt_when=self.rate_limiter.exemption_func)
    def generate_loot_table():
      user: FirebaseUser = request.user
      current_campaign_id = request.headers.get('CurrentCampaignID')

      loot_cr_min = request.args.get('loot_cr_min', type=int)
      loot_cr_max = request.args.get('loot_cr_max', default=loot_cr_min + 2, type=int)
      loot_val_min = request.args.get('loot_val_min', type=int)
      loot_val_max = request.args.get('loot_val_max', default=loot_val_min * 5, type=int)
      magic_item_rarities = request.args.get('magic_item_rarities', default=['Uncommon'], type=List[str])
      context = request.args.get('context', default='', type=str)
      include_magic_items = request.args.get('include_magic_items', default=False, type=bool)

      try:
        loot_table = self.openAILibrary.generate_loot_table(
          loot_cr_min=loot_cr_min,
          loot_cr_max=loot_cr_max,
          loot_val_min=loot_val_min,
          loot_val_max=loot_val_max,
          magic_item_rarities=magic_item_rarities,
          context=context,
          include_magic_items=include_magic_items,
          current_campaign_id=current_campaign_id,
          user_uid = user.get('uid')
        )
        return jsonify(make_response(data=loot_table)), 200
      except Exception as e:
        return jsonify(make_response(data=None, error=str(e))), 500

    @self.router.get('/rumors')
    @protected_route
    @self.rate_limiter.limiter.limit(self.rate_limiter.default_global_limit, per_method=True, exempt_when=self.rate_limiter.exemption_func)
    def generate_rumors():
      user: FirebaseUser = request.user
      current_campaign_id = request.headers.get('CurrentCampaignID')

      try:
        rumors = self.openAILibrary.generate_rumors(
          party_level=6,
          location='A tavern in a military fortress, in a zombie infested jungle',
          quest_giver="A bar-keep who is connected with the commoners",
          num_rumors=10,
          current_campaign_id=current_campaign_id,
          user_uid = user.get('uid')
        )
        return jsonify(make_response(data=rumors)), 200
      except Exception as e:
        return jsonify(make_response(data=None, error=str(e))), 500