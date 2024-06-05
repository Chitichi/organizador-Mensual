'use client';
import React from 'react';
import Image from "next/image";
import styles from '../styles/editorListaDeCompras.module.css';

function EditorListaDeCompras({
    handleCerrarTabla,
    categoriaSeleccionada, productosPorCategoria, handleProductoChange, handleAgregarProducto, handleEliminarProducto, renderFilasExtras, handleGuardarLista, metodoDePago, onMetodoDePagoChange
}) {
    const safeCategoriaId = categoriaSeleccionada.replace(/[^a-zA-Z0-9]/g, '_');

    return (
        <div className={styles.container}>
            <div className={styles.titulo}>
                <h1>{categoriaSeleccionada}</h1>
                <div className={styles.tituloDiv}>
                <div className={styles.tooltip}>
                    <Image
                        width={20}
                        height={20}
                        src="https://img.icons8.com/dusk/64/cancel--v2.png" 
                        alt="eliminar"
                        onClick={() => handleCerrarTabla(categoriaSeleccionada)}
                    />
                    <span className={styles.tooltiptext}>Cerrar Tabla</span>
                    </div>
                </div>
            </div>
            <div className={styles.selectBoton}>
                <button className={styles.boton} onClick={() => handleAgregarProducto(categoriaSeleccionada, metodoDePago)}>Agregar Producto</button>
                {categoriaSeleccionada && (
                    <label>
                        <select className={styles.tablaInputProducto} id={`metodoDePago_${safeCategoriaId}`} onChange={(e) => onMetodoDePagoChange(e.target.value)} value={metodoDePago}>
                            <option value="efectivo">Efectivo</option>
                            <option value="tarjeta">Tarjeta</option>
                        </select>
                    </label>
                )}
            </div>
            <table className={styles.tabla}>
                <thead>
                    <tr className={styles.tablaTr}>
                        <th className={styles.tablaTh}>PRODUCTO</th>
                        <th className={styles.tablaTh}>CANTIDAD</th>
                        <th className={styles.tablaTh}>PRECIO UNITARIO</th>
                        <th className={styles.tablaTh}>DESCUENTO</th>
                        <th className={styles.tablaTh}>¿LO AGREGUE?</th>
                        <th className={styles.tablaTh}>TOTAL</th>
                        <th className={styles.tablaTh}>ACCION</th>
                    </tr>
                </thead>
                <tbody>
                    {productosPorCategoria[categoriaSeleccionada]?.map((producto, index) => {
                        const productoId = `${safeCategoriaId}_${index}`;
                        return (
                            <tr key={producto.id} className={styles.tablaTr}>
                                <td className={styles.tablaTd}>
                                    <input
                                        placeholder='ej:arroz'
                                        type="text"
                                        id={`producto_${productoId}`}
                                        name={`producto_${productoId}`}
                                        className={styles.inputProducto}
                                        value={producto.producto}
                                        onChange={(e) => handleProductoChange(index, 'producto', e.target.value, categoriaSeleccionada, metodoDePago)}
                                    />
                                </td>
                                <td className={styles.tablaTd}> 
                                    <input
                                        type="number"
                                        min="1"
                                        id={`cantidad_${productoId}`}
                                        name={`cantidad_${productoId}`}
                                        className={styles.tablaInputPequeno}
                                        value={producto.cantidad || ''}
                                        onChange={(e) => handleProductoChange(index, 'cantidad', parseInt(e.target.value), categoriaSeleccionada, metodoDePago)}
                                    />
                                    
                                </td>
                                <td className={styles.tablaTd}>
                                    <input
                                        placeholder='$'
                                        type="number"
                                        step="0.01"
                                        min="0.01"
                                        id={`precioUnitario_${productoId}`}
                                        name={`precioUnitario_${productoId}`}
                                        className={styles.tablaInputPequeno}
                                        value={producto.precioUnitario || ''}
                                        onChange={(e) => handleProductoChange(index, 'precioUnitario', parseFloat(e.target.value), categoriaSeleccionada, metodoDePago)}
                                    />
                                </td>
                                <td className={styles.tablaTd}>
                                    <input
                                        type="number"
                                        min="0"
                                        id={`descuento_${productoId}`}
                                        name={`descuento_${productoId}`}
                                        className={styles.tablaInputPequeno}
                                        value={producto.descuento || ''}
                                        onChange={(e) => handleProductoChange(index, 'descuento', parseFloat(e.target.value), categoriaSeleccionada, metodoDePago)}
                                        placeholder='%'
                                    />
                                    
                                </td>
                                <td className={styles.tablaTd}>
                                    <input
                                        type="checkbox"
                                        id={`enCarrito_${productoId}`}
                                        name={`enCarrito_${productoId}`}
                                        className={styles.checkboxInput}
                                        checked={producto.enCarrito}
                                        onChange={(e) => handleProductoChange(index, "enCarrito", e.target.checked, categoriaSeleccionada, metodoDePago)}
                                    />
                                </td>
                                    <td className={styles.tablaTd}>${(isNaN(producto.total) ? '' : parseFloat(producto.total).toFixed(2))}</td>
                                <td  className={styles.tituloDiv}>
                                <div className={styles.tooltip}>
                                    <Image
                                        priority={true}
                                        width={20}
                                        height={20}
                                        src="https://img.icons8.com/dusk/64/cancel--v2.png" 
                                        alt="eliminar"
                                        onClick={() => handleEliminarProducto(index, categoriaSeleccionada)}
                                    />
                                      <span className={styles.tooltiptext}>Eliminar Producto</span>
                                    </div>                          
                                </td>
                            </tr>
                        );
                    })}
                    {renderFilasExtras(categoriaSeleccionada, metodoDePago)}
                </tbody>
            </table>
            <button className={styles.boton} onClick={() => handleGuardarLista(categoriaSeleccionada, metodoDePago)}>Guardar Lista</button>
        </div>
    );
}

export default EditorListaDeCompras;
