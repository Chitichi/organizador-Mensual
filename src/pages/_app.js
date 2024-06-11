import '../styles/globals.css';
import { useEffect } from 'react';

function MyApp({ Component, pageProps }) {
  useEffect(() => {
    // Crear el script de Voiceflow
    const script = document.createElement('script');
    script.src = "https://cdn.voiceflow.com/widget/bundle.mjs";
    script.type = 'text/javascript';
    script.async = true;
    
    // Insertar el script en el documento
    script.onload = function() {
      window.voiceflow.chat.load({
        verify: { projectID: process.env.NEXT_PUBLIC_MENSUAL_BOT_ID },  // Asegúrate de reemplazar 'your_project_id' con el ID real de tu proyecto
        url: 'https://general-runtime.voiceflow.com',
        versionID: 'production'
      });
    };
    
    const firstScriptTag = document.getElementsByTagName('script')[0];
    if (firstScriptTag) {
      firstScriptTag.parentNode.insertBefore(script, firstScriptTag);
    } else {
      document.head.appendChild(script);
    }

    // Función de limpieza para eliminar el script del DOM cuando el componente se desmonte
    return () => {
      if (firstScriptTag) {
        firstScriptTag.parentNode.removeChild(script);
      } else {
        document.head.removeChild(script);
      }
    };
  }, []);

  return <Component {...pageProps} />
}

export default MyApp;
