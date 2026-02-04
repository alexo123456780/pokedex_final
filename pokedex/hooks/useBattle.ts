'use client';

import { useState, useCallback, useRef } from 'react';
import { PokemonBasic, BattleState, BattlePhase } from '@/types/pokemon';
import { initBattle, executeTurn, setPhase, executeAITurn, addLogEntry } from '@/lib/battleLogic';

const TIMING = {
  INTRO_DELAY: 800,
  INTRO_POKEMON: 1200,
  INTRO_VS: 1000,
  ATTACK_ANIMATION: 600,
  DAMAGE_ANIMATION: 800,
  FAINT_ANIMATION: 1500,
  VICTORY_DELAY: 500,
  AUTO_TURN_DELAY: 2000,
  MESSAGE_DELAY: 400,
};

export function useBattle() {
  const [battleState, setBattleState] = useState<BattleState | null>(null);
  const [isAutoMode, setIsAutoMode] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [showDamageNumber, setShowDamageNumber] = useState(false);
  const [currentMessage, setCurrentMessage] = useState<string>('');
  const battleStateRef = useRef<BattleState | null>(null);
  const isAutoBattleRunning = useRef(false);

  const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  const showMessage = async (message: string) => {
    setCurrentMessage(message);
    await delay(TIMING.MESSAGE_DELAY);
  };

  const runIntroSequence = useCallback(async (state: BattleState) => {
    setIsAnimating(true);
    
    let currentState = setPhase(state, 'intro');
    battleStateRef.current = currentState;
    setBattleState(currentState);
    await delay(TIMING.INTRO_DELAY);

    currentState = setPhase(currentState, 'intro-pokemon1');
    currentState = addLogEntry(currentState, `¡${currentState.pokemon1?.name.toUpperCase()} entra en combate!`, 'info');
    battleStateRef.current = currentState;
    setBattleState(currentState);
    await delay(TIMING.INTRO_POKEMON);

    currentState = setPhase(currentState, 'intro-pokemon2');
    currentState = addLogEntry(currentState, `¡${currentState.pokemon2?.name.toUpperCase()} entra en combate!`, 'info');
    battleStateRef.current = currentState;
    setBattleState(currentState);
    await delay(TIMING.INTRO_POKEMON);

    currentState = setPhase(currentState, 'intro-versus');
    battleStateRef.current = currentState;
    setBattleState(currentState);
    await delay(TIMING.INTRO_VS);

    const faster = currentState.currentTurn === 1 ? currentState.pokemon1 : currentState.pokemon2;
    currentState = addLogEntry(currentState, `¡${faster?.name.toUpperCase()} es más rápido y ataca primero!`, 'info');
    
    currentState = setPhase(currentState, 'ready');
    battleStateRef.current = currentState;
    setBattleState(currentState);
    
    setIsAnimating(false);
  }, []);

  const startBattle = useCallback((pokemon1: PokemonBasic, pokemon2: PokemonBasic) => {
    const initialState = initBattle(pokemon1, pokemon2);
    battleStateRef.current = initialState;
    setBattleState(initialState);
    setIsAutoMode(false);
    isAutoBattleRunning.current = false;
    setCurrentMessage('');
    
    runIntroSequence(initialState);
  }, [runIntroSequence]);

  const executeRivalTurn = useCallback(async () => {
    const currentState = battleStateRef.current;
    if (!currentState || currentState.isFinished || currentState.currentTurn !== 2) return;

    setIsAnimating(true);

    let state = setPhase(currentState, 'attacking');
    battleStateRef.current = state;
    setBattleState(state);
    await delay(TIMING.ATTACK_ANIMATION);

    state = executeAITurn(state);
    battleStateRef.current = state;
    setBattleState(state);

    if (state.lastDamage > 0) {
      setShowDamageNumber(true);
      await delay(TIMING.DAMAGE_ANIMATION);
      setShowDamageNumber(false);
    } else {
      await delay(TIMING.MESSAGE_DELAY);
    }

    if (state.isFinished) {
      state = setPhase(state, 'fainted');
      battleStateRef.current = state;
      setBattleState(state);
      await delay(TIMING.FAINT_ANIMATION);
      
      state = setPhase(state, 'victory');
      battleStateRef.current = state;
      setBattleState(state);
    } else {
      state = setPhase(state, 'ready');
      battleStateRef.current = state;
      setBattleState(state);
    }

    setIsAnimating(false);
  }, []);

  const executeAttackSequence = useCallback(async (moveIndex: number) => {
    const currentState = battleStateRef.current;
    if (!currentState || currentState.isFinished || isAnimating) return;

    setIsAnimating(true);

    let state = setPhase(currentState, 'attacking');
    battleStateRef.current = state;
    setBattleState(state);
    await delay(TIMING.ATTACK_ANIMATION);

    state = executeTurn(state, moveIndex);
    battleStateRef.current = state;
    setBattleState(state);

    if (state.lastDamage > 0) {
      setShowDamageNumber(true);
      await delay(TIMING.DAMAGE_ANIMATION);
      setShowDamageNumber(false);
    } else {
      await delay(TIMING.MESSAGE_DELAY);
    }

    if (state.isFinished) {
      state = setPhase(state, 'fainted');
      battleStateRef.current = state;
      setBattleState(state);
      await delay(TIMING.FAINT_ANIMATION);
      
      state = setPhase(state, 'victory');
      battleStateRef.current = state;
      setBattleState(state);
      setIsAnimating(false);
    } else {
      state = setPhase(state, 'ready');
      battleStateRef.current = state;
      setBattleState(state);
      setIsAnimating(false);
      
      if (state.currentTurn === 2 && !isAutoBattleRunning.current) {
        await delay(1200);
        executeRivalTurn();
      }
    }

    return state;
  }, [isAnimating, executeRivalTurn]);

  const attack = useCallback((moveIndex: number = 0) => {
    if (isAnimating || isAutoBattleRunning.current) return;
    executeAttackSequence(moveIndex);
  }, [executeAttackSequence, isAnimating]);

  const runAutoBattle = useCallback(async () => {
    const currentState = battleStateRef.current;
    if (!currentState || currentState.isFinished || isAutoBattleRunning.current || isAnimating) return;

    isAutoBattleRunning.current = true;
    setIsAutoMode(true);

    let state = currentState;

    while (!state.isFinished && isAutoBattleRunning.current) {
      setIsAnimating(true);

      state = setPhase(state, 'attacking');
      battleStateRef.current = state;
      setBattleState(state);
      await delay(TIMING.ATTACK_ANIMATION);

      state = executeAITurn(state);
      battleStateRef.current = state;
      setBattleState(state);

      if (state.lastDamage > 0) {
        setShowDamageNumber(true);
        await delay(TIMING.DAMAGE_ANIMATION);
        setShowDamageNumber(false);
      }

      if (state.isFinished) {
        state = setPhase(state, 'fainted');
        battleStateRef.current = state;
        setBattleState(state);
        await delay(TIMING.FAINT_ANIMATION);
        
        state = setPhase(state, 'victory');
        battleStateRef.current = state;
        setBattleState(state);
        break;
      }

      state = setPhase(state, 'ready');
      battleStateRef.current = state;
      setBattleState(state);
      
      setIsAnimating(false);
      await delay(TIMING.AUTO_TURN_DELAY - TIMING.ATTACK_ANIMATION - TIMING.DAMAGE_ANIMATION);
    }

    setIsAnimating(false);
    isAutoBattleRunning.current = false;
    setIsAutoMode(false);
  }, [isAnimating]);

  const stopAutoBattle = useCallback(() => {
    isAutoBattleRunning.current = false;
    setIsAutoMode(false);
  }, []);

  const resetBattle = useCallback(() => {
    isAutoBattleRunning.current = false;
    battleStateRef.current = null;
    setBattleState(null);
    setIsAutoMode(false);
    setIsAnimating(false);
    setShowDamageNumber(false);
    setCurrentMessage('');
  }, []);

  return {
    battleState,
    isAutoMode,
    isAnimating,
    showDamageNumber,
    currentMessage,
    startBattle,
    attack,
    runAutoBattle,
    stopAutoBattle,
    resetBattle,
  };
}
