import React from 'react';
import { useContext, useState, useEffect } from "react";

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
  const { user, goal } = useContext(HoursContext);
  const [monthlyHoursField, setMonthlyHoursField] = useState(Array(12).fill(0));
  const [monthlyHoursCredit, setMonthlyHoursCredit] = useState(Array(12).fill(0));
  const [computedHours, setComputedHours] = useState(Array(12).fill(0)); // Para horas computadas por mes
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
      const startYear = now.month() >= startMonth ? currentYear : currentYear - 1;
      const endYear = startYear + 1;

      const hoursRef = collection(db, "users", user.uid, "hours");
      onSnapshot(hoursRef, (snapshot) => {
        const hoursDataField = Array(12).fill(0);
        const hoursDataCredit = Array(12).fill(0);
        const computedHoursData = Array(12).fill(0);
        let yearlyHours = 0;

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
            } else if (serviceType === "credito") {
              hoursDataCredit[index] += hoursWorked + minutesWorked / 60;
            }
          }
        });

        for (let i = 0; i < 12; i++) {
          const monthlyFieldHours = hoursDataField[i];
          const monthlyCreditHours = hoursDataCredit[i];
          const monthlyTotal = monthlyFieldHours + monthlyCreditHours;

          if (monthlyTotal > goal + buffer) {
            computedHoursData[i] = monthlyFieldHours > goal + buffer
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
      });
    }
  }, [user]);

  const data = {
    labels: [
      "Sep", "Oct", "Nov", "Dic", "Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago"
    ],
    datasets: [
      {
        label: "Campo",
        data: monthlyHoursField,
        backgroundColor: "#4a7766",
      },
      {
        label: "Crédito",
        data: monthlyHoursCredit,
        backgroundColor: "#aaaaaa",
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
        anchor: "end",
        align: "end",
        borderRadius: 4,
        color: "#666666",
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
        suggestedMax: Math.max(...monthlyHoursField, ...monthlyHoursCredit) + 10,
      },
    },
  };

  return (
    <div className="container max-w-xl mx-auto p-6 pb-28">
      <div className="flex justify-between mt-16 mb-6 items-center">
        <h1 className="text-3xl font-extrabold text-acent">Resumen anual</h1>

        <button
          onClick={() => navigate("/historial")}
          className="text-white bg-acent border rounded p-2 flex items-center"
        >
          <span className="material-icons">arrow_left</span>
        </button>
      </div>
      <div className="bg-white mb-4">
        <div className="mb-4">
          <p className="text-sm font-bold text-one">
            Total: <span>{Math.round(totalYearlyHours)}h</span>
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
      
      {/* Tabla de horas por mes */}
      <button
        onClick={() => setShowTable(!showTable)} // Toggle para mostrar/ocultar tabla
        className="text-white bg-acent border rounded p-2 mt-4 w-full"
      >
        {showTable ? "Menos detalle" : "Mas detalle"}
      </button>

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
          ].map((month, index) => (
            <React.Fragment key={index}>
              <div>{month}</div>
              <div>{monthlyHoursField[index].toFixed(2)}</div>
              <div>{monthlyHoursCredit[index].toFixed(2)}</div>
              <div className="font-bold text-one">
                {computedHours[index].toFixed(2)}
              </div>
            </React.Fragment>
          ))}
        </div>
      )}
    </div>
  );
};

export default YearlySummary;
