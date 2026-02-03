import { FavoritePokemon, PokemonBasic } from '@/types/pokemon';

const STORAGE_KEY = 'pokedex_favorites';

export function getFavorites(): FavoritePokemon[] {
  if (typeof window === 'undefined') return [];
  
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) return [];
  
  try {
    return JSON.parse(stored);
  } catch {
    return [];
  }
}

export function addFavorite(pokemon: PokemonBasic): FavoritePokemon[] {
  const favorites = getFavorites();
  
  if (favorites.some(f => f.id === pokemon.id)) {
    return favorites;
  }
  
  const newFavorite: FavoritePokemon = {
    ...pokemon,
    addedAt: Date.now(),
  };
  
  const updated = [...favorites, newFavorite];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  return updated;
}

export function removeFavorite(pokemonId: number): FavoritePokemon[] {
  const favorites = getFavorites();
  const updated = favorites.filter(f => f.id !== pokemonId);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  return updated;
}

export function updateFavorite(pokemonId: number, newName: string): FavoritePokemon[] {
  const favorites = getFavorites();
  const updated = favorites.map(f => 
    f.id === pokemonId ? { ...f, name: newName } : f
  );
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  return updated;
}

export function isFavorite(pokemonId: number): boolean {
  const favorites = getFavorites();
  return favorites.some(f => f.id === pokemonId);
}
