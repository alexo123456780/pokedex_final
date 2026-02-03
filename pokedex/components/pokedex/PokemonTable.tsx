'use client';

import styles from './pokedex.module.css';
import { FavoritePokemon } from '@/types/pokemon';
import { capitalizeFirst } from '@/lib/pokeapi';

interface PokemonTableProps {
  favorites: FavoritePokemon[];
  onEdit: (pokemon: FavoritePokemon) => void;
  onDelete: (id: number) => void;
}

export function PokemonTable({ favorites, onEdit, onDelete }: PokemonTableProps) {
  if (favorites.length === 0) {
    return (
      <div className={styles.tableContainer}>
        <p style={{ textAlign: 'center', color: '#666' }}>
          No hay Pokémon en tu lista. ¡Usa el botón &quot;Agregar&quot; para guardar tus favoritos!
        </p>
      </div>
    );
  }

  return (
    <div className={styles.tableContainer}>
      <table className={styles.pokemonTable}>
        <thead>
          <tr>
            <th>No</th>
            <th>Nombre</th>
            <th>Hp</th>
            <th>Defensa</th>
            <th>Velocidad</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {favorites.map((pokemon) => (
            <tr key={pokemon.id}>
              <td>{pokemon.id}</td>
              <td>{capitalizeFirst(pokemon.name)}</td>
              <td>{pokemon.hp}</td>
              <td>{pokemon.defense}</td>
              <td>{pokemon.speed}</td>
              <td>
                <button
                  className={`${styles.actionButton} ${styles.editButton}`}
                  onClick={() => onEdit(pokemon)}
                >
                  Editar
                </button>
                <button
                  className={`${styles.actionButton} ${styles.deleteButton}`}
                  onClick={() => onDelete(pokemon.id)}
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
