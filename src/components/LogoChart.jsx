import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, Tooltip, Legend, ArcElement } from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";

ChartJS.register(ArcElement, Tooltip, Legend, ChartDataLabels);

const LogoChart = () => {
  const today = new Date();
  const daysInMonth = new Date(
    today.getFullYear(),
    today.getMonth() + 1,
    0
  ).getDate();
  const currentDay = today.getDate();
  const daysPassed = currentDay;
  const daysRemaining = daysInMonth - daysPassed + 1;

  const data = {
    datasets: [
      {
        // Primer anillo: Días
        data: [daysPassed, daysRemaining],
        backgroundColor: ["#fff", "#fff"],
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
        data: [daysPassed , daysRemaining],
        backgroundColor: ["#fff", "#fff"],
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
    <Doughnut
      className="w-full max-w-60 m-auto  "
      data={data}
      options={chartOptions}
    />
  );
};

export default LogoChart;
