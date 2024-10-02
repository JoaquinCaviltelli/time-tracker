import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, Tooltip, Legend, ArcElement } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';



ChartJS.register(ArcElement, Tooltip, Legend, ChartDataLabels);

const Clock = ({ totalHours, goal, minutesRest}) => {
    
    const today = new Date();
    const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
    const currentDay = today.getDate();
    const daysPassed = currentDay;
    const daysRemaining = daysInMonth - daysPassed;

    const data = {
        datasets: [
            {
                // Primer anillo: Días
                data: [daysPassed, daysRemaining],
                backgroundColor: ['rgba(0, 123, 255, 0.6)', 'rgba(108, 117, 125, 0.6)'],
                borderColor: ['#fff', '#fff'],
                borderWidth: 2,
                cutout: '70%', // Tamaño del agujero para el segundo anillo
                label: 'Días',
            },
            {
                // Segundo anillo: Horas
                data: [totalHours, Math.max(goal - totalHours, 0)],
                backgroundColor: ['#4CAF50', 'rgba(108, 117, 125, 0.6)'],
                borderColor: ['#fff', '#fff'],
                borderWidth: 2,
                cutout: '70%', // Tamaño del agujero para el primer anillo
                label: 'Horas',
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
        cutout: '50%', // Tamaño del agujero central
        elements: {
            arc: {
                borderWidth: 2,
            },
        },
        animation: {
            duration: 2000,
            easing: 'easeOutQuart',
        },
    };

    return (
        <div className="relative p-6 rounded-lg flex flex-col w-96 h-96">

            {/* Gráfico de Donut */}
            <div className="flex items-center justify-center mb-4 relative">
                <div className="absolute inset-0 flex flex-col items-center justify-center cursor-pointer  rounded-full m-10">
                    <p  className="text-4xl font-bold text-gray-600 ">{totalHours}:{minutesRest}hs</p>
                    <p className="text-sm text-gray-500">{daysRemaining} días restantes</p>
                </div>
                <Doughnut data={data} options={chartOptions} />
            </div>
            
        </div>
    );
};

export default Clock;
