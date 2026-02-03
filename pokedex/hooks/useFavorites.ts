'use client';

import { useState, useEffect, useCallback } from 'react';
import { FavoritePokemon, PokemonBasic } from '@/types/pokemon';
import { 
  getFavorites, 
  addFavorite, 
  removeFavorite, 
  updateFavorite,
  isFavorite 
} from '@/lib/favorites';

export function useFavorites() {
  const [favorites, setFavorites] = useState<FavoritePokemon[]>([]);

  useEffect(() => {
    setFavorites(getFavorites());
  }, []);

  const add = useCallback((pokemon: PokemonBasic) => {
    const updated = addFavorite(pokemon);
    setFavorites(updated);
  }, []);

  const remove = useCallback((pokemonId: number) => {
    const updated = removeFavorite(pokemonId);
    setFavorites(updated);
  }, []);

  const update = useCallback((pokemonId: number, newName: string) => {
    const updated = updateFavorite(pokemonId, newName);
    setFavorites(updated);
  }, []);

  const checkIsFavorite = useCallback((pokemonId: number) => {
    return isFavorite(pokemonId);
  }, []);

  return {
    favorites,
    add,
    remove,
    update,
    isFavorite: checkIsFavorite,
  };
}
