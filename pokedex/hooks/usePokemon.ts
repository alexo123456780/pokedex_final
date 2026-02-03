'use client';

import { useState, useCallback } from 'react';
import { PokemonBasic } from '@/types/pokemon';
import { getPokemon, getMaxPokemonId } from '@/lib/pokeapi';

export function usePokemon() {
  const [pokemon, setPokemon] = useState<PokemonBasic | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentId, setCurrentId] = useState(1);

  const fetchPokemonById = useCallback(async (id: number) => {
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

  return {
    pokemon,
    loading,
    error,
    currentId,
    fetchPokemonById,
    nextPokemon,
    prevPokemon,
    searchByNumber,
  };
}
