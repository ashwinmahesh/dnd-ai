from typing import Dict, List, Any
import json
import logging
import re

import openai

from backend.src.database.firestore import FirestoreClient, Campaign
from backend.src.core.monster_statblock_schema import monster_statblock_schema

class OpenAILibrary:
  def __init__(self, firestoreClient: FirestoreClient):
    self.client = openai.OpenAI()
    self.SYSTEM_PROMPT = '''
    1. You are a dungeon master's assistant. The game we are playing is Dungeons and Dragons 5th edition
    2. The user is coming to you in their time of need to get answers during a live session.
    3. Keep answers short and concise. 
    6. If extra information about the campaign is provided by the user, use this to fine tune your results.
    '''
    self.firestore_client = firestoreClient
    
  # todo(ashwin) - Also add a quick description of everyone. More of an NPC generator
  def get_random_names(self, descriptor: str,
                       current_campaign_id: str = None, userUID: str = None) -> List[str]:
    messages = self._init_messages(current_campaign_id, userUID)
    
    primary_message = f"I need a list of 20 random {descriptor} NPC first and last names. Return them in a comma separated list and nothing else. DO NOT NUMBER THEM OR SEPARATE THEM IN ANY WAY EXCEPT A COMMA. DO NOT RETURN ANYTHING IN THE MESSAGE EXCEPT THE NAMES"
    messages.append({'role': 'user', "content": primary_message})

    try:
      completion = self.client.chat.completions.create(
        model = "gpt-3.5-turbo",
        messages=messages,
        user=userUID
      )

      try:
        print(completion.choices[0].message.content)
        results = completion.choices[0].message.content.split(",")
        return results
      except Exception as e:
        raise Exception("Unable to properly parse OpenAI response")
    except openai.OpenAIError as e:
      raise Exception(f"OpenAI Error: {e}")

  def get_random_encounters(self, party_level: int, scenario: str,
                             num_encounters: int = 10, current_campaign_id: str = None,
                               userUID: str = None) -> List[Dict[str, str]]:
    messages = self._init_messages(current_campaign_id, userUID)

    primary_message = f"I need a list of {num_encounters} diverse random encounters for a party of level {party_level}. The encounters should take place be about {scenario}. Return them in a new-line separated list with the format of '{'{ENCOUNTER DESCRIPTION}'} - {'{REASON FOR ENCOUNTER}'}'. Don't number them or return anything else in the output except the encounters in my desired format. If it is a combat encounter, include the number and types of enemies. In reason for encounter, provide context as to why the encounter might be happening. The context should be 3 sentences"
    messages.append({'role': 'user', "content": primary_message})

    try:
      completion = self.client.chat.completions.create(
        model = "gpt-3.5-turbo",
        messages=messages,
        user=userUID
      )

      try:
        print(completion.choices[0].message.content)
        results = completion.choices[0].message.content.split("\n")
        for i in range(len(results)):
          if results[i].startswith("- "):
            results[i] = results[i][2:]

        output = []
        for entry in results:
          if entry.strip():  # Skip empty lines
            encounter, context = entry.split(" - ", 1)
            output.append({'encounter': encounter, 'context': context})
        return output
      except Exception as e:
        raise Exception("Unable to properly parse OpenAI response")
    except openai.OpenAIError as e:
      raise Exception(f"OpenAI Error: {e}")
    
  
  def get_random_quest_hooks(self, party_level: int, location: str, num_hooks: int = 10) -> List[Dict[str, str]]:
    # return details about the quest giver, and the quest they have to give
    pass
    
  def generate_images(self, description: str):
    pass

  def generate_rumors(self, party_level: int, location: str, quest_giver: str, num_rumors: int = 10, current_campaign_id: str = None, user_uid: str = None) -> List[Dict[str, str]]:
    messages = self._init_messages(current_campaign_id, user_uid)

    primary_message = f'''
    1. Generate a D{num_rumors} list of rumors given by an NPC described as {quest_giver} at location {location}.
    2. The list of rumors should be diverse and each have an actionable associated quest hook appropriate for a party of level {party_level} which the players can undertake.
    3. Explain what the expected objective of the quest hook is.
    4. Be specific with the rumor, quest_hook, and quest_objective.
    4. Return example {num_rumors} rumors.
    4. Return the output as a JSON object in the following format

      {{
           "rumors": [
               {{
                   "rumor": "<string>",
                   "quest_hook": "<string>",
                   "quest_objective": <string>
               }}
           ]
       }}

    5. The response must be a valid JSON object.
    '''

    messages.append({"role": "user", "content": primary_message})

    logging.info(f"Generating D{num_rumors} rumor table given by {quest_giver} at {location} for party level {party_level}")

    try:
      completion = self.client.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=messages,
        user=user_uid,
        response_format={"type": "json_object"}
      )
      try:
        rumors = json.loads(completion.choices[0].message.content)
        logging.debug(f"Rumors: {rumors}")
        print(f"Rumors: {rumors}")
        rumors: List[Dict[str, str]] = rumors['rumors']
        #json.loads(statblock[statblock.find("{"):statblock.rfind("}") + 1])# Remove extraneous characters
        return rumors
      except Exception as e:
        # print("Rumors: ", rumors)
        raise Exception("Unable to properly parse OpenAI response: ", str(e))
    except openai.OpenAIError as e:
      raise Exception(f"OpenAI Error: {e}")


  def generate_monster(self, monster_description: str, challenge_rating: int, use_legendary_actions: bool = False, current_campaign_id: str = None, user_uid: str = None):
    messages = self._init_messages(current_campaign_id, user_uid)

    primary_message = f'''
    1. Generate me a monster statblock with a bias for action economy.
    2. That means ALL monsters should ALWAYS have actions, reactions, bonus actions, and sometimes other cool abilities so the monster isnt just a bag of hit points.
    3. {'Use' if use_legendary_actions else 'Do not use'} legendary actions
    4. All monsters should have 1-2 reaction abilities
    5. ALL monsters should have multi-attack. If the monster has multi-attack, make sure to list how many attacks the monster can make
    6. A description for the monster I want is: {monster_description}
    7. The monster should be of Challenge Rating {challenge_rating}
    8. If the character is a spellcaster, ensure it has spells of all levels up to the maximum level it can cast. Not all monsters need to have spells
    9. Ensure between all of the different types of actions (action, bonus action, reaction, legendary action), some of them do more than just deal damage
    10. Return the output in the following schema:

    ${json.dumps(monster_statblock_schema)}    
    '''
    messages.append({'role': 'user', "content": primary_message})

    logging.info(f"Generating monster ({monster_description}) of CR {challenge_rating}...")

    try:
      completion = self.client.chat.completions.create(
        model = "gpt-3.5-turbo",
        messages=messages,
        user = user_uid,
      )

      try:
        statblock = remove_trailing_commas(completion.choices[0].message.content)
        logging.debug(f"Statblock: {statblock}")
        statblock_obj: Dict[str, Any] = json.loads(statblock[statblock.find("{"):statblock.rfind("}") + 1])# Remove extraneous characters
        return statblock_obj
      except Exception as e:
        print("Statblock: ", statblock)
        raise Exception("Unable to properly parse OpenAI response: ", str(e))
    except openai.OpenAIError as e:
      raise Exception(f"OpenAI Error: {e}")
    
  
  def generate_loot_table(
    self,
    loot_cr_min: int,
    loot_cr_max:int,
    loot_val_min: int,
    loot_val_max: int,
    magic_item_rarities: List[str],
    include_magic_items: bool = False,
    context: str = None,
    current_campaign_id: str = None,
    user_uid: str = None
  ):
    messages = self._init_messages(current_campaign_id, user_uid)
    primary_message = f'''
    1. Generate me a D10 loot table retrieved off monsters of CR {loot_cr_min} - {loot_cr_max}.
    2. Include a diverse mix of gold, potions, spell scrolls {", and magic items" if include_magic_items else ''} of rarities: {", ".join(magic_item_rarities)}.
    3. The value of each entry should range between {loot_val_min}gp and {loot_val_max}gp.
    4. Not every entry needs a spell scroll or a potion, sometimes just gold is enough.
    5. Return the output as a list of strings, example: ["100gp, Spell Scroll (Darkness)", "75gp, Potion of Greater Healing, Spell Scroll (Thunderwave)", "50gp, Cloak of Displacement"...].
    6. DO NOT RETURN ANYTHING EXCEPT THE LIST OF STRINGS, which should contain exactly 10 elements.
    {f'7. A description of where the loot is found - {context}' if context else ''}
    {f'8. Do not include magic items' if not include_magic_items else ''}
'''
    messages.append({'role': 'user', "content": primary_message})

    logging.info(f"Generating loot table of CR {loot_cr_min}-{loot_cr_max} with value {loot_val_min}-{loot_val_max} using magic item rarities: [{', '.join(magic_item_rarities)}]...")
    try:
      completion = self.client.chat.completions.create(
        model = "gpt-3.5-turbo",
        messages=messages,
        user=user_uid
      )

      try:
        resp = completion.choices[0].message.content
        logging.info(f"Loot table: {resp}")
        loot_table: List[str] = json.loads(resp)
        return loot_table
      except Exception as e:
        raise Exception("Unable to properly parse OpenAI response: ", str(e))
    except openai.OpenAIError as e:
      raise Exception(f"OpenAI Error: {e}")


  def _init_messages(self, current_campaign_id: str = None, user_uid: str = None):
    messages = [{ "role": "system","content": self.SYSTEM_PROMPT}]
    if current_campaign_id is not None and user_uid is not None:
      try:
        campaign = self.firestore_client.get_campaign(current_campaign_id, user_uid)
        if campaign:
          messages.append({"role": 'user', "content": format_campaign_into_context_str(campaign)})
          
      except Exception as e:
        # ignore error, continue with inference without extra context
        print(str(e))
    
    return messages


def format_campaign_into_context_str(campaign: Campaign) -> str:
  output = f'''Here is some information about the current campaign. Use this information to
  fine tune your results.

  1. Campaign Overview - {campaign.get('overview')}
  2. Campaign Members & Backstory / Interests - {campaign.get('members')}
  3. Campaign Major Events (Events which have already ocurred and shaped the narrative) - {campaign.get('major_events')}

'''

  return output

def remove_trailing_commas(json_string: str) -> str:
    # Remove trailing commas after objects or arrays
    cleaned = re.sub(r',(\s*[}\]])', r'\1', json_string)
    return cleaned