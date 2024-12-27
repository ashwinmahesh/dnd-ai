import openai
from typing import Dict, List
from backend.src.database.firestore import FirestoreClient

class OpenAILibrary:
  def __init__(self, firestoreClient: FirestoreClient):
    self.client = openai.OpenAI()
    self.SYSTEM_PROMPT = "You are a dungeon master's assistant. The user is \
      coming to you in their time of need to get answers during a live session. \
      Keep answers short and concise. The game we are playing is Dungeons and \
      Dragons 5th edition in the Tomb of Annihilation campaign setting. \
      The party is in the dangerous jungles of Chult."
    self.firestore_client = firestoreClient
    
  # todo(ashwin) - Also add a quick description of everyone
  def get_random_names(self, descriptor: str,
                       current_campaign_id: str = None, userUID: str = None) -> List[str]:

    if current_campaign_id is not None and userUID is not None:
      try:
        campaign = self.firestore_client.get_campaign(current_campaign_id, userUID)
        if campaign:
          # todo - add to context
          pass
      except Exception as e:
        # ignore error, continue with inference without extra context
        print(str(e))
    
    try:
      completion = self.client.chat.completions.create(
        model = "gpt-3.5-turbo",
        messages=[
        {
          "role": "system",
          "content": self.SYSTEM_PROMPT
        },
        {
          'role': 'user',
          "content": f"I need a list of 20 random {descriptor} NPC first and last names. Return them in a comma separated list and nothing else. DO NOT NUMBER THEM OR SEPARATE THEM IN ANY WAY EXCEPT A COMMA. DO NOT RETURN ANYTHING IN THE MESSAGE EXCEPT THE NAMES",
        }
      ])

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

    if current_campaign_id is not None and userUID is not None:
      try:
        campaign = self.firestore_client.get_campaign(current_campaign_id, userUID)
        if campaign:
          # todo - add to context
          pass
      except Exception as e:
        # ignore error, continue with inference without extra context
        print(str(e))

    try:
      completion = self.client.chat.completions.create(
        model = "gpt-3.5-turbo",
        messages=[
        {
          "role": "system",
          "content": self.SYSTEM_PROMPT
        },
        {
          'role': 'user',
          "content": f"I need a list of {num_encounters} random encounters for a party of level {party_level}. The encounters should take place be about {scenario}. Return them in a new-line separated list with the format of '{'{ENCOUNTER DESCRIPTION}'} - {'{REASON FOR ENCOUNTER}'}'. Don't number them or return anything else in the output except the encounters in my desired format. If it is a combat encounter, include the number and types of enemies. In reason for encounter, provide context as to why the encounter might be happening. The context should be 2 sentences",
        }
      ])

      try:
        print(completion.choices[0].message.content)
        results = completion.choices[0].message.content.split("\n")
        for i in range(len(results)):
          if results[i].startswith("- "):
            results[i] = results[i][2:]

        output = []
        for entry in results:
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