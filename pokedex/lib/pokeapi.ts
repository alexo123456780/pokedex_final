import { Pokemon, PokemonBasic } from '@/types/pokemon';

const BASE_URL = 'https://pokeapi.co/api/v2';
const MAX_POKEMON = 1025;

export async function fetchPokemon(idOrName: number | string): Promise<Pokemon | null> {
  try {
    const response = await fetch(`${BASE_URL}/pokemon/${idOrName}`);
    if (!response.ok) return null;
    return await response.json();
  } catch {
    return null;
  }
}

export function parsePokemon(pokemon: Pokemon): PokemonBasic {
  const stats = pokemon.stats.reduce((acc, stat) => {
    const statName = stat.stat.name;
    if (statName === 'hp') acc.hp = stat.base_stat;
    if (statName === 'attack') acc.attack = stat.base_stat;
    if (statName === 'defense') acc.defense = stat.base_stat;
    if (statName === 'speed') acc.speed = stat.base_stat;
    return acc;
  }, { hp: 0, attack: 0, defense: 0, speed: 0 });

  return {
    id: pokemon.id,
    name: pokemon.name,
    height: pokemon.height,
    weight: pokemon.weight,
    image: pokemon.sprites.other['official-artwork'].front_default || pokemon.sprites.front_default,
    types: pokemon.types.map(t => t.type.name),
    ...stats,
  };
}

export async function getPokemon(idOrName: number | string): Promise<PokemonBasic | null> {
  const pokemon = await fetchPokemon(idOrName);
  if (!pokemon) return null;
  return parsePokemon(pokemon);
}

export async function getRandomPokemon(): Promise<PokemonBasic | null> {
  const randomId = Math.floor(Math.random() * MAX_POKEMON) + 1;
  return getPokemon(randomId);
}

export async function getRandomPokemonList(count: number): Promise<PokemonBasic[]> {
  const promises: Promise<PokemonBasic | null>[] = [];
  const usedIds = new Set<number>();
  
  while (promises.length < count) {
    const randomId = Math.floor(Math.random() * MAX_POKEMON) + 1;
    if (!usedIds.has(randomId)) {
      usedIds.add(randomId);
      promises.push(getPokemon(randomId));
    }
  }
  
  const results = await Promise.all(promises);
  return results.filter((p): p is PokemonBasic => p !== null);
}

export function getMaxPokemonId(): number {
  return MAX_POKEMON;
}

export function capitalizeFirst(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

interface EvolutionChainLink {
  species: { name: string; url: string };
  evolves_to: EvolutionChainLink[];
}

interface EvolutionChainResponse {
  chain: EvolutionChainLink;
}

interface PokemonSpeciesResponse {
  evolution_chain: { url: string };
}

function extractEvolutionIds(chain: EvolutionChainLink, ids: number[] = []): number[] {
  const speciesId = parseInt(chain.species.url.split('/').filter(Boolean).pop() || '0');
  ids.push(speciesId);

  for (const evolution of chain.evolves_to) {
    extractEvolutionIds(evolution, ids);
  }

  return ids;
}

export async function getEvolutionChain(pokemonId: number): Promise<number[]> {
  try {
    const speciesResponse = await fetch(`${BASE_URL}/pokemon-species/${pokemonId}`);
    if (!speciesResponse.ok) return [pokemonId];

    const speciesData: PokemonSpeciesResponse = await speciesResponse.json();
    const evolutionUrl = speciesData.evolution_chain.url;

    const evolutionResponse = await fetch(evolutionUrl);
    if (!evolutionResponse.ok) return [pokemonId];

    const evolutionData: EvolutionChainResponse = await evolutionResponse.json();
    return extractEvolutionIds(evolutionData.chain);
  } catch {
    return [pokemonId];
  }
}
