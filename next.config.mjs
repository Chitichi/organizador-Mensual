/** @type {import('next').NextConfig} */
const nextConfig = {

    images: {
        // Utiliza un objeto para definir los patrones remotos
        remotePatterns: [
          // Aquí defines los patrones remotos como objetos con la propiedad "hostname"
          { hostname: 'img.icons8.com' },
          // Puedes agregar más patrones remotos si es necesario
        ],
      },
};



export default nextConfig;
