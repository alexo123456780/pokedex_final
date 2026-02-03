'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import styles from './battle.module.css';
import { PokemonBasic } from '@/types/pokemon';
import { useBattle } from '@/hooks/useBattle';
import { getRandomPokemon, capitalizeFirst } from '@/lib/pokeapi';
import { getHealthPercentage, getHealthBarColor } from '@/lib/battleLogic';

export function BattleArena() {
  const [pokemon1, setPokemon1] = useState<PokemonBasic | null>(null);
  const [pokemon2, setPokemon2] = useState<PokemonBasic | null>(null);
  const [loading1, setLoading1] = useState(false);
  const [loading2, setLoading2] = useState(false);

  const { battleState, isAutoMode, startBattle, attack, runAutoBattle, resetBattle } = useBattle();

  useEffect(() => {
    loadRandomPokemon1();
    loadRandomPokemon2();
  }, []);

  const loadRandomPokemon1 = async () => {
    setLoading1(true);
    try {
      const poke = await getRandomPokemon();
      if (poke) {
        setPokemon1(poke);
      }
    } catch (error) {
      console.error('Error cargando Pokémon 1:', error);
    } finally {
      setLoading1(false);
    }
  };

  const loadRandomPokemon2 = async () => {
    setLoading2(true);
    try {
      const poke = await getRandomPokemon();
      if (poke) {
        setPokemon2(poke);
      }
    } catch (error) {
      console.error('Error cargando Pokémon 2:', error);
    } finally {
      setLoading2(false);
    }
  };

  const handleStartBattle = () => {
    if (pokemon1 && pokemon2) {
      startBattle(pokemon1, pokemon2);
    }
  };

  const handleReset = () => {
    resetBattle();
    loadRandomPokemon1();
    loadRandomPokemon2();
  };

  return (
    <div className={styles.battleContainer}>
      <h1 className={styles.battleTitle}>
        <Image src="/icons/swords.svg" alt="" width={40} height={40} className={styles.titleIcon} />
        Arena de Combate Pokémon
      </h1>
      
      <div className={styles.arenaWrapper}>
        {!battleState ? (
          <>
            <div className={styles.selectionContainer}>
              {/* Pokemon 1 Selector */}
              <div className={styles.pokemonSelector}>
                <h3>Pokémon 1</h3>
                {pokemon1 ? (
                  <div className={styles.selectedPokemon}>
                    <Image
                      src={pokemon1.image}
                      alt={pokemon1.name}
                      width={120}
                      height={120}
                    />
                    <h4>{capitalizeFirst(pokemon1.name)}</h4>
                    <p>HP: {pokemon1.hp} | ATK: {pokemon1.attack}</p>
                    <p>DEF: {pokemon1.defense} | SPD: {pokemon1.speed}</p>
                    <button 
                      className={styles.changeButton}
                      onClick={loadRandomPokemon1} 
                      disabled={loading1}
                    >
                      <Image src="/icons/refresh.svg" alt="" width={16} height={16} className={styles.buttonIcon} />
                      {loading1 ? 'Cargando...' : 'Cambiar'}
                    </button>
                  </div>
                ) : (
                  <div className={styles.placeholder}>
                    <div className={styles.loadingSpinner}></div>
                    <p>Cargando Pokémon...</p>
                  </div>
                )}
              </div>

              <div className={styles.vsBadge}>VS</div>

              {/* Pokemon 2 Selector */}
              <div className={styles.pokemonSelector}>
                <h3>Pokémon 2</h3>
                {pokemon2 ? (
                  <div className={styles.selectedPokemon}>
                    <Image
                      src={pokemon2.image}
                      alt={pokemon2.name}
                      width={120}
                      height={120}
                    />
                    <h4>{capitalizeFirst(pokemon2.name)}</h4>
                    <p>HP: {pokemon2.hp} | ATK: {pokemon2.attack}</p>
                    <p>DEF: {pokemon2.defense} | SPD: {pokemon2.speed}</p>
                    <button 
                      className={styles.changeButton}
                      onClick={loadRandomPokemon2} 
                      disabled={loading2}
                    >
                      <Image src="/icons/refresh.svg" alt="" width={16} height={16} className={styles.buttonIcon} />
                      {loading2 ? 'Cargando...' : 'Cambiar'}
                    </button>
                  </div>
                ) : (
                  <div className={styles.placeholder}>
                    <div className={styles.loadingSpinner}></div>
                    <p>Cargando Pokémon...</p>
                  </div>
                )}
              </div>
            </div>

            <div className={styles.battleControls}>
              <button
                className={`${styles.battleButton} ${styles.startButton}`}
                onClick={handleStartBattle}
                disabled={!pokemon1 || !pokemon2}
              >
                ¡Iniciar Combate!
              </button>
            </div>
          </>
        ) : (
          <div className={styles.battleArena}>
            <div className={styles.fighters}>
              {/* Fighter 1 */}
              <div className={`${styles.fighter} ${battleState.winner && battleState.winner.id !== battleState.pokemon1?.id ? styles.loser : ''} ${battleState.currentTurn === 2 ? styles.attacking : ''}`}>
                {battleState.pokemon1 && (
                  <>
                    <Image
                      src={battleState.pokemon1.image}
                      alt={battleState.pokemon1.name}
                      width={150}
                      height={150}
                    />
                    <h3 className={styles.fighterName}>
                      {capitalizeFirst(battleState.pokemon1.name)}
                    </h3>
                    <div className={styles.healthBar}>
                      <div
                        className={styles.healthFill}
                        style={{
                          width: `${getHealthPercentage(battleState.pokemon1Hp, battleState.pokemon1.hp)}%`,
                          backgroundColor: getHealthBarColor(getHealthPercentage(battleState.pokemon1Hp, battleState.pokemon1.hp))
                        }}
                      />
                    </div>
                    <p className={styles.healthText}>
                      {battleState.pokemon1Hp} / {battleState.pokemon1.hp} HP
                    </p>
                  </>
                )}
              </div>

              <div className={styles.vsBadge}>VS</div>

              {/* Fighter 2 */}
              <div className={`${styles.fighter} ${styles.right} ${battleState.winner && battleState.winner.id !== battleState.pokemon2?.id ? styles.loser : ''} ${battleState.currentTurn === 1 ? styles.attacking : ''}`}>
                {battleState.pokemon2 && (
                  <>
                    <Image
                      src={battleState.pokemon2.image}
                      alt={battleState.pokemon2.name}
                      width={150}
                      height={150}
                    />
                    <h3 className={styles.fighterName}>
                      {capitalizeFirst(battleState.pokemon2.name)}
                    </h3>
                    <div className={styles.healthBar}>
                      <div
                        className={styles.healthFill}
                        style={{
                          width: `${getHealthPercentage(battleState.pokemon2Hp, battleState.pokemon2.hp)}%`,
                          backgroundColor: getHealthBarColor(getHealthPercentage(battleState.pokemon2Hp, battleState.pokemon2.hp))
                        }}
                      />
                    </div>
                    <p className={styles.healthText}>
                      {battleState.pokemon2Hp} / {battleState.pokemon2.hp} HP
                    </p>
                  </>
                )}
              </div>
            </div>

            {/* Battle Log */}
            <div className={styles.battleLog}>
              {battleState.battleLog.map((log, index) => (
                <p key={index}>{log}</p>
              ))}
            </div>

            {/* Winner Display */}
            {battleState.winner && (
              <div className={styles.winnerDisplay}>
                <h2>
                  <Image src="/icons/trophy.svg" alt="" width={40} height={40} className={styles.trophyIcon} />
                  ¡Victoria!
                </h2>
                <Image
                  src={battleState.winner.image}
                  alt={battleState.winner.name}
                  width={150}
                  height={150}
                />
                <h3>{capitalizeFirst(battleState.winner.name)}</h3>
              </div>
            )}

            {/* Controls */}
            <div className={styles.battleControls}>
              {!battleState.isFinished && (
                <>
                  <button
                    className={`${styles.battleButton} ${styles.attackButton}`}
                    onClick={attack}
                    disabled={isAutoMode}
                  >
                    <Image src="/icons/swords.svg" alt="" width={20} height={20} className={styles.buttonIcon} /> Atacar
                  </button>
                  <button
                    className={`${styles.battleButton} ${styles.autoButton}`}
                    onClick={runAutoBattle}
                    disabled={isAutoMode}
                  >
                    <Image src="/icons/robot.svg" alt="" width={20} height={20} className={styles.buttonIcon} /> Auto Batalla
                  </button>
                </>
              )}
              <button
                className={`${styles.battleButton} ${styles.resetButton}`}
                onClick={handleReset}
              >
                <Image src="/icons/refresh.svg" alt="" width={20} height={20} className={styles.buttonIcon} /> Nuevo Combate
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
