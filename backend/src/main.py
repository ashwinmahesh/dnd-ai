import openai
from typing import Dict, List

client = openai.OpenAI()

SYSTEM_PROMPT = "You are a dungeon master's assistant. The user is coming to you in their time of need to get answers during a live session. Keep answers short and concise. The game we are playing is Dungeons and Dragons 5th edition in the Tomb of Annihilation campaign setting. The party is in the dangerous jungles of Chult."

def get_random_names(descriptor: str) -> List[str]:
  try:
    completion = client.chat.completions.create(
      model = "gpt-3.5-turbo",
      messages=[
      {
        "role": "system",
        "content": SYSTEM_PROMPT
      },
      {
        'role': 'user',
        "content": f"I need a list of 20 random {descriptor} NPC first & last names. Return them in a comma separated list and nothing else. Don't number them",
      }
    ])

    try:
      results = completion.choices[0].message.content.split(",")
      return results
    except Exception as e:
      raise Exception("Unable to properly parse OpenAI response")
  except openai.OpenAIError as e:
    raise Exception(f"OpenAI Error: {e}")

def get_random_encounters(party_level: int, scenario: str, num_encounters: int = 10) -> List[str]:
  try:
    completion = client.chat.completions.create(
      model = "gpt-3.5-turbo",
      messages=[
      {
        "role": "system",
        "content": SYSTEM_PROMPT
      },
      {
        'role': 'user',
        "content": f"I need a list of {num_encounters} random encounters for a party of level {party_level}. The encounters should take place in a {scenario}. Return them in a new-line separated list with the format of 'Encounter Description - {'{}'}, Reason for Encounter - {'{}'} . Don't number them",
      }
    ])

    try:
      results = completion.choices[0].message.content.split(",")
      return results
    except Exception as e:
      raise Exception("Unable to properly parse OpenAI response")
  except openai.OpenAIError as e:
    raise Exception(f"OpenAI Error: {e}")


def main():
  encounters = get_random_encounters(party_level=6, scenario='jungle')
  print(encounters)
    # names = get_random_names('Tavern Owner')
    # print(names)

if __name__ == "__main__":
  main()