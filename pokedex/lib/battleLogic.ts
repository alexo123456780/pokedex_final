import { 
  PokemonBasic, 
  BattleState, 
  PokemonMove, 
  BattleLogEntry, 
  BattlePhase,
  BattleAnimation 
} from '@/types/pokemon';

const TYPE_EFFECTIVENESS: Record<string, Record<string, number>> = {
  normal: { rock: 0.5, ghost: 0, steel: 0.5 },
  fire: { fire: 0.5, water: 0.5, grass: 2, ice: 2, bug: 2, rock: 0.5, dragon: 0.5, steel: 2 },
  water: { fire: 2, water: 0.5, grass: 0.5, ground: 2, rock: 2, dragon: 0.5 },
  electric: { water: 2, electric: 0.5, grass: 0.5, ground: 0, flying: 2, dragon: 0.5 },
  grass: { fire: 0.5, water: 2, grass: 0.5, poison: 0.5, ground: 2, flying: 0.5, bug: 0.5, rock: 2, dragon: 0.5, steel: 0.5 },
  ice: { fire: 0.5, water: 0.5, grass: 2, ice: 0.5, ground: 2, flying: 2, dragon: 2, steel: 0.5 },
  fighting: { normal: 2, ice: 2, poison: 0.5, flying: 0.5, psychic: 0.5, bug: 0.5, rock: 2, ghost: 0, dark: 2, steel: 2, fairy: 0.5 },
  poison: { grass: 2, poison: 0.5, ground: 0.5, rock: 0.5, ghost: 0.5, steel: 0, fairy: 2 },
  ground: { fire: 2, electric: 2, grass: 0.5, poison: 2, flying: 0, bug: 0.5, rock: 2, steel: 2 },
  flying: { electric: 0.5, grass: 2, fighting: 2, bug: 2, rock: 0.5, steel: 0.5 },
  psychic: { fighting: 2, poison: 2, psychic: 0.5, dark: 0, steel: 0.5 },
  bug: { fire: 0.5, grass: 2, fighting: 0.5, poison: 0.5, flying: 0.5, psychic: 2, ghost: 0.5, dark: 2, steel: 0.5, fairy: 0.5 },
  rock: { fire: 2, ice: 2, fighting: 0.5, ground: 0.5, flying: 2, bug: 2, steel: 0.5 },
  ghost: { normal: 0, psychic: 2, ghost: 2, dark: 0.5 },
  dragon: { dragon: 2, steel: 0.5, fairy: 0 },
  dark: { fighting: 0.5, psychic: 2, ghost: 2, dark: 0.5, fairy: 0.5 },
  steel: { fire: 0.5, water: 0.5, electric: 0.5, ice: 2, rock: 2, steel: 0.5, fairy: 2 },
  fairy: { fire: 0.5, fighting: 2, poison: 0.5, dragon: 2, dark: 2, steel: 0.5 },
};

const MOVES_BY_TYPE: Record<string, PokemonMove[]> = {
  normal: [
    { name: 'Placaje', type: 'normal', power: 40, accuracy: 100, category: 'physical' },
    { name: 'Golpe Cuerpo', type: 'normal', power: 85, accuracy: 100, category: 'physical' },
    { name: 'Híper Rayo', type: 'normal', power: 150, accuracy: 90, category: 'special' },
    { name: 'Velocidad Extrema', type: 'normal', power: 80, accuracy: 100, category: 'physical' },
  ],
  fire: [
    { name: 'Ascuas', type: 'fire', power: 40, accuracy: 100, category: 'special' },
    { name: 'Lanzallamas', type: 'fire', power: 90, accuracy: 100, category: 'special' },
    { name: 'Llamarada', type: 'fire', power: 110, accuracy: 85, category: 'special' },
    { name: 'Anillo Ígneo', type: 'fire', power: 100, accuracy: 100, category: 'special' },
  ],
  water: [
    { name: 'Pistola Agua', type: 'water', power: 40, accuracy: 100, category: 'special' },
    { name: 'Surf', type: 'water', power: 90, accuracy: 100, category: 'special' },
    { name: 'Hidrobomba', type: 'water', power: 110, accuracy: 80, category: 'special' },
    { name: 'Acua Cola', type: 'water', power: 90, accuracy: 90, category: 'physical' },
  ],
  electric: [
    { name: 'Impactrueno', type: 'electric', power: 40, accuracy: 100, category: 'special' },
    { name: 'Rayo', type: 'electric', power: 90, accuracy: 100, category: 'special' },
    { name: 'Trueno', type: 'electric', power: 110, accuracy: 70, category: 'special' },
    { name: 'Voltio Cruel', type: 'electric', power: 120, accuracy: 100, category: 'physical' },
  ],
  grass: [
    { name: 'Látigo Cepa', type: 'grass', power: 45, accuracy: 100, category: 'physical' },
    { name: 'Hoja Afilada', type: 'grass', power: 55, accuracy: 95, category: 'physical' },
    { name: 'Rayo Solar', type: 'grass', power: 120, accuracy: 100, category: 'special' },
    { name: 'Energibola', type: 'grass', power: 90, accuracy: 100, category: 'special' },
  ],
  ice: [
    { name: 'Viento Hielo', type: 'ice', power: 55, accuracy: 95, category: 'special' },
    { name: 'Rayo Hielo', type: 'ice', power: 90, accuracy: 100, category: 'special' },
    { name: 'Ventisca', type: 'ice', power: 110, accuracy: 70, category: 'special' },
    { name: 'Carámbano', type: 'ice', power: 85, accuracy: 90, category: 'physical' },
  ],
  fighting: [
    { name: 'Patada Baja', type: 'fighting', power: 65, accuracy: 100, category: 'physical' },
    { name: 'Puño Dinámico', type: 'fighting', power: 100, accuracy: 50, category: 'physical' },
    { name: 'A Bocajarro', type: 'fighting', power: 120, accuracy: 100, category: 'physical' },
    { name: 'Onda Certera', type: 'fighting', power: 120, accuracy: 70, category: 'special' },
  ],
  poison: [
    { name: 'Picotazo Ven', type: 'poison', power: 50, accuracy: 100, category: 'physical' },
    { name: 'Bomba Lodo', type: 'poison', power: 90, accuracy: 100, category: 'special' },
    { name: 'Lanza Mugre', type: 'poison', power: 120, accuracy: 80, category: 'physical' },
    { name: 'Onda Tóxica', type: 'poison', power: 95, accuracy: 100, category: 'special' },
  ],
  ground: [
    { name: 'Bofetón Lodo', type: 'ground', power: 20, accuracy: 100, category: 'special' },
    { name: 'Terremoto', type: 'ground', power: 100, accuracy: 100, category: 'physical' },
    { name: 'Tierra Viva', type: 'ground', power: 90, accuracy: 100, category: 'special' },
    { name: 'Precipicio', type: 'ground', power: 120, accuracy: 85, category: 'physical' },
  ],
  flying: [
    { name: 'Tornado', type: 'flying', power: 40, accuracy: 100, category: 'special' },
    { name: 'Ataque Aéreo', type: 'flying', power: 75, accuracy: 95, category: 'physical' },
    { name: 'Pájaro Osado', type: 'flying', power: 120, accuracy: 100, category: 'physical' },
    { name: 'Huracán', type: 'flying', power: 110, accuracy: 70, category: 'special' },
  ],
  psychic: [
    { name: 'Confusión', type: 'psychic', power: 50, accuracy: 100, category: 'special' },
    { name: 'Psíquico', type: 'psychic', power: 90, accuracy: 100, category: 'special' },
    { name: 'Premonición', type: 'psychic', power: 120, accuracy: 100, category: 'special' },
    { name: 'Psicocarga', type: 'psychic', power: 80, accuracy: 100, category: 'physical' },
  ],
  bug: [
    { name: 'Chupavidas', type: 'bug', power: 80, accuracy: 100, category: 'physical' },
    { name: 'Zumbido', type: 'bug', power: 90, accuracy: 100, category: 'special' },
    { name: 'Tijera X', type: 'bug', power: 80, accuracy: 100, category: 'physical' },
    { name: 'Megacuerno', type: 'bug', power: 120, accuracy: 85, category: 'physical' },
  ],
  rock: [
    { name: 'Lanzarrocas', type: 'rock', power: 50, accuracy: 90, category: 'physical' },
    { name: 'Avalancha', type: 'rock', power: 75, accuracy: 90, category: 'physical' },
    { name: 'Roca Afilada', type: 'rock', power: 100, accuracy: 80, category: 'physical' },
    { name: 'Joya de Luz', type: 'rock', power: 80, accuracy: 100, category: 'special' },
  ],
  ghost: [
    { name: 'Lengüetazo', type: 'ghost', power: 30, accuracy: 100, category: 'physical' },
    { name: 'Bola Sombra', type: 'ghost', power: 80, accuracy: 100, category: 'special' },
    { name: 'Garra Umbría', type: 'ghost', power: 70, accuracy: 100, category: 'physical' },
    { name: 'Fuego Fatuo', type: 'ghost', power: 100, accuracy: 85, category: 'special' },
  ],
  dragon: [
    { name: 'Furia Dragón', type: 'dragon', power: 60, accuracy: 100, category: 'special' },
    { name: 'Garra Dragón', type: 'dragon', power: 80, accuracy: 100, category: 'physical' },
    { name: 'Cometa Draco', type: 'dragon', power: 130, accuracy: 90, category: 'special' },
    { name: 'Enfado', type: 'dragon', power: 120, accuracy: 100, category: 'physical' },
  ],
  dark: [
    { name: 'Mordisco', type: 'dark', power: 60, accuracy: 100, category: 'physical' },
    { name: 'Pulso Umbrio', type: 'dark', power: 80, accuracy: 100, category: 'special' },
    { name: 'Tajo Umbrío', type: 'dark', power: 70, accuracy: 100, category: 'physical' },
    { name: 'Boca Oscura', type: 'dark', power: 80, accuracy: 100, category: 'special' },
  ],
  steel: [
    { name: 'Garra Metal', type: 'steel', power: 50, accuracy: 95, category: 'physical' },
    { name: 'Cabeza Hierro', type: 'steel', power: 80, accuracy: 100, category: 'physical' },
    { name: 'Foco Resplandor', type: 'steel', power: 80, accuracy: 100, category: 'special' },
    { name: 'Golpe Meteoro', type: 'steel', power: 90, accuracy: 90, category: 'physical' },
  ],
  fairy: [
    { name: 'Viento Feérico', type: 'fairy', power: 40, accuracy: 100, category: 'special' },
    { name: 'Brillo Mágico', type: 'fairy', power: 80, accuracy: 100, category: 'special' },
    { name: 'Fuerza Lunar', type: 'fairy', power: 95, accuracy: 100, category: 'special' },
    { name: 'Carantoña', type: 'fairy', power: 90, accuracy: 90, category: 'physical' },
  ],
};

export function getMovesForPokemon(pokemon: PokemonBasic): PokemonMove[] {
  const moves: PokemonMove[] = [];
  const primaryType = pokemon.types[0] || 'normal';
  const secondaryType = pokemon.types[1];
  
  const primaryMoves = MOVES_BY_TYPE[primaryType] || MOVES_BY_TYPE.normal;
  moves.push(primaryMoves[0], primaryMoves[Math.floor(Math.random() * 3) + 1]);
  
  if (secondaryType && MOVES_BY_TYPE[secondaryType]) {
    const secondaryMoves = MOVES_BY_TYPE[secondaryType];
    moves.push(secondaryMoves[Math.floor(Math.random() * secondaryMoves.length)]);
  } else {
    moves.push(MOVES_BY_TYPE.normal[Math.floor(Math.random() * MOVES_BY_TYPE.normal.length)]);
  }
  
  const allTypes = Object.keys(MOVES_BY_TYPE);
  const randomType = allTypes[Math.floor(Math.random() * allTypes.length)];
  const randomMoves = MOVES_BY_TYPE[randomType];
  moves.push(randomMoves[Math.floor(Math.random() * randomMoves.length)]);
  
  return moves;
}

export function getTypeEffectiveness(attackType: string, defenderTypes: string[]): number {
  let effectiveness = 1;
  
  for (const defType of defenderTypes) {
    const typeChart = TYPE_EFFECTIVENESS[attackType];
    if (typeChart && typeChart[defType] !== undefined) {
      effectiveness *= typeChart[defType];
    }
  }
  
  return effectiveness;
}

function createLogEntry(message: string, type: BattleLogEntry['type']): BattleLogEntry {
  return { message, type, timestamp: Date.now() };
}

export function initBattle(pokemon1: PokemonBasic, pokemon2: PokemonBasic): BattleState {
  const firstTurn = pokemon1.speed >= pokemon2.speed ? 1 : 2;
  
  return {
    pokemon1,
    pokemon2,
    currentTurn: firstTurn as 1 | 2,
    pokemon1Hp: pokemon1.hp,
    pokemon2Hp: pokemon2.hp,
    pokemon1MaxHp: pokemon1.hp,
    pokemon2MaxHp: pokemon2.hp,
    pokemon1Moves: getMovesForPokemon(pokemon1),
    pokemon2Moves: getMovesForPokemon(pokemon2),
    battleLog: [],
    winner: null,
    isFinished: false,
    phase: 'intro',
    currentAnimation: null,
    lastDamage: 0,
    lastMove: null,
    effectiveness: 1,
    isCritical: false,
    turnCount: 0,
  };
}

export function setPhase(state: BattleState, phase: BattlePhase): BattleState {
  return { ...state, phase };
}

export function addLogEntry(state: BattleState, message: string, type: BattleLogEntry['type']): BattleState {
  return {
    ...state,
    battleLog: [...state.battleLog, createLogEntry(message, type)],
  };
}

export function calculateDamage(
  attacker: PokemonBasic, 
  defender: PokemonBasic, 
  move: PokemonMove
): { damage: number; effectiveness: number; isCritical: boolean; missed: boolean } {
  if (Math.random() * 100 > move.accuracy) {
    return { damage: 0, effectiveness: 1, isCritical: false, missed: true };
  }
  
  const effectiveness = getTypeEffectiveness(move.type, defender.types);
  
  const attackStat = move.category === 'physical' ? attacker.attack : attacker.attack * 0.9;
  const defenseStat = move.category === 'physical' ? defender.defense : defender.defense * 0.9;
  
  const level = 50;
  const baseDamage = ((2 * level / 5 + 2) * move.power * (attackStat / defenseStat)) / 50 + 2;
  
  const randomFactor = 0.85 + Math.random() * 0.15;
  const isCritical = Math.random() < 0.0625;
  const criticalMultiplier = isCritical ? 1.5 : 1;
  const stab = attacker.types.includes(move.type) ? 1.5 : 1;
  
  const finalDamage = Math.max(1, Math.floor(
    baseDamage * randomFactor * criticalMultiplier * effectiveness * stab
  ));
  
  return { damage: finalDamage, effectiveness, isCritical, missed: false };
}

export function executeTurn(state: BattleState, moveIndex: number): BattleState {
  if (state.isFinished || !state.pokemon1 || !state.pokemon2) {
    return state;
  }

  const attacker = state.currentTurn === 1 ? state.pokemon1 : state.pokemon2;
  const defender = state.currentTurn === 1 ? state.pokemon2 : state.pokemon1;
  const moves = state.currentTurn === 1 ? state.pokemon1Moves : state.pokemon2Moves;
  const move = moves[moveIndex] || moves[0];
  
  const { damage, effectiveness, isCritical, missed } = calculateDamage(attacker, defender, move);
  
  let newState: BattleState = { ...state, lastMove: move, lastDamage: damage, effectiveness, isCritical };
  
  newState = addLogEntry(newState, `¡${attacker.name.toUpperCase()} usa ${move.name}!`, 'attack');
  
  if (missed) {
    newState = addLogEntry(newState, '¡El ataque falló!', 'miss');
    newState.currentAnimation = { type: 'miss', target: state.currentTurn === 1 ? 2 : 1 };
    return {
      ...newState,
      currentTurn: state.currentTurn === 1 ? 2 : 1,
      phase: 'damage',
      turnCount: state.turnCount + 1,
    };
  }
  
  let newPokemon1Hp = state.pokemon1Hp;
  let newPokemon2Hp = state.pokemon2Hp;
  
  if (state.currentTurn === 1) {
    newPokemon2Hp = Math.max(0, state.pokemon2Hp - damage);
  } else {
    newPokemon1Hp = Math.max(0, state.pokemon1Hp - damage);
  }
  
  if (isCritical) {
    newState = addLogEntry(newState, '¡Golpe crítico!', 'critical');
  }
  
  if (effectiveness > 1) {
    newState = addLogEntry(newState, '¡Es súper efectivo!', 'effective');
  } else if (effectiveness < 1 && effectiveness > 0) {
    newState = addLogEntry(newState, 'No es muy efectivo...', 'not-effective');
  } else if (effectiveness === 0) {
    newState = addLogEntry(newState, '¡No afecta al Pokémon enemigo!', 'not-effective');
  }
  
  const animationType = isCritical ? 'critical' : effectiveness > 1 ? 'effective' : effectiveness < 1 ? 'not-effective' : 'damage';
  newState.currentAnimation = { 
    type: animationType, 
    target: state.currentTurn === 1 ? 2 : 1,
    moveType: move.type 
  };
  
  let winner: PokemonBasic | null = null;
  let isFinished = false;
  let phase: BattlePhase = 'damage';
  
  if (newPokemon1Hp <= 0) {
    winner = state.pokemon2;
    isFinished = true;
    phase = 'fainted';
    newState = addLogEntry(newState, `¡${state.pokemon1.name.toUpperCase()} se ha debilitado!`, 'faint');
    newState = addLogEntry(newState, `¡${state.pokemon2.name.toUpperCase()} gana el combate!`, 'victory');
  } else if (newPokemon2Hp <= 0) {
    winner = state.pokemon1;
    isFinished = true;
    phase = 'fainted';
    newState = addLogEntry(newState, `¡${state.pokemon2.name.toUpperCase()} se ha debilitado!`, 'faint');
    newState = addLogEntry(newState, `¡${state.pokemon1.name.toUpperCase()} gana el combate!`, 'victory');
  }
  
  return {
    ...newState,
    pokemon1Hp: newPokemon1Hp,
    pokemon2Hp: newPokemon2Hp,
    currentTurn: state.currentTurn === 1 ? 2 : 1,
    winner,
    isFinished,
    phase,
    turnCount: state.turnCount + 1,
  };
}

export function executeAITurn(state: BattleState): BattleState {
  const moves = state.currentTurn === 1 ? state.pokemon1Moves : state.pokemon2Moves;
  const defender = state.currentTurn === 1 ? state.pokemon2 : state.pokemon1;
  
  let bestMoveIndex = 0;
  let bestScore = -1;
  
  moves.forEach((move, index) => {
    const effectiveness = getTypeEffectiveness(move.type, defender?.types || []);
    const score = move.power * effectiveness * (move.accuracy / 100);
    if (score > bestScore) {
      bestScore = score;
      bestMoveIndex = index;
    }
  });
  
  if (Math.random() < 0.3) {
    bestMoveIndex = Math.floor(Math.random() * moves.length);
  }
  
  return executeTurn(state, bestMoveIndex);
}

export function getHealthPercentage(currentHp: number, maxHp: number): number {
  return Math.max(0, Math.min(100, (currentHp / maxHp) * 100));
}

export function getHealthBarColor(percentage: number): string {
  if (percentage > 50) return '#4ade80';
  if (percentage > 25) return '#facc15';
  return '#ef4444';
}

export function getTypeColor(type: string): string {
  const colors: Record<string, string> = {
    normal: '#A8A878',
    fire: '#F08030',
    water: '#6890F0',
    electric: '#F8D030',
    grass: '#78C850',
    ice: '#98D8D8',
    fighting: '#C03028',
    poison: '#A040A0',
    ground: '#E0C068',
    flying: '#A890F0',
    psychic: '#F85888',
    bug: '#A8B820',
    rock: '#B8A038',
    ghost: '#705898',
    dragon: '#7038F8',
    dark: '#705848',
    steel: '#B8B8D0',
    fairy: '#EE99AC',
  };
  return colors[type] || '#68A090';
}

export function getMoveEmoji(type: string): string {
  const emojis: Record<string, string> = {
    normal: '⭐',
    fire: '🔥',
    water: '💧',
    electric: '⚡',
    grass: '🌿',
    ice: '❄️',
    fighting: '👊',
    poison: '☠️',
    ground: '🌍',
    flying: '🌪️',
    psychic: '🔮',
    bug: '🐛',
    rock: '🪨',
    ghost: '👻',
    dragon: '🐉',
    dark: '🌑',
    steel: '⚙️',
    fairy: '✨',
  };
  return emojis[type] || '💥';
}
