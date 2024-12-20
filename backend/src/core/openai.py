import openai
from typing import Dict, List

class OpenAILibrary:
  def __init__(self):
    self.client = openai.OpenAI()
    self.SYSTEM_PROMPT = "You are a dungeon master's assistant. The user is \
      coming to you in their time of need to get answers during a live session. \
      Keep answers short and concise. The game we are playing is Dungeons and \
      Dragons 5th edition in the Tomb of Annihilation campaign setting. \
      The party is in the dangerous jungles of Chult."
    
  def get_random_names(self, descriptor: str) -> List[str]:
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

  def get_random_encounters(self, party_level: int, scenario: str, num_encounters: int = 10) -> List[str]:
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
          "content": f"I need a list of {num_encounters} random encounters for a party of level {party_level}. The encounters should take place in a {scenario}. Return them in a new-line separated list with the format of 'Encounter Description - {'{}'} | Reason for Encounter - {'{}'}' . Don't number them",
        }
      ])

      try:
        print(completion.choices[0].message.content)
        results = completion.choices[0].message.content.split("\n")
        return results
      except Exception as e:
        raise Exception("Unable to properly parse OpenAI response")
    except openai.OpenAIError as e:
      raise Exception(f"OpenAI Error: {e}")
    