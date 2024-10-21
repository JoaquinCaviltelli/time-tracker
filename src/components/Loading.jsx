import { useEffect, useState } from 'react';
import LogoChart from "/src/components/LogoChart.jsx"


function LoadingComponent({ loading }) {
  const [isVisible, setIsVisible] = useState(loading);

  useEffect(() => {
    // Cambiar el fondo del body al entrar en Home
    document.body.style.backgroundColor = "#4a7766"; // Cambia este color al que quieras

    // Limpiar el efecto al salir del componente
    return () => {
      document.body.style.backgroundColor = ""; // Restaura el color por defecto
    };
  }, []);

  useEffect(() => {
    if (loading) {
      setIsVisible(true);
    } else {
      const timer = setTimeout(() => {
        setIsVisible(false);
      }, 100); // Duración de la animación
      return () => clearTimeout(timer);
    }
  }, [loading]);

  if (!isVisible) return null;

  return (
    <div className={`pt-20 h-full transition-opacity duration-300 z-50 absolute  w-screen bg-one ${loading ? 'opacity-100' : 'opacity-0'}`}>
      <LogoChart />
      
    </div>
  );
}

export default LoadingComponent;
