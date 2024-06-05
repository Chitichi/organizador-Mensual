'use client';
import React, { useState, useEffect } from 'react';
import styles from '../styles/libroDeCuentas.module.css';
import CustomModal from './CustomModal';

function LibroDeCuentas() {
  const [sueldo, setSueldo] = useState({ monto: '', fecha: '', categoria: 'Sueldo'});
  const [sueldoLista, setSueldoLista] = useState([]);
  const [gastosTotales, setGastosTotales] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [filtroMes, setFiltroMes] = useState(() => {
    const fecha = new Date();
    const mes = String(fecha.getMonth() + 1).padStart(2, '0'); 
    const año = fecha.getFullYear();
    return `${mes}/${año}`; 
  });
  const [gastoSeleccionado, setGastoSeleccionado] = useState(null);

  useEffect(() => {
    const guardarSueldoLista = localStorage.getItem('sueldoLista');
    if (guardarSueldoLista) {
      setSueldoLista(JSON.parse(guardarSueldoLista));
    }
  }, []);

  useEffect(() => {
    const allGastos = [
      ...obtenerGastosFijos(),
      ...obtenerGastosVariables(),
      ...obtenerComprasMensuales()
    ];
    setGastosTotales(allGastos);
   
  }, []);
  useEffect(() => {
    console.log(gastosTotales, 'estos son los gastos totales actualizados');
  }, [gastosTotales]);
 
  
  const obtenerGastosFijos = () => {
    const gastosFijos = JSON.parse(localStorage.getItem('gastosMensuales')) || {};
    return Object.values(gastosFijos).flat().map(gasto => ({
      ...gasto,
      tipo: 'Gasto Fijo',

      productos: gasto.productos ? gasto.productos.map(producto => ({
        ...producto,
        fecha: producto.fecha, 
        total: producto.total || gasto.total, 
        tipo: 'Gasto Fijo'
      })) : []
    }));
  };

  const obtenerGastosVariables = () => {
    const gastosVariables = JSON.parse(localStorage.getItem('gastosMensualesVar')) || {};
    return Object.values(gastosVariables).flat().map(gasto => ({
      ...gasto,
      tipo: 'Gasto Variable',
      productos: gasto.productos ? gasto.productos.map(producto => ({
        ...producto,
        fecha: producto.fecha, 
        total: producto.total || gasto.total, 
        tipo: 'Gasto Variable'
      })) : []
    }));
  };

  const obtenerComprasMensuales = () => {
    const comprasMensuales = JSON.parse(localStorage.getItem('comprasMensuales')) || {};
    return Object.values(comprasMensuales).flat().map(compra => ({
      ...compra,
      productos: compra.productos ? compra.productos.map(producto => ({
        ...producto,
        fecha: producto.fecha, 
        total: producto.total,
        tipo: 'Compra'
      })) : []
    }));
  };

  const handleSueldoChange = (e) => {
    const monto = e.target.value;
    setSueldo({ ...sueldo, monto });
  };

  const handleGuardarSueldo = () => {
    if (parseFloat(sueldo.monto) > 0) {
        const nuevoSueldo = {
            ...sueldo,
            fecha: new Date().toLocaleDateString('es-ES', { year: 'numeric', month: '2-digit', day: '2-digit' })
        };
    
        const updatedSueldoLista = [...sueldoLista, nuevoSueldo];
        setSueldoLista(updatedSueldoLista);
        localStorage.setItem('sueldoLista', JSON.stringify(updatedSueldoLista));
        setSueldo({ monto: '', fecha: '', categoria: 'Sueldo' }); 
    } else {
       
        alert('El monto debe ser un número mayor que 0');
    }
};

  const handleFiltroMesChange = (e) => {
    setFiltroMes(e.target.value);
  };

  const meses = [
    { nombre: 'Enero', valor: '01' },
    { nombre: 'Febrero', valor: '02' },
    { nombre: 'Marzo', valor: '03' },
    { nombre: 'Abril', valor: '04' },
    { nombre: 'Mayo', valor: '05' },
    { nombre: 'Junio', valor: '06' },
    { nombre: 'Julio', valor: '07' },
    { nombre: 'Agosto', valor: '08' },
    { nombre: 'Septiembre', valor: '09' },
    { nombre: 'Octubre', valor: '10' },
    { nombre: 'Noviembre', valor: '11' },
    { nombre: 'Diciembre', valor: '12' }
  ];

  const sueldosFiltrados = sueldoLista.filter(item => item.fecha && item.fecha.includes(filtroMes));
  const gastosFiltrados = gastosTotales.filter(gasto =>
    gasto.productos.some(producto => producto.fecha && producto.fecha.includes(filtroMes))
  );
  

  const entradasYSalidas = [...sueldosFiltrados, ...gastosFiltrados].sort((a, b) => {
    const fechaA = new Date(a.fecha.split('/').reverse().join('-'));
    const fechaB = new Date(b.fecha.split('/').reverse().join('-'));
    
    return fechaA - fechaB;
  });

  const totalSueldoMes = sueldosFiltrados.reduce((total, item) => total + parseFloat(item.monto), 0);
  const totalGastosMes = gastosFiltrados.reduce((total, item) => total + parseFloat(item.total || 0), 0); // Asegurarse de que se sume el total

  
  const handleVerDetalle = (producto) => {
    if (producto.categoria === 'Sueldo') {
        console.log("Sueldos no tienen detalles.");
        return;
    }
    console.log("Abriendo modal para:", producto);
    setGastoSeleccionado(producto);
    setModalVisible(true);
    console.log("Modal debería estar visible");
};
  const handleCerrarModal = () => {
    setModalVisible(false);
    setGastoSeleccionado(null); 
  };


  let disponible = 0;
  const disponibleStyle = disponible >= 0 ? { color: 'green' } : { color: 'red' } ;
  return (
    <div className={styles.container}>
 {modalVisible && (
   <CustomModal isOpen={modalVisible} productos={gastoSeleccionado ? [gastoSeleccionado] : []} onClose={handleCerrarModal} />
)}
      <div className={styles.titulo}>
        <h1>Libro de Cuentas</h1>
      </div>
      <div className={styles.ingesosMes}>
      <div>
        <label className={styles.tablaInputSueldo}>
          <p className={styles.p}>Ingresos:</p>
          <input placeholder='ej: $2000' type="number" value={sueldo.monto} onChange={handleSueldoChange} />
          <button className={styles.boton} onClick={handleGuardarSueldo}>Agregar</button>
        </label>
        </div>
        <div className={styles.tablaInputFiltroMes}>
          <label className={styles.tablaInputSueldo}>
            <p className={styles.p}>Mes:</p>
            <select value={filtroMes} onChange={handleFiltroMesChange}>
              <option value="">Seleccionar mes</option>
              {meses.map((mes, index) => (
                <option key={index} value={`${mes.valor}/${new Date().getFullYear()}`}>
                  {mes.nombre}
                </option>
              ))}
            </select>
          </label>
        </div>
        </div>
        
        <div>
          <table className={styles.tabla}>
            <thead className={styles.tablaTr}>
              <tr>
                <th className={styles.tablaTh}>Fecha del Gasto</th>
                <th className={styles.tablaTh}>Tipo de Gasto</th>
                <th className={styles.tablaTh}>Ingreso</th>
                <th className={styles.tablaTh}>Gastos</th>
                <th className={styles.tablaTh}>Disponible</th>
                <th className={styles.tablaTh}>Detalles</th> 
              </tr>
            </thead>
            <tbody>
              {entradasYSalidas.map((item, index) => {
                 console.log("Item en index", index, ":", item); 
                if (item.categoria === 'Sueldo') {
                  disponible += parseFloat(item.monto);
                } else {
                  disponible -= parseFloat(item.total);
                }
                const disponibleStyle = disponible >= 0 ? { color: 'green' } : { color: 'red' };
                return (
                  <tr key={index}>
                    <td className={styles.tablaTd}>{item.categoria === 'Sueldo' ? item.fecha : item.productos[0].fecha}</td>
                    <td className={styles.tablaTd}>{item.tipo || item.categoria}</td>
                    <td className={styles.tablaTdIngresos}>  {item.categoria === 'Sueldo' ? item.monto : ''}</td>
                    <td className={styles.tablaTdGastos}>{item.categoria !== 'Sueldo' ? item.total : ''}</td>
                    <td style={disponibleStyle}>${disponible.toFixed(2)}</td>
                    <td>
          {item.categoria !== 'Sueldo' && (
            <button className={styles.botonDetalles} onClick={() => handleVerDetalle(item)} style={{ cursor: 'pointer' }}>
              Ver Detalles
            </button>
          )}
        </td>
                  </tr>
                );
              })}
             
              <tr><td colSpan={6} className={styles.movimientos}>Movimientos del mes:</td></tr>
              <tr>
                <td colSpan={4} className={styles.finTabla}>Total Ingresos:</td>
                <td colSpan={4} className={styles.tablaTd}>${totalSueldoMes.toFixed(2)}</td>
              </tr>
              <tr>
                <td colSpan={4} className={styles.finTabla}>Total Gastos:</td>
                <td colSpan={4} className={styles.tablaTdGastos}>${totalGastosMes.toFixed(2)}</td>
              </tr>
              <tr>
                <td colSpan={4} className={styles.finTabla}>Total Disponible:</td>
                <td colSpan={4} style={disponibleStyle}>$ { disponible.toFixed(2)}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

  );
}

export default LibroDeCuentas;
