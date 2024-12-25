from backend.src.core.openai import OpenAILibrary
from backend.src.handler.handler import Server

def main():
  oai = OpenAILibrary()
  server = Server(openAILibrary=oai, port=6875)
  server.run()
  # encounters = oai.get_random_encounters(party_level=6, scenario='jungle')
  # print(encounters)
  
if __name__ == "__main__":
  main()