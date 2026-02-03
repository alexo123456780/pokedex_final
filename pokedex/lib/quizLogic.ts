import { PokemonBasic, QuizState } from '@/types/pokemon';
import { getRandomPokemonList, capitalizeFirst } from './pokeapi';

export async function generateQuizQuestion(): Promise<{ pokemon: PokemonBasic; options: string[] } | null> {
  const pokemonList = await getRandomPokemonList(4);
  
  if (pokemonList.length < 4) return null;
  
  const correctPokemon = pokemonList[0];
  const options = shuffleArray(pokemonList.map(p => capitalizeFirst(p.name)));
  
  return {
    pokemon: correctPokemon,
    options,
  };
}

export function initQuiz(): QuizState {
  return {
    currentPokemon: null,
    options: [],
    score: 0,
    totalQuestions: 0,
    isRevealed: false,
    isCorrect: null,
  };
}

export function checkAnswer(state: QuizState, selectedAnswer: string): QuizState {
  if (!state.currentPokemon || state.isRevealed) return state;
  
  const correctAnswer = capitalizeFirst(state.currentPokemon.name);
  const isCorrect = selectedAnswer === correctAnswer;
  
  return {
    ...state,
    isRevealed: true,
    isCorrect,
    score: isCorrect ? state.score + 1 : state.score,
    totalQuestions: state.totalQuestions + 1,
  };
}

export function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}
