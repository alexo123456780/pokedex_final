'use client';

import { useState, useCallback } from 'react';
import { QuizState } from '@/types/pokemon';
import { initQuiz, generateQuizQuestion, checkAnswer } from '@/lib/quizLogic';

export function useQuiz() {
  const [quizState, setQuizState] = useState<QuizState>(initQuiz());
  const [loading, setLoading] = useState(false);

  const loadNewQuestion = useCallback(async () => {
    setLoading(true);
    
    const question = await generateQuizQuestion();
    
    if (question) {
      setQuizState(prev => ({
        ...prev,
        currentPokemon: question.pokemon,
        options: question.options,
        isRevealed: false,
        isCorrect: null,
      }));
    }
    
    setLoading(false);
  }, []);

  const submitAnswer = useCallback((answer: string) => {
    setQuizState(prev => checkAnswer(prev, answer));
  }, []);

  const resetQuiz = useCallback(() => {
    setQuizState(initQuiz());
  }, []);

  return {
    quizState,
    loading,
    loadNewQuestion,
    submitAnswer,
    resetQuiz,
  };
}
