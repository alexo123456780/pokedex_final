'use client';

import { useState, useEffect } from 'react';
import styles from './pokedex.module.css';
import { LeftPanel } from './LeftPanel';
import { RightPanel } from './RightPanel';
import { Binding } from './Binding';
import { PokemonTable } from './PokemonTable';
import { EditModal } from './EditModal';
import { usePokemon } from '@/hooks/usePokemon';
import { useFavorites } from '@/hooks/useFavorites';
import { FavoritePokemon } from '@/types/pokemon';

export function PokedexContainer() {
  const { pokemon, loading, fetchPokemonById, nextPokemon, prevPokemon, searchByNumber, nextEvolution, prevEvolution } = usePokemon();
  const { favorites, add, remove, update } = useFavorites();
  const [editingPokemon, setEditingPokemon] = useState<FavoritePokemon | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchPokemonById(1);
  }, [fetchPokemonById]);

  const handleAdd = () => {
    if (pokemon) {
      add(pokemon);
    }
  };

  const handleEdit = (poke: FavoritePokemon) => {
    setEditingPokemon(poke);
    setIsModalOpen(true);
  };

  const handleSave = (id: number, newName: string) => {
    update(id, newName);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingPokemon(null);
  };

  return (
    <>
      <div className={styles.container}>
        <div className={styles.pokedexWrapper}>
          <LeftPanel
            pokemon={pokemon}
            loading={loading}
            onPrev={prevPokemon}
            onNext={nextPokemon}
            onPrevEvolution={prevEvolution}
            onNextEvolution={nextEvolution}
          />
          <Binding />
          <RightPanel
            pokemon={pokemon}
            onSearch={searchByNumber}
            onAdd={handleAdd}
          />
        </div>
      </div>
      
      <PokemonTable
        favorites={favorites}
        onEdit={handleEdit}
        onDelete={remove}
      />
      
      <EditModal
        isOpen={isModalOpen}
        pokemon={editingPokemon}
        onClose={handleCloseModal}
        onSave={handleSave}
      />
    </>
  );
}
