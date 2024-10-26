import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, Tooltip, Legend, ArcElement } from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { useState, useEffect } from "react";

ChartJS.register(ArcElement, Tooltip, Legend, ChartDataLabels);

const LogoChart = () => {
  const getRandomValue = () => Math.floor(Math.random() * 10) + 1; // Valor aleatorio entre 1 y 10

  const [firstRingData, setFirstRingData] = useState([
    getRandomValue(),
    getRandomValue(),
  ]);
  const [secondRingData, setSecondRingData] = useState([
    getRandomValue(),
    getRandomValue(),
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      const randomDaysPassed = Math.floor(Math.random() * 10) + 1; // Valor aleatorio entre 1 y 10
      const randomDaysRemaining = Math.floor(Math.random() * 10) + 1; // Valor aleatorio entre 1 y 10
      const randomValue1 = Math.floor(Math.random() * 10) + 1; // Valor aleatorio entre 1 y 10
      const randomValue2 = Math.floor(Math.random() * 10) + 1; // Valor aleatorio entre 1 y 10

      setFirstRingData([randomDaysPassed, randomDaysRemaining]);
      setSecondRingData([randomValue1, randomValue2]);
    }, 4000);

    return () => clearInterval(interval); // Limpiar intervalo al desmontar el componente
  }, []);

  const data = {
    datasets: [
      {
        // Primer anillo: Días
        data: firstRingData,
        backgroundColor: ["#fff", "#80af9d"],
        borderColor: ["#4a7766", "#4a7766"],
        borderWidth: 4,
        cutout: "75%", // Tamaño del agujero para el segundo anillo
        label: "Días",
        animation: {
          duration: 2000,
          easing: "easeOutQuart",
        },
      },
      {
        // Segundo anillo: Horas
        data: secondRingData,
        backgroundColor: ["#fff", "#80af9d"],
        borderColor: ["#4a7766", "#4a7766"],
        borderWidth: 4,
        cutout: "75%", // Tamaño del agujero para el primer anillo
        label: "Horas",
        animation: {
          duration: 3000,
          easing: "easeOutQuart",
        },
      },
    ],
  };

  const chartOptions = {
    plugins: {
      tooltip: {
        enabled: false, // Deshabilitar tooltips
      },
      legend: {
        display: false, // Ocultar leyenda
      },
      datalabels: {
        display: false, // Desactivar el plugin de etiquetas de datos
      },
    },
    cutout: "50%", // Tamaño del agujero central
    elements: {
      arc: {
        borderWidth: 2,
      },
    },
  };

  return (
    <div className="flex items-center justify-center mb-4 relative">
                <div className="absolute inset-0 flex flex-col items-center justify-center cursor-pointer  rounded-full m-10">
                    
                    <img src="/src/assets/logoT.svg" className="w-14" alt="" />
                </div>
                
                <Doughnut
                  className="w-full max-w-60 m-auto"
                  data={data}
                  options={chartOptions}
                />
            </div>
            
  );
};

export default LogoChart;
