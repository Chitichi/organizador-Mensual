"use client"
import { useEffect } from 'react';
import '../styles/globals.css';

export default function RootLayout({ children }) {
  useEffect(() => {
    const existingScript = document.querySelector('script[src="https://cdn.voiceflow.com/widget/bundle.mjs"]');
    if (!existingScript) {
      
      const script = document.createElement('script');
      script.src = "https://cdn.voiceflow.com/widget/bundle.mjs";
      script.type = 'text/javascript';
      script.async = true;
      

      script.onload = function() {
        window.voiceflow.chat.load({
          verify: { projectID: process.env.NEXT_PUBLIC_MENSUAL_BOT_ID },
          url: 'https://general-runtime.voiceflow.com',
          versionID: 'development'
        });
      };

      const firstScriptTag = document.getElementsByTagName('script')[0];
      if (firstScriptTag) {
        firstScriptTag.parentNode.insertBefore(script, firstScriptTag);
      } else {
        document.head.appendChild(script);
      }
      return () => {
        script.onload = null; 
        if (firstScriptTag) {
          firstScriptTag.parentNode.removeChild(script);
        } else {
          document.head.removeChild(script);
        }
      };
    }
  }, []);

  return (
    <html lang="en">
      <body id="root">{children}</body>
    </html>
  );
}
