'use client';
import React, { useEffect } from 'react';

const MensualBot = () => {
  useEffect(() => {
    // Crear el script solo si no existe ya
    let script = document.querySelector('script[src="https://cdn.voiceflow.com/widget/bundle.mjs"]');
    const shouldLoadScript = !script;

    if (shouldLoadScript) {
      script = document.createElement('script');
      script.src = "https://cdn.voiceflow.com/widget/bundle.mjs";
      script.type = "text/javascript";
      script.async = true;
      
      // Seleccionar el lugar para añadir el script
      const scriptContainer = document.body; // Prefiere el head, pero si no está disponible, usa el body
      scriptContainer.appendChild(script);

      script.onload = () => {
        window.voiceflow.chat.load({
          verify: { projectID: process.env.NEXT_PUBLIC_MENSUAL_BOT_ID },
          url: 'https://general-runtime.voiceflow.com',
          versionID: 'development'
        });
      };

      // Función de limpieza
      return () => {
        script.onload = null; // Limpia el manejador onload para evitar fugas de memoria
        scriptContainer.removeChild(script);
      };
    }

    // Si el script ya estaba cargado, simplemente inicializa el chatbot
    else if (window.voiceflow && window.voiceflow.chat) {
      window.voiceflow.chat.load({
        verify: { projectID: process.env.NEXT_PUBLIC_MENSUAL_BOT_ID },
        url: 'https://general-runtime.voiceflow.com',
        versionID: 'development'
      });
    }
  }, []);

  return <div>El chatbot se cargará aquí.</div>;
};

export default MensualBot;
