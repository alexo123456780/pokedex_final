'use client';

import { useState, useCallback } from 'react';
import { PokemonBasic } from '@/types/pokemon';
import { getPokemon, getMaxPokemonId, getEvolutionChain } from '@/lib/pokeapi';

export function usePokemon() {
  const [pokemon, setPokemon] = useState<PokemonBasic | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentId, setCurrentId] = useState(1);
  const [evolutionChain, setEvolutionChain] = useState<number[]>([]);
  const [evolutionIndex, setEvolutionIndex] = useState(0);

  const fetchPokemonById = useCallback(async (id: number, skipEvolutionFetch = false) => {
    if (id < 1 || id > getMaxPokemonId()) {
      setError('ID de Pokémon inválido');
      return;
    }

    setLoading(true);
    setError(null);

    const result = await getPokemon(id);

    if (result) {
      setPokemon(result);
      setCurrentId(id);

      if (!skipEvolutionFetch) {
        const chain = await getEvolutionChain(id);
        setEvolutionChain(chain);
        const idx = chain.indexOf(id);
        setEvolutionIndex(idx >= 0 ? idx : 0);
      }
    } else {
      setError('Pokémon no encontrado');
    }

    setLoading(false);
  }, []);

  const nextPokemon = useCallback(() => {
    const nextId = currentId >= getMaxPokemonId() ? 1 : currentId + 1;
    fetchPokemonById(nextId);
  }, [currentId, fetchPokemonById]);

  const prevPokemon = useCallback(() => {
    const prevId = currentId <= 1 ? getMaxPokemonId() : currentId - 1;
    fetchPokemonById(prevId);
  }, [currentId, fetchPokemonById]);

  const searchByNumber = useCallback((num: number) => {
    fetchPokemonById(num);
  }, [fetchPokemonById]);

  const nextEvolution = useCallback(async () => {
    if (evolutionChain.length === 0) return;

    const nextIdx = evolutionIndex + 1;
    if (nextIdx < evolutionChain.length) {
      const nextId = evolutionChain[nextIdx];
      setEvolutionIndex(nextIdx);
      await fetchPokemonById(nextId, true);
    }
  }, [evolutionChain, evolutionIndex, fetchPokemonById]);

  const prevEvolution = useCallback(async () => {
    if (evolutionChain.length === 0) return;

    const prevIdx = evolutionIndex - 1;
    if (prevIdx >= 0) {
      const prevId = evolutionChain[prevIdx];
      setEvolutionIndex(prevIdx);
      await fetchPokemonById(prevId, true);
    }
  }, [evolutionChain, evolutionIndex, fetchPokemonById]);

  return {
    pokemon,
    loading,
    error,
    currentId,
    evolutionChain,
    evolutionIndex,
    fetchPokemonById,
    nextPokemon,
    prevPokemon,
    searchByNumber,
    nextEvolution,
    prevEvolution,
  };
}
