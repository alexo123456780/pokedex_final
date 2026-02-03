import { PokemonBasic, BattleState } from '@/types/pokemon';

export function initBattle(pokemon1: PokemonBasic, pokemon2: PokemonBasic): BattleState {
  const firstTurn = pokemon1.speed >= pokemon2.speed ? 1 : 2;
  
  return {
    pokemon1,
    pokemon2,
    currentTurn: firstTurn as 1 | 2,
    pokemon1Hp: pokemon1.hp,
    pokemon2Hp: pokemon2.hp,
    battleLog: [`¡Comienza el combate! ${pokemon1.name.toUpperCase()} vs ${pokemon2.name.toUpperCase()}!`],
    winner: null,
    isFinished: false,
  };
}

export function calculateDamage(attacker: PokemonBasic, defender: PokemonBasic): number {
  const baseDamage = Math.floor((attacker.attack * 0.5) - (defender.defense * 0.25));
  const randomFactor = 0.85 + Math.random() * 0.3;
  const criticalHit = Math.random() < 0.1 ? 1.5 : 1;
  
  const finalDamage = Math.max(1, Math.floor(baseDamage * randomFactor * criticalHit));
  return finalDamage;
}

export function executeTurn(state: BattleState): BattleState {
  if (state.isFinished || !state.pokemon1 || !state.pokemon2) {
    return state;
  }

  const attacker = state.currentTurn === 1 ? state.pokemon1 : state.pokemon2;
  const defender = state.currentTurn === 1 ? state.pokemon2 : state.pokemon1;
  
  const damage = calculateDamage(attacker, defender);
  const isCritical = damage > attacker.attack * 0.4;
  
  let newPokemon1Hp = state.pokemon1Hp;
  let newPokemon2Hp = state.pokemon2Hp;
  
  if (state.currentTurn === 1) {
    newPokemon2Hp = Math.max(0, state.pokemon2Hp - damage);
  } else {
    newPokemon1Hp = Math.max(0, state.pokemon1Hp - damage);
  }
  
  const criticalText = isCritical ? ' ¡Golpe crítico!' : '';
  const logMessage = `${attacker.name.toUpperCase()} ataca a ${defender.name.toUpperCase()} y causa ${damage} de daño.${criticalText}`;
  
  let winner: PokemonBasic | null = null;
  let isFinished = false;
  
  if (newPokemon1Hp <= 0) {
    winner = state.pokemon2;
    isFinished = true;
  } else if (newPokemon2Hp <= 0) {
    winner = state.pokemon1;
    isFinished = true;
  }
  
  const battleLog = [...state.battleLog, logMessage];
  
  if (isFinished && winner) {
    battleLog.push(`¡${winner.name.toUpperCase()} gana el combate!`);
  }
  
  return {
    ...state,
    pokemon1Hp: newPokemon1Hp,
    pokemon2Hp: newPokemon2Hp,
    currentTurn: state.currentTurn === 1 ? 2 : 1,
    battleLog,
    winner,
    isFinished,
  };
}

export function getHealthPercentage(currentHp: number, maxHp: number): number {
  return Math.max(0, Math.min(100, (currentHp / maxHp) * 100));
}

export function getHealthBarColor(percentage: number): string {
  if (percentage > 50) return '#4ade80';
  if (percentage > 25) return '#facc15';
  return '#ef4444';
}
