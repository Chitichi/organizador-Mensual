'use client';
import React, { useEffect } from 'react';

const MensualBot = () => {
  useEffect(() => {
    // Crear el script
    const script = document.createElement('script');
    script.src = "https://cdn.voiceflow.com/widget/bundle.mjs";
    script.type = "text/javascript";
    script.async = true;
    script.onload = function() {
      window.voiceflow.chat.load({
        verify: { 
        projectID: process.env.NEXT_PUBLIC_MENSUAL_BOT_ID },
        url: 'https://general-runtime.voiceflow.com',
        versionID: 'production'
      });
    };

    // Seleccionar el lugar para añadir el script
    const scriptContainer = document.head || document.body; // Prefiere el head, pero si no está disponible, usa el body

    // Añade el script
    scriptContainer.appendChild(script);

    // Función de limpieza
    return () => {
      scriptContainer.removeChild(script);
    };
  }, []);

  return <div>El chatbot se cargará aquí.</div>;
};

export default MensualBot;
