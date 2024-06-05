'use client';

import React from "react";
import LibroDeCuentas from "@/components/LibroDeCuentas";
import styles from '../styles/libroDeCuentas.module.css';

function libroDeCuentas() {
    return (
        <div className={styles.imagenFondo}>
        <LibroDeCuentas/>
        </div>
    )
}

export default libroDeCuentas;