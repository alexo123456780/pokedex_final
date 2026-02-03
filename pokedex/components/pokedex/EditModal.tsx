'use client';

import { useState, useEffect } from 'react';
import styles from './pokedex.module.css';
import { FavoritePokemon } from '@/types/pokemon';

interface EditModalProps {
  isOpen: boolean;
  pokemon: FavoritePokemon | null;
  onClose: () => void;
  onSave: (id: number, newName: string) => void;
}

export function EditModal({ isOpen, pokemon, onClose, onSave }: EditModalProps) {
  const [name, setName] = useState('');

  useEffect(() => {
    if (pokemon) {
      setName(pokemon.name);
    }
  }, [pokemon]);

  const handleSave = () => {
    if (pokemon && name.trim()) {
      onSave(pokemon.id, name.trim());
      onClose();
    }
  };

  return (
    <div className={`${styles.modalOverlay} ${isOpen ? styles.active : ''}`}>
      <div className={styles.modalContent}>
        <h3>Editar Pokémon</h3>
        <label>Nombre</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Nombre del Pokémon"
        />
        <div className={styles.modalButtons}>
          <button
            className={`${styles.modalButton} ${styles.cancelButton}`}
            onClick={onClose}
          >
            Cancelar
          </button>
          <button
            className={`${styles.modalButton} ${styles.saveButton}`}
            onClick={handleSave}
          >
            Guardar
          </button>
        </div>
      </div>
    </div>
  );
}
