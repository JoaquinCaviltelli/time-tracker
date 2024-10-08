import { useEffect, useState } from 'react';


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
      }, 300); // Duración de la animación
      return () => clearTimeout(timer);
    }
  }, [loading]);

  if (!isVisible) return null;

  return (
    <div className={`flex flex-col pt-52 items-center h-full transition-opacity duration-300 z-50 absolute w-screen bg-one ${loading ? 'opacity-100' : 'opacity-0'}`}>
      <div className="loader border-8 border-t-8 border-light border-t-one rounded-full w-16 h-16 animate-spin"></div>
      
    </div>
  );
}

export default LoadingComponent;
