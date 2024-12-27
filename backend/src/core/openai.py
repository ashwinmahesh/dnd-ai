from typing import Dict, List
import json
import logging

import openai

from backend.src.database.firestore import FirestoreClient, Campaign


monster_schema = {
  "$schema": "http://json-schema.org/draft-07/schema#",
  "title": "DnD Monster Statblock",
  "type": "object",
  "properties": {
    "name": {
      "type": "string",
      "description": "The name of the monster."
    },
    "size": {
      "type": "string",
      "description": "The size category of the monster (e.g., Small, Medium, Large)."
    },
    "type": {
      "type": "string",
      "description": "The type of the monster (e.g., Undead, Beast)."
    },
    "alignment": {
      "type": "string",
      "description": "The monster's alignment (e.g., Neutral Evil)."
    },
    "armor_class": {
      "type": "integer",
      "description": "The monster's armor class."
    },
    "hit_points": {
      "type": "integer",
      "description": "The monster's total hit points."
    },
    "hit_dice": {
      "type": "string",
      "description": "The monster's hit dice formula."
    },
    "speed": {
      "type": "object",
      "description": "The monster's movement speeds.",
      "additionalProperties": {
        "type": "integer",
        "description": "Speed in feet for a specific movement type."
      }
    },
    "abilities": {
      "type": "object",
      "description": "The monster's ability scores.",
      "properties": {
        "strength": { "type": "integer" },
        "dexterity": { "type": "integer" },
        "constitution": { "type": "integer" },
        "intelligence": { "type": "integer" },
        "wisdom": { "type": "integer" },
        "charisma": { "type": "integer" }
      },
      "required": ["strength", "dexterity", "constitution", "intelligence", "wisdom", "charisma"]
    },
    "saving_throws": {
      "type": "object",
      "description": "The monster's saving throw modifiers.",
      "additionalProperties": {
        "type": "integer",
        "description": "Modifier for a specific saving throw."
      }
    },
    "skills": {
      "type": "object",
      "description": "The monster's skill modifiers.",
      "additionalProperties": {
        "type": "integer",
        "description": "Modifier for a specific skill."
      }
    },
    "damage_resistances": {
      "type": "array",
      "description": "Damage types the monster resists.",
      "items": { "type": "string" }
    },
    "damage_immunities": {
      "type": "array",
      "description": "Damage types the monster is immune to.",
      "items": { "type": "string" }
    },
    "condition_immunities": {
      "type": "array",
      "description": "Conditions the monster is immune to.",
      "items": { "type": "string" }
    },
    "senses": {
      "type": "object",
      "description": "The monster's senses and passive Perception.",
      "properties": {
        "darkvision": { "type": "integer", "description": "Darkvision range in feet." },
        "passive_perception": { "type": "integer", "description": "Passive Perception score." }
      }
    },
    "languages": {
      "type": "array",
      "description": "Languages the monster can speak.",
      "items": { "type": "string" }
    },
    "traits": {
      "type": "array",
      "description": "Special traits or features of the monster.",
      "items": {
        "type": "object",
        "properties": {
          "name": { "type": "string", "description": "The name of the trait." },
          "description": { "type": "string", "description": "A detailed description of the trait." }
        },
        "required": ["name", "description"]
      }
    },
    "actions": {
      "type": "array",
      "description": "Actions the monster can take on its turn.",
      "items": {
        "type": "object",
        "properties": {
          "name": { "type": "string", "description": "The name of the action." },
          "type": { "type": "string", "description": "The type of attack (e.g., Melee Weapon Attack, Ranged Spell Attack)." },
          "attack_bonus": { "type": "integer", "description": "The attack bonus for the action." },
          "reach": { "type": "integer", "description": "Reach of the attack in feet." },
          "range": { "type": "integer", "description": "Range of the attack in feet." },
          "target": { "type": "string", "description": "The target of the action." },
          "damage": { "type": "string", "description": "The damage formula for the action." },
          "damage_type": { "type": "string", "description": "The type of damage dealt." },
          "recharge": { "type": "string", "description": "The recharge condition for the action." },
          "additional_effects": { "type": "string", "description": "Any additional effects of the action." }
        }
      }
    },
    "bonus_actions": {
      "type": "array",
      "description": "Bonus actions the monster can take.",
      "items": {
        "type": "object",
        "properties": {
          "name": { "type": "string", "description": "The name of the bonus action." },
          "description": { "type": "string", "description": "A detailed description of the bonus action." },
          "recharge": { "type": "string", "description": "The recharge condition for the bonus action." }
        }
      }
    },
    "reactions": {
      "type": "array",
      "description": "Reactions the monster can use.",
      "items": {
        "type": "object",
        "properties": {
          "name": { "type": "string", "description": "The name of the reaction." },
          "description": { "type": "string", "description": "A detailed description of the reaction." }
        }
      }
    },
    "legendary_actions": {
      "type": "array",
      "description": "Legendary actions the monster can use.",
      "items": {
        "type": "object",
        "properties": {
          "name": { "type": "string", "description": "The name of the legendary action." },
          "cost": { "type": "integer", "description": "The cost in legendary action points." },
          "description": { "type": "string", "description": "A detailed description of the legendary action." }
        }
      }
    }
  },
  "required": [
    "name",
    "size",
    "type",
    "alignment",
    "armor_class",
    "hit_points",
    "hit_dice",
    "speed",
    "abilities",
    "senses"
  ]
}

class OpenAILibrary:
  def __init__(self, firestoreClient: FirestoreClient):
    self.client = openai.OpenAI()
    self.SYSTEM_PROMPT = '''
    1. You are a dungeon master's assistant.
    2. The user is coming to you in their time of need to get answers during a live session.
    3. Keep answers short and concise. 
    4. The game we are playing is Dungeons and Dragons 5th edition in the Tomb of Annihilation campaign setting.
    5. The party is in the dangerous jungles of Chult. 
    6. If extra information about the campaign is provided by the user, use this to fine tune your results.
    '''
    self.firestore_client = firestoreClient
    
  # todo(ashwin) - Also add a quick description of everyone. More of an NPC generator
  def get_random_names(self, descriptor: str,
                       current_campaign_id: str = None, userUID: str = None) -> List[str]:
    messages = [{ "role": "system","content": self.SYSTEM_PROMPT}]
    if current_campaign_id is not None and userUID is not None:
      try:
        campaign = self.firestore_client.get_campaign(current_campaign_id, userUID)
        if campaign:
          messages.append({"role": 'user', "content": format_campaign_into_context_str(campaign)})
          
      except Exception as e:
        # ignore error, continue with inference without extra context
        print(str(e))
    
    primary_message = f"I need a list of 20 random {descriptor} NPC first and last names. Return them in a comma separated list and nothing else. DO NOT NUMBER THEM OR SEPARATE THEM IN ANY WAY EXCEPT A COMMA. DO NOT RETURN ANYTHING IN THE MESSAGE EXCEPT THE NAMES"
    messages.append({'role': 'user', "content": primary_message})

    try:
      completion = self.client.chat.completions.create(
        model = "gpt-3.5-turbo",
        messages=messages
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

    messages = [{ "role": "system","content": self.SYSTEM_PROMPT}]
    if current_campaign_id is not None and userUID is not None:
      try:
        campaign = self.firestore_client.get_campaign(current_campaign_id, userUID)
        if campaign:
          messages.append({"role": 'user', "content": format_campaign_into_context_str(campaign)})
          
      except Exception as e:
        # ignore error, continue with inference without extra context
        print(str(e))

    primary_message = f"I need a list of {num_encounters} random encounters for a party of level {party_level}. The encounters should take place be about {scenario}. Return them in a new-line separated list with the format of '{'{ENCOUNTER DESCRIPTION}'} - {'{REASON FOR ENCOUNTER}'}'. Don't number them or return anything else in the output except the encounters in my desired format. If it is a combat encounter, include the number and types of enemies. In reason for encounter, provide context as to why the encounter might be happening. The context should be 2 sentences"
    messages.append({'role': 'user', "content": primary_message})

    try:
      completion = self.client.chat.completions.create(
        model = "gpt-3.5-turbo",
        messages=messages
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

  def generate_monster(self, monster_description: str, challenge_rating: int, current_campaign_id: str = None, user_uid: str = None):
    messages = self._init_messages(current_campaign_id, user_uid)

    primary_message = f'''
    1. Generate me a monster statblock with a bias for action economy.
    2. That means giving everything actions, reactions, bonus actions, and sometimes cool abilities
    so the monster isnt just a bag of hit points
    3. A description for the monster I want is: {monster_description}
    3. The monster should be of Challenge Rating {challenge_rating}
    4. Return the output in the following schema:

    ${json.dumps(monster_schema)}
    '''
    messages.append({'role': 'user', "content": primary_message})

    logging.info("Generating monster...")

    try:
      completion = self.client.chat.completions.create(
        model = "gpt-3.5-turbo",
        messages=messages
      )

      try:
        print(completion.choices[0].message.content)
        return completion.choices[0].message.content
      except Exception as e:
        raise Exception("Unable to properly parse OpenAI response")
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