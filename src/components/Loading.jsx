import { useEffect, useState } from 'react';

function LoadingComponent({ loading }) {
  const [isVisible, setIsVisible] = useState(loading);

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
    <div className={`flex flex-col justify-center items-center h-screen transition-opacity duration-300 ${loading ? 'opacity-100' : 'opacity-0'}`}>
      <div className="loader border-8 border-t-8 border-gray-200 border-t-blue-500 rounded-full w-16 h-16 animate-spin"></div>
      
    </div>
  );
}

export default LoadingComponent;
