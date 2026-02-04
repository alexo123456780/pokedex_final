export interface Pokemon {
  id: number;
  name: string;
  height: number;
  weight: number;
  sprites: {
    front_default: string;
    other: {
      'official-artwork': {
        front_default: string;
      };
    };
  };
  stats: PokemonStat[];
  types: PokemonType[];
}

export interface PokemonStat {
  base_stat: number;
  stat: {
    name: string;
  };
}

export interface PokemonType {
  slot: number;
  type: {
    name: string;
  };
}

export interface PokemonBasic {
  id: number;
  name: string;
  hp: number;
  attack: number;
  defense: number;
  speed: number;
  height: number;
  weight: number;
  image: string;
  types: string[];
}

export interface FavoritePokemon extends PokemonBasic {
  addedAt: number;
}

export interface PokemonMove {
  name: string;
  type: string;
  power: number;
  accuracy: number;
  category: 'physical' | 'special' | 'status';
  effect?: string;
}

export type BattlePhase = 
  | 'idle'
  | 'intro'
  | 'intro-pokemon1'
  | 'intro-pokemon2'
  | 'intro-versus'
  | 'ready'
  | 'selecting'
  | 'attacking'
  | 'damage'
  | 'fainted'
  | 'victory';

export interface BattleAnimation {
  type: 'attack' | 'damage' | 'critical' | 'miss' | 'effective' | 'not-effective' | 'faint';
  target: 1 | 2;
  moveType?: string;
}

export interface BattleState {
  pokemon1: PokemonBasic | null;
  pokemon2: PokemonBasic | null;
  currentTurn: 1 | 2;
  pokemon1Hp: number;
  pokemon2Hp: number;
  pokemon1MaxHp: number;
  pokemon2MaxHp: number;
  pokemon1Moves: PokemonMove[];
  pokemon2Moves: PokemonMove[];
  battleLog: BattleLogEntry[];
  winner: PokemonBasic | null;
  isFinished: boolean;
  phase: BattlePhase;
  currentAnimation: BattleAnimation | null;
  lastDamage: number;
  lastMove: PokemonMove | null;
  effectiveness: number;
  isCritical: boolean;
  turnCount: number;
}

export interface BattleLogEntry {
  message: string;
  type: 'info' | 'attack' | 'damage' | 'critical' | 'effective' | 'not-effective' | 'miss' | 'victory' | 'faint';
  timestamp: number;
}

export interface QuizState {
  currentPokemon: PokemonBasic | null;
  options: string[];
  score: number;
  totalQuestions: number;
  isRevealed: boolean;
  isCorrect: boolean | null;
}
