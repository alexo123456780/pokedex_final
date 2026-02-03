'use client';

import { useState } from 'react';
import styles from './pokedex.module.css';
import { PokemonBasic } from '@/types/pokemon';
import { capitalizeFirst } from '@/lib/pokeapi';

interface RightPanelProps {
  pokemon: PokemonBasic | null;
  onSearch: (num: number) => void;
  onAdd: () => void;
}

export function RightPanel({ pokemon, onSearch, onAdd }: RightPanelProps) {
  const [inputValue, setInputValue] = useState('');

  const handleKeyPress = (num: string) => {
    if (inputValue.length < 4) {
      setInputValue(prev => prev + num);
    }
  };

  const handleSearch = () => {
    const num = parseInt(inputValue, 10);
    if (!isNaN(num) && num > 0) {
      onSearch(num);
      setInputValue('');
    }
  };

  const handleAdd = () => {
    if (pokemon) {
      onAdd();
    }
  };

  return (
    <div className={styles.rightSide}>
      <div className={styles.roundBordureRightSide}></div>
      
      {/* Input display */}
      <div className={styles.inputDisplay}>
        {inputValue || '---'}
      </div>
      
      {/* Stats screen */}
      <div className={styles.screenRight}>
        <p className={styles.pokemonNumeroP}>
          Número: <span>{pokemon?.id ?? '--'}</span>
        </p>
        <p className={styles.pokemonTitleP}>
          Nombre: <span>{pokemon ? capitalizeFirst(pokemon.name) : '--'}</span>
        </p>
        <p className={styles.pokemonStatsLeft}>
          Hp: <span>{pokemon?.hp ?? '--'}</span>
        </p>
        <p className={styles.pokemonStatsRight}>
          Ataque: <span>{pokemon?.attack ?? '--'}</span>
        </p>
        <p className={styles.pokemonStatsLeft}>
          Defensa: <span>{pokemon?.defense ?? '--'}</span>
        </p>
        <p className={styles.pokemonStatsRight}>
          Velocidad: <span>{pokemon?.speed ?? '--'}</span>
        </p>
      </div>
      
      {/* Keyboard */}
      <div className={styles.keyboard}>
        {['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'].map((num) => (
          <button
            key={num}
            className={styles.key}
            onClick={() => handleKeyPress(num)}
          >
            {num}
          </button>
        ))}
      </div>
      
      {/* Elongated lights */}
      <div className={styles.elongatedLights}>
        <div className={styles.elongatedLight}></div>
        <div className={styles.elongatedLight}></div>
      </div>
      
      {/* Yellow light */}
      <div className={styles.rightSideYellowLight}></div>
      
      {/* White buttons */}
      <div className={styles.whiteButtons}>
        <button className={styles.whiteButton} onClick={handleSearch}>
          Buscar
        </button>
        <button className={styles.whiteButton} onClick={handleAdd}>
          Agregar
        </button>
      </div>
      
      {/* Grey buttons (types) */}
      <div className={styles.greyButtons}>
        <div className={styles.greyButton}>
          <p>{pokemon?.types[0] ? capitalizeFirst(pokemon.types[0]) : '--'}</p>
        </div>
        <div className={styles.greyButton}>
          <p>{pokemon?.types[1] ? capitalizeFirst(pokemon.types[1]) : '--'}</p>
        </div>
      </div>
    </div>
  );
}
