monster_statblock_schema = {
  "$schema": "http://json-schema.org/draft-07/schema#",
  "title": "DnD Monster Statblock",
  "type": "object",
  "properties": {
    "name": {
      "type": "string",
      "description": "The name of the monster."
    },
    "description": {
      "type": "string",
      "description": "A physical description of the monster"
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
    },
    "spells": {
      "type": "array",
      "description": "Spells the monster can cast, organized by spell level.",
      "items": {
        "type": "object",
        "properties": {
          "level": { "type": "integer", "description": "The spell level (0 for cantrips)." },
          "spells": {
            "type": "array",
            "description": "A list of spells at this level.",
            "items": { "type": "string", "description": "The name of the spell." }
          }
        },
        "required": ["level", "spells"]
      }
    }
  },
  "required": [
    "name",
    "description",
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