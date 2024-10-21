import { useContext, useState, useEffect } from "react";
import { HoursContext } from "../context/HoursContext";
import { useNavigate } from "react-router-dom";
import { Bar } from "react-chartjs-2";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../services/firebase";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";
import moment from "moment";
import ChartDataLabels from "chartjs-plugin-datalabels"; // Asegúrate de importar el plugin

ChartJS.register(
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  ChartDataLabels
);

const YearlySummary = () => {
  const { user } = useContext(HoursContext);
  const [monthlyHoursField, setMonthlyHoursField] = useState(Array(12).fill(0));
  const [monthlyHoursCredit, setMonthlyHoursCredit] = useState(
    Array(12).fill(0)
  );
  const [totalYearlyHours, setTotalYearlyHours] = useState(0);
  const [totalYearlyMinutes, setTotalYearlyMinutes] = useState(0); // Para los minutos restantes

  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      const startMonth = 8; // Septiembre
      const endMonth = 7; // Agosto
      const now = moment();
      const currentYear = now.year();
      const startYear =
        now.month() >= startMonth ? currentYear : currentYear - 1;
      const endYear = startYear + 1;

      const hoursRef = collection(db, "users", user.uid, "hours");
      onSnapshot(hoursRef, (snapshot) => {
        const hoursDataField = Array(12).fill(0);
        const hoursDataCredit = Array(12).fill(0);
        let totalHoursWorked = 0;
        let totalMinutesWorked = 0;

        snapshot.docs.forEach((doc) => {
          const { date, hoursWorked, minutesWorked, serviceType } = doc.data();
          const visitDate = moment(date);
          const year = visitDate.year();
          const month = visitDate.month();

          if (
            (year === startYear && month >= startMonth) ||
            (year === endYear && month <= endMonth)
          ) {
            const index = (month - startMonth + 12) % 12;

            // Sumar horas y minutos por separado según el tipo de servicio
            if (serviceType === "campo") {
              hoursDataField[index] += hoursWorked + minutesWorked / 60;
            } else if (serviceType === "credito") {
              hoursDataCredit[index] += hoursWorked + minutesWorked / 60;
            }

            totalHoursWorked += hoursWorked;
            totalMinutesWorked += minutesWorked;
          }
        });

        // Guardar los resultados totales
        setMonthlyHoursField(hoursDataField);
        setMonthlyHoursCredit(hoursDataCredit);

        // Aplicar el cálculo que mencionas
        const totalMinutes = totalMinutesWorked / 60;
        const hoursFromMinutes = Math.floor(totalMinutes);
        const minutesRest = Math.round((totalMinutes - hoursFromMinutes) * 60);
        const totalHours = totalHoursWorked + hoursFromMinutes;

        // Guardar el total
        setTotalYearlyHours(totalHours);
        setTotalYearlyMinutes(minutesRest);
      });
    }
  }, [user]);

  const data = {
    labels: [
      "Sep",
      "Oct",
      "Nov",
      "Dic",
      "Ene",
      "Feb",
      "Mar",
      "Abr",
      "May",
      "Jun",
      "Jul",
      "Ago",
    ],
    datasets: [
      {
        label: "Campo",
        data: monthlyHoursField,
        backgroundColor: "#4a7766", // Color para horas de campo
      },
      {
        label: "Crédito",
        data: monthlyHoursCredit,
        backgroundColor: "#aaaaaa", // Color para horas de crédito
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false, // Habilitar la leyenda para mostrar ambos tipos
      },
      tooltip: {
        enabled: true, // Habilitar tooltips
      },
      datalabels: {
        display: true,
        anchor: "end",
        align: "end",
        borderRadius: 4,
        color: "#666666",
        font: {
          size: 12,
          weight: "bold",
        },
        formatter: (value) => {
          return value > 0 ? value.toFixed(0) : null; // Mostrar solo si el valor es mayor que 0
        },
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
      },
      y: {
        grid: {
          display: true,
        },
        ticks: {
          display: false, // Mostrar ticks en el eje Y
        },
        beginAtZero: true, // Asegura que comience en 0
        suggestedMax:
          Math.max(...monthlyHoursField, ...monthlyHoursCredit) + 10, // Ajusta el máximo para dar espacio en la parte superior
      },
    },
  };


  return (
    <div className="container max-w-xl mx-auto p-6 pb-28">
      <div className="flex justify-between mt-16 mb-6 items-center">
        <h1 className="text-3xl font-extrabold text-acent">Resumen</h1>
      </div>
      <div className="bg-white mb-4">
        <div className="mb-4">
          <p className="text-sm font-bold text-one">
            Total:{" "}
            <span>
              {Math.round(totalYearlyHours)}:{totalYearlyMinutes}h
            </span>
          </p>
        </div>
        {totalYearlyHours > 0 ? (
          <Bar data={data} options={options} />
        ) : (
          <p className="text-gray-500">
            No se registraron horas en el año de servicio.
          </p>
        )}
      </div>
      <button
        onClick={() => navigate("/historial")}
        className="text-white bg-acent border rounded p-2 mt-4 w-full"
      >
        Volver atrás
      </button>
    </div>
  );
};

export default YearlySummary;
