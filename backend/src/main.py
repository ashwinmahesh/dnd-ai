from typing import Dict, List
from flask import Flask, jsonify, request

from backend.src.core.openai import OpenAILibrary

def main():
  oai = OpenAILibrary()
  encounters = oai.get_random_encounters(party_level=6, scenario='jungle')
  print(encounters)
  
if __name__ == "__main__":
  main()