'use client';

import { useState, useCallback, useRef } from 'react';
import { PokemonBasic, BattleState } from '@/types/pokemon';
import { initBattle, executeTurn } from '@/lib/battleLogic';

export function useBattle() {
  const [battleState, setBattleState] = useState<BattleState | null>(null);
  const [isAutoMode, setIsAutoMode] = useState(false);
  const battleStateRef = useRef<BattleState | null>(null);
  const isAutoBattleRunning = useRef(false);

  const startBattle = useCallback((pokemon1: PokemonBasic, pokemon2: PokemonBasic) => {
    const initialState = initBattle(pokemon1, pokemon2);
    battleStateRef.current = initialState;
    setBattleState(initialState);
    setIsAutoMode(false);
    isAutoBattleRunning.current = false;
  }, []);

  const attack = useCallback(() => {
    const currentState = battleStateRef.current;
    if (!currentState || currentState.isFinished || isAutoBattleRunning.current) return;

    const newState = executeTurn(currentState);
    battleStateRef.current = newState;
    setBattleState(newState);
  }, []);

  const runAutoBattle = useCallback(async () => {
    const currentState = battleStateRef.current;
    if (!currentState || currentState.isFinished || isAutoBattleRunning.current) return;

    isAutoBattleRunning.current = true;
    setIsAutoMode(true);

    let state = currentState;

    while (!state.isFinished && isAutoBattleRunning.current) {
      await new Promise(resolve => setTimeout(resolve, 800));
      if (!isAutoBattleRunning.current) break;

      state = executeTurn(state);
      battleStateRef.current = state;
      setBattleState(state);
    }

    isAutoBattleRunning.current = false;
    setIsAutoMode(false);
  }, []);

  const resetBattle = useCallback(() => {
    isAutoBattleRunning.current = false;
    battleStateRef.current = null;
    setBattleState(null);
    setIsAutoMode(false);
  }, []);

  return {
    battleState,
    isAutoMode,
    startBattle,
    attack,
    runAutoBattle,
    resetBattle,
  };
}
