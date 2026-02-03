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

export interface BattleState {
  pokemon1: PokemonBasic | null;
  pokemon2: PokemonBasic | null;
  currentTurn: 1 | 2;
  pokemon1Hp: number;
  pokemon2Hp: number;
  battleLog: string[];
  winner: PokemonBasic | null;
  isFinished: boolean;
}

export interface QuizState {
  currentPokemon: PokemonBasic | null;
  options: string[];
  score: number;
  totalQuestions: number;
  isRevealed: boolean;
  isCorrect: boolean | null;
}
