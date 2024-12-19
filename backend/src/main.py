import openai
from typing import Dict

client = openai.OpenAI()

try:
  completion = client.chat.completions.create(
  model = "gpt-3.5-turbo",
  messages=[
  {
    "role": "system",
    "content": "You are a dungeon master's assistant. The user is coming to you in their time of need to get answers during a live session. Keep answers short and concise. The game we are playing is Dungeons and Dragons 5th edition in the Tomb of Annihilation campaign setting"
  },
  {
    'role': 'user',
    "content": "I need a list of 20 random NPC names",
  }
])

  print(completion.choices[0].message)

except openai.OpenAIError as e:
  print(f"OpenAI Error: {e}")