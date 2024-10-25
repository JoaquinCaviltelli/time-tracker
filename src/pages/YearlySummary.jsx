import React, { useContext, useState, useEffect } from "react";
import { HoursContext } from "../context/HoursContext";
import { useNavigate } from "react-router-dom";
import { Bar } from "react-chartjs-2";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../services/firebase";
import moment from "moment";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";

ChartJS.register(
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  ChartDataLabels
);

const YearlySummary = () => {
  const { user, goal, range } = useContext(HoursContext);
  const [monthlyData, setMonthlyData] = useState({
    field: Array(12).fill(0),
    credit: Array(12).fill(0),
    computed: Array(12).fill(0),
  });
  const [totalYearly, setTotalYearly] = useState({ hours: 0, minutes: 0 });
  const [showTable, setShowTable] = useState(false);

  const navigate = useNavigate();
  const buffer = 5; // Buffer de +5 horas
  const months = [
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
  ];

  useEffect(() => {
    if (user) {
      const startMonth = 8,
        endMonth = 7,
        now = moment();
      const startYear = now.month() >= startMonth ? now.year() : now.year() - 1;
      const endYear = startYear + 1;

      const hoursRef = collection(db, "users", user.uid, "hours");
      onSnapshot(hoursRef, (snapshot) => {
        const fieldHours = Array(12).fill(0),
          creditHours = Array(12).fill(0),
          computedHours = Array(12).fill(0);
        let yearlyHours = 0,
          yearlyMinutes = 0;

        snapshot.docs.forEach((doc) => {
          const { date, hoursWorked, minutesWorked, serviceType } = doc.data();
          const visitDate = moment(date),
            year = visitDate.year(),
            month = visitDate.month();
          if (
            (year === startYear && month >= startMonth) ||
            (year === endYear && month <= endMonth)
          ) {
            const index = (month - startMonth + 12) % 12;
            const hours = hoursWorked + minutesWorked / 60;
            if (serviceType === "campo") {
              fieldHours[index] += hours;
            } else if (serviceType === "credito") {
              creditHours[index] += hours;
            }
            yearlyMinutes += minutesWorked;
          }
        });

        // Calcular horas computadas
        for (let i = 0; i < 12; i++) {
          const monthlyTotal = fieldHours[i];
          computedHours[i] =
            monthlyTotal > goal + buffer
              ? Math.max(monthlyTotal, goal + buffer)
              : monthlyTotal;
          yearlyHours += computedHours[i];
        }

        setMonthlyData({
          field: fieldHours,
          credit: creditHours,
          computed: computedHours,
        });
        setTotalYearly({ hours: yearlyHours, minutes: yearlyMinutes });
      });
    }
  }, [user]);

  const filteredFieldHours = monthlyData.field.map((val) =>
    val > 0 ? val : null
  );
  const maxHours = Math.max(...filteredFieldHours) || 0; // Máximo valor de horas
  const data = {
    labels: months,
    datasets: [
      {
        display:false,
        label: "Campo",
        data: filteredFieldHours, // Eliminar el label para ocultar el dataset
        backgroundColor: "rgba(74, 119, 102, 0.5)",
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      tooltip: { enabled: true },
      datalabels: {
        display: false,
        color: "#fff",
        font: { size: 12, weight: "bold" },
        formatter: (value) => (value > 0 ? value.toFixed(0) : null),
      },
    },
    scales: {
      x: { grid: { display: false } },
      y: { 
        grid: { display: true }, 
        beginAtZero: true, 
        ticks: { display: false }, // Ocultar valores del eje y
        max: maxHours + 5,// Añadir espacio por encima del valor más alto
      },
    },
  };

  return (
    <div className="container max-w-lg mx-auto p-6 pb-28">
      <div className="flex justify-between mt-16 mb-6 items-center">
        <h1 className="text-3xl font-extrabold text-acent">Resumen</h1>
        <button
          onClick={() => navigate("/historial")}
          className="text-white bg-one border rounded p-2 flex items-center"
        >
          <span className="material-icons">arrow_left</span>
        </button>
      </div>

      <div className="bg-white mb-4">
        <div className="bg-one mb-1 rounded-lg p-4">
          <p className="text-base font-medium text-light">Total anual</p>
          <p className="text-2xl font-bold text-light">
            {Math.round(totalYearly.hours)}h {range === "regular" && "/ 600h"}{" "}
            {range === "especial" && "/ 720h"}
          </p>
        </div>
        {/* <p className="text-xs px-4 mb-4">
          El crédito de horas se suma hasta {goal + buffer}h
        </p> */}

        {totalYearly.hours > 0 ? (
          <div style={{ height: '400px' }}> {/* Ajusta la altura aquí */}
            <Bar data={data} options={options} />
          </div>
        ) : (
          <p className="text-gray-500">
            No se registraron horas en el año de servicio.
          </p>
        )}
      </div>

      {showTable && (
        <div className="grid grid-cols-4 gap-2 text-xs text-center mt-8 bg-white p-4 max-w-sm m-auto">
          <div className="font-bold">Mes</div>
          <div className="font-bold">Campo</div>
          <div className="font-bold">Crédito</div>
          <div className="font-bold">Total</div>
          {months.map((month, index) => (
            <React.Fragment key={index}>
              <div>{month}</div>
              <div>{monthlyData.field[index].toFixed(0)}h</div>
              <div>{monthlyData.credit[index].toFixed(0)}h</div>
              <div className="font-bold text-one">
                {monthlyData.computed[index].toFixed(0)}h
              </div>
            </React.Fragment>
          ))}
        </div>
      )}
    </div>
  );
};

export default YearlySummary;
