'use client';
import React from 'react';
import Modal from 'react-modal';
import styles from '../styles/modal.module.css';


Modal.setAppElement('#root');  

function CustomModal({ isOpen, productos, onClose }) {

  if (!productos || productos.length === 0) {
    return null;  
  }

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      contentLabel="Detalles de Productos"
      className={styles.modal}
      overlayClassName={styles.overlay}
    >
      {productos.map((producto, index) => (
  <div key={index}>
   
   <h2>Detalle de cuenta: {producto.categoria === "Compras" ?  producto.productos[0].categoria : producto.tipo}</h2>
  </div>
))}
      {productos.map((producto, index) => (
    <div key={index} className={styles.productosDetalle}>
        
        <table>
            <thead>
                <tr>
                    <th>FECHA</th>
                    <th>PRODUCTO</th>
                    <th>CANTIDAD</th>
                    <th>METODO DE PAGO</th>
                    <th>PRECIO UNITARIO</th>

                </tr>
            </thead>
            <tbody>
            {producto.productos.map((producto, index) => (
                <tr key={index}>
                    <td>{producto.fecha}</td>
                    <td>{producto.producto}</td>
                    <td>{producto.cantidad}</td>
                    <td>{producto.metodoPago}</td>
                   <td>${producto.categoria === 'gastosVariables' || producto.categoria === 'gastosFijos' ? producto.monto : producto.precioUnitario} </td>
                </tr>
                ))}
            <tr>
              <td colSpan={1}>Total del Gasto:</td>
              <td colSpan={6}>${producto.total}</td>
            </tr>
            </tbody>
        </table>
    </div>
))}
      <button onClick={onClose} className={styles.closeButton}>Cerrar</button>
    </Modal>
  );
}

export default CustomModal;
