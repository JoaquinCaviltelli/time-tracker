import React, { useContext, useState, useEffect } from "react";
import { HoursContext } from "../context/HoursContext";
import { useNavigate } from "react-router-dom";
import { Line } from "react-chartjs-2"; // Cambiado a Line
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../services/firebase";
import moment from "moment";
import {
  Chart as ChartJS,
  LineElement, // Importa el LineElement
  PointElement, // Importa el PointElement
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";

ChartJS.register(
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  ChartDataLabels
);

const YearlySummary = () => {
  const { user, goal } = useContext(HoursContext);
  const [monthlyHoursField, setMonthlyHoursField] = useState(Array(12).fill(0));
  const [monthlyHoursCredit, setMonthlyHoursCredit] = useState(
    Array(12).fill(0)
  );
  const [computedHours, setComputedHours] = useState(Array(12).fill(0));
  const [totalYearlyHours, setTotalYearlyHours] = useState(0);
  const [totalYearlyMinutes, setTotalYearlyMinutes] = useState(0);
  const [showTable, setShowTable] = useState(false);

  const navigate = useNavigate();
  const buffer = 5; // Buffer de +5 horas

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
        const computedHoursData = Array(12).fill(0);
        let yearlyHours = 0;
        let yearlyMinutes = 0; // Añadido para los minutos

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

            if (serviceType === "campo") {
              hoursDataField[index] += hoursWorked + minutesWorked / 60;
              yearlyMinutes += minutesWorked; // Sumar los minutos
            } else if (serviceType === "credito") {
              hoursDataCredit[index] += hoursWorked + minutesWorked / 60;
              yearlyMinutes += minutesWorked; // Sumar los minutos
            }
          }
        });

        for (let i = 0; i < 12; i++) {
          const monthlyFieldHours = hoursDataField[i];
          const monthlyCreditHours = hoursDataCredit[i];
          const monthlyTotal = monthlyFieldHours + monthlyCreditHours;

          if (monthlyTotal > goal + buffer) {
            computedHoursData[i] =
              monthlyFieldHours > goal + buffer
                ? monthlyFieldHours
                : goal + buffer;
            yearlyHours += computedHoursData[i];
          } else {
            computedHoursData[i] = monthlyTotal;
            yearlyHours += monthlyTotal;
          }
        }

        setMonthlyHoursField(hoursDataField);
        setMonthlyHoursCredit(hoursDataCredit);
        setComputedHours(computedHoursData);
        setTotalYearlyHours(yearlyHours);
        setTotalYearlyMinutes(yearlyMinutes); // Guardar los minutos totales
      });
    }
  }, [user]);

  // Filtrar valores mayores a 0 para mostrar en el gráfico
  const filteredMonthlyHoursField = monthlyHoursField.map((val) =>
    val > 0 ? val : null
  );
  const filteredMonthlyHoursCredit = monthlyHoursCredit.map((val) =>
    val > 0 ? val : null
  );

  // Calcular horas y minutos para mostrar
  const totalHoursFromMinutes = Math.floor(totalYearlyHours);
  const totalMinutesRest = Math.round(totalYearlyMinutes % 60);

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
        data: filteredMonthlyHoursField,
        borderColor: "#4a7766",
        backgroundColor: "rgba(74, 119, 102, 0.5)", // Color de fondo para los puntos
        pointBackgroundColor: "#4a7766", // Color del punto
        pointBorderColor: "#fff", // Color del borde del punto
        pointBorderWidth: 2, // Ancho del borde del punto
        pointRadius: 5, // Radio del punto
        fill: true, // Para llenar el área bajo la línea
        animation: {
          delay: (context) => {
            if (context.datasetIndex === 0) {
              return context.dataIndex * 300; // Retraso de 100ms por punto
            }
            return 0; // Sin retraso para otros datasets
          },
        },
      },
      {
        label: "Crédito",
        data: filteredMonthlyHoursCredit,
        borderColor: "#dddddd",
        pointBackgroundColor: "#bbbbbb",
        pointBorderColor: "#fff",
        pointBorderWidth: 2,
        pointRadius: 5,
        fill: true,
        animation: {
          delay: (context) => {
            if (context.datasetIndex === 1) {
              return context.dataIndex * 300; // Retraso de 100ms por punto
            }
            return 0; // Sin retraso para otros datasets
          },
        },
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { display: false },
      tooltip: { enabled: true },
      datalabels: {
        display: true,
        anchor: "center",
        align: "top",
        borderRadius: 4,
        color: "#bbb",
        font: { size: 12, weight: "bold" },
        formatter: (value) => (value > 0 ? value.toFixed(0) : null),
      },
    },
    scales: {
      x: { grid: { display: false } },
      y: {
        grid: { display: true },
        ticks: { display: false },
        beginAtZero: true,
        suggestedMax:
          Math.max(...monthlyHoursField, ...monthlyHoursCredit) + 10,
      },
    },
  };

  return (
    <div className="container max-w-lg mx-auto p-6 pb-28">
      <div className="flex justify-between mt-16 mb-6 items-center">
        <h1 className="text-3xl font-extrabold text-acent">Resumen</h1>

        <button
          onClick={() => navigate("/historial")}
          className="text-white bg-acent border rounded p-2 flex items-center"
        >
          <span className="material-icons">arrow_left</span>
        </button>
      </div>
      <div className="bg-white mb-4">
        <div onClick={() => setShowTable(!showTable)} className="bg-one mb-1 rounded-lg p-4 ">
          <p className="text-base font-medium text-light">Total anual</p>
          <p className="text-2xl font-bold text-light">
            {Math.round(totalYearlyHours)}h / {goal *12}h
          </p>
          <p className="text-xs font-light text-light">Ver detalle</p>
        </div>
        <p className="text-xs px-4 mb-4">El credito de horas se suma hasta {goal + buffer}h</p>

        {totalYearlyHours > 0 ? (
          <Line data={data} options={options} />
        ) : (
          <p className="text-gray-500">
            No se registraron horas en el año de servicio.
          </p>
        )}
      </div>

      {/* Tabla de horas por mes */}
      {/* <button
        onClick={() => setShowTable(!showTable)}
        className="text-white bg-acent border rounded p-2 mt-4 w-full"
      >
        {showTable ? "Ocultar detalle" : "Mostrar detalle"}
      </button> */}

      {/* Grid de resumen mensual */}
      {showTable && (
        <div className="grid grid-cols-4 gap-2 text-xs text-center mt-8 bg-white p-4 max-w-sm m-auto">
          <div className="font-bold">Mes</div>
          <div className="font-bold">Campo</div>
          <div className="font-bold">Crédito</div>
          <div className="font-bold">Total</div>

          {[
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
          ].map((month, index) => {
            const totalMinutesForMonth =
              (monthlyHoursField[index] + monthlyHoursCredit[index]) * 60; // Calcular minutos totales
            const minutesField = (monthlyHoursField[index] % 1) * 60; // Minutos de campo
            const minutesCredit = (monthlyHoursCredit[index] % 1) * 60; // Minutos de crédito
            const totalMinutes = Math.round(minutesField + minutesCredit); // Sumar los minutos de campo y crédito

            return (
              <React.Fragment key={index}>
                <div>{month}</div>
                <div>
                  {monthlyHoursField[index].toFixed(0)}:
                  {minutesField.toFixed(0)}
                </div>
                <div>
                  {monthlyHoursCredit[index].toFixed(0)}:
                  {minutesCredit.toFixed(0)}
                </div>
                <div className="font-bold text-one">
                  {computedHours[index].toFixed(0)}:{totalMinutes.toFixed(0)}
                </div>
              </React.Fragment>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default YearlySummary;
