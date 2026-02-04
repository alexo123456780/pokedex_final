'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import styles from './battle.module.css';
import { PokemonBasic, PokemonMove, BattleLogEntry } from '@/types/pokemon';
import { useBattle } from '@/hooks/useBattle';
import { getRandomPokemon, capitalizeFirst } from '@/lib/pokeapi';
import { getHealthPercentage, getHealthBarColor, getTypeColor } from '@/lib/battleLogic';

export function BattleArena() {
  const [pokemon1, setPokemon1] = useState<PokemonBasic | null>(null);
  const [pokemon2, setPokemon2] = useState<PokemonBasic | null>(null);
  const [loading1, setLoading1] = useState(false);
  const [loading2, setLoading2] = useState(false);
  const logRef = useRef<HTMLDivElement>(null);

  const { 
    battleState, 
    isAutoMode, 
    isAnimating,
    showDamageNumber,
    startBattle, 
    attack, 
    runAutoBattle, 
    stopAutoBattle,
    resetBattle 
  } = useBattle();

  useEffect(() => {
    loadRandomPokemon1();
    loadRandomPokemon2();
  }, []);

  useEffect(() => {
    if (logRef.current) {
      logRef.current.scrollTop = logRef.current.scrollHeight;
    }
  }, [battleState?.battleLog]);

  const loadRandomPokemon1 = async () => {
    setLoading1(true);
    try {
      const poke = await getRandomPokemon();
      if (poke) setPokemon1(poke);
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
      if (poke) setPokemon2(poke);
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

  const handleMoveSelect = (moveIndex: number) => {
    if (!isAnimating && !isAutoMode && battleState?.currentTurn === 1) {
      attack(moveIndex);
    }
  };

  const getPhaseClass = () => {
    if (!battleState) return '';
    const phase = battleState.phase;
    return styles[`phase_${phase.replace('-', '_')}`] || '';
  };

  const getFighterClass = (fighterNum: 1 | 2) => {
    if (!battleState) return '';
    const classes = [styles.fighter];
    
    if (fighterNum === 2) classes.push(styles.right);
    
    if (battleState.phase === 'intro-pokemon1' && fighterNum === 1) {
      classes.push(styles.entering);
    }
    if (battleState.phase === 'intro-pokemon2' && fighterNum === 2) {
      classes.push(styles.entering);
    }
    
    if (battleState.phase === 'attacking') {
      const isAttacker = battleState.currentTurn === fighterNum;
      if (isAttacker) {
        classes.push(styles.attacking);
      }
    }
    
    if (battleState.phase === 'damage' || showDamageNumber) {
      const isDefender = battleState.currentTurn !== fighterNum;
      if (isDefender && battleState.lastDamage > 0) {
        classes.push(styles.takingDamage);
        if (battleState.isCritical) classes.push(styles.criticalHit);
        if (battleState.effectiveness > 1) classes.push(styles.superEffective);
      }
    }
    
    if (battleState.phase === 'fainted') {
      const loser = battleState.winner?.id === battleState.pokemon1?.id ? 2 : 1;
      if (fighterNum === loser) {
        classes.push(styles.fainted);
      }
    }
    
    if (battleState.winner && battleState.winner.id !== (fighterNum === 1 ? battleState.pokemon1?.id : battleState.pokemon2?.id)) {
      classes.push(styles.loser);
    }
    
    return classes.join(' ');
  };

  const renderTypeBadges = (types: string[]) => (
    <div className={styles.typeBadges}>
      {types.map(type => (
        <span 
          key={type} 
          className={styles.typeBadge}
          style={{ backgroundColor: getTypeColor(type) }}
        >
          {type}
        </span>
      ))}
    </div>
  );

  const renderMoveButton = (move: PokemonMove, index: number) => {
    const isDisabled = isAnimating || isAutoMode || battleState?.currentTurn !== 1;
    return (
      <button
        key={index}
        className={styles.moveButton}
        style={{ 
          '--move-color': getTypeColor(move.type),
          borderColor: getTypeColor(move.type)
        } as React.CSSProperties}
        onClick={() => handleMoveSelect(index)}
        disabled={isDisabled}
      >
        <Image src="/icons/zap.svg" alt="" width={24} height={24} className={styles.moveIcon} />
        <span className={styles.moveName}>{move.name}</span>
        <span className={styles.movePower}>PWR: {move.power}</span>
      </button>
    );
  };

  const renderBattleLog = () => {
    if (!battleState) return null;
    
    return (
      <div className={styles.battleLog} ref={logRef}>
        {battleState.battleLog.map((entry: BattleLogEntry, index: number) => (
          <p 
            key={index} 
            className={`${styles.logEntry} ${styles[`log_${entry.type}`]}`}
          >
            {entry.message}
          </p>
        ))}
      </div>
    );
  };

  const renderDamageNumber = () => {
    if (!showDamageNumber || !battleState || battleState.lastDamage === 0) return null;
    
    const target = battleState.currentTurn === 1 ? 2 : 1;
    const positionClass = target === 1 ? styles.damageLeft : styles.damageRight;
    
    return (
      <div className={`${styles.damageNumber} ${positionClass} ${battleState.isCritical ? styles.criticalDamage : ''}`}>
        -{battleState.lastDamage}
        {battleState.isCritical && <span className={styles.criticalText}>CRITICAL!</span>}
        {battleState.effectiveness > 1 && <span className={styles.effectiveText}>SUPER EFFECTIVE!</span>}
      </div>
    );
  };

  const renderIntroOverlay = () => {
    if (!battleState || !battleState.phase.startsWith('intro')) return null;
    
    return (
      <div className={`${styles.introOverlay} ${styles[`intro_${battleState.phase.replace('intro-', '').replace('-', '_')}`]}`}>
        {battleState.phase === 'intro' && (
          <div className={styles.introText}>
            <span className={styles.battleStart}>¡COMBATE POKÉMON!</span>
          </div>
        )}
        {battleState.phase === 'intro-versus' && (
          <div className={styles.versusAnimation}>
            <span className={styles.vsText}>VS</span>
          </div>
        )}
      </div>
    );
  };

  const renderVictoryScreen = () => {
    if (!battleState || battleState.phase !== 'victory' || !battleState.winner) return null;
    
    return (
      <div className={styles.victoryOverlay}>
        <div className={styles.victoryContent}>
          <div className={styles.confetti}></div>
          <h2 className={styles.victoryTitle}>
            <Image src="/icons/trophy.svg" alt="" width={50} height={50} className={styles.trophyIcon} />
            ¡VICTORIA!
          </h2>
          <div className={styles.winnerShowcase}>
            <Image
              src={battleState.winner.image}
              alt={battleState.winner.name}
              width={200}
              height={200}
              className={styles.winnerImage}
            />
            <h3 className={styles.winnerName}>{capitalizeFirst(battleState.winner.name)}</h3>
            {renderTypeBadges(battleState.winner.types)}
          </div>
          <div className={styles.battleStats}>
            <p>Turnos totales: {battleState.turnCount}</p>
          </div>
          <button
            className={`${styles.battleButton} ${styles.backButton}`}
            onClick={handleReset}
          >
            <Image src="/icons/refresh.svg" alt="" width={20} height={20} className={styles.btnIcon} />
            Volver a Selección
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className={`${styles.battleContainer} ${getPhaseClass()}`}>
      <h1 className={styles.battleTitle}>
        <Image src="/icons/swords.svg" alt="" width={40} height={40} className={styles.titleIcon} />
        Arena de Combate Pokémon
      </h1>
      
      <div className={styles.arenaWrapper}>
        {!battleState ? (
          <>
            <div className={styles.selectionContainer}>
              <div className={styles.pokemonSelector}>
                <h3>Tu Pokémon</h3>
                {pokemon1 ? (
                  <div className={styles.selectedPokemon}>
                    <Image
                      src={pokemon1.image}
                      alt={pokemon1.name}
                      width={140}
                      height={140}
                      className={styles.selectorImage}
                    />
                    <h4>{capitalizeFirst(pokemon1.name)}</h4>
                    {renderTypeBadges(pokemon1.types)}
                    <div className={styles.statsGrid}>
                      <div className={styles.statItem}><span>HP</span><strong>{pokemon1.hp}</strong></div>
                      <div className={styles.statItem}><span>ATK</span><strong>{pokemon1.attack}</strong></div>
                      <div className={styles.statItem}><span>DEF</span><strong>{pokemon1.defense}</strong></div>
                      <div className={styles.statItem}><span>SPD</span><strong>{pokemon1.speed}</strong></div>
                    </div>
                    <button 
                      className={styles.changeButton}
                      onClick={loadRandomPokemon1} 
                      disabled={loading1}
                    >
                      <Image src="/icons/dice.svg" alt="" width={16} height={16} className={styles.btnIcon} />
                      {loading1 ? 'Cargando...' : 'Aleatorio'}
                    </button>
                  </div>
                ) : (
                  <div className={styles.placeholder}>
                    <div className={styles.loadingSpinner}></div>
                    <p>Cargando Pokémon...</p>
                  </div>
                )}
              </div>

              <div className={styles.vsBadge}>
                <span>VS</span>
              </div>

              <div className={styles.pokemonSelector}>
                <h3>Pokémon Rival</h3>
                {pokemon2 ? (
                  <div className={styles.selectedPokemon}>
                    <Image
                      src={pokemon2.image}
                      alt={pokemon2.name}
                      width={140}
                      height={140}
                      className={styles.selectorImage}
                    />
                    <h4>{capitalizeFirst(pokemon2.name)}</h4>
                    {renderTypeBadges(pokemon2.types)}
                    <div className={styles.statsGrid}>
                      <div className={styles.statItem}><span>HP</span><strong>{pokemon2.hp}</strong></div>
                      <div className={styles.statItem}><span>ATK</span><strong>{pokemon2.attack}</strong></div>
                      <div className={styles.statItem}><span>DEF</span><strong>{pokemon2.defense}</strong></div>
                      <div className={styles.statItem}><span>SPD</span><strong>{pokemon2.speed}</strong></div>
                    </div>
                    <button 
                      className={styles.changeButton}
                      onClick={loadRandomPokemon2} 
                      disabled={loading2}
                    >
                      <Image src="/icons/dice.svg" alt="" width={16} height={16} className={styles.btnIcon} />
                      {loading2 ? 'Cargando...' : 'Aleatorio'}
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
                <span className={styles.buttonGlow}></span>
                <Image src="/icons/swords.svg" alt="" width={24} height={24} className={styles.btnIcon} />
                ¡Iniciar Combate!
              </button>
            </div>
          </>
        ) : (
          <div className={styles.battleArena}>
            {renderIntroOverlay()}
            
            <div className={styles.battleField}>
              <div className={styles.fighters}>
                <div className={getFighterClass(1)}>
                  {battleState.pokemon1 && (
                    <>
                      <div className={styles.fighterInfo}>
                        <h3 className={styles.fighterName}>
                          {capitalizeFirst(battleState.pokemon1.name)}
                          {battleState.currentTurn === 1 && !battleState.isFinished && (
                            <span className={styles.turnIndicator}>▶</span>
                          )}
                        </h3>
                        {renderTypeBadges(battleState.pokemon1.types)}
                      </div>
                      <div className={styles.healthBarContainer}>
                        <div className={styles.healthBar}>
                          <div
                            className={styles.healthFill}
                            style={{
                              width: `${getHealthPercentage(battleState.pokemon1Hp, battleState.pokemon1MaxHp)}%`,
                              backgroundColor: getHealthBarColor(getHealthPercentage(battleState.pokemon1Hp, battleState.pokemon1MaxHp))
                            }}
                          />
                        </div>
                        <p className={styles.healthText}>
                          {battleState.pokemon1Hp} / {battleState.pokemon1MaxHp}
                        </p>
                      </div>
                      <div className={styles.pokemonImageWrapper}>
                        <Image
                          src={battleState.pokemon1.image}
                          alt={battleState.pokemon1.name}
                          width={180}
                          height={180}
                          className={styles.pokemonImage}
                        />
                        <div className={styles.shadow}></div>
                      </div>
                    </>
                  )}
                </div>

                <div className={styles.battleCenter}>
                  {!battleState.phase.startsWith('intro') && !battleState.isFinished && (
                    <div className={styles.turnCounter}>
                      Turno {battleState.turnCount + 1}
                    </div>
                  )}
                </div>

                <div className={getFighterClass(2)}>
                  {battleState.pokemon2 && (
                    <>
                      <div className={styles.fighterInfo}>
                        <h3 className={styles.fighterName}>
                          {battleState.currentTurn === 2 && !battleState.isFinished && (
                            <span className={styles.turnIndicator}>◀</span>
                          )}
                          {capitalizeFirst(battleState.pokemon2.name)}
                        </h3>
                        {renderTypeBadges(battleState.pokemon2.types)}
                      </div>
                      <div className={styles.healthBarContainer}>
                        <div className={styles.healthBar}>
                          <div
                            className={styles.healthFill}
                            style={{
                              width: `${getHealthPercentage(battleState.pokemon2Hp, battleState.pokemon2MaxHp)}%`,
                              backgroundColor: getHealthBarColor(getHealthPercentage(battleState.pokemon2Hp, battleState.pokemon2MaxHp))
                            }}
                          />
                        </div>
                        <p className={styles.healthText}>
                          {battleState.pokemon2Hp} / {battleState.pokemon2MaxHp}
                        </p>
                      </div>
                      <div className={styles.pokemonImageWrapper}>
                        <Image
                          src={battleState.pokemon2.image}
                          alt={battleState.pokemon2.name}
                          width={180}
                          height={180}
                          className={styles.pokemonImage}
                        />
                        <div className={styles.shadow}></div>
                      </div>
                    </>
                  )}
                </div>
              </div>
              
              {renderDamageNumber()}
            </div>

            {renderBattleLog()}

            {!battleState.isFinished && battleState.phase === 'ready' && (
              <div className={styles.actionPanel}>
                {battleState.currentTurn === 1 ? (
                  <>
                    <h4 className={styles.actionTitle}>¿Qué debería hacer {capitalizeFirst(battleState.pokemon1?.name || '')}?</h4>
                    <div className={styles.movesGrid}>
                      {battleState.pokemon1Moves.map((move, index) => renderMoveButton(move, index))}
                    </div>
                  </>
                ) : (
                  <div className={styles.waitingMessage}>
                    <div className={styles.thinkingDots}>
                      <span></span><span></span><span></span>
                    </div>
                    <p>{capitalizeFirst(battleState.pokemon2?.name || '')} está pensando...</p>
                  </div>
                )}
                
                <div className={styles.battleOptions}>
                  {!isAutoMode ? (
                    <button
                      className={`${styles.battleButton} ${styles.autoButton}`}
                      onClick={runAutoBattle}
                      disabled={isAnimating}
                    >
                      <Image src="/icons/robot.svg" alt="" width={20} height={20} className={styles.btnIcon} />
                      Auto Batalla
                    </button>
                  ) : (
                    <button
                      className={`${styles.battleButton} ${styles.stopButton}`}
                      onClick={stopAutoBattle}
                    >
                      <Image src="/icons/stop.svg" alt="" width={20} height={20} className={styles.btnIcon} />
                      Detener
                    </button>
                  )}
                  <button
                    className={`${styles.battleButton} ${styles.resetButton}`}
                    onClick={handleReset}
                  >
                    <Image src="/icons/flag.svg" alt="" width={20} height={20} className={styles.btnIcon} />
                    Rendirse
                  </button>
                </div>
              </div>
            )}

            {battleState.isFinished && battleState.phase !== 'victory' && (
              <div className={styles.battleControls}>
                <button
                  className={`${styles.battleButton} ${styles.resetButton}`}
                  onClick={handleReset}
                >
                  <Image src="/icons/refresh.svg" alt="" width={20} height={20} className={styles.btnIcon} />
                  Nuevo Combate
                </button>
              </div>
            )}

            {renderVictoryScreen()}
          </div>
        )}
      </div>
    </div>
  );
}
