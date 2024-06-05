'use client';
import Image from "next/image";
import Link from "next/link";
import styles from '../styles/page.module.css';

export default function Page() {
  return (
    <main className={styles.container}>
    <div >
      <h1>Mi organizador Mensual</h1>
      <div className={styles.imagenes}>
      <Link href="/listaDeCompras" legacyBehavior>
      <a className={styles.linkItem}>
          
          <Image
           priority={true}
            width={64}
            height={64}
            src="https://img.icons8.com/dusk/64/shopping-cart-loaded--v1.png"
            alt="shopping-cart-loaded--v1"
           
          />
        <h3>Lista de compras</h3>
        </a>
      </Link>
      <Link href="/gastos" legacyBehavior>
      <a className={styles.linkItem}>
          <Image
           priority={true}
            width={64}
            height={64}
            src="https://img.icons8.com/dusk/64/tip.png"
            alt="gastos"
          />
          <h3>Lista de Gastos</h3>
        </a>
      </Link>
      <Link href="/libroDeCuentas" legacyBehavior>
      <a className={styles.linkItem}>
      <Image
      priority={true}
      width={64} 
      height={64} 
      src="https://img.icons8.com/officel/80/general-ledger.png" 
      alt="general-ledger"/>
          <h3>Libro de Cuentas</h3>
        </a>
      </Link>
      </div>
    </div>   
    <h4 > © 2024 Giuliana Vazquez. Todos los derechos reservados.</h4>
    <a className={styles.derechos} href="https://icons8.com/icon/84717/venta-tienda-financiamiento-finanzas-pago-de-dinero-compras-10"></a> icon by <a href="https://icons8.com">Icons8</a>
 
    </main>
  );
}
