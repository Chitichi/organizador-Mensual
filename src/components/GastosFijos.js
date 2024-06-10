'use client';
import React, { useState, useEffect } from "react";
import { v4 as uuidv4 } from 'uuid';
import styles from "../styles/gastosFijos.module.css";
import Image from "next/image";

function GastosFijos() {

    const [productos, setProductos] = useState([]);
    const [listaDeGastosFijos, setListaDeGastosFijos] = useState([]);
    const [totalGastosFijos, setTotalGastosFijos] = useState(0);
    const [gastosMensuales, setGastosMensuales] = useState({});
    

    useEffect(() => {
  
        const storedProductos = JSON.parse(localStorage.getItem("productos")) || [];
        setProductos(storedProductos);

        const storedListaDeGastosFijos = JSON.parse(localStorage.getItem("listaDeGastosFijos")) || [];
        setListaDeGastosFijos(storedListaDeGastosFijos);

        const storedGastosMensuales = JSON.parse(localStorage.getItem("gastosMensuales")) || {};
        setGastosMensuales(storedGastosMensuales);
    }, []);

    useEffect(() => {
        const total = productos
            .filter(producto => producto.pagado)
            .reduce((acc, curr) => acc + parseFloat(curr.monto || 0), 0);
        setTotalGastosFijos(total);
    }, [productos]);

    useEffect(() => {
        console.log("Gastos fijos actualizados", listaDeGastosFijos);
    }, [listaDeGastosFijos]);
    useEffect(() => {
        console.log("Estado de gastos mensuales:", gastosMensuales);
    }, [gastosMensuales]);

    const fecha = new Date();
    const dia = String(fecha.getDate()).padStart(2, '0');
    const mes = String(fecha.getMonth() + 1).padStart(2, '0');
    const año = fecha.getFullYear();
    const fechaMes = `${mes}/${año}`;
    const fechaActual = `${dia}/${mes}/${año}`;

    const handleAgregarProducto = () => {
        const nuevoProducto = {
            id: uuidv4(),
            categoria: "gastosFijos",
            fecha: fechaActual,
            producto: "",
            monto: 0,
            vencimiento: "",
            pagado: false
        };

        const nuevosProductos = [...productos, nuevoProducto];
        setProductos(nuevosProductos);
        localStorage.setItem("productos", JSON.stringify(nuevosProductos));
    };

    const handleGuardarGastos = () => {
        const gastosFijosPagados = productos.filter(producto => producto.pagado);

     
        const incompletos = productos.some(producto => producto.producto.trim() === "" || parseFloat(producto.monto) === 0);
        if (incompletos) {
            alert("Complete los campos Producto y Monto antes de guardar.");
            return;
        }

        if (gastosFijosPagados.length === 0) {
            alert("No hay gastos fijos pagados para guardar.");
            return;
        }

        const todosPagados = productos.every(producto => producto.pagado);
        if (!todosPagados) {
            alert("Aún faltan gastos fijos por pagar.");
            return;
        }

        const totalFijos = gastosFijosPagados.reduce((acc, curr) => acc + parseFloat(curr.monto || 0), 0);

        const nuevaListaDeGastosFijos = {
            id: uuidv4(),
            categoria: "Gastos Fijos",
            fecha: fechaMes,
            total: totalFijos,
            productos: [...gastosFijosPagados]
        };

        const listaDeGastosCompleta = [...listaDeGastosFijos, nuevaListaDeGastosFijos];
        setListaDeGastosFijos(listaDeGastosCompleta);
        localStorage.setItem("listaDeGastosFijos", JSON.stringify(listaDeGastosCompleta));

        setTotalGastosFijos(totalFijos);

 
        const mesActual = nuevaListaDeGastosFijos.fecha;
        const nuevosGastosMensuales = {
            ...gastosMensuales,
            [mesActual]: [...(Array.isArray(gastosMensuales[mesActual]) ? gastosMensuales[mesActual] : []), nuevaListaDeGastosFijos]
        };
        setGastosMensuales(nuevosGastosMensuales);
        localStorage.setItem("gastosMensuales", JSON.stringify(nuevosGastosMensuales));

        alert("Gastos fijos guardados con éxito!");


        const productosRestantes = productos.filter(producto => !producto.pagado);
        setProductos(productosRestantes);
        localStorage.setItem("productos", JSON.stringify(productosRestantes));
    };

    const handleProductoChange = (index, campo, valor) => {
        const updatedProductos = [...productos];
        updatedProductos[index][campo] = valor;
        setProductos(updatedProductos);
        localStorage.setItem("productos", JSON.stringify(updatedProductos));
    };

    const handleDeleteProducto = (id) => {
        const updatedProductos = productos.filter(producto => producto.id !== id);
        setProductos(updatedProductos);
        localStorage.setItem("productos", JSON.stringify(updatedProductos));
    };

    return (
        <div>
            <div className={styles.tituloDiv}>
                <div className={styles.titulo}>
                    <h1>Gastos Fijos</h1>
                </div>
                <div>
                    <button className={styles.botonUno} onClick={handleAgregarProducto}>Agregar Gasto Fijo</button>
                    <div className={styles.tabla}>
                        <div >
                            <table>
                                <thead>
                                    <tr>
                                        <th className={styles.tablaTh}>FECHA</th>
                                        <th className={styles.tablaTh}>PRODUCTO</th>
                                        <th className={styles.tablaTh}>MONTO</th>
                                        <th className={styles.tablaTh}>VENCIMIENTO</th>
                                        <th className={styles.tablaTh}>¿YA LO PAGUÉ?</th>
                                        <th className={styles.tablaTh}>ACCIÓN</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {productos.length > 0 ? (
                                        productos.map((producto, index) => (
                                            <tr key={producto.id}>
                                                <td className={styles.tablaTd}>{producto.fecha}</td>
                                                <td>
                                                    <input
                                                        id={`producto_${producto.id}`}
                                                        name={`producto_${producto.id}`}
                                                        className={styles.inputProducto}
                                                        placeholder="Ej: Luz, Alquiler"
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
                                                <td className={styles.tablaTd}>
                                                    <input
                                                        id={`vencimiento_${producto.id}`}
                                                        name={`vencimiento_${producto.id}`}
                                                        className={styles.inputProducto}
                                                        type="date"
                                                        value={producto.vencimiento}
                                                        onChange={(e) => handleProductoChange(index, "vencimiento", e.target.value)}
                                                    />
                                                </td>
                                                <td className={styles.tablaTd}>
                                                    <input
                                                        id={`pagado_${producto.id}`}
                                                        name={`pagado_${producto.id}`}
                                                        className={styles.checkboxInput}
                                                        type="checkbox"
                                                        checked={producto.pagado}
                                                        onChange={(e) => handleProductoChange(index, "pagado", e.target.checked)}
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
                                            <td colSpan="6" style={{ textAlign: "center" }}>No hay gastos fijos para mostrar.</td>
                                        </tr>
                                    )}
                                    <tr className={styles.total}>
                                        <td colSpan="3"></td>
                                        <td>Total Gastos: </td>
                                        <td colSpan="1"> ${totalGastosFijos} </td>
                                    </tr>
                                </tbody>
                            </table>
                            <button className={styles.boton} onClick={handleGuardarGastos}>Guardar</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default GastosFijos;
