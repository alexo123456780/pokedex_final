'use client';

import Image from 'next/image';
import styles from './pokedex.module.css';
import { PokemonBasic } from '@/types/pokemon';

interface LeftPanelProps {
  pokemon: PokemonBasic | null;
  loading: boolean;
  onPrev: () => void;
  onNext: () => void;
}

export function LeftPanel({ pokemon, loading, onPrev, onNext }: LeftPanelProps) {
  return (
    <div className={styles.leftSide}>
      <div className={styles.roundBordureLeftSide}></div>
      <div className={styles.roundBordureLeftSide2}></div>
      
      {/* Top left lights */}
      <div className={styles.bigBlueLightBackground}>
        <div className={styles.bigBlueLight}></div>
        <div className={styles.bigBlueLightGlint}></div>
      </div>
      
      <div className={styles.littleLights}>
        <div className={`${styles.littleLight} ${styles.redLight}`}></div>
        <div className={`${styles.littleLight} ${styles.yellowLight}`}></div>
        <div className={`${styles.littleLight} ${styles.greenLight}`}></div>
      </div>
      
      {/* Main screen */}
      <div className={styles.screenLeftBackground}>
        <div className={styles.screenLeftLittleLights}>
          <div className={styles.screenLeftLittleRedLight}></div>
          <div className={styles.screenLeftLittleRedLight}></div>
        </div>
        
        <div className={`${styles.screenLeft} ${loading ? styles.loading : ''}`}>
          {pokemon ? (
            <Image
              src={pokemon.image}
              alt={pokemon.name}
              width={160}
              height={160}
              className={styles.screenLeftImage}
              priority
            />
          ) : (
            <Image
              src="/profesor.svg"
              alt="Profesor"
              width={160}
              height={160}
              className={styles.screenLeftImage}
            />
          )}
        </div>
        
        <div className={styles.screenLeftBigRedLight}></div>
        <div className={styles.screenLeftBurger}>
          <div className={styles.screenLeftBurgerInside}></div>
        </div>
      </div>
      
      {/* Console buttons */}
      <div className={styles.elongatedButtons}>
        <div className={`${styles.elongatedButton} ${styles.elongatedButton1} ${styles.clickable}`}></div>
        <div className={`${styles.elongatedButton} ${styles.elongatedButton2} ${styles.clickable}`}></div>
      </div>
      <div className={`${styles.roundedButton} ${styles.clickable}`}></div>
      
      {/* Little green screen */}
      <div className={styles.screenLeftLittle}>
        <p>Altura: {pokemon ? `${pokemon.height / 10} m` : '--'}</p>
        <p>Peso: {pokemon ? `${pokemon.weight / 10} kg` : '--'}</p>
      </div>
      
      {/* Cross control */}
      <div className={styles.crossContainer}>
        <div className={`${styles.cross} ${styles.crossTop} ${styles.clickable}`} onClick={onPrev}>
          <div className={`${styles.arrow} ${styles.arrowTop}`}></div>
        </div>
        <div className={`${styles.cross} ${styles.crossMid}`}></div>
        <div className={`${styles.cross} ${styles.crossBottom} ${styles.clickable}`} onClick={onNext}>
          <div className={`${styles.arrow} ${styles.arrowBottom}`}></div>
        </div>
        <div className={`${styles.cross} ${styles.crossLeft} ${styles.clickable}`} onClick={onPrev}>
          <div className={`${styles.arrow} ${styles.arrowLeft}`}></div>
        </div>
        <div className={`${styles.cross} ${styles.crossRight} ${styles.clickable}`} onClick={onNext}>
          <div className={`${styles.arrow} ${styles.arrowRight}`}></div>
        </div>
      </div>
    </div>
  );
}
