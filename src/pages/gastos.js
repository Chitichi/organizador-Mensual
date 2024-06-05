'use client';
import React from "react";
import Link from "next/link";
import Image from "next/image";
import styles from "../styles/gastos.module.css"

function gastos(){
    return (
        <div className={styles.container}>
          <h1>Lista de gastos Fijos/Variables</h1>
          <div className={styles.imagenes}>
         <Link href="/gastosFijos" legacyBehavior>
        <a className={styles.linkItem}>
          <Image
            priority={true}
            width={64}
            height={64}
            src="https://img.icons8.com/dusk/64/cash.png"
            alt="gastos-fijos"
          />
          <h3>Gastos Fijos</h3>
        </a>
      </Link>
      <Link href="/gastosVariables" legacyBehavior>
        <a className={styles.linkItem}>
          <Image
            priority={true}
            width={64}
            height={64}
            src="https://img.icons8.com/dusk/64/split-transaction.png" 
            alt="gastos-fijos"
          />
          <h3>Gastos Variables</h3>
        </a>
      </Link>
      </div>
        </div>
    )
} 
export default gastos