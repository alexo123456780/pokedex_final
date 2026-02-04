'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import styles from './quiz.module.css';
import { useQuiz } from '@/hooks/useQuiz';
import { capitalizeFirst } from '@/lib/pokeapi';

export function QuizGame() {
  const { quizState, loading, loadNewQuestion, submitAnswer, resetQuiz } = useQuiz();
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [gameStarted, setGameStarted] = useState(false);

  const handleStartGame = async () => {
    setGameStarted(true);
    await loadNewQuestion();
  };

  const handleSelectAnswer = (answer: string) => {
    if (quizState.isRevealed) return;
    
    setSelectedAnswer(answer);
    submitAnswer(answer);
  };

  const handleNextQuestion = async () => {
    setSelectedAnswer(null);
    await loadNewQuestion();
  };

  const handleReset = () => {
    resetQuiz();
    setSelectedAnswer(null);
    setGameStarted(false);
  };

  const getButtonClass = (option: string) => {
    if (!quizState.isRevealed) return styles.optionButton;
    
    const correctAnswer = quizState.currentPokemon ? capitalizeFirst(quizState.currentPokemon.name) : '';
    
    if (option === correctAnswer) {
      return `${styles.optionButton} ${styles.correct}`;
    }
    
    if (option === selectedAnswer && option !== correctAnswer) {
      return `${styles.optionButton} ${styles.incorrect}`;
    }
    
    return `${styles.optionButton} ${styles.incorrect}`;
  };

  if (!gameStarted) {
    return (
      <div className={styles.quizContainer}>
        <h1 className={styles.quizTitle}>¿Quién es ese Pokémon?</h1>
        
        <div className={styles.introScreen}>
          <div className={styles.silhouetteContainer}>
            <div className={styles.spotlight}>
              <Image
                src="/profesor.svg"
                alt="Profesor"
                width={200}
                height={200}
                className={styles.introImage}
              />
            </div>
          </div>
          
          <h2>¡Pon a prueba tu conocimiento Pokémon!</h2>
          <p>
            Se te mostrará la silueta de un Pokémon y tendrás que adivinar 
            cuál es entre 4 opciones. ¿Cuántos puedes acertar?
          </p>
          
          <button
            className={`${styles.controlButton} ${styles.startButton}`}
            onClick={handleStartGame}
          >
            ¡Comenzar Quiz!
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className={styles.quizContainer}>
        <h1 className={styles.quizTitle}>¿Quién es ese Pokémon?</h1>
        <div className={styles.loadingContainer}>
          <div className={styles.loadingSpinner}></div>
          <p className={styles.loadingText}>Cargando Pokémon...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.quizContainer}>
      <h1 className={styles.quizTitle}>¿Quién es ese Pokémon?</h1>
      
      <div className={styles.scoreBoard}>
        <span>Puntuación: {quizState.score} / {quizState.totalQuestions}</span>
      </div>

      {quizState.currentPokemon && (
        <>
          <div className={styles.silhouetteContainer}>
            <div className={styles.spotlight}>
              <Image
                src={quizState.currentPokemon.image}
                alt="Pokemon misterioso"
                width={250}
                height={250}
                className={`${styles.pokemonImage} ${quizState.isRevealed ? styles.revealed : styles.silhouette}`}
                priority
              />
            </div>
          </div>

          {quizState.isRevealed && (
            <div className={`${styles.resultMessage} ${quizState.isCorrect ? styles.correct : styles.incorrect}`}>
              {quizState.isCorrect ? '¡Correcto!' : '¡Incorrecto!'}
              <span className={styles.pokemonName}>
                Es {capitalizeFirst(quizState.currentPokemon.name)}!
              </span>
            </div>
          )}

          <div className={styles.optionsContainer}>
            {quizState.options.map((option, index) => (
              <button
                key={index}
                className={getButtonClass(option)}
                onClick={() => handleSelectAnswer(option)}
                disabled={quizState.isRevealed}
              >
                {option}
              </button>
            ))}
          </div>

          <div className={styles.controlButtons}>
            {quizState.isRevealed && (
              <button
                className={`${styles.controlButton} ${styles.nextButton}`}
                onClick={handleNextQuestion}
              >
                Siguiente Pokémon
              </button>
            )}
            <button
              className={`${styles.controlButton} ${styles.resetButton}`}
              onClick={handleReset}
            >
              Reiniciar Quiz
            </button>
          </div>
        </>
      )}
    </div>
  );
}
