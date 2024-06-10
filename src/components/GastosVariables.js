'use client';
import React, { useState, useEffect } from "react";
import { v4 as uuidv4 } from 'uuid';
import styles from "../styles/gastosVariables.module.css";
import Image from "next/image";

function GastosVariables() {
    const [productos, setProductos] = useState([]);
    const [listaDeGastosVariables, setListaDeGastosVariables] = useState([]);
    const [totalGastosVariables, setTotalGastosVariables] = useState(0);
    const [gastosMensualesVar, setGastosMensualesVar] = useState({});

    useEffect(() => {
        const storedProductos = JSON.parse(localStorage.getItem("productos"));
        if (storedProductos) {
            setProductos(storedProductos);
        }
    }, []);

    useEffect(() => {
        const storedListaDeGastosVariables = JSON.parse(localStorage.getItem("listaDeGastosVariables"));
        if (storedListaDeGastosVariables) {
            setListaDeGastosVariables(storedListaDeGastosVariables);
        }
    }, []);

    useEffect(() => {
        const storedGastosMensualesVar = JSON.parse(localStorage.getItem("gastosMensualesVar"));
        if (storedGastosMensualesVar) {
            setGastosMensualesVar(storedGastosMensualesVar);
        }
    }, []);

    useEffect(() => {
        const totalVariables = productos
            .filter(producto => producto.categoria === "gastosVariables")
            .reduce((acc, curr) => acc + parseFloat(curr.monto || 0), 0);
        setTotalGastosVariables(totalVariables);
    }, [productos]);

    useEffect(() => {
        console.log("Gastos variables actualizados", listaDeGastosVariables);
    }, [listaDeGastosVariables]);

    useEffect(() => {
        console.log("Estado de gastos mensuales:", gastosMensualesVar);
    }, [gastosMensualesVar]);

    const fecha = new Date();
    const dia = String(fecha.getDate()).padStart(2, '0');
    const mes = String(fecha.getMonth() + 1).padStart(2, '0');
    const año = fecha.getFullYear();
    const fechaMes = `${mes}/${año}`;
    const fechaActual = `${dia}/${mes}/${año}`;

    const handleAgregarProducto = () => {
        const nuevoProducto = {
            id: uuidv4(),
            categoria: "gastosVariables",
            fecha: fechaActual,
            producto: "",
            monto: 0
        };

        setProductos([...productos, nuevoProducto]);
    };

    const handleGuardarGastos = () => {
        const gastosVariables = productos.filter(producto => producto.categoria === "gastosVariables");


        const incompletos = gastosVariables.some(producto => producto.producto.trim() === "" || parseFloat(producto.monto) === 0);
        if (incompletos) {
            alert("Complete los campos Producto y Monto antes de guardar.");
            return;
        }

        if (gastosVariables.length === 0) {
            alert("No hay gastos variables para guardar.");
            return;
        }

        const totalVariables = gastosVariables.reduce((acc, curr) => acc + parseFloat(curr.monto || 0), 0);

        const nuevaListaDeGastosVariables = {
            id: uuidv4(),
            categoria: "Gastos Variables",
            fecha: fechaMes,
            total: totalVariables,
            productos: [...gastosVariables]
        };

        const listaDeGastosCompleta = [...listaDeGastosVariables, nuevaListaDeGastosVariables];
        setListaDeGastosVariables(listaDeGastosCompleta);
        localStorage.setItem("listaDeGastosVariables", JSON.stringify(listaDeGastosCompleta));

        setTotalGastosVariables(totalVariables);

     
        const mesActual = nuevaListaDeGastosVariables.fecha;
        const nuevosGastosMensuales = {
            ...gastosMensualesVar,
            [mesActual]: [...(Array.isArray(gastosMensualesVar[mesActual]) ? gastosMensualesVar[mesActual] : []), nuevaListaDeGastosVariables]
        };
        setGastosMensualesVar(nuevosGastosMensuales);
        localStorage.setItem("gastosMensualesVar", JSON.stringify(nuevosGastosMensuales));

        alert("Gastos variables guardados con éxito!");

  
        const productosRestantes = productos.filter(producto => producto.categoria !== "gastosVariables");
        setProductos(productosRestantes);
        localStorage.setItem("productos", JSON.stringify(productosRestantes));
    };

    const handleProductoChange = (index, campo, valor) => {
        const updatedProductos = [...productos];
        updatedProductos[index][campo] = valor;
        setProductos(updatedProductos);
    };

    useEffect(() => {
        localStorage.setItem("productos", JSON.stringify(productos));
    }, [productos]);

    const handleDeleteProducto = (id) => {
        const updatedProductos = productos.filter(producto => producto.id !== id);
        setProductos(updatedProductos);
        localStorage.setItem("productos", JSON.stringify(updatedProductos));
    };

    return (
        <div className={styles.fondoGastos}>
            <div className={styles.tituloDiv}>
                <div className={styles.titulo}>
                    <h1>Gastos Variables</h1>
                </div>
                <button className={styles.botonUno} onClick={handleAgregarProducto}>Agregar Gasto Variable</button>
                <div className={styles.tabla}>
                    <div className={styles.tablastyle}>
                        <table>
                            <thead>
                                <tr>
                                    <th className={styles.tablaTh}>FECHA</th>
                                    <th className={styles.tablaTh}>PRODUCTO</th>
                                    <th className={styles.tablaTh}>MONTO DE COMPRA</th>
                                    <th className={styles.tablaTh}>ACCIÓN</th>
                                </tr>
                            </thead>
                            <tbody>
                                {productos.length > 0 ? (
                                    productos.map((producto, index) => (
                                        <tr key={producto.id}>
                                            <td className={styles.tablaTd}>{producto.fecha}</td>
                                            <td className={styles.tablaTd}>
                                                <input
                                                    id={`producto_${producto.id}`}
                                                    name={`producto_${producto.id}`}
                                                    className={styles.inputProducto}
                                                    placeholder="ej: Mastercard"
                                                    value={producto.producto}
                                                    onChange={(e) => handleProductoChange(index, "producto", e.target.value)}
                                                />
                                            </td>
                                            <td className={styles.tablaTd}>
                                                <input
                                                    id={`monto_${producto.id}`}
                                                    name={`monto_${producto.id}`}
                                                    className={styles.tablaInputPequeno}
                                                    placeholder="Monto total de la compra"
                                                    value={producto.monto}
                                                    onChange={(e) => handleProductoChange(index, "monto", parseFloat(e.target.value) || 0)}
                                                />
                                            </td>
                                            <td className={styles.imagen}>
                                                <div className={styles.tooltip}>
                                                    <Image
                                                        priority={true}
                                                        width={20}
                                                        height={20}
                                                        src="https://img.icons8.com/dusk/64/cancel--v2.png" 
                                                        alt="eliminar"
                                                        onClick={() => handleDeleteProducto(producto.id)}
                                                    />
                                                    <span className={styles.tooltiptext}>Eliminar Producto</span>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="4" style={{ textAlign: "center" }}>No hay gastos variables para mostrar.</td>
                                    </tr>
                                )}
                                <tr className={styles.total}>
                                    <td colSpan="2">Total Gastos:</td>
                                    <td colSpan="1"> ${totalGastosVariables} </td>
                                </tr>
                            </tbody>
                        </table>
                <button className={styles.boton} onClick={handleGuardarGastos}>Guardar</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default GastosVariables;
