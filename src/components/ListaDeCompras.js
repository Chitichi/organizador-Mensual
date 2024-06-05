'use client';
import React, { useState, useEffect } from "react";
import { v4 as uuidv4 } from 'uuid';
import GestorCategorias from './GestorCategorias';
import EditorListaDeCompras from './EditorListaDeCompras';
import styles from '../styles/editorListaDeCompras.module.css';

function ListaDeCompras() {

    const [categoriasCompras, setCategoriasCompras] = useState(['Supermercado', 'Mascotas', 'Verdulería', 'Carnicería']);
    const [categoriaSeleccionada, setCategoriaSeleccionada] = useState('');
    const [productosPorCategoria, setProductosPorCategoria] = useState({});
    const [metodosDePagoPorCategoria, setMetodosDePagoPorCategoria] = useState({});
    const [listasCompletadas, setListasCompletadas] = useState([]);
    const [categoriasActivas, setCategoriasActivas] = useState([]);
    const [comprasMensuales, setComprasMensuales] = useState({});

    const fecha = new Date();
    const dia = String(fecha.getDate()).padStart(2, '0');
    const mes = String(fecha.getMonth() + 1).padStart(2, '0');
    const año = fecha.getFullYear();
    const fechaDia = `${dia}/${mes}/${año}`;
    const fechaMes = `${mes}/${año}`;

  
    useEffect(() => {
        const savedProductos = localStorage.getItem('productosPorCategoria');
        const savedMetodosDePagoPorCategoria = localStorage.getItem('metodosDePagoPorCategoria');
        const savedListasCompletadas = localStorage.getItem('listasCompletadas');
        const savedCategoriasCompras = localStorage.getItem('categoriasCompras');
        const savedCategoriasActivas = localStorage.getItem('categoriasActivas');
        const savedComprasMensuales = localStorage.getItem('comprasMensuales');
    
        if (savedProductos) {
            setProductosPorCategoria(JSON.parse(savedProductos));
        } else {
            const initialProductos = categoriasCompras.reduce((acc, categoria) => {
                acc[categoria] = [];
                return acc;
            }, {});
            setProductosPorCategoria(initialProductos);
        }
    
        if (savedMetodosDePagoPorCategoria) {
            setMetodosDePagoPorCategoria(JSON.parse(savedMetodosDePagoPorCategoria));
        } else {
            const initialMetodosDePago = categoriasCompras.reduce((acc, categoria) => {
                acc[categoria] = 'efectivo';
                return acc;
            }, {});
            setMetodosDePagoPorCategoria(initialMetodosDePago);
        }
    
        if (savedListasCompletadas) {
            setListasCompletadas(JSON.parse(savedListasCompletadas));
        }
    
        if (savedCategoriasCompras) {
            setCategoriasCompras(JSON.parse(savedCategoriasCompras));
        }
    
        if (savedCategoriasActivas) {
            setCategoriasActivas(JSON.parse(savedCategoriasActivas));
        }
        if (savedComprasMensuales) {
            setComprasMensuales(JSON.parse(savedComprasMensuales));
        }
       
    }, []);
    useEffect(() => {
        console.log('Listas completadas actualizadas:', listasCompletadas);
    }, [listasCompletadas]);
    useEffect(() => {
        localStorage.setItem('productosPorCategoria', JSON.stringify(productosPorCategoria));
    }, [productosPorCategoria]);

    useEffect(() => {
        localStorage.setItem('listasCompletadas', JSON.stringify(listasCompletadas));
    }, [listasCompletadas]);

    useEffect(() => {
        localStorage.setItem('categoriasCompras', JSON.stringify(categoriasCompras));
    }, [categoriasCompras]);

    useEffect(() => {
        localStorage.setItem('categoriasActivas', JSON.stringify(categoriasActivas));
    }, [categoriasActivas]);

    useEffect(() => {
        localStorage.setItem('metodosDePagoPorCategoria', JSON.stringify(metodosDePagoPorCategoria));
    }, [metodosDePagoPorCategoria]);
    useEffect(() => {
        localStorage.setItem('comprasMensuales', JSON.stringify(comprasMensuales));
    }, [comprasMensuales]);

    useEffect(() => {
        console.log("Estado de gastos mensuales:", comprasMensuales);
    }, [comprasMensuales]);

    const handleCategoriaChange = (e) => {
        const categoria = e.target.value;
        if (categoria === "Agregar nueva categoría") {
            const nuevaCategoria = prompt("Ingrese el nombre de la nueva categoría:");
            if (nuevaCategoria && nuevaCategoria.trim() !== '') {
                const nuevasCategorias = [...categoriasCompras, nuevaCategoria];
                setCategoriasCompras(nuevasCategorias);
                setCategoriaSeleccionada(nuevaCategoria);
                setProductosPorCategoria(prevProductos => ({
                    ...prevProductos,
                    [nuevaCategoria]: []
                }));
                setMetodosDePagoPorCategoria(prevMetodos => ({
                    ...prevMetodos,
                    [nuevaCategoria]: 'efectivo' 
                }));
                if (!categoriasActivas.includes(nuevaCategoria)) {
                    setCategoriasActivas(prevActivas => [...prevActivas, nuevaCategoria]);
                }
            }
        } else {
            setCategoriaSeleccionada(categoria);
            if (!categoriasActivas.includes(categoria)) {
                setCategoriasActivas(prevActivas => [...prevActivas, categoria]);
            }
    
            
            if (!metodosDePagoPorCategoria[categoria]) {
                setMetodosDePagoPorCategoria(prevMetodos => ({
                    ...prevMetodos,
                    [categoria]: 'efectivo' 
                }));
            }
        }
    };
    
    const handleMetodoDePagoChange = (categoriaSeleccionada, nuevoMetodoDePago) => {
        setMetodosDePagoPorCategoria(prevMetodos => ({
            ...prevMetodos,
            [categoriaSeleccionada]: nuevoMetodoDePago
        }));
    
        const productosActualizados = { ...productosPorCategoria };
        productosActualizados[categoriaSeleccionada] = productosActualizados[categoriaSeleccionada] || [].map(producto => {
            if (nuevoMetodoDePago === 'tarjeta') {
                producto.totalConIntereses = parseFloat(producto.total) + (parseFloat(producto.total) * ((parseFloat(producto.intereses) || 0) / 100));
                producto.totalPorCuota = producto.totalConIntereses / (parseInt(producto.cantidadDeCuotas) || 1);
            } else {
                producto.totalConIntereses = undefined;
                producto.totalPorCuota = undefined;
            }
            return producto;
        });
        setProductosPorCategoria(productosActualizados);
    };
    const handleAgregarProducto = (categoria) => {
        const metodoDePago = metodosDePagoPorCategoria[categoria] || 'efectivo'; 
        const nuevoProducto = {
            id: uuidv4(),
            metodoPago: metodoDePago,
            categoria: categoria,
            producto: "",
            cantidad: 1,
            precioUnitario: 0,
            descuento: 0,
            total: 0,
            enCarrito: false,
            fecha: fechaDia,
            cantidadDeCuotas: metodoDePago === "tarjeta" ? 1 : "",
            intereses: metodoDePago === "tarjeta" ? 0 : "",
            totalCompraTarjeta: metodoDePago === "tarjeta" ? 0 : "",
            totalPorCuota: metodoDePago === "tarjeta" ? 0 : ""
        };
        const productosActualizados = { ...productosPorCategoria };
    
        if (!Array.isArray(productosActualizados[categoria])) {
            productosActualizados[categoria] = [];
        }
    
        productosActualizados[categoria].push(nuevoProducto);
        setProductosPorCategoria(productosActualizados);
    };

    const handleProductoChange = (index, field, value, categoria, metodoDePago) => {
        const productosActualizados = { ...productosPorCategoria };
        const listaActualizada = productosActualizados[categoria];
        const producto = listaActualizada[index];

        producto[field] = value;

        if (field === 'cantidad' || field === 'precioUnitario' || field === 'descuento') {
            const precioUnitario = parseFloat(producto.precioUnitario) || 0;
            const cantidad = parseFloat(producto.cantidad) || 0;
            const descuento = parseFloat(producto.descuento) || 0;

            producto.total = (precioUnitario * cantidad) - ((precioUnitario * cantidad) * (descuento / 100));
        }

        if (metodoDePago === "tarjeta" && (field === 'intereses' || field === 'cantidadDeCuotas')) {
            producto.totalConIntereses = parseFloat(producto.total) + (parseFloat(producto.total) * ((parseFloat(producto.intereses) || 0) / 100));
            producto.totalPorCuota = producto.totalConIntereses / (parseInt(producto.cantidadDeCuotas) || 1);
        }

        listaActualizada[index] = producto;
        setProductosPorCategoria(productosActualizados);
    };

    const handleCerrarTabla = (categoria) => {
        const confirmed = window.confirm("¿Está seguro de eliminar esta tabla?");
        if (confirmed) {
            const categoriasActualizadas = categoriasActivas.filter(cat => cat !== categoria);
            setCategoriasActivas(categoriasActualizadas);
    
            const productosActualizados = { ...productosPorCategoria };
            delete productosActualizados[categoria];
            setProductosPorCategoria(productosActualizados);
    
            const metodosDePagoActualizados = { ...metodosDePagoPorCategoria };
            delete metodosDePagoActualizados[categoria];
            setMetodosDePagoPorCategoria(metodosDePagoActualizados);
            setCategoriaSeleccionada('');
        }
    };
    

    const handleEliminarProducto = (index, categoria) => {
        const productosActualizados = { ...productosPorCategoria };
        const listaActualizada = productosActualizados[categoria];

        listaActualizada.splice(index, 1);

        setProductosPorCategoria({
            ...productosPorCategoria,
            [categoria]: listaActualizada
        });
    };

    const handleGuardarLista = (categoria, metodoDePago) => {
        const productosEnCategoria = productosPorCategoria[categoria];

        if (!productosEnCategoria || productosEnCategoria.length === 0) {
            return alert("Por favor agrega productos antes de guardar.");
        }

        const todosCompletos = productosEnCategoria.every(prod => prod.producto.trim() !== "" && parseFloat(prod.precioUnitario) > 0);
        if (!todosCompletos) {
            return alert("Por favor complete los campos Producto y Precio Unitario antes de guardar.");
        }

        const productosNoMarcados = productosEnCategoria.filter(prod => !prod.enCarrito);
        if (productosNoMarcados.length > 0) {
            alert(`Hay ${productosNoMarcados.length} productos no marcados como "agregado". Por favor, márquelos o elimínelos antes de guardar.`);
            return;
        }

        let nuevaLista;

        if (metodoDePago === "efectivo") {
            const totalCompra = productosEnCategoria.reduce((total, producto) => total + parseFloat(producto.total || 0), 0);
            nuevaLista = {
                id: uuidv4(),
                fecha: fechaMes,
                categoria: 'Compras',
                metodoDePago: metodoDePago,
                productos: productosEnCategoria,
                total: totalCompra.toFixed(2)
            };
        } else if (metodoDePago === "tarjeta") {
            const totalCompraTarjeta = productosEnCategoria.reduce((total, producto) => total + parseFloat(producto.totalConIntereses || 0), 0);
            nuevaLista = {
                id: uuidv4(),
                fecha: fechaMes,
                categoria: 'Compras',
                metodoDePago: metodoDePago,
                productos: productosEnCategoria,
                total: totalCompraTarjeta.toFixed(2)
            };
        }

        const nuevasListas = [...listasCompletadas, nuevaLista];
        setListasCompletadas(nuevasListas);
        localStorage.setItem('listasCompletadas', JSON.stringify(nuevasListas));
        
        setMetodosDePagoPorCategoria(prevMetodos => ({
            ...prevMetodos,
            [categoria]: 'efectivo'
        }));
        setCategoriaSeleccionada('');

        const categoriasActualizadas = categoriasActivas.filter(cat => cat !== categoria);
        setCategoriasActivas(categoriasActualizadas);

        const productosActualizados = { ...productosPorCategoria };
        delete productosActualizados[categoria];
        setProductosPorCategoria(productosActualizados);


        if (metodoDePago === 'efectivo') {
            const mesActual = nuevaLista.fecha;
            const nuevasComprasMensuales = {
                ...comprasMensuales,
                [mesActual]: [...(Array.isArray(comprasMensuales[mesActual]) ? comprasMensuales[mesActual] : []), nuevaLista]
            };
            setComprasMensuales(nuevasComprasMensuales);
            localStorage.setItem("comprasMensuales", JSON.stringify(nuevasComprasMensuales));
        }

        alert("Lista guardada con éxito!");
        console.log("Listas Completadas:", nuevasListas);
    };

    const renderFilasExtras = (categoria, metodoDePago) => {
        const productosEnCategoria = productosPorCategoria[categoria];
    
        if (!Array.isArray(productosEnCategoria) || productosEnCategoria.length === 0) {
            return null;
        }
    
        const subtotal = productosEnCategoria.reduce((total, producto) => total + parseFloat(producto.total || 0), 0);
    
        if (metodoDePago === "tarjeta") {
            const ultimoProducto = productosEnCategoria[productosEnCategoria.length - 1];
            const intereses = parseFloat(ultimoProducto.intereses || 0) / 100;
            const cantidadDeCuotas = parseInt(ultimoProducto.cantidadDeCuotas || 1);
            const totalConIntereses = subtotal * (1 + intereses);
            const totalPorCuota = totalConIntereses / cantidadDeCuotas;
    
            return (
                <React.Fragment key={`${categoria}-filas-extras`}>
                    <tr>
                        <td colSpan="4"></td>
                        <td colSpan="1" className={styles.tablaTdExtra}>Subtotal:</td>
                        <td colSpan="1" className={styles.tablaTd}>${subtotal.toFixed(2)}</td>
                    </tr>
                    <tr>
                        <td colSpan="4"></td>
                        <td colSpan="1" className={styles.tablaTdExtra}>Cantidad de cuotas:</td>
                        <td colSpan="1">
                            <input
                                className={styles.tablaInputPequeno}
                                type="number"
                                id={`cuotas_${categoria}_${productosEnCategoria.length - 1}`}
                                name={`cuotas_${categoria}_${productosEnCategoria.length - 1}`}
                                value={ultimoProducto.cantidadDeCuotas || ''}
                                onChange={(event) => handleProductoChange(productosEnCategoria.length - 1, 'cantidadDeCuotas', parseInt(event.target.value), categoria, metodoDePago)}
                            />
                        </td>
                    </tr>
                    <tr>
                        <td colSpan="4"></td>
                        <td colSpan="1" className={styles.tablaTdExtra}>Intereses: (%)</td>
                        <td colSpan="1" className={styles.tablaTd}>
                            <input
                                className={styles.tablaInputPequeno}
                                type="number"
                                id={`intereses_${categoria}_${productosEnCategoria.length - 1}`}
                                name={`intereses_${categoria}_${productosEnCategoria.length - 1}`}
                                value={ultimoProducto.intereses || ''}
                                onChange={(event) => handleProductoChange(productosEnCategoria.length - 1, 'intereses', parseFloat(event.target.value) || 0, categoria, metodoDePago)}
                            />
                        </td>
                    </tr>
                    <tr>
                        <td colSpan="4"></td>
                        <td colSpan="1" className={styles.tablaTdExtra}>Total con tarjeta:</td>
                        <td colSpan="1" className={styles.tablaTd}>${totalConIntereses.toFixed(2)}</td>
                    </tr>
                    <tr>
                        <td colSpan="4"></td>
                        <td colSpan="1" className={styles.tablaTdExtra}>Total por cuota:</td>
                        <td colSpan="1" className={styles.tablaTd}>${totalPorCuota.toFixed(2)}</td>
                    </tr>
                </React.Fragment>
            );
        } else if (metodoDePago === "efectivo") {
            return (
                <tr key={`${categoria}-filas-extras`}>
                    <td colSpan="4"></td>
                    <td colSpan="1" className={styles.tablaTdExtra}>Total:</td>
                    <td colSpan="1" className={styles.tablaTd}>${subtotal.toFixed(2)}</td>
                </tr>
            );
        } else {
            return null;
        }
    };
    

    return (
     
        <div className={styles.fondoListaCompras}>
            <GestorCategorias
                categorias={categoriasCompras}
                categoriaSeleccionada={categoriaSeleccionada}
                onCategoriaChange={handleCategoriaChange}
            />
            {categoriasActivas.map((categoria) => (
                <div key={categoria}>
                    <EditorListaDeCompras
                        categoriaSeleccionada={categoria}
                        productosPorCategoria={productosPorCategoria}
                        handleProductoChange={(index, field, value) => handleProductoChange(index, field, value, categoria, metodosDePagoPorCategoria[categoria])}
                        handleAgregarProducto={() => handleAgregarProducto(categoria, metodosDePagoPorCategoria[categoria])}
                        handleEliminarProducto={handleEliminarProducto}
                        renderFilasExtras={() => renderFilasExtras(categoria, metodosDePagoPorCategoria[categoria])}
                        handleGuardarLista={() => handleGuardarLista(categoria, metodosDePagoPorCategoria[categoria])}
                        metodoDePago={metodosDePagoPorCategoria[categoria]}
                        onMetodoDePagoChange={(nuevoMetodo) => handleMetodoDePagoChange(categoria, nuevoMetodo)}
                        handleCerrarTabla={handleCerrarTabla}
                    />
                   
                </div>
                
            ))}
        </div>
 
    );
}

export default ListaDeCompras;
