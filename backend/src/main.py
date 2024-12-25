from backend.src.core.openai import OpenAILibrary
from backend.src.handler.handler import Server

def main():
  oai = OpenAILibrary()
  server = Server(openAILibrary=oai, port=6875)
  server.run()
  
if __name__ == "__main__":
  main()