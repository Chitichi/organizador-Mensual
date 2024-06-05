'use client';
import React from 'react';
import styles from '../styles/gestorCategorias.module.css';

function GestorCategorias({ categorias, categoriaSeleccionada, onCategoriaChange  }) {
    return (
        <div className={styles.titulo}>
            <h1>Listas de Compras</h1>
            <div className={styles.categoria}>
            <label>
                <select id="seleccioneCategoria" onChange={onCategoriaChange} value={categoriaSeleccionada}>
                    <option value="">Seleccione una Categoría</option>
                    {categorias.map((categoria, index) => (
                        <option key={index} value={categoria}>{categoria}</option>
                    ))}
                    <option value="Agregar nueva categoría">Agregar nueva categoría</option>
                </select>
            </label>
            </div>
        </div>
    );
}

export default GestorCategorias;
