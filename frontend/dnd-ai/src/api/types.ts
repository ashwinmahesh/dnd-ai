export type ApiResponse<T = null> = {
  data: T;
  error: string | null;
};

export const ActionStatus = {
  NOT_STARTED: 'NOT_STARTED',
  IN_PROGRESS: 'IN_PROGRESS',
  REJECTED: 'REJECTED',
  FULFILLED: 'FULFILLED',
} as const;

const actionValues = Object.values(ActionStatus);

export type TActionState = {
  status: (typeof actionValues)[number];
  error?: string;
};

export type TMonsterStatblock = {
  name: string;
  size: string;
  type: string;
  alignment: string;
  armor_class: number;
  hit_points: number;
  hit_dice: string;
  speed: {
    [movementType: string]: number; // e.g., "walk": 30, "climb": 30
  };
  abilities: {
    strength: number;
    dexterity: number;
    constitution: number;
    intelligence: number;
    wisdom: number;
    charisma: number;
  };
  saving_throws?: {
    [savingThrow: string]: number; // e.g., "dexterity": 7
  };
  skills?: {
    [skill: string]: number; // e.g., "stealth": 7
  };
  damage_resistances?: string[]; // e.g., ["necrotic", "cold"]
  damage_immunities?: string[]; // e.g., ["poison"]
  condition_immunities?: string[]; // e.g., ["charmed", "frightened"]
  senses: {
    darkvision?: number; // in feet
    passive_perception: number;
  };
  languages?: string[]; // e.g., ["Common", "Abyssal"]
  traits?: {
    name: string;
    description: string;
  }[];
  actions?: {
    name: string;
    type?: string; // e.g., "Melee Weapon Attack"
    attack_bonus?: number;
    reach?: number;
    range?: number;
    target?: string;
    damage?: string; // e.g., "2d6+4"
    damage_type?: string; // e.g., "slashing"
    recharge?: string; // e.g., "5-6"
    additional_effects?: string;
  }[];
  bonus_actions?: {
    name: string;
    description: string;
    recharge?: string; // e.g., "4-6"
  }[];
  reactions?: {
    name: string;
    description: string;
  }[];
  legendary_actions?: {
    name: string;
    cost?: number;
    description: string;
  }[];
  spells?: {
    level: number; // Spell level, 0 for cantrips
    spells: string[]; // List of spell names
  }[];
};
